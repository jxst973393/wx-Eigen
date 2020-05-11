// miniprogram/pages/near/near.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.getLocation()
        }
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

  },
  markertap(e) {
    const _openid = e.markerId
    wx.navigateTo({
      url: '/pages/userDetail/userDetail?_openid=' + _openid,
    })
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          longitude,
          latitude
        })
        const _id = app.userInfo._id
        db.collection('users').doc(_id).update({
          data: {
            longitude,
            latitude,
            location: db.Geo.Point(longitude, latitude)
          },
          success: () => {
            const _ = db.command
            db.collection('users').where({
              location: _.geoNear({
                geometry: db.Geo.Point(longitude, latitude),
                minDistance: 0,
                maxDistance: 100000,
              }),
              isLocation: true
            }).field({
              longitude: true,
              latitude: true,
              _openid: true,
              avatarUrl: true,
              nickName: true
            }).get().then(res => {
              const result = []
              console.log(res)
              res.data.forEach((value) => {
                result.push({
                  iconPath: value.avatarUrl,
                  id: value._openid,
                  latitude: value.latitude,
                  longitude: value.longitude,
                  width: 35,
                  height: 35,
                  label: {
                    content: value.nickName,
                    anchorX: -15,

                  }
                })
              })

              this.setData({
                markers: result
              })
            })
          }
        })
      },
      fail: () => {
        wx.showModal({
          title: '请先开启位置授权',
          content: '在设置中开启',
        })
      }
    })
  }
})