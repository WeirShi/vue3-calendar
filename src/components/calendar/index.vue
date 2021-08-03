<template>
  <div class="calendar">
    <!-- 日期标题和切换按钮 -->
    <div class="calendar-title">
      <div class="arrow-box left" @click="handlePreMonth">
        <i class="icon"></i>
      </div>
      <div class="calendar-title__text">
        {{ year }} - {{(month + 1) >= 10 ? (month + 1) : '0' + (month + 1)}}
      </div>
      <div class="arrow-box right" @click="handleNextMonth">
        <i class="icon"></i>
      </div>
    </div>
    <div class="week">
      <span class="week-title" v-for="(d, index) in week" :key="index">{{ d }}</span>
    </div>
    <!-- 日历主体部分 -->
    <div class="calendar-body">
      <div
        v-for="day in dateList"
        :key="day.id"
        class="item-day"
        :class="{
          'not-normal': day.type !== 'normal',
          'select-day': choosedDay.timestamp == day.timestamp,
          'today': day.isToday
        }"
        :data-date="day.dateFormat"
        @click="selectDay(day)"
      >
        <span class="num">{{ day.isToday ? '今' : day.day }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import useCalendar from './useCalendar'

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
  }
})


const week = ref([ "日", "一", "二", "三", "四", "五", "六"])
const {
  year,
  month,
  day,
  dateList,
  initData,
  handlePreMonth,
  handleNextMonth,
  setSelectDay
} = useCalendar()

const choosedDay = ref({})

const selectDay = oneDay => {
  choosedDay.value = oneDay
  setSelectDay(oneDay)
  emit('change', oneDay)
}

const init = () => {
  initData()
}

onMounted(init)

</script>

<style lang="less" scoped>
.calendar {
  * {
    box-sizing: border-box;
  }
  .week {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-around;
    &-title {
      flex-shrink: 0;
      color: #212224;
      font-size: 14px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 4px 7px;
      min-width: 30px;
      min-height: 30px;
      margin-bottom: 10px;
    }
  }
  &-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 26px;
    &__text {
      margin: 0 16px;
      color: #2A303B;
      font-size: 17px;
      font-weight: bold;
    }

    .arrow-box {
      .icon {
        display: inline-block;
        width: 8px;
        height: 15px;
        background-image: url(../../assets/calendar-arrow.png);
        background-position: center;
        background-size: cover;
      }
      &.right {
        .icon {
          transform: rotate(180deg);
        }
      }
    }
  }
  &-body {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    .item-day {
      margin-bottom: 10px;
      .num {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        color: #2A303B;
        padding: 4px 7px;
        min-width: 30px;
        min-height: 30px;
      }
      &.not-normal {
        .num {
          color: #B1B1B3;
        }
      }
      &.today {
        .num {
          background-color: #FF6600;
          border-radius: 50%;
          color: #fff;
        }
      }
      &.select-day {
        .num {
          border-radius: 50%;
          border: 1px solid #FF6600;
        }
        &.today {
          .num {
            border: none;
          }
        }
      }
    }
  }
}
</style>
