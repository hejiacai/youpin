//index.js
//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading:true,
        currentIndex:0,
        indexpage: {},        
        channels:{},
        banners:[
            {
                'id':1,
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
    init(){
        let _this = this
        if (app.userInfo) {
            this.getIndex()
            this.getChannels()
            this.setData({
                loading:false
            })
        } else {
            console.log('未登录');
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    getIndex(){
        app.getData('/indexpage',(res)=>{
            this.setData({
                indexpage:res.data.data
            })
        })
    },
    getChannels(){
        app.getData('/channels',(res)=>{
            this.setData({
                channels:res.data.data
            })
        })
    },
    changeSwiper(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            currentIndex:index
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
    autoloadChannel(){
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
                app.getData('/channel/' + channel.id,(res)=>{
                    _this.setData({
                        [loaded]: true,
                        [datas]: res.data.data
                    })
                })
            }
        }
    }
})