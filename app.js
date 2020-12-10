//app.js
const Api = require('/utils/api/index.js')
App({
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
  },


  data: {
    // 用户登录缓存key
    cache_user_info: "cache_user_login_key",
    cache_user_token: 'token',

    // 用户信息缓存key
    cache_user_info_tokn: "cache_user_info_tokn",
  },
  onLaunch: function (e) {


    if (e.scene == 1007 || e.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    }
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    wx.getSystemInfo({
      success: res => {
        this.globalData.height = res.statusBarHeight
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    share: false, // 分享默认为false
    height: 0 // 顶部高度
  },
  getUserData() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.userInfo = wx.getStorageSync('g_DGUserInfo')
    }
    // else {
    //   wx.reLaunch({
    //     url: '/pages/other/load',
    //   })
    // }
  },

  /**
   * //数据验证
   * @param {obj}} url 
   */
  validationParametersfn(param, tis) {

    for (let item in param) {
      if ((param[item] === '' || !param[item]) && param[item] !== 0) {
        wx.showToast({
          icon: 'none',
          title: tis || '请填写完整！',
          duration: 3000
        });
        return false
      }
    }
    return true

  },


  /**
   * 当前地址是否存在tabbar中
   */
  is_tabbar_pages(url) {
    if (url.indexOf("?") == -1) {
      var value = url;
    } else {
      var temp_str = url.split("?");
      var value = temp_str[0];
    }
    if ((value || null) == null) {
      return false;
    }

    var temp_tabbar_pages = this.data.tabbar_pages;
    for (var i in temp_tabbar_pages) {
      if (temp_tabbar_pages[i] == value) {
        return true;
      }
    }
    return false;
  },


  /**
   * 事件操作
   */
  operation_event(e) {
    var value = e.currentTarget.dataset.value || null;
    var type = parseInt(e.currentTarget.dataset.type);
    if (value != null) {
      switch (type) {
        // web
        case 0:
          wx.navigateTo({
            url: '/pages/web-view/web-view?url=' + encodeURIComponent(value)
          });
          break;

        // 内部页面
        case 1:
          if (this.is_tabbar_pages(value)) {
            wx.switchTab({
              url: value
            });
          } else {
            console.log('erere')
            wx.navigateTo({
              url: value
            });
          }
          break;

        // 跳转到外部小程序
        case 2:
          wx.navigateToMiniProgram({
            appId: value
          });
          break;

        // 跳转到地图查看位置
        case 3:
          var values = value.split('|');
          if (values.length != 4) {
            this.showToast('事件值格式有误');
            return false;
          }

          wx.openLocation({
            name: values[0],
            address: values[1],
            longitude: values[2],
            latitude: values[3],
          });
          break;

        // 拨打电话
        case 4:
          wx.makePhoneCall({
            phoneNumber: value
          });
          break;
        // 直接跳转页面
        case 5:
          wx.switchTab({
            url: value
          });
          break;
      }
    }
  },
})