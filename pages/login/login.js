// pages/login/login.js

const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')
const api = require('../../utils/api/index.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    account: '',
    loginState: 'wx',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cache_user_info = wx.getStorageSync(app.data.cache_user_info)
    let token = wx.getStorageSync("token")
    let self = this

    if (token || token !== '') {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.switchTab({
        // url: '/pages/data-statistics/statistics',
        url: '/pages/speechcraft/new-speechcraft/speechcraft',
      })
    } else {
      wx.login({
        success(ret) {
          if (ret.code) {
            self.setData({
              code: ret.code
            })
            self.getSessionFn(ret.code)
          }
        }
      })
    }
  },
  getSessionFn(code) {

    let apiText = 'getWeChatLoginInfo'
    let param = {
      code: code
    }
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          this.setData(res.response)
        }
      }
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
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    let { iv, encryptedData } = e.detail
    let { sessionKey } = this.data
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let apiText = 'goLogin'
      let param = {
        "platform": "weChatLogin",       //weChatLogin:微信一键登录
        "encryptedData": encryptedData,  //微信一键登录是必传字段
        "iv": iv,     //微信一键登录是必传字段
        "sessionKey": sessionKey,   //微信一键登录是必传字段
      }
      wx.showLoading({
        title: '通信中',
        mask: true,
      })

      api[apiText]({
        data: param,
        s: (res) => {
          wx.hideLoading()
          if (res.code === 0) {

            let data = res.response
            wx.setStorageSync(app.data.cache_user_info, data);
            wx.setStorageSync('token', data.token);

            wx.switchTab({
              // url: '/pages/data-statistics/statistics',
              url: '/pages/speechcraft/new-speechcraft/speechcraft',

            })
          }
        }
      })

    }

  },

  bindInputChange: function (e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
  },
  nextWXLoginFn() {
    this.setData({
      loginState: 'wx',
    })
  },
  nextAccountLoginFn() {
    this.setData({
      loginState: 'account',
    })
  },
  nextLoginFn(e) {


    const param = {
      "platform": "weChat",
      "userName": this.data.account,
      "password": md5.hexMD5(this.data.password),
    }

    for (let item in param) {
      if (param[item] === '' || !param[item]) {
        wx.showToast({
          title: '请填写完整！',
          duration: 2000
        });
        return
      }
    }
    wx.showLoading({
      title: '通信中',
      mask: true,
    })
    api.goLogin({
      data: param,
      s: (res) => {
        wx.hideLoading()
        if (res.code === 0) {

          let data = res.response
          wx.setStorageSync(app.data.cache_user_info, data);
          wx.setStorageSync('token', data.token);

          wx.switchTab({
            // url: '/pages/data-statistics/statistics',
            url: '/pages/speechcraft/new-speechcraft/speechcraft',

          })
        }
      }
    })

  },
  nextRegisterFn(e) {
    wx.navigateTo({
      url: '/pages/login/register/register',
    })
  },

  nextRetrieveFn() {
    wx.navigateTo({
      url: '/pages/login/retrieve/retrieve',
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