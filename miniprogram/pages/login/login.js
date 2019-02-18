// miniprogram/pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logosrc:'../../images/alenma.png'

  },

  formSubmit(e) {
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection("formIdlist").add({
      data: {
        formId: e.detail.formId,
        openid: app.globalData.openid,
        isactive: true,
        subtime: Number(new Date())
      },
      success: res => {
        console.log('提交formId成功：', res)
      },
      fail: err => {
        console.log('提交formId失败：', err)

      }
    })
  },

  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      wx.navigateBack({
        delta:1
      })
      wx.setStorageSync('logged', true)
    }else{
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
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