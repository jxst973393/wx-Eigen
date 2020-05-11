// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { key, vlue, _id} = event
  return db.collection('users').doc(_id).update({
    data: {
      [key]: vlue
    }
  })
}