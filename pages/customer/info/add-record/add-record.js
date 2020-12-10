
const util = require('../../../../utils/util.js')
const api = require('../../../../utils/api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2001-10-1',
    name: '',
    phone: '',
    textarea: '',
    type: 1,
    items: [
      { value: '1', name: '跟进', checked: 'true'  },
      { value: '2', name: '回访'},
    ],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // if (options.id !== 'add' && options.id) {
    //   wx.setNavigationBarTitle({
    //     title: '客户编辑',
    //   })

    // }
    const cache_data = wx.getStorageSync('cache_user_login_key')
    this.setData({
      id: options.id,
      followName: cache_data.MKOUserInfo.userName
    })

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

  },

  bindInputChange: function (e) {
    console.log(e, 'ee')
    let { name } = e.currentTarget.dataset

    let dataObj = {}
    dataObj[name] = e.detail.value
    console.log(dataObj, 'dataObj')
    this.setData(dataObj)
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e)
    let { list } = e.currentTarget.dataset
    const items = this.data[list]
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    let dataObj = {}
    dataObj[list] = items
    dataObj.type = e.detail.value - 0

    this.setData(dataObj)
    console.log('radio发生change事件，携带value值为：', this.data)
  },
  submitFn() {
    let { id, followName, followTitle, followWay,
      followContent, type } = this.data

    console.log(this.data, '222')

    let param = {
      "customerId": id,
      "followName": followName,
      "followTitle": followTitle,
      "followWay": followWay,
      "followContent": followContent,
      "type": type
    }
    api.addCustomerFollow({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '添加成功',
            duration: 2000
          });
          wx.navigateBack({
            delta: 1,
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