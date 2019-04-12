<template>
  <div>
    <ev-toggle
      v-model="toggleValue1"
      :toggle-type="'tab'"
      :toggle-text="largeText1"
      :toggle-font-size="13"
    >``</ev-toggle>
    {{ toggleValue1 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue2"
      :toggle-type="'tab'"
    >``</ev-toggle>
    {{ toggleValue2 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue3"
      :toggle-type="'slide'"
      :toggle-text="largeText3"
    >``</ev-toggle>
    {{ toggleValue3 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue4"
      :toggle-type="'slide'"
    >``</ev-toggle>
    {{ toggleValue4 }}
    <br>
    <br>
    <ev-toggle
      v-model="toggleValue5"
      :toggle-type="'button'"
      :toggle-text="largeText5"
    >``</ev-toggle>
    {{ toggleValue5 }}
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
        toggleValue5: true,
        largeText1: {
          onText: 'ON_TEXT',
          offText: 'OFF',
        },
        largeText3: {
          onText: 'ON_TEXT',
          offText: 'OFF_TEXT',
        },
        largeText5: {
          onText: 'ON_TEXT',
          offText: 'OFF_TEXT',
        },
      };
    },
    methods: {
    },
  };
</script>
