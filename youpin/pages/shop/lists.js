const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        shops: {},
        nextpageurl:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init();        
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
        this.setTitle();
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
    onReachBottom:function(){
        this.loadMore();
    },
    init() {
        let _this = this
        if (app.userInfo) {
            this.getShops();
        } else {
            console.log('未登录');
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    getShops() {
        app.getData('/shops', (res) => {
            this.setData({
                shops: res.data.data,
                loading:false
            })
            this.computeNext(res.data);
        })
    },
    loadMore(){
        if (this.data.nextpageurl) {
            app.getData(this.data.nextpageurl, (res) => {
                this.setData({
                    shops: this.data.shops.concat(res.data.data)
                })
                this.computeNext(res.data);                
            })
        } else {
            console.log('没有啦');
        }
    },
    computeNext(data){
        if (data.links.next) {
            this.setData({
                nextpageurl: data.links.next
            })
        } else {
            this.setData({
                nextpageurl: ""
            })
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '店铺'
        });
    },
})