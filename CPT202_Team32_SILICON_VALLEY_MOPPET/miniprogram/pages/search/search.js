// pages/search/search.js
const app = getApp();
const db = wx.cloud.database()
const _ = db.command;
const cloudDB = wx.cloud;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Datas:[]
  },
  
  /**
   * 发送请求获取搜索数据
   * @param {*} query 
   */
  async qsearch(query){
    cloudDB.callFunction({
      name: 'hole-textsec',
      data: {
        content: query
      } 
    }).then(res => {
      console.log('搜索返回值:',res)
      if(res.result.data) {
      console.log('cunfang:',res.result.data)

        this.setData({
          Datas: res.result.data
        })
      }
    }).catch(res => {
      console.log('er:',res)
      wx.showToast({
        title: '搜索失败1',
        icon: 'error',
        duration: 2000
      })
    })
  },

  /**
   * 点击跳转帖子
   * @param {*} e 
   */
  todetail(e){
    app.globalData.item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  
  // 输入框的值改变  就(会触发的事件
  search(e){
    // 1.获取输入框的值
    const {value} = e.detail;
    // 2.验证合法性
    if(value === '' || value === undefined){
      this.setData({
        Datas: [],
      })
      // 值不合法
      return
    }
    // 3.准备发送请求获取数据
    this.qsearch(value);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const value = options.value
    console.log('跳转进来的:',options)
    this.qsearch(value)
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