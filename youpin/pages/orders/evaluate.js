// pages/cart/cart.js
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        order_id: 0,
        order: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        this.setData({
            order_id: options['id'],
        })
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
        wx.setNavigationBarTitle({
            title: '评价'
        });
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
            this.getData();
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '物流信息'
        });
    },
    getData() {
        app.getData('/user/orderlist/' + this.data.order_id, (res) => {
            this.setData({
                order: res.data.data
            });
            console.log(this.data.order);
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
    computedTotalfee() {
        let currentTotalfee = 0;

        let vip = this.data.userInfo.valited;
        let price = 0;


        if (this.data.product.multiple_price) {
            if (vip) {
                price = this.data.sku.vip_price;
            } else {
                price = this.data.sku.price;
            }
        } else {
            if (vip) {
                price = this.data.product.vip_price;
            } else {
                price = this.data.product.price;
            }
        }
        currentTotalfee = price * this.data.amount;

        this.setData({
            'price': price,
            totalfee: currentTotalfee
        })

        console.log(this.data.product)
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
            _this.getAddress();
            _this.getData();
        })
    },
    makeOrder() {
        wx.navigateTo({
            url: '/pages/cart/makeorder',
        })
    },
    getAddress() {
        app.getData('/user/address', (res) => {
            this.setData({
                address: res.data.data
            })
        })
    },
    addressChoosen() {
        let callback = '/pages/orders/make?id=' + this.data.product_id + '&amount=' + this.data.amount + '&sku_id=' + this.data.sku_id
        app.addressChoosen(callback);
    },
    setOrder() {
        if (this.data.address) {
            let params = {
                product_id: this.data.product_id,
                sku_id: this.data.sku_id,
                amount: this.data.amount,
                address_id: this.data.address.id
            }
            app.postData('/user/createorder/', params, (res) => {
                app.pay(res.data.data.id);
            })
        } else {
            app.showMsg('请选择收件信息');
        }
    },
    formSubmit(e){
        app.putData('/user/order/evaluate/'+this.data.order.id,this.data.order,(res)=>{
            app.showMsg('感谢您的评价！');
            wx.navigateTo({
                url: '/pages/orders/order',
            });
        });
    },
    changeEvaluate(e) {
        let index = e.currentTarget.dataset.index;
        let data = e.currentTarget.dataset.data;
        let dataindex = 'order.extras.shopcarts[' + index + '].evaluate';
        this.setData({
            [dataindex]: data,
        });
    },
    changeContent(e) {
        let index = e.currentTarget.dataset.index;
        let content = e.detail.value;
        let dataindex = 'order.extras.shopcarts[' + index + '].content';
        this.setData({
            [dataindex]: content,
        });
    }
})