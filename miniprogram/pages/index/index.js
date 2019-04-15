// pages/index/index.js
const app = getApp()
const md5 = require('../../libs/md5.js');
const util = require('../../libs/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.relogin()

    // let b64 = md5.hexMD5('13687442129\n');
    // console.log(b64)
    // const db = wx.cloud.database()
    // const _ = db.command
    // db.collection('mobiletest3').where({ mobileno: b64 }).get({
    //   success: res => {
    //     console.log(res)

    //   },
    //   fail: err => {
    //     console.log(err)

    //   }
    // })
    // db.collection('mobiletest3').count({
    //   success: res => {
    //     console.log(res)

    //   },
    //   fail: err => {
    //     console.log(err)

    //   }
    // })
    // 获取用户信息
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       // 发起网络请求
    //       console.log('登陆成功'+res.code)
    //       wx.cloud.callFunction({
    //         name:'getSession',
    //         data:{code:res.code},
    //         success:res=>{

    //         }

    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
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
      success:res=>{
        if (!res.authSetting['scope.werun']){
          wx.authorize({
            scope: 'scope.werun',
            success:res=>{
              wx.getWeRunData({
                success(res) {
                  const encryptedData = res.encryptedData
                  const iv = res.iv
                  console.log('encryptedData:' + encryptedData)
                  console.log('vi:' + iv)
                }
              })

            },
            fail:res=>{
              wx.showModal({
                title: '提示',
                content: '请开启授权',
                success:res=>{
                  wx.openSetting({
                    success:res=>{
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

        }else{
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

