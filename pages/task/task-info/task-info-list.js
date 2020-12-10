
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()


Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '任务客户数据', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '/style/iconfont/head-back.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 1.5 + 20,
    height_list: app.globalData.height * 2 + 20 + 120,
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的宽度
    imageHeight: '',// 背景图片的高度
    showPOS: false,
    show_b: false,
    taskName: '',
    refresherTriggered: false,
    logs: [],
    dataList: [],
    pageItem: {},
    dataALL: {},
    paramSearchArr: [],
    searchLabelArr: [],
    searchLabelString: '',
    formSearch: {
      type: 1
    },
    array: [{ name: '全部', value: 1 }, { name: '已暂停', value: 2 }, { name: '进行中', value: 2 }, { name: '已完成', value: 3 }],
    multiArray: [['客户分类', '性别'], ['全部', '待开发', '待跟进', '已跟进', '已交易']],
    showMenu: false,
    showScreen: false,
    menuArr: [
      { name: '添加任务', url: `/pages/customer/add/add-customer` },
      { name: '批量导入', url: `/pages/customer/add-list/add-list-customer` },
    ],
    screenArr: [
      {
        name: '任务状态',
        value: '',
        id: 0,
        labelArr: [{ name: '未开始', value: '0', isSelect: false },
        { name: '进行中', value: '1', isSelect: false },
        { name: '已暂停', value: '2', isSelect: false },
        { name: '已终止', value: '3', isSelect: false },
        { name: '已完成', value: '4', isSelect: false },
        ]
      },
    ],
    multiIndex: [0, 0],
    navbarIndex: 0,
    navlist: [{
      text: '全部',
      val: 1,
    },
    {
      text: '已接通',
      val: 2,
    },
    {
      text: '拒接',
      val: 3,
    },
    {
      text: '无法接通',
      val: 4,
    },
    ]
  },
  onLoad: function (op) {
    this.setData({
      id: op.id,
      type: op.type
    })

    if (op.type === 'kh') {
      let { navbarData, navlist } = this.data
      navlist = [{
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
      },
      {
        text: 'C',
        val: 4,
      },
      ]
      navbarData.title = '任务客户等级占比数据'
      this.setData({
        navbarData: navbarData,
        navlist: navlist
      })
    }
    innerAudioContext.onEnded((res) => {
      let { dataList } = this.data
      dataList.map(item => {
        item.audioButtonText = '播放'
        return item
      })
      this.setData({
        dataList: dataList
      })
    })
    innerAudioContext.onCanplay(() => {
      wx.hideLoading({
        success: (res) => {
        },
      })
    })
  },
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000);
  },
  onShow() {
    this.getList()
  },
  addTaskFn() {
    wx.navigateTo({
      url: '/pages/task/add-page/add-task-page',
    })
  },
  showMenuFn() {
    this.setData({
      showMenu: true,
    })
  },
  showScreenFn() {
    this.setData({
      showScreen: true,
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindKeyInput: function (e) {
    let data = {}
    data[e.currentTarget.dataset.label] = e.detail.value
    this.setData(data);
  },
  goAddFn(e) {
    wx.navigateTo({
      url: `/pages/customer/add/add-customer?id=${e.currentTarget.dataset.id}`,
    })
  },
  goDeleteFn(e) {
    let { id, name } = e.currentTarget.dataset
    let _this = this
    wx.showModal({
      title: '提示',
      content: `是否删除任务：${name}`,
      success(res) {
        if (res.confirm) {
          let param = {
            taskId: id
          }
          let apiText = 'deleteTask'
          api[apiText]({
            data: param,
            s: (res) => {
              if (res.code === 0) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                _this.getList()

              }
            }
          })

        } else if (res.cancel) {
        }
      }
    })
  },

  goChangeStatusFn(e) {
    let { status, id } = e.currentTarget.dataset
    let _this = this
    let param = {
      taskId: id,
      status: status
    }
    let apiText = 'updateTaskStatus'
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          _this.getList()

        }
      }
    })
  },
  palyAudio(e) {
    let { url, audiobuttontext, index } = e.currentTarget.dataset
    let { dataList } = this.data

    dataList.map(item => {
      item.audioButtonText = '播放'
      return item
    })
    innerAudioContext.src = url
    wx.showLoading({
      title: '加载音频中',
      mask: true,
    })
    if (audiobuttontext === '播放') {
      innerAudioContext.stop()
      dataList[index].audioButtonText = '停止'
      innerAudioContext.play()
     
    } else {
      dataList[index].audioButtonText = '播放'
      innerAudioContext.stop()
    }
    this.setData({
      dataList: dataList
    })

  },
  goInfoFn(e) {
    return
    wx.navigateTo({
      url: `/pages/task/task-info/task-info?id=${e.currentTarget.dataset.id}`,
    })

  },
  getList(e, page) {
    console.log('获取数据')
    const navMap = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
    }
    const navIndex = navMap[this.data.formSearch.type] || 0
    this.setData({
      navbarIndex: navIndex
    })
    const param = {
      page: 1,
      // count: 10,
      pageSize: 10 * (typeof (page) == 'undefined' ? 1 : page),
    }
    let { type, id, paramSearchArr, searchLabelArr, searchLabelString, taskName } = this.data
    param.taskId = id
    searchLabelArr = []
    for (let i = 0; i < paramSearchArr.length; i += 1) {
      let forArr = paramSearchArr[i].labelArr
      for (let j = 0; j < forArr.length; j += 1) {
        if (forArr[j].isSelect) {
          searchLabelArr.push(forArr[j].name)
          if (paramSearchArr[i].id === 0) {
            param.status = forArr[j].value
          } else if (paramSearchArr[i].id === 1) {
            param.gender = forArr[j].value
          } else if (paramSearchArr[i].id === 2) {
            param.label = forArr[j].value
          } else if (paramSearchArr[i].id === 3) {
            param.label = forArr[j].value
          }
        }
      }
    }

    if (taskName.length > 0) {
      param.taskName = taskName
    }

    searchLabelString = searchLabelArr.join('、')
    this.setData({
      searchLabelString: searchLabelString,
      searchLabelArr: searchLabelArr
    })

    let apiText = 'getTaskCustomerList'

    if (navIndex == 0) {
      // param.status = 1
    } else if (navIndex == 1) {
      param.status = 2
    } else if (navIndex == 2) {
      param.status = 4
    } else if (navIndex == 3) {
      param.status = 3
    }

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    api[apiText]({
      data: param,
      s: (res) => {
        this.setData({
          refresherTriggered: false,//停止下拉刷新
        })
        wx.hideLoading()
        if (res.code === 0) {
          let data = res.response.datas
          data.map(item => {
            item.audioButtonText = '播放'
            return item
          })


          this.setData({
            dataList: data
          })
          this.data.pageItem[this.data.formSearch.type] = {
            count: 10,
            countNumber: res.response.countNumber,
            page: page,
            pageCount: res.response.pageCount,
          }
          this.data.dataALL[this.data.formSearch.type] = this.data.dataList
        }
      }
    })

  },
  buttonhandle: function (e) {//筛选组件触发主页面方法
    let { menuArr } = e.detail
    this.setData({
      paramSearchArr: menuArr
    })
    this.getList()
  },
  navbarClick(e) {
    const detail = e.detail
    const item = detail.item

    this.setData({
      formSearch: {
        type: item.val || 1
      }
    })
    this.getList()
    return
    if (this.data.pageItem[this.data.formSearch.type]) {
      const pageItem = this.data.pageItem[this.data.formSearch.type];
      if (pageItem.pageCount <= 1 || pageItem.page == pageItem.pageCount) {
        this.setData({
          taskData: this.data.dataALL[this.data.formSearch.type]
        })
        return
      }
      this.getList(this.data.pageItem[this.data.formSearch.type].page)
    } else {
      this.getList(1)
    }
  },
  //下拉刷新

  onPullDownRefresh() {

    this.getList({}, 2)
  },
  //计算图片宽
  imgLoaded(e) {
    this.setData({
      imageHeight: (e.detail.height *
        (wx.getSystemInfoSync().windowWidth / e.detail.width))

    })
  },
  //上拉刷新
  bindscrolltoupperFn(e) {
    console.log(e.detail, '到顶')
    this.getList()
  },
  //下拉到底
  bindscrolltolowerFn(e) {
    console.log(e.detail, '到底')
    if (this.data.pageItem[this.data.formSearch.type]) {
      const pageItem = this.data.pageItem[this.data.formSearch.type];
      if (pageItem.pageCount <= 1 || pageItem.page == pageItem.pageCount) {
        this.setData({
          dataList: this.data.dataALL[this.data.formSearch.type]
        })
        return
      }
      this.getList({}, this.data.pageItem[this.data.formSearch.type].page + 1)
    } else {
      this.getList({}, 1)
    }
  }
})
