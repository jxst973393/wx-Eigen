// miniprogram/pages/index/index.js
const like_star = require('../../tool/like_star.js')
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sumInvitation: [],
    current: 'like',
    // canlike: true,
    // canstar: true
  },
  // detail(ev) {
  //   console.log(ev, '2222')
  //   //传递对象参数要先转化成字符串形式
  //   let str = JSON.stringify(ev.currentTarget.dataset.item);
  //   let index = ev.currentTarget.dataset.index
  //   wx.navigateTo({
  //     url: `../detail/detail?jsonStr=${str}&index=${index}`,
  //   })
  // },
  active(ev) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    const current = ev.target.dataset.current
    if (current == this.data.current) {
      return false
    } else {
      this.setData({
        current
      })
      wx.showLoading({
        mask: true
      })
      this.init()
    }
  },
  goItem(ev) {
    let itemIndex = ev.currentTarget.dataset.itemindex
    let itemOpenid = ev.currentTarget.dataset.itemopenid
    wx.navigateTo({
      url: `/pages/item/item?itemOpenid=${itemOpenid}&itemIndex=${itemIndex}`,
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
  init() {
    wx.getSetting({
      success: (res) => {
        console.log('判断用户是否授权过用户信息');
        //判断用户是否授权过用户信息,授权过意味云有数据已经有数据
        if (res.authSetting['scope.userInfo']) { 
          wx.cloud.callFunction({
            name: 'dbread',
            success: res => {
              console.log(res)
              //是否注册过
              if (res.result.data.length) {
                app.userInfo = res.result.data[0]
                console.log('res.result.data.length', res.result.data.length)
                const _openid = app.userInfo._openid
                console.log(app.userInfo._openid, '用户的id')
                db.collection('share').get().then(res => {
                  //遍历所有记录中的Invitation并且创建一个sumInvitation
                  const shareList = res.data;
                  console.log('share集合', shareList)
                  let sumInvitation = [];
                  shareList.forEach((shareItem, shareIndex) => {
                    console.log('shareItem每条记录', shareItem)
                    if (shareItem.invitation.length) {
                      shareItem.invitation.forEach((item, index) => {
                        sumInvitation = sumInvitation.concat(item);
                      })
                    }
                  })
                  this.listSort(sumInvitation)
                  console.log('监听,即使不在这页面也会检测到')
                  //监听,即使不在这页面也会检测到
                  const watcher = db.collection('message')
                    .where({
                      _openid: app.userInfo._openid
                    })
                    .watch({
                      onChange: function (snapshot) {
                        //有消息
                        if (snapshot.docChanges[0].updatedFields) {
                          console.log(1)
                          wx.showTabBarRedDot({
                            index: 3
                          })
                        }
                      },
                      onError: function (err) {
                        console.error('the watch closed because of error', err)
                      }
                    })
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '请先登录',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/user/user',
                })
              }
            }
          })
        }
      }
    })
    // wx.startPullDownRefresh()

  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    //判断是否从发布页跳转过来
    if (app.globalData.switchTime) {
      wx.showLoading({
        mask: true
      })
      this.setData({
        current: 'time'
      })
      app.globalData.switchTime = false
      this.init()
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      this.init()
    }


  },
  listSort(sumInvitation) {
    //进行排序
    const type = this.data.current
    let compare = function(obj1, obj2) {
      let val1 = obj1[type];
      let val2 = obj2[type];
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
    sumInvitation.sort(compare)
    this.setData({
      sumInvitation
    }, () => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
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
    this.init()
    // this.listSort(this.data.sumInvitation)
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