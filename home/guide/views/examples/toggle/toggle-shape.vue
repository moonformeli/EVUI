<template>
  <div>
    <ev-toggle
      v-model="toggleValue1"
      :toggle-type="'slide'"
      :toggle-shape="'circle'"
      :toggle-text="largeText"
    >``</ev-toggle>
    {{ toggleValue1 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue2"
      :toggle-type="'slide'"
      :toggle-shape="'circle'"
      :toggle-text="largeText"
    >``</ev-toggle>
    {{ toggleValue2 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue3"
      :toggle-type="'slide'"
      :toggle-shape="'square'"
      :toggle-text="largeText"
    >``</ev-toggle>
    {{ toggleValue3 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue4"
      :toggle-type="'slide'"
      :toggle-shape="'square'"
      :toggle-text="largeText"
    >``</ev-toggle>
    {{ toggleValue4 }}
    <br>
    <br>
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
        toggleValue4: false,
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
