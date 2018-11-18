//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var addshopcar = require('../../utils/addshopcar.js');

var hostname = 'https://www.aigeming.com'
Page({
    data: {
        autoplay: true,
        interval: 3000,
        duration: 1000,
        goodsDetail: {},
        swiperCurrent: 0,
        hasMoreSelect: false,
        selectSize: "选择：",
        selectSizePrice: 0,
        shopNum: 0,
        hideShopPopup: true,
        buyNumber: 0,
        buyNumMin: 0,
        buyNumMax: 0,
        id: 1,
        homePic:"images/nav/home-on.png",
        propertyChildIds: "",
        propertyChildNames: "",
        canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
        shopCarInfo: {}
    },

    //事件处理函数
    swiperchange: function(e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    onLaunch: function() {
        console.log("onlaunch....")
        wx.showShareMenu()

    },
    onShareAppMessage: function() {
        console.log("share.....",this.data.id)
        return {
            title: this.data.goodsDetail.title,
            //desc: '小区团购领导者',
            path: '/pages/goods-details/index?id=' + this.data.id
        }
    },
    onShow: function(){

    },
    onLoad: function(e) {
        console.log('goods detail onLoad:', e.id);
        var that = this;
        // 获取购物车数据
        wx.getStorage({
            key: 'shopCarInfo',
            success: function(res) {
                that.setData({
                    shopCarInfo: res.data,
                    shopNum: res.data.shopNum
                });
            }
        })
       
        wx.request({
            url: hostname + '/detail?homeid=1&pid_db=1&brief_db=2&detail_db=3',
            data: {
                pid: e.id
            },
            success: function(res) {
                /*var selectSizeTemp = "";//多选产品规格
                if (res.data.data.properties) {
                  for(var i=0;i<res.data.data.properties.length;i++){
                    selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
                  }
                  that.setData({
                    hasMoreSelect:true,
                    selectSize:that.data.selectSize + selectSizeTemp,
                    selectSizePrice:res.data.data.basicInfo.minPrice,
                  });
                }
                */
                that.setData({
                    goodsDetail: res.data,
                    selectSizePrice: res.data.price,
                    buyNumMax: res.data.stock,
                    buyNumber: (res.data.buy > 0) ? 1 : 0,
                    id: e.id,
                });
                WxParse.wxParse('article', 'html', res.data.content, that, 5);
            }
        })
    },
    bindGuiGeTap: function() {
        this.setData({
            hideShopPopup: false
        })
    },
    closePopupTap: function() {
        this.setData({
            hideShopPopup: true
        })
    },
    numJianTap: function() {
        if (this.data.buyNumber > this.data.buyNumMin) {
            var currentNum = this.data.buyNumber;
            currentNum--;
            this.setData({
                buyNumber: currentNum
            })
        }
    },
    numJiaTap: function() {
        if (this.data.buyNumber < this.data.buyNumMax) {
            var currentNum = this.data.buyNumber;
            currentNum++;
            this.setData({
                buyNumber: currentNum
            })
        }
    },
    labelItemTap: function(e) {
        var that = this;
        /*
        console.log(e)
        console.log(e.currentTarget.dataset.propertyid)
        console.log(e.currentTarget.dataset.propertyname)
        console.log(e.currentTarget.dataset.propertychildid)
        console.log(e.currentTarget.dataset.propertychildname)
        */
        // 取消该分类下的子栏目所有的选中状态
        var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
        for (var i = 0; i < childs.length; i++) {
            that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
        }
        // 设置当前选中状态
        that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
        // 获取所有的选中规格尺寸数据
        var needSelectNum = that.data.goodsDetail.properties.length;
        var curSelectNum = 0;
        var propertyChildIds = "";
        var propertyChildNames = "";
        for (var i = 0; i < that.data.goodsDetail.properties.length; i++) {
            childs = that.data.goodsDetail.properties[i].childsCurGoods;
            for (var j = 0; j < childs.length; j++) {
                if (childs[j].active) {
                    curSelectNum++;
                    propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":" + childs[j].id + ",";
                    propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":" + childs[j].name + "  ";
                }
            }
        }
        var canSubmit = false;
        if (needSelectNum == curSelectNum) {
            canSubmit = true;
        }
        // 计算当前价格
        if (canSubmit) {
            wx.request({
                url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/price',
                data: {
                    goodsId: that.data.goodsDetail.basicInfo.id,
                    propertyChildIds: propertyChildIds
                },
                success: function(res) {
                    that.setData({
                        selectSizePrice: res.price,
                        propertyChildIds: propertyChildIds,
                        propertyChildNames: propertyChildNames,
                        buyNumMax: res.stock,
                        buyNumber: (res.buy > 0) ? 1 : 0
                    });
                }
            })
        }


        this.setData({
            goodsDetail: that.data.goodsDetail,
            canSubmit: canSubmit
        })
    },
    addShopCar: function(){
        addshopcar.addshopcar(this.data)
    },
    goShopCar: function() {
        wx.reLaunch({
            url: "/pages/shop-cart/index"
        });
    },
    tobuy: function() {
        if (this.data.goodsDetail.properties && !this.data.canSubmit) {
            this.bindGuiGeTap();
            return;
        }
        if (this.data.buyNumber < 1) {
            wx.showModal({
                title: '提示',
                content: '暂时缺货哦~',
                showCancel: false
            })
            return;
        }
        shopCarInfo = addshopcar.addshopcar(this.data);
        setData({
            shopCarInfo: shopCarInfo,
            shopNum: shopCarInfo.shopNum
        });
        this.goShopCar();
    }
})