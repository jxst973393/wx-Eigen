const app = getApp()
function cancel(otherOpenid){
  //需要参数 otherOpenid
  wx.showLoading({
    mask:true
  })
  //item index _openid
  //删除自己的关注列表
  let myData = `{'follows':_.pull({'_openid':'${otherOpenid}'})}`
  console.log(myData)
  wx.cloud.callFunction({
    name: 'whereUpdate',
    data: {
      collection: 'users',
      _openid: app.userInfo._openid,
      myData
    }
  }).then(res => {
    console.log('删除自己的关注列表成功', res)
  })
  //删除此人消息列表
  myData = `{'messages':_.pull({'_openid':'${app.userInfo._openid}','messageType':'follow'})}`
  console.log(myData)
  wx.cloud.callFunction({
    name: 'whereUpdate',
    data: {
      collection: 'message',
      _openid: otherOpenid,
      myData
    }
  }).then(res => {
    console.log('删除自己消息列表成功', res)
  })
  //删除此人的粉丝列表
  myData = `{'fans':_.pull({'_openid':'${app.userInfo._openid}'})}`
  console.log(myData)
  wx.cloud.callFunction({
    name: 'whereUpdate',
    data: {
      collection: 'users',
      _openid: otherOpenid,
      myData
    }
  }).then(res => {
    console.log('删除此人的粉丝列表成功', res)
    wx.hideLoading()
    
  })
}
function goFollow(otherUser) {
  //需要参数 otherUser{}
  wx.showToast({
    title: '关注成功',
    mask: true
  })
  //注意''，属性、跟实际值都要加''
  const { otherOpenid, otherNickName, otherAvatarUrl } = otherUser
  const { _openid, nickName, avatarUrl } = app.userInfo
  let myData = `{'follows': _.push({'_openid': '${otherOpenid}','nickName': '${otherNickName}','avatarUrl': '${otherAvatarUrl}'})}`
  //用json对象
  // let myData = {"follows": _.push({'_openid': '${this.data.detailItem._openid}'})}
  console.log(myData)
  //修改自己的关注列表
  wx.cloud.callFunction({
    name: "whereUpdate",
    data: {
      collection: 'users',
      _openid: _openid,
      myData,
    }
  }).then(res => {
    console.log('修改自己的关注列表成功', res)
  })
  
  myData = `{'fans': _.push({'_openid': '${_openid}','nickName': '${nickName}','avatarUrl': '${avatarUrl}'})}`
  //修改对方的粉丝列表
  wx.cloud.callFunction({
    name: "whereUpdate",
    data: {
      collection: 'users',
      _openid: otherOpenid,
      myData
    }
  }).then(res => {
    console.log('修改对方的粉丝列表成功', res)
  })
  myData = `{'messages': _.push({'_openid': '${_openid}','nickName': '${nickName}','avatarUrl': '${avatarUrl}','messageType':'follow'})}`
  //修改对方发消息列表
  wx.cloud.callFunction({
    name: "whereUpdate",
    data: {
      collection: 'message',
      _openid: otherOpenid,
      myData
    }
  }).then(res => {
    console.log('修改对方发消息列表成功', res)
 
    wx.hideToast()
  })
}


module.exports = {
  goFollow,
  cancel
}