const app = getApp()
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  //配置外部的样式起作用
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    list: Array,
    enter:String
    // listName: String,
    // list_openid: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goItem(ev) {
      console.log(ev)
      // let str = JSON.stringify(ev.currentTarget.dataset.item);
      //注意这里会自动变为小写
      let itemIndex = ev.currentTarget.dataset.itemindex
      let itemOpenid = ev.currentTarget.dataset.itemopenid
      const enter = this.data.enter
    
      wx.navigateTo({
        url: `/pages/item/item?itemOpenid=${itemOpenid}&itemIndex=${itemIndex}&enter=${enter}`,
      })
    }
  },
  pageLifetimes: {
    //数据应该在这里获取，不能在attached，attached太早拿的是页面还没有this.setData的值
    show: function() {
      // const {
      //   list_openid,
      //   listName
      // } = this.data    
    },
  },
  lifetimes: {
    attached: function() {
       // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})