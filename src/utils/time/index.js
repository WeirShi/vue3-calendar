/** 时间格式化
 * @param {dateTime} date 标准时间格式 -> new Date()
 * @param {string} format 时间格式化的格式 'yyyy-MM-dd hh:mm:ss'
 * @returns {string} 格式化后的时间  '2017-01-01 01:00:00'
*/
const dateFmt = function (date, format  = 'yyyy/MM/dd hh:mm:ss') {
    var o = {
        'M+': date.getMonth() + 1, // month
        'd+': date.getDate(), // day
        'h+': date.getHours(), // hour
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
        'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}

/**
 * 判断是否是今天
 * @returns {string | Date}
 */
const isToday = (day = new Date()) => {
  if (typeof day === 'string') {
    day = new Date(day)
  }
  return new Date().toDateString() === day.toDateString()
}



/**
 * 获取某一天的年月日周几
 * @returns {string | Date}
 */
const getDetailOfDay = function (day = new Date()) {
  if (typeof day === 'string') {
    day = new Date(day)
  }
  // 本周的第几天
  const dayOfWeek = day.getDay()
  // 日期
  const date = day.getDate()
  // 月份
  const month = day.getMonth()
  // 年份
  const year = day.getFullYear()

  return {
    dayOfWeek,
    date,
    month,
    year
  }
}

/**
 * 获得本周的开始日期 从周一开始
 * @returns {Date} 2019-12-09 00:00:00
 */
const getWeekStartDate = function (options) {
  const {year, month, date, dayOfWeek} = options
  const weekStartDate = new Date(year, month, date - (dayOfWeek - 1))
  return weekStartDate
}

/**
 * 获得本周的结束日期 到周日结束
 * @returns {Date} 2019-12-15 23:59:59
 */
const getWeekEndDate = function (options) {
  const {year, month, date, dayOfWeek} = options
    let weekEndDate = new Date(year, month, date + (7 - dayOfWeek))
    weekEndDate = weekEndDate.getTime() + 24 * 60 * 60 * 1000 - 1
    weekEndDate = new Date(weekEndDate)
    return weekEndDate
}

/**
 * 获得本月的开始日期
 * @returns {Date} 2019-12-01 00:00:00
 */
const getMonthStartDate = function (year, month) {
  var monthStartDate = new Date(year, month, 1)
  return monthStartDate
}

/**
 * 获得本月的结束日期
 * @returns {Date} 2019-12-31 23:59:59
 */
const getMonthEndDate = function (year, month) {
    let monthEndDate = new Date(year, month, getMonthDays(year, month))
    monthEndDate = monthEndDate.getTime() + 24 * 60 * 60 * 1000 - 1
    monthEndDate = new Date(monthEndDate)
    return monthEndDate
}

/**
 * 获得该月天数
 * @param {number} year 年份
 * @param {number} month 月份
 * @returns {number} days 28|29|30|31
 */
const getMonthDays = function (year, month = new Date().getMonth()) {
    var monthStartDate = new Date(year, month, 1)
    var monthEndDate = new Date(year, month + 1, 1)
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
    return days
}

/**
 * 获取当天为周几
 * @param {number} date new Date().getDay()
 * @returns {string} eg: 周一
 */
const getDayOfWeek = function (date = new Date().getDay()) {
    const weeks = ['日', '一', '二', '三', '四', '五', '六']
    return weeks[date]
}


export {
  dateFmt,
  isToday,
  getDetailOfDay,
  
  getDayOfWeek,
  getWeekStartDate,
  getWeekEndDate,
  getMonthStartDate,
  getMonthEndDate,
  getMonthDays
}