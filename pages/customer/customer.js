
const util = require('../../utils/util.js')
const api = require('../../utils/api/index.js')
const app = getApp()


Page({
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '客户管理', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../style/iconfont/head-back.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 1.5 + 20,
    height_list: app.globalData.height * 2 + 20 + 120,
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的宽度
    imageHeight: '',// 背景图片的高度
    showPOS: false,
    show_b: false,
    customerName: '',
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
      { name: '添加客户', url: `/pages/customer/add/add-customer` },
      { name: '批量导入', url: `/pages/customer/add-list/add-list-customer` },
    ],
    screenArr: [
      {
        name: '客户等级',
        value: '',
        id: 0,
        labelArr: [{ name: 'A', value: 'A', isSelect: false },
        { name: 'B', value: 'B', isSelect: false },
        { name: 'C', value: 'C', isSelect: false }]
      },
      {
        name: '客户性别',
        value: '',
        id: 1,
        labelArr: [{ name: '男', value: 1, isSelect: false },
        { name: '女', value: 2, isSelect: false }],
      },
      {
        name: '微信添加状态',
        value: '',
        id: 2,
        labelArr: [{ name: '已添加', value: 1, isSelect: false },
        { name: '未添加', value: 0, isSelect: false }],
      },
    ],
    multiIndex: [0, 0],
    navbarIndex: 0,
    navlist: [{
      text: '客户列表',
      val: 1,
    },
    {
      text: '线索池',
      val: 2,
    },
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
        selected: 3
      })
    }
    this.getList()
    this.getLabelDataList()
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
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['全部', '待开发', '待跟进', '已跟进', '已交易'];
            break;
          case 1:
            data.multiArray[1] = ['男', '女'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
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
      content: `是否删除用户：${name}`,
      success(res) {
        if (res.confirm) {
          let param = {
            customerId: id
          }
          let apiText = 'deleteCustomerInfo'
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
  goAddListFn(e) {
    wx.navigateTo({
      url: `/pages/customer/add-list/add-list-customer?id=${e.currentTarget.dataset.id}`,
    })
  },
  goInfoFn(e) {
    wx.navigateTo({
      url: `/pages/customer/info/info-customer?id=${e.currentTarget.dataset.id}`,
    })

  },
  getList(e, page) {
    console.log(page, '获取数据')
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
      pageSize: 10 * (typeof (page) == 'undefined' ? 1 : page),
    }
    let { paramSearchArr, searchLabelArr, searchLabelString, customerName } = this.data
    searchLabelArr = []
    for (let i = 0; i < paramSearchArr.length; i += 1) {
      let forArr = paramSearchArr[i].labelArr
      for (let j = 0; j < forArr.length; j += 1) {
        if (forArr[j].isSelect) {
          console.log(paramSearchArr[i].id, 'id')

          searchLabelArr.push(forArr[j].name)


          if (paramSearchArr[i].id === 0) {
            param.level = forArr[j].value
          } else if (paramSearchArr[i].id === 1) {
            param.customerSex = forArr[j].value
          } else if (paramSearchArr[i].id === 2) {
            param.addWeChat = forArr[j].value
          } else if (paramSearchArr[i].id === 3) {
            param.label = forArr[j].value
          }
        }
      }
    }

    if (customerName.length > 0) {
      param.customerName = customerName
    }

    searchLabelString = searchLabelArr.join('、')
    this.setData({
      searchLabelString: searchLabelString,
      searchLabelArr: searchLabelArr
    })

    let apiText = 'getCustomerList'
    if (navIndex == 0) {
      apiText = 'getCustomerList'
      param.type = 2
    } else if (navIndex == 1) {
      apiText = 'getCustomerList'
      param.type = 1
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
          console.log(this.data.formSearch.type, 'this.data.formSearch.type')
          data.map(item => {
            // console.log(item, 'item')
            if (item.customerLabel !== null) {
              item.customerLabel = item.customerLabel.split(',')
            }
            return item
          })

          this.setData({
            dataList: data
          })
          this.data.pageItem[this.data.formSearch.type] = {
            count: res.response.currentCount,
            countNumber: res.response.totalCount,
            page: 1,
            pageCount: res.response.pageSize,
          }
          this.data.dataALL[this.data.formSearch.type] = this.data.dataList
        }
      }
    })

  },
  getLabelDataList(e) {

    let param = {
      page: 1,
      pageSize: 10000,
    }
    api.getCustomerLabelList({
      data: param,
      s: (res) => {
        if (res.code === 0) {

          let { screenArr } = this.data
          let data = {
            name: '客户标签',
            value: '',
            id: 3,
            labelArr: [],
          }

          res.response.datas.map(item => {
            data.labelArr.push({
              name: item.label,
              value: item.id,
              isSelect: false
            })
          })

          screenArr.push(data)

          this.setData({
            screenArr: screenArr
          })
        }
      }
    })
  },
  buttonhandle: function (e) {
    let { menuArr } = e.detail
    console.log(menuArr, '触发')
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
    this.getList()
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
