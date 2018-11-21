<template>
  <div/>
</template>
<script>
  export default {
    props: {
    },
    data() {
      return {
      };
    },
    computed: {
    },
    methods: {
    },
  };
</script>
<style scoped>
  .ev-chart-resize-bar {
    position: absolute;
    width: 4px;
    height: 100%;
    cursor: col-resize;
    background-color: transparent;
    opacity: 0.5;
    z-index: 1;
  }

  .ev-chart-resize-bar:hover {
    background-color: #e2e2e2;
  }

  .ev-chart-resize-ghost {
    position: absolute;
    width: 4px;
    height: 100%;
    cursor: col-resize;
    opacity: 0.5;
    background-color: #e2e2e2;
  }

  .ev-chart-resize-ghost.horizontal {
    width: 100%;
    height: 4px;
    cursor: row-resize;
  }

</style>
