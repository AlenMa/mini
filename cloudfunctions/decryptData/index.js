// 云函数入口文件
const cloud = require('wx-server-sdk')
const WXBizDataCrypt = require('./WXBizDataCrypt')


cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const OPENID=wxContext.OPENID
  const APPID=wxContext.APPID
  const encryptedData = event.encryptedData
  const iv=event.iv
  var result=await db.collection('session').get({openid:OPENID})
  if(result.data.length!=0){
    const session_key = result.data[0]['session_key']
    var pc = new WXBizDataCrypt(APPID, session_key)
    var rundata = pc.decryptData(encryptedData, iv)
    return {rundata:rundata}
    
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}