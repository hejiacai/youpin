const app = getApp();

Page({
    data: {
        id: null,
        currentId: null,
        pullLoadingText: '释放刷新',
        showPage: false,
        navbar: [],
        floatButtonStyle: null,
        currentHeight: null,
        windowHeight: 0,
        currentIndex: 0,
        title: null,
        category: {},
        loadmoring: false
    },
    onLoad: function(options) {
        wx.hideShareMenu();
        this.setData({
            currentId: options['id']
        });
        this.getPageinfo();
        this.init();
    },

    onShow: function() {},

    onPullDownRefresh: function() {
        wx.setNavigationBarTitle({
            title: '加载中'
        });
        this.setData({
            pullLoadingText: '加载中'
        });
        this.getDatas(this.closeRefresh);
    },
    onReachBottom: function() {
        this.loadMore();
    },

    init() {
        let _this = this
        if (app.userInfo) {
            this.getTotal();
        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
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
        let _this = this
        wx.setNavigationBarTitle({
            title: this.data.title
        });
    },
    getTotal(cb) {
        let _this = this;
        app.getData('/writingmenu', (res) => {
            this.setData({
                navbar: res.data.data,
                showPage: true
            });
            res.data.data.forEach(function(data, index) {
                if (data.id == _this.data.currentId) {
                    _this.setData({
                        currentIndex: index,
                        title: _this.data.navbar[index].name
                    });
                    if (index == 0) {
                        _this.autoLoad();
                        _this.setTitle();
                    }
                }
            });
        });
    },
    getDatas(cb) {
        let index = this.data.currentIndex;

        let writingsData = 'navbar[' + index + '].extras.writings';
        let loaded = 'navbar[' + index + '].loaded';
        let nexturl = 'navbar[' + index + '].nextpageurl';
        this.setData({
            [writingsData]: [],
            [loaded]: false,
            [nexturl]: '',
            loadmoring: false
        });

        this.autoLoad();
        if (cb) {
            cb();
        }
    },
    loadMore() {
        let index = this.data.currentIndex;
        let url = this.data.navbar[index].nextpageurl;
        if (url) {
            this.setData({
                loadmoring: true
            });
            app.getData(url, (res) => {
                let writingsData = 'navbar[' + index + '].extras.writings';
                let nexturl = 'navbar[' + index + '].nextpageurl';
                this.setData({
                    [writingsData]: this.data.navbar[index].extras.writings.concat(res.data.data),
                    [nexturl]: res.data.links.next,
                    loadmoring: false
                });
                this.fixedHeight();
            });
        } else {
            this.fixNavbar();
            this.fixedHeight();
        }
    },
    fixNavbar() {
        var _this = this;
        var query = wx.createSelectorQuery()
        query.selectAll('.active').boundingClientRect()
        query.exec(function(res) {
            _this.setData({
                currentIndex: res[0][0].dataset.index,
                floatButtonStyle: 'left:' + (res[0][0].left + 20) + 'px;' + 'width:' + (res[0][0].width - 40) + 'px'
            })
        })
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
    },
    fixedHeight() {
        let _this = this;
        let currentid = this.data.currentId ? this.data.currentId : this.data.navbar[0].id;
        setTimeout(function() {
            var query = wx.createSelectorQuery();
            query.selectAll('.lists' + currentid).boundingClientRect()
            query.exec(function(res) {
                let height = res[0][0].height;
                let minHeight = _this.data.windowHeight - 46;
                if (height < minHeight) {
                    height = minHeight;
                }
                _this.setData({
                    currentHeight: height + 'px'
                })
            })
        }, 300);
    },
    swiperChange(e) {
        let id = this.data.navbar[e.detail.current].id
        let index = e.detail.current;
        this.setData({
            currentId: id,
            currentIndex: index,
            title: this.data.navbar[index].name
        });
        this.setTitle();
        this.autoLoad();
    },
    autoLoad() {
        let index = this.data.currentIndex;
        if (this.data.navbar[index].loaded) {
            this.loadMore();
        } else {
            this.loadData();
        }
    },
    loadData() {
        let id = this.data.currentId;
        let index = this.data.currentIndex;
        app.getData('/writingmenu/' + id + '/writings', (res) => {
            let writingsData = 'navbar[' + index + '].extras.writings';
            let loaded = 'navbar[' + index + '].loaded';
            let nexturl = 'navbar[' + index + '].nextpageurl';
            this.setData({
                [writingsData]: res.data.data,
                [loaded]: true,
                [nexturl]: res.data.links.next,
                loadmoring: false
            });
            this.fixNavbar();
            this.fixedHeight();
        })
    },
    changeSwiperIndex(e) {
        let id = e.target.dataset.id
        let index = e.target.dataset.index
        this.setData({
            currentId: id,
            currentIndex: index,
            title: this.data.navbar[index].name
        })
        this.setTitle();
    }
})