// pages/home/home.js
let Home = require('../../utils/allhome.js');

Page({

  data: {
    home:Home
  },

  bindtap(e){
    console.log(e.detail)
    var homename = e.detail.name
    var homeid = e.detail.id
    var key = e.detail.key
    console.log("homename:", homename, "; homeid:", homeid, "; key:", key)
    var homeinfo = {
        homename : e.detail.name,
        homeid : e.detail.id,
        key : e.detail.key,
        username : e.detail.username,
        phone : e.detail.phone,
        addr : e.detail.addr,
    };
      wx.setStorageSync("listflush", 1)

    wx.setStorageSync("homeinfo", homeinfo)
      wx.switchTab({
          url: "/pages/index/index"
            //url: "/pages/index/index?homeid=" + homeid + "&homename=" + homename + "&key=" + key

      })
  },
  input(e){
    this.value = e.detail.value
  },
  searchMt(){
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value){
      this.value = '';
    }
    this.setData({
      value:this.value
    })
  }
  
})