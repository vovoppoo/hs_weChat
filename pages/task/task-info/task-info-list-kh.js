//statistics.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')


Page({
  data: {
    logs: [],
    taskName: '',
    array: [{ name: '全部', value: 1 }, { name: '已暂停', value: 2 }, { name: '进行中', value: 2 }, { name: '已完成', value: 3 }],
    navbarIndex: 0,
    navlist: [{
      text: '全部',
      val: 1,
    },
    {
      text: 'A',
      val: 2,
    },
    {
      text: 'B',
      val: 3,
    },    {
      text: 'C',
      val: 4,
    }
    ]
  },
  onLoad: function () {
    this.setData({
      logs: [1, 2, 3]
    })
  },
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000);
  },
  onShow() {

  },
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  addTaskFn(){
    wx.navigateTo({
      url: '/pages/speechcraft/import-speechcraft/import-speechcraft',
    })
  },
  toTaskInfoFn(){
    wx.navigateTo({
      url: '/pages/task/task-info/task-info',
    })
  },

  playEventFn(e) {
    let s = e.currentTarget.dataset.state
    let name = e.currentTarget.dataset.name
    let tisText = `是否暂停‘${name}’？`
    if (s === '1') {
      tisText = `是否开始‘${name}’？`
    }
    wx.showModal({
      title: '提示',
      content: tisText,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cloEventFn(e) {

    let tisText = `是否停止‘${e.currentTarget.dataset.name}’？`

    wx.showModal({
      title: '提示',
      content: tisText,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindKeyInput: function (e) {
    let data = {}
    data[e.currentTarget.dataset.label] = e.detail.value
    this.setData(data);
  },
  getList(page) {
    console.log('获取数据')
    wx.showToast({
      title: '发送成功',
      icon: 'success',
      duration: 2000
    });
    return
    let signUserName = wx.getStorageSync('signUserName')
    const param = {
      page: 1,
      // count: 10,
      count: 10 * page,
      id: signUserName.id,
      status: navIndex
    }

    let apiText = 'getDataList'
    if (navIndex == 0) {
      apiText = 'getDataList'
    } else if (navIndex == 1) {
      apiText = 'getDataList'
    } else if (navIndex == 2) {
      apiText = 'getDataList'
    }

    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response.datas
          this.setData({
            taskData: data
          })
          this.data.pageItem[this.data.formSearch.type] = {
            count: 10,
            countNumber: res.response.countNumber,
            page: page,
            pageCount: res.response.pageCount,
          }
          this.data.taskDataALL[this.data.formSearch.type] = this.data.taskData
        }
      }
    })

  },
  navbarClick(e) {
    const detail = e.detail
    const item = detail.item

    this.setData({
      formSearch: {
        type: item.val || 1
      }
    })
    this.getList(item.val)
    return
    if (this.data.pageItem[this.data.formSearch.type]) {
      const pageItem = this.data.pageItem[this.data.formSearch.type];
      if (pageItem.pageCount <= 1 || pageItem.page == pageItem.pageCount) {
        this.setData({
          taskData: this.data.taskDataALL[this.data.formSearch.type]
        })
        return
      }
      this.getList(this.data.pageItem[this.data.formSearch.type].page)
    } else {
      this.getList(1)
    }
  },
})
