// pages/cart/cart.js
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        shopcarts: {},
        selectedTotal: false,
        userInfo: {},
        totalfee: 0,
        deliveryfee: 0,
        total:0,
        address:{},
        note:null,
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
            this.updateUser();
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '购物车'
        });
    },
    getData() {
        app.getData('/shopcart/makeorder', (res) => {
            this.setData({
                shopcarts: res.data.data
            });

            this.computedSelectedTotal();
        });
    },
    selectAll() {
        app.getData('/shopcart/selectAll', (res) => {
            this.getData();
        })
    },
    unSelectAll() {
        app.getData('/shopcart/unselectAll', (res) => {
            this.getData();
        })
    },

    switchSelection(e) {
        let id = e.currentTarget.dataset.id;
        app.putData('/shopcart/switchSelection', {
            'id': id
        }, (res) => {
            this.getData();
        })
    },
    computedSelectedTotal() {
        let _this = this;
        let selected = true;
        this.data.shopcarts.forEach(function (item) {
            if (!item.selected) {
                selected = false
            }
        });
        this.setData({
            selectedTotal: selected
        })
        this.computedTotalfee();
    },
    computedTotalfee() {
        let currentTotalfee = 0;
        let currentDelivery = 0;
        let vip = this.data.userInfo.valited ? true : false
        this.data.shopcarts.forEach(function (item) {
            if (item.selected) {
                let price = 0;
                if (item.product_mirror.multiple_price) {
                    price = vip ? item.sku_mirror.vip_price : item.sku_mirror.price
                } else {
                    price = vip ? item.product_mirror.vip_price : item.product_mirror.price
                }
                let amount = item.amount;
                let fee = price * amount;
                currentTotalfee = currentTotalfee + fee;
                currentDelivery = currentDelivery + item.delivery;
            }
        });
        let total = (currentTotalfee + currentDelivery).toFixed(2);
        currentTotalfee = currentTotalfee.toFixed(2);
        currentDelivery = currentDelivery.toFixed(2);
        this.setData({
            'total': total,
            totalfee: currentTotalfee,
            deliveryfee:currentDelivery
        })
    },
    selectionSwitch() {
        if (this.data.selectedTotal) {
            this.unSelectAll();
        } else {
            this.selectAll();
        }
        this.computedSelectedTotal();
    },
    updateUser() {
        let _this = this;
        app.getData('/getCurrentUser', (res) => {
            app.userInfo = res.data.data
            app.valited = res.data.data.valited
            app.setted = res.data.data.setted
            _this.setData({
                userInfo: res.data.data
            });
            _this.getData();
            _this.getAddress();
        })
    },
    makeOrder() {
        wx.navigateTo({
            url: '/pages/cart/makeorder',
        })
    },
    getAddress() {
        app.getData('/user/address',(res)=>{
            this.setData({
                address:res.data.data
            })
        })
    },
    addressChoosen() {
        app.addressChoosen();
    },
    setOrder(){
        if(this.data.address) {
            let params = {
                address_id: this.data.address.id,
                note : this.data.note
            }
            app.postData('/user/setOrder',params,(res)=>{
                app.pay('shoporder',res.data.data.id);
            })
        } else {
            app.showMsg('请选择收件信息');
        }
    },
    changeNote(e) {
        let data = e.detail.value;
        this.setData({
            note: data
        })
    }
})