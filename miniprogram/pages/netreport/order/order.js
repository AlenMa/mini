Page({
  data: {
    current: 0,
    question:'',
    location:'',
    type:'',
    mobile:'',
    rectime:''
  },
  onClick() {
    const current = this.data.current + 1 > 2 ? 0 : this.data.current + 1

    this.setData({
      current,
    })
  },
  onLoad: function (options){
    console.log(options)
    let orderid =options.id;
    const db=wx.cloud.database();
    db.collection('netreport').doc(orderid).get({
      success:res=>{
        console.log('请求成功')
        console.log(res)
        this.setData({
          question: res.data.question,
          current:res.data.current,
          mobile:res.data.mobile,
          rectime: res.data.rec_time,
          location:res.data.location,
          type: res.data.addressType
        })
      },
      fail:res=>{
        console.log('请求失败')
      }
    })
    
  }
})
