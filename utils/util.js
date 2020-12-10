const formatTime = (date, type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let returnData = [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  if (type == 'day') {
    returnData = [year, month, day].map(formatNumber).join('/')
  }
  if (type == 'time') {
    returnData = [hour, minute, second].map(formatNumber).join(':')
  }
  return returnData
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
