
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
    modalName:'',
    title:'',
    NewQuestion:'',
    NewAnwser:'',
    QuestionSetId:'',
    QuestionList:[],
    FavorList:[],
    QuestionNum:0
  },
  onLoad(e){
    console.log(e.id)
    this.setData({
      QuestionSetId:e.id,
      title:e.title
    })
    var that = this
    db.collection('Question_info').where({
      questionSetId:e.id,
    }).get({
      success(res){
        console.log(res.data);
        var favorList = []
        for(var i = 0;i < res.data.length;i ++){
          if(res.data[i].question.length > 20){
            res.data[i].question = res.data[i].question.substring(0,20) + '...'
          }

          if (res.data[i].favor == true){
            favorList.push(res.data[i])
          }
          that.setData({
            QuestionList: res.data,
            FavorList: favorList,
            
          })
        }

      }
    })
  },
  showModal(e) {
    console.log("dasd")
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  InputQuestion(e){  
    this.setData({
      NewQuestion:e.detail.value
    })
  },
  InputAnwser(e) {
    this.setData({
      NewAnwser: e.detail.value
    })
  },
  addQuestion(){
    var that = this
    db.collection('Question_info').add({
      data:{
        question:that.data.NewQuestion,
        anwser:that.data.NewAnwser,
        questionSetId:that.data.QuestionSetId,
        apperCnt:0,
        trueCnt:0,
        falseCnt:0
      },
      success(res){
        console.log("添加成功")
        that.hideModal()
        wx.showToast({
          title: '添加成功',
          icon:"none"
        })
        that.onLoad({id:that.data.QuestionSetId})
      }
    })
  },
  getQuestionNum(e){
    this.setData({
      QuestionNum:e.detail.value
    })
  },
  ToDoQuestion(){
    var test = {id:"dasdas"}
    var that = this
    if(this.data.QuestionNum > this.data.QuestionList.length){
      wx.showToast({
        title: '您添加的题目数量不足'+that.data.QuestionNum+'个',
        icon: 'none'
      }) 
    }
    else if (this.data.QuestionNum >= 2 && this.data.QuestionNum <= 7){
      wx.navigateTo({
        url: 'doQuestion/doQuestion?QuestionSetId=' + that.data.QuestionSetId + '&num=' + that.data.QuestionNum + '&test=' + test,
      })
      that.hideModal()
    }
 
    else{
      wx.showToast({
        title: '数量区间2-7!',
        icon:'none'
      })
    }
  },
  ToDoQuestion_Priority(){
    var test = { id: "dasdas" }
    var that = this
    if (this.data.QuestionNum > this.data.QuestionList.length) {
      wx.showToast({
        title: '您添加的题目数量不足' + that.data.QuestionNum + '个',
        icon: 'none'
      })
    }
    else if (this.data.QuestionNum >= 2 && this.data.QuestionNum <= 7) {
      wx.navigateTo({
        url: 'doQuestion_priority/doQuestion?QuestionSetId=' + that.data.QuestionSetId + '&num=' + that.data.QuestionNum + '&test=' + test,
      })
      that.hideModal()
    }

    else {
      wx.showToast({
        title: '数量区间2-7!',
        icon: 'none'
      })
    }
  },
  QuestionDetail(e){
    wx.navigateTo({
      url: 'questionDetail/questionDetail?id='+e.currentTarget.dataset.id
    })
  }
})
