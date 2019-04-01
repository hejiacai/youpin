//index.js
//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        channel:{},
        id:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options['id']) {
            this.setData({
                id: options['id']
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.init();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    init() {
        let _this = this
        if (app.userInfo) {
            this.getChannel()
            this.setData({
                loading: false
            })
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    getChannel() {
        app.getData('/channel/'+this.data.id, (res) => {
            this.setData({
                channel: res.data.data
            })
            this.setTitle(this.data.channel.name)
        })
    },
    setTitle(data) {
        wx.setNavigationBarTitle({
            title: data
        });
    },
})