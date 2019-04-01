// pages/users/addresses.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        provinces: [],
        cities: [],
        districts: [],
        province:null,
        city:null,
        district:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
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
        this.init();
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
            title: '地址管理'
        });
    },
    getData() {
        app.getData('/location/provinces', (res) => {
            this.setData({
                provinces: res.data.data
            })
        })
    },
    getCities() {
        if(this.data.province) {
            let params = {
                'province': this.data.province
            }
            app.postData('/location/cities', params, (res) => {
                this.setData({
                    cities: res.data.data
                })
            })
        }
    },
    getDistricts(){
        if (this.data.city) {
            let params = {
                'city': this.data.city
            }
            app.postData('/location/districts', params, (res) => {
                this.setData({
                    districts: res.data.data
                })
            })
        }
    },
    bindPickerChange(e){
        let index = e.detail.value;
        this.setData({
            province:this.data.provinces[index].name,
            city:null,
            district:null
        })

        this.getCities();
    },
    bindCityChange(e) {
        let index = e.detail.value;
        this.setData({
            city: this.data.cities[index].name,
            district: null
        })

        this.getDistricts();
    },
    bindDistrictChange(e) {
        let index = e.detail.value;
        this.setData({
            district: this.data.districts[index].name,
        })
    },
    getAddress() {
        let _this = this;
        wx.chooseAddress({
            success: function (res) {
                app.postData('/user/address/insert', res, (data) => {
                    _this.getData();
                })
            }
        })
    },
    formSubmit(e) {
        let data = e.detail.value;
        
        if (!data.detailInfo) {
            app.showMsg('请填写详细地址');
            return;
        }
        if (!data.telNumber) {
            app.showMsg('请填写联系电话');
            return;
        }
        if (!this.data.district) {
            app.showMsg('请选择区/县');
            return;
        }
        if (!this.data.city) {
            app.showMsg('请选择城市');
            return;
        }
        if (!this.data.province) {
            app.showMsg('请选择省份');
            return;
        }
        if (!data.userName) {
            app.showMsg('请填写收货人姓名');
            return;
        }

        let params = {
            'userName': data.userName,
            'provinceName':this.data.province,
            'cityName':this.data.city,
            'countyName':this.data.district,
            'detailInfo': data.detailInfo,
            'telNumber': data.telNumber
        }

        app.postData('/user/address/insert', params , (res) => {
            app.showMsg('添加成功！');
            wx.navigateTo({
                url: '/pages/users/addresses',
            });
        });
    }
})