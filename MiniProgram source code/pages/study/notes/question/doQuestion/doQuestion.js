
const db = wx.cloud.database()
const util = require('../../../../../utils/util.js')
Page({
  data: {
    numList: [],
    Question:[{
      question:"question1",
      anwser:"anwser"
    }, {
        question: "question2",
        anwser: "anwser"
      }, {
        question: "question3",
        anwser: "anwser"
      }, {
        question: "question4",
        anwser: "anwser"
      }, {
        question: "question5",
        anwser: "anwser"
      }, {
        question: "question6",
        anwser: "anwser"
      }, {
        question: "question7",
        anwser: "anwser"
      },],
    currtQuestion:{},
    i:0,
    TapNum:0,
    AnwserFlag:false,
    OverFlag:false
  },
  onLoad(e){
    util.showBusy("正在随机生成题目")
    var that = this
    console.log("在",e.QuestionSetId,"中抽取",e.num,"个题目")
    db.collection('Question_info').where({
      questionSetId:e.QuestionSetId
    }).get({
      success(res){
        var index = []
        while(true){
          var num = Math.floor(Math.random() * res.data.length + 0);
          if(index.indexOf(num) == -1){
            index.push(num)
          }
          if(index.length == e.num) break;
        }
        var temp = []
        for(var i = 0;i < index.length;i ++){
          temp.push(res.data[index[i]])
        }
        console.log(temp)
        setTimeout(function(){
          var tempList = [{name:'正在做'}]
          for(var i = 0;i < e.num - 1;i ++){
            tempList.push({name:'未做'})
            that.setData({
              numList:tempList
            })
          }
          that.setData({
            Question:temp
          })
          wx.showToast({
            title: '生成成功',
            icon:'none'
          })
        },1000)

      }
    })
   

  },
  can(){
    this.setData({
      AnwserFlag: false,
      TapNum:this.data.TapNum+1
    })
    var temp = this.data.Question
    var temp1 = this.data.numList
    temp[this.data.i].flag = 1;
    temp1[this.data.i].name = '已做'
    if (this.data.i + 1 <= temp1.length - 1 && temp1[this.data.i + 1].name != '已做')
    temp1[this.data.i+1].name = '正在做'
    var that = this
    this.setData({
      i: (that.data.i + 1 <= temp1.length - 1) ? that.data.i + 1 : that.data.i ,
      Question:temp,
      numList:temp1
    })
  },
  notcan(){
    this.setData({
      AnwserFlag: false,
      TapNum: this.data.TapNum + 1
    })
    var temp = this.data.Question
    var temp1 = this.data.numList
    temp[this.data.i].flag = 0;
    temp1[this.data.i].name = '已做'
    if (this.data.i + 1 <= temp1.length - 1 && temp1[this.data.i + 1].name != '已做')
    temp1[this.data.i + 1].name = '正在做'
    var that = this
    this.setData({
      i: (that.data.i + 1 <= temp1.length - 1) ? that.data.i + 1 : that.data.i,
      Question: temp,
      numList: temp1
    })    
  },
  skip(e){
    this.setData({
      AnwserFlag: false
    })
    if(this.data.numList[this.data.i].name == '正在做'){
      console.log(111)
      var temp = this.data.numList
      temp[this.data.i].name = '未做'
      if (temp[e.currentTarget.dataset.index].name == '未做')
      temp[e.currentTarget.dataset.index].name = '正在做'
      this.setData({
        i: e.currentTarget.dataset.index,
        numList:temp
      })
    } else if (this.data.numList[this.data.i].name == '已做'){
      var temp = this.data.numList
      if (temp[e.currentTarget.dataset.index].name == '未做')
        temp[e.currentTarget.dataset.index].name = '正在做'
      this.setData({
        i: e.currentTarget.dataset.index,
        numList: temp
      })
    }
    
   
  },
  AnwserFlagTap(){
    var that = this
    that.setData({
      AnwserFlag:!that.data.AnwserFlag
    })
  },
  overAnswer(){
    util.showBusy("正在结束答题")
    var that = this
    function UpdateQuestionInfo(i){
      if (i == that.data.Question.length) {
        wx.showToast({
          title: '已结束答题',
          icon:'none'
        })
        that.setData({
          OverFlag:!that.data.OverFlag
        })
        return;
      }

      var trueFlag = (that.data.Question[i].flag == 1) ? 1 : 0;
      var falseFlag = (that.data.Question[i].flag == 1) ? 0 : 1;
      db.collection('Question_info').doc(that.data.Question[i]._id).update({
        data:{
          apperCnt:that.data.Question[i].apperCnt + 1,
          trueCnt: that.data.Question[i].apperCnt + trueFlag,
          falseCnt:that.data.Question[i].falseCnt + falseFlag
        },
        success(res){
          console.log("成功")
          UpdateQuestionInfo(i+1)
        }
      })
    }
    UpdateQuestionInfo(0);
  }
})