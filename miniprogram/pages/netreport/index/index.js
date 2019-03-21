// miniprogram/pages/netreport/index/index.js
const app = getApp()
const util = require("../../../libs/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressTypes: ['室内（地下）', '室内（1-8层）', '室内（8层以上）', '室外'],
    addressTypeindex: 0,
    questiones: [['手机无信号', '手机信号不畅'], ['']],
    questionindex: [0, 0],
    location: { name: '请选择您的故障位置' },
    mobile: ''


  },
  bindAddressTypeChange: function (e) {
    console.log('picker AddressType 发生选择改变，携带值为', e.detail.value);

    this.setData({
      addressTypeindex: e.detail.value
    })
  },

  bindQuestionColumnChange: function (e) {
    console.log(e)
    var data = {
      questiones: this.data.questiones,
      questionindex: this.data.questionindex

    }
    data.questionindex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      switch (data.questionindex[0]) {
        case 0:
          data.questiones[1] = []
          data.questionindex[1] = 0;
          break;
        case 1:
          data.questiones[1] = ['语音通话问题', '手机上网问题', '语音上网都有问题']
          data.questionindex[1] = 0;
          break;

      }
      this.setData(data)
    }

  },

  bindQuestionChange: function (e) {
    console.log('picker question 发生选择改变，携带值为', e.detail.value);

    this.setData({
      questionindex: e.detail.value
    })
  },

  chooselocation: function (e) {
    console.log('picker question 发生选择改变，携带值为', e.detail.value);
    wx.chooseLocation({
      success: res => {
        if(res.address.indexOf('佛山')!=-1){
        this.setData({
          location: res
        })}else{
          wx.showToast({
            title: '请选择佛山地区地址',
          })
        }

      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  getformid: function (e) {
    console.log(e.detail.formId)

    let formid = e.detail.formId
    if (formid !='the formId is a mock one'){
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('formIdlist').add({
      data: {
        formId: formid,
        openid: app.globalData.openid,
        isactive: true,
        subtime: Number(new Date())
      },

      success: res => {
        console.log('插入成功')
      },
      fail: err => {
        console.log(err)
      }
    })
    }

  },

  submit: function (e) {
    console.log(this.data.mobile)
    if (this.data.mobile == '') {
      console.log(this.data.mobile)
      wx.showModal({
        title: '提示',
        content: '请输入联系电话',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.location.name == '请选择您的故障位置') {
      wx.showToast({
        title: '请选择故障位置',

      })
    } else {
      const db = wx.cloud.database();
      const _ = db.command;
      wx.showLoading({
        title: '加载中',
      })


      db.collection('netreport').add({
        data: {
          openid: app.globalData.openid,
          location: this.data.location,
          mobile: this.data.mobile,
          addressType: this.data.addressTypes[this.data.addressTypeindex],
          question: this.data.questiones[0][this.data.questionindex[0]] + ' ' + this.data.questiones[1][this.data.questionindex[1]],
          rec_time: util.timestampToString(new Date().getTime(), 'L'),
          rec_timestamp: new Date().getTime(),
          current:0
        },

        success: res => {
          console.log('提交成功')
          console.log(res)
          let orderid = res._id
          const senddata = {
            "keyword1": {
              "value": this.data.questiones[0][this.data.questionindex[0]] + ' ' + this.data.questiones[1][this.data.questionindex[1]]
            },
            "keyword2": {
              "value": this.data.location.name
            },
            "keyword3": {
              "value": util.timestampToString(new Date().getTime(), 'L')
            }
          }
          wx.cloud.callFunction({
            name: 'sendmessage',
            data: {
              template_id: 'I4vH8ne9V6q1jgZ9pi7hCMsOWg_cF0g43bJRduotTO8',
              senddata: senddata,
              page:'/pages/netreport/order/order?id='+orderid
            },
            success: res => {
              console.log('[云函数] [sendmessage] user errmsg: ', res.result.errmsg)

            },
            fail: err => {
              console.error('[云函数] [sendmessage] 调用失败', err)
            }
          })
          wx.redirectTo({

            url: '../success/success',
          })
        },
        fail: err => {
          console.log(err)
        }
      })


    }



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})