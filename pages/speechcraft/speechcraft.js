//statistics.js
const util = require('../../utils/util.js')
const api = require('../../utils/api/index.js')
import * as echarts from '../../ec-canvas/echarts';



Page({
  data: {
    logs: [],
    navbarIndex: 0,
    formSearch: {
      type: 1
    },
    pageItem: {
      1: {},
      2: {}
    },
    dataListDataALL: {
      0: [],
      1: [],
    },
    dataList: [],
    showSelect: false,
    showMenu: false,
    checkedList: [{ checked: false, value: '' }, { checked: false, value: '' }],
    menuArr: [
      { name: '新增模板', url: '/pages/speechcraft/add-speechcraft/add-speechcraft' },
      { name: '导入模板', url: '/pages/speechcraft/import-speechcraft/import-speechcraft' },
    ],
    searchName: '',
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
    if (typeof this.getTabBar === 'function' && this.getTabBar) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.getList(1)
  },
  bindKeyInput: function (e) {
    let data = {}
    data[e.currentTarget.dataset.label] = e.detail.value
    this.setData(data);
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
  getList(page) {
    let signUserName = wx.getStorageSync('signUserName')

    const navIndex = this.data.formSearch.type
    let { searchName } = this.data

    const param = {
      page: 1,
      // count: 10,
      count: 10 * (page || 1),
    }

    if (searchName && searchName.length > 0) {
      param.title = searchName
    }

    let apiText = 'getwhisperingList'
    if (navIndex == 1) {
      apiText = 'getwhisperingList'
      param.type = 1
    } else if (navIndex == 2) {
      apiText = 'getwhisperingList'
      param.type = 2
    }
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response.datas
          this.setData({
            dataList: data
          })
          this.data.pageItem[navIndex] = {
            count: 10,
            countNumber: res.response.currentCount,
            page: res.currentPage,
            pageCount: res.response.totalCount,
          }
        }
      }
    })

  },
  goAddModelFn(e) {
    let { id } = e.currentTarget.dataset

    console.log(id, 'daoru')
    const param = {
      copyWhisperingId: id,
    }

    api.importWhispering({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          // this.getList(1)
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
    console.log(item.val, 'item.val')
    this.getList(item.val)
    if (this.data.pageItem[this.data.formSearch.type]) {
      const pageItem = this.data.pageItem[this.data.formSearch.type];
      if (pageItem.pageCount <= 1 || pageItem.page == pageItem.pageCount) {
        this.setData({
          dataList: this.data.dataListDataALL[this.data.formSearch.type]
        })
        return
      }
      this.getList(this.data.pageItem[this.data.formSearch.type].page)
    } else {
      this.getList(1)
    }
  },
  addItemFn() {
    this.setData({
      showMenu: false,
    })
    wx.navigateTo({
      url: '/pages/speechcraft/add-speechcraft/add-speechcraft',
    })

  },
  showMenuFn() {
    this.setData({
      showMenu: true,
    })
  },
  showCheckedFn() {
    this.setData({
      showMenu: false,
    })
    wx.navigateTo({
      url: '/pages/speechcraft/import-speechcraft/import-speechcraft',
    })
  },
  goInfoFn(e) {
    let { id, title, type } = e.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/speechcraft/add-template-list/add-template-list?id=${id}&title=${title}&type=${type}`,
    })
  },
  goExamineFn(e) {

    const param = {
      whisperingId: e.currentTarget.dataset.id,
    }

    api.examineWhispering({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          this.getList(1)
        }
      }
    })
  },
})
