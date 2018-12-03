<template>
  <div class="ev-chart-legend">
    <div
      v-for="item in seriesList"
      :key="item.id"
      class="ev-chart-legend-container">
      <span class="ev-chart-legend-color"/>
      <div class="ev-chart-legend-name">{{ item.name }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      options: {
        type: Object,
        default() {
          return {};
        },
      },
      chartStore: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        seriesName: null,
      };
    },
    computed: {
      seriesList() {
        return this.chartStore.getSeriesList();
      },
    },
    methods: {
    },
  };
</script>
<style scoped>
  .ev-chart-legend {
    position: absolute;
    width: 100px;
    height: 100%;
    top: 40px;
    right: 0;
    left: auto;
    padding: 0;
    overflow: auto;
  }

  .ev-chart-legend-container {
    position: relative;
    overflow: hidden;
    margin: 2px 10px 2px 0;
  }

  .ev-chart-legend-color {
    left: 0;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    margin-right: 6px;
    position: absolute;
    border-radius: 5px;
  }

  .ev-chart-legend-color.inactive {
    /*background-color: #555 !important;*/
  }

  .ev-chart-legend-name {
    float: left;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    margin-left: 16px;
    padding-right: 21px;
    width: 100%;
    /*color: #ABAEB5;*/
    user-select:none;
  }

  .ev-chart-legend-name.inactive {
    /*color: #555 !important;*/
  }
</style>
