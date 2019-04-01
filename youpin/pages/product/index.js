// pages/users/user.js
const app = getApp();

Page({
    data: {
        id: null,
        userInfo: {},
        product: {},
        showPage: false,
        userDiscount: 10,
        currentAction: 'cart',
        addToCart: false,
        amount: 1,
        selections: [],
        disbaledSelections: [],
        currentSelection: null
    },
    onLoad: function(options) {
        wx.hideShareMenu();
        if (options['id']) {
            this.setData({
                id: options['id'],
            });
        } else if (options['scene']) {
            let scene = decodeURIComponent(options.scene);
            this.setData({
                id: scene,
            });
        } else {
            app.goHome('产品不存在或已删除，跳回至首页');
        }
    },

    onShow: function() {
        this.init();
    },
    init() {
        let _this = this
        if (app.userInfo) {
            if (this.data.id) {
                this.setTitle();
                this.updateUser();
            }
        } else {
            setTimeout(function() {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '商品详情'
        });
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
    getData() {
        app.getData('/product/' + this.data.id, (res) => {
            this.setData({
                product: res.data.data,
                showPage: true
            })

            if (this.data.product.multiple_price) {
                let selection = [];
                let datas = this.data.product.extras.specs

                for (let index in datas) {
                    let label = datas[index].label;
                    let indexx = 'selections.' + label
                    this.setData({
                        [indexx]: []
                    })
                }

                this.updateSku();
            }
        })
    },
    addCart() {

        this.setData({
            addToCart: true,
            currentAction: 'cart'
        });

    },
    closeAddToCart() {
        this.setData({
            addToCart: false
        })
    },
    minusAmount() {
        if (this.data.amount > 1) {
            let newAmount = this.data.amount - 1;
            this.updateAmount(newAmount);
        }
    },
    plusAmount() {
        if (this.data.amount) {
            let newAmount = this.data.amount * 1 + 1;
            this.updateAmount(newAmount);
        }
    },
    updateAmount(newAmount) {
        if (this.data.product.multiple_price) {
            if (this.data.currentSelection) {
                if (this.data.currentSelection && newAmount > this.data.currentSelection.stock) {
                    newAmount = this.data.currentSelection.stock
                    app.showMsg('已是最大库存');
                }

                this.setData({
                    amount: newAmount
                })
            } else {
                app.showMsg('请先选择规格');
            }
        } else {
            if (newAmount > this.data.product.stock) {
                newAmount = this.data.product.stock
                app.showMsg('已是最大库存');
            }
            this.setData({
                amount: newAmount
            })
        }
    },
    picked(e) {
        let label = e.target.dataset.label
        let selection = e.target.dataset.selection
        let id = e.target.dataset.id
        let labelid = e.target.dataset.labelid
        let disabled = e.target.dataset.disabled
        let index = 'selections.' + label

        if (!disabled) {
            this.setData({
                [index]: {
                    'selection': selection,
                    'id': id,
                    'labelid': labelid
                }
            })
            this.updateSku()
        }
    },
    updateSku() {
        let _this = this;
        if (this.data.product.multiple_price) {
            app.postData('/product/' + this.data.product.id + '/sku', {
                'selections': this.data.selections
            }, (res) => {
                this.setData({
                    disbaledSelections: res.data.data
                })

                let specdatas = this.data.product.extras.specs;

                specdatas.forEach(function(item) {
                    item.extras.selections.forEach(function(selection) {
                        if (_this.data.disbaledSelections.indexOf(selection.id) > -1) {
                            selection.disabled = true
                        } else {
                            selection.disabled = false
                        }
                    })
                })

                this.setData({
                    'product.extras.specs': specdatas
                });

            });

            app.postData('/product/' + this.data.product.id + '/getSku', {
                'selections': this.data.selections
            }, (res) => {
                if (res.data.data) {
                    this.setData({
                        currentSelection: res.data.data
                    })
                } else {
                    this.setData({
                        currentSelection: null
                    })
                }
            })
        }
    },
    addCartAction() {
        let params = {
            product_id: this.data.product.id,
            amount: this.data.amount
        };
        if (this.data.product.multiple_price) {
            if (this.data.currentSelection) {
                params.sku_id = this.data.currentSelection.id;
            } else {
                app.showMsg('请选择规格');
                return;
            }
        }

        app.postData('/addToCart', params, (res) => {
            this.closeAddToCart();
            app.showMsg('已加入购物车');
        })
    },
    goCart() {
        wx.reLaunch({
            url: '/pages/cart/cart',
        })
    },
    buy() {
        this.setData({
            addToCart: true,
            currentAction: 'buy'
        });
    },
    buyAction() {
        let product_id = this.data.product.id;
        let amount = this.data.amount;
        if (this.data.product.multiple_price) {
            if (this.data.currentSelection) {
                let sku_id = this.data.currentSelection.id;
                wx.navigateTo({
                    url: '/pages/orders/make?id=' + product_id + '&amount=' + amount + '&sku_id=' + sku_id,
                })
            } else {
                app.showMsg('请选择规格');
            }
        } else {
            wx.navigateTo({
                url: '/pages/orders/make?id=' + product_id + '&amount=' + amount,
            })
        }
    },
    goShop() {
        let shopurl = '/pages/shop/index?id=' + this.data.product.shop_id;
        wx.navigateTo({
            url: shopurl
        })
    },
    emptyStock() {

    },
    changeAmount(e) {
        let data = e.detail.value;
        if (data % 1 === 0) {
            if (data > 0) {
                this.updateAmount(data);
            }
        } else {
            app.showMsg('输入有误');
        }
    }
})