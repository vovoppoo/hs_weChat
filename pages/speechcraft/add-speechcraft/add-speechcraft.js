// pages/speechcraft/add-speechcraft/add-speechcraft.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "title": "",
    "typeId": '',
    index: '',
    array: [],
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTypeFn()
  },
  bindInputChange: function (e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
  },
  bindPickerChange(e) {
    this.setData({
      typeId: this.data.array[e.detail.value].id,
      index: e.detail.value,
    })
  },
  nextFn(e) {

    let param = {
      "title": this.data.title,
      "typeId": this.data.typeId,
    }
    if (!app.validationParametersfn(param)) {
      return
    }
    api.addWhispering({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response
          wx.redirectTo({
            url: `/pages/speechcraft/add-template-list/add-template-list?id=${data || 1}`,
          })
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