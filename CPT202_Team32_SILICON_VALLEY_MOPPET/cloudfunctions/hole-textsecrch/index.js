const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

const command = db.command;

exports.main = async (event, context) => {
  return await db.collection('forum').where({
    content: command.in(event.text)
  })
}
