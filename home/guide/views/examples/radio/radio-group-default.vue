<template>
  <div>
    <h5># Default Model</h5>
    <br>
    <ev-radio-group
      v-model="bindingValue"
      @change-event="changeEvent"
    >
      <ev-radio
        :value="radioObj[0].value"
      >
        {{ radioObj[0].text }}
      </ev-radio>
      <ev-radio
        :value="radioObj[1].value"
        class="radioStyle"
      >
        {{ radioObj[1].text }}
      </ev-radio>
      <ev-radio
        :value="radioObj[2].value"
        :disabled="true"
        class="radioStyle"
      >
        {{ radioObj[2].text }}
      </ev-radio>
    </ev-radio-group>
    <br>
    <br>
    bind value : {{ bindingValue }}
    <br>
    <br>
    <h5># Default Model small size</h5>
    <br>
    <ev-radio-group
      v-model="bindingValue2"
      :size="`small`"
      @change-event="changeEvent"
    >
      <ev-radio
        :value="radioObj2[0].value"
      >
        {{ radioObj2[0].text }}
      </ev-radio>
      <ev-radio
        :value="radioObj2[1].value"
        :disabled="true"
        class="radioStyle"
      >
        {{ radioObj2[1].text }}
      </ev-radio>
      <ev-radio
        :value="radioObj2[2].value"
        class="radioStyle"
      >
        {{ radioObj2[2].text }}
      </ev-radio>
    </ev-radio-group>
    <br>
    <br>
    bind value : {{ bindingValue2 }}
    <br>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bindingValue: 'cellPhone',
        radioObj: [
          {
            text: 'Iphone',
            value: 'cellPhone',
          },
          {
            text: 'Hermes',
            value: 'imitation',
          },
          {
            text: 'Apple Watch',
            value: 'luxury',
          },
        ],
        bindingValue2: 'cellPhone',
        radioObj2: [
          {
            text: 'Iphone',
            value: 'cellPhone',
          },
          {
            text: 'Hermes',
            value: 'imitation',
          },
          {
            text: 'Apple Watch',
            value: 'luxury',
          },
        ],
      };
    },
    methods: {
      changeEvent(e) {
        // return Event
        console.log(`changeEvent e : ${e}`);
      },
    },
  };
</script>

<style scoped>
  .radioStyle {
    margin: 0 0 0 10px;
  }
</style>
