// pages/users/addresses.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addresses:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu();
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
            this.setTitle();
            this.getData();
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '地址管理'
        });
    },
    getData(){
        app.getData('/user/addresses',(res)=>{
            this.setData({
                addresses:res.data.data
            })
        })
    },
    getAddress(){
        let _this = this;
        wx.chooseAddress({
            success: function (res) {
                app.postData('/user/address/insert',res,(data)=>{
                    _this.getData();
                })
            }
        })
    },
    addAddress(){
        wx.navigateTo({
            url: '/pages/users/addressCreate',
        })
    },
    select(e){
        let _this = this;
        let id = e.currentTarget.dataset.id;
        app.putData('/user/address/choose',{'id':id},(res)=>{
            wx.navigateTo({
                url: app.redirect_back_url,
            })
        })
    }
})