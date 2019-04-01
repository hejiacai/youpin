// pages/appointments/lists.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navbar: ['全部', '待付款', '待发货', '待收货', '退换/售后', '已完成', '已失效'],
        showPage: false,
        pullLoadingText: '释放刷新',
        floatButtonStyle: '',
        swiperCurrent: 0,
        lists: null,
        pulling: false,
        currentHeight: null,
        finishedTypes: ['cancel', 'other', 'refused', 'finished', 'timeout'],
        waitTypes: ['created', 'payed', 'success'],
        windowHeight: 0,
        appointment_pay: 200,
        seletedIndex: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu();
        if (options['index']) {
            this.setData({
                seletedIndex: options['index']
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.init();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        wx.setNavigationBarTitle({
            title: '加载中'
        });
        this.setData({
            pullLoadingText: '加载中'
        });
        this.getList(this.closeRefresh);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    init() {
        this.getPageinfo();
        let _this = this;
        if (app.userInfo) {
            this.getList();
            this.setTitle();
        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    getPageinfo() {
        let _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    windowHeight: res.windowHeight
                });
            }
        })
    },
    closeRefresh() {
        let _this = this;
        this.setTitle();
        wx.stopPullDownRefresh();
        this.setData({
            pullLoadingText: '加载完成'
        });
        setTimeout(function() {
            _this.setData({
                pullLoadingText: '释放刷新'
            });
        }, 500);
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '我的订单'
        });
    },
    getList(cb) {
        let _this = this;
        app.getData('/user/orders', (res) => {
            _this.setData({
                lists: {
                    totalData: res.data.data,
                    serveringData: res.data.data.length ? (res.data.data.filter(function(list) {
                        return list.type == 'created';
                    })) : [],
                    payedData: res.data.data.length ? (res.data.data.filter(function(list) {
                        return list.type == 'payed' && list.trace_type == "created";
                    })) : [],
                    waitData: res.data.data.length ? (res.data.data.filter(function(list) {
                        return list.type == 'payed' && list.trace_type == "send";
                    })) : [],
                    backData: res.data.data.length ? (res.data.data.filter(function(list) {
                        return list.type == 'back' || list.type == 'backed' || list.type == 'traceback' || list.type == 'tracebacked';
                    })) : [],
                    finishedData: res.data.data.length ? (res.data.data.filter(function(list) {
                        return list.type == 'success' || list.type == 'complete' || list.type == 'backed';
                    })) : [],
                    failureData: res.data.data.length ? (res.data.data.filter(function(list) {
                        return list.type == 'cancel' || list.type == 'expired';
                    })) : []
                },
                showPage: true
            },()=>{
                if (cb) {
                    cb();
                }
                _this.fixedHeight();

                _this.autochange();
            })
            
        })
    },
    autochange() {
        if (this.data.seletedIndex) {
            this.setData({
                swiperCurrent: this.data.seletedIndex,
                seletedIndex: 0
            })
        }
    },
    swiperChange(e) {
        let the = this;
        this.setData({
            swiperCurrent: e.detail.current
        },()=>{
            this.fixedHeight();
        })
        
    },
    fixNavFooter() {
        let the = this;
        let query = wx.createSelectorQuery()
        query.selectAll('.swiper-botton').boundingClientRect()
        query.exec(function(res) {
            the.setData({
                floatButtonStyle: 'width:' + res[0][the.data.swiperCurrent].width + 'px;left:' + res[0][the.data.swiperCurrent].left + 'px;',
            })
        })
    },
    changeSwiperIndex: function(e) {
        this.setData({
            swiperCurrent: e.currentTarget.dataset.index
        },()=>{
            this.fixedHeight();
        })
    },
    payOrder(e) {
        let id = e.currentTarget.dataset.id;
        app.pay('shoporderlist', id);
    },
    fixedHeight() {
        let _this = this;
        let styleName;
        switch (this.data.swiperCurrent) {
            case 0:
                styleName = 'totalData';
                break;
            case 1:
                styleName = 'serveringData';
                break;
            case 2:
                styleName = 'payedData';
                break;
            case 3:
                styleName = 'waitData';
                break;
            case 4:
                styleName = 'backData';
                break;
            case 5:
                styleName = 'finishedData';
                break;
            case 6:
                styleName = 'failureData';
                break;
        }
        setTimeout(function() {
            let query = wx.createSelectorQuery();
            query.selectAll('.lists' + styleName).boundingClientRect()
            query.exec(function(res) {
                if (res) {
                    let height = res[0][0].height;
                    let minHeight = _this.data.windowHeight - 96;
                    if (height < minHeight) {
                        height = minHeight;
                    }
                    _this.setData({
                        currentHeight: height + 'px'
                    })
                }
            })
        }, 300);

    },
    clear(e) {
        let id = e.currentTarget.dataset.id;
        app.getData('/trade/' + id + '/clear', (res) => {
            app.showError('操作成功，请耐心等待');
            this.init();
        })
    },
    view(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/trade/view?id=' + id,
        })
    },
    cancelOrder(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '请确认',
            content: '是否要取消本订单？',
            confirmColor: '#cfa877',
            confirmText: '确定取消',
            cancelText: '考虑一下',
            success: function(res) {
                if (res.confirm) {
                    app.putData('/user/order/' + id + '/cancel', '', (res) => {
                        app.showMsg('订单已取消');
                        _this.getList();
                    });

                } else if (res.cancel) {}
            }
        })
    },
    traceOrder(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/orders/trace?id=' + id,
        })
    },
    traceback(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/orders/traceback?id=' + id,
        })
    },
    payBack(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '请确认',
            content: '您确定要申请退款吗？',
            confirmColor: '#cfa877',
            confirmText: '确认提交',
            cancelText: '考虑一下',
            success: function(res) {
                if (res.confirm) {
                    app.putData('/user/order/' + id + '/payBack', '', (res) => {
                        app.showMsg('已提交退款申请');
                        _this.getList();
                    });

                } else if (res.cancel) {}
            }
        })
    },
    receiving(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '请确认',
            content: '您确定已经收到货物并完好无损吗？',
            confirmColor: '#cfa877',
            confirmText: '确认收货',
            cancelText: '点错啦',
            success: function(res) {
                if (res.confirm) {
                    app.putData('/user/order/' + id + '/receiving', '', (res) => {
                        app.showMsg('操作成功！');
                        _this.getList();
                    });

                } else if (res.cancel) {}
            }
        })
    },
    evaluationOrder(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/orders/evaluate?id=' + id,
        })
    }
})