<template>
  <div>
    <ev-toggle
      v-model="toggleFlag"
    >``</ev-toggle>
    {{ toggleFlag }}
    <ev-toggle
      v-model="toggleFlag2"
    >``</ev-toggle>
    {{ toggleFlag2 }}
  </div>
</template>

<script>
  import '@/styles/evui.css';

  export default {
    data() {
      return {
        toggleFlag: true,
        toggleFlag2: false,
        largeText: {
          onText: 'ON',
          offText: 'OFF',
          fontSize: 11,
        },
      };
    },
    methods: {
    },
  };
</script>

<style>
</style>
