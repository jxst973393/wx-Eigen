// miniprogram/pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userShare: {},
    current: 'invitation',
    isShowLogin: true
  },
  goInvitation(){
    wx.navigateTo({
      url: '/pages/invitation/invitation',
    })
  },
  previewImage() {
    wx.previewImage({
      current: app.userInfo.avatarUrl,
      urls: [app.userInfo.avatarUrl]
    })
  },
  goFollow(ev) {
    console.log(ev)
    let follows = JSON.stringify(ev.currentTarget.dataset.follows);
    wx.navigateTo({
      url: `/pages/follow-fan/follow-fan?list=${follows}&type=follows`,
    })
  },
  goFan(ev) {
    console.log(ev)
    let fans = JSON.stringify(ev.currentTarget.dataset.fans);
    wx.navigateTo({
      url: `/pages/follow-fan/follow-fan?list=${fans}&type=fans`,
    })
  },
  //点击跳转
  toLogin() {
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },
  active(ev) {
    console.log('111',ev)
    const current = ev.currentTarget.dataset.current
    if (current == this.data.current) {
      return false
    } else {
      this.setData({
        current
      })
    }
    // this.init()
  },
  init() {
    //获取该用户对应的share表
    console.log(app.userInfo, "init")
    db.collection('share').where({
      _openid: app.userInfo._openid
    }).get().then((res) => {
      const userShare = res.data[0]
      this.setData({
        userShare,
        userInfo: app.userInfo
      })

    })
  },
  toIsSetedUserInfo() {
    //获取用户授权过哪些权限
    wx.getSetting({
      success: (res) => {
        console.log('判断用户是否授权过用户信息');
        //判断用户是否授权过用户信息,授权过意味云有数据已经有数据
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            isShowLogin: false
          })
          this.toIsGetedUserInfo()
        }
      }
    })
  },
  //异步云调用
  toIsGetedUserInfo() {
    console.log('异步云调用')
    wx.cloud.callFunction({
      name: 'dbread',
      success: res => {
        //数据的读操作部署已云函数
        //  db.collection('users').where({
        //    _openid: res.result.openid
        //  }).get().then((res) => {}})
        //判断是否有注册过
        if (res.result.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.result.data[0]);
          console.log(app.userInfo, 'app.userinfo')
          this.init();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('页面加载')
    //注意，登录页面跳转过来并不会调用此函数
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
    this.toIsSetedUserInfo()
    //监听
    const watcher = db.collection('message')
      .where({
        _openid: app.userInfo._openid
      })
      .watch({
        onChange: function (snapshot) {
          //有消息
            // if (snapshot.docChanges[0].updatedFields){
            //   wx.showTabBarRedDot({
            //     index: 3
            //   })
            // }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})