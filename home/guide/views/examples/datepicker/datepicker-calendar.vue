<template>
  <div>
    <div
      class="ev-calendar-temp-wrapper"
    >
      <ev-calendar
        ref="calendarRef"
        :datepicker-options="obj1"
        class="evui-calendar-temp"
      >``</ev-calendar>
      <ev-calendar
        ref="calendarRef"
        :datepicker-options="obj2"
        class="evui-calendar-temp"
      >``</ev-calendar>
      <ev-calendar
        ref="calendarRef"
        :datepicker-options="obj3"
        class="evui-calendar-temp"
      >``</ev-calendar>
      <ev-calendar
        ref="calendarRef"
        :datepicker-options="obj4"
        class="evui-calendar-temp"
      >``</ev-calendar>
    </div>
  </div>
</template>

<script>
  import '@/styles/evui.css';

  export default {
    data() {
      return {
        toggleFlag: true,
        obj1: {
          dropdownFlag: false,
        },
        obj2: {
          selectDayType: 'weekday',
          dropdownFlag: false,
        },
        obj3: {
          selectDayType: 'week',
          dropdownFlag: false,
        },
        obj4: {
          dropdownFlag: false,
          selectDayType: 'day',
          selectDayLimit: 7,
          initSelectDayFlag: false,
          titleType: {
            month: 'numberName',
            dayOfTheWeek: 'abbrLowerName',
          },
        },
      };
    },
    methods: {
    },
  };
</script>

<style>
  .ev-calendar-temp-wrapper {
    user-select: none;
  }
  .evui-calendar-temp {
    display: inline-block;
  }
</style>
