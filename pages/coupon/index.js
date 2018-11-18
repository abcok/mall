const cc = require('../../utils/coupon.js');

var app = getApp();

Page({
    data: {
        
    },
    onLoad: function(options) {
        console.log("coupon onload")
        
    },

    

    onReady: function() {

    },
    onShow: function() {
        var that = this
        var openid = app.globalData.openid
        wx.request({
            url: 'http://39.105.169.87:1080/coupon?homeid=1&openid=' + openid + '&rtype=get',
            success: function (res) {
                console.log("cccc")
                var couponlist = res.data.msg
                console.log("couponlist:", couponlist)
                if (couponlist == "") {
                    that.setData({
                        couponList: res.data.msg,
                    })
                } else {
                    var cinfos = res.data.coupon
                    var arr = []
                    console.log('coupon value:', res.data)
                    var id_ttl = res.data.msg.split(',')
                    for (let i = 0; i < id_ttl.length; i++) {
                        if (id_ttl[i] == "") {
                            continue
                        }
                        var tmps = id_ttl[i].split('_')
                        if (tmps.length != 2) {
                            continue
                        }
                        var d = new Date(parseInt(tmps[0]))
                        var endtime = d.getFullYear() + "_" + d.getMonth() + "_" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
                        console.log("end time:", endtime)
                        var key = 'coupon_' + tmps[0]
                        var value = wx.getStorageSync(key)
                        value.coupon_status = 1
                        value.use_end_date = endtime
                        console.log("cinfos:", value)
                        arr.push(value)
                    }
                    that.setData({
                        couponList: arr,
                    })
                }
            }

        })
        
    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭
    }
})