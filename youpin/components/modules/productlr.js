// components/modules/productlr.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        productid:Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        product:{}
    },

    attached: function() {
        this.getData();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getData() {
            app.getData('/product/' + this.data.productid,(res)=>{
                this.setData({
                    product:res.data.data
                })
            })
        }
    }
})
