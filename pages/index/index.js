const util = require('../../utils/util.js')
const api = require('../../utils/api/index.js')

const app = getApp();
Page({
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '客户管理', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../style/iconfont/head-back.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 1.5 + 20,
    height_list: app.globalData.height * 2 + 20 + 120,
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的宽度
    imageHeight: "220",
    avatar: app.data.default_user_head_src,
    nickname: "用户名",
    customer_service_tel: null,
    user_id: '',
    userAssets: '',
    residueTime: 0,
    common_user_center_notice: null,
    message_total: 0,
    is_wxUserInfo: false,
    showView: false,
    wxUserInfo: {},
    is_login: false,
    isCaptain: false,
    order_count_arr: {},
    user_info: {},
    token: '',

    // 远程自定义导航
    navigation: [],

  },
  onLoad() {
  },

  onShow() {

    if (typeof this.getTabBar === 'function' && this.getTabBar) {
      this.getTabBar().setData({
        selected: 4
      })
    }

    this.init();
  },
  exitFn() {
    this.setData({
      showView: false,
    })
  },

  init(e) {
    let wxUserInfo = wx.getStorageSync('wxUserInfo');
    let _this = this
    console.log(wxUserInfo)
    if (wxUserInfo) {
      this.setData({
        wxUserInfo: wxUserInfo,
        is_wxUserInfo: true
      })
    } else {
      wx.getSetting({
        success: function (res) {
          //接口调用成功的回调函数
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                let userInfo = res.userInfo
                _this.setData({
                  wxUserInfo: userInfo,
                  is_wxUserInfo: true
                })
              }
            })
          } else {
            //用户没有授权
            console.log("用户没有授权");
          }
        },
      })

    }

    this.get_data()
  },
  //计算图片宽
  imgLoaded(e) {
    this.setData({
      imageHeight: e.detail.height *
        (wx.getSystemInfoSync().windowWidth / e.detail.width)
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      let userInfo = e.detail.userInfo

      // if (app.is_not_user_info()) {
      if (true) {
        let user_info = wx.getStorageSync(app.data.cache_user_info)
        let token = wx.getStorageSync('token')
        this.setData({
          is_wxUserInfo: true,
          wxUserInfo: userInfo,
        })
        wx.setStorageSync('wxUserInfo', userInfo);
        return

        var self = this;
        // 加载loding
        let params = {
          userName: user_info.phone,
          nickname: userInfo.nickName,
          headPortrait: userInfo.avatarUrl,
        }
        let request_url = `weChat/addUserInfo`
        this.setData({
          data_list_loding_status: 1,
        });
        wx.request({
          url: app.get_request_url(request_url, 1, null, params),
          method: "GET",
          data: {},
          dataType: "json",
          header: {
            'MM-ACCESS-TOKEN': token
          },
          success: res => {
            wx.stopPullDownRefresh();
            self.setData({
              load_status: 1
            });
            if (res.data.code == 0) {
              wx.setStorageSync('wxUserInfo', userInfo);
              this.setData({
                is_wxUserInfo: true,
                wxUserInfo: userInfo,
              })
            } else {
              app.is_not_login(res.data.code);
              app.showToast(res.data.msg);
            }
          },
          fail: () => {
            wx.stopPullDownRefresh();
            self.setData({
              data_list_loding_status: 2,

              load_status: 1,
            });
            app.showToast("服务器开小差~~");
          }
        });
      } else {

      }
    }
  },
  loginFn() {
    // app.is_not_user_info()
  },
  // 获取数据
  get_data() {
    if (true) {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      let self = this;
      let apiText = "getBDUserInfo"
      // 加载loding
      let param = {

      }
      api[apiText]({
        data: param,
        s: (res) => {
          wx.hideLoading()
          if (res.code === 0) {
            let { residueTime, userName, id } = res.response


            this.setData({
              residueTime: residueTime,
              userName: userName,
              id: id,

            })

          }
        }
      })
    }
  },
  // 获取数据
  get_userAssets_data() {
    return
    if (app.is_not_user_info()) {
      wx.showLoading({
        title: "加载中..."
      });
      var self = this;
      // 加载loding
      let params = {

      }
      let request_url = `userAssets/info`

      this.setData({
        data_list_loding_status: 1,
      });

      wx.request({
        url: app.get_request_url(request_url, 1),
        method: "GET",
        data: params,
        dataType: "json",
        header: {
          'MM-ACCESS-TOKEN': this.data.token
        },
        success: res => {
          wx.stopPullDownRefresh();
          self.setData({
            load_status: 1
          });
          if (res.data.code == 0) {
            let data = res.data.response
            data.balance = data.balance.toFixed(2)
            this.setData({
              userAssets: data
            })
          } else {
            app.is_not_login(res.data.code);
            app.showToast(res.data.msg);
          }
          wx.hideLoading()
        },
        fail: () => {
          wx.stopPullDownRefresh();
          self.setData({
            data_list_loding_status: 2,

            load_status: 1,
          });
          app.showToast("服务器开小差~~");
        }
      });
    } else {

    }
  },

  // 清除缓存
  clear_storage(e) {
    wx.clearStorage();
    app.showToast("清除缓存成功", "success");
  },

  goKfFn() {
    this.setData({
      showView: true
    })
  },

  // 客服电话
  call_event() {
    if (this.data.customer_service_tel == null) {
      app.showToast("客服电话有误");
    } else {
      app.call_tel(this.data.customer_service_tel);
    }
  },
  exitloginFn() {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '是否退出登录',
      success(res) {
        if (res.confirm) {
          _this.setData({
            is_wxUserInfo: false,
            token: ''
          })

          wx.clearStorage();
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (res.cancel) {
        }
      }
    })

  },
  // 下拉刷新
  onPullDownRefresh(e) {
    this.init(e);
  },

  // 头像查看
  preview_event() {
    if (app.data.default_user_head_src != this.data.avatar) {
      wx.previewImage({
        current: this.data.avatar,
        urls: [this.data.avatar]
      });
    }
  },

  // 头像加载错误
  user_avatar_error(e) {
    this.setData({
      avatar: app.data.default_user_head_src
    });
  },

  // 远程自定义导航事件
  navigation_event(e) {
    e.currentTarget.dataset.value = `${e.currentTarget.dataset.url}?id=${this.data.user_id}&name=${e.currentTarget.dataset.name}`
    app.operation_event(e);
  }
});