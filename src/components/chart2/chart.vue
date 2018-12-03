<template>
  <div
    ref="wrapper"
    :style="wrapperStyle"
    class="ev-chart-wrapper"
  >
    <chart-title :title-prop="chartSize.title"/>
    <div
      ref="container"
      :style="containerStyle"
      class="ev-chart-container"
    >
      <div
        ref="inner"
        style="width: 100%; height: 100%;">
        <chart
          v-if="isMounted"
          :chart-prop="chartProp"
          :chart-size="chartSize"
          :chart-store="chartStore"
        />
      </div>
      <chart-legend :chart-store="chartStore"/>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash';
  import ChartTitle from './chart.title';
  import Chart from './charts/chart.line';
  import ChartLegend from './chart.legend';
  import ChartSplit from './chart.split';
  import ChartUtil from './core.util';
  import DataStore from './core/data/data';
  import { CHART_SIZE_OPTION, CHART_PROP_OPTION } from './core.constant';

  export default {
    components: {
      ChartTitle,
      Chart,
      ChartLegend,
      ChartSplit,
    },
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      options: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        normalized: {
          data: null,
          size: null,
          prop: null,
        },
        isMounted: false,
        store: null,
      };
    },
    computed: {
      sizeOption() {
        return _.pick(this.options, CHART_SIZE_OPTION);
      },
      propOption() {
        return _.pick(this.options, CHART_PROP_OPTION);
      },
      chartData() {
        return _.merge({}, this.normalized.data, this.data);
      },
      chartSize() {
        return _.merge({}, this.normalized.size, this.sizeOption);
      },
      chartProp() {
        return _.merge({}, this.normalized.prop, this.propOption);
      },
      wrapperStyle() {
        const size = this.chartSize;
        return {
          width: this.getSize(ChartUtil.quantity(size.width)),
          height: this.getSize(ChartUtil.quantity(size.height)),
        };
      },
      containerStyle() {
        const legendOption = this.chartSize.legend;
        const titleOption = this.chartSize.title;
        const legendShow = legendOption.show;
        const titleShow = titleOption.show;
        const legendPos = legendOption.position;
        const legendWidth = this.chartStore.getMaxSeriesWidth();
        const titleHeight = titleShow ? titleOption.style.height : 0;
        const legendHeight = legendShow ? 50 : 0;
        let padding = '0 0 0 0';


        if (legendShow) {
          switch (legendPos) {
            case 'top':
              padding = `${legendHeight + titleHeight}px 0 0 0`;
              break;
            case 'left':
              padding = `${titleHeight}px 0 0 ${legendWidth}px`;
              break;
            case 'bottom':
              padding = `${titleHeight} 0 ${legendHeight}px 0`;
              break;
            case 'right':
            default:
              padding = `${titleHeight}px ${legendWidth}px 0 0`;
              break;
          }
        }

        return {
          position: 'relative',
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
          padding,
        };
      },
      chartStore() {
        this.store.updateProperties({
          chartData: this.chartData,
          chartProp: this.chartProp,
        });
        this.store.updateData();
        return this.store;
      },
    },
    created() {
      const initChartOption = this.initChartOption(this.options);

      this.normalized.size = initChartOption.size;
      this.normalized.prop = initChartOption.prop;
      this.normalized.data = this.initChartData();

      this.store = new DataStore({
        chartData: this.normalized.data,
        chartProp: this.normalized.prop,
      });

      this.store.init();
    },
    mounted() {
      this.$nextTick(() => { this.isMounted = true; });
    },
    methods: {
      initChartOption() {
        const defaultSizeOption = {
          width: '100%',
          height: '100%',
          title: {
            show: false,
            text: '',
            style: {
              height: 40,
              fontSize: 15,
              color: '#000',
              fontFamily: 'Droid Sans',
            },
          },
          legend: {
            show: true,
            position: 'right',
            color: '#000',
            inactive: '#aaa',
          },
        };

        const defaultPropOption = {
          colors: [
            '#2b99f0', '#8ac449', '#00C4C5', '#ffde00', '#ff7781', '#8470ff', '#75cd8e',
            '#48d1cc', '#fec64f', '#fe984f', '#0052ff', '#00a48c', '#83cfde', '#dfe32d',
            '#ff7d40', '#99c7ff', '#a5fee3', '#0379c9', '#eef093', '#ffa891', '#00c5cd',
            '#009bc7', '#cacaff', '#ffc125', '#df6264',
          ],
          padding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
          },
          border: 2,
          itemHighlight: true,
          seriesHighlight: true,
          useSelect: false,
          doughnutHoleSize: 0,
          reverse: false,
          bufferSize: null,
          horizontal: false,
          thickness: 1,
          useTooltip: true,
          useSelectionData: false,
        };

        return {
          size: _.merge({}, defaultSizeOption, this.sizeOption),
          prop: _.merge({}, defaultPropOption, this.propOption),
        };
      },
      initChartData() {
        return _.merge({}, { series: {}, groups: [], data: {} }, this.data);
      },
      getSize(size) {
        let sizeValue = '100%';

        if (size) {
          sizeValue = size.unit ? size.value + size.unit : `${size.value}px`;
        }

        return sizeValue;
      },
      updateChartOptions(newOpt) {
        const keys = Object.keys(newOpt);
        for (let ix = 0; ix < keys.length; ix++) {
          const opt = this.options[keys[ix]];

          if (typeof opt === 'object') {
            this.options[keys[ix]] = _.merge({}, this.options[keys[ix]], newOpt[keys[ix]]);
          } else {
            this.options[keys[ix]] = newOpt[keys[ix]];
          }
        }
      },
      addAxisData(axisType, data) {
        const chartData = this.data.data;
        if (chartData[axisType]) {
          chartData[axisType].push(data);
        }
      },
      addGraphData(seriesId, data) {
        const chartData = this.data.data;
        if (chartData[seriesId]) {
          chartData[seriesId].push(data);
        }
      },
      addDataSet(dataSet) {
        const chartData = this.data.data;
        const keys = Object.keys(dataSet);
        for (let ix = 0; ix < keys.length; ix++) {
          if (chartData[keys[ix]]) {
            chartData[keys[ix]].push(dataSet[keys[ix]]);
          }
        }
      },
    },
  };
</script>
<style scoped>
  .ev-chart-wrapper {
    position: relative;
  }
</style>
