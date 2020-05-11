// miniprogram/pages/message/message.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: []
  },
  goItem(ev) {
    console.log(ev)
    let itemIndex = ev.currentTarget.dataset.itemindex
    let itemOpenid = ev.currentTarget.dataset.itemopenid
    wx.navigateTo({
      url: `/pages/item/item?itemOpenid=${itemOpenid}&itemIndex=${itemIndex}`,
    })
  },
  goDelete(ev) {
    const index = ev.currentTarget.dataset.index
    this.data.messages.splice(index, 1)
    this.setData({
      messages: this.data.messages
    })
    const myData = {
      messages: this.data.messages
    }
    wx.cloud.callFunction({
      name: 'whereUpdate',
      data: {
        collection: 'message',
        _openid: app.userInfo._openid,
        myData
      }
    }).then(res => {
      console.log(res)
    })
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
        console.log('判断用户是否授权过用户信息');
        //判断用户是否授权过用户信息,授权过意味云有数据已经有数据
        if (res.authSetting['scope.userInfo']) {
          wx.hideTabBarRedDot({
            index: 3
          })
          const watcher = db.collection('message')
            .where({
              _openid: app.userInfo._openid
            })
            .watch({
              onChange: (snapshot) => {
                console.log(snapshot)
                //有消息
                const messages = snapshot.docChanges[0].doc.messages
                this.setData({
                  messages
                })

              },
              onError: function(err) {
                console.error('the watch closed because of error', err)
              }
            })
          //拿消息数据
        } else {
          wx.showModal({
            title: '请先登录',
            showCancel: false,
            success: res => {
              wx.switchTab({
                url: '/pages/user/user',
              })
            }
          })
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

  }
})