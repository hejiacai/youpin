// pages/appointments/lists.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navbar: [],
        showPage: false,
        pullLoadingText: '释放刷新',
        floatButtonStyle: '',
        swiperCurrent: 0,
        lists: [{
                name: '优品推荐',
                data: {},
                loaded: false,
                nextpageurl: ''
            },
            {
                name: '好店推荐',
                data: {},
                loaded: false,
                nextpageurl: ''
            }
        ],
        writingmenus: {},
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
        this.init();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

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
        this.reload(this.closeRefresh);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.loadMore();
        console.log('loadmore');
    },
    init() {
        let _this = this;
        if (app.userInfo) {
            this.getPageinfo();
            this.setTitle();
        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    reload(cb) {
        this.setData({
            lists: [{
                    name: '优品推荐',
                    data: {},
                    loaded: false,
                    nextpageurl: ''
                },
                {
                    name: '好店推荐',
                    data: {},
                    loaded: false,
                    nextpageurl: ''
                }
            ],
        },()=>{
            this.getPageinfo();
            if (cb) {
                cb();
            }
        });
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
        _this.getDatas();        
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
            title: '优品头条'
        });
    },
    getDatas() {
        if (this.data.swiperCurrent == 0) {
            if (!this.data.lists[0].loaded) {
                this.getWritingmenu();
            }
        } else {
            if (!this.data.lists[1].loaded) {
                this.getShop();
            }
        }
    },
    getShop() {
        let _this = this;
        app.getData('/shops', (res) => {
            let loaded = 'lists[1].loaded';
            let datas = 'lists[1].data';
            let nextpageurl = 'lists[1].nextpageurl';
            _this.setData({
                [loaded]: true,
                [datas]: res.data.data,
                [nextpageurl]: res.data.links.next
            });
            _this.fixedHeight();
        })
    },
    loadMore() {
        if (this.data.swiperCurrent == 0) {
            this.loadMoreWriting();
        } else {
            this.loadMoreShop();
        }
    },
    getWritingmenu() {
        app.getData('/writingmenu', (res) => {
            this.setData({
                writingmenus: res.data.data,
                showPage: true
            });
            this.getWritings();
            console.log(this.data.showPage);
        })
    },
    getWritings() {
        let _this = this;
        app.getData('/writings', (res) => {
            let loaded = 'lists[0].loaded';
            let datas = 'lists[0].data';
            let nextpageurl = 'lists[0].nextpageurl';
            _this.setData({
                [loaded]: true,
                [datas]: res.data.data,
                [nextpageurl]: res.data.links.next
            });
            _this.fixedHeight();
        });
    },
    loadMoreWriting() {
        let _this = this;
        let url = this.data.lists[0].nextpageurl;
        if (url) {
            app.getData(url, (res) => {
                let datas = 'lists[0].data';
                let nextpageurl = 'lists[0].nextpageurl';
                _this.setData({
                    [datas]: this.data.lists[0].data.concat(res.data.data),
                    [nextpageurl]: res.data.links.next
                });
                _this.fixedHeight();
            });
        };
    },
    loadMoreShop() {
        let _this = this;
        let url = this.data.lists[1].nextpageurl;
        console.log(url);
        if (url) {
            app.getData(url, (res) => {
                let datas = 'lists[1].data';
                let nextpageurl = 'lists[1].nextpageurl';
                _this.setData({
                    [datas]: this.data.lists[1].data.concat(res.data.data),
                    [nextpageurl]: res.data.links.next
                });
                _this.fixedHeight();
            });
        };
    },
    swiperChange(e) {
        var the = this;
        this.setData({
            swiperCurrent: e.detail.current
        })
        this.fixedHeight();
        this.getDatas();
    },
    fixNavFooter() {
        var the = this;
        var query = wx.createSelectorQuery()
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
        })
    },
    fixedHeight() {
        let _this = this;
        setTimeout(function() {
            var query = wx.createSelectorQuery();
            query.selectAll('.lists' + _this.data.swiperCurrent).boundingClientRect()
            query.exec(function(res) {
                let height = res[0][0].height;
                let minHeight = _this.data.windowHeight - 80;
                if (height < minHeight) {
                    height = minHeight;
                }
                _this.setData({
                    currentHeight: height + 'px'
                })
            })
        }, 300)
    },
    view(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/trade/view?id=' + id,
        })
    },
    switchnav(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            swiperCurrent: index
        })
        console.log("点击了");
    }
})