// miniprogram/pages/setter/setgender/setgender.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ''
  },
  changeMan(){
      this.setData({
        gender:1
      })
  },
  changeWoman(){
    this.setData({
      gender: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.userInfo.gender)
    if (app.userInfo.gender === ''){
      this.setData({
        gender:1
      })
    } else {
      this.setData({
        gender: app.userInfo.gender 
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const gender = this.data.gender
   
    app.userInfo.gender = gender
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        gender
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})