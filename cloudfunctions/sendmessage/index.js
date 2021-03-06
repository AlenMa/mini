// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('测试')
  const TEMPLATE_ID=event.template_id
  let PAGE = event.page
  if (typeof (PAGE) === "undefined") {
    PAGE ='/pages/index/index'
  }
  const SENDDATA=event.senddata
 
  const result = await db.collection('settings').doc('XElYeVsqTi00tmBz').get()
  const access_token = result.data.token
  const {
    OPENID,
    APPID,
    UNIONID,
  } = cloud.getWXContext()
  console.log(OPENID)
  const result2 = await db.collection('formIdlist').where({ _openid: OPENID, isactive: true }).get()
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
        template_id: TEMPLATE_ID,
        page: PAGE,
        form_id: formid,
        "data": SENDDATA
      },
      json: true
    };
    //获取AccessToken
    // const resultValue = await rp(AccessToken_options);
    // const errmsg1 = resultValue.errmsg;
    const result = await cloud.openapi.templateMessage.send({
      touser: OPENID,
      page: PAGE,
      data: SENDDATA,
      templateId: TEMPLATE_ID,
      formId: formid
    })
    console.log(result)
    return result

    // return {
    //   errmsg: errmsg1
    // }
  }else{
    return{
      errmsg:'no formid'
    }
  }

}