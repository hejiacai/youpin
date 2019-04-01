// components/modules/writing.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        article: Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad: function () {
            console.log(this.properties);
        }
    }
})
