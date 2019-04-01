// pages/users/user.js
const app = getApp();

Page({
    data: {
        evaluates: {},
    },
    onLoad: function (options) {
        wx.hideShareMenu();
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
        app.getData('/user/evaluates', (res) => {
            this.setData({
                evaluates: res.data.data,
                showPage: true
            })
        })
    }
})