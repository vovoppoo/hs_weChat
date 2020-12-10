// pages/customer/info/info-customer.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarIndex: 0,
    userType: 2,
    navlist: [{
      text: '基本资料',
      val: 1,
    },
    {
      text: '跟进记录',
      val: 2,
    },
    {
      text: '通话详情',
      val: 3,
    },
    ],
    formSearch: {},
    pageItem: {},
    dataList2: [],
    dataList3: [{ id: 1, display: 'display-none' }, { id: 2, display: 'display-none' }, { id: 3, display: 'display-none' }, { id: 4, display: 'display-none' }, { id: 1, display: 'display-none' },],
    dataList: ['张三', '13195271314', 'B', '外来户', '老板介绍', '2020-8-20', '20', '20', '男', '33', '1987-10-20', 'vip3987711', '广东省深圳市'],
    labelList: ['客户姓名', '手机号码', '客户类型', '客户标签', '客户来源', '最后跟进', '任务数', '通话次数', '性别', '年龄', '生日', '微信', '地区'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  navbarClick(e) {
    const detail = e.detail
    const item = detail.item

    this.setData({
      formSearch: {
        type: item.val || 1
      }
    })
    this.getList(1)
  },
  changeMeunFn(e) {
    let { display, index } = e.currentTarget.dataset
    let dataList = this.data.dataList3

    if (dataList[index].display == '') {
      dataList[index].display = 'display-none'
    } else {
      dataList[index].display = ''
    }
    console.log(dataList, '2222')

    this.setData({
      dataList3: dataList
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
      customerId: this.data.id,
    }

    let apiText = 'getCustomerInfo'
    let dataText = 'dataList'
    if (navIndex == 0) {
      apiText = 'getCustomerInfo'
      dataText = 'dataList'
    } else if (navIndex == 1) {
      param.page = 1
      param.pageSize = page * 3
      apiText = 'listCustomerFollow'
      dataText = 'dataList2'
    } else if (navIndex == 2) {
      apiText = 'getDataList'
      dataText = 'dataList3'
    }
    console.log(page, 'page')
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {

          let data = res.response
          let obj = {}
          if (navIndex == 0) {

            apiText = 'getCustomerInfo'
            let {
              customerName,
              customerPhone,
              customerLevel,
              customerLabel,
              gmtCreate,
              customerSex,
              customerBirthday,
              weChatId,
              province,
              city,
              type
            } = res.response


            let dataObj = {
              customerName: customerName,
              customerPhone: customerPhone,
              customerLevel: customerLevel,
              customerLabel: customerLabel,
              layuan: '用户新增',
              gmtCreate: gmtCreate,
              taskCount: 20,
              thcis: 20,
              customerSex: customerSex,
              age: new Date().getFullYear() - new Date(customerBirthday).getFullYear(),
              customerBirthday: customerBirthday,
              weChatId: weChatId,
              address: `${province} - ${city}`
            }
            if (type === 1) {
              this.setData({
                navlist: [{
                  text: '基本资料',
                  val: 1,
                },
                {
                  text: '通话详情',
                  val: 3,
                },
                ],
               userType: type,
              })
            }
            obj[dataText] = dataObj
          } else if (navIndex == 1) {
            apiText = 'listCustomerFollow'
            obj[dataText] = res.response.datas
          } else if (navIndex == 2) {
            apiText = 'getDataList'
          }

          this.setData(obj)
          this.data.pageItem[dataText] = {
            count: 2,
            countNumber: res.response.countNumber,
            page: page,
            pageCount: res.response.pageCount,
          }
        }
      }
    })

  },
  goAddRecordFn(e) {
    wx.navigateTo({
      url: `/pages/customer/info/add-record/add-record?id=${this.data.id}`,
    })
  },
  goPhoneFn() {
    let _this = this
    wx.makePhoneCall({
      phoneNumber: _this.data.dataList.customerPhone, //电话号码
      success: (res) => {
        console.log(res, 'res')

      }
    })
  },
  goWecharFn() {
    let _this = this


    wx.showModal({
      title: '是否复制微信号/手机号',
      showCancel: false,
      confirmText: '复制',
      content: '请到微信好友搜索页面粘贴添加',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: _this.data.dataList.weChatId || _this.data.dataList.customerPhone,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  console.log(res.data) // data
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList(1)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('拉到底')
    const navMap = {
      1: 0,
      2: 1,
      3: 2
    }
    const navIndex = navMap[this.data.formSearch.type] || 0
    if (navIndex === 1) {
      let thisPage = this.data.pageItem.dataList2.page + 1
      if (thisPage * 5 < this.data.pageItem.dataList2.countNumber) {
        this.getList(this.data.pageItem.dataList2.page + 1)
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})