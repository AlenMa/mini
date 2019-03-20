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
    questiones: [['手机无信号', '手机信号不畅'], []],
    questionindex: [0, 0],
    location: '请选择您的故障位置',
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
    if(e.detail.column==0){
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
        console.log(res)
        this.setData({
          location: res
        })

      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  submit: function () {
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
    } else if (this.data.location == '请选择您的故障位置') {
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
          rec_timestamp: new Date().getTime()
        },

        success: res => {
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
    console.log(util.timestampToString(new Date().getTime(), 'L'))

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

  formSubmit: function (e) {
    this.formids.push(e.detail.formId);
    console.log('所有的formid', this.formids);
    console.log(this.formids);
    const db = wx.cloud.database();
    const _ = db.command;


    // db.collection('netreportformid').add({
    //   data: {
    //     openid: app.globalData.openid,
    //     formids:this.formids,
    //     rec_time: util.timestampToString(new Date().getTime(), 'L'),
    //     rec_timestamp: new Date().getTime()
    //   },

    //   success: res => {
    //     console.log('插入成功')
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'addformids',
      // 传给云函数的参数
      data: {
        formids: this.formids
      },
      // 成功回调
      complete: console.log
    })

    this.submit();
  },
  formSubmit1: function (e) {
    this.formids.push(e.detail.formId);
  },
  formids:[]
})