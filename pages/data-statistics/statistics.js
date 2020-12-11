//statistics.js
const util = require('../../utils/util.js')
const api = require('../../utils/api/index.js')
const echarts = require('../../ec-canvas/echarts.js')
// import echarts from '../../ec-canvas/echarts';
const app = getApp();
let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    title: {
      // text: '任务数据',
    },
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['拨打量', '接听量', '转接量'],
      orient: 'horizontal',
      top: '0',
      right: '10',
      textStyle: { fontSize: 12 }
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 0,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '拨打量',
        type: 'bar',
        barWidth: '10',
        label: {
          normal: {
            show: false,
            position: 'inside'
          }
        },
        data: [20, 32, 21, 34, 90, 130, 110],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '接听量',
        type: 'bar',
        barWidth: '10',
        label: {
          normal: {
            show: false
          }
        },
        data: [20, 32, 21, 34, 90, 130, 110],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '转接量',
        type: 'bar',
        barWidth: '10',
        label: {
          normal: {
            show: false,
            position: 'left'
          }
        },
        data: [20, 32, 21, 34, 90, 130, 110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


function initCircularChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    title: {
      // text: '客户占比',
    },
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 12
        }
      },
      type: 'pie',
      center: ['50%', '60%'],
      radius: ['40%', '55%'],
      data: [{
        value: 55,
        name: 'A级(35%)'
      }, {
        value: 20,
        name: 'B级(15%)'
      }, {
        value: 10,
        name: 'C级(7%)'
      }, {
        value: `20(15%)`,
        name: 'D级'
      }, {
        value: `38(28%)`,
        name: 'F级'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '数据统计', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../style/iconfont/head-back.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 1.5 + 20,
    height_list: app.globalData.height * 2 + 20 + 120,
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的宽度
    logs: [],
    ec: {
      // onInit: initChart,
    },
    ecCircular: {
      // onInit: initCircularChart
      lazyLoad: true
    },
    array: [{ name: '全部任务', value: 0 }, { name: '宝安常青藤公寓任务', value: 1 }, { name: '南山阳光海景豪庭任务', value: 2 }, { name: '南山海滨之窗花园任务', value: 2 }, { name: '福田郁金花园二期任务', value: 3 }],
    navbarIndex: 0,
    index: 0,
    navlist: [{
      text: '周',
      val: 1,
    },
    {
      text: '月',
      val: 2,
    },
    {
      text: '年',
      val: 3,
    }
    ]
  },
  onLoad: function () {
    this.setData({
      logs: [1, 2, 3]
    })
    this.barComponent = this.selectComponent('#mychart-dom-circular');
  },
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000);
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar) {
      this.getTabBar().setData({
        selected: 0
      })


    }
    this.setData({
      ec: {
        onInit: initChart,
      },
    })
    this.getList()
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

  getBarOption(dataArr) {
    console.log(dataArr, 'dataArr')
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
  init_bar: function (arr) {
    this.barComponent.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      console.log(this.getBarOption(arr), '1')
      barChart.setOption(this.getBarOption(arr));
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  toPoint(percent) {
    var str = percent.replace("%", "");
    str = str / 100;
    return str;
  },
  getList(page) {
    let data = [{
      value: 55,
      name: 'A级(35%)'
    }, {
      value: 20,
      name: 'B级(15%)'
    }, {
      value: 10,
      name: 'C级(7%)'
    }, {
      value: `20`,
      name: 'D级(15%)'
    }, {
      value: `38`,
      name: 'F级(28%)'
    }]
    // let { userLevel } = data
    // userLevel.map(item => {
    //   item.value = data.userCount * (this.toPoint(item.value))
    //   item.name = `${item.name}(${item.value})`
    // })
    this.init_bar(data);
    return
    let signUserName = wx.getStorageSync('signUserName')
    const navMap = {
      1: 0,
      2: 1
    }
    const navIndex = navMap[this.data.formSearch.type] || 0
    this.setData({
      navbarIndex: navIndex
    })
    const param = {
      page: 1,
      // count: 10,
      count: 10 * page,
      id: signUserName.id,
      status: navIndex
    }
    if (navIndex == 0) {
      api.getReportDataList({
        data: param,
        s: (res) => {
          if (res.code === 0) {

            let data = res.response.datas
            this.setData({
              taskData: data
            })
            this.data.pageItem[this.data.formSearch.type] = {
              count: 10,
              countNumber: res.response.countNumber,
              page: page,
              pageCount: res.response.pageCount,
            }
            this.data.taskDataALL[this.data.formSearch.type] = this.data.taskData
          }
        }
      })
    } else if (navIndex == 1) {
      api.getReportDataList({
        data: param,
        s: (res) => {
          if (res.code == 0) {
            let data = res.response.datas
            this.setData({
              taskData: data
            })
            this.data.pageItem[this.data.formSearch.type] = {
              count: 10,
              countNumber: res.response.countNumber,
              page: page,
              pageCount: res.response.pageCount,
            }
            this.data.taskDataALL[this.data.formSearch.type] = this.data.taskData
          }
        }
      })
    }

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
