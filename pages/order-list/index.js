var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
    data: {
        //statusType:["全部","待付款","待发货","待收货","已完成"],
        statusType: ["已完成", "待付款"],
        currentType: 0,
        tabClass: ["", ""],
        imagesMap: {},
        orderList: []
    },
    statusTap: function(e) {
        var curType = e.currentTarget.dataset.index;
        console.log("switch:", curType)
        this.data.currentType = curType
        this.setData({
            currentType: curType
        });
        this.onShow();
    },
    orderDetail: function(e) {
        var orderId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/order-details/index?id=" + orderId
        })
    },
    cancelOrderTap: function(e) {
        var that = this;
        var orderId = e.currentTarget.dataset.id;
        console.log("cancel orderid:", orderId)
        wx.showModal({
            title: '确定要删除该订单吗？',
            content: '',
            success: function(res) {
                if (res.confirm) {
                    wx.showLoading();
                    wx.request({
                        url: 'https://www.aigeming.com/orderstatus?orderid=' + orderId + "&status=" + app.globalData.orderPrepayStatus,
                        success: (res) => {
                            wx.hideLoading();
                            console.log("cancel result:", res)
                            if (res.data.ec == 0) {
                                that.onShow();
                            }
                        }
                    })
                }
            }
        })
    },
    toPayTap: function(e) {
        var orderId = e.currentTarget.dataset.id;
        var money = e.currentTarget.dataset.money;
        console.log("topayTap:", orderId, money)
        var postData = {
            orderid: orderId,
            needgoodsinfo: 0,
            total_fee: money,
        };
        wxpay.wxpay(app, money, "/pages/order-list/index", postData, false);
        
    },
    onLoad: function(options) {
        // 生命周期函数--监听页面加载
        console.log('orderlist:', options)
    },
    onReady: function() {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function() {
        // 获取订单列表
        wx.showLoading();
        var that = this;
        var postData = {
            token: app.globalData.token,
            openid: app.globalData.openid,
            //status: 0, //2：待支付；1：已完成
        };
        if (this.data.currentType == 1) {
            postData.status = 2
        }
        if (this.data.currentType == 0) {
            postData.status = 1
        }
        wx.request({
            url: 'https://www.aigeming.com/orderlist?openid=' + postData.openid + '&status=' + postData.status,
            data: postData,
            success: (res) => {
                wx.hideLoading();
                console.log("order list :", res)

                if (res.statusCode == 200) {
                    var tabClass = that.data.tabClass;
                    console.log("that.data:", tabClass)
                    /*  小红点 逻辑，如果当前在已完成订单页面，同时有代付款，就会在 代付款 右上角加一个小红点
                    if (that.data.currentType == 0) {
                      for (var i = 0; i < res.data.length; i++) {
                        var order = res.data[i]
                        if (order.status == 1) {
                          tabClass[1] = "red-dot"
                        }
                      }
                    }*/
                    console.log("that.data2:", tabClass)

                    var empty = true
                    if (res.data.data) {
                        empty = false
                    }

                    for (var i = 0; !empty && i < res.data.data.length; i++) {
                        var one = res.data.data[i]
                        var id = one.orderid
                        var imgs = one.imgs
                        that.data.imagesMap[id] = imgs
                    }
                    console.log("map:", that.data.imagesMap)

                    that.setData({
                        tabClass: tabClass,
                        orderList: res.data.data,
                        imagesMap: that.data.imagesMap,
                        isEmpty: empty
                        //logisticsMap : res.data.data.logisticsMap,
                        //goodsMap : res.data.data.goodsMap
                    });
                } else {
                    this.setData({
                        orderList: null,
                        logisticsMap: {},
                        goodsMap: {}
                    });
                }
            }
        })

    },
    onHide: function() {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function() {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数

    }
})