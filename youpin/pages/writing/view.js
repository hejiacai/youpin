//index.js
//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        writing: {},
        id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options['id']) {
            this.setData({
                id: options['id'],
            });
        } else if (options['scene']) {
            let scene = decodeURIComponent(options.scene);
            this.setData({
                id: scene,
            });
        } else {
            app.goHome('文章不存在或已删除，跳回至首页');
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
            this.getwriting()
            this.setData({
                loading: false
            })
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    getwriting() {
        app.getData('/writings/' + this.data.id, (res) => {
            this.setData({
                writing: res.data.data
            })
            this.setTitle(this.data.writing.name)
        })
    },
    setTitle(data) {
        wx.setNavigationBarTitle({
            title: '文章详情'
        });
    },
})