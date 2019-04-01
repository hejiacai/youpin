//app.js
App({
    requestUrl: 'https://microapp.myhousing.cn/api/v2.0/miniapp',
    globalData: {},
    userInfo: null,
    accessToken: '',
    valited: false,
    setted: false,
    redirect_back_url: null,
    logining: false,
    onLaunch: function() {},
    onShow: function() {
        this.autoLogin();
    },
    autoLogin() {
        if (!this.logining) {
            console.log('登录中');
            let _this = this;
            this.logining = true;
            wx.getStorage({
                key: 'accessToken',
                success(res) {
                    console.log('缓存读取成功');
                    _this.checkSession(res.data);
                },
                fail(res) {
                    console.log('缓存读取失败');
                    _this.getToken();
                }
            })
        }
    },
    // 通过 code 获取 openid，重新登录
    getToken() {
        console.log('执行api登录');
        let _this = this;
        wx.login({
            success: res => {
                console.log('成功获取code');
                _this.login(res.code);
            },
            fail: res => {
                _this.showMsg('获取code失败');
                _this.getToken();
            }
        });
    },

    updateToken(token) {
        this.accessToken = token;
        this.getCurrentUser();
        console.log('登录完成');
    },

    setToken(token) {
        let _this = this;
        wx.setStorage({
            key: "accessToken",
            data: token,
            success(res) {
                _this.updateToken(token);
                console.log("token已写入本地缓存");
            },
            fail(res) {
                _this.updateToken(token);
                console.log("token写入失败");
            }
        })
    },

    //检查session
    checkSession(token) {
        let _this = this;
        wx.checkSession({
            success: function() {
                console.log('session验证通过');
                _this.updateToken(token);
            },
            fail: function() {
                console.log('session验证失败');                
                _this.getToken();
            }
        })
    },
    login(code) {
        console.log('执行登录');
        let _this = this;
        wx.request({
            url: _this.requestUrl + '/login',
            method: 'POST',
            header: {
                'Accept': 'application/json'
            },
            data: {
                'code': code
            },
            success: (response) => {
                console.log('api登录成功');
                if (response.statusCode == 200 || response.statusCode == 201) {
                    _this.accessToken = response.data.access_token;
                    _this.setToken(response.data.access_token);
                } else {
                    _this.printError(response);
                }
            },
            fail(response) {
                console.log('api登录失败');
                wx.showToast({
                    title: '登录失败',
                    icon: 'none',
                    duration: 2000
                });
                _this.getToken();
            },
            complete(response) {}
        })
    },
    // 更新userinfo
    getCurrentUser() {
        let _this = this
        this.getData('/getCurrentUser', (res) => {
            _this.userInfo = res.data.data
            _this.valited = res.data.data.valited
            _this.setted = res.data.data.setted
            _this.logining = false;
        })
    },
    redirectSetUserinfo(url) {
        this.redirect_back_url = url;
        wx.redirectTo({
            url: '/pages/auth/login',
        })
    },
    redirectSetVip(url) {
        this.redirect_back_url = url;
        wx.redirectTo({
            url: '/pages/auth/vip',
        })
    },
    // 请求封装
    postData(url, params, successData, original) {
        this.ajax('POST', url, params, successData, original);
    },
    putData(url, params, successData, original) {
        this.ajax('PUT', url, params, successData, original);
    },
    patchData(url, params, successData, original) {
        this.ajax('PATCH', url, params, successData, original);
    },
    deleteData(url, successData, original) {
        this.ajax('DELETE', url, null, successData, original);
    },
    getData(url, successData, original) {
        this.ajax('GET', url, null, successData, original);
    },
    ajax(requestType, url, params, callback, original) {
        let _this = this;
        let https = this.requestUrl;

        switch (requestType) {
            case "GET":
            case "DELETE":
                params = null
                break;
            case "POST":
            case "PUT":
            case "PATCH":

                break;
        }

        let headers = {
            'Accept': 'application/json',
        }

        if (_this.accessToken) {
            headers = {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + _this.accessToken,
            }
        }

        wx.showNavigationBarLoading();
        let computedUrl;
        let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if (reg.test(url)) {
            computedUrl = url;
        } else {
            computedUrl = https + url;
        }

        wx.request({
            url: computedUrl,
            method: requestType,
            header: headers,
            data: params,
            success: (res) => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    callback(res)
                } else {
                    if (res.statusCode == "401") {
                        _this.getToken();
                        setTimeout(function() {
                            _this.ajax(requestType, url, params, callback, original);
                        }, 1000);
                        _this.showMsg('登录过期，重新登录中，请稍候');
                    } else if (res.statusCode == "500") {
                        _this.showMsg('加载中，请稍候');
                        _this.autoLogin();
                        setTimeout(function () {
                            _this.ajax(requestType, url, params, callback, original);
                        }, 1000);
                    } else {
                        _this.printError(res);
                    }
                }
            },
            fail(res) {
                wx.showToast({
                    title: '网络请求失败',
                    icon: 'none',
                    duration: 2000
                });
                setTimeout(function () {
                    _this.ajax(requestType, url, params, callback, original);
                }, 2000);
            },
            complete(res) {
                wx.hideNavigationBarLoading()
            }
        });
    },
    printError(res) {
        let _this = this;
        let errMsg;
        switch (res.statusCode) {
            case 400:
                errMsg = '请求错误';
                break;
            case 401:
                errMsg = '登录过期，重新登录中...';
                break;
            case 403:
                errMsg = '拒绝访问';
                break;
            case 404:
                errMsg = '数据已被删除或接口不存在';
                break;
            case 405:
                errMsg = '请求方式出错';
                break;
            case 408:
                errMsg = '请求超时';
                break;
            case 422:
                errMsg = '';
                if (res.data.errors) {
                    let count = 1;
                    for (var i in res.data.errors) {
                        errMsg += count + '. ' + res.data.errors[i] + "\r\n";
                        count++;
                    };
                } else {
                    errMsg = res.data.message;
                }
                break;
            case 429:
                errMsg = '请求频率太高，请1分钟后再试';
                break;
            case 500:
                // _this.showMsg('通讯失败，请再试');
                // _this.autoLogin();
                return;
                break;
            case 501:
                errMsg = '服务未实现';
                break;
            case 502:
                errMsg = '网关错误';
                break;
            case 503:
                errMsg = '服务不可用';
                break;
            case 504:
                errMsg = '网关超时';
                break;
            case 505:
                errMsg = 'HTTP版本不受支持';
                break;
            default:
                errMsg = '未知错误';
                break;
        }
        wx.showModal({
            title: '操作失败',
            content: errMsg,
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#f96a5a',
            success: function(res) {
                if (res.confirm) {} else if (res.cancel) {}
            }
        })
    },
    // 封装结束
    showMsg(text) {
        wx.showToast({
            title: text,
            icon: 'none',
            duration: 2000
        })
    },
    bevip(url) {
        this.redirect_back_url = url;
        wx.navigateTo({
            url: '/pages/users/bevip',
        })
    },
    getCurrentUrl() {
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let url = currentPage.route
        return '/' + url;
    },
    addressChoosen(callback) {
        if (callback) {
            this.redirect_back_url = callback;
        } else {
            let returnurl = this.getCurrentUrl();
            this.redirect_back_url = returnurl;
        }
        wx.navigateTo({
            url: '/pages/users/addresses',
        })
    },
    pay(paytype, id) {
        wx.navigateTo({
            url: '/pages/payment/pay?id=' + id + '&paytype=' + paytype,
        })
    },
    goHome(text){
        let _this = this;
        wx.reLaunch({
            url: '/pages/index/index',
            complete(res) {
                setTimeout(function () {
                    _this.showMsg(text);
                }, 1000);
            },
        })
    }
})