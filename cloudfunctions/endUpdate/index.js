// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)
  const _ = db.command
  if (typeof event.myData == 'string') {
    //将传入字符串转换成正常对象
    console.log(event.myData)
    event.myData = eval('(' + event.myData + ')');
    //用json对象
    // event.myData = JSON.parse(event.myData )
  }
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection(event.collection).where({
      ...event.myWhere
    }).update({
      data: {
        ...event.myData 
      }
    })
  } catch (e) {
    console.log(e)
  }
}