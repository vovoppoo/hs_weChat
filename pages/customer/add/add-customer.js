// pages/customer/add/add-customer.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-10-01',
    name: '',
    phone: '',
    addWeChat: 0,
    labelName: '',
    gender: false,
    showModel: false,
    tagArr: [],
    items: [
      { value: '1', name: '男' },
      { value: '2', name: '女', checked: 'true' },
    ],
    itemswx: [
      { value: 1, name: '已添加' },
      { value: 2, name: '未添加', checked: 'true' },
    ],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.id !== 'add' && options.id) {
      wx.setNavigationBarTitle({
        title: '客户编辑',
      })
    }

    if (options.id) {
      this.setData({
        id: options.id,
      })
    }





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

    let _this = this
    let promise = new Promise(function (resolve, reject) {
      _this.getLabelDataList()
      resolve();
    });

    promise.then(function () {
      if (_this.data.id) {
        _this.getInfoDataFn()

      }
    });

  },
  showModelFn() {
    this.setData({
      showModel: !this.data.showModel,
      labelName: ''
    })
  },
  addTagFn() {
    let { labelName } = this.data

    if (labelName == '' || !labelName) {
      wx.showToast({
        title: '标签名填写不正确',
        duration: 2000
      });
      return
    }

    let param = {
      "label": labelName,
    }
    api.addCustomerLabel({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          this.showModelFn()
          this.getLabelDataList()

        }
      }
    })
  },
  selectGenderFn() {
    this.setData({
      gender: !this.data.gender
    })
    console.log(this.data.gender, 'gender')
  },
  bindInputChange: function (e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
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
          this.setData({
            tagArr: res.response.datas
          })
        }
      }
    })
  },
  getInfoDataFn(e) {

    let param = {
      customerId: this.data.id,
    }
    api.getCustomerInfo({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let { response } = res
          let { tagArr } = this.data
          let data = {
            id: response.id,
            name: response.customerName,
            phone: response.customerPhone,
            gender: response.customerSex == 1 ? true : false,
            date: response.customerBirthday,
            weChatId: response.weChatId,
            addWeChat: response.addWeChat,
          }
          data.region = []
          let cityArr = response.city.split(',')
          data.region[0] = response.province
          data.region[1] = cityArr[0]
          data.region[2] = cityArr[1]
          let customerLabelArr = response.customerLabel.split(',')
          for (let j = 0; j < customerLabelArr.length; j += 1) {
            for (let i = 0; i < tagArr.length; i += 1) {
              if (tagArr[i].id == customerLabelArr[j]) {
                tagArr[i].on = 'nan is'
              }
            }
          }

          data.tagArr = tagArr
          console.log(data, 'data')

          this.setData(data)
        }
      }
    })
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
    dataObj.addWeChat = e.detail.value - 0

    this.setData(dataObj)
    console.log('radio发生change事件，携带value值为：', this.data)
  },
  submitFn() {



    let { region, addWeChat, date, weChatId,
      gender, name, phone, tagArr } = this.data

    let param = {
      "customerName": name,
      "customerPhone": phone,
      "customerSex": gender ? 1 : 2,
      "customerBirthday": date,
      "weChatId": weChatId,
      "addWeChat": addWeChat,
      "province": region[0],
      "city": `${region[1]} ,${region[2]}`
    }
    let customerIdArr = []
    for (let i = 0; i < tagArr.length; i += 1) {
      if (tagArr[i].on === 'nan is') {
        customerIdArr.push(tagArr[i].id)
      }
    }
    param.customerLabel = customerIdArr.join(',')
    let apiText = 'addCustomer'
    if (this.data.id) {
      param.id = this.data.id
      apiText = 'updateCustomer'
    }

    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '添加成功',
            duration: 2000
          });
          wx.switchTab({
            url: '/pages/customer/customer'
          })
        }
      }
    })
  },

  selectTagFn(e) {
    let { index } = e.currentTarget.dataset
    let { tagArr } = this.data
    console.log(tagArr[index].on, 'tagArr[index].no')
    if (tagArr[index].on === 'nan is') {
      tagArr[index].on = ''
    } else {
      tagArr[index].on = 'nan is'
    }
    console.log(tagArr, 'tagArr')
    this.setData({
      tagArr: tagArr
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