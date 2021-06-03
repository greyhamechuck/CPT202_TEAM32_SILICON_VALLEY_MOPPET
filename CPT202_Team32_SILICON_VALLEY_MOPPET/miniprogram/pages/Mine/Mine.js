// miniprogram/pages/Mine.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var that = null;
Page({
  data: {
    userInfo: {},
    motto: 'Hello World',
    hasUserInfo:false,
    canIUseGetUserProfile: false

  },
  onLoad: function () {

    var openId = wx.getStorageSync('_openid');//根据openid判断用户有没有授权登录过。如果登录过，直接查用户的信息以及相关功能。如果未登录过。将显示“登录”按钮，让用户登录。
    db.collection('users').where({
      _openid:openID
    }).get()
    .then(result => {
      console.log(result);
    if(openId){
      console.log("alalla")
     }//执行已登录过后的操作
    else {console.log("nooo") } //没有登录的操作
    })
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: 'Get the avatar and nickname', 
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      let infor = res.userInfo
      wx.setStorageSync('userInfo', infor)
      db.collection('users').add({
             data:{
               username : infor.nickName,
               userhead : infor.avatarUrl,
               time: new Date()
             }
           }).then((res)=>{
             console.log(res);
           });

      
     }
    })
  },
  
})

