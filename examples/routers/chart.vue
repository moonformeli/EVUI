<template>
  <div style="width: 100%; height: 100%; display: block;">
    <line-chart/>
  </div>
</template>
<script>
  import LineChart from './charts/chart.line';

  export default {
    components: {
      LineChart,
    },
    data() {
      return {
      };
    },
  };
</script>
<style>
</style>
