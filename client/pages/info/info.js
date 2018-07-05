var app = getApp();
var config = require('../../config')
var qcloud = require('../../vendor/wafer2-client-sdk/index')

// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    liveUserInfo: {},
    buyflower_hiddenmodalput: true,
    sellflower_hiddenmodalput: true,
    chongzhi_hiddenmodalput: true,
    tixian_hiddenmodalput: true,
    tradeFlowersNum: 0,
    judge: 0
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
  },

  //买花的弹窗操作
  buyflower_input: function () {
    this.setData({
      buyflower_hiddenmodalput: !this.data.buyflower_hiddenmodalput
    })
  },

  bindbuyFlowersNum: function (event) {
    var num = event.detail.value;
    this.setData({
      tradeFlowersNum: num
    })
    if (num <= 0) {
      this.setData({
        judge: 0
      })
    }
    else {
      this.setData({
        judge: 1
      })
    }
  },

  bindsellFlowersNum: function (event) {
    var num = event.detail.value;
    if (num <= 0) {
      this.setData({
        judge: 0
      })
    }
    else {
      this.setData({
        judge: 1
      })
    }
    var num = -1 * event.detail.value;
    this.setData({
      tradeFlowersNum: num
    })
  },

  //取消按钮  
  buyflowerCancel: function () {
    this.setData({
      buyflower_hiddenmodalput: true
    });
  },
  //确认  
  buyflowerConfirm: function () {
    this.setData({
      buyflower_hiddenmodalput: true
    })
    this.tradeFlowers();
  },

  tradeFlowers: function () {
    var that = this;
    if (this.data.judge == 1) {
      wx.request({
        url: config.service.host + '/Live',
        method: "GET",
        data: {
          mode: "tradeFlowers",
          userId: that.data.userId,
          tradeFlowersNum: that.data.tradeFlowersNum
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          that.updateFlowerNum();
        }
      })
    }
  },

updateFlowerNum: function () {
  var that = this;
  wx.request({
    url: config.service.host + '/Live',
    method: "GET",
    data: {
      mode: "updateFlowerNum",
      userId: that.data.userId
    },
    header: {
      "content-type": "application/json"
    },
    success(res) {
      var flowerkey = 'liveUserInfo.flowerNum';
      var balancekey = 'liveUserInfo.balance';
      that.setData({
        [flowerkey]: res.data[0].flowerNum,
        [balancekey]: res.data[0].balance
      })
    }
  })
},

//卖花的弹窗操作
sellflower_input: function () {
  this.setData({
    sellflower_hiddenmodalput: !this.data.sellflower_hiddenmodalput
  })
},
//取消按钮  
sellflowerCancel: function () {
  this.setData({
    sellflower_hiddenmodalput: true
  });
},
//确认  
sellflowerConfirm: function () {
  this.setData({
    sellflower_hiddenmodalput: true
  })
  this.tradeFlowers();
},

//充值的弹窗操作
chongzhi_input: function () {
  this.setData({
    chongzhi_hiddenmodalput: !this.data.chongzhi_hiddenmodalput
  })
},
//取消按钮  
chongzhiCancel: function () {
  this.setData({
    chongzhi_hiddenmodalput: true
  });
},
//确认  
chongzhiConfirm: function () {
  this.setData({
    chongzhi_hiddenmodalput: true
  })
},

//提现的弹窗操作
tixian_input: function () {
  this.setData({
    tixian_hiddenmodalput: !this.data.tixian_hiddenmodalput
  })
},
//取消按钮  
tixianCancel: function () {
  this.setData({
    tixian_hiddenmodalput: true
  });
},
//确认  
tixianConfirm: function () {
  this.setData({
    tixian_hiddenmodalput: true
  })
},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  console.log("load")
  var userIdStorage = wx.getStorageSync('userId');
  var userInfoStorage = wx.getStorageSync('user');
  this.setData({
    userInfo: userInfoStorage,
    userId: userIdStorage
  });
  this.getLiveUserInfo();
  this.updateFlowerNum();
},

getLiveUserInfo: function () {
  var that = this;
  wx.request({
    url: config.service.host + '/Live',
    method: "GET",
    data: {
      mode: "getLiveUserInfo",
      userId: that.data.userId
    },
    header: {
      "content-type": "application/json"
    },
    success(res) {
      console.log(res.data);
      that.setData({
        liveUserInfo: res.data[0]
      })
    }
  })
},

/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function () {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {
  console.log("refresh")
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 1000,
    success: function () {
      wx.stopPullDownRefresh() //停止下拉刷新 
    }
  });
  this.updateFlowerNum();

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {

},

})