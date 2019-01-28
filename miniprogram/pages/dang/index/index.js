//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: true,
    takeSession: false,
    requestResult: ''
  },
  

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                logged:true
              })
            }
          })
        }else{
          this.setData({
            logged:false
          })
        }
      }
    })
  },
  formSubmit(e) {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection("formIdlist").add({
      data:{
        formId: e.detail.formId,
        openid:app.globalData.openid,
        isactive:true,
        subtime: Number(new Date())
      },
      success:res=>{
        console.log('提交formId成功：',res)
      },
      fail:err=>{
        console.log('提交formId失败：' ,err)
    
      }
    })
    if(e.detail.target.dataset.type=="ques"){
      console.log('ques')
      // wx.redirectTo({
      //   url: '../question/question',
      // })
      wx.navigateTo({
        url: '../question/question',
      })

    } else if (e.detail.target.dataset.type == "wronglist"){
      console.log('wronglist')
      wx.navigateTo({
        url: '../wrongList/wrongList',
      })
      wx.cloud.callFunction({
        name: 'sendmessage',
        data: {},
        success: res => {
          console.log('[云函数] [sendmessage] user errmsg: ', res.result.errmsg)
          
        },
        fail: err => {
          console.error('[云函数] [sendmessage] 调用失败', err)
        }
      })

    }
    console.log('form发生了submit事件，携带数据为：', e.detail)
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
