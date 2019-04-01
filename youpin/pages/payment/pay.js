const app = getApp();
// pages/payment/pay.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        order: null,
        userinfo: null,
        paytype: 'shoporder',
        loaded: false,
        timer: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options['id'],
            paytype: options['paytype']
        })
        this.setTitle();
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
        this.clearTimer();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        this.clearTimer();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    clearTimer() {
        let _this = this;
        clearInterval(_this.data.timer);
    },

    /**
     * 用户点击右上角分享
     */
    init() {
        let _this = this
        if (app.userInfo) {
            this.getUser();
        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    getUser() {
        app.getData('/getCurrentUser', (res) => {
            this.setData({
                userinfo: res.data.data
            })
            this.getOrder();
        })
    },
    getOrder() {
        let _this = this;
        this.getOrangil();
        this.data.timer = setInterval(function() {
            _this.getOrangil();
        }, 5000);
    },
    getOrangil() {
        if (this.data.paytype == 'shoporder') {
            app.getData('/user/order/' + this.data.id, (res) => {
                this.setData({
                    order: res.data.data,
                    loaded:true
                })
            });
        } else {
            app.getData('/user/orderlist/' + this.data.id, (res) => {
                this.setData({
                    order: res.data.data,
                    loaded:true
                })
            });
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '支付中心'
        });
    },
    payAction() {
        let params = {
            id: this.data.id,
            paytype: this.data.paytype
        }
        app.postData('/payments/wechatpay/getPayment', params, (res) => {
            wx.requestPayment({
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.package,
                'signType': res.data.data.signType,
                'paySign': res.data.data.paySign,
                'success': function(res) {
                    wx.navigateTo({
                        url: '/pages/orders/order',
                    })
                },
                'fail': function(res) {
                    app.showMsg('取消支付');
                }
            });
        })
    }
})