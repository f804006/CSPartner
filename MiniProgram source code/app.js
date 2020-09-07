//app.js
App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.SystemWidth = e.windowWidth
        this.globalData.SystemHeight = e.windowHeight
        this.globalData.Phone_Model = e.model
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }

        console.log(this.globalData)
      } 
    })


    // wx.request({
    //   url: 'https://f804006.xyz/test/gettoken.php',
    //   method: 'GET',
    //   dataType: 'json',
    //   success: function (res) {
    //     console.log('access_token : ', res.data.access_token)
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/semantic/semproxy/search?access_token='+res.data.access_token,
    //       data: {
            
    //         "query": "查一下明天从北京到上海的南航机票",
    //         "city": "北京",
    //         "category": "flight,hotel",
    //         "appid": "wx2e429a30e91971e4",
           
    //       },
    //       method:'POST',
    //       success(res){
    //         console.log(res)
    //       }
    //     })
    //   }
    // })

  },
  globalData: {
    appid:'wx2e429a30e91971e4',
    appsecret:'3ab6f3f40311d7487261e3d07b400d12',
    openid:'',
    userinfo:{},
    ColorList: [
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  }
})