const app = getApp();
const db = wx.cloud.database()
const _ = db.command;
const cloudDB = wx.cloud;
var that = null;
Page({
    /**
   * init value
   */
  data: {
    goods: [],
    items:[],
    isFocus: false,
    inputValue: ""
  },

  TimeId: -1,

  getToSearch(value) {
    console.log('e:', value);
    wx.reLaunch({
      url: '/pages/search/search?value=' + value,
    })
  },


  handleInput(e){
    const {value} = e.detail;
    console.log('value:',e)
    if(value === "" || value === undefined){
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      // this.qsearch(value);
      this.getToSearch(value);
    },1000)
  },
  handleCancel(){
    this.setData({
      inputValue: "",
      isFocus: false,
      goods: []
    })
  },

  /**
   * send request
   * @param {*} query 
   */
  async qsearch(query){
    cloudDB.callFunction({
      name: 'hole-textsec',
      data: {
        content: query
      } 
    }).then(res => {
      console.log('return value:',res)
      if(res.result.data) {
        this.setData({
          goods: res.result.data
        })
      }
    }).catch(res => {
      wx.showToast({
        title: 'fail',
        icon: 'error',
        duration: 2000
      })
    })
  },

  onLoad(){
    that = this;
  },
  onShow(){
    var that = this
    db.collection('forum').get()
    .then(result => {
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
    console.log(this.data.items)
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
    //TODO ?????????????????????
    let that = this;
    wx.showLoading({
        title: '?????????(' + count + ')',
    });
    //????????????4?????????
    const id = (Math.floor(Math.random() * (8999)) + 1000).toString();
    console.log('??????id:', id);
    wx.cloud.database().collection('admin').add({
        data: {
            _id: id
        }
    }).then(res => {
        //????????????????????????????????????
        console.log(res);
        wx.hideLoading();
        that.setData({
            number: res._id
        })
    }).catch(e => {
        //???????????????????????????????????????????????????????????????????????????????????????gg???
        that.toadmin(count + 1);
        console.log(e);
    })
    //TODO ?????????????????????
  },
  gotodetail(e){
    app.globalData.item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  thumbsup(e){
    app.globalData.item=e.currentTarget.dataset.item;
    var postid = e.currentTarget.dataset.item._id;
    or_thum = e.currentTarget.dataset.item.clickcount;
    console.log(postid)
    db.collection("forum").doc(postid).update({
      data:{
        clickcount:or_thum+1
      },
      success:res=>{
        console.log(res);
        wx.showToast({
          title: 'Thumb up success',
        })
        wx.switchTab({
          url: '../index/index',
        })
       }
    });
    this.onShow()
    console.log("we made it", e.currentTarget.dataset.item.clickcount)
    wuwu = wx.getStorageSync('_openid');
    console.log(wuwu)
    db.collection('likes').doc(wuwu).update({
      data: {
        id : postid,
      }
    })


  },



  init(){
  },

})