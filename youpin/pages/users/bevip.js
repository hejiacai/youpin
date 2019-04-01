// pages/users/bevip.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: {},
        name: ""
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    init() {
        let _this = this
        if (app.userInfo) {
            this.getUser();
        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    getUser() {
        app.getData('/getCurrentUser', (res) => {
            this.setData({
                userinfo: res.data.data
            });
            if (res.data.data.name) {
                this.setData({
                    name: res.data.data.name
                })
            }
        })
    },
    formSubmit: function(e) {
        let data = e.detail.value;
        if (data.name && this.data.userinfo.phone) {
            let params = {
                'name': data.name
            }
            app.postData('/bevip', params, (res) => {
                app.showMsg('注册成功！');
                this.goback();
            });
        } else {
            if (!data.name) {
                app.showMsg('请填写真实姓名');
            }
            if (!this.data.userinfo.phone) {
                app.showMsg('请设置手机号码');
            }
        }
    },
    formReset: function() {
        console.log('form发生了reset事件')
    },
    getPhoneNumber: function(e) {
        let _this = this;
        let params = {
            'iv': e.detail.iv,
            'encryptedData': e.detail.encryptedData,
        }

        app.postData('/getPhoneNumber', params, (res) => {
            let phone = "userinfo.phone";
            _this.setData({
                [phone]: res.data.data
            })
        });
    },
    goback() {
        let goUrl = app.redirect_back_url;
        if (goUrl == '/pages/users/index') {
            wx.reLaunch({
                url: goUrl
            })
        } else {
            wx.navigateBack();
        }
    },
    setName(e) {
        this.setData({
            'name': e.detail.value
        })
    }
})