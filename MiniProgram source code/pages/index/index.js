const app = getApp()

Page({
  data:{

  },
  onLoad(e){
    this.setData({
      useropenid: app.globalData.openid
      
    })
    console.log(this.data.useropenid)
    console.log(app.globalData.userinfo)
  }
})