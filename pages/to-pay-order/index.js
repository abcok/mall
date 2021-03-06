//index.js
//获取应用实例
var wxpay = require('../../utils/pay.js')
var app = getApp()

Page({
    data: {
        mallName: wx.getStorageSync('mallName'),
        goodsList: [],
        isNeedLogistics: 0, // 是否需要物流信息
        allGoodsPrice: 0,
        fare: 0,
        reduce_amount:0,
        sendToRoom: false,
        goodsJsonStr: "",
        roomid: "例如：4号楼1单元602 或 4-1-602",
        phone: "手机号",
        username: "姓名",
        fare_coupon_info:""
    },
    onShow: function() {
        this.initShippingAddress();
        var username = wx.getStorageSync("username")
        if (username){
            this.setData({
                username: username,
            })
        }
        var phone = wx.getStorageSync("phone")
        if (phone) {
            this.setData({
                phone: phone,
            })
        }
        var roomid = wx.getStorageSync("roomid")
        if (roomid) {
            this.setData({
                roomid: roomid,
            })
        }
        var coupons = wx.getStorageSync("has_coupon")
        console.log("couponinfos:", coupons[0].coupon_status)
        var fare_coupon_info = ""
        var endtime = "zzzzzzzzzzzzzz"
        for (var i = 0; i < coupons.length; i++) {
            var c = coupons[i]
            if (c.coupon_status == 1 && c.use_end_date < endtime) {
                fare_coupon_info = c
                endtime = c.use_end_date
            }
        }
        var reduce_amount = fare_coupon_info.reduce_amount
        var couponkey = fare_coupon_info
        this.setData({
            fare_coupon_info: fare_coupon_info,
            reduce_amount: reduce_amount
        })
    },
    onLoad: function(e) {
        console.log("to pay order start")
        var that = this;
        var shopList = [];
        var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
        if (shopCarInfoMem && shopCarInfoMem.shopList) {
            shopList = shopCarInfoMem.shopList
        }
        var isNeedLogistics = 0;
        var allGoodsPrice = 0;
        console.log("shopList.length:", shopList.length)
        var goodsJsonStr = "[";
        for (var i = 0; i < shopList.length; i++) {
            var carShopBean = shopList[i];
            console.log("shopBean:", carShopBean);
            if (carShopBean.logisticsType > 0) {
                isNeedLogistics = 1;
            }
            allGoodsPrice += carShopBean.price * carShopBean.number
            console.log("all goods price:", allGoodsPrice)

            var goodsJsonStrTmp = '';
            if (i > 0) {
                goodsJsonStrTmp = ",";
            }
            //goodsJsonStrTmp += '{"goodsId":'+ carShopBean.goodsId +',"number":'+ carShopBean.number +',"propertyChildIds":"'+ carShopBean.propertyChildIds + '"}';
            goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","sendRoom":' + that.data.sendToRoom + '}';

            goodsJsonStr += goodsJsonStrTmp;
        }
        goodsJsonStr += "]";
        console.log("goodsJsonStr=", goodsJsonStr)

        that.setData({
            goodsList: shopList,
            isNeedLogistics: isNeedLogistics,
            allGoodsPrice: parseFloat(allGoodsPrice.toFixed(2)),
            goodsJsonStr: goodsJsonStr
        });

    },
    createOrder: function(e) {
        console.log("create order start")
        var that = this;
        var loginToken = app.globalData.token // 用户登录 token
        var remark = e.detail.value.remark; // 备注信息
        var username = e.detail.value.username;
        var phone = e.detail.value.phone;
        var roomid = e.detail.value.roomid;
        if (username == ""){
            username = wx.getStorageSync("username")
        }
        if (username == "") {
            wx.showModal({
                title: '错误',
                content: "请填写提货人姓名",
                showCancel: false
            })
            return
        }
        wx.setStorageSync("username", username)
        if (phone == "") {
            phone = wx.getStorageSync("phone")
        }
        if (phone == "" || phone.length != 11) {
            wx.showModal({
                title: '错误',
                content: "请填写正确电话",
                showCancel: false
            })
            return
        }
        wx.setStorageSync("phone", phone)
        if (roomid == "") {
            roomid = wx.getStorageSync("roomid")
        }
        if (roomid == "") {
            wx.showModal({
                title: '错误',
                content: "请填写详细地址",
                showCancel: false
            })
            return
        }
        wx.setStorageSync("roomid", roomid)

        wx.showLoading();
        
        var openid = app.globalData.openid;
        var fee = (that.data.allGoodsPrice + that.data.fare) * 100;
        fee = fee.toFixed(0)
        console.log("fee:", fee)
        var homeinfo = wx.getStorageSync("homeinfo")
        
        console.log("homeinfo:", homeinfo)
        var postData = {
            token: loginToken,
            openid: openid,
            goodsJsonStr: that.data.goodsJsonStr,
            remark: remark,
            total_fee: fee,
            username: username,
            phone: phone,
            roomid: roomid,
            orderid: "",
            sendroom: that.data.sendToRoom,
            fare: that.data.fare,
            goodsprice: that.data.allGoodsPrice * 100,
            needgoodsinfo: 1,
            homeid: homeinfo.homeid,
            homename: homeinfo.homename,
            homekey: homeinfo.key,
            homephone: homeinfo.phone,
            homeusername: homeinfo.username,
            scoupon: that.data.fare_coupon_info.sttl,
            homeaddr:homeinfo.addr
        };
        wxpay.wxpay(app, postData.total_fee, "/pages/order-list/index", postData, true);
    },
    initShippingAddress: function() {
        var that = this;
        wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/default',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                console.log(res.data)
                if (res.data.code == 0) {
                    that.setData({
                        curAddressData: res.data.data
                    });
                }
            }
        })
    },
    addAddress: function() {
        wx.navigateTo({
            url: "/pages/address-add/index"
        })
    },
    selectAddress: function() {
        wx.navigateTo({
            url: "/pages/select-address/index"
        })
    },
    switchChange: function(e) {
        var that = this;
        console.log("sendToRoom:", e.detail.value)
        var fare = 0
        var isSelect = e.detail.value
        if (isSelect) {
            fare = app.globalData.yunPrice - that.data.reduce_amount
            
        }
        that.setData({
            sendToRoom: isSelect,
            fare: fare
        })
    }
})