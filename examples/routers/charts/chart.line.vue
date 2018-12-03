<template>
  <chart
    ref="defaultChart"
    :data="defaultData"
    :options="lineOptions"
  />
</template>
<script>
  import chart from '@/components/chart2';

  export default {
    components: {
      chart,
    },
    data() {
      return {
        defaultData: {
          series: {
            series1: { name: 'series#1123123', show: true, type: 'line', fill: true, point: true },
            series2: { name: 'series#2', show: true, type: 'line', fill: true, point: true },
            series3: { name: 'series#3', show: true, type: 'line', fill: true, point: true },
          },
          groups: [
            ['series1', 'series3'],
          ],
          data: {
            x: ['2017/01/01 00:00:00', '2017/01/01 00:01:00', '2017/01/01 00:02:00',
              '2017/01/01 00:03:00', '2017/01/01 00:04:00'],
            series1: [100, 150, 50, 200, 350],
            series2: [200, 100, null, 300, 400],
            series3: [150, 0, 0, 350, 450],
          },
        },
        lineOptions: {
          type: 'line',
          width: '100%',
          height: '100%',
          title: {
            text: 'Title Test',
            show: true,
          },
          thickness: 0.8,
          legend: {
            show: true,
            position: 'right',
          },
          horizontal: false,
          xAxes: [{
            scaleType: 'fix',
            labelType: 'time',
            interval: 'minute',
            timeFormat: 'HH:mm:ss',
            showGrid: true,
          }],
          yAxes: [{
            scaleType: 'auto',
            labelType: 'linear',
            autoScaleRatio: 0.1,
            showGrid: true,
          }],
        },
      };
    },
    mounted() {
      // this.interval = setTimeout(() => this.updateData(), 2000);
      // this.interval2 = setTimeout(() => this.updateData2(), 4000);
      // this.interval3 = setTimeout(() => this.updateData3(), 6000);
      // this.interval4 = setTimeout(() => this.updateData4(), 8000);
      // this.interval5 = setTimeout(() => this.updateData5(), 10000);
    },
    methods: {
      updateData() {
        this.$refs.defaultChart.updateChartOptions({
          title: {
            text: 'Update Title',
            style: {
              color: '#0BA',
            },
          },
          width: '40%',
        });

        if (this.interval) {
          clearTimeout(this.interval);
        }
      },
      updateData2() {
        this.lineOptions.title.text = 'Update Title 2';
        this.lineOptions.title.style = { color: '#F00' };
        this.lineOptions.width = '30%';

        if (this.interval2) {
          clearTimeout(this.interval2);
        }
      },
      updateData3() {
        this.$refs.defaultChart.addAxisData('x', '2017-01-01 00:05:00');
        this.$refs.defaultChart.addGraphData('series2', 1000);

        if (this.interval3) {
          clearTimeout(this.interval3);
        }
      },
      updateData4() {
        this.$refs.defaultChart.addDataSet({
          x: '2017/01/01 00:06:00',
          series3: 300,
        });

        if (this.interval4) {
          clearTimeout(this.interval4);
        }
      },
      updateData5() {
        this.lineOptions.title.show = false;

        if (this.interval5) {
          clearTimeout(this.interval5);
        }
      },
    },
  };
</script>
<style>
</style>
