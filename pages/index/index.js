//index.js
//获取应用实例
var app = getApp()
var hostname = 'https://www.aigeming.com'
//var hostname = 'http://39.105.169.87'
var port = 1080
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false, // loading
        userInfo: {},
        images: [],
        ids: [],
        swiperCurrent: 0,
        selectCurrent: 0,
        categories: [],
        activeCategoryId: 0,
        goods: [],
        scrollTop: "0",
        loadingMoreHidden: true
    },

    tabClick: function(e) {
        this.setData({
            activeCategoryId: e.currentTarget.id
        });
        this.getGoodsList(this.data.activeCategoryId);
    },
    //事件处理函数
    swiperchange: function(e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    toDetailsTap: function(e) {
        console.log("shiqi:", e.currentTarget.dataset.id)
        wx.navigateTo({
            url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
        })
    },
    
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    bindTypeTap: function(e) {
        this.setData({
            selectCurrent: e.index
        })
    },
    scroll: function(e) {
        var that = this,
            scrollTop = that.data.scrollTop;
        that.setData({
            scrollTop: e.detail.scrollTop
        })
    },
    onLoad: function() {
        console.log('onLoad')
        var that = this
        wx.setNavigationBarTitle({
            title: wx.getStorageSync('mallName')
        })
        /*
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo
          })
        })
        */
        wx.request({
            url: hostname + '/banner?homeid=1&pid_db=1&brief_db=2&pid=1&detail_db=3',
            data: {
                key: 'mallName'
            },
            success: function(res) {
                var images = [];
                var ids = []
                for (var i = 0; i < res.data.data.length; i++) {
                    images.push(res.data.data[i].cover);
                    ids.push(res.data.data[i].id);
                }
                that.setData({
                    images: images,
                    ids: ids
                });
            },
            fail: function() {
                console.log("request error")
            }
        })
        wx.request({
            url: hostname + '/img?images=category_all.txt',
            success: function(res) {
                var categories = [{
                    id: 0,
                    name: "今日特价"
                }];
                for (var i = 0; i < res.data.data.length; i++) {
                    categories.push(res.data.data[i]);
                }
                that.setData({
                    categories: categories,
                    activeCategoryId: 0
                });
                that.getGoodsList(0);
            }
        })

    },
    getGoodsList: function(categoryId) {

        console.log(categoryId)
        var that = this;
        wx.request({
            url: hostname + '/list?homeid=1&pid_db=1&brief_db=2&pid=1&detail_db=3&categoryId=' + that.categoryId,
            data: {
                categoryId: categoryId
            },
            success: function(res) {
                that.setData({
                    goods: [],
                    loadingMoreHidden: true
                });
                var goods = [];
                if (res.data.code != 0 || res.data.data.length == 0) {
                    that.setData({
                        loadingMoreHidden: false,
                    });
                    return;
                }
                for (var i = 0; i < res.data.data.length; i++) {
                    console.log("brief:", res.data.data[i])
                    goods.push(res.data.data[i]);
                }
                that.setData({
                    goods: goods,
                });
            }
        })
    }
})