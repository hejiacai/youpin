const app = getApp();

Page({
    data: {
        id: null,
        currentId: null,
        pullLoadingText: '释放刷新',
        showPage: false,
        navbar: [],
        currentIndex: 0,
        title: null,
        lock:false
    },
    onLoad: function(options) {
        wx.hideShareMenu();
        this.setData({
            id: options['id']
        });
        if (options['currentId']) {
            this.setData({
                currentId: options['currentId']
            })
        };
        this.init();
    },

    onShow: function() {},

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
    setTitle() {
        let _this = this
        wx.setNavigationBarTitle({
            title: this.data.title
        });
    },
    getTotal() {
        app.getData('/shop/' + this.data.id + '/products/total', (res) => {
            this.setData({
                navbar: [{
                    id: 0,
                    name: "所有产品",
                    extras: {
                        products: res.data.data
                    },
                    loaded: true,
                    nextpageurl: res.data.links.next
                }]
            }, () => {
                this.getDatas();
            })
        })
    },
    getDatas(cb) {
        app.getData('/shop/' + this.data.id + '/menus/withoutproducts', (res) => {
            this.setData({
                navbar: this.data.navbar.concat(res.data.data),
                title: "所有产品",
                currentId: 0,
                showPage: true
            }, () => {
                this.setTitle();
                if (cb) {
                    cb();
                }
            })
        });
    },
    loadMore() {
        let index = this.data.currentIndex;
        let url = this.data.navbar[index].nextpageurl;
        if(this.data.lock) {
        } else {
            if (url) {
                this.setData({
                    lock: true
                })
                app.getData(url, (res) => {
                    let productsData = 'navbar[' + index + '].extras.products';
                    let nexturl = 'navbar[' + index + '].nextpageurl';
                    this.setData({
                        [productsData]: this.data.navbar[index].extras.products.concat(res.data.data),
                        [nexturl]: res.data.links.next,
                        lock:false
                    });
                });
            }
        }
    },
    autoLoad() {
        let index = this.data.currentIndex;
        if (!this.data.navbar[index].loaded) {
            this.loadData();
        }
    },
    loadData() {
        let id = this.data.currentId;
        let index = this.data.currentIndex;
        app.getData('/shop/menus/' + id + '/products', (res) => {
            let productsData = 'navbar[' + index + '].extras.products';
            let loaded = 'navbar[' + index + '].loaded';
            let nexturl = 'navbar[' + index + '].nextpageurl';
            this.setData({
                [productsData]: res.data.data,
                [loaded]: true,
                [nexturl]: res.data.links.next
            });
        })
    },
    changeSwiperIndex(e) {
        let id = e.target.dataset.id
        let index = e.target.dataset.index
        this.setData({
            currentId: id,
            currentIndex: index,
            title: this.data.navbar[index].name
        }, () => {
            this.setTitle();
            this.autoLoad();            
        })
    },
    swiperChange(e) {
        if (e.detail.source == 'touch') {
            let id = this.data.navbar[e.detail.current].id
            let index = e.detail.current;
            this.setData({
                currentId: id,
                currentIndex: index,
                title: this.data.navbar[index].name
            }, () => {
                this.setTitle();
                this.autoLoad();
            });
        }
    }
})