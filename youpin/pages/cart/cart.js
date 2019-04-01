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
        totalfee: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu();
    },

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
            this.updateUser();
            this.setTitle();
        } else {
            setTimeout(function() {
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
        app.getData('/shopcart', (res) => {
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
        this.data.shopcarts.forEach(function(item) {
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
        let vip = this.data.userInfo.valited ? true : false
        this.data.shopcarts.forEach(function(item) {
            if (item.selected) {
                let price = 0;
                if (item.product_mirror.multiple_price) {
                    price = vip ? item.sku_mirror.vip_price : item.sku_mirror.price
                } else {
                    price = vip ? item.product_mirror.vip_price : item.product_mirror.price
                }
                let amount = item.amount;
                let fee = price * amount + item.delivery;
                currentTotalfee = currentTotalfee + fee;
            }
        });

        this.setData({
            totalfee: currentTotalfee.toFixed(2)
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
        })
    },
    changeAmount(e) {
        let index = e.currentTarget.dataset.index;
        let id = this.data.shopcarts[index].id;
        let data = e.detail.value;
        if (data % 1 === 0) {
            if(data>0) {
                let params = {
                    'id':id,
                    amount : data
                }
                app.putData('/shopcart/changeAmount',params, (res) => {
                    this.getData();
                })
            }
        } else {
            app.showMsg('输入有误');
        }
    },
    minusAmount(e) {
        let index = e.currentTarget.dataset.index;
        let id = this.data.shopcarts[index].id;
        let amount = this.data.shopcarts[index].amount;
        if(amount>1) {
            app.putData('/shopcart/minusAmount', {
                'id': id
            }, (res) => {
                this.getData();
            })
        } else {
            this.deleteCart(id);
        }
    },
    plusAmount(e) {
        let index = e.currentTarget.dataset.index; 
        let id = this.data.shopcarts[index].id;
        let amount = this.data.shopcarts[index].amount;
        app.putData('/shopcart/plusAmount', {
            'id': id
        }, (res) => {
            this.getData();
        })
    },
    delete(e) {
        let id = e.currentTarget.dataset.id;
        this.deleteCart(id);
    },
    selectionRemove(e){
        let id = e.currentTarget.dataset.id;
        this.deleteCart(id);
    },
    deleteCart(id) {
        let _this =this;
        wx.showModal({
            title: '请确认',
            content: '是否要删除这个商品？',
            confirmColor: '#f96a5a',
            confirmText: '确定删除',
            cancelText: '考虑一下',
            success: function(res) {
                if (res.confirm) {
                    app.deleteData('/shopcart/delete/'+id , (res) => {
                        _this.getData();
                        app.showMsg('删除成功');
                    });

                } else if (res.cancel) {}
            }
        })
    },
    makeOrder(){
        wx.navigateTo({
            url: '/pages/cart/makeorder',
        })
    },
    goproduct(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/product/index?id='+id,
        })
    },
    selectionClear(e){
        let _this = this;
        wx.showModal({
            title: '请确认',
            content: '是否要清空购物车吗？',
            confirmColor: '#f96a5a',
            confirmText: '确定清空',
            cancelText: '考虑一下',
            success: function (res) {
                if (res.confirm) {
                    app.deleteData('/shopcart/clear', (res) => {
                        _this.getData();
                        app.showMsg('操作成功');
                    });
                } else if (res.cancel) { }
            }
        })
    }
})