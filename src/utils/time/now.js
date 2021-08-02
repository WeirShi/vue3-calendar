// 当前时间
const nowTime = new Date();

// 今天是本周的第几天
const dayOfWeek = nowTime.getDay();

// 当前日期
const day = nowTime.getDate();

// 当前月份
const month = nowTime.getMonth();

// 当前年份
const year = nowTime.getFullYear();

export {
  dayOfWeek,
  day,
  month,
  year
}