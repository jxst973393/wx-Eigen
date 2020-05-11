const app = getApp()
const db = wx.cloud.database()

function updatetype(type, typelist, item) {
  console.log('addtype')
  //获取点击的一个元素
  console.log(item, '点击了哪个元素')
  console.log('获取到个人的typelist', typelist)
  if (!typelist.length) {
    console.log('likeList为空')
    const add = 1
    changeTypeList(add, type, item, typelist)
    pushMessage(item)
  } else {
    let exist = false
    let existTypeListIndex = 0
    //遍历typelist是否有该元素
    typelist.forEach((typelistItem, typelistIndex) => {
      if (typelistItem._openid == item._openid && typelistItem.index == item.index) {
        exist = true
        existTypeListIndex = typelistIndex
      }
    })
    if (exist) {
      //有该元素，进行减操作
      console.log('有该元素，进行减操作')
      const reduce = 0
      changeTypeList(reduce, type, item, typelist, existTypeListIndex)
      pullMessage(item._openid, item.index)
    } else {
      //没有该元素，进行加操作
      console.log('没有该元素，进行加操作')
      const add = 1
      changeTypeList(add, type, item, typelist)
      pushMessage(item)
    }
  }

}

function pushMessage(item) {
  if (item._openid !== app.userInfo._openid) {
    //修改对方发消息列表
    const newItem = {
      messageType: 'like',
      imageUrl: item.tempFilePaths[0],
      otherIndex: item.index,
      otherOpenid: item._openid,
      _openid: app.userInfo._openid,
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName
    }
    const jsonItem = JSON.stringify(newItem)
    const myData = `{'messages': _.push(${jsonItem})}`
    wx.cloud.callFunction({
      name: "whereUpdate",
      data: {
        collection: 'message',
        _openid: item._openid,
        myData
      }
    }).then(res => {
      console.log('修改对方发消息列表成功', res)
    })
  }
}

function pullMessage(otherOpenid, otherIndex) {
  if (otherOpenid !== app.userInfo._openid) {
    //删除此人消息列表
    const pullItem = {
      messageType: 'like',
      _openid: app.userInfo._openid,
      otherOpenid: otherOpenid,
      otherIndex: otherIndex
    }
    console.log(pullItem)
    const jsonItem = JSON.stringify(pullItem)
    const myData = `{'messages':_.pull(${jsonItem})}`
    console.log(myData)
    wx.cloud.callFunction({
      name: 'whereUpdate',
      data: {
        collection: 'message',
        _openid: otherOpenid,
        myData
      }
    }).then(res => {
      console.log('删除此人消息列表成功', res)
    })
  }
}

function changeTypeList(operate, type, item, typelist, existTypeListIndex) {

  console.log('调用changeNumber')
  console.log('我的typelist', typelist)
  console.log('点击的元素', item)
  console.log('点击的元素的内部文章的下标', item.index)
  console.log('点击的元素的内部文章的用户id', item._openid)

  //修改typelist
  //typelist为空或者operate为加操作
  if (typelist.length == 0 || operate) {
    //往typelist中加入元素
    typelist.push(item)
    console.log('往typelist中加入元素', typelist)
    //更新数据库typelist
    let myData = {}
    if (type == 'like') {
      const likeList = typelist
      myData = {
        likeList
      }
    } else if (type == 'star') {
      const storeList = typelist
      myData = {
        storeList
      }
    }

    console.log('我的id', app.userInfo._openid)
    wx.cloud.callFunction({
      name: "whereUpdate",
      data: {
        collection: 'share',
        _openid: app.userInfo._openid,
        myData
      }
    }).then(res => {
      console.log('添加操作、更新数据库typelist成功', res)
      // 修改数据库个人中对应的元素
      sharelist(operate, type, item)
    })
  } else {
    //往likeList中删除元素
    console.log('往typelist中删除元素')
    typelist.splice(existTypeListIndex, 1)
    //更新数据库typelist
    let myData = {}
    if (type == 'like') {
      const likeList = typelist
      myData = {
        likeList
      }
    } else if (type == 'star') {
      const storeList = typelist
      myData = {
        storeList
      }
    }

    console.log('我的id', app.userInfo._openid)
    wx.cloud.callFunction({
      name: "whereUpdate",
      data: {
        collection: 'share',
        _openid: app.userInfo._openid,
        myData
      }
    }).then(res => {
      console.log('删除操作、更新数据库typelist成功', res)
      // 修改数据库个人中对应的元素
      sharelist(operate, type, item)
    })
  }
}

function sharelist(operate, type, item) {
  const {
    _openid,
    index
  } = item
  let invitationID = `'invitation.$.${type}'`
  let myData = ''
  if (operate) {
    //对Sharelist的like进行加操作
    myData = `{${invitationID}: _.inc(1)}`
  } else {
    //对Sharelist的like进行减操作
    myData = `{${invitationID}: _.inc(-1)}`
  }
  //更新Sharelist数据库
   wx.cloud.callFunction({
    name: "endUpdate",
    data: {
      collection: 'share',
      myWhere: {
        _openid,
        'invitation.index': index
      },
      myData
    }
  }).then(res => {
    console.log('更新Sharelist数据库成功')
  })
}


module.exports.updatetype = updatetype