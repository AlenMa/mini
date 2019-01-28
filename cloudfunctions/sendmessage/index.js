// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const result = await db.collection('settings').doc('XElYeVsqTi00tmBz').get()
  const access_token = result.data.token
  const {
    OPENID,
    APPID,
    UNIONID,
  } = cloud.getWXContext()
  const result2 = await db.collection('formIdlist').where({ openid: OPENID, isactive: true }).get()
  const formid = result2.data[0].formId
  if (formid != undefined) {
    const id = result2.data[0]._id
    db.collection('formIdlist').doc(id).update({
      data: {
        isactive: false
      }
    })

    const AccessToken_options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send',
      qs: {
        access_token
      },
      body: {
        touser: OPENID,
        template_id: "NlUcvKpHEP67kYq-oZyPaZ49ihC7w5AI3ATxwEvWB0w",
        page: "/pages/index/index",
        form_id: formid,
        "data": {
          "keyword1": {
            "value": "339208499"
          },
          "keyword2": {
            "value": "测试"
          },
          "keyword3": {
            "value": "测试"
          },
          "keyword4": {
            "value": "测试"
          }
        }
      },
      json: true
    };
    //获取AccessToken
    const resultValue = await rp(AccessToken_options);
    const errmsg1 = resultValue.errmsg;


    const wxContext = cloud.getWXContext()

    return {
      errmsg: errmsg1
    }
  }

}