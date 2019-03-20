// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let formids=event.formids;
  for (var i = 0; i < formids.length;i++){
    console.log('test:')
    console.log(formids[i])
    await db.collection('netreportformid').add({
      data: {
        openid: wxContext.OPENID,
        formid: formids[i],
        rec_timestamp: new Date().getTime(),
        ifuse:0

      },

      success: res => {
        console.log('插入成功')
      },
      fail: err => {
        console.log(err)
      }
    })
    console.log('test2:')
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}