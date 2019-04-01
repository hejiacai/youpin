// pages/users/user.js
const app = getApp();

Page({
    data: {
        id: null,
        product: {},
    },
    onLoad: function (options) {
        wx.hideShareMenu();
        this.setData({
            id: options['id'],
        })
    },

    onShow: function () {
        this.init();
    },

    init() {
        let _this = this
        if (app.userInfo) {
            this.setTitle();
            this.getData();
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '商品评价'
        });
    },
    getData() {
        app.getData('/product/' + this.data.id, (res) => {
            this.setData({
                product: res.data.data,
                showPage: true
            })
        })
    }
})