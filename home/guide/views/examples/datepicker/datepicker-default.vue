<template>
  <div>
    <ev-datepicker
      class="evui-datepicker-temp"
    >``</ev-datepicker>
    <ev-datepicker
      v-model="bindDay"
      :options="option"
      class="evui-datepicker-temp"
    >``</ev-datepicker>
  </div>
</template>

<script>
  import '@/styles/evui.css';

  export default {
    data() {
      return {
        bindDay: '2018-07-09',
        option: {
          selectDayType: 'day',
          initSelectDayFlag: true,
        },
      };
    },
    methods: {
    },
  };
</script>

<style scoped>
  .evui-datepicker-temp {
    display: inline-block;
  }
</style>
