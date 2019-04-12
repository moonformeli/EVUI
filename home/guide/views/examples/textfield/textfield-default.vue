<template>
  <div>
    <ev-text-field
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :reg-exp="/([^A-Za-z0-9])+/g"
      :use-reg-exp="true"
      :max-length="20"
      :use-max-length="true"
      :border-color="borderColor"
      @input="onInput"
    >``</ev-text-field>
    <ev-text-field
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :reg-exp="/([^A-Za-z0-9])+/g"
      :use-reg-exp="true"
      :max-length="20"
      :use-max-length="true"
      :border-color="borderColor"
      :disabled="true"
      @input="onInput"
    >``</ev-text-field>
    <ev-text-field
      v-model="value"
      :type="'password'"
      :placeholder="placeholder"
      :reg-exp="/([^A-Za-z0-9])+/g"
      :use-reg-exp="true"
      :max-length="20"
      :use-max-length="true"
      :border-color="borderColor"
      :height="200"
      @input="onInput"
    >``</ev-text-field>
    <ev-text-field
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :reg-exp="/([^A-Za-z0-9])+/g"
      :use-reg-exp="true"
      :max-length="20"
      :use-max-length="true"
      :border-color="borderColor"
      :disabled="true"
      :height="200"
      @input="onInput"
    >``</ev-text-field>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '131231',
        type: 'text',
        placeholder: 'type something...',
        borderColor: '#dddee1',
      };
    },
    methods: {
      onInput(v) {
        console.log(v);
      },
    },
  };
</script>
<style scoped>
  div{
    display: inline-block;
  }
  p{
    margin-left: 30px;
  }
</style>
