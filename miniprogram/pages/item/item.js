// miniprogram/pages/detaile/detaile.js
var like_star = require('../../tool/like_star.js')
var Time = require('../../tool/time.js')
var follow_fan = require('../../tool/follow_fan.js')
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailItem: {},
    isShow: true,
    isFollow: true　,
    showTextara: false,
    first: true,
    swiperHeight: 0,
    keyBoardHeight: 0,
    value: '',
    itemOpenid: '',
    itemIndex: 0,
    storeList: [],
    likeList: [],
    enter: true,
    windowHeight: '',
    toView: '',
    hide: false,
    likeSize: '',
    time: ''　
  },
  goDelete(ev) {
    wx.showModal({
      title: '删除该帖',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          const {
            index,
            _openid
          } = this.data.detailItem
          console.log(index)
          // const _ = db.command
          const myData = `{'invitation':_.pull({'_openid':'${_openid}','index':${index}}),'likeList':_.pull({'_openid':'${_openid}','index':${index}}),'storeList':_.pull({'_openid':'${_openid}','index':${index}})}`
          console.log(myData)
          wx.cloud.callFunction({
            name: 'whereUpdate',
            data: {
              collection: 'share',
              _openid: app.userInfo._openid,
              myData
            }
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '删除成功',
            })
            wx.hideLoading()
            setTimeout(() => {
              wx.navigateBack()
            }, 500)
          })
        }
      }
    })

  },
  previewImage(ev) {
    const tempFilePaths = this.data.detailItem.tempFilePaths
    console.log(tempFilePaths, 'arry')

    const imageurl = ev.currentTarget.dataset.imageurl
    console.log(imageurl, 'current')
    wx.previewImage({
      current: imageurl,
      urls: tempFilePaths
    })
  },
  goUserDetail() {
    if (this.data.enter) {
      const itemOpenid = this.data.itemOpenid
      wx.navigateTo({
        url: '/pages/userDetail/userDetail?_openid=' + itemOpenid,
      })
    }
  },
  //键盘输入
  input(e) {
    console.log(e)
    this.setData({
      value: e.detail.value
    })
  },
  //发送
  send(event) {
    // this.setData({
    //   hide: true,
    // })
    wx.showLoading({})
    const {
      index,
      comment,
      _openid
    } = this.data.detailItem
    comment.push({
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName,
      content: this.data.value
    })
    const detailItem = this.data.detailItem
    detailItem.comment = comment
    //更新本地
    this.setData({
      detailItem
    })
    //更新云
    let invitationID = `invitation.$.comment`
    let myData = {
      [invitationID]: comment
    }
    wx.cloud.callFunction({
      name: 'endUpdate',
      data: {
        collection: 'share',
        myWhere: {
          _openid,
          'invitation.index': index
        },
        myData
      }
    }).then(res => {
      console.log('评论成功', res)
      // var id = event.currentTarget.dataset.id;
      wx.hideLoading()
      //先滑动
      wx.pageScrollTo({
        selector: '#tail'
      })
      //再显示
      // this.setData({
      //   hide: false
      // })    
    })
  },
  goComment() {
    //显示textare、并自动对焦推起键盘
    // var id = event.currentTarget.dataset.id;
    // this.setData({
    //   //先隐藏
    //   hide: true,
    // }, () => {
      //再滚动
      wx.pageScrollTo({
        selector: '#commentArea',
        success:()=>{
          this.setData({
            showTextara: true,
          // },()=>{
          //   this.setData({
          //     hide: false
          //   })
          })
        }
      })
    // })
    // this.setData({
    // toView: id
    // })
    
   
    
    // })
    //定时器解决冲突，用scroll-viewhide时解决卡顿
    // setTimeout(() => {

    // }, () => {
    // setTimeout(() => {
    // this.setData({
    //   hide: false
    // })
    // }, 1000)

    // }, 500)
  },

  cancel() {
    const otherOpenid = this.data.detailItem._openid
    follow_fan.cancel(otherOpenid)
    this.setData({
      isFollow: true,
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
      otherOpenid: this.data.detailItem._openid,
      otherNickName: this.data.detailItem.nickName,
      otherAvatarUrl: this.data.detailItem.avatarUrl
    }
    follow_fan.goFollow(otherUser)
    this.setData({
      isFollow: false,
    })
    const item = {
      _openid: this.data.detailItem._openid,
      nickName: this.data.detailItem.nickName,
      avatarUrl: this.data.detailItem.avatarUrl
    }
    app.userInfo.follows.push(item)
    console.log(app.userInfo.follows)
  },
  addStar() {
    if (this.data.detailItem.isstar == 1) {

      this.data.detailItem.isstar = 0
      this.data.detailItem.star--
    } else {
      this.data.detailItem.isstar = 1
      this.data.detailItem.star++
        this.setData({
          starSize: '45rpx'
        })
    }
    //没有通过setData页面没有更新
    this.setData({
      detailItem: this.data.detailItem
    }, () => {
      this.setData({
        starSize: '60rpx'
      })
    })
    const type = 'star'
    const typelist = this.data.storeList
    const item = this.data.detailItem
    console.log(typelist, item)
    like_star.updatetype(type, typelist, item)
  },
  addLike() {

    if (this.data.detailItem.islike == 1) {
      this.data.detailItem.islike = 0
      this.data.detailItem.like--

    } else {
      this.data.detailItem.islike = 1
      this.data.detailItem.like++
        this.setData({
          likeSize: '45rpx'
        })
    }
    this.setData({
      detailItem: this.data.detailItem
    }, () => {
      this.setData({
        likeSize: '58rpx'
      })
    })
    const type = 'like'
    const typelist = this.data.likeList
    const item = this.data.detailItem
    console.log(typelist, item, 'likelike1111111111111')
    like_star.updatetype(type, typelist, item)
  },

  imgHenght(e) {
    if (e.currentTarget.dataset.index == 0) {
      //自适应图片
      console.log(e)
      let winWid = wx.getSystemInfoSync().windowWidth;
      let winheight = wx.getSystemInfoSync().windowHeight;
      console.log(winheight, 'winheight')
      console.log(winWid)
      let imgh = e.detail.height;
      let imgw = e.detail.width;
      // 屏幕宽度/swiper高度 = 图片宽度/图片高度   
      let currentHeight = winWid * imgh / imgw
      if (currentHeight > winheight * 8 / 10) {
        currentHeight = winheight * 7 / 10
      }
      this.setData({
        swiperHeight: currentHeight + "px"　　,
        　　 //设置高度
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //设置滑动窗口的高度
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    //获取从上一页传过来的值，并设置
    console.log(options)
    let itemIndex = options.itemIndex
    let itemOpenid = options.itemOpenid
    let enter = options.enter
    console.log(enter)
    if (enter == 'false') {
      this.setData({
        enter: false
      })
    }
    console.log(itemIndex, itemOpenid)
    // let detailItem = JSON.parse(options.detailItem);
    this.setData({
      itemIndex,
      itemOpenid,

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  keyBoardChange(height) {
    //键盘高度改变时调用
    // bindkeyboardheightchange="keyBoardChange"安卓不能使用，因为点击空白处没有监听到
    // console.log(e.detail.height, '2222')
    //键盘收起,修改showTextara
    //注意keyBoardChange刚开始时调用了多次，第一次高度为不正确,这时不应该设置showTextara为false
    if (this.data.first) {
      this.setData({
        first: false
      })
    } else {
      let keyBoardHeight = height + 'px'
      console.log(keyBoardHeight, '2222')

      this.setData({
        keyBoardHeight
      })
      if (keyBoardHeight === '0px') {
        this.setData({
          keyBoardHeight
        },()=>{
          this.setData({
            showTextara: false
          })
        })    
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.onKeyboardHeightChange(res => {
      console.log(res.height, '1111')
      this.keyBoardChange(res.height)
    })
    //数据库获取detailItem
    const itemIndex = this.data.itemIndex
    const itemOpenid = this.data.itemOpenid
    db.collection('share').where({
      _openid: itemOpenid
    }).get().then(res => {
      let detailItem = {}
      console.log(res)
      res.data[0].invitation.forEach((value, i) => {
        if (value.index == itemIndex) {
          detailItem = value
        }
      })
      console.log(detailItem)
      //没有该帖子
      if (!detailItem._openid) {
        wx.showModal({
          title: '帖子已失效',
          showCancel: false,
          // content: '是否将它从你的列表中删除',
          success: (res) => {
            if (res.confirm) {
              const myData = `{'likeList':_.pull({'_openid':'${itemOpenid}','index':${itemIndex}}),'storeList':_.pull({'_openid':'${itemOpenid}','index':${itemIndex}})}`
              console.log(myData)
              wx.cloud.callFunction({
                name: 'whereUpdate',
                data: {
                  collection: 'share',
                  _openid: app.userInfo._openid,
                  myData
                }
              }).then(res => {
                console.log(res)
                // wx.showToast({
                //   title: '删除成功',
                // })
                // wx.hideLoading()
                // setTimeout(() => {
                wx.navigateBack()
                // }, 500)
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      } else {
        //看看是否显示关注
        //是本人
        const isShow = detailItem._openid != app.userInfo._openid
        this.setData({
          isShow
        })
        //不是本人，查看是否关注过
        if (isShow) {
          this.setData({
            isFollow: true,
          })
          const follows = app.userInfo.follows
          console.log(follows)
          //不能用!follows作为判断

          follows.forEach((item, index) => {
            if (item._openid == detailItem._openid) {
              this.setData({
                isFollow: false,
              })
            }
          })
        }
        // detailItem.islike = 0
        // detailItem.isstar = 0
        db.collection('share').where({
          _openid: app.userInfo._openid
        }).get().then(res => {
          const {
            likeList,
            storeList
          } = res.data[0]
          console.log(itemOpenid, itemIndex);
          detailItem.islike = 0
          likeList.forEach((value, i) => {
            if (value._openid == itemOpenid && value.index == itemIndex) {
              console.log('11111111111111111')
              detailItem.islike = 1
            }
          })
          detailItem.isstar = 0
          storeList.forEach((value, i) => {
            if (value._openid == itemOpenid && value.index == itemIndex) {
              detailItem.isstar = 1
            }
          })
          //格式化时间
          let time = detailItem.time
          time = Time.getDateDiff(time)
          // time = time.substring(5)
          this.setData({
            detailItem,
            storeList,
            likeList,
            time
          }, () => {

          })
        })
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