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
        address: {},
        product:{},
        product_id:0,
        amount:0,
        sku_id: 0,
        sku:{},
        price:0,
        note:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        this.setData({
            product_id: options['id'],
            amount: options['amount'],
        })

        if (options['sku_id']) {
            this.setData({
                sku_id: options['sku_id'],
            })
        }
        console.log(options)
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
        app.getData('/product/'+this.data.product_id, (res) => {
            this.setData({
                product: res.data.data
            });

            if (this.data.product.multiple_price) {
                app.getData('/product/'+this.data.product_id+'/skudata/'+this.data.sku_id,(res)=>{
                    this.setData({
                        sku:res.data.data
                    })
                    console.log(this.data.sku);
                    this.computedTotalfee();
                })
            } else {
                this.computedTotalfee();
            }
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
        let deliveryfee;


        if (this.data.product.multiple_price) {
            if (vip) {
                price = this.data.sku.vip_price;
            } else {
                price = this.data.sku.price;
            }
        } else {
            if(vip) {
                price = this.data.product.vip_price;
            } else {
                price = this.data.product.price;
            }
        }
        currentTotalfee = price*this.data.amount;

        if(this.data.product.multiple_price) {
            deliveryfee = this.data.sku.free_delivery ? 0 : (this.data.sku.delivery_way ? 0 : this.data.sku.delivery);
        } else {
            deliveryfee = this.data.product.free_delivery ? 0 : (this.data.product.delivery_way ? 0 : this.data.product.delivery);
        }
        let total = (currentTotalfee + deliveryfee).toFixed(2);
        price = price.toFixed(2);
        deliveryfee = deliveryfee.toFixed(2);
        currentTotalfee = currentTotalfee.toFixed(2);
        this.setData({
            'total': total,
            'price':price,
            'deliveryfee': deliveryfee,
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
        console.log('执行重新加载')
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
        let callback = '/pages/orders/make?id='+this.data.product_id+'&amount='+this.data.amount+'&sku_id='+this.data.sku_id        
        app.addressChoosen(callback);
    },
    setOrder() {
        if (this.data.address) {
            wx.showLoading({
                title: '加载中',
                mask:true
            });
            let params = {
                product_id: this.data.product_id,
                sku_id: this.data.sku_id,
                amount: this.data.amount,
                address_id: this.data.address.id,
                note:this.data.note,
            }
            app.postData('/user/createorder', params, (res) => {
                app.pay('shoporder',res.data.data.id);
                wx.hideLoading();
            })
        } else {
            app.showMsg('请选择收件信息');
        }
    },
    changeNote(e){
        let data = e.detail.value;
        console.log(data);
        this.setData({
            note : data
        })
    }
})