const qs = require("../../utils/lib/qs.js")
Component({
  properties: {
    menuArr: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    showView: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    toMode: {
      type: String,
      value: 'nav' //nav和red 两个模式
    },
    paddingHeight: {
      type: Number,
      value: 0
    },
    activeIndex: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal) {
        this.setOffsetLeft()
      } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },
  data: {
    sliderOffset: 0,
    sliderLeft: 0,
  },
  attached() {//相当于onShow
    this.setOffsetLeft()
  },
  methods: {
    setOffsetLeft() {

    },
    menuClick(e) {
      console.log(e, 'e')
      let { url } = e.currentTarget.dataset
      wx.navigateTo({
        url: url,
      })
      this.setData({
        showView: false,
      })
    },
    exitFn() {
      this.setData({
        showView: false,
      })
    },
    resetFn() {
      let { menuArr } = this.data
      for (let i = 0; i < menuArr.length; i += 1) {
        menuArr[i].labelArr.map(item => {
          item.isSelect = false
          return item
        })
      }
      this.setData({
        menuArr: menuArr,
      })
      this.triggerEvent('buttonhandle', {
        menuArr
      });
    },
    cilckFn(e) {
      let { index, value, indexid, isselect } = e.currentTarget.dataset
      let { menuArr } = this.data
      let thisSelect = isselect
      menuArr[indexid].labelArr.map(item => {
        item.isSelect = false
        return item
      })
      if (!thisSelect) {
        menuArr[indexid].labelArr[index].isSelect = !isselect
      }
      this.setData({
        menuArr: menuArr,
      })
      this.triggerEvent('buttonhandle', {
        menuArr
      });
    },
  }
})