App({
  onLaunch: function () {
    wx.cloud.init({
      // env: 'cloud1-1g2orxmmbe6151b3',
      traceUser: true
    });

    const cloudDB = wx.cloud.database()
    this.globalData.cloudDB = cloudDB
  },
  globalData: {
    cloudDB: undefined,
    item: {}
  },
  nowdate(now_threshold) {
    var da = new Date(now_threshold);
    var delta = new Date() - da;
    now_threshold = parseInt(now_threshold, 10);
    if (isNaN(now_threshold)) {
      now_threshold = 0;
    }
    if (delta <= now_threshold) {
      return 'just';
    }
    var units = null;
    var conversions = {
      'ms': 1,
      'sec': 1000,
      'min': 60,
      'hour': 60,
      'day': 24,
      'month': 30,
      'year': 12
    };
    for (var key in conversions) {
      if (delta < conversions[key]) {
        break;
      } else {
        units = key;
        delta = delta / conversions[key];
      }
    }
    delta = Math.floor(delta);
    return [delta, units].join(" ") +" "+ "ago";
  }
})