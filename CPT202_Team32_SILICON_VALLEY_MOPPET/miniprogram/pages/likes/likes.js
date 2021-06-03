// pages/likes/likes.js
const app = getApp();
const db = wx.cloud.database()
const _ = db.command;
var that = null;
Page({
  onLoad(){
    that = this;
  },
  onShow(){
    wx.showNavigationBarLoading()
    that.init();
    that.toadmin();
    
  },

  toadmin(){
    wx.cloud.database().collection('admin').get()
    .then(res => {
        let number = -1;
        if (res.data.length != 0) {
            number = res.data[0]._id;
            that.setData({
              number: number
            })
        }
        else{//if no, add one
          that.addadmin();
        }
    });
  },
  addadmin(count = 1) {
    let that = this;
    wx.showLoading({
        title: '注册中(' + count + ')',
    });
    
    const id = (Math.floor(Math.random() * (8999)) + 1000).toString();
    console.log('注册id:', id);
    wx.cloud.database().collection('admin').add({
        data: {
            _id: id
        }
    }).then(res => {
        
        console.log(res);
        wx.hideLoading();
        that.setData({
            number: res._id
        })
    }).catch(e => {
        
        that.toadmin(count + 1);
        console.log(e);
    })
  },
  todetail(e){
    app.globalData.item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  init(){
    db.collection('forum').get()
    .then(result => {
      console.log(result);
      let items = result.data.map(item =>{
        item.date = app.nowdate(item.date);
        return item;
      })
      that.setData({
        items:items
      })
      wx.hideLoading();
      wx.hideNavigationBarLoading();
    })
  },
  searchfor(){
    wx.cloud.database().collection('forum').get()


  }
})