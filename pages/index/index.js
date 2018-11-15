//index.js
//获取应用实例
var app = getApp()
var hostname = 'https://www.aigeming.com'
//var hostname = 'http://39.105.169.87'
var addshopcar = require('../../utils/addshopcar.js');

var port = 1080
Page({
    data: {
        hideList: false,
        Homename: "选择小区",
        homeId: 0,
        homeKey:"",
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false, // loading
        userInfo: {},
        goodsInfoMap: {},
        shopCarInfo: {},
        shopNum:0,
        images: [],
        ids: [],
        fromid: 0,
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
    selectHome: function(e){
        console.log("select home:", e)
        var arg = e.currentTarget.dataset
        wx.navigateTo({
            //url: "/pages/home/index?homeid=" + arg.homeid + "&homename=" + arg.homename + "&key=" + arg.key
            url: "/pages/home/index"
        })
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
    onShow: function(e){
        var that = this
        console.log("onshow index")
        var homeinfo = wx.getStorageSync("homeinfo")
        if (!homeinfo) {
            console.log("user homeinfo is null")
            that.setData({
                hideList: true,
            })
            wx.navigateTo({
                url: "/pages/home/index"
            })
        }
        var homename = homeinfo.homename
        that.setData({
            Homename: homename,
        })
        var is = wx.getStorageSync("listflush")
        if (is == 1){
            this.requestListBanner()
            wx.removeStorageSync("listflush")
        }
    },
    onLoad: function(e) {
        console.log('onLoad:',e)
        wx.showShareMenu()
        var that = this
        that.setData({
            fromid: e.id
        })
        
        this.requestListBanner()

    },
    requestListBanner: function(){
        console.log("requestListBanner")
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
        // 获取购物车数据
        wx.getStorage({
            key: 'shopCarInfo',
            success: function (res) {
                that.setData({
                    shopCarInfo: res.data,
                    shopNum: res.data.shopNum
                });
            }
        })
        wx.request({
            url: hostname + '/banner?homeid=1&pid_db=1&brief_db=2&pid=1&detail_db=3',
            data: {
                key: 'mallName'
            },
            success: function (res) {
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
            fail: function () {
                console.log("request error")
            }
        })
        wx.request({
            url: hostname + '/img?images=category_all.txt',
            success: function (res) {
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
    addShopCar: function(e){
        var that = this
        var id = String(e.currentTarget.dataset.id)
        console.log("goods map:", this.data.goodsInfoMap)
        var tmpMap = this.data.goodsInfoMap        
        var info = tmpMap[id]
        var GoodsInfo = {
            goodsDetail: info,
            selectSizePrice: info.price,
            buyNumMax: info.stock,
            buyNumber: (info.buy > 0) ? 1 : 0,
            shopCarInfo: that.shopCarInfo,
            id: e.id,
        };
        addshopcar.addshopcar(GoodsInfo)
/*
        var nstr = wx.getStorageSync(id)
        var num = 0
        if (nstr) {
            num = parseInt(nstr)
        }
        console.log("add:", id, "; num:", num, "; nstr:", nstr)
        num = num + 1
        try {
            wx.setStorageSync(id, num)
        } catch (err) {console.log("err:", err) }
       
        wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
        })
         */
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
                var tmpMap = {}
                for (var i = 0; i < res.data.data.length; i++) {
                    goods.push(res.data.data[i]);
                    tmpMap[res.data.data[i].id] = res.data.data[i];
                }
                that.setData({
                    goods: goods,
                    goodsInfoMap: tmpMap,
                });
                
            }
        })
    }
})