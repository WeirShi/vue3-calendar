import { ref, computed } from 'vue'
import { dateFmt, getDetailOfDay, isToday } from '../../utils/time'
export default function () {
  const year = ref(0)
  const month = ref(0)
  const day = ref(0)
  const dateList = ref([])
  const today = ref({})
  const choosedDay = ref({})


  const initData = () => {
    const today = getDetailOfDay()
    year.value = today.year
    month.value = today.month
    day.value = today.date
    dateList.value = createList()
    today.value = today
    console.log('year', year.value)
    console.log('day', day.value)
    console.log('month', month.value)
  }

  // 每个月的天数
  const daysOfMonth = () => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if ((year.value % 4 === 0 && year.value % 100 !== 0) || year.value % 400 === 0) {
      days[1] = 29
    }

    return days
  }
  // 某月的1号是周几
  const targetDay = () => {
    return new Date(year.value, month.value, 1).getDay()
  }

  const createList = () => {
    let list = []
    preMonth(list)
    thisMonth(list)
    nextMonth(list)
    for (let i = 0; i < list.length; i++) {
      addYear(list[i])
      addTimestamp(list[i])
      list[i]["id"] = i
      list[i]["isToday"] = isToday(list[i].dateFormat)
    }
    return list
  }



  // 前月从几号开始渲染
  const startAdd = () => {
    let start = 0
    if (month.value === 0) {
      start = daysOfMonth()[11] - targetDay() + 1
    } else {
      start = daysOfMonth()[month.value - 1] - targetDay() + 1
    }
    return start
  }

  // 前月的几天
  const preMonth = list => {
    if (targetDay() > 0) {
      let start = startAdd()
      for (let i = 0; i < targetDay(); i++) {
        let obj = {
          type: "pre",
          day: start,
        }
        // 如果当前月份是1月，则上个月是12月
        if (month.value === 0) {
          obj.month = 11
        } else {
          obj.month = month.value - 1
        }
        start++
        list.push(obj)
      }
    }

  }

  // 本月
  const thisMonth = list => {
    for (let i = 0; i < daysOfMonth()[month.value]; i++) {
      let obj = {
        type: "normal",
        day: i + 1,
        month: month.value,
      }
      list.push(obj)
    }
  }

  // 次月
  const nextMonth = list => {
    let nextNum = 0
    // 判断下一个月需要展示多少天
    if (list.length > 35) {
      nextNum = 42 - list.length
    } else {
      nextNum = 35 - list.length
    }
    for (let i = 0; i < nextNum; i++) {
      let obj = {
        type: "next",
        day: i + 1,
      };
      // 如果当前为12月，则次月为1月
      if (month.value === 11) {
        obj.month = 0;
      } else {
        obj.month = month.value + 1
      }
      list.push(obj);
    }
  }

  const addYear = day => {
    // 如果month属性的值是11，且type属性为pre，则年份减1，month为1时同理
    if (day.month == 11 && day.type == "pre") {
      day.year = year.value - 1
    } else if (day.month == 0 && day.type == "next") {
      day.year = year.value + 1
    } else {
      day.year = year.value
    }
  }

  const addTimestamp = day => {
    let date = new Date(
      day.year,
      day.month,
      day.day
    )
    day["timestamp"] = date.getTime()
    day["dateFormat"] = dateFmt(date, "yyyy/MM/dd")
  }

  const handlePreMonth = () => {
    if (month.value === 0) {
      year.value -= 1
      month.value = 11
    } else {
      month.value -= 1
    }
    day.value = 1
    dateList.value = createList()
  }
  const handleNextMonth = () => {
    if (month.value === 11) {
      year.value += 1
      month.value = 0
    } else {
      month.value += 1
    }
    day.value = 1
    dateList.value = createList()
  }

  const setSelectDay = oneDay => {
    year.value = oneDay.year
    month.value = oneDay.month
    day.value = oneDay.day
    dateList.value = createList()
    // choosedDay.value = oneDay
  }

  return {
    initData,
    year,
    month,
    day,
    today,
    dateList,
    choosedDay,
    handlePreMonth,
    handleNextMonth,
    setSelectDay,
  }

}
