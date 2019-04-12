<template>
  <div>
    <ev-toggle
      v-model="toggleValue1"
      :toggle-obj="largeObj"
      :toggle-text="largeText1"
      :toggle-font-size="18"
    >``</ev-toggle>
    {{ toggleValue1 }}
    <ev-toggle
      v-model="toggleValue2"
      :toggle-text="largeText2"
      :toggle-font-size="13"
    >``</ev-toggle>
    {{ toggleValue2 }}
    <ev-toggle
      v-model="toggleValue3"
      :toggle-obj="smallObj"
    >``</ev-toggle>
    {{ toggleValue3 }}
  </div>
</template>

<script>
  import '@/styles/evui.css';

  export default {
    data() {
      return {
        toggleValue1: true,
        toggleValue2: false,
        toggleValue3: true,
        largeObj: {
          width: 80,
          height: 34,
        },
        largeText1: {
          onText: 'ON',
          offText: '',
        },
        largeText2: {
          onText: 'ON',
          offText: 'OFF',
        },
        smallObj: {
          width: 30,
          height: 14,
        },
      };
    },
    methods: {
    },
  };
</script>
