const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
let timeObj = {}
const util = require('../../../../utils/util.js')
const api = require('../../../../utils/api/index.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    date: '2001-10-1',
    name: '',
    audioTime: `00:00`,
    sliderValue: 0,
    audioMaxTime: 0,
    audioButtonText: '播放',
    userName: '鲸呼用户',
    audioContent: '',
    tempFilePath: '',
    plUploadUrl: '',
    index: 0,
    tzNameKD: '下一节点',
    tzNameFD: '下一节点',
    tzNameWSB: '下一节点',
    kdType: false,//肯定跳转参数
    keyWordKD: '',
    levelKD: 'C',
    tzTypeKD: 4,
    fdType: false,//否定跳转参数
    keyWordFD: '',
    levelFD: 'C',
    tzTypeFD: 4,
    wsbType: false,//未识别跳转参数
    keyWordWSB: '',
    levelWSB: 'C',
    tzTypeWSB: 4,
    fzType: false,//分支跳转参数
    FZTZArr: [{
      keyWordFZ: '',
      levelFZ: 'C',
      tzTypeFZ: 4,
      tzNameFZ: '下一节点',
      multiIndexFZ: [3, 0],
      itemsTz: [{ value: 'A', name: 'A' },
      { value: 'B', name: 'B', checked: 'true' },
      { value: 'C', name: 'C' },]
    }],
    lcData: {},//新增节点的父级流程数据
    timeCountNumM: 0,
    timeCountNumS: 0,
    audioCountNumM: 0,
    audioCountNumS: 0,
    buttonText: '00:00',
    itemsTz: [
      { value: 'A', name: 'A' },
      { value: 'B', name: 'B', checked: 'true' },
      { value: 'C', name: 'C' },
    ],
    itemsTzKD: [
      { value: 'A', name: 'A' },
      { value: 'B', name: 'B', checked: 'true' },
      { value: 'C', name: 'C' },
    ],
    itemsTzFD: [
      { value: 'A', name: 'A' },
      { value: 'B', name: 'B', checked: 'true' },
      { value: 'C', name: 'C' },
    ],
    itemsTzWSB: [
      { value: 'A', name: 'A' },
      { value: 'B', name: 'B', checked: 'true' },
      { value: 'C', name: 'C' },
    ],
    stateText: '',
    showAudioStop: false,
    objmultiArray: {
      '主流程': { type: 1, arr: [] },
      '辅助流程': { type: 2, arr: [] },
      '特殊流程': { type: 3, arr: [] },
      '指定子流程': { type: 4, arr: [] },
      1: { type: '主流程', arr: [] },
      2: { type: '辅助流程', arr: [] },
      3: { type: '特殊流程', arr: [] },
      4: { type: '指定子流程', arr: [] },
    },
    multiArray: [[{ moduleName: '主流程', id: 1 }, { moduleName: '辅助流程', id: 2 },
    { moduleName: '特殊流程', id: 3 }, { moduleName: '指定子流程', id: 4 }], []],
    multiArrayKD: [[{ moduleName: '主流程', id: 1 }, { moduleName: '辅助流程', id: 2 },
    { moduleName: '特殊流程', id: 3 }, { moduleName: '指定子流程', id: 4 }], []],
    multiIndex: [3, 0],
    multiIndexFD: [3, 0],
    multiIndexWSB: [3, 0],
    array: [{ name: '主流程', id: 1 }, { name: '辅助流程', id: 2 }, { name: '特殊流程', id: 3 },],
    items: [
      { value: '1', name: '结束通话' },
      { value: '2', name: '不允许打断', checked: 'true' },
    ],
    itemswx: [
      { value: '1', name: '已添加' },
      { value: '2', name: '未添加', checked: 'true' },
    ],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.nodeId !== '0' && options.nodeId) {
      wx.setNavigationBarTitle({
        title: '节点编辑',
      })
    }
    this.setData({
      id: options.hsId || 1,
      moduleId: options.id,
      indexType: options.indexType,
      type: options.type,
      nodeId: options.nodeId || 'add',
      hstype: options.hstype.toString(),
      lcData: {
        indextype: options.indexType,
        id: options.id,
        index: options.index,
      }
    })
    wx.setStorageSync('lc_Data', this.data.lcData);
    this.audioCtx = wx.createAudioContext('myAudio')

  },
  bindMultiPickerChange: function (e) {//多选择器
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // multiArray[1][e.detail.value[1]].moduleName
    let { name, valuearr, tzid, tzname, index } = e.currentTarget.dataset
    let { FZTZArr } = this.data
    let obj = {}


    if (!index && index !== 0) {
      obj[valuearr] = e.detail.value
      obj[tzid] = this.data.multiArray[1][e.detail.value[1]].id
      obj[tzname] = this.data.multiArray[1][e.detail.value[1]].moduleName
    } else {
      if (FZTZArr[index]) {
        FZTZArr[index][valuearr] = e.detail.value
        FZTZArr[index][tzid] = this.data.multiArray[1][e.detail.value[1]].id
        FZTZArr[index][tzname] = this.data.multiArray[1][e.detail.value[1]].moduleName
      } else {
        FZTZArr[index] = {}
        FZTZArr[index][valuearr] = e.detail.value
        FZTZArr[index][tzid] = this.data.multiArray[1][e.detail.value[1]].id
        FZTZArr[index][tzname] = this.data.multiArray[1][e.detail.value[1]].moduleName
      }
      obj.FZTZArr = FZTZArr
    }
    console.log('obj', obj)
    this.setData(obj)
  },
  bindMultiPickerColumnChange: function (e) {//多选择器
    // console.log('修改的列为', e, '，值为', e);
    let { name, valuearr, index } = e.currentTarget.dataset
    let { FZTZArr } = this.data
    var data = {
      multiArray: this.data.multiArray,
    };
    if (!index && index != 0) {
      data[valuearr] = this.data[valuearr]
    } else {
      data[valuearr] = FZTZArr[index][valuearr]
    }
    console.log(data[valuearr], 'data[valuearr]')
    let { objmultiArray } = this.data
    let tzType = 1;
    data[valuearr][e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data[valuearr][0]) {
          case 0:
            data.multiArray[1] = objmultiArray[1].arr;
            tzType = 1
            break;
          case 1:
            data.multiArray[1] = objmultiArray[2].arr;
            tzType = 2
            break;
          case 2:
            data.multiArray[1] = objmultiArray[3].arr;
            tzType = 3
            break;
          case 3:
            data.multiArray[1] = objmultiArray[4].arr;
            tzType = 4
            break;
        }
        data[valuearr][1] = 0;
        break;
    }
    console.log(data[valuearr]);
    if (!index && index != 0) {
      data[name] = tzType
    } else {
      FZTZArr[index][name] = tzType
    }


    this.setData(data);
    console.log(this.data, 'data');
  },
  bindPickerChange(e) {//单选择器
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  switchChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let { name } = e.currentTarget.dataset
    let obj = {}
    obj[name] = e.detail.value
    this.setData(obj)
  },

  selectAudonFn() {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '可以选择微信文件或进行录音',
      cancelText: "录音话术",
      confirmText: "选择音频",
      success(res) {
        if (res.confirm) {
          _this.selectWeChatFn()
        } else if (res.cancel) {

          _this.startAudioFn()
        }
      }
    })
  },

  startAudioFn() {
    console.log('执行了？？')
    this.setData({
      showAudioStop: true
    })



    const options = {
      duration: 70000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    let _this = this
    _this.setData({
      audioMaxTime: 0
    })
    _this.data.timeCountNumS = 0
    _this.data.timeCountNumM = 0
    this.setData({
      stateText: '录音中'
    })
    timeObj = setInterval(() => {
      _this.data.timeCountNumS = this.data.timeCountNumS + 1

      if (_this.data.timeCountNumS >= 60) {
        _this.data.timeCountNumS = 0
        _this.data.timeCountNumM = _this.data.timeCountNumM + 1
      }

      if (_this.data.timeCountNumS < 10) {
        _this.setData({
          buttonText: `0${_this.data.timeCountNumM} : 0${_this.data.timeCountNumS}`
        })
      } else {
        _this.setData({
          buttonText: `0${_this.data.timeCountNumM} : ${_this.data.timeCountNumS}`
        })
      }

      _this.setData({
        audioMaxTime: this.data.audioMaxTime + 1
      })
      if (_this.data.audioMaxTime + 1 > 60) {
        _this.stopAudioFn()
      }

    }, 1000);
    recorderManager.onStart(() => {
      console.log('recorder start')

    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  buttonAudioPlay() {
    let { audioButtonText } = this.data
    if (audioButtonText === '播放') {
      innerAudioContext.play()
      this.setData({
        audioButtonText: '停止',
      })
    } else {
      innerAudioContext.stop()
      this.setData({
        audioButtonText: '播放',
      })
    }
  },
  audioPlay: function () {
    let _this = this

    _this.data.audioCountNumS = 0
    _this.data.audioCountNumM = 0
    console.log('执行了一次')

    timeObj = setInterval(() => {
      _this.data.audioCountNumS = this.data.audioCountNumS + 1

      if (_this.data.audioCountNumS >= 60) {
        _this.data.audioCountNumS = 0
        _this.data.audioCountNumM = _this.data.audioCountNumM + 1
      }

      if (_this.data.audioCountNumS < 10) {
        _this.setData({
          audioTime: `0${_this.data.audioCountNumM} : 0${_this.data.audioCountNumS}`
        })
      } else {
        _this.setData({
          audioTime: `0${_this.data.audioCountNumM} : ${_this.data.audioCountNumS}`
        })
      }
      _this.setData({
        sliderValue: _this.data.sliderValue + 1
      })
      console.log(this.data.sliderValue, this.data.audioMaxTime, "sliderValue")
    }, 1000);
  },
  audioPause: function () {
    innerAudioContext.pause()
  },
  audioEnd: function () {
    let _this = this
    clearInterval(timeObj);
    _this.setData({
      timeObj: {}
    })
    _this.setData({
      audioTime: `00:00`,
      sliderValue: 0
    })
    this.setData({
      audioButtonText: '播放',
    })
    console.log("停止1")
  },
  audio14: function () {
    innerAudioContext.seek(14)
  },
  audioStart: function () {
    innerAudioContext.seek(0)
  },
  stopAudioFn() {
    let _this = this
    if (_this.data.hstype !== '1') {
      return
    }
    if (this.data.stateText === '已选择话术录音' || this.data.stateText === '保存失败,请重新录音') {
      wx.showModal({
        title: '提示',
        content: '是否删除当前录音，重新录音？',
        success(res) {
          if (res.confirm) {
            clearInterval(timeObj);
            innerAudioContext.src = ''
            innerAudioContext.stop();
            _this.setData({
              showAudioStop: false,
              timeCountNumS: 0,
              timeCountNumM: 0,
              buttonText: '00:00',
              stateText: '',
              tempFilePath: '',
            })

          } else if (res.cancel) {

          }
        }
      })
    }
    recorderManager.stop();

    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      clearInterval(timeObj);

      wx.showModal({
        title: '已完成录音',
        content: '是否确认选择此录音',
        cancelText: '放弃',
        success(res) {
          if (res.confirm) {

            let { id } = _this.data
            const token = wx.getStorageSync('token')
            let param = {
              "whisperingId": id,
              "userName": 'ts001'
            }
            wx.showLoading({
              title: '保存中',
              mask: true,
            })
            wx.uploadFile({
              url: 'http://39.104.72.89:9987/whisperingNode/uploadAudio', //接口地址
              filePath: tempFilePath,
              name: 'file',
              header: { 'AI-ACCESS-TOKEN': token },
              formData: param,
              success(res) {
                let data = JSON.parse(res.data)
                wx.hideLoading()
                if (data.code === 0) {
                  innerAudioContext.src = data.response.plUploadUrl
                  console.log(innerAudioContext.src, '音频src')
                  innerAudioContext.onCanplay(() => {

                  })

                  _this.setData({
                    stateText: '已选择话术录音',
                    timeCountNumS: 0,
                    timeCountNumM: 0,
                    ossFileName: data.response.ossFileName,
                    plUploadUrl: data.response.plUploadUrl,
                    tempFilePath: tempFilePath
                  })
                } else {
                  _this.setData({
                    stateText: '保存失败,请重新录音',
                    timeCountNumS: 0,
                    timeCountNumM: 0,
                    buttonText: '00:00',
                  })
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

                }
              }
            })

          } else if (res.cancel) {
            _this.setData({
              showAudioStop: false,
              timeCountNumS: 0,
              timeCountNumM: 0,
              buttonText: '00:00',
              tempFilePath: "",
            })
          }
        }
      })

    })


  },
  selectWeChatFn() {

    let _this = this
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success(res) {
        console.log(res, 'res')
        wx.showLoading({
          title: '保存中',
          mask: true,
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFiles[0].path
        let time = res.tempFiles[0].time
        _this.setData({
          time: time,
          tempFilePathSelect: tempFilePath
        })
        let { id } = _this.data
        const token = wx.getStorageSync('token')
        let param = {
          "whisperingId": id,
        }

        wx.uploadFile({
          url: 'http://39.104.72.89:9987/whisperingNode/uploadAudio', //接口地址
          filePath: tempFilePath,
          name: 'file',
          header: { 'AI-ACCESS-TOKEN': token },
          formData: param,
          success(res) {
            let data = JSON.parse(res.data)
            wx.hideLoading()
            console.log(res, '完成上传')
            if (data.code === 0) {
              innerAudioContext.src = data.response.plUploadUrl
              let thisInnerAudioContext = wx.createInnerAudioContext()
              wx.showLoading({
                title: '加载中',
                mask: true,
              })
              thisInnerAudioContext.src = data.response.plUploadUrl

              thisInnerAudioContext.onCanplay(() => {
                // 必须。可以当做是初始化时长
                innerAudioContext.duration;
                // 必须。不然也获取不到时长
                thisInnerAudioContext.play()
                setTimeout(() => {
                  console.log('文件选择的时常can', thisInnerAudioContext.duration); // 401.475918
                }, 1000)
              })
              thisInnerAudioContext.onPlay(() => {
                // 必须。可以当做是初始化时长
                innerAudioContext.duration;
                // 必须。不然也获取不到时长
                setTimeout(() => {
                  console.log('文件选择的时常play', thisInnerAudioContext.duration); // 401.475918
                  let duration = thisInnerAudioContext.duration.toFixed(0)
                  let buttonText = duration
                  if (duration < 10) {
                    buttonText = `0${duration}`
                  }
                  _this.setData({
                    audioMaxTime: duration,
                    buttonText: duration == 0 ? '' : `00:${buttonText}`
                  })
                  wx.hideLoading()
                  thisInnerAudioContext.destroy()
                }, 2000)
              })
              _this.setData({
                showAudioStop: true,
                stateText: '已选择话术录音',
                timeCountNumS: 0,
                timeCountNumM: 0,
                ossFileName: data.response.ossFileName,
                plUploadUrl: data.response.plUploadUrl,
                tempFilePath: tempFilePath
              })
            } else {
              _this.setData({
                stateText: '保存失败,请重新录音',
                timeCountNumS: 0,
                timeCountNumM: 0,
                buttonText: '00:00',
              })
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

            }
          }
        })

      }
    })
  },
  sliderChange(e) {
    console.log(e.detail, 'detail ')

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this
    innerAudioContext.onStop(_this.audioEnd)
    innerAudioContext.onEnded(_this.audioEnd)
    innerAudioContext.onPlay(_this.audioPlay)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user_info = wx.getStorageSync(app.data.cache_user_info)
    this.setData({
      userName: user_info.MKOUserInfo.userName,
    })
    let _this = this
    let promise = new Promise(function (resolve, reject) {
      _this.getLCDataList()
      _this.getJDDataList()
      resolve();
    });
    promise.then(function () {
      _this.getNodeInfoDataList()
    });


    console.log(this.data, 'this.data')
  },
  sliderChange(e) {
    console.log(e)
  },
  getNodeInfoDataList(e) {//获取节点详情
    if (this.data.nodeId == 'add' || !this.data.nodeId) {
      return
    }
    let param = {
      whisperingNodeId: this.data.nodeId,
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    api.getwhisperingNodeInfo({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          console.log(res, 'res')
          let {
            nodeName,
            audioContent,
            ossAudioPath,
            plAudioUrl,
            nextNodeList,
          } = res.response

          let _this = this
          let { tzNameKD, kdType, keyWordKD, levelKD, tzTypeKD, itemsTzKD, itemsTzFD, itemsTzWSB } = this.data

          let FZTZArr = []

          nextNodeList.map(item => {
            if (item.nextType === 1) {//肯定跳转数据
              itemsTzKD.map(itemSub => {
                if (itemSub.value === item.level) {
                  itemSub.checked = true
                } else {
                  itemSub.checked = false
                }
              })
              this.setData({
                kdType: true,
                keyWordKD: item.keyWord,
                itemsTzKD: itemsTzKD,
                tzNameKD: item.nextNodeName,
                levelKD: item.level
              })
            }
            if (item.nextType === 2) {//否定跳转数据
              itemsTzFD.map(itemSub2 => {
                if (itemSub2.value === item.level) {
                  console.log('找到2')
                  itemSub2.checked = true
                } else {
                  itemSub2.checked = false
                }
              })
              this.setData({
                fdType: true,
                keyWordFD: item.keyWord,
                itemsTzFD: itemsTzFD,
                tzNameFD: item.nextNodeName,
                levelFD: item.level
              })
            }
            if (item.nextType === 3) {//未识别跳转数据
              itemsTzWSB.map(itemSub3 => {
                if (itemSub3.value === item.level) {

                  itemSub3.checked = true
                } else {
                  itemSub3.checked = false
                }
              })
              this.setData({
                wsbType: true,
                keyWordWSB: item.keyWord,
                itemsTzWSB: itemsTzWSB,
                tzNameWSB: item.nextNodeName,
              })
            }
            if (item.nextType === 4) {//分支跳转

              let itemsTz = [{ value: 'A', name: 'A' },
              { value: 'B', name: 'B', checked: 'true' },
              { value: 'C', name: 'C' },]

              itemsTz.map(itemSub4 => {
                if (itemSub4.value === item.level) {
                  itemSub4.checked = true
                } else {
                  itemSub4.checked = false
                }
              })
              FZTZArr.push(
                {
                  keyWordFZ: item.keyWord,
                  levelFZ: item.level,
                  tzTypeFZ: item.nextModule,
                  tzNameFZ: item.nextNodeName,
                  multiIndexFZ: [3, 0],
                  itemsTz: itemsTz
                }
              )

            }
          })
          if (FZTZArr.length > 0) {
            this.setData({
              fzType: true,
              FZTZArr: FZTZArr,
            })
          }



          let url = 'https://ai-robot-audio.oss-cn-shenzhen.aliyuncs.com/'
          this.setData({
            name: nodeName,
            audioContent: audioContent,
            plUploadUrl: plAudioUrl,
            ossFileName: `${url}${ossAudioPath}`,
            stateText: '已选择话术录音',
            showAudioStop: true
          })
          innerAudioContext.src = `${url}${ossAudioPath}`
          // innerAudioContext.src = plAudioUrl
          wx.hideLoading()

          let thisInnerAudioContext = wx.createInnerAudioContext()
          thisInnerAudioContext.src = `${url}${ossAudioPath}`

          thisInnerAudioContext.onCanplay(() => {
            // 必须。可以当做是初始化时长
            thisInnerAudioContext.duration;
            // 必须。不然也获取不到时长
            thisInnerAudioContext.play()
            setTimeout(() => {
              console.log(thisInnerAudioContext.duration, '音频时长'); // 401.475918
              let duration = thisInnerAudioContext.duration.toFixed(0)
              let buttonText = duration
              if (duration < 10) {
                buttonText = `0${duration}`
              }
              _this.setData({
                audioMaxTime: duration,
                buttonText: duration == 0 ? '' : `00:${buttonText}`
              })
              // innerAudioContext.onCanplay(() => { })
            }, 2000)
          })
          thisInnerAudioContext.onPlay(() => {
            // 必须。可以当做是初始化时长
            thisInnerAudioContext.duration;
            // 必须。不然也获取不到时长
            setTimeout(() => {
              console.log(thisInnerAudioContext.duration, '音频时长'); // 401.475918
              let duration = thisInnerAudioContext.duration.toFixed(0)
              let buttonText = duration
              if (duration < 10) {
                buttonText = `0${duration}`
              }
              _this.setData({
                audioMaxTime: duration,
                buttonText: duration == 0 ? '' : `00:${buttonText}`
              })
              thisInnerAudioContext.destroy()
            }, 3000)
          })

        }
      }
    })
  },
  getLCDataList(e) {
    let param = {
      whisperingId: this.data.id,
      page: 1,
      pageSize: 10000,
    }
    api.getwhisperingInfoList({
      data: param,
      s: (res) => {
        if (res.code === 0) {
          let objData = {}
          let { multiArray } = this.data
          let { datas } = res.response
          for (let i = 0; i < datas.length; i += 1) {
            this.data.objmultiArray[datas[i].moduleType].arr.push(datas[i])
          }
          multiArray[1] = [{ moduleName: '下一节点', id: 0 }];
          objData.multiArray = multiArray
          this.setData(objData)
        }
      }
    })
  },
  getJDDataList(e) {
    let param = {
      whisperingModuleId: this.data.moduleId,
      page: 1,
      pageSize: 10000,
    }
    api.getwhisperingNodeList({
      data: param,
      s: (res) => {
        if (res.code === 0) {

          let objData = {}
          let dataArr = []
          let { multiArray, objmultiArray } = this.data
          dataArr[0] = { moduleName: '下一节点', id: 0 };
          let { datas } = res.response
          for (let i = 0; i < datas.length; i += 1) {
            dataArr.push({
              moduleName: datas[i].nodeName,
              id: datas[i].id,
            })
          }
          objmultiArray[4].arr = dataArr
          objData.objmultiArray = objmultiArray
          multiArray[1] = dataArr
          objData.multiArray = multiArray
          this.setData(objData)
          console.log(this.data.multiArray, 'multiArray')
        }
      }
    })
  },

  bindInputChange: function (e) {
    let { name, index } = e.currentTarget.dataset
    let { FZTZArr } = this.data
    let dataObj = {}
    if (!index && index !== 0) {
      dataObj[name] = e.detail.value
    } else {
      if (FZTZArr[index]) {
        FZTZArr[index][name] = e.detail.value
      } else {
        FZTZArr[index] = {}
        FZTZArr[index][name] = e.detail.value
      }
      dataObj.FZTZArr = FZTZArr
    }
    this.setData(dataObj)
    console.log(this.data.FZTZArr)
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e)
    let { list, name, index } = e.currentTarget.dataset
    let { FZTZArr } = this.data
    const items = this.data[list]
    let dataObj = {}

    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
      if (items[i].checked) {
        if (!index && index !== 0) {
          dataObj[name] = items[i].value
        } else {
          if (FZTZArr[index]) {
            FZTZArr[index][name] = items[i].value
            FZTZArr[index].itemsTz.map(item => {
              if (item.value === e.detail.value) {
                item.checked = true
              } else {
                item.checked = false
              }
              return item
            })
          } else {
            FZTZArr[index] = {
              itemsTz: [{ value: 'A', name: 'A' },
              { value: 'B', name: 'B', checked: 'true' },
              { value: 'C', name: 'C' },]
            }
            FZTZArr[index][name] = items[i].value
            FZTZArr[index].itemsTz.map(item => {
              if (item.value === e.detail.value) {
                item.checked = true
              } else {
                item.checked = false
              }
              return item
            })
          }
          dataObj.FZTZArr = FZTZArr
        }
      }
    }
    dataObj[list] = items


    this.setData(dataObj)
    console.log('radio发生change事件，携带value值为：', this.data)
  },

  submitFn() {

    let { data } = this
    let { FZTZArr } = data
    let tzArr = []
    if (data.kdType) {
      tzArr.push({
        "keyWord": data.keyWordKD,
        "level": data.levelKD,
        "nextModule": data.tzTypeKD,
        "nextModuleId": data.tzTypeKD == 4 ? 0 : data.tzIdKD,
        "nextNode": data.tzTypeKD == 4 ? (data.tzIdKD || 0) : 0,
        "nextNodeName": data.tzNameKD || '下一节点',
        "nextType": 1,
        "whisperingId": data.id
      })
    }
    if (data.fdType) {
      tzArr.push({
        "keyWord": data.keyWordFD,
        "level": data.levelFD,
        "nextModule": data.tzTypeFD,
        "nextModuleId": data.tzTypeFD == 4 ? 0 : data.tzIdFD,
        "nextNode": data.tzTypeFD == 4 ? (data.tzIdFD || 0) : 0,
        "nextNodeName": data.tzNameFD || '下一节点',
        "nextType": 2,
        "whisperingId": data.id
      })
    }
    if (data.wsbType) {
      tzArr.push({
        "keyWord": data.keyWordWSB,
        "level": data.levelWSB,
        "nextModule": data.tzTypeWSB,
        "nextModuleId": data.tzTypeWSB == 4 ? 0 : data.tzIdWSB,
        "nextNode": data.tzTypeWSB == 4 ? (data.tzIdWSB || 0) : 0,
        "nextNodeName": data.tzNameWSB || '下一节点',
        "nextType": 3,
        "whisperingId": data.id
      })
    }

    if (data.fzType) {
      for (let i = 0; i < FZTZArr.length; i += 1) {
        tzArr.push({
          "keyWord": FZTZArr[i].keyWordFZ,
          "level": FZTZArr[i].levelFZ,
          "nextModule": FZTZArr[i].tzTypeFZ,
          "nextModuleId": FZTZArr[i].tzTypeFZ == 4 ? 0 : data.tzIdFZ,
          "nextNode": FZTZArr[i].tzTypeFZ == 4 ? (data.tzIdFZ || 0) : 0,
          "nextNodeName": FZTZArr[i].tzNameFZ || '下一节点',
          "nextType": 4,
          "whisperingId": data.id
        })
      }
    }


    console.log(tzArr, 'tzArr')
    let { moduleId, id, ossFileName, plUploadUrl,
      audioContent, name, indexType, type } = this.data
    let param = {
      "whisperingId": id,
      "whisperingModuleId": moduleId,
      "nodeName": name,
      "audioContent": audioContent,
      "plAudioUrl": plUploadUrl || '',
      "ossAudioPath": ossFileName,
      "module": indexType,
      "type": indexType !== 3 ? 0 : type,
    }

    console.log(param)

    if (!plUploadUrl || plUploadUrl === "") {
      wx.showToast({
        icon: 'none',
        title: '请录音话术内容！',
        duration: 3000
      });
      return
    }
    if (!app.validationParametersfn(param, '')) {
      return
    }
    param.keyWord = ""
    param.label = ""
    param.level = "0"

    let apiText = "addWhisperingNode"
    if (this.data.nodeId !== 'add') {
      param.id = this.data.nodeId
      apiText = "updateWhisperingNode"
    }


    param.nextNodeList = tzArr
    api[apiText]({
      data: param,
      s: (res) => {
        if (res.code === 0) {

          let { id } = this.data
     

          wx.navigateBack({
            delta: 1,
          })
          // wx.reLaunch({
          //   url: `/pages/speechcraft/add-template-list/add-template-list?id=${id}`,
          // })

        }
      }
    })
  },
  addFZTZFn() {
    let { FZTZArr } = this.data
    FZTZArr.push({
      keyWordFZ: '',
      levelFZ: 'C',
      tzTypeFZ: 4,
      tzNameFZ: '下一节点',
      multiIndexFZ: [3, 0],
      itemsTz: [{ value: 'A', name: 'A' },
      { value: 'B', name: 'B', checked: 'true' },
      { value: 'C', name: 'C' },]
    })
    this.setData({
      FZTZArr: FZTZArr
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