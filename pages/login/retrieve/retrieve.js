const app = getApp()
const util = require('../../../utils/util.js')
const md5 = require('../../../utils/md5.js')
const api = require('../../../utils/api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    account: '',
    radioValue: false,
    buttonText: '获取验证码',
    gobuttonText: '下一步',
    timeCountNum: 0,
    isEdit: false,
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

  bindInputChange: function (e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
  },
  goRetrieveFn(e) {


    let apiText = 'getAuthentication'
    let param = {
      "userName": this.data.account,
      "phone": this.data.mobile,
      "captcha": this.data.captcha,
    }
    if (this.data.isEdit) {
      apiText = 'resetPassword'
      param = {
        "password": this.data.password,
        "platformPassword": this.data.password,

      }

      if (this.data.password !== this.data.platformPassword) {
        wx.showToast({
          title: '确认密码不一致',
          duration: 2000
        });
        return
      }
      param.password = md5.hexMD5(param.password)
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

   
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          if (this.data.isEdit) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            wx.setStorageSync('token', res.response.token);
            this.setData({
              isEdit: true,
              gobuttonText: '确认并前往登录'
            })
          }
        }
      }
    })

  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    this.setData({
      account: '13557532897',
      mobile: '13557532897',
    })

  },
  getCaptchaFn(e) {
    let _this = this

    if (!this.data.mobile || this.data.mobile === '') {
      wx.showToast({
        title: '请填写手机号！',
        duration: 2000
      });
      return
    }

    let param = {
      phone: this.data.mobile
    }
    _this.data.timeCountNum = 60
    _this.data.timeObj = setInterval(() => {
      _this.data.timeCountNum = this.data.timeCountNum - 1
      _this.setData({
        buttonText: `${_this.data.timeCountNum} s`
      })
      if (_this.data.timeCountNum <= 0) {
        this.setData({
          buttonText: `获取验证码`
        })
        clearInterval(_this.data.timeObj);
      }
    }, 1000);
    api.getsendSMS({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          });
        }
      }
    })



  },

  checkboxChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      radioValue: e.detail.value[0]
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