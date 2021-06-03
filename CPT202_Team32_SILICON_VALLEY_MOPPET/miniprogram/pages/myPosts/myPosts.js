
const app = getApp()
const db = wx.cloud.database({})
const _ = db.command;
const cloudDB = wx.cloud;
var that = null;
Page({
  data: {
    avatarurl:"",
    openid:"",
    dataList: [],
    zan:{
      value: 1,
    },
  },
  onLoad: function(e){
   
    this.getOpenid();
    var openid = this.data.openid
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
  
  getOpenid: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        var openid = res.result.openid;
        that.setData({
          openid : openid
        })
        console.log("openid存入data已完毕..." , that.data.openid)
        that.test();
      }

    })
  },
  test(){
    var openId = this.data.openid;
    db.collection('forum').where({
      _openid: openId
    }).get().then((res)=>{
      
      const userinfo = res.data[0]
      const avatarurl = userinfo.avatarUrl;
      this.setData({avatarurl : avatarurl})
    })

    db.collection('forum').where({
      _openid: openId
    }).get().then((res)=>{
      let items = res.data.map(item =>{
        item.data = app.nowdate(item.date);
        return item;
      })
      console.log("items: ",items[0]._id)
      const publish = res.data.reverse();
      this.setData({
        dataList : publish,
        dataList : items
      })
      console.log("dataList: ",this.data.dataList)
    })
  },
  


})