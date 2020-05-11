const app = getApp();
const db = wx.cloud.database();
var follow_fan = require('../../tool/follow_fan.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], 
    type:''
  },
  cancel(ev) {
    let { index, item } = ev.currentTarget.dataset
    
    const otherOpenid = item._openid
    follow_fan.cancel(otherOpenid)
    this.data.list[index].isFollow = false
    this.setData({
      list: this.data.list
    })
    //修改app
    app.userInfo.follows.splice(index, 1)
  },
  goFollow(ev) {
    
    console.log(ev)
    let { index, item}= ev.currentTarget.dataset
   
    const otherUser = {
      otherOpenid: item._openid,
      otherNickName: item.nickName,
      otherAvatarUrl: item.avatarUrl
    }
    follow_fan.goFollow(otherUser)
    this.data.list[index].isFollow = true
    this.setData({
      list: this.data.list
    })
    //修改app
    app.userInfo.follows.push(item)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let list = JSON.parse(options.list);
    this.setData({
      list,
      type: options.type
    })
    //查看是否关注过
    
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
    this.data.list.forEach(listItem => {
      listItem.isFollow = false
    })
    const follows = app.userInfo.follows
    follows.forEach((item, index) => {
      this.data.list.forEach((listItem, listIndex) => {
        if (item._openid == listItem._openid) {
          listItem.isFollow = true
        }
      })
    })
    this.setData({
      list: this.data.list
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