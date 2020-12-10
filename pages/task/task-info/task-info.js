//statistics.js
const util = require('../../../utils/util.js')
const api = require('../../../utils/api/index.js')
import * as echarts from '../../../ec-canvas/echarts';

let chart = null;




Page({
  data: {
    logs: [],

    switch2Checked: false,

    ecCircular: {
      lazyLoad: true // 延迟加载
    },
    taskData: {},

  },
  onLoad: function (op) {
    this.setData({
      logs: [1, 2, 3],
      id: op.id
    })
    this.barComponent = this.selectComponent('#mychart-dom-multi-bar');

  },
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000);
  },
  onShow() {
    this.getList()
  },
  init_bar: function (arr) {
    this.barComponent.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getBarOption(arr));
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  initCircularChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
      title: {
        text: '',
      },
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#71F2DE", "#99F2DE", "#FFDB5C"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: [{
          value: 55,
          name: 'A级(20%)'
        }, {
          value: 20,
          name: 'B级(20%)'
        }, {
          value: 10,
          name: 'C级(20%)'
        }, {
          value: 20,
          name: 'D级(20%)'
        }, {
          value: 38,
          name: 'F级(20%)'
        }]
      }]
    };

    chart.setOption(option);
    return chart;
  },

  getBarOption(dataArr) {
    //return 请求数据
    return {
      title: {
        text: '',
      },
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#71F2DE", "#99F2DE", "#FFDB5C"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: dataArr
      }]
    };
  },
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  goChangeStatusFn(e) {
    let { status, id } = e.currentTarget.dataset


    let _this = this
    let param = {
      taskId: id,
      status: status ? 2 : 1
    }
    let apiText = 'updateTaskStatus'
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            switch2Checked: e.detail.value
          })
          _this.getList()

        }
      }
    })
  },
  toPoint(percent) {
    var str = percent.replace("%", "");
    str = str / 100;
    return str;
  },
  toJTPoint(percent) {
    var str = percent.replace("通", "");
    return str;
  },
  getList(page) {

    let { id } = this.data


    const param = {
      taskId: id,
    }
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true,
    // })
    api.getTaskInfo({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let data = res.response
          let { switch2Checked } = this.data
          if (data.status === 1) {
            switch2Checked = true
          } else {
            switch2Checked = false
          }
          let jtCount = this.toJTPoint(data.receivingStatus[0].value)
          this.setData({
            taskData: data,
            switch2Checked: switch2Checked,
            jtCount: jtCount
          })
          let { userLevel } = data
          userLevel.map(item => {
            item.value = data.userCount * (this.toPoint(item.value))
            item.name = `${item.name}(${item.value})`
          })
          this.init_bar(userLevel);
        }
        // wx.hideLoading()
      }
    })

  },
  goListFn(e) {
    let { url, type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `${url}?id=${this.data.id}&type=${type}`,
    })
  },
  navbarClick(e) {
    const detail = e.detail
    const item = detail.item

    this.setData({
      formSearch: {
        type: item.val || 1
      }
    })
    // this.getList(item.val)
    if (this.data.pageItem[this.data.formSearch.type]) {
      const pageItem = this.data.pageItem[this.data.formSearch.type];
      if (pageItem.pageCount <= 1 || pageItem.page == pageItem.pageCount) {
        this.setData({
          taskData: this.data.taskDataALL[this.data.formSearch.type]
        })
        return
      }
      this.getList(this.data.pageItem[this.data.formSearch.type].page)
    } else {
      this.getList(1)
    }
  },
})
