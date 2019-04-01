const app = getApp();

Page({
    data: {
        wechatuser: {},
        floatButtonStyle:'',
        categories:{},
        currentIndex:0,
        currentId:null,
        currentCategory:{},
        loaded:false
    },
    onLoad: function (options) {
        wx.hideShareMenu();
        if(options['id']) {
            this.setData({
                currentId:options['id']
            })
        }
        if (options['index']) {
            this.setData({
                currentIndex: options['index']
            })
        }
    },

    onShow: function () {
        this.init();   
    },

    init() {
        let _this = this
        if (app.userInfo) {
            this.setTitle();
            this.getCategories();
        } else {
            setTimeout(function () {
                _this.init();
            }, 200)
        }
    },
    setTitle() {
        wx.setNavigationBarTitle({
            title: '分类'
        });
    },
    getCategories(){
        app.getData('/menu',(res)=>{
            this.setData({
                categories:res.data.data,
            })
            
            if(!this.data.currentId) {
                this.setData({
                    currentId: res.data.data[0].id
                })                
            }
            this.getDatas();            
        });
    },
    switchCategory(e){
        let index = e.target.dataset.index;
        let id = e.target.dataset.id;
        this.setData({
            currentIndex: index,
            currentId:id
        })
        this.fixSwiper()
        this.data.loaded = false;
        this.getDatas()
    },
    fixSwiper(){
        let top = this.data.currentIndex * 86 + 26;
        this.setData({
            floatButtonStyle: 'top:' + top + 'rpx'
        })
        console.log(this.data.floatButtonStyle);
    },
    getDatas(){
        app.getData('/menu/' + this.data.currentId,(res)=>{
            this.setData({
                loaded:true,
                currentCategory:res.data.data
            })
        })
    }
})