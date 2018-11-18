function wxpay(app, money, redirectUrl, postData, rmShopCar) {
    wx.request({
        url: 'https://www.aigeming.com/payment?openid=' + app.globalData.openid,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: postData, // 设置请求的 参数
        
        success: (res) => {
            wx.hideLoading();
            console.log("pay post data:", postData)
            console.log("create:", res.data);
            if (res.data.code != 0) {
                wx.showModal({
                    title: '错误',
                    content: res.data.msg,
                    showCancel: false
                })
                return;
            }
            var payInfo = {
                timeStamp: res.data.timeStamp,
                appId: res.data.appId,
                nonceStr: res.data.nonceStr,
                sign: res.data.sign,
                signType: res.data.signType,
                pacakge: res.data.package,
                orderid: res.data.orderid,
            }

            wx.requestPayment({
                timeStamp: payInfo.timeStamp,
                nonceStr: payInfo.nonceStr,
                package: payInfo.pacakge,
                signType: payInfo.signType,
                paySign: payInfo.sign,
                appId: payInfo.appId,
                success: function(res) {
                    wx.showToast({
                        title: '支付成功',
                    })
                    var orderid = payInfo.orderid
                    console.log("ordierid:", orderid, "; status:", app.globalData.orderPrecollectStatus)
                    wx.request({
                        url: 'https://www.aigeming.com/orderstatus?orderid=' + orderid + "&status=" + app.globalData.orderPrecollectStatus,
                        success: (res) => {
                            wx.hideLoading();
                        console.log("order done")
                        }
                    })
                    wx.request({
                        url: 'https://www.aigeming.com/coupon?openid=' + app.globalData.openid + '&rtype=del&key=' + postData.scoupon,
                    })
                },
                fail: function(res) {
                    console.log("payment fail:", res)
                    wx.showToast({
                        title: '支付失败',
                    })
                },
                complete: function(res) {
                    console.log("complete")
                }

            })

            // 清空购物车数据
            if (rmShopCar) {
                wx.removeStorageSync('shopCarInfo');
            }
            // 下单成功，跳转到订单管理界面
            wx.navigateTo({
                url: redirectUrl
            })
          
        }
    })
}
module.exports = {
    wxpay: wxpay
}