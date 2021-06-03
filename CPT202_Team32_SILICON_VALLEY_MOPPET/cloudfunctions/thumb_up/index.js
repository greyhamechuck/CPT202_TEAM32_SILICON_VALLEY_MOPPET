// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => { 
  //取得传过来的参数, 可以使用{vote,id } = event 更简洁
    var clickcount = event.clickcount, id = event.id;
    console.log("shoudao")
    console.log('发动', clickcount, id)
    // console.warn(data)
    try {
      return await db.collection('forum').where({
        _id: id
      }).update({
        data: {
          clickcount: "3"
        },
        success: res => {
          console.log('云函数成功', clickcount, id)
        },
        fail: e => {
          console.error(e)
        }
      })
    } catch (e) {
      console.error(e)
    }
  
  }
