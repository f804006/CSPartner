var app = getApp()
const db = wx.cloud.database()
Page({


  data: {
    user: {},
    note: {},
    options: {}
  },
  onLoad: function(options) {
    var that = this
    console.log(options)
    
    db.collection('Note_Info').doc(options.id).get({
      success(res){
        that.setData({
          note:res.data
        })
      }
    })


  },

  textareaBInput: function(e) {
    console.log(e)
    var that = this
    var newnote = this.data.note
    newnote.content = e.detail.value
    this.setData({
      note: newnote
    })
    db.collection('Note_Info').doc(that.data.note._id).update({
      data: {
        content: that.data.note.content
      },
      success: function (res) {
        
      }
    })

  },
  todelete: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该记录吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        
          db.collection('Note_Info').doc(id).remove({
            success: res => {
              console.log(res)
              
              wx.redirectTo({
                url: '../notes?id=' + that.data.note.Itemid,
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: console.error
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



  }

})