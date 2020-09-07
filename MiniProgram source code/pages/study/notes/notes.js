const app = getApp();
const db = wx.cloud.database()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    List: [
      1, 2
    ],
    QuestionList:[],
    id: '',
    gridCol: 3,
    skin: false,
    pageinfo: {},
    animation: '',
    modalName:'',
    sectionTitle:''
  },
  onLoad(e) {
    console.log(e)
    this.setData({
      id: e.id
    })

    var that = this
    db.collection('Item_Info').doc(this.data.id).get({
      success(res) {
        that.setData({
          pageinfo: res.data
        })
      }
    })

    db.collection('Note_Info').where({
      Itemid: that.data.id
    }).get({
      success(res) {
        console.log(res)

        for (var i = 0; i < res.data.length; i++) {
          res.data[i].content = res.data[i].content.substring(0, 10)
          if (res.data[i].content.length == 10) res.data[i].content += "..."
        }
        that.setData({
          List: res.data
        })
      }
    })

    db.collection('QuestionSet_Info').where({
       noteId:e.id
    }).get({
      success(res){
        console.log(res.data)
        that.setData({
          QuestionList:res.data
        })
      }
    })
  },
  onPullDownRefresh: function() {
    this.onLoad({
      id: this.data.id
    })
    wx.stopPullDownRefresh();
  },
  todetail: function(e) {
    console.log(e)
    var anmiaton = e.currentTarget.dataset.class;
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function() {
      that.setData({
        animation: ''
      })
    }, 1000)
    let p = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id=' + p
    })

  },
  add(e) {
    var that = this
    wx.navigateTo({
      url: 'addnote/addnote?id=' + that.data.id,
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(){
    this.setData({
      modalName:null
    })    
  },
  newSection(e){
    this.setData({
      sectionTitle: e.detail.value
    })
  },
  addSection(){
    var that = this
    db.collection('QuestionSet_Info').add({
      data:{
        title:that.data.sectionTitle,
        content:[],
        noteId:that.data.id
      },
      success(res){
        wx.showToast({
          title: '添加成功',
          icon:'none'
        })
        that.hideModal()
        that.onLoad({id:that.data.id})
      }
    })
  },
  toQuestion(e){
    var id = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: 'question/question?id='+id+"&title="+title,
    })
  }
})