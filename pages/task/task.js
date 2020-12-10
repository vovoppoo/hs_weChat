//statistics.js
const util = require('../../utils/util.js')
const api = require('../../utils/api/index.js')
import * as echarts from '../../ec-canvas/echarts';



Page({
  data: {
    logs: [],
    taskName: '',
    dataList: [1],
    array: [{ name: '全部', value: 1 }, { name: '已暂停', value: 2 }, { name: '进行中', value: 2 }, { name: '已完成', value: 3 }],
    navbarIndex: 0,
    navlist: [{
      text: '我的模板',
      val: 1,
    },
    {
      text: '预设模板',
      val: 2,
    },
    {
      text: '参考模板',
      val: 3,
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
    if (typeof this.getTabBar === 'function' && this.getTabBar) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    this.getList(1)
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
  addTaskFn() {
    wx.navigateTo({
      url: '/pages/task/add-page/add-task-page',
    })
  },
  toTaskInfoFn(e) {
    let { id } = e.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/task/task-info/task-info?id=${id}`,
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

    const param = {
      page: 1,
      // count: 10,
      count: 10 * page,
    }
    let apiText = 'getTaskList'

    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response.datas
          data.map(item => {
            item.callOutProgressValue = item.callOutProgress.split('%')[0] || 0
          })
          console.log(data, 'data')
          this.setData({
            taskData: data
          })
          this.data.pageItem = {
            count: 10,
            countNumber: res.response.countNumber,
            page: page,
            pageCount: res.response.pageCount,
          }
        }
      }
    })
  },
})
