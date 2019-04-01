const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    init() {
        let _this = this
        if (app.userInfo) {
            this.getUser();
            this.setTitle();
        } else {
            console.log('未登录');
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '会员中心'
        });
    },
    getUser() {
        app.getData('/getCurrentUser',(res)=>{
            this.setData({
                userinfo:res.data.data
            })
        })
    },
    bindGetUserInfo: function (e) {
        if (e.detail.iv) {
            this.syncData(e.detail.iv, e.detail.encryptedData);
        } else {
            app.showMsg('信息获取失败，无法登录');
        }
    },
    syncData(iv, encryptedData) {
        let parames = {
            'iv': iv,
            'encryptedData': encryptedData
        }
        let _this = this;
        app.postData('/setUserinfo', parames, (res) => {
            this.getUser();
        });
    },
    bevip(){
        app.bevip(app.getCurrentUrl());
    },
    address(){
        let callback = '/pages/users/index'
        app.addressChoosen(callback);
    },
    evaluate() {
        wx.navigateTo({
            url: '/pages/users/evaluate',
        })
    }
})