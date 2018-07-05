var util = require('../../utils/util.js');
var config = require('../../config');

var url = 'https://315505067.cool-live.club';

var app = getApp();
// pages/live/live.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    delete_hiddenmodalput: true,
    keyboardInputValue: '',
    sendMoreMsgFlag: false,
    chooseFiles: [],
    deleteIndex: -1,
    userInfo: {},
    imgList: ["http://wafer-1256361110.cos.ap-guangzhou.myqcloud.com/c84a1906da4e35608bab57ac98d3f194-wx034ce54e828ca871.o6zAJs5xAGCIsF96iL2gF_2OUdqw.VDcAzzyEfGFP146ed847388ec6e57df924112dee8bc9.JPG"],
    txt: "",
    sendFlowers_hiddenmodalput: true,//献花弹窗的是否隐藏属性
    liveUserInfo: {},
    sendFlowersNum: 0,
    judge: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log("加载")
    var userInfoStorage = wx.getStorageSync('user');
    var userIdStorage = wx.getStorageSync('userId');
    var liveId = options.id;
    // 绑定评论数据
    this.setData({
      liveRoomId: liveId,
      userInfo: userInfoStorage,
      userId: userIdStorage
    });
    this.getLiveRoomInfo();    
    this.getAllComments();
    this.getLiveList();
    this.checkUpStatus();
    this.checkWarnStatus();
    this.updateUpNum();
    this.checkWarnStatus();
    this.addViwNum();
    this.updateUserFlowerNum();
    this.digui();
  },

  //
  digui:function(){
    var that=this;
    setTimeout(function () {
      //console.log("this is setTimeout")
      that.getLiveList();
      that.getAllComments();
      that.digui();
    }, 1000)
  },

  //获取用户的鲜花数
  updateUserFlowerNum: function () {
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

  // 将时间戳转换成可阅读格式
  getDataByTime(itemData) {
    itemData.sort(this.compareWithTime); //按时间降序
    var len = itemData.length,
      data1;
    for (var i = 0; i < len; i++) {
      data1 = itemData[i];
      data1.create_time = util.getDiffTime(data1.create_time, true);
    }
    return itemData;
  },
  //sort函数的compare
  compareWithTime(value1, value2) {
    var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time);
    if (flag < 0) {
      return 1;
    } else if (flag > 0) {
      return -1
    } else {
      return 0;
    }
  },

  //返回主页
  navToHome: function () {
    wx.reLaunch({
      url: '../home/home',
    })
  },

  //关闭直播间的弹窗操作
  wantdeleteLiveRoom: function () {
    this.setData({
      delete_hiddenmodalput: !this.data.delete_hiddenmodalput
    })
  },
  //确认按钮
  deleteConfirm: function () {
    this.setData({
      delete_hiddenmodalput: true
    });
    this.deleteLiveRoom();
  },
  //取消按钮  
  deleteCancel: function () {
    this.setData({
      delete_hiddenmodalput: true
    });
  },

  //删除直播间
  deleteLiveRoom: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "deleteLiveRoom",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        wx.showToast({
          title: '关闭直播间成功',
          icon: 'success',
          duration: 2000,
        })
      }
    })
    wx.reLaunch({
      url: '../home/home',
    })
  },

  //离开页面时  减少观众人数

  subtractViewNum: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "subtractViewNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log("subtract success")
      }
    })
  },

  //进入页面时 增加观众人数
  addViwNum: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "addViwNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        var nowkey = 'liveRoomInfo.viewNum';
        that.setData({
          [nowkey]: res.data[0].viewNum
        })
      }
    })
  },

  updateWarnNum: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "updateWarnNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        var nowkey = 'liveRoomInfo.warnNum';
        that.setData({
          [nowkey]: res.data[0].warnNum
        })
      }
    })
  },

  //初始化页面时  检查是否举报
  checkWarnStatus: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "checkWarnStatus",
        liveRoomId: that.data.liveRoomId,
        upUserId: that.data.userId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        that.setData({
          warnStatus: res.data
        })
      }
    })
  },
  //举报
  onWarnTap: function (event) {
    if (this.data.userId != this.data.liveRoomId) {
      var that = this;
      wx.request({
        url: config.service.host + '/LiveRoom',
        method: "GET",
        data: {
          mode: "onWarnTap",
          liveRoomId: that.data.liveRoomId,
          upUserId: that.data.userId
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          that.updateWarnNum();
          that.setData({
            warnStatus: res.data
          })
        }
      })
    }
  },

  updateUpNum: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "updateUpNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        var nowkey = 'liveRoomInfo.upNum';
        that.setData({
          [nowkey]: res.data[0].upNum
        })
      }
    })
  },

  //初始化页面时  检查是否点赞
  checkUpStatus: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "checkUpStatus",
        liveRoomId: that.data.liveRoomId,
        upUserId: that.data.userId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        that.setData({
          upStatus: res.data
        })
      }
    })
  },
  //点赞
  onUpTap: function (event) {
    if (this.data.userId != this.data.liveRoomId) {
      var that = this;
      wx.request({
        url: config.service.host + '/LiveRoom',
        method: "GET",
        data: {
          mode: "onUpTap",
          liveRoomId: that.data.liveRoomId,
          upUserId: that.data.userId
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          that.updateUpNum();
          that.setData({
            upStatus: res.data
          })
        }
      })
    }

  },
  //更新鲜花数
  updateFlowerNum: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/LiveRoom',
      method: "GET",
      data: {
        mode: "updateFlowerNum",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        var nowkey = 'liveRoomInfo.flowerNum';
        that.setData({
          [nowkey]: res.data[0].flowerNum
        })
      }
    })

  },

  //送花
  sendFlowers: function () {
    if (this.data.judge == 1) {
      var that = this;
      console.log(this.data.sendFlowersNum);
      wx.request({
        url: config.service.host + '/LiveRoom',
        method: "GET",
        data: {
          mode: "sendFlowers",
          liveRoomId: that.data.liveRoomId,
          sendUserId: that.data.userId,
          sendFlowersNum: that.data.sendFlowersNum
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          console.log(res.data);
          wx.showToast({
            title: '献花成功',
            duration: 1000
          })
          that.updateFlowerNum();
          that.updateUserFlowerNum();
        }
      })
    }
    else {
      wx.showToast({
        title: '献花失败',
        image: "/images/icon/wx_app_xx.png",
        duration: 1000
      })
    }
  },

  //献花模板
  sendFlowersModal: function () {
    if (this.data.userId != this.data.liveRoomId) {
      this.setData({
        sendFlowers_hiddenmodalput: !this.data.sendFlowers_hiddenmodalput
      })
    }

  },
  sendFlowers_cancel: function () {
    this.setData({
      sendFlowers_hiddenmodalput: true
    });
  },
  //确认  
  sendFlowers_confirm: function () {
    this.setData({
      sendFlowers_hiddenmodalput: true
    })
    this.sendFlowers();
  },
  //绑定献花数量
  bindSendFlowersNum: function (event) {
    var num = event.detail.value;
    if (num <= 0 || num > this.data.liveUserInfo.flowerNum) {
      this.setData({
        judge: 0
      })
    }
    else {
      this.setData({
        judge: 1
      })
    }
    this.setData({
      sendFlowersNum: num
    })
  },

  /**
   * 预览图片
   */
  previewImg: function (event) {
    var imgUrl = event.currentTarget.dataset.imgUrl;
    var nowkey = 'imgList[0]';
    this.setData({
      [nowkey]: imgUrl
    })
    wx.previewImage({
      urls: this.data.imgList
    })
  },

  // 获取用户输入
  bindCommentInput: function (event) {
    var val = event.detail.value;
    this.data.keyboardInputValue = val;
  },


  //显示 选择照片、拍照等按钮
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  //选择本地照片与拍照
  chooseImage: function (event) {
    // 已选择图片数组
    var imgArr = this.data.chooseFiles;
    //只能上传1张照片，包括拍照
    var leftCount = 1 - imgArr.length;
    if (leftCount <= 0) {
      return;
    }
    var sourceType = [event.currentTarget.dataset.category],
      that = this;
    console.log(leftCount)
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function (res) {
        // 可以分次选择图片，但总数不能超过1张
        that.setData({
          filePath: res.tempFilePaths[0]
        })
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        });
      }
    })
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      });
    }, 500)
  },

  // 提交直播或评论  上传图片
  submitComment: function (event) {
    var imgs = this.data.chooseFiles;
    this.setData({
      txt: this.data.keyboardInputValue,
    })
    if (this.data.txt == "" && imgs.length === 0) {
      return;
    }
    if (imgs.length != 0) {
      var that = this;
      console.log("service" + config.service.uploadUrl);
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: this.data.filePath,
        name: 'file',
        success: function (res) {
          console.log('上传图片成功')
          res = JSON.parse(res.data)
          that.setData({
            imgUrl: res.data.imgUrl
          })
          if (that.data.liveRoomId == that.data.userId) {
            that.addLiveList();
          }
          else if (imgs.length == 0) {
            that.addComment();
          }
          //恢复初始状态
          that.resetAllDefaultStatus();
        },
        fail: function (e) {
          console.log('上传图片失败')
        }
      })
    }
    else {
      if (this.data.liveRoomId == this.data.userId) {
        this.addLiveList();
      }
      else if (imgs.length == 0) {
        this.addComment();
      }
      //恢复初始状态
      this.resetAllDefaultStatus();
    }
  },

  //添加直播

  addLiveList: function () {
    var that = this;
    console.log(this.data.imgUrl);
    if (this.data.chooseFiles.length == 0) {
      this.setData({
        imgUrl: ""
      })
    }
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "addLiveList",
        liveRoomId: that.data.liveRoomId,
        create_time: new Date().getTime() / 1000,
        txt: that.data.txt,
        imgUrl: that.data.imgUrl,
        audioUrl: "",
        audioLength: 0
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        that.setData({
          liveList: that.getDataByTime(res.data)
        })
      }
    })
  },

  //添加评论到数据库
  addComment: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "addComment",
        liveRoomId: that.data.liveRoomId,
        create_time: new Date().getTime() / 1000,
        txt: that.data.txt,
        nickName: that.data.userInfo.nickName,
        imgUrl: that.data.userInfo.avatarUrl
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        console.log(res.data);
        that.setData({
          comments: that.getDataByTime(res.data)
        })
      }
    })
  },

  //评论成功
  showCommitSuccessToast: function () {
    //显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
  },
  //将所有相关的按钮状态，输入状态都回到初始化状态
  resetAllDefaultStatus: function () {
    //清空评论框
    this.setData({
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    });
  },

  //获取直播间的数据
  getLiveRoomInfo: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "getLiveRoomInfo",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
       // console.log(res.data);
        that.setData({
          liveRoomInfo: res.data[0]
        })
        wx.setNavigationBarTitle({
          title: that.data.liveRoomInfo.nickName + '的直播间',
        })
      }
    })
    
  },

  //获取直播数据
  getLiveList: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "getLiveList",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
       // console.log(res.data);
        that.setData({
          liveList: that.getDataByTime(res.data)
        })
      }
    })
  },


  //获取用户评论
  getAllComments: function () {
    var that = this;
    wx.request({
      url: config.service.host + '/Live',
      method: "GET",
      data: {
        mode: "getAllComments",
        liveRoomId: that.data.liveRoomId
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        //console.log(res.data);
        that.setData({
          comments: that.getDataByTime(res.data)
        })
      }
    })
  },

  //减少观看人数
  subtractView: function () {
    console.log("观看人数减一");
    wx.request({
      url: '',
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
    console.log("页面卸载：" + this.data.liveRoomId);
    this.subtractViewNum();
    wx.reLaunch({
      url: '../home/home',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getLiveList();
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