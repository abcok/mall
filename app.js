//app.js
App({
    onLaunch: function() {
        var that = this;
        //  设置商城名称
        wx.setStorageSync('mallName', "精选仓");
        this.login();
    },
    login: function() {
        var that = this;
        var token = that.globalData.token;
        if (token) {
            return;
        }
        wx.login({
            success: function(res) {
                wx.request({
                    url: 'https://www.aigeming.com/login?',
                    data: {
                        code: res.code
                    },
                    success: function(res) {
                        console.log("shiqi.debug:", res)
                        console.log("shiqi.debug code:", res.data.errcode)
                        if (res.data.errcode == 10001) {
                            // 去注册  (暂时没有实现)
                            that.registerUser();
                            return;
                        }
                        if (res.data.errcode == 1002) {
                            console.log("token error");
                            return;
                        }
                        if (res.data.errcode != 1000) {
                            // 登录错误 
                            wx.hideLoading();
                            wx.showModal({
                                title: '提示',
                                content: '无法登录，请重试',
                                showCancel: false
                            })
                            return;
                        }
                        that.globalData.token = res.data.access_token;
                        that.globalData.openid = res.data.openid;
                        console.log("shiqi.debug openid:", that.globalData.openid)

                    }
                })
            }
        })
    },
    registerUser: function() {
        var that = this;
        wx.login({
            success: function(res) {
                var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
                wx.getUserInfo({
                    success: function(res) {
                        var iv = res.iv;
                        var encryptedData = res.encryptedData;
                        // 下面开始调用注册接口
                        wx.request({
                            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/register/complex',
                            data: {
                                code: code,
                                encryptedData: encryptedData,
                                iv: iv
                            }, // 设置请求的 参数
                            success: (res) => {
                                wx.hideLoading();
                                that.login();
                            }
                        })
                    }
                })
            }
        })
    },
    globalData: {
        userInfo: null,
        subDomain: "mall",
        yunPrice: 3, //yuan
        hostname: 'https://www.aigeming.com',
        loacal: "天通苑",
        orderDoneStatus:1,  //订单完成状态
        orderPrepayStatus:2,  //订单待支付状态
        orderDelStatus: 3,  //订单删除状态
    }
})