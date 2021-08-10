<template>

  <Calendar />

  <br />
  <br />
  <br />
  <br />

  <HCalendar @change="chooseDay" />

</template>

<script setup>
import { ref, nextTick } from 'vue';

import Calendar from './components/calendar/index.vue'
import HCalendar from './components/h-calendar/index.vue'

const date = ref(new Date('2019/09/09'))

const chooseDay = value => {
  console.log('chooseDay', value)
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
ul, li {
  list-style: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
