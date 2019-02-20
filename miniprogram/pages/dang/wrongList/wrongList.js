// miniprogram/pages/wronglist/wronglist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: null,
    start: 1,
    pageNo: 1,
    isclear: false,
    result: false,
    quesState: 'learn', //learn-学习状态 test-考试状态 result-考试结果 
    buttonState: '测试',
    pageArray: [],
    scrollTop: 0,
    height: 0,
    ischecked: false,
    wronglist: [],
  },
  //对本页进行测试
  handleQuestion() {
    this.setData({
      scrollTop: 0
    })
    if (this.data.quesState == 'test') {
      this.setData({

        buttonState: '测试',
        quesState: 'result'

      }
      )
    } else if (this.data.quesState == 'learn') {
      this.setData({
        buttonState: '提交',
        quesState: 'test',
        ischecked: false
      }
      )
    } else if (this.data.quesState == 'result') {
      this.setData({
        buttonState: '提交',
        quesState: 'test',
        ischecked: false
      }
      )

    }
  },
  //多选判断对出错
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var selected = e.detail.value
    var index = 0
    var selectedvalue = []
    if (selected.length > 0) {
      index = selected[0].split('-')[1]
    }
    var selectedvalue = []
    for (var i = 0; i < selected.length; i++) {
      selectedvalue.push(selected[i].split('-')[0])
    }
    var qname = 'questions' + '[' + index + ']' + '.selected'
    this.data.questions[index].selected = selectedvalue
    this.setData({
      [qname]: selectedvalue
    })
  },
  //单选判断对错
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var selected = e.detail.value
    var index = 0
    var selectedvalue = []
    if (selected.length > 0) {
      index = selected.split('-')[1]
      selectedvalue.push(selected.split('-')[0])
    }
    var qname = 'questions' + '[' + index + ']' + '.selected'
    this.setData({
      [qname]: selectedvalue
    })
  },
  //选页
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pageNo = this.data.pageArray[e.detail.value]
    this.setData({
      pageNo: pageNo
    })
    this.loadData(pageNo)
  },
  nextPage(e) {
    var pageNo = this.data.pageNo + 1
    this.loadData(pageNo)
    this.setData({
      pageNo: pageNo
    })

  },
  deleteWrong(e){
    console.log(e.target.dataset.xuhao)
    var xuhao = e.target.dataset.xuhao;
    var arr = this.data.wronglist;
    if (arr.indexOf(xuhao) != -1) {
      arr[arr.indexOf(xuhao)]=-1
      // delete arr[arr.indexOf(xuhao)]
      // arr.splice(arr.indexOf(xuhao),1)
      this.setData({
        wronglist: arr
      })
      this.deleteQues(xuhao)
    } else {
      console.log('不存在')
    }
  },
  //选页
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pageNo = this.data.pageArray[e.detail.value]
    this.setData({
      pageNo: pageNo
    })
    this.loadData(pageNo)
  },
  nextPage(e) {
    var pageNo = this.data.pageNo + 1
    this.loadData(pageNo)
    this.setData({
      pageNo: pageNo
    })

  },
  deleteQues:function(xuhao){
    var ques = this.data.questions
    for(var i=0;i<ques.length;i++){
      if(ques[i].xuhao==xuhao){
        ques.splice(i,1)
      }
    }
    console.log(ques)
    this.setData({
      questions:ques
    })

  },

  /**
* 错题本同步
*/
  updatewronglist: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    var u_openid = app.globalData.openid
    var wlist=this.data.wronglist
    for(var i=0;i<wlist.length;i++){
      if(wlist[i]==-1){
        wlist.splice(i,1)
      }
    }
    wlist.sort(((a,b)=>a-b))
    this.setData({
      wronglist:wlist
    })
    db.collection('wronglist').where({ openid: u_openid }).get({
      success: res => {
        if (res.data.length == 0) {
          db.collection('wronglist').add({
            data: {
              openid: app.globalData.openid,
              wronglist: this.data.wronglist,
              tknum: "01"
            },
            success: res => {
              console.log(res)
            },
            fail: err => {
              console.log(err)
            }
          }

          )

        } else {
          console.log("更新错题本")
          var doc_id = res.data[0]._id
          var u_openid = app.globalData.openid;
          db.collection('wronglist').doc(doc_id).update({
            data: {
              wronglist: this.data.wronglist
            },
            success: res => {
              console.log(res)
            },
            fail: err => {
              console.log(err)
            }
          })


        }

      },
      fail: err => {
        wx.showToast({
          title: '查询记录失败',
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },

  /**
* 加载错题本
*/
  loadData: function (pageNo) {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database();
    const _ = db.command;
    var u_openid = app.globalData.openid
    var start=(pageNo-1)*20
    var end=start+20
    var pagewronglist=this.data.wronglist.slice(start,end)
    db.collection('tiku01').where({ xuhao: _.in(pagewronglist) }).get(
      {
        success: res => {
          this.setData({
            questions: res.data
          })
          wx.hideLoading()
          console.log(res)

        },
   
        fail: err => {
          console.log(err)

        }

      }
    )
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

    const db = wx.cloud.database();
    const _ = db.command
    //获得总页数
    db.collection('wronglist').where({ openid: app.globalData.openid }).get({
      success: res => {
        if (res.data.length != 0) {
          var wronglist = res.data[0].wronglist;
          var arr = [];
          var pageCount = parseInt(wronglist.length / 20) + 1
          for (var i = 1; i <= pageCount; i++) {
            arr.push(i);
          }
          this.setData({
            pageArray: arr,
            wronglist: wronglist
          })
          //加载错题
          this.loadData(1)
        }
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
    console.log(this.data.wronglist)


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
    this.updatewronglist()

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