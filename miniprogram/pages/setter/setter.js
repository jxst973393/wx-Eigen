// miniprogram/pages/setter/setter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signature: '',
    avatarUrl: '',
    nickName: '',
    phoneNumber: '',
    weixiNumber: '',
    isLocation: false,
    gender:''
  },
  toUpdateImag() {
    //修改图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // //先删除之前在云存储的图片
        // const deletedfileID = app.userInfo.avatarUrl; 
        // wx.cloud.deleteFile({
        //   fileList: [deletedfileID],
        //   success: res => {
        //     console.log('已删除图片')
        //   },
        //   fail: err => {
        //     console.log('云存储没有要删除的图片')
        //   },
        // })
        // tempFilePath可以作为img标签的src属性显示图片
        //只是临时图片URL
        const tempFilePath = res.tempFilePaths[0]
        //fileID没有变化，浏览器使用的是缓存，无法立即更新
        //之前在其他地方是使用url+“？时间”做参数，但fileID不能这样操作
        //为了解决无法立即更新的问题，使上传的路径图片不相同，产生不同fileID
        const cloudPath = "avatar/" + app.userInfo._opneid + Date.now() + ".png"
        wx.cloud.uploadFile({
          // 指定上传到的云存储路径  
          cloudPath,
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePath,
          // 成功回调
          success: res => {
            console.log('上传成功', res);
            const fileID = res.fileID;
            //更改本地app.userinfo         
            app.userInfo.avatarUrl = fileID; 
            //更改本页头像
            this.setData({
              avatarUrl: fileID
            })
            //更新到数据库
            wx.cloud.callFunction({
              // 需调用的云函数名
              name: 'dbupdate',
              // 传给云函数的参数
              data: {
                key: "avatarUrl",
                vlue: fileID,
                _id: app.userInfo._id
              },
              // 成功回调
              success: (res)=>{
                console.log(res)
              }
            })
          },
        })

      }
    })
  },
  previewImage() {
    wx.previewImage({
      current: app.userInfo.avatarUrl,
      urls: [app.userInfo.avatarUrl]
    })
  },
  toLocation(even) {
    console.log(even)
    const isLocation = even.detail.value;
    app.userInfo.isLocation = isLocation;
    this.setData({
      isLocation
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'dbupdate',
      // 传给云函数的参数
      data: {
        key: "isLocation",
        vlue: isLocation,
        _id: app.userInfo._id
      },
      // 成功回调
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  init() {
    const userInfo = app.userInfo;
    this.setData({
      signature: userInfo.signature,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      phoneNumber: userInfo.phoneNumber,
      weixiNumber: userInfo.weixiNumber,
      isLocation: userInfo.isLocation,
      gender: userInfo.gender
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
    this.init()
    console.log(app.userInfo)
    //调用dbupdate云函数模板
    // wx.cloud.callFunction({
    //   // 需调用的云函数名
    //   name: 'dbupdate',
    //   // 传给云函数的参数
    //   data: {
    //     key: "links",
    //     vlue: 123,
    //     _id: app.userInfo._id
    //   },
    //   // 成功回调
    //   success: (res)=>{
    //     console.log(res)
    //   }
    // })
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