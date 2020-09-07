// 在需要使用的js文件中，导入js
var util = require('../../utils/util.js');
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    inspire:'',
    userinfo:{},
    count:0
  },
  onLoad: function () {
    var date = new Date();
    var myDate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    this.setData({
      myDate: myDate
    });
    var that = this
    setInterval(function () {
      //考研时间
      var t1 = new Date("2020/12/19 00:00:00")

      var t0 = new Date()
      var t = new Date(t1 - t0 + 16 * 3600 * 1000)
      that.setData({
        d: parseInt(t.getTime() / 1000 / 3600 / 24),
        h: t.getHours(),
        m: t.getMinutes(),
        s: t.getSeconds(),
      })
    }, 1000)
    this.getInspire();
  },
  getInspire(){
    var that = this
    db.collection('User_Info').where({
      _openid: app.globalData.openid
    }).get({
      success(res){
        that.setData({
          inspire:res.data[0].inspire,
          userinfo:res.data[0]
        })
      }
    })
  },
  clickHandler: function () {
    this.setData({
      count: this.data.count + 1
    });
    
    var temp = this.data.userinfo
    var that = this
    db.collection("User_Info").doc(temp._id).update({
      data:{
        cnt:temp.cnt+1
      },success(res){
        temp.cnt = temp.cnt + 1
        that.setData({
          userinfo:temp
        })
      }
    })
  },
  change(e){
    this.setData({
      inspire:e.detail.value
    })

    db.collection('User_Info').doc(this.data.userinfo._id).update({
      data:{
        inspire: e.detail.value
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '考研倒计时',
      desc: '看看还有多少天考试',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  }
})