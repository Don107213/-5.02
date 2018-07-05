var config = require('../../config');
// pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createliveroom_hiddenmodalput: true,
    liveroomtype: ['生活', '体育', '科技'],
    isLiving: 0,
    index: 0,
    chooseImg: 0,
    intro: '',
    livetype: '',
    tempFilePaths: '../../images/comment/train-4.jpg'
  },

  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
          chooseImg: 1
        })
      }
    })
  },

  bindLiveRoomType: function (event) {
    var liveRoomType = event.detail.value;
    this.setData({
      livetype: liveRoomType
    })
  },

  bindLiveRoomIntro: function (event) {
    var intro = event.detail.value;
    this.setData({
      intro: intro
    })
  },
  /**
 * 监听普通picker选择器
 */
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },

  //创建直播间的弹窗操作
  createliveroom: function () {
    this.setData({
      createliveroom_hiddenmodalput: !this.data.createliveroom_hiddenmodalput
    })
  },
  //取消按钮  
  createliveroom_cancel: function () {
    this.setData({
      createliveroom_hiddenmodalput: true
    });
  },
  //确认  
  createliveroom_confirm: function () {
    var ltype = this.data.liveroomtype[this.data.index];
    console.log(ltype);
    this.setData({
      livetype: ltype
    })
    console.log('确认');
    console.log(this.data.intro);
    this.setData({
      createliveroom_hiddenmodalput: true
    })
    this.createLiveRoom();
  },

  //创建直播间  
  uploadLiveRoom: function () {
    var that = this;
    wx.request({
      url: config.service.host+'/Live',
      method: "GET",
      data: {
        mode: "createLiveRoom",
        avatar: that.data.userInfo.avatarUrl,
        nickName: that.data.userInfo.nickName,
        liveRoomId: that.data.userId,
        liveRoomIntro: that.data.intro,
        liveType: that.data.livetype,
        imgUrl: that.data.imgUrl
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        wx.showToast({
          title: '创建直播间成功',
          icon: 'success',
          duration: 2000,
        })
      }
    })
    wx.navigateTo({
      url: '../live/live?id=' + this.data.userId,
    })
  },

  createLiveRoom: function () {
    var that = this;
    if (this.data.chooseImg == 1) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: that.data.tempFilePaths,
        name: 'file',
        success: function (res) {
          console.log('上传图片成功')
          res = JSON.parse(res.data)
          that.setData({
            imgUrl: res.data.imgUrl
          })
          that.uploadLiveRoom();
        },
      })
    }
    else{
      this.setData({
        imgUrl:'http://wafer-1256361110.cos.ap-guangzhou.myqcloud.com/68d76042675f4ebf82365be2c2825844-wx034ce54e828ca871.o6zAJs5xAGCIsF96iL2gF_2OUdqw.wa9h5Yn4uxtMf9df8c86a6f6132205207f81cff8103e.jpg'
      })
      this.uploadLiveRoom();
    }


  },

  //检查直播状态
  checkLivingStatus: function () {
    var that = this;
    wx.request({
      url: config.service.host +'/Live',
      method: "GET",
      data: {
        mode: "checkLivingStatus",
        liveRoomId: that.data.userId,
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        if (res.data == 1) {
          wx.navigateTo({
            url: '../live/live?id=' + that.data.userId,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('load');
    var that = this;
    var userInfoStorage = wx.getStorageSync('user');
    var userIdStorage = wx.getStorageSync('userId');
    this.setData({
      userInfo: userInfoStorage,
      userId: userIdStorage,
    });
    this.checkLivingStatus();
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

  }
})