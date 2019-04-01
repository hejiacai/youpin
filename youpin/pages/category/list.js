const app = getApp();

Page({
    data: {
        id: null,
        currentId: null,
        pullLoadingText: '释放刷新',
        showPage: false,
        navbar: null,
        floatButtonStyle: null,
        currentHeight: null,
        windowHeight: 0,
        currentIndex: 0,
        title: null,
        category: {}
    },
    onLoad: function(options) {
        wx.hideShareMenu();
        this.setData({
            id: options['id'],
            currentId: options['currentId'],
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
            this.getDatas();
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
    getDatas(cb) {
        let _this = this;
        app.getData('/menu/' + this.data.id, (res) => {
            _this.setData({
                navbar: res.data.data.children,
                title: res.data.data.name,
                showPage: true
            })

            res.data.data.children.forEach(function(item, index) {
                if (item.id == _this.data.currentId) {
                    _this.setData({
                        currentIndex: index
                    })
                }
            });
            this.autoLoad();
            this.fixedHeight();
            if (cb) {
                cb();
            }

        });
    },
    autoLoad() {
        let index = this.data.currentIndex;
        this.setData({
            title: this.data.navbar[index].name
        });
        this.setTitle();
        if (this.data.navbar[index].loaded) {
            this.loadMore();
        } else {
            this.loadData();
        }
    },
    loadData() {
        let id = this.data.currentId;
        let index = this.data.currentIndex;
        app.getData('/menu/' + id + '/products', (res) => {
            let productsData = 'navbar[' + index + '].extras.products';
            let loaded = 'navbar[' + index + '].loaded';
            let nexturl = 'navbar[' + index + '].nextpageurl';
            this.setData({
                [productsData]: res.data.data,
                [loaded]: true,
                [nexturl]: res.data.links.next,
                loadmoring: false
            });
            this.fixedHeight();
        });
    },
    loadMore() {
        let index = this.data.currentIndex;
        let url = this.data.navbar[index].nextpageurl;
        if (url) {
            this.setData({
                loadmoring: true
            });
            app.getData(url, (res) => {
                let productsData = 'navbar[' + index + '].extras.products';
                let nexturl = 'navbar[' + index + '].nextpageurl';
                this.setData({
                    [productsData]: this.data.navbar[index].extras.products.concat(res.data.data),
                    [nexturl]: res.data.links.next,
                    loadmoring: false
                });
                this.fixedHeight();
            });
        } else {
            this.fixedHeight();
        }
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
        setTimeout(function() {
            var query = wx.createSelectorQuery();
            query.selectAll('.lists' + _this.data.currentId).boundingClientRect()
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
        }, 300)
    },
    swiperChange(e) {
        if (e.detail.source == 'touch') {
            let id = this.data.navbar[e.detail.current].id
            let index = e.detail.current;
            this.setData({
                currentId: id,
                currentIndex: index
            })
            this.autoLoad();
        }
    },
    changeSwiperIndex(e) {
        let id = e.target.dataset.id
        let index = e.target.dataset.index
        this.setData({
            currentId: id,
            currentIndex: index
        });
        this.autoLoad();
    }
})