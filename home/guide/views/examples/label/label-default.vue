<template>
  <div>
    <div
      class="label-demo"
    >
      <ev-label
        :value="labelValue"
        :size="'medium'"
        :user-cls="'test'"
      >``</ev-label>
      <ev-label
        :ref="'label1'"
        :value="labelValue"
        :size="'large'"
      >``</ev-label>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        width: '40%',
        height: '100%',
        labelValue: 'Test Label Value',
      };
    },
    mounted() {
      // this.timer = setTimeout(() => { this.updateData(); }, 3000);
    },
    methods: {
      updateData() {
        this.labelValue = 'Updated Label Value';

        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
    },
  };
</script>
<style scoped>
  .ev-label.test {
    font-size: 50px;
  }
</style>
