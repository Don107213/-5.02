var util = require('../utils/util.js')

class DBLive {
  constructor(liveId) {
    this.storageKeyName = 'liveList';
    this.liveId = liveId;
  }
  
  
  //获取指定id号的文章数据
  getLiveItemById() {
    var liveData = this.getAllLiveData();
    var len = liveData.length;
    for (var i = 0; i < len; i++) {
      if (liveData[i].liveId == this.liveId) {
        return {
          data: liveData[i],
          index:i
        }
      }
    }
  }

  //发表评论
  newComment(newComment) {
    this.updateLiveData('comment', newComment);
  }
  //发表直播
  newLiveContent(newComment){
    this.updateLiveData('live', newComment);
  }

  getAllLiveData() {
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').liveList;
      this.execSerStorageSync(res);
    }
    return res;
  }

  execSerStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data);
  }

  collect() {
    return this.updateLiveData('collect');
  }

  up() {
    return this.updateLiveData('up');
  }

  updateLiveData(category, newComment) {
    var itemData = this.getLiveItemById(),
      liveData = itemData.data,
      allLiveData = this.getAllLiveData();
    switch (category) {
      case 'live':
        liveData.hostList.push(newComment);
      break;
      case 'comment':
        liveData.comments.push(newComment);
        liveData.commentNum++;
        break;
      case 'collect':
        if (!postData.collectionStatus) {
          liveData.collectionNum++;
          liveData.collectionStatus = true;
        }
        else {
          liveData.collectionNum--;
          liveData.collectionStatus = false;
        }
        break;
      case 'up':
        if (!liveData.upStatus) {
          liveData.upNum++;
          liveData.upStatus = true;
        }
        else {
          liveData.upNum--;
          liveData.upStatus = false;
        }
        break;
     
      default: break;
    }
    allLiveData[itemData.index] = liveData;
    this.execSerStorageSync(allLiveData);
    return liveData;
  }
};

export { DBLive }