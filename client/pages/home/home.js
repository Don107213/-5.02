var config = require('../../config');
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['直播',"搜索", '生活', '体育','科技'],
    currentTab: 0,
    keyboardSearchValue: ''
  },

  /*
  顶部导航栏
  */
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //得到直播列表
  getAllLiveRoom:function()
  {
    var that=this;
    wx.request({
      url: config.service.host+'/Live',
      method: "GET",
      data: {
        mode: "getAllLiveRoom"
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        that.setData({
          liveList:res.data
        })
      }
    })
  },

  /**
   * 搜索直播间
   */
  searchLiveRoom: function (event) {
    var i;
    var len = this.data.liveList.length;
    for ( i = 0; i < this.data.liveList.length; i++) {
      if (this.data.liveList[i].liveRoomId == parseInt(this.data.keyboardSearchValue)) {
        wx.navigateTo({
          url: '../live/live?id=' + this.data.liveList[i].liveRoomId,
        })
        wx.showToast({
          title: "正在进入直播间",
          duration: 1000,
          icon: "loading"
        })
        break;
      }
    }
    if(i==len)
    {
      wx.showToast({
        title: "不存在该房间！",
        duration: 1000,
        image:"/images/icon/wx_app_xx.png"
      })
    }
  },

  bindSearchInput: function (event) {
    var val = event.detail.value;
    this.data.keyboardSearchValue = val;
  },

  /*
  页面跳转
   */
  onTapToLive(event) {
    var liveRoomId = event.currentTarget.dataset.liveRoomId;
    console.log(liveRoomId);
    wx.navigateTo({
      url: '../live/live?id=' + liveRoomId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllLiveRoom();
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
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      success:function(){
      wx.stopPullDownRefresh() //停止下拉刷新 
      }
    });  
    this.getAllLiveRoom(); 
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

  }
})