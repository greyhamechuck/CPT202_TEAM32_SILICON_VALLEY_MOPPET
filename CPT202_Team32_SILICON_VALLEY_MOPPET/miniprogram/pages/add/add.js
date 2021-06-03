const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var that = null;
Page({
  data: {
    userInfo:{},
    text: '',
    photo: []
  },
  onShow(e){
    let info = wx.getStorageSync('userInfo');
    this.setData({
      userInfo:info
    })
  },
  onLoad(options) {
    that = this;
    // 获取当前用户信息
  },
  gettext(e) {
    that.setData({
      text: e.detail.value
    })
  },
  chooseimage() {
    wx.chooseImage({
      count: 8 - that.data.photo.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        that.setData({
          photo: that.data.photo.concat(res.tempFilePaths)
        })
      }
    })
  },
  previewimg(e) {
    wx.previewImage({
      urls: that.data.photo,
      current: e.currentTarget.dataset.url
    })
  },
  removeimg(e) {
    wx.showModal({
      title: 'Attention',
      content: 'Do you want to delete the image',
      success(res) {
        if (res.confirm) {
          let url = e.currentTarget.dataset.url;
          let urls = that.data.photo;
          urls.splice(urls.indexOf(url), 1);
          that.setData({
            photo: urls
          })
        }
      }
    })
  },
  done(e){
    console.log(e.detail.userInfo)
    if(e.detail.userInfo){
      that.authorname = e.detail.userInfo.nickName;
      that.authorimg = e.detail.userInfo.avatarUrl;
      if(that.data.text.length>5){
        wx.showLoading({
          title: 'Textchecking',
          mask: true
        })
            that.uploadimg(that.data.photo);

      }
      else{
        wx.showModal({
          title:'Oops',
          content:'Type 5 words so you can post',
          showCancel:false
        })
      }
    }
    else{
      wx.showModal({
        title:'Oops',
        content:'Please verify yourself first',
        showCancel:false
      })
    }
  },
  async uploadimg(imgs){
    let result = [];
    for(let item of imgs){
      wx.showLoading({
        title: 'uploading',
        mask: true
      })
      let fileres = await wx.cloud.uploadFile({
        cloudPath: `hole/${Date.now()}-${Math.floor(Math.random(0,1)*1000)}.png`,
        filePath: item
      });
      wx.showLoading({
        title: 'testing',
        mask: true
      })
      let secres = await that.imagesec(fileres.fileID);
      if(secres)
        result.push(fileres);
    }
    that.additem(result);
  },
  imagesec(fileID){
    return new Promise((resolve, reject)=>{
      wx.cloud.callFunction({
        name:'hole-imagesec',
        data:{
          img:fileID
        },
        success(res){
          resolve(true);
        },
        fail(e){
          wx.cloud.deleteFile({
            fileList: [fileID]
          });
          resolve(false);
        }
      });
    })
  },
  additem(photos) {
    const albumPhotos = photos.map(photo => photo.fileID);
    db.collection('forum').add({
      data: {
        content:that.data.text,
        image:albumPhotos,
        date:new Date(),
        authorname:that.data.userInfo.nickName,
        authorimg:that.data.userInfo.avatarUrl,
        clickcount:0
      }
    }).then(result => {
      wx.hideLoading();
      wx.navigateBack({
        delta:1
      })
    }).catch(err=>{
      wx.hideLoading();
    })
  },
})