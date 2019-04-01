// components/modules/shop.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shopid: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        shop:{}
    },
    attached: function () {
        this.getData();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getData() {
            app.getData('/shop/' + this.data.shopid, (res) => {
                this.setData({
                    shop: res.data.data
                })
            })
        }
    }
})
