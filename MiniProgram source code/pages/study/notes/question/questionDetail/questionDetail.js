

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    QuestionInfo:{},
    AnwserFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    db.collection('Question_info').doc(options.id).get({
      success(res){
        that.setData({
          QuestionInfo:res.data
        })
      }
    })
  },
  AnwserFlagTap(){
    var that = this
    this.setData({
      AnwserFlag:!that.data.AnwserFlag
    })
  },
  deleteQuestion(){
    var Setid = this.data.QuestionInfo.questionSetId
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success(res) {
        if (res.confirm) {
          db.collection('Question_info').doc(that.data.QuestionInfo._id).remove({
            success(res){
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              wx.redirectTo({
                url: '../question?id=' + Setid,
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  toFavor(){
    var info = this.data.QuestionInfo
    info.favor = true
    this.setData({
      QuestionInfo:info
    })
    db.collection('Question_info').doc(this.data.QuestionInfo._id).update({
      data:{
        favor:true
      },
      success(res){
        wx.showToast({
          title: '收藏成功',
          icon:'none'
        })
      }
    })
  },
  toCancelFavor(){
    var info = this.data.QuestionInfo
    info.favor = false
    this.setData({
      QuestionInfo: info
    })
    db.collection('Question_info').doc(this.data.QuestionInfo._id).update({
      data: {
        favor: false
      },
      success(res) {
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none'
        })
      }
    })
  }

})