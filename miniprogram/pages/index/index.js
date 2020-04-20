// pages/index/index.js
const app = getApp()
const util = require('../../libs/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

   UnicodeToUtf8(unicode) {
    var uchar;
    var utf8str = "";
    var i;
    for(i = 0; i<unicode.length;i+= 2){
  uchar = (unicode[i] << 8) | unicode[i + 1];        //UNICODE为2字节编码，一次读入2个字节 
  utf8str = utf8str + String.fromCharCode(uchar);  //使用String.fromCharCode强制转换 
}
return utf8str; 
},
 Utf8ToUnicode(strUtf8) {
  var i, j;
  var uCode;
  var temp = new Array();
  for (i = 0, j = 0; i < strUtf8.length; i++) {
    uCode = strUtf8.charCodeAt(i);
    if (uCode < 0x100) {         //ASCII字符 
      temp[j++] = 0x00;
      temp[j++] = uCode;
    } else if (uCode < 0x10000) {
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else if (uCode < 0x1000000) {
      temp[j++] = (uCode >> 16) & 0xff;
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else if (uCode < 0x100000000) {
      temp[j++] = (uCode >> 24) & 0xff;
      temp[j++] = (uCode >> 16) & 0xff;
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else {
      break;
    }
  }
  temp.length = j;
  return temp;
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var teststr='mateng'
    var utfstr=this.UnicodeToUtf8(teststr)
    console.log(utfstr)
    console.log(teststr)

    util.login() //检验session
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              app.globalData.islogin = true
            }
          })
        } else {
          app.globalData.islogin = false
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    //获取openid
    wx.cloud.callFunction({
      name: 'getopenid',
      data: {},
      success: res => {
        console.log('[云函数] [getopenid] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [getopenid] 调用失败', err)
      }
    })
    //获取运动数据
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        const iv = res.iv
        console.log('encryptedData:' + encryptedData)
        console.log('iv:' + iv)
        wx.cloud.callFunction({
          name: 'decryptData',
          data: { encryptedData: encryptedData,
            iv: iv},
          success: res => {
            console.log(res)
          },
          fail: err => {
           
          }
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getlocation: function () {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.werun']) {
          wx.authorize({
            scope: 'scope.werun',
            success: res => {
              wx.getWeRunData({
                success(res) {
                  const encryptedData = res.encryptedData
                  const iv = res.iv
                  console.log('encryptedData:' + encryptedData)
                  console.log('vi:' + iv)
                }
              })

            },
            fail: res => {
              wx.showModal({
                title: '提示',
                content: '请开启授权',
                success: res => {
                  wx.openSetting({
                    success: res => {
                      wx.getWeRunData({
                        success(res) {
                          const encryptedData = res.encryptedData
                          const iv = res.iv
                          console.log('encryptedData:' + encryptedData)
                          console.log('vi:' + iv)
                        }
                      })
                    }

                  })
                }
              })
            }
          })
        } else {
          wx.getWeRunData({
            success(res) {
              const encryptedData = res.encryptedData
              const iv = res.iv
              console.log('encryptedData:' + encryptedData)
              console.log('vi:' + iv)
            }
          })

        }
      }
    })
  }
})

