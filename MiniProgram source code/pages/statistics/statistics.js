const util = require('../../utils/util.js')
const CHARTS = require('../../utils/wxcharts.js')
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [],
    array: ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h'],
    arrayindex: [1],
    StatisticsArray: [{
      title: '随机任务',
      time: '1h'
    }],
    have: false,
    addtime: '',
    modalname: '',
    selectedtime: '',
    MyCanvas: [],
    Today: '',
    TodayWeek: 0,
    Today_Statistics: [],
    Column1Series:[],
    selectedWeek: '',
    sevenDay: [],
    autoCanvasHeight: 0,
    CanvasSize:0,
    Column1Width:0,
    MarignLeftSize: 0,
    phone_model: '',
    TabCur: 0,
    NavOptions: ['饼图', "柱状图"],
    radarImg:null
  },

  getSevenday(day) {
    var res = []
    var p = new Date(day)
    for (var i = -3; i <= 3; i++) {
      var DateParameter = p.getTime() + i * 1000 * 60 * 60 * 24
      res.push(util.formatTime(new Date(DateParameter)).split(' ')[0])
    }
    return res
  },
  onLoad: function(options) {
    var DATE = util.formatTime(new Date());
    var time = DATE.split(' ')[0]
    var temp = new Date().getDay()
    this.setData({
      addtime: time,
      TodayWeek: (temp == 0) ? 7 : temp,
      Today: time,
    })
    this.getPie({
      time: time
    })
    this.getcolumn1({
      time: time
    })
    this.setData({
      autoCanvasHeight: app.globalData.SystemWidth,
    })
    console.log("可用高度：", app.globalData.SystemHeight, "可用宽度:", app.globalData.SystemWidth)
  },
  getPie(e) {
    util.showBusy("今天数据获取中")
    var that = this
    var time = e.time
    db.collection('Statistics_Info').where({
      time: time,
      _openid: app.globalData.openid
    }).get({
      success(res) {
        if (res.data.length != 0) {
          that.setData({
            have: true,
            Today_Statistics: res.data[0]
          })
          var temp_series = res.data[0].works
          let color = ['#87CEFA', '#00BFFF', '#FFC0CB', '#00FA9A', '#FFD700']
          var sumtime = 0
          for (var i = 0; i < temp_series.length; i++) {
            temp_series[i].color = color[i]
            temp_series[i].name = temp_series[i].title + '(' + temp_series[i].time + ')'
            temp_series[i].data = parseInt(temp_series[i].time.split('h')[0])
            sumtime += temp_series[i].data
          }
          var other = {}
          other.color = color[i]
          other.data = 24 - sumtime
          other.name = '其他' + '(' + other.data.toString() + 'h)'

          temp_series.push(other)
          console.log(temp_series)

          var CanvasSize = app.globalData.SystemHeight / 2
          //5.25.适配畅享9+
          console.log((app.globalData.SystemWidth - CanvasSize) / 2)
          that.setData({
            MarignLeftSize: (app.globalData.SystemWidth - CanvasSize) / 2,
            CanvasSize: CanvasSize
          })
          const canvas = new CHARTS({
            canvasId: 'pieCanvas1',
            type: 'pie',
            title: {
              name: "今日数据",
              fontSize: 30
            },
            subtitle: {
              name: "副标题"
            },
            series: temp_series,
            width: CanvasSize,
            height: CanvasSize,
          });
          that.setData({
            MyCanvas: canvas,
          })
        } else {
          that.setData({
            have: false
          })
        }

      }
    })
  },
  getcolumn1(e) {
    util.showBusy("近七天数据获取中")
    var that = this
    this.setData({
      sevenDay: that.getSevenday(e.time)
    })
    var column1Width = app.globalData.SystemWidth * 1.0
    that.setData({
      Column1Width: column1Width
    })
    var column1SeriesName = []
    function Getcolumn1SeriesName(i){
      if(i == 7) return;
      db.collection('Statistics_Info').where({
        _openid:app.globalData.openid,
        time:that.data.sevenDay[i]
      }).get({
        success(res){
          if(res.data.length != 0){
            var temp = res.data[0].works
            for(var j = 0;j < temp.length;j++){
         
              if (typeof (TempClass[temp[j].title]) == 'undefined'){
                TempClass[temp[j].title] = new Array(7)
                TempClass[temp[j].title][i] = temp[j].time;
              }else{
                TempClass[temp[j].title][i] = temp[j].time;
              }
            }
          }else{

          }
          Getcolumn1SeriesName(i+1)
        }
      })
    }
    var TempClass = {}
    Getcolumn1SeriesName(0)
    setTimeout(function(){
      console.log(TempClass)
      var Series = []
      for (var i = 0; i < Object.keys(TempClass).length;i ++){
        var object = {}
        var key = Object.keys(TempClass)[i]
        object['name'] = key
        for(var j = 0;j < TempClass[key].length;j ++){
          if(typeof(TempClass[key][j]) == 'undefined'){
            TempClass[key][j] = 0
          }else{
            var InterTime = parseInt(TempClass[key][j].split('h')[0])
            TempClass[key][j] = InterTime
          }
        }
        var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
        while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
          hex = '0' + hex;
        }
        object['color'] = '#'+hex
        object['data'] = TempClass[key]
        object['format'] = function (val, name) {
          return val.toFixed(2) + '万';
        }
        Series.push(object)
        console.log("卡点")
      }
      console.log(Series)

      if (Series.length != 0){
        console.log(Series)
        setTimeout(function(){
          console.log("异步执行害死人")
          // const cb = wx.createCanvasContext('lineCanvas')
          // console.log(cb)
          // cb.clearRect(0, 0, that.data.Column1Width, 300)
          // cb.draw()
          var col1 = new CHARTS({
            canvasId: 'lineCanvas',
            type: 'line', 
            categories: that.data.sevenDay,
            animation: true,
            series: Series,
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: '累计用时 (小时)',
              titleFontColor: '#8A2BE2',
              format: function (val) {
                return val.toFixed(2);
              },
              min: 0
            },
            title: {
              name: '时间分配'
            },
            subtitle: {
              name: 'test'
            },
            width: column1Width,
            height: 300,
            dataLabel: false,
            dataPointShape: true,
            extra: {
              lineStyle: 'curve'
            }
          })
          wx.showToast({
            title: '获取成功',
            icon: 'none'
          })
          console.log(col1)
        }
        ,3000)

      }else{
        wx.showToast({
          title: '近七天无任何记录',
          icon:'none'
        })
      }
      that.setData({
        Column1Series:Series
      })

    },3000)


    
  },
  bindselect(e) {

    console.log(e.detail.ischeck)
    if (e.detail.ischeck == false) {
      console.log("to pie")
      this.getPie({
        time: this.data.selectedtime
      })
      this.getcolumn1({
        time: this.data.selectedtime
      })
    } else {
      const ca = wx.createCanvasContext('pieCanvas1')
      ca.clearRect(0, 0, this.data.CanvasSize, this.data.CanvasSize)
      ca.draw()

      const cb = wx.createCanvasContext('lineCanvas')
      cb.clearRect(0, 0, this.data.Column1Width, 300)
      cb.draw()

      this.setData({
        radarImg:null
      })
    }
  },
  /**
   * 获取选择日期
   */
  bindgetdate(e) {
    let time = e.detail;

    var Time = time.year.toString() + '-' + time.month + '-' + ((typeof(time.date) == 'string') ? time.date : time.date.toString())

    function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式
      var aDate, oDate1, oDate2, iDays
      aDate = sDate1.split("-")
      oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式

      aDate = sDate2.split("-")
      oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      // console.log(oDate2 + 1000 * 60 * 60 * 24)
      iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
      return iDays
    }
    var DayGap = DateDiff(this.data.Today, Time)
    console.log("相隔天数：", DayGap)

    function getGoalWeek(thisWeek, gap) {
      var res;
      if (gap > 0) {
        if (gap < thisWeek) res = thisWeek - gap
        else if (gap == thisWeek) res = 7;
        else {
          var temp = gap - thisWeek
          res = 7 - temp % 7;
        }
      } else {
        var p = Math.abs(gap)
        if (thisWeek + p <= 7) {
          res = gap + p
        } else {
          res = (thisWeek + p) % 7
        }
      }
      return res;
    }

    this.setData({
      selectedtime: Time,
      addtime: Time,
      selectedWeek: getGoalWeek(this.data.TodayWeek, DayGap)
    })
  },

  mark() {
    var that = this
    if(this.data.Column1Series.length != 0){
      wx.canvasToTempFilePath({
        canvasId: 'lineCanvas',
        x:0,
        y:0,
        width:that.data.Column1Width,
        height:300,
        success: function (res) {
          that.setData({ radarImg: res.tempFilePath });
        }
      })
     
    }
    this.setData({
      modalName: 'mark'
    })
  },
  hideModal() {
    this.setData({
      modalName: ''
    })
  },
  bindTimeChange(e) {
    var index = e.currentTarget.dataset.index
    var temp = this.data.arrayindex
    temp[index] = e.detail.value //value是下标

    var temp_StatisticsArray = this.data.StatisticsArray
    temp_StatisticsArray[index].time = this.data.array[e.detail.value]
    this.setData({
      arrayindex: temp,
      StatisticsArray: temp_StatisticsArray
    })
  },
  getInput(e) {
    var index = e.currentTarget.dataset.index
    var temp_StatisticsArray = this.data.StatisticsArray
    temp_StatisticsArray[index].title = e.detail.value;
    this.setData({
      StatisticsArray: temp_StatisticsArray
    })
  },
  add() {
    var temp = this.data.StatisticsArray
    var temp1 = this.data.arrayindex
    temp1.push(1)
    temp.push({
      title: '随机任务',
      time: '1h'
    })
    this.setData({
      StatisticsArray: temp,
      arrayindex: temp1
    })
  },
  submit() {
    var that = this
    var i;
    var flag = 1
    for(i = 0;i < that.data.StatisticsArray.length;i ++){
      if(that.data.StatisticsArray[i].title == '随机任务'){
        wx.showToast({
          title: '请将未填写的部分完善',
          icon:'none'
        })
        flag = 0
      }
    }
    if(flag == 1){
      wx.showModal({
        title: '提示',
        content: '提交后将无法更改'+'\n'+'为方便我们统计数据，建议用户填写任务名称时，将相同的任务名称保持一致',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            db.collection('Statistics_Info').add({
              data: {
                time: that.data.addtime,
                works: that.data.StatisticsArray,
                summary: ''
              },
              success(e) {
                db.collection('User_Info').where({
                  _openid: app.globalData.openid
                }).get({
                  success(res) {
                    var temp = res.data[0].statisticsArray
                    temp.push(e._id)
                    db.collection('User_Info').doc(res.data[0]._id).update({
                      data: {
                        statisticsArray: temp
                      },
                      success(res) {
                        console.log("更新成功！");
                        that.setData({
                          modalName: null
                        })
                        wx.showToast({
                          title: '记录成功',
                          icno: 'none'
                        })
                        setTimeout(function () {
                          that.getPie({
                            time: that.data.selectedtime
                          })
                          that.setData({
                            radarImg:!that.data.radarImg
                          })
                          that.getcolumn1({
                            time: that.data.selectedtime
                          })
                        }, 500)
                      }
                    })
                  }
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }


  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    var TempCanvas = this.data.MyCanvas
    TempCanvas.series = [{
      name: 'test',
      data: 50
    }, {
      name: 'isa',
      data: 50
    }]

  }
})