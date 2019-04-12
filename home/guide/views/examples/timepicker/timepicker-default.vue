<template>
  <div>
    <ev-time-picker
      v-model="timeValue"
      :spinner-arr="obj"
    >``</ev-time-picker>
    <br><br>
    timepicker value => {{ timeValue }}
    <br><br><br><br><br><br><br><br><br><br><br>
  </div>
</template>

<script>
  import '@/styles/evui.css';

  export default {
    data() {
      return {
        timeValue: '',
        obj: [
          { from: 0, to: 23 },
          { from: 0, to: 59 },
          { from: 0, to: 59 },
        ],
      };
    },
    methods: {
    },
  };
</script>
