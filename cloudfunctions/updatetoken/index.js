// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
//npm   install  request-promise
const rp = require('request-promise');
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const result=await db.collection('settings').doc('XElKKonnuWjciv3b').get()
  const appid=result.data.appid;
  const secret = result.data.secret;
  const AccessToken_options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
      appid,
      secret,
      grant_type: 'client_credential'
    },
    json: true
  };
  //获取AccessToken
  const resultValue = await rp(AccessToken_options);
  const token = resultValue.access_token;
  await db.collection('settings').doc('XElYeVsqTi00tmBz').update({
    data: {
      token: token,
      updatetime: new Date().getTime()
    },
    success: res => {
      console.log(res)
    },
    fail: err => {
      console.log(err)
    }
  })
  return { token }
}