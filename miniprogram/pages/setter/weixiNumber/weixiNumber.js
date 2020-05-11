// miniprogram/pages/setter/setIntroduction/setIntroduction.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixiNumber: '',
  },
  setNewData(weixiNumber) {
    this.setData({
      weixiNumber,
    })
  },
  newweixiNumber(even) {
    const weixiNumber = even.detail.value;
    this.setNewData(weixiNumber);
  },
  update() {
    let weixiNumber = this.data.weixiNumber
    weixiNumber = weixiNumber.trim()
    app.userInfo.weixiNumber = weixiNumber
    //显示加载
    wx.showLoading({
      title: '修改中',
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'dbupdate',
      // 传给云函数的参数
      data: {
        key: "weixiNumber",
        vlue: weixiNumber,
        _id: app.userInfo._id
      },
      // 成功回调
      success: (res) => {
        console.log(res)
        //隐藏加载
        wx.hideLoading();
        wx.navigateBack({
          url: '/pages/setter/setter',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setNewData(app.userInfo.weixiNumber)

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