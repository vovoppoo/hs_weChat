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
    showInput: true,
    buttonText: '获取验证码',
    timeCountNum: 0,
    step: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let self = this
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
    if (name === "account") {
      dataObj.mobile = e.detail.value
    }

    this.setData(dataObj)
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    let { iv, encryptedData } = e.detail
    let { sessionKey } = this.data
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let apiText = 'getWeChatUserPhone'
      let param = {
        "encryptedData": encryptedData,
        "iv": iv,
        "sessionKey": sessionKey,
      }
      api[apiText]({
        data: param,
        s: (res) => {
          if (res.code === 0) {
            this.setData({
              showInput: true,
              account: res.response,
              mobile: res.response,
            })
          }
        }
      })

    } else {
      this.setData({
        showInput: false,
        account: '',
        mobile: '',
      })
    }

  },
  goSetPassworddFn() {
    if (this.data.captcha === '') {
      wx.showToast({
        title: '请填写验证码',
        duration: 2000
      });
      return
    }
    let apiText = 'getValidPhoneCaptcha'
    let param = {
      "phone": this.data.mobile,
      "captcha": this.data.captcha
    }
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          this.setData({
            step: 2
          })
        }
      }
    })
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
          console.log(this.setData.openId, 'openId')
          console.log(this.setData.sessionKey, 'sessionKey')
        }
      }
    })
  },
  goRegisterFn() {

    if (this.data.password !== this.data.platformPassword) {
      wx.showToast({
        title: '确认密码不一致',
        duration: 2000
      });
      return
    }
    let { code, account, password, openId, mobile, captcha } = this.data


    let param = {
      "userName": account,
      "password": md5.hexMD5(password),
      "platformPassword": password,
      "mobile": mobile,
      "captcha": captcha,
      code: code,
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

    param.openId = openId || ""


    wx.showLoading({
      title: '通信中',
      mask: true,
    })

    api.goRegister({
      data: param,
      s: (res) => {
        wx.hideLoading()
        if (res.code === 0) {
          // wx.setStorageSync(app.data.cache_user_info, data);
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
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
    this.setData({
      radioValue: e.detail.value.length > 0 ? true : false
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