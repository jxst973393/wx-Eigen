// miniprogram/pages/add/add.js
const db = wx.cloud.database();
const app = getApp();
const maxCount = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    imageCunt: 0,
    title: '',
    content: '',
    value: ''
  },
  previewImage(ev) {
    //查看对应的图片
    const id = ev.target.dataset.id;
    wx.previewImage({
      current: this.data.tempFilePaths[id],
      urls: [this.data.tempFilePaths[id]]
    })
  },
  toDelete(ev) {
    const id = ev.target.dataset.id;
    // 删除数组中对应index的元素，会改变原数组,修改的是tempFilePaths里面的元素,tempFilePaths本身引用没有改变，页面没有监听到
    // const tempFilePath = this.data.tempFilePaths.splice(index, 1);
    //过滤生成一个新的数组
    const tempFilePaths = this.data.tempFilePaths.filter((item, index) => {
      return index != id
    })
    this.setData({
      imageCunt: this.data.imageCunt - 1,
      tempFilePaths
    })
  },
  setTitle(ev) {
    this.setData({
      title: ev.detail.value
    })
  },
  setContent(ev) {
    this.setData({
      content: ev.detail.value
    })
  },
  addImage() {
    const rest = maxCount - this.data.imageCunt
    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const imageCunt = res.tempFilePaths.length
        const restImage = maxCount - this.data.imageCunt
        console.log(res, imageCunt);
        if (imageCunt > restImage) {
          wx.showModal({
            title: `你最多还能添加${restImage}张图片`
          })
        } else {
          //如果直接arrA.push(arrB); 则arrB只会作为了arrA的一个元素，并且是修改原数组
          const tempFilePaths = this.data.tempFilePaths.concat(res.tempFilePaths)
          console.log(this.data.tempFilePaths)
          this.setData({
            tempFilePaths,
            imageCunt: this.data.imageCunt + imageCunt
          })
        }
      }
    })
  },
  go() {
    //判断不能为空
    const {
      imageCunt,
      title,
      content
    } = this.data
    if (!imageCunt) {
      wx.showModal({
        title: `请添加图片`
      })
      return
    }
    if (!title) {
      wx.showModal({
        title: `请添加标题`
      })
      return
    }
    if (!content) {
      wx.showModal({
        title: `请添加正文内容`
      })
      return
    }
    // this.changeDb()
    wx.showLoading({
      title: '发布中',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'getTime'
    }).then(res => {
      const index = res.result.time
      this.uploadFile(index)
    })
  },
  uploadFile(index) {
    //index表示当前上传时数据库对应的invitation文章的下标
    //图片存入云存储 
    //异步问题
    const p = new Promise((resolve, reject) => {
      const tempFilePaths = this.data.tempFilePaths
      const fileIDs = []
      for (let i = 0; i < tempFilePaths.length; i++) {
        let cloudPath = `share/${app.userInfo._openid}/invitaion_${index}/image_${i}.png`
        const _ = db.command
        //这里不属于闭包
        wx.cloud.uploadFile({
          // 指定上传到的云存储路径  
          cloudPath,
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePaths[i],
          // 成功回调
          success: res => {
            console.log('上传成功', res);
            fileIDs.push(res.fileID)
            //异步使图片的顺序混乱了
            if (fileIDs.length === tempFilePaths.length) {
              //改变状态
              resolve(fileIDs)
              console.log('//改变状态')
            }
          },
        })
      }
    })
    p.then(fileIDs => {
      this.changeDb(fileIDs, index)
    })

  },
  //修改数据库
  changeDb(fileIDs, index) {
    // const _ = db.command
    const object = {
      _id: app.userInfo._id,
      tempFilePaths: fileIDs,
      title: this.data.title,
      content: this.data.content,
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName,
      star: 0,
      like: 0,
      comment: [],
      _openid: app.userInfo._openid,
      index: index,
      time: index
    }
    const jsonItem = JSON.stringify(object)
    const myData = `{'invitation': _.push(${jsonItem})}`
    wx.cloud.callFunction({
      name: "whereUpdate",
      data: {
        collection: 'share',
        _openid: app.userInfo._openid,
        myData
      }
    }).then(res => {
      console.log('修改数据库成功', res)
      this.showShare()
    })
    //清空
    this.setData({
      tempFilePaths: [],
      imageCunt: 0,
      title: '',
      content: '',
      value: ''
    })
  },

  showShare() {

    wx.hideLoading()
    wx.showToast({
      title: '发布成功',
      success: res => {
        app.globalData.switchTime = true
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 500)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {



  },
  chooseImage() {
    //验证是否已登录
    console.log(app.userInfo);
    wx.getSetting({
      success: (res) => {
        console.log('判断用户是否授权过用户信息');
        //判断用户是否授权过用户信息,授权过意味云有数据已经有数据
        if (res.authSetting['scope.userInfo']) {
          //选择图片
          wx.chooseImage({
            count: 9,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: (res) => {
              const imageCunt = res.tempFilePaths.length
              console.log(res, imageCunt);
              console.log(imageCunt ? (imageCunt < 9 ? true : false) : true)
              this.setData({
                tempFilePaths: res.tempFilePaths,
                imageCunt
              })

            }
          })
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
  //点击tabbar时触发
  onTabItemTap(ev) {
    this.chooseImage()
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