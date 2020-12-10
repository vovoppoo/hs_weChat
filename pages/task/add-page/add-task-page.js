// pages/task/add-page/add-task-page.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-10-01',
    nowDate: '',
    name: '',
    customerListKH: [],
    customerListXS: [],
    addWeChat: 0,
    labelName: '',
    time: "08:00",
    startT: false,
    am_start_time: '08:01',
    am_end_time: '12:00',
    pm_start_time: '12:01',
    pm_end_time: '22:59',
    showModel: false,
    khLevel: '',
    levelArr: [
      { name: '全部', is: true, id: '全部' },
      { name: 'A', is: false, id: 'A' },
      { name: 'B', is: false, id: 'B' },
      { name: 'C', is: false, id: 'C' },
      { name: '不选择', is: false, id: '不选择' },
    ],
    labelArr: [],
    tzNameKD: '请选择话术',
    kdType: false,//肯定跳转参数
    keyWordKD: '',
    levelKD: 'C',
    tzTypeKD: 4,
    date: '请选择',
    multiIndexKD: [0, 0],
    multiArray: [[{ title: '我的模板', id: 1 }], []],
    objmultiArray: {
      '我的模板': { type: 1, arr: [] },
      '预设模板': { type: 2, arr: [] },
      1: { type: '我的模板', arr: [] },
      2: { type: '预设模板', arr: [] },
    },
    tagArr: [],
    tagLabelArr: [],
    titleArr: ['客户级别', '命中关键字', '通话轮次', '通话时长(S)'],
    titleArrA: ['A', '1', '3', '30'],
    titleArrB: ['B', '1', '2', '20'],
    titleArrC: ['C', '0', '1', '2'],
    items: [
      { value: '1', name: '男' },
      { value: '2', name: '女', checked: 'true' },
    ],
    itemswx: [
      { value: 1, name: '已添加' },
      { value: 2, name: '未添加', checked: 'true' },
    ],
    weekArr: [
      { name: '周一', is: false, value: 1 },
      { name: '周二', is: false, value: 2 },
      { name: '周三', is: false, value: 3 },
      { name: '周四', is: false, value: 4 },
      { name: '周五', is: false, value: 5 },
      { name: '周六', is: false, value: 6 },
      { name: '周日', is: false, value: 7 },
    ],
    pcDateArr: [

    ],
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
    let nowDate = new Date()
    nowDate = util.formatTime(nowDate, 'day')
    this.setData({
      nowDate: nowDate,
      date: nowDate
    })
    if (options.id) {
      this.setData({
        id: options.id,
      })
    }



    console.log(nowDate)





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
      _this.getHSDataList(1)
      // _this.getHSDataList(2)
      resolve();
    });

    promise.then(function () {
      _this.getLabelDataList()
      _this.getTimeDataList()
      _this.getCustomerListFn(1)
      _this.getCustomerListFn(2)
    });

  },
  bindStartTimeChange: function (e) {//定时启动时间
    this.setData({
      time: e.detail.value
    })
  },
  selectweekFn(e) {
    let { index } = e.currentTarget.dataset
    let { weekArr } = this.data
    let obj = {}
    weekArr[index].is = !weekArr[index].is
    obj.weekArr = weekArr
    this.setData(obj)

  },
  bindDateChange: function (e) {
    let { pcDateArr } = this.data
    pcDateArr.push(
      e.detail.value
    )
    this.setData({
      date: e.detail.value,
      pcDateArr: pcDateArr
    })

  },
  selectLevelFn(e) {
    let { index, name, type } = e.currentTarget.dataset
    let levelArr = this.data[name]
    levelArr.map(item => {
      item.is = false
      return item
    })
    levelArr[index].is = true

    if (levelArr[index].id !== '不选择') {
      let param = {
        type: type - 0,
        page: 1,
        pageSize: 10000,
      }
      if (levelArr[index].id !== '全部') {
        if (type === '2') {
          param.level = levelArr[index].id
        } else if (type === '1') {
          param.label = levelArr[index].id
        }
      }
      api.getCustomerList({
        data: param,
        s: (res) => {
          if (res.code === 0) {
            let { datas } = res.response

            if (type === '2') {
              this.setData({
                customerListKH: datas
              }
              )
            } else if (type === '1') {
              this.setData({
                customerListXS: datas
              })
            }

          }
        }
      })
    } else {
      if (type === '2') {
        this.setData({
          customerListKH: []
        }
        )
      } else if (type === '1') {
        this.setData({
          customerListXS: []
        })
      }
    }


    let obj = {}
    obj[name] = levelArr
    this.setData(obj)
  },
  bindTimeChange: function (e) { //选择时间模板日呼叫时间
    let { name, changename, type } = e.currentTarget.dataset
    let newDate = new Date()
    let date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    let Ldate = new Date(`${date} ${e.detail.value}:00`)
    let Rdate = new Date(`${date} ${this.data[changename]}:00`)
    let value = e.detail.value
    let obj = {}

    if (type === '1') {
      if (Ldate.getTime() > Rdate.getTime()) {//如果开始时间超过结束时间，调换开始和结束时间
        value = this.data[changename]
        obj[changename] = e.detail.value
      }
    } else if (type === '2') {
      if (Ldate.getTime() < Rdate.getTime()) {//如果结束时间早于开始时间，调换开始和结束时间
        value = this.data[changename]
        obj[changename] = e.detail.value
      }
    }


    obj[name] = value
    this.setData(obj)
  },
  getHSDataList(type) {
    let param = {
      type: type,
      page: 1,
      pageSize: 1000
    }
    api.getwhisperingList({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let objData = {}
          let { multiArray } = this.data
          let { datas } = res.response


          for (let i = 0; i < datas.length; i += 1) {
            if (datas[i].auditStatus == 4) {
              this.data.objmultiArray[datas[i].type].arr.push(datas[i])
            }
          }
          console.log(this.data.objmultiArray, ' this.data.objmultiArray')
          multiArray[1] = this.data.objmultiArray['1'].arr
          objData.multiArray = multiArray
          this.setData(objData)
          console.log(this.data.multiArray, ' this.data.multiArray')
        }
      }
    })
  },
  bindMultiPickerChange: function (e) {//多选择器
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // multiArray[1][e.detail.value[1]].moduleName
    let { name, valuearr, tzid, tzname, } = e.currentTarget.dataset
    let obj = {}
    obj[valuearr] = e.detail.value
    obj[tzid] = this.data.multiArray[1][e.detail.value[1]].id
    obj[tzname] = this.data.multiArray[1][e.detail.value[1]].title
    console.log('obj', obj)
    this.setData(obj)
  },
  bindMultiPickerColumnChange: function (e) {//多选择器
    // console.log('修改的列为', e, '，值为', e);
    let { name, valuearr, index } = e.currentTarget.dataset
    var data = {
      multiArray: this.data.multiArray,
    };
    data[valuearr] = this.data[valuearr]

    console.log(data[valuearr], 'data[valuearr]')
    let { objmultiArray } = this.data
    data[valuearr][e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data[valuearr][0]) {
          case 0:
            data.multiArray[1] = objmultiArray[1].arr;
            break;
          case 1:
            data.multiArray[1] = objmultiArray[2].arr;
            break;
        }
        data[valuearr][1] = 0;
        break;
    }
    console.log(data[valuearr]);

    this.setData(data);
    console.log(this.data, 'data');
  },
  showModelFn() {
    this.setData({
      showModel: !this.data.showModel,
      labelName: ''
    })
  },
  addTagFn() {
    let {
      am_end_time,
      am_start_time,
      pm_end_time,
      pm_start_time,
      labelName,
      weekArr,
      pcDateArr
    } = this.data
    let thisWeekArr = []
    for (let i = 0; i < weekArr.length; i += 1) {
      if (weekArr[i].is) {
        thisWeekArr.push(weekArr[i].value)
      }
    }


    let param = {
      am_end_time: am_end_time,
      am_start_time: am_start_time,

      pm_end_time: pm_end_time,
      pm_start_time: pm_start_time,
      template_name: labelName,
      week_date: thisWeekArr.join(',')
    }
    for (let item in param) {
      if (param[item] == '' || !param[item]) {
        wx.showToast({
          title: '请填写完整！',
          duration: 2000
        });
        return
      }
    }
    param.exclude_date = pcDateArr.length > 0 ? pcDateArr.join(',') : '',
      api.addTaskTimeModel({
        data: param,
        s: (res) => {
          if (res.code === 0) {
            this.showModelFn()
            this.getTimeDataList()
          }
        }
      })
  },
  selectStartTFn() {
    this.setData({
      startT: !this.data.startT
    })
    console.log(this.data.startT, 'startT')
  },
  bindInputChange: function (e) {
    let { name } = e.currentTarget.dataset
    let dataObj = {}
    dataObj[name] = e.detail.value
    this.setData(dataObj)
  },
  bindInputArrChange(e) {
    let { name, index } = e.currentTarget.dataset
    let arr = this.data[name]
    let dataObj = {}
    arr[index] = e.detail.value
    dataObj[name] = arr
    this.setData(dataObj)
  },
  getTimeDataList(e) {

    let param = {
      page: 1,
      pageSize: 10000,
    }
    api.getTaskTimeModelList({
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
  getCustomerListFn(type) {

    let param = {
      type: type - 0,
      page: 1,
      pageSize: 10000,
    }
    api.getCustomerList({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let { datas } = res.response
          if (type === 2) {
            this.setData({
              customerListKH: datas
            }
            )
          } else if (type === 1) {
            this.setData({
              customerListXS: datas
            })
          }
        }
      }
    })
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
          let { datas } = res.response
          datas.map(item => {
            item.is = false
            return item
          })
          datas.unshift({ label: "全部", id: '全部', is: true })
          datas.push({ label: "不选择", id: '全部', is: false })
          this.setData({
            tagLabelArr: datas
          })
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



    let { customerListKH, date, customerListXS, time,
      startT, name, titleArrA, titleArrB, titleArrC, tagArr, tzIdKD, tzNameKD } = this.data

    let timeTemplateId = ''
    tagArr.map(item => {
      if (item.on == "nan is") {
        timeTemplateId = item.id
      }
    })

    let param = {
      "taskName": name,
      "whisperingId": tzIdKD,
      "cardSlotList": [],
      "whisperingTitle": tzNameKD,
      "timeTemplateId": timeTemplateId,
      "startType": startT ? 2 : 1,
      "dialect": "mandarin",
      "validKeyNumA": titleArrA[1],
      "callNumA": titleArrA[2],
      "callTimeA": titleArrA[3],
      "validKeyNumB": titleArrB[1],
      "callNumB": titleArrB[2],
      "callTimeB": titleArrB[3],
      "validKeyNumC": titleArrC[1],
      "callNumC": titleArrC[2],
      "callTimeC": titleArrC[3],
    }
    for (let item in param) {
      if (!param[item]) {
        wx.showToast({
          title: '请填写完整！',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }


    if (startT) {
      if (!date) {
        wx.showToast({
          title: '请选择定时启动日期！',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!time) {
        wx.showToast({
          title: '请选择定时启动时间！',
          icon: 'none',
          duration: 2000
        })
        return
      }
      param.startTime = `${date} ${time}:00:`

    }
    if (customerListKH.length > 0) {
      customerListKH.map(item => {
        param.cardSlotList.push({
          mobile: item.customerPhone,
          user_name: item.customerName
        })
      })
    }
    if (customerListXS.length > 0) {
      customerListXS.map(item => {
        param.cardSlotList.push({
          mobile: item.customerPhone,
          user_name: item.customerName
        })
      })
    }
    console.log(param)




    let apiText = 'addTask'
    if (this.data.id) {
      param.id = this.data.id
      apiText = 'updateTask'
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
            url: '/pages/task/new-task/task'
          })
        }
      }
    })
  },

  selectTagFn(e) {
    let { index } = e.currentTarget.dataset
    let { tagArr } = this.data
    tagArr.map(item => {
      item.on = ''
      return item
    })
    if (tagArr[index].on === 'nan is') {
      tagArr[index].on = ''
    } else {
      tagArr[index].on = 'nan is'
    }
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