// pages/index/index/recharge-record/recharge-record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      {
        id: 1,
        month: '2020年9月',
        monthList: [
          {
            label: '余额充值',
            time: '9月21日 21:19',
            type: 1,
            money: 100,
          },
          {
            label: '通话扣费',
            time: '9月21日 11:13',
            type: 2,
            money: 100,
          },
          {
            label: '通话扣费',
            time: '9月21日 8:13',
            type: 2,
            money: 100,
          }
        ]
      }
    ]
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