//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    inputVal:"",
    inputShowed:false,
    resultshowd:true,
    searchIconSrc:'../../../images/search.png',
    searchholder:'搜索'

  },
  

  onLoad: function() {
    try {
      const value = wx.getStorageSync('logged')
      if (value) {
        console.log(this.data.logged)
        console.log(value)
        this.setData(
          { logged: value}
        )
        console.log(this.data.logged)
      }else{
        wx.setStorageSync('logged', false)
      }
    } catch (e) {
      console.log('test2')
    }
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }




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
  //键盘输入绑定
  inputTyping:function(e){
    inputShowed:false


  },
  showInput:function(e){
    this.setData({
      inputShowed:true
    })

  },
  hideInput:function(e){
    this.setData({
      inputShowed: false,
      searchIconSrc: '../../../images/search.png',
      searchholder: '搜索'
    })

  },

  onSearchTpye:function(e){
    let type=e.target.dataset.type;
    console.log(type)
    if(type=='title'){
      console.log('搜索题干')
      this.setData({ searchIconSrc:'../../../images/title.png',
        searchholder:'搜索题干'})

    }else if(type=='choices'){
      console.log('搜索选项')
      this.setData({ searchIconSrc: '../../../images/choices.png',
        searchholder: '搜索选项'})
    }


  },
  formSubmit:function(e) {
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
      const template_id ="zLcuJW1wzvtdKOjlVoA1B2uargQAeXTG5bJl760j3g4"
      const mydate=new Date()
      const mydate2 = mydate.toLocaleString()
      console.log(mydate2)
      const senddata = {
        "keyword1": {
          "value": "你支持什么豆花"
        },
        "keyword2": {
          "value": this.data.userInfo.nickName
        },
        "keyword3": {
          "value": "甜"
        },
        "keyword4": {
          "value": mydate2
        },
        "keyword5": {
          "value": "将于明天开奖"
        }
      }
      wx.cloud.callFunction({
        name: 'sendmessage',
        data: { template_id: template_id,
          senddata: senddata
        },
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
      wx.setStorageSync('logged', true)
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
