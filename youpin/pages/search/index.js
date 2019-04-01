//index.js
//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        keyword: null,
        products: [],
        shops: [],
        result:false,
        currentIndex:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

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
        this.setTitle();
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
    setKeyword(e) {
        let data = e.detail.value;
        this.setData({
            keyword: data
        });
    },
    init() {
        let _this = this
        if (app.userInfo) {

        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    search() {
        if (this.data.keyword && this.data.keyword.length) {
            this.gosearch();
        }
    },
    gosearch() {
        let params = {
            keyword: this.data.keyword
        }
        app.postData('/search', params, (res) => {
            this.setData({
                products: res.data.data.products,
                shops: res.data.data.shops,
                result:true
            })

            if(this.data.products.length) {
                this.setData({
                    currentIndex:0
                })
            } else {
                if (this.data.shops.length) {
                    this.setData({
                        currentIndex: 1
                    }) 
                }
            }
        })

    },
    formSubmit(e) {
        if (this.data.keyword && this.data.keyword.length) {
            this.gosearch();
        }
    },
    swiperChange(e) {
        let index = e.detail.current
        this.setData({
            currentIndex: index
        })
    },
    changeSwiper(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            currentIndex: index
        })
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '搜索'
        });
    },
})