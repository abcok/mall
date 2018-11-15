function addshopcar(data) {
    //var shopCarInfo = data.shopCarInfo;
    var shopcarKey = 'shopCarInfo';
    var shopCarInfo = wx.getStorageSync(shopcarKey)

    if (data.buyNumber < 1) {
        wx.showModal({
            title: '提示',
            content: '暂时缺货哦~',
            showCancel: false
        })
        return;
    }
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = data.goodsDetail.id;
    shopCarMap.pic = data.goodsDetail.cover[0];
    shopCarMap.name = data.goodsDetail.title;
    // shopCarMap.label=data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = data.propertyChildIds;
    shopCarMap.label = data.propertyChildNames;
    shopCarMap.price = data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = 1;
    if (shopCarInfo){
    if (!shopCarInfo.shopNum) {
        shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
        shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
        var tmpShopCarMap = shopCarInfo.shopList[i];
        if (tmpShopCarMap.goodsId == shopCarMap.goodsId) {
            hasSameGoodsIndex = i;
            shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
            break;
        }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + 1;
    if (hasSameGoodsIndex > -1) {
        shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
        shopCarInfo.shopList.push(shopCarMap);
    }
    }
    else {
        var shopList = [];
        shopList.push(shopCarMap);
        var tmp = {
            shopNum :1,
            shopList : shopList,
        }
        shopCarInfo = tmp;
    }
    // 写入本地存储
    wx.setStorage({
        key: "shopCarInfo",
        data: shopCarInfo
    })
    //closePopupTap();
    wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
    })

    return shopCarInfo
}
module.exports = {
    addshopcar: addshopcar
}