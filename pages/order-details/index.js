var app = getApp();
Page({
    data: {
        orderId: 0,
        goodsList: [],
        yunPrice: app.globalData.yunPrice,
        orderDesc: app.globalData.loacal
    },
   
    onLoad: function(e) {
        console.log("onLoad=", e.id)
        var orderId = e.id;
        this.data.orderId = orderId;

        this.setData({
            orderId: orderId
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

                var info = res.data.data[0]
                var yunPrice = info.fare;
                var goods_price = (parseInt(info.goods_price) / 100.0).toFixed(2)
                var allprice = info.total_rmb;
                console.log("yunPrice:", yunPrice, "; allPrice=", allprice)
                that.setData({
                    allGoodsPrice: goods_price,
                    yunPrice: yunPrice,
                    totalPrice: allprice,
                    username: info.username,
                    roomid: info.roomid,
                    phone: info.phone,
                    isSend: info.send_room,
                });
            }
        })

    },

})