const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //获取用户点击的是允许还是拒绝
  handleGetUserInfo(data) {
    if (data.detail.rawData) {
      wx.showLoading({
        title: '登录中',
      })
      //读取数据库查看是否注册过
      wx.cloud.callFunction({
        name: 'dbread',
        success: res => {         
          if (!res.result.data.length) {
            let userInfo = data.detail.userInfo;
            //注册用户存入到数据库
            db.collection('users').add({
              data: {
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                gender: userInfo.gender,
                city: userInfo.city,
                signature: '',
                weixiNumber: '',
                follows: [],
                fans: [],
                time: new Date(),
                isLocation: true,
                autoLogin: false,
                longitude: '',
                latitude: '',
              }
            }).then((res) => {
              console.log('注册用户存入到数据库成功')
              //注册帖子、喜欢、收藏表
              db.collection('share').add({
                data: {
                  invitation: [],
                  likeList: [],
                  storeList: []
                }
              }).then(res => {
                console.log(res, '注册帖子、喜欢、收藏表成功')
                db.collection('message').add({
                  data: {
                    messages:[]
                  }
                }).then(res => {
                  wx.hideLoading;
                  wx.showToast({
                    title: '登录成功',
                  })
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/pages/user/user',
                    })
                  }, 1000)
                })
              })
            });
          } else {
            //注册过直接跳转     
            wx.hideLoading;
            wx.showToast({
              title: '登录成功',
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/user/user',
              })
            }, 1000)
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },
})