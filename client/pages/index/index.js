var app = getApp();
var config = require('../../config')
var qcloud = require('../../vendor/wafer2-client-sdk/index')

// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    openid: "",
    userInfo: {},
    liveUserInfo: {},
    userId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userIdStorage = wx.getStorageSync('userId');
    var userInfoStorage = wx.getStorageSync('user');
    var that = this;
    wx.login({
      success: function (res1) {
        /**获取openid */
        wx.request({
          url: config.service.host + '/WxLogin',
          data: {
            code: res1.code
          },
          success: function (res) {
            that.data.openId = res.data.openid;
            that.getUserId();
          }
        })
      }
    })
  },

  //根据openId检查用户是否已经授权过 即是否已经分配ID
  getUserId: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "getUserId",
        openId: that.data.openId,
      },
      success(res) {
        if (res.data != 0) {
          that.setData({
            userId: res.data
          })
          wx.setStorageSync('userId', res.data);
        }
      }
    })
  },


  _getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo,
          logged: true
        })
        wx.setStorageSync('user', res.userInfo)
        if (that.data.userId == 0) {
          that.addUser();
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
    wx.reLaunch({
      url: '../home/home',
    })
  },
  /** 增加用户*/
  addUser: function () {
    console.log("addUser");
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "addUser",
        openId: that.data.openId,
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        wx.setStorageSync('userId', res.data);
        that.setData({
          userId: res.data
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