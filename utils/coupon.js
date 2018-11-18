function loadListData(openid) {
    console.log("coupon loadlist data")
    var arr = []
    var request = function(openid){
        console.log("bbbb")

        wx.request({
        url: 'http://39.105.169.87:1080/coupon?homeid=1&openid=' + openid + '&rtype=get',
        success: function (res) {
            console.log("cccc")
            var couponlist = res.data.msg
            console.log("couponlist:", couponlist)
            if (couponlist == "") {
                wx.setStorageSync("has_coupon", arr)
                return res.data.msg
            } else {
                var cinfos = res.data.coupon

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
                    value.sttl = id_ttl[i]
                    console.log("cinfos:", value)
                    arr.push(value)
                }
                wx.setStorageSync("has_coupon", arr)
                return arr
            }
        }
        
    })
    }
    request(openid)
   
    console.log("aaaaaaa:", arr)
    return arr
}
function print(){
    console.log("waiting...")
}
module.exports = {
    loadListData,
}