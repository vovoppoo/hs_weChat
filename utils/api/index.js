const network = require('./network.js')
const httpGet = network.httpGet
const httpPost = network.httpPost
const httpPathPost = network.httpPathPost
const httpPath = network.httpPath
const conf = require('./config.js')
// api 列表这里
module.exports = {

  // 资源相关
  uploadDelFile: httpPath('/resources/delete/'), // 删除
  // getResourcesInfo: httpPath('/resources/info/'), // 获取资源信息 列表
  getDataList: httpGet('/user/info'),

  //登录
  goLogin: httpPost('/system/login'),//登录
  goRegister: httpPost('/user/register'),//注册
  getAuthentication: httpGet('/user/authentication'),//身份短信验证(找回密码)
  getValidPhoneCaptcha: httpGet('/user/validPhoneCaptcha'),//身份短信验证(注册验证手机)
  getsendSMS: httpGet('/sms/sendSMS'),//短信验证
  getWeChatLoginInfo:httpGet('/user/getWeChatLoginInfo'),//传code到后端获取openid，session_key等
  getWeChatUserPhone:httpPost('/user/getWeChatUserPhone'),//获取微信手机号

  resetPassword: httpGet('/user/resetPassword'),//重置密码


  //话术配置
  getWhisperingTypeList: httpGet('/whisperingType/getTypeList'),//获取话术类型
  getwhisperingList: httpGet('/whispering/list'),//获取话术列表
  getwhisperingInfo: httpGet('/whispering/info'),//获取话术详情
  getwhisperingInfoList: httpGet('/whisperingModule/list'),//获取话术流程列表
  getwhisperingNodeList: httpGet('/whisperingNode/list'),//获取话术流程列表

  getwhisperingNodeInfo: httpGet('/whisperingNode/info'),//获取话术节点详情

  addWhispering: httpPost('/whispering/addWhispering'),//添加话术
  addWhisperingLC: httpPost('/whisperingModule/add'),//添加流程
  updateWhisperingLC: httpGet('/whisperingModule/updateModule'),//修改流程
  addWhisperingNode: httpPost('/whisperingNode/add'),//添加节点
  updateWhisperingNode: httpPost('/whisperingNode/update'),//修改节点
  WhisperingUploadAudio: httpPost('/whisperingNode/uploadAudio'),//上传话术语音
  examineWhispering:httpGet('/whispering/commitWhispering'),//审核话术
  importWhispering:httpGet('/whispering/copyWhispering'),//导入话术到我的话术

  //客户
  getCustomerList: httpGet('/customer/list'),//获取客户列表
  getCustomerList: httpGet('/customer/list'),//获取回访列表
  getCustomerInfo: httpGet('/customer/info'),//获取客户详情
  updateCustomer: httpPost('/customer/update'),//修改客户
  addCustomer: httpPost('/customer/add'),//添加客户
  deleteCustomerInfo: httpGet('/customer/del'),//删除客户
  getCustomerLabelList: httpGet('/customerLabel/list'),//获取客户标签列表
  addCustomerLabel: httpGet('/customerLabel/add'),//添加标签
  delWhisperingNode: httpGet('/whisperingNode/del'),//删除标签
  addCustomerFollow: httpPost('/customerFollow/add'),//添加客户回访
  listCustomerFollow: httpGet('/customerFollow/list'),//客户回访列表

  //任务
  addTask:httpPost('/task/add'),
  updateTaskStatus:httpGet('/task/updateStatus'),
  getTaskList:httpGet('/task/list'),
  getTaskInfo:httpGet('/task/info'),
  getTaskCustomerList:httpGet('/customerCall/taskList'),
  addTaskTimeModel:httpPost('/task/addTimeTemplate'),
  getTaskTimeModelList:httpGet('/task/getTimeTemplateList'),
  deleteTask:httpGet('/task/del'),

  //商品
  getGoodsList:httpGet('/goods/list'),

  //下单
  getWxPayOrder:httpGet('/wxPay/wxUnifiedOrder'),//微信下单
  getWxPayOrderQuery:httpGet('/wxPay/orderQuery'),//微信订单查询

  //用户
  getBDUserInfo:httpGet('/user/info')
}