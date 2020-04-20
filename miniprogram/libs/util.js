const moment = require('moment.js');
function timestampToString(timestamp) {
  moment.locale('zh-cn', {
    longDateFormat: {
      l: "YYYY-MM-DD",
      L: "YYYY-MM-DD HH:mm:ss"
    }
  });
  return moment(timestamp).format('L');
}

function login(){
  wx.checkSession({
    success() {
      console.log('session_key 未过期，并且在本生命周期一直有效')
      return true
    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
      console.log('session_key 已经失效，需要重新执行登录流程')
      wx.login({
        success(res) {
          if (res.code) {
            // 发起网络请求
            console.log('登陆成功' + res.code)
            wx.cloud.callFunction({
              name: 'getSession',
              data: { code: res.code },
              success: res => {
                console.log(res.result)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            return false
          }
        }
      })
    }
  })
}

function relogin(){
  wx.login({
    success(res) {
      if (res.code) {
        // 发起网络请求
        console.log('登陆成功' + res.code)
        wx.cloud.callFunction({
          name: 'getSession',
          data: { code: res.code },
          success: res => {
            console.log(res.result)
          }

        })
      } else {
        console.log('登录失败！' + res.errMsg)
        return false
      }
    }
  })

}

module.exports = {
  timestampToString: timestampToString,
  login:login,
  relogin:relogin
} 
