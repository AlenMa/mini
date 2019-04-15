// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');


cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const js_code = event.code
  const appid = 'wxce36b61a123a301f'
  const secret = '83daec131287d3792aa1a6be560e4470'
  const grant_type = 'authorization_code'
  console.log('js_code:' + js_code)
  console.log('appid:' + appid)
  console.log('secret:' + grant_type)
  const AccessToken_options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      js_code,
      appid,
      secret,
      grant_type
    }
  };
  console.log(AccessToken_options)

  const resultValue = await rp(AccessToken_options);
  const errmsg1 = resultValue.errmsg;
  const OPENID = wxContext.OPENID
  console.log('resultValue:' + resultValue)
  console.log('errmsg:' + typeof (resultValue.errmsg))
  const session_key = resultValue.session_key
  console.log('openid:' + OPENID)
  // if (typeof (resultValue.errmsg) == 'undefined') {
  var result=await db.collection('session').where({openid:OPENID}).get()
  console.log('result:'+result)
  if(result.data.length==0){
    var result2 = await db.collection('session').add({data: {
      openid: OPENID,
      session_key: session_key
    }})
    console.log('result2:' + result2)
  }else{
    var doc_id = result.data[0]._id
    var result3 = await db.collection('session').doc(doc_id).update({
      data: {
        session_key: session_key
      }})
    console.log('result3:' + result3)

  }

    // db.collection('session').where({
    //   openid: OPENID
    // }).get({
    //   success: res => {
    //     if (res.data.length == 0) {
    //       db.collection('session').add({
    //         data: {
    //           openid: OPENID,
    //           session_key: resultValue.session_key
    //         },
    //         success: res => {
    //           console.log('添加成功')
    //         },
    //         fail: err => {
    //           console.log(err)
    //         }
    //       })
    //     } else {
    //       var doc_id = res.data[0]._id
    //       db.collection('session').doc(doc_id).update({
    //         data: {
    //           session_key: resultValue.session_key
    //         },
    //         success: res => {
    //           console.log('更新成功')
    //         },
    //         fail: err => {
    //           console.log(err)
    //         }
    //       })

        // }
      // }
    // })
  



  return {
    errmsg1
  }
}