// miniprogram/pages/PK/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity:{}

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var activity = this.data.activity;
    var radioItems=activity.choices
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].code == e.detail.value;
    }
    activity.choices=radioItems

    this.setData({
      activity: activity
    });
  },
  formSubmit(e){
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const db=wx.cloud.database()
    const _=db.command
    db.collection('pk_activities').doc(options.id).get({
      success:res=>{
        this.setData({
          activity:res.data
        })
        console.log(res)
      },
      fail:err=>{
        console.log(err)
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

  }
})