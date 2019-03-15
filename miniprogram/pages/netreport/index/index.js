// miniprogram/pages/netreport/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressTypes: ['室内（地下）', '室内（1-8层）', '室内（8层以上）', '室外'],
    addressTypeindex: 0,
    questiones: ['手机无信号', '手机信号不畅'],
    questionindex: 0,
    location: '请选择您的故障位置',
    mobile:''


  },
  bindAddressTypeChange: function (e) {
    console.log('picker AddressType 发生选择改变，携带值为', e.detail.value);

    this.setData({
      addressTypeindex: e.detail.value
    })
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
          question: this.data.questiones[this.data.questionindex]
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