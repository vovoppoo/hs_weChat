const qs = require("../../utils/lib/qs.js")
Component({
  properties: {
    tabs: Array,
    width: Number,
    sliderWidth: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 172, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    navWidth: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 1, // 导航整体占屏幕宽度，1为百分百宽度，2为屏幕一半，以此类推
    },
    toMode: {
      type: String,
      value: 'nav' //nav和red 两个模式
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
  attached() {
    this.setOffsetLeft()
  },
  methods: {
    setOffsetLeft() {
      const that = this;
      const sliderWidth = that.data.width;
      const navbarWidth = that.data.navWidth;
      wx.getSystemInfo({
        success(res) {
          that.setData({
            sliderLeft: ((res.windowWidth / navbarWidth) / that.data.tabs.length - sliderWidth) / 3,
            sliderOffset: ((res.windowWidth / navbarWidth) / that.data.tabs.length) * that.data.activeIndex
          });
        }
      });
    },
    tabClick(e) {
      const indexO = e.currentTarget.id
      const itemO = e.currentTarget.dataset.item
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: indexO
      });

      this.triggerEvent('click', {
        item: itemO,
        index: indexO * 1
      })

      const roter = e.currentTarget.dataset.route
      const url = e.currentTarget.dataset.url
      if (roter) {
        if (roter.path) {
          let pathG = roter.path
          if (roter.query) {
            pathG += `?${qs.stringify(roter.query)}`
          }
          if (this.data.toMode === 'red') {
            wx.redirectTo({
              url: pathG,
            })
          } else {
            wx.navigateTo({
              url: pathG,
            })
          }
        }
      } else if (url) {
        if (this.data.toMode === 'red') {
          wx.redirectTo({
            url: url,
          })
        } else {
          wx.navigateTo({
            url: url,
          })
        }
      }

    }
  }
})