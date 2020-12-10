// 这是封装一下微信网络请求
const Conf = require("./config.js")
const Http = (path, methodKey, domain) => {
  //特殊类型的method
  const methodMap = {
    path: 'get',
    pathPost: 'post',
  }
  //真实的method：get和post
  const methodG = methodMap[methodKey] || methodKey;
  return (op) => {
    const token = wx.getStorageSync('token')
    let opType = Object.prototype.toString.call(op)
    opType = opType.toLowerCase()
    if (opType !== '[object object]') {
      return
    }
    wx.showNavigationBarLoading()

    let dataG = op.data || null
    const paramsG = op.params || null
    dataG = dataG || paramsG
    // 提示加载话语
    const msgG = op.msging || null
    const pathG = op.path || ''
    const headerG = op.header || {}
    const isMessage = op.isMsg === false ? false : true
    const isFailMsg = op.isFailMsg === false ? false : true
    //两个回掉函数    
    const successG = op.s
    const failG = op.f
    const headers = headerG
    if (token) {
      headers['AI-ACCESS-TOKEN'] = token
    }
    let urlG = (domain || Conf.domain) + path;
    if (methodKey.indexOf('path') >= 0) {
      urlG += pathG
    }
    if (msgG) {
      wx.showLoading({
        title: msgG,
      })
    }
    wx.request({
      url: urlG,
      data: dataG,
      header: headers,
      method: methodG,
      success(response) {
        let res = response.data || {}
        wx.hideNavigationBarLoading()
        if (msgG) {
          wx.hideLoading()
        }
        if (response.statusCode == 200) {
          if (successG) {
            successG(res)
          }
          if (res.code * 1 !== 0) {
            if (res.code == 7) {
              wx.removeStorageSync('token')
              wx.showToast({
                title: '登录过期，请重新登录',
                icon: 'none',
                duration: 2000
              })
              wx.clearStorageSync()
              wx.reLaunch({
                url: '/pages/login/login',
              })
              return
            }
            if (isMessage) {
              wx.showToast({
                title: res.msg || '未知错误',
                icon: 'none',
                duration: 2000
              })
            }
          }
        } else {
          if (failG) {
            failG()
          }
          if ([400, 401, 402, 403, 404, 405, 406].indexOf(response.statusCode) > -1) {
            wx.showToast({
              title: `访问受限 Code-${response.statusCode}`,
              icon: 'none',
              duration: 2000
            })
          }
          if ([500, 501, 502, 503, 504, 505, 506].indexOf(response.statusCode) > -1) {
            wx.showToast({
              title: `抱歉，服务器开小差了${'!'}`,
              icon: 'none',
              duration: 2000
            })
          }
        }
      },
      fail(response) {
        wx.hideNavigationBarLoading()
        if (msgG) {
          wx.hideLoading()
        }
        if (isFailMsg) {
          wx.showToast({
            title: '请求数据失败,请检查网络是否正常!',
            icon: 'none',
            duration: 2000
          })
        }
        if (failG) {
          failG(response)
        }

      },
    })

  }
}

function httpGet(path, domain) {
  return Http(path, 'get', domain);
}

function httpPost(path, domain) {
  return Http(path, 'post', domain);
}

function httpPathPost(path, domain) {
  return Http(path, 'pathPost', domain);
}

function httpPath(path, domain) {
  return Http(path, 'path', domain);
}


module.exports = {
  httpGet: httpGet,
  httpPost: httpPost,
  httpPathPost: httpPathPost,
  httpPath: httpPath,
}