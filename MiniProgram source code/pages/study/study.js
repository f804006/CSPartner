const app = getApp();
const db = wx.cloud.database()
const Url = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code'
var util = require('../../utils/util.js')
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    colorList: app.globalData.ColorList,
    List: [
    ],
    Abhs_List:[

    ],
    gridCol: 3,
    skin: false,
    newtitle:'',
    new_abhstitle:'',
    start_time:0,
    end_time:0,
    current_time:''
  },
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },
  onLoad(e){
    util.showBusy("Loading...")
    var that = this
    wx.login({
      success: function (res) {
        console.log(res)
        console.log("-----------------------用户微信昵称:" + that.data.nickName + "-----------------------")
        wx.request({
          url: Url,
          data: {
            appid: app.globalData.appid,
            secret: app.globalData.appsecret,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          success: function (e) {
            console.log(e)
            app.globalData.openid = e.data.openid
            console.log("-----------------------欢迎用户" + app.globalData.openid + "-----------------------")

            db.collection('User_Info').where({
              _openid: app.globalData.openid
            }).get({
              success: function (res) {
                if (res.data.length != 0) {
                  console.log("#用户信息:")
                  console.log(res.data[0])
                  that.setData({
                    List:res.data[0].item,
                    userinfo:res.data[0]
                  })
                }
                else {
                  db.collection('User_Info').add({
                    data: {
                      name: that.data.nickName,
                      item: [],
                      item_2: [],
                      inspire:'',
                      cnt:0
                    },
                    success: function (res) {
                      console.log("新用户加入" + res)
                      that.onLoad()
                    },
                    fail: console.error
                  })
                }
              }
            })

            db.collection('Memory_Info').where({
              _openid: app.globalData.openid
            }).get({
              success(res){
                that.setData({
                  Abhs_List:res.data
                })
                wx.showToast({
                  title: '信息获取成功',
                  icon:'none'
                })
              }
            })
          }
        })

      }
    })
  },

  detail(e){
    console.log(e)
    if (this.data.end_time - this.data.start_time < 350){
     console.log(111)
      wx.navigateTo({
        url: 'notes/notes?' + 'id=' + e.currentTarget.dataset.id,
      })
    }

  },
  add(e){
    var thistime = util.formatTime(new Date());
    this.setData({
      current_time: thistime
    })

    this.setData({
      modalName: e.currentTarget.dataset.target
    })



  },
  hideModal(e){
    this.setData({
      modalName:null
    })
  },
  newtitle(e){
    this.setData({
      newtitle:e.detail.value
    })
  },
  verify(e){


    var that = this
    
    db.collection('Item_Info').add({
      data:{
        title: that.data.newtitle,
        note:[]
      },success: res =>{
        console.log("dasdasdasdasdasdas")
        console.log("新添加的备考科目id:")
        that.setData({
          new_item_id:res._id
        })

        var temp = this.data.List
        var temp_0 = {}
        temp_0.title = this.data.newtitle
        temp_0.item_id = that.data.new_item_id

        temp.push(temp_0)
        db.collection('User_Info').doc(this.data.userinfo._id).update({
          data: {
            item: temp
          },
          success(res) {
            console.log(res)
            that.hideModal();
            that.onLoad()
          }
        })
      }
    })



  },
  new_abhstitle(e){
    this.setData({
      new_abhstitle: e.detail.value
    })
  },
  add_abhs(e){

    var that = this
    db.collection('Memory_Info').add({
      data:{
        title:that.data.new_abhstitle,
        content:'',
        sign:[
          { flag: 0, record: "未记录" }, { flag: 0, record: "未记录" },
          { flag: 0, record: "未记录" }, { flag: 0, record: "未记录" },
          { flag: 0, record: "未记录" }, { flag: 0, record: "未记录" },
          { flag: 0, record: "未记录" }, { flag: 0, record: "未记录" }
        ],
        starttime:that.data.current_time,
        achieve:false,
        imgList:[]
      },success(res){
        wx.showToast({
          title: '添加成功',
          icon:'success'
        })
        that.hideModal();
        that.onLoad()
      }
    })
  },
  detail_abhs(e){
    console.log(e)
    if (this.data.end_time - this.data.start_time < 350) {
      wx.navigateTo({
        url: 'memory/memory?id=' + e.currentTarget.dataset.id,
      })
    }

  },
  handleTouchStart(e){
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
    console.log("长按")
    console.log(e)
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认要删除 ' + e.currentTarget.dataset.title + ' 吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (e.currentTarget.dataset.k == "0"){
            var temp = that.data.List
            temp.splice(e.currentTarget.dataset.index, 1);
            console.log(temp)
            db.collection('User_Info').doc(that.data.userinfo._id).update({
              data: {
                item: temp
              }, success: res => {
                wx.showToast({
                  icon: 'success',
                  title: '删除成功',
                })

                that.setData({
                  List: temp
                })
              }
            })

            db.collection('Item_Info').doc(e.currentTarget.dataset.id).remove({
              success: res => {
                console.log("Item_Info集合内相关信息删除成功")
              }
            })

            that.onLoad(that.data.e)
          }else{
            var temp = that.data.Abhs_List
            temp.splice(e.currentTarget.dataset.index, 1);
            console.log(temp)

            that.setData({
              Abhs_List: temp
            })
            db.collection('Memory_Info').doc(e.currentTarget.dataset.id).remove({
              success: res => {
                console.log("Memory_Info集合内相关信息删除成功")
              }
            })
            wx.showToast({
              title: e.currentTarget.dataset.title + '删除成功',
              icon:'success'
            })
            that.onLoad(that.data.e)
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toggle(e) {
    console.log(e);
    var anmiaton = e.currentTarget.dataset.class;
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function () {
      that.setData({
        animation: ''
      })
    }, 1000)
  }
})