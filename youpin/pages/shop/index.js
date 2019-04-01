const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        shop:{},
        shopid:0,
        pageid:0,
        currentIndex: 0,
        indexpage: {},
        channels: {},
        banners: [
            {
                'id': 1,
                'url': 'http://tonghe-cms.oss-cn-shanghai.aliyuncs.com/image/png/9eefc2e356f98cbef7611812665f0e24phptq9pbQ.png'
            },
            {
                'id': 2,
                'url': 'http://tonghe-cms.oss-cn-shanghai.aliyuncs.com/image/jpeg/0bb6a8698e7485aaa5c6668f10840b49phpuaqUe4.jpg'
            },
            {
                'id': 3,
                'url': 'http://tonghe-cms.oss-cn-shanghai.aliyuncs.com/image/jpeg/b54245d7ccba2cc4a9a45b13f2797d46php1HbJNm.jpg'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options['currentIndex']) {
            this.setData({
                currentIndex: options['currentIndex']
            })
        }
        if (options['pageid']) {
            this.setData({
                pageid: options['pageid']
            })
        }
        if (options['id']) {
            this.setData({
                shopid: options['id'],
            });
        } else if (options['scene']) {
            let scene = decodeURIComponent(options.scene);
            this.setData({
                shopid: scene,
            });
        } else {
            app.goHome('店铺不存在或已删除，跳回至首页');
        }
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
            this.getShop()
            this.getIndex()
            this.getChannels()
            this.setData({
                loading: false
            })
        } else {
            console.log('未登录');
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    getIndex() {
        app.getData('/shop/'+this.data.shopid+'/index', (res) => {
            this.setData({
                indexpage: res.data.data
            })
        })
    },
    getChannels() {
        let _this = this;
        let currentPageid = this.data.pageid;
        let activeIndex = 0;
        app.getData('/shop/'+this.data.shopid+'/pages', (res) => {
            this.setData({
                channels: res.data.data
            })
            if (this.data.pageid && this.data.channels.length) {
                this.data.channels.forEach(function (item, index) {
                    if (item.id == currentPageid) {
                        activeIndex = index + 1;
                        console.log(activeIndex);
                    }
                })

                this.setData({
                    currentIndex: activeIndex
                })
                this.autoloadChannel();
            }
        })
    },
    changeSwiper(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            currentIndex: index
        })
        this.autoloadChannel();
    },
    swiperChange(e) {
        let index = e.detail.current
        this.setData({
            currentIndex: index
        })
        this.autoloadChannel();
    },
    autoloadChannel() {
        if (this.data.currentIndex) {
            //不是首页才执行
            let _this = this;
            let index = this.data.currentIndex - 1;
            let loaded = 'channels[' + index + '].loaded';
            let datas = 'channels[' + index + '].datas';
            let currentLoaded = this.data.channels[index].loaded;

            let channel = this.data.channels[index];

            if (!currentLoaded) {
                //没有加载过才执行
                app.getData('/shop/shoppage/' + channel.id, (res) => {
                    _this.setData({
                        [loaded]: true,
                        [datas]: res.data.data
                    })
                })
            }
        }
    },
    getShop(){
        app.getData('/shop/'+this.data.shopid,(res)=>{
            this.setData({
                shop:res.data.data
            })
        })
    },
    goCart() {
        wx.reLaunch({
            url: '/pages/cart/cart',
        })
    },
    goUsers(){
        wx.reLaunch({
            url: '/pages/users/index',
        })
    },
    gohome(){
        wx.reLaunch({
            url: '/pages/index/index',
        }) 
    }
})