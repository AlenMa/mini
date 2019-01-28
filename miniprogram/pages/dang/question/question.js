// miniprogram/pages/question/question.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions:null,
    start:1,
    pageNo:1,
    quesState:'learn', //learn-学习状态 test-考试状态 result-考试结果 
    buttonState:'测试',
    pageArray:[],
    scrollTop:0,
    height:0,
    ischecked:false,
    wronglist:[]
  },
  //对本页进行测试
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
  //多选判断对出错
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
  //单选判断对错
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
  //选页
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pageNo=this.data.pageArray[e.detail.value]
    this.setData({
      pageNo: pageNo
    })
    this.loadData(pageNo)
  },
  nextPage(e){
    var pageNo=this.data.pageNo+1
    this.loadData(pageNo)
    this.setData({
      pageNo: pageNo
    })

  },
  //添加错题
  addWrong(e){
    console.log(e.target.dataset.xuhao)
    var xuhao=e.target.dataset.xuhao;
    var arr = this.data.wronglist;
    if(arr.indexOf(xuhao)==-1){
      arr.push(xuhao)
      this.setData({
        wronglist:arr
      })
      
    }else{
      console.log('已存在')
    }

  },
    /**
   * 加载每页数据
   */
  loadData:function(pageNo){
    //加载题目
    const db=wx.cloud.database();
    const _=db.command
    var selectNum=this.data.start+(pageNo-1)*20
    db.collection('tiku01').where({xuhao:_.gte(selectNum).and(_.lte(selectNum+20))}).get({
      success:res=>{
        this.setData({
          questions:res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)

      },
      fail:err=>{
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)

      }
    })



  },
  getWrongList:function(){
    const db = wx.cloud.database();
    const _ = db.command
    //加载错题本
    db.collection('wronglist').where({ openid: app.globalData.openid })
      .get({
        success: res => {
          if (res.data.length != 0) {
            this.setData({
              wronglist: res.data[0].wronglist
            }) 
          } else {
            this.setData({
              wronglist:[]
            }) 
          }

        },
        fail: err => {
          console.log(err)

        }
      })

  },
      /**
   * 获取总页数
   */
  getPageCount: function () {
    const db = wx.cloud.database();
    const _ = db.command
    db.collection('tiku01').count({
      success: res => {
        var arr = [];
        var pageCount =parseInt(res.total/20)+1
        for (var i = 1; i <= pageCount; i++) {
          arr.push(i);
        }
        
        this.setData({
          pageArray: arr
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
   * 错题本同步
   */
  updateWrongList:function(){
    const db=wx.cloud.database();
    const _=db.command;
    var u_openid = app.globalData.openid
    db.collection('wronglist').where({ openid: u_openid}).get({
      success:res=>{
        if(res.data.length==0){
          db.collection('wronglist').add({
            data:{
              openid: app.globalData.openid,
            wronglist: this.data.wronglist,
            tknum:"01"},
            success:res=>{
              console.log(res)
            },
            fail:err=>{
              console.log(err)
            }
          }

          )

        }else{
          console.log("更新错题本")
          var doc_id=res.data[0]._id
          var u_openid=app.globalData.openid;
          db.collection('wronglist').doc(doc_id).update({
            data:{
              wronglist: this.data.wronglist
          },
          success:res=>{
            console.log(res)
          },
          fail:err=>{
            console.log(err)
          }
          })


        }

      },
      fail:err=>{
        wx.showToast({
          title: '查询记录失败',
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
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
    this.getPageCount()
    this.getWrongList()
    this.loadData(1)
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
    this.updateWrongList()

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
    return {
      title: '党建题库',
      path: '/pages/index/index'
    }

  }
})