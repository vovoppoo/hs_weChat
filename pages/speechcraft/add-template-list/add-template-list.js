// pages/speechcraft/add-template-list/add-template-list.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['话术录音', '客户回答'],
    arrayIndex: '',
    inputTitle: '新增子流程',
    showProcedure: true,
    procedureName: '',
    hsType: '',
    menuArr: {
      title: '新增话术',
      thisIndex: '',
      name: '',
    },
    infoData: {},
    showMenu: false,
    floorstatus: false,
    dataList: [{
      title: '主流程',
      show: true,
      addShow: true,
      type: 1,
      menuList: [
      ]
    },
    {
      title: '辅助流程',
      show: false,
      addShow: true,
      type: 2,
      menuList: [
      ]
    }, {
      title: '特殊流程',
      show: false,
      addShow: false,
      type: 3,
      menuList: [
      ]
    },
    ],
    dataListYS: [{
      title: '主流程',
      show: true,
      addShow: true,
      type: 1,
      menuList: [
      ]
    },
    {
      title: '辅助流程',
      show: false,
      addShow: true,
      type: 2,
      menuList: [
      ]
    }, {
      title: '特殊流程',
      show: false,
      addShow: false,
      type: 3,
      menuList: [
      ]
    },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      id: options.id,
      hsType: options.type,
    })

    if (options.title) {
      wx.setNavigationBarTitle({
        title: `${options.title} - 流程设置`
      })
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showMenuFn(e) {
    let { menuArr } = this.data
    let { index, id, name } = e.currentTarget.dataset
    menuArr.thisIndex = index

    if (typeof (id) !== 'undefined') {
      menuArr.id = id
      menuArr.title = '编辑子流程'
      menuArr.name = name
    } else {
      menuArr.id = ''
      menuArr.name = ''
    }

    let obj = {
      menuArr: menuArr,
      showMenu: true,
    }
    this.setData(obj)
  },
  buttonhandle: function (e) {//添加流程弹窗组件触发主页面方法
    let { menuArr } = e.detail
    this.setData({
      menuArr: menuArr,
      procedureName: menuArr.name
    })
    this.submitDataFn({ currentTarget: { dataset: { index: menuArr.thisIndex, LCId: menuArr.id } } })
  },
  goAddModelFn(e) {
    let { id } = this.data
    const param = {
      copyWhisperingId: id,
    }
    wx.showLoading({
      title: '导入需要几分钟',
      mask: true,
    })
    api.importWhispering({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.hideLoading()
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          // this.getList(1)
        }
      }
    })
  },
  getDataList(e) {
    let param = {
      whisperingId: this.data.id,
      page: 1,
      pageSize: 10000,
    }
    let { lc_Data } = this.data
    api.getwhisperingInfoList({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response.datas
          let thisDatas = JSON.parse(JSON.stringify(this.data.dataListYS))
          for (let i = 0; i < data.length; i += 1) {
            thisDatas[(data[i].moduleType - 0) - 1].menuList.push(data[i])
          }
          this.setData({
            dataList: thisDatas
          })
          if (typeof (lc_Data) !== 'undefined' && lc_Data) {
            this.showNoedFn({ currentTarget: { dataset: { ...lc_Data } } })
            wx.removeStorageSync('lc_Data')
          }
        }
      }
    })
  },

  getTypeFn(e) {

    let param = {}
    api.getWhisperingTypeList({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response
          this.setData({
            array: data
          })
        }
      }
    })
  },
  getInfoFn(e) {

    if (this.data.hsType === '2' || this.data.hsType === 2) {
      return
    }
    let param = {
      whisperingId: this.data.id
    }
    api.getwhisperingInfo({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response
          this.setData({
            infoData: data,
            hsType: data.type.toString()
          })
        }
      }
    })
  },
  onPageScroll(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTopFn() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  showViewFn(e) {
    let { index } = e.currentTarget.dataset
    let thisDataList = this.data.dataList
    thisDataList[index].show = !thisDataList[index].show
    this.setData({
      dataList: thisDataList
    })
  },
  showAddNodeFn(e) {
    let { index } = e.currentTarget.dataset
    let thisDataList = this.data.dataList.map(item => {
      item.addShow = true
      return item
    })
    thisDataList[index].addShow = !thisDataList[index].addShow
    this.setData({
      dataList: thisDataList
    })
  },
  cloAddNodeFn(e) {
    let { index } = e.currentTarget.dataset
    let thisDataList = this.data.dataList
    // let thisDataList = this.data.dataList.map(item => {
    //   item.addShow = true
    //   return item
    // })
    thisDataList[index].addShow = !thisDataList[index].addShow
    this.setData({
      dataList: thisDataList
    })
  },
  cloAddProcedureFn() {
    this.setData({
      showProcedure: true,
      procedureName: '',
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      arrayIndex: e.detail.value,
      nodeType: this.data.array[arrayIndex].id
    })
  },
  submitDataFn(e) {
    let { procedureName, infoData } = this.data
    let { index, LCId } = e.currentTarget.dataset
    if (procedureName == '') {
      return
    }

    let param = {
      "whisperingId": infoData.id,
      "moduleType": index + 1,
      "moduleName": procedureName
    }
    let apiText = 'addWhisperingLC'
    if (typeof (id) !== 'undefined') {
      apiText = 'updateWhisperingLC'
      param = {
        "moduleId": LCId,
        "moduleName": procedureName
      }
    }


    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          this.setData({
            procedureName: ''
          })
          this.getDataList()
          this.cloAddNodeFn(e)
        }
      }
    })

  },
  bindInputChange(e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
  },

  showProcedureFn() {
    this.setData({
      showProcedure: !this.data.showProcedure
    })

  },
  addProcedureFn() {
    let { dataList } = this.data
    dataList.push({
      title: '主流程',
      show: true,
      addShow: true,
      menuList: [],
    })
  },

  goAddNodeFn(e) {

    let { id, type, indextype, index, hstype } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/speechcraft/add-template-list/add-node/add-node?id=${id}&hsId=${this.data.id}&indexType=${indextype}&type=${type}&index=${index}&hstype=${hstype}`,
    })

  },
  showNoedFn(e) {
    let { index, id, indextype, } = e.currentTarget.dataset
    let { dataList } = this.data
    if (dataList[indextype - 1].menuList[index].showNode) {
      dataList[indextype - 1].menuList[index].showNode = false
      this.setData({
        dataList: dataList
      })
      return
    }

    let param = {
      whisperingModuleId: id,
      page: 1,
      pageSize: 10000,
    }
    api.getwhisperingNodeList({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let { datas } = res.response
          dataList[indextype - 1].menuList[index].showNode = true
          dataList[indextype - 1].menuList[index].nodeArr = datas
          this.setData({
            dataList: dataList
          })
        }
      }
    })
  },
  //审核
  goExamineFn(e) {
    const param = {
      whisperingId: this.data.id,
    }
    api.examineWhispering({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '审核成功',
            icon: 'success',
            duration: 2000
          })
          this.getInfoFn()
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let lc_Data = wx.getStorageSync('lc_Data')
    this.setData({
      lc_Data: lc_Data
    })
    this.getDataList()
    this.getTypeFn()
    this.getInfoFn()

  },
  goNodeInfoFn(e) {
    let { id, type, indextype, index, nodeid, hstype } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/speechcraft/add-template-list/add-node/add-node?id=${id}&hsId=${this.data.id}&indexType=${indextype}&index=${index}&type=${type}&nodeId=${nodeid}&hstype=${hstype}`,
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})