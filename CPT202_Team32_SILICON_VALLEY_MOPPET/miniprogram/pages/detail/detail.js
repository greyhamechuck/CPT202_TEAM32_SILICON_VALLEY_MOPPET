const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
var that = null;
Page({
  onLoad(){
    that = this;
    that.setData({
      item:app.globalData.item
    });
  },
  onShow(){
    that.init();
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']==true){
          wx.getUserInfo({
            success(res){
              that.setData({
                myimg:res.detail.userInfo.avatarUrl,

              });
            }
          })
        }
      }
    })
    
  },
  init(){

    db.collection('comment').where({
      pid:  that.data.item._id
    }).get()
    .then(result => {
      console.log(result);
      let items = result.data.map(item =>{
        item.date = app.nowdate(item.date);
        return item;
      })
      that.setData({
        comment:items,
        text:''
      })

      wx.hideLoading();
      wx.hideNavigationBarLoading();
    })

    
  },
  gettext(e){
    that.setData({
      text: e.detail.value
    })
  },
  comment(e){
    let info = wx.getStorageSync('userInfo');
    console.log(info)
    if(e.detail.userInfo){
      that.authorname = e.detail.userInfo.nickName;
      that.authorimg = e.detail.userInfo.avatarUrl;
      if(that.data.text.length>5){
        wx.showLoading({
          title: 'commenting',
          mask:true
        })
          db.collection('comment').add({
              data: {
                pid:that.data.item._id,
                content:that.data.text,
                date:new Date(),
                authorname:info.nickName,
                authorimg:info.avatarUrl
              }
            }).then(result => {
              that.init();
            })

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
        content:'Please verify yourself',
        showCancel:false
      })
    }
  },
  removeitem(e){
    wx.showLoading({
      title: 'deleting',
      mask:true
    })
    console.log(e.currentTarget.dataset.item._id);
    console.log(e.currentTarget.dataset.item);

    db.collection('comment').doc(e.currentTarget.dataset.item._id).remove()
    .then(res => {
        that.init();
    }).catch(err=>console.log(err))
  },
  previewimg(e) {
  
    wx.previewImage({
      urls: that.data.item.image,
      current: e.currentTarget.dataset.url
    })
  },
  removemain(e){

    wx.showModal({
      title: 'Oops',
      content: 'want to delete?',
      success(res) {
        if(res.confirm){
          wx.showLoading({
            title: 'deleting',
            mask:true
          })
          console.log(e);
          db.collection('forum').doc(that.data.item._id).remove()
          .then(res => {
            wx.cloud.deleteFile({
              fileList:that.data.item.image
            }).then(result => {
              wx.navigateBack({
                delta:1
              })
            });
          }).catch(err=>{
            wx.navigateBack({
              delta:1
            })
          })
        }
      }
    });

  }
})
