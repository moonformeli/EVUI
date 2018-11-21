<template>
  <div
    v-show="isShow"
    :style="titleStyle"
    class="ev-chart-title"
  >{{ titleText }}</div>
</template>
<script>
  export default {
    props: {
      titleProp: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    computed: {
      titleText() {
        return this.titleProp.text;
      },
      isShow() {
        return this.titleProp.show;
      },
      titleStyle() {
        return {
          height: `${this.titleProp.style.height}px`,
          lineHeight: `${this.titleProp.style.height}px`,
          fontSize: this.titleProp.style.fontSize,
          color: this.titleProp.style.color,
        };
      },
    },
    methods: {
    },
  };
</script>
<style scoped>
  .ev-chart-title {
    position: absolute;
    top: 0;
    width: 100%;
    padding-left: 10px;
    word-wrap: normal;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
  }
</style>
