// miniprogram/pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions:null,
    start:1,
    pageNo:0,
    isclear:false,
    result:false,
    quesState:'learn', //learn-学习状态 test-考试状态 result-考试结果 
    buttonState:'测试',
    pageArray:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
    17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
    41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58],
    scrollTop:0,
    height:0,
    ischecked:false
  },
  handleQuestion(){
    this.setData({
      scrollTop: 0
    })
    if(this.data.quesState=='test'){
      this.setData({
       
        buttonState: '测试',
        quesState: 'result'

      }
      )
    }else if(this.data.quesState=='learn'){
      this.setData({
        buttonState: '提交',
        quesState: 'test',
        ischecked:false
      }
      )
    }else if(this.data.quesState=='result'){
      this.setData({
        buttonState: '提交',
        quesState: 'test',
        ischecked: false
      }
      )

    }
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var selected=e.detail.value
    var index=0
    var selectedvalue = []
    if (selected.length>0){
      index = selected[0].split('-')[1]
    }
    var selectedvalue=[]
    for(var i=0;i<selected.length;i++){
      selectedvalue.push(selected[i].split('-')[0])
    }
    var qname = 'questions' + '[' + index + ']' + '.selected'
    this.data.questions[index].selected=selectedvalue
    this.setData({
      [qname]: selectedvalue
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var selected = e.detail.value
    var index = 0
    var selectedvalue=[]
    if (selected.length > 0) {
      index = selected.split('-')[1]
      selectedvalue.push(selected.split('-')[0])
    }
    var qname = 'questions' + '[' + index + ']' +'.selected'
    this.setData({
      [qname]: selectedvalue
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pageNo: e.detail.value
    })
    wx.navigateTo({
      url: '../question/question?pageNo='+this.data.pageNo,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (options) => {
        var ht = options.windowHeight; // 页面高度
        this.setData({ height: ht })
      }
    });
    if (options.pageNo != undefined) {
      this.setData({
        pageNo: parseInt(options.pageNo)
      })
    }
    const db = wx.cloud.database();
    const _ = db.command
    var selectnum = this.data.start + this.data.pageNo * 20
    db.collection('tiku01').where({ xuhao: _.gte(selectnum).and(_.lte(2000))}).get({
      success: res => {
        this.setData({
          questions: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
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