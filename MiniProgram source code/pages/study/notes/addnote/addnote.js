
var util = require('../../../../utils/util.js');
var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newnote_content: '',
    id:'',
    time: '',
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thistime = util.formatTime(new Date());
    this.setData({
      id: options.id,
      time: thistime
    })
  },

  gettextarea: function (e) {
    console.log(e.detail.value)
    this.setData({
      newnote_content: e.detail.value
    })
  },

  toaddnote: function (e) {
    if (this.data.newnote_content == "") {
      wx.showToast({
        title: '啥也没写呢~',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var that = this

      // })
      
      var thistime = util.formatTime(new Date());
      db.collection('Note_Info').add({
        data: {
          Itemid: that.data.id,
          content: that.data.newnote_content,
          time: thistime
        },
        success: function (res) {
          console.log(res)

          wx.redirectTo({
            url: '../notes?id=' + that.data.id,
          })
          wx.showToast({
            title: '添加成功~',
            icon: 'success',
            duration: 2000
          })
        },
        fail: console.error
      })
    }

  }

})