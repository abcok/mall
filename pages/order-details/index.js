var app = getApp();
Page({
    data: {
        orderId: 0,
        goodsList: [],
        yunPrice: app.globalData.yunPrice,
        homename: "",
        homeid:0,
        homekey:"",
        titles: [],
        images: [],
        orderDetail: {},
    },
   
    onLoad: function(e) {
        console.log("onLoad=", e.id)
        var orderId = e.id;
        this.data.orderId = orderId;
        var homename = wx.getStorageSync("homename")
        var homeid = wx.getStorageSync("homeid")
        var homekey = wx.getStorageSync("homekey")
        this.setData({
            orderId: orderId,
            homename: homename,
            homekey: homekey,
            homeid:homeid,
        });
    },
    onShow: function() {
        console.log("onshow....")
        var that = this;
        console.log(this.data)
        wx.request({
            url: 'https://www.aigeming.com/order?&orderid=' + that.data.orderId,
            success: (res) => {
                wx.hideLoading();
                console.log("single order:", res)
                if (res.data.ec != 0) {
                    wx.showModal({
                        title: '错误',
                        content: "获取订单失败",
                        showCancel: false
                    })
                    return;
                }
                console.log("order info:", res.data)
                var info = res.data.data[0]
                var yunPrice = info.fare;
                
                var goods_price = (parseInt(info.goods_price) / 100.0).toFixed(2)
                var allprice = info.total_rmb;
                console.log("yunPrice:", yunPrice, "; allPrice=", allprice)
                console.log("info:", info)
                that.setData({
                    allGoodsPrice: goods_price,
                    yunPrice: yunPrice,
                    totalPrice: allprice,
                    username: info.username,
                    roomid: info.roomid,
                    phone: info.phone,
                    isSend: info.send_room,
                    titles:info.titles,
                    images: info.imgs,
                    prices: info.prices,
                    orderDetail: info,
                    homeaddr: info.homeaddr,
                    homeusername: info.homeusername
                });
            }
        })

    },
    cancelOrderTap: function (e) {
        var that = this;
        var orderId = e.currentTarget.dataset.id;
        console.log("cancel orderid:", orderId)
        wx.showModal({
            title: '确定要删除该订单吗？',
            content: '',
            success: function (res) {
                if (res.confirm) {
                    wx.showLoading();
                    wx.request({
                        url: 'https://www.aigeming.com/orderstatus?orderid=' + orderId + "&status=" + app.globalData.orderDelStatus,
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
    }

})