var app = getApp();

Page({
    data: {
        userInfo: {},
        hasMobile: ''
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数        
    },
    onReady: function () {

    },
    onShow: function () {

        let userInfo = wx.getStorageSync('userinfo');

        // 页面显示
        if (userInfo) {
            app.globalData.userInfo = userInfo;
        } else {
            userInfo = app.globalData.userInfo
        }

        this.setData({
            userInfo: userInfo,
        });
        console.log("Info:", userInfo)

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    bindGetUserInfo(e) {
        var that = this
        var userInfo = e.detail.userInfo
        wx.setStorageSync("userinfo", userInfo)
        that.setData({
            userInfo: userInfo,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,//性别 0：未知、1：男、2：女
            province: userInfo.province,
            city: userInfo.city,
            country: userInfo.country,

        })
      
    },
    orderList: function(){
        wx.navigateTo({
            url: "/pages/order-list/index"
        })
    },
    coupon: function(){
        console.log("jump coupon")
        wx.navigateTo({
            url: "/pages/coupon/index",
        })

        /*
        wx.showModal({
            title: '提示',
            content: '功能暂未开通',
            showCancel: false,
        })
        /*
        wx.request({
            url: 'http://39.105.169.87:1080/coupon?homeid=1&openid=' + app.globalData.openid + '&rtype=get',
            success:function(res){
                var couponlist = res.data.msg
                if (couponlist == ""){

                }
            }
        })
        */
    },
    coupon: function () {
        wx.showModal({
            title: '提示',
            content: '功能暂未开通',
            showCancel: false,
        })
    }, 
    help: function () {
        var homeinfo = wx.getStorageSync("homeinfo")
        var info = homeinfo.username + "  " + homeinfo.phone
        wx.showModal({
            title: '请联系',
            content: info,
            showCancel: false,
        })
    }, 
    kefu: function () {
        wx.showModal({
            title: '请联系',
            content: "杜先生 18101027993",
            showCancel: false,
        })
    }, 
    addrManager: function() {
        wx.showModal({
            title: '提示',
            content: '功能暂未开通',
            showCancel: false,
        })
    }, 
     collect: function() {
        wx.showModal({
            title: '提示',
            content: '功能暂未开通',
            showCancel: false,
        })
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
});