const util = require('../../../../utils/util.js')
const api = require('../../../../utils/api/index.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '100',
    userName: '',
    goodsDate: [
      { money: 100, minuteCount: 100, isCheck: true, isRecommend: false, id: 1 },
      { money: 280, minuteCount: 300, isCheck: false, isRecommend: false, id: 1 },
      { money: 460, minuteCount: 500, isCheck: false, isRecommend: true, id: 1 },
      { money: 980, minuteCount: 1000, isCheck: false, isRecommend: false, id: 1 },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  selectGoddsFn(e) {
    let { index } = e.currentTarget.dataset
    let { goodsDate } = this.data
    goodsDate.map(item => {
      item.isCheck = false
    })
    goodsDate[index].isCheck = true
    this.setData({
      goodsDate: goodsDate,
      money: goodsDate[index].money
    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user_info = wx.getStorageSync(app.data.cache_user_info)
    this.setData({
      userName: user_info.MKOUserInfo.userName,
      openId: user_info.MKOUserInfo.openId
    })
    this.getList()
  },

  bindInputChange: function (e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
  },
  getList() {
    console.log('获取数据')

    const param = {
      page: 1,
      count: 1000,
    }
    let apiText = 'getGoodsList'

    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response.datas
          // this.setData({
          //   goodsDate: data
          // })
        }
      }
    })
  },
  nextFn(e) {
    let { openId, goodsDate } = this.data
    const param = {
      buyCount: 1,
      openId: openId,
    }
    goodsDate.map(item => {
      if (item.isCheck) {
        param.goodsId = item.id
      }
    })

    let apiText = 'getWxPayOrder'

    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response
          let { signatureResult } = data
          // this.setData({
          //   goodsDate: data
          // })
          wx.requestPayment(
            {
              'timeStamp': signatureResult.timeStamp,
              'nonceStr': signatureResult.nonceStr,
              'package': signatureResult.package,
              'signType': signatureResult.signType,
              'paySign': signatureResult.paySign,
              'success': function (res) {
                console.log(res, '成功')
                wx.navigateBack({
                  delta: 1,
                })
              },
              'fail': function (res) {
                console.log(res, '失败')
              },
              'complete': function (res) {
                console.log(res, '完成')
              }
            })
        }
      }
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