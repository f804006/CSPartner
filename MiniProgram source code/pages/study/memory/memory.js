const db = wx.cloud.database()
var util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
    array: ['模糊', '记得', '非常熟悉'],
   
    index: 1,
    time: '12:01',
    basicsList: [{
      rate:'16.7%',
      display:'1/6',
    },{
      rate:'33.4%',
      display:'1/3',
    },{
      rate:'50.1%',
      display:'1/2',
    },{
      rate:'66.8%',
      display:'2/3',
    },{
      rate:'85.5%',
      display:'5/6',
    },{
      rate:'100%',
      display:'1',
    },],
    basics: 0,
    numList: [{
      name: '开始'
    }, {
      name: '等待'
    }, {
      name: '错误'
    }, {
      name: '完成'
    },],
    signday:[
      '第一次',
      '第二次',
      '第三次',
      '第四次',
      '第五次',
      '第六次',
    ],
    imgList:[],
    newimgList:[],
    num: 0,
    scroll: 0,
    Item_info:{}
  },
  bindPickerChange: function (e) {
    
    this.setData({
      index: e.detail.value
    })
  },
  confirmsign(e){
    var sign = this.data.Item_info.sign
    var item = this.data.Item_info.sign[this.data.scroll+1]
    item.flag = 1;
    item.record = this.data.thisday + ',' + this.data.array[this.data.index]

    sign[this.data.scroll + 1] = item
    console.log(sign)

    var that = this
    db.collection('Memory_Info').doc(this.data.Item_info._id).update({
      data:{
        sign:sign
      },success(res){
        console.log(res)
        that.setData({
          modalName:null,
          index:1
        })
        wx.showToast({
          title: '打卡成功',
          icon: 'success'
        })
        that.onLoad({ id:that.data.Item_info._id})
      }
    })
  },
  onLoad(e){
    var that = this
    db.collection('Memory_Info').doc(e.id).get({
      success(res){
        console.log(res)
        var startday = res.data.starttime.split(' ')[0].split('/')
        console.log(startday)
        var thisday = util.formatTime(new Date()).split(' ')[0]
        
        that.setData({
          Item_info:res.data,
          thisday:thisday,
          imgList:res.data.imgList,
          content:res.data.content,
          newimgList:[]
        })

        console.log(that.data.Item_info.achieve)
        for(var i = 0;i < res.data.sign.length;i ++){
      
          if(res.data.sign[i].flag == 0){       
            that.setData({
              scroll:i - 1
            })
            break;
          }
        }

        if(that.data.scroll == 5){
          db.collection('Memory_Info').doc(that.data.Item_info._id).update({
            data:{
              achieve:true
            }
          })
          var item = that.data.Item_info
          item.achieve = true;
          that.setData({
            Item_info:item
          })
        }
        
      }
    })
    
    setTimeout(function () {
      that.setData({
        loading: true
      })
    }, 500)
  },
  //Color Begin
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  scrollSteps(e) {
    console.log(this.data.scroll)
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
    // this.setData({
    //   scroll: this.data.scroll == 5 ? 0 : this.data.scroll + 1
    // })
  },

  hideModal() {

    this.setData({
      modalName: null
    })

  },
  //Color End
  toSign(){
    var new_sign = this.data.Item_info.sign
    
    this.scrollSteps()
  },
  textareaAInput(e){
    this.setData({
      content:e.detail.value
    })
  },
  save(){
    util.showBusy('正在保存')
    var that = this
    

    var new_ImgList = that.data.imgList
    for (var i = 0; i < that.data.newimgList.length; i++) {
      const filePath = that.data.newimgList[i]
      var str = that.data.newimgList[i].substring(58, 68)
      console.log("云端文件名" + str)
      const cloudPath = '记忆曲线_数据图片/' + str + '.png'
      console.log("图片临时地址:" + filePath)
      console.log("云端地址:" + cloudPath)
    
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[图片上传] 成功：', res)
          console.log("即将修改id为:" + that.data.Item_info._id + "数据的imgurl")
          new_ImgList.push(res.fileID)

          db.collection('Memory_Info').doc(that.data.Item_info._id).update({
            data: {
              content: that.data.content,
              imgList: new_ImgList
            },
            success(res) {
              console.log("上传成功并将imgurl更改成云地址！")
              util.showSuccess('保存成功')
              that.onLoad({ id: that.data.Item_info._id })
            },
            fail: console.error
          })

         
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        }
      })
    }

    db.collection('Memory_Info').doc(that.data.Item_info._id).update({
      data: {
        content: that.data.content,
      },
      success(res) {
        util.showSuccess('保存成功')
        that.onLoad({ id: that.data.Item_info._id })
      },
      fail: console.error
    })


  } ,ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: 'compressed', //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (that.data.newimgList.length != 0) {
          that.setData({
            newimgList: that.data.newimgList.concat(res.tempFilePaths)
          })
        } else {
          that.setData({
            newimgList: res.tempFilePaths
          })
        }
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.newimgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            newimgList: this.data.newimgList
          })
        }
      }
    })
  },
  handleTouchStart(e) {
    this.setData({
      start_time: e.timeStamp
    })
  },
  handleTouchEnd(e) {
    this.setData({
      end_time: e.timeStamp
    })
  },
  longTap(e){
    var current_imgList = this.data.Item_info.imgList
    current_imgList.splice(e.currentTarget.dataset.index,1)
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          db.collection('Memory_Info').doc(that.data.Item_info._id).update({
            data:{
              imgList:current_imgList
            },success(res){
              wx.showToast({
                title: '删除成功',
                icon:'success'
              })
              that.onLoad({id:that.data.Item_info._id})
            }
          })
        }
      }
    })
  }
})