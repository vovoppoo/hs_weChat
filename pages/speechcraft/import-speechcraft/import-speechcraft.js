//statistics.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')



Page({
  data: {
    logs: [],
    navbarIndex: 0,
    dataList: [{ id: 1, isSelect: false, checked: false }, { id: 2, isSelect: false, checked: false }],
    showSelect: false,
    showMenu: false,
    checkedList: [{ checked: false, value: '' }, { checked: false, value: '' }],
    taskName: '',
    navlist: [{
      text: '我的模板',
      val: 1,
    },
    {
      text: '预设模板',
      val: 2,
    },
      // {
      //   text: '参考模板',
      //   val: 3,
      // }
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
  checkboxChange(e) {
    console.log(e)
    var arr = [];
    for (var value of e.detail.value) {
      arr.push(value);
    }
    this.setData({ checkedList: arr });
  },
  backFn() {
    wx.navigateBack({
      delta: 1,
    })
  },

  bindKeyInput: function (e) {
    let data = {}
    data[e.currentTarget.dataset.label] = e.detail.value
    this.setData(data);
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  getList(page) {
    let signUserName = wx.getStorageSync('signUserName')
    const navMap = {
      1: 0,
      2: 1,
      3: 2
    }
    const navIndex = navMap[this.data.formSearch.type] || 0
    this.setData({
      navbarIndex: navIndex
    })
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
  importFn(e) {
    console.log(this.data.checkedList)

  },
  showCheckedFn() {
    console.log(this.data.checkedList, 'cc')
    this.setData({
      showSelect: true,
      showMenu: false,
    })
  },
})
