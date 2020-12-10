Component({
  data: {
    selected: '',
    color: "#666772",
    selectedColor: "#060606",
    backgroundColor: "#f2f5f7",
    borderStyle: "white",
    list: [
      {
        "pagePath": "/pages/data-statistics/statistics",
        "text": "数据统计",
        "iconPath": "/style/iconfont/data_w.png",
        "selectedIconPath": "/style/iconfont/data_b.png"
      },
      {
        "pagePath": "/pages/speechcraft/new-speechcraft/speechcraft",
        "text": "话术配置",
        "iconPath": "/style/iconfont/yuyin_w.png",
        "selectedIconPath": "/style/iconfont/yuyin_b.png"
      },
      {
        "pagePath": "/pages/task/new-task/task",
        "text": "任务监控",
        "iconPath": "/style/iconfont/task_w.png",
        "selectedIconPath": "/style/iconfont/task_b.png"
      },
      {
        "pagePath": "/pages/customer/customer",
        "text": "客户管理",
        "iconPath": "/style/iconfont/kh_w.png",
        "selectedIconPath": "/style/iconfont/kh_b.png"
      },
      {
        "pagePath": "/pages/index/index",
        "text": "个人中心",
        "iconPath": "/style/iconfont/grzx_w.png",
        "selectedIconPath": "/style/iconfont/grzx_b.png"
      }
    ]
  },
  attached() {

  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        'selected': data.index
      })

    }
  }
})