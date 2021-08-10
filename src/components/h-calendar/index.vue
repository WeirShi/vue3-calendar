<template>
  <div class="horizontal-calendar">
    <div class="horizontal-calendar__header">
      <div class="title">
        <i class="icon"></i>
        <span class="text">日历</span>
      </div>
    </div>
    <div class="date-list" ref="hCalendarRef">
      <div
        class="date-list-scroll"
        :style="{'transform': 'translateX('+translateX+'px)','transition-duration': transitionDuration}"
        v-on:touchstart.passive="touchstart"
        v-on:touchend.passive="touchend"
      >
        <div
          class="date-item"
          v-for="(day,index) in dateList"
          v-bind:key="index"
          v-on:click.stop="changeChoosedDay($event, day)"
          v-bind:style="{width: itemWidth + 'px'}"
          :data-date="day.dateFormat"
        >
          <div>
            <p
              class="date-item-date"
              :class="{ choosed: day.isChoosed, today: day.isToday }"
            >{{ day.date == 1 ? day.month + '月' : day.isToday ? '今' : day.date }}</p>
            <p class="date-item-day">{{ day.day }}</p>
            <p class="date-item-dot" v-if="day.hasSchedule"></p> 
          </div>
        </div>
      </div>
    </div>

    <button class="backToday" v-on:click.prevent="backToToday">回到今天</button>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { dateFmt, isToday, getDayOfWeek, getDetailOfDay, getWeekStartDate } from '../../utils/time'

const maxCount = 21
const count = 7 // 放置的日期方块的数量
const changeCount = 7 // 每次滑动7天
const oneDay = 24 * 60 * 60 * 1000

const emit = defineEmits(["change"]);

const props = defineProps({
  date: {
    type: Date,
    default: () => {
      return new Date()
    }
  },
  scheduleMap: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 是否可滑动
  swiper: {
    type: Boolean,
    default: true
  }
})

// 每一个日期对象的数据结构如下
// {
//   dateFormat: "2019/07/20",
//   year: "2019",
//   month: "07",
//   date: "20",
//   timestamp: 1564046915797,
//   day: "六"
// }

// 日期数据
const dateList = ref([])
// 日期展示dom
const hCalendarRef = ref(null)
// 屏幕展示日期的dom宽度
const domWidth = ref(0)
// 每个日期的dom宽度
const itemWidth = ref(0)
// 当前显示的第一个日期
const firstDay = ref({})
// 当前选中的日期
const choosedDay = ref({})
// 今天
const today = ref({})

const isHasToday = ref(true)

const translateX = ref(0)
const transitionDuration = ref('300ms')
const direction = ref('right')

const init = () => {
  domWidth.value = hCalendarRef.value.offsetWidth
  itemWidth.value = domWidth.value / count

  // 今天
  today.value = formatOneDay(new Date())
  // 当前选中的日期
  choosedDay.value = formatOneDay(props.date)
  emit('change', choosedDay.value)
  // 展示的一周的第一天
  firstDay.value = getFirstDay(props.date)
  createList()
}

const createList = () => {
  let list = []
  const firstDayTime = firstDay.value.timestamp
  for (let i = 0; i < maxCount; i++) {
    // 用第一天的时间戳 + 24小时 * i天
    const timestamp = firstDayTime + oneDay * i
    const info = formatOneDay(new Date(timestamp))
    list.push(info)
  }
  dateList.value = list;
  translateX.value = 0
}

// 格式化单个日期的数据
const formatOneDay = day => {
  if (typeof day === 'string') {
    day = new Date(day)
  }
  const timestamp = day.getTime();
  const dateTime = new Date(timestamp)
  const dateFormat = dateFmt(dateTime, 'yyyy/MM/dd')
  const { year, month, date, dayOfWeek } = getDetailOfDay(dateTime)
  return {
    dateFormat,
    year,
    month: month + 1,
    date,
    timestamp,
    hasSchedule: !!props.scheduleMap[dateFormat],
    isChoosed: timestamp === choosedDay.value.timestamp || isToday(day),
    isToday: isToday(day),
    day: getDayOfWeek(dayOfWeek)
  }
}

// 每周的第一个周日
const getFirstDay = date => {
  return formatOneDay(getWeekStartDate(getDetailOfDay(date)))
}

// 判断当前数据中是否含有今天
const hasToday = () => {
  let data = []
  if (direction.value === 'right') {
    data = dateList.value.slice(0, 7)
  } else if (direction.value === 'left') {
    data = dateList.value.slice(7, 14)
  }
  const [date] = data.filter(item => item.isToday)
  isHasToday.value = !!date
}


const backToToday = () => {
  if (!isHasToday.value) {
    firstDay.value = getFirstDay(new Date())
    choosedDay.value = today.value
    emit('change', choosedDay.value)
    createList()
  }
}

onMounted(init)

const startClientX = ref(0)
const startClientY = ref(0)
const endClientX = ref(0)
const endClientY = ref(0)

const touchstart = e => {
  const { clientX, clientY } = e.changedTouches[0]
  startClientX.value = clientX
  startClientY.value = clientY
}
const touchend = e => {
  if (!props.swiper) return
  const { clientX, clientY } = e.changedTouches[0]
  endClientX.value = clientX
  endClientY.value = clientY

  const distanceX = endClientX.value - startClientX.value
  const distanceY = endClientY.value - startClientY.value
  choosedDay.value.isToday = false
  //判断滑动 的方向
  if (distanceX > 30 && Math.abs(distanceY) < Math.abs(distanceX)) {
    // 右滑
    dateSwiper(-1)
  }
  if (distanceX < -30 && Math.abs(distanceY) < Math.abs(distanceX)) {
    // 左滑
    dateSwiper(1)
  }
}

// 左右滑动翻页 1 往后加载7天，-1 往前加载7天
const dateSwiper = (type) => {
  // 右滑
  if (type === -1) {
    direction.value = 'right'
    // 1，如果此时translateX < 单次滚动的日期长度，说明左侧有可滚动的日期，不需要生成更多日期
    if (translateX.value <= -itemWidth.value * changeCount) {
      translateX.value += itemWidth.value * changeCount;
    } else {
      // 新增数据
      let fdt = dateList.value[0].timestamp
      let list = []
      
      for (let i = 0; i < changeCount; i++) {
        //用数组第一项的时间戳 - 24小时*(i+1)天
        const timestamp = fdt - oneDay * (i + 1)
        const info = formatOneDay(new Date(timestamp))
        list.unshift(info)
      }
      // 消除过渡效果，插入新日期，变更x轴位置，以抵消插入数据带来的位置变化
      transitionDuration.value = '0ms'
      dateList.value.unshift(...list)

      if (dateList.value.length > maxCount) {
        for (let n = 0; n < changeCount; n++) {
          dateList.value.pop()
        }
      }
      // 新增的日期
      translateX.value -= domWidth.value
      // 异步重置过渡效果，位移div
      setTimeout(() => {
        transitionDuration.value = "300ms"
        translateX.value += domWidth.value
      }, 16)
    }
  } else if (type === 1) {
    direction.value = 'left'
    // 左滑
    // 判断右侧是否有可滚动的日期，有的话则直接滚动
    const hasSpace = dateList.value.length * itemWidth.value - domWidth.value + translateX.value
    // 有完整可滚动的日期，则直接滚动
    if (hasSpace > itemWidth.value * changeCount) {
      translateX.value -= itemWidth.value * changeCount;
    } else {
      // 新增数据
      let fdt = dateList.value[dateList.value.length - 1].timestamp
      let list = []
      for (let i = 0; i < changeCount; i++) {
        //用数组第一天的时间戳 + 24小时*(i+1)天
        const timestamp = fdt + oneDay * (i + 1);
        const info = formatOneDay(new Date(timestamp))
        list.push(info)
      }

      // 消除过渡效果，插入新日期，变更x轴位置，以抵消插入数据带来的位置变化
      transitionDuration.value = '0ms'
      dateList.value.push(...list)
      if (dateList.value.length > maxCount) {
        for (let n = 0; n < changeCount; n++) {
          dateList.value.shift()
        }
      }
      // 新增的日期
      translateX.value += domWidth.value
      
      // 异步重置过渡效果，位移div
      setTimeout(() => {
        transitionDuration.value = "300ms"
        translateX.value -= domWidth.value
      }, 16)

    }
  }
  hasToday()
}

const changeChoosedDay = (e, day) => {
  emit('change', day)
  choosedDay.value = day
  dateList.value.forEach(date => {
    date.isChoosed = date.timestamp === day.timestamp
  })
}

</script>

<style lang="less" scoped>
.horizontal-calendar {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  user-select: none;
  padding: 10px;

  * {
    margin: 0;
    padding: 0;
  }
  div {
    box-sizing: border-box;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .title {
      .icon {
        display: inline-block;
        width: 11px;
        height: 11px;
        margin-right: 5px;
      }
    }
  }

  .date-list {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    overflow: hidden;
    position: relative;
    text-align: left;
  }
  .date-list-scroll {
    width: 60000px;
    height: 74px;
    position: relative;
    transition: transform 0.3s ease-in-out;
    transform: translateX(0);
  }

  .date-item {
    position: relative;
    display: inline-block;
    background-color: #fff;
    font-size: 14px;
    cursor: pointer;
    &>div {
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-date {
      color: #212224;
      font-size: 14px;
      min-width: 24px;
      height: 24px;
      font-weight: 600;
      margin-bottom: 5px;

      display: flex;
      align-items: center;
      justify-content: center;
      &.choosed {
        background-color: #FF6600;
        border-radius: 50%;
        color: #fff;
      }
    }
    &-day {
      color: #969799;
      font-size: 10px;
      font-weight: 500;
    }
    &-dot {
      position: relative;
      margin-top: 4px;
      &::after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #FF6600;
      }
    }
  }
}

</style>