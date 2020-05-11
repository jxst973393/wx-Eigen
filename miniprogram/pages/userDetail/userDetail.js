// miniprogram/pages/userDetail/userDetail.js
var follow_fan = require('../../tool/follow_fan.js')
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    isFollow: true,
    otherUser: {},
    otherShare: {},
    _openid: "",
    current: 'invitation',
    fansNumber: 0
  },
  previewImage() {
    wx.previewImage({
      current: this.data.otherUser.avatarUrl,
      urls: [this.data.otherUser.avatarUrl]
    })
  },
  cancel() {
    const otherOpenid = this.data.otherUser._openid
    follow_fan.cancel(otherOpenid)
    //修改本地数据
    const fansNumber = this.data.fansNumber - 1
    this.setData({
      isFollow: true,
      fansNumber
    })
    app.userInfo.follows.forEach((value, i) => {
      if (value._openid === otherOpenid) {
        app.userInfo.follows.splice(i, 1)
      }
    })
    console.log(app.userInfo.follows)
  },
  goFollow() {
    const otherUser = {
      otherOpenid: this.data.otherUser._openid,
      otherNickName: this.data.otherUser.nickName,
      otherAvatarUrl: this.data.otherUser.avatarUrl
    }
    follow_fan.goFollow(otherUser)
    //修改本地数据
    const fansNumber = this.data.fansNumber + 1
    this.setData({
      isFollow: false,
      fansNumber
    })
    const item = {
      _openid: this.data.otherUser._openid,
      nickName: this.data.otherUser.nickName,
      avatarUrl: this.data.otherUser.avatarUrl
    }
    app.userInfo.follows.push(item)
    console.log(app.userInfo.follows)
  },
  active(ev) {
    const current = ev.target.dataset.current
    if (current == this.data.current) {
      return false
    } else {
      this.setData({
        current
      })
    }
    this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  init() {
    //获取点击头像的用户信息
    const _openid = this.data._openid
    db.collection('users').where({
      _openid
    }).get().then((res) => {
      const otherUser = res.data[0]
      const fansNumber = otherUser.fans.length
      this.setData({
        otherUser,
        fansNumber
      })
      //获取该用户对应的share表
      db.collection('share').where({
        _openid
      }).get().then((res) => {
        const otherShare = res.data[0]

        this.setData({
          otherShare
        })
      })
    })
  },
  onLoad: function(options) {
    console.log(options)
    const _openid = options._openid

    this.setData({
      _openid
    }, () => {
      this.init()
    })

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
    //看看是否显示关注
    //是本人
    const isShow = this.data._openid != app.userInfo._openid
    this.setData({
      isShow
    })
    //不是本人，查看是否关注过
    if (isShow) {
      const follows = app.userInfo.follows
      follows.forEach((item, index) => {
        if (item._openid == this.data._openid) {
          this.setData({
            isFollow: false,

          })
        }
      })
    }
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