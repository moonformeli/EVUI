<template>
  <div style="position: relative;">
    <canvas
      ref="display"
      :width="width"
      :height="height"
      class="ev-chart-canvas-display"
    />
    <canvas
      ref="overlay"
      :width="width"
      :height="height"
      class="ev-chart-canvas-overlay"
    />
  </div>
</template>
<script>
  import _ from 'lodash';
  import moment from 'moment';
  import ChartUtil from '../core.util';
  import AxisAutoScale from '../core/axis/axis.scale.auto';
  import AxisFixedScale from '../core/axis/axis.scale.fixed';

  export default {
    props: {
      chartProp: {
        type: Object,
        default() {
          return {};
        },
      },
      chartSize: {
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
        displayCanvas: null,
        displayCtx: null,
        bufferCanvas: null,
        bufferCtx: null,
        overlayCanvas: null,
        overlayCtx: null,
        labelOffset: { top: 2, left: 2, right: 2, bottom: 2 },
        devicePixelRatio: window.devicePixelRatio,
      };
    },
    computed: {
      chartRect() {
        return this.getChartRect();
      },
      width() {
        return this.chartRect.width * this.pixelRatio;
      },
      height() {
        return this.chartRect.height * this.pixelRatio;
      },
      pixelRatio() {
        if (!this.displayCtx) {
          return 1;
        }

        const backingStoreRatio =
          this.displayCtx.webkitBackingStorePixelRatio ||
          this.displayCtx.mozBackingStorePixelRatio ||
          this.displayCtx.msBackingStorePixelRatio ||
          this.displayCtx.oBackingStorePixelRatio ||
          this.displayCtx.backingStorePixelRatio || 1;

        return this.devicePixelRatio / backingStoreRatio;
      },
      xMinMax() {
        return this.chartStore.getXMinMax();
      },
      yMinMax() {
        return this.chartStore.getYMinMax();
      },
      seriesList() {
        return this.chartStore.getSeriesList();
      },
      graphData() {
        return this.chartStore.getGraphData();
      },
      groups() {
        return this.chartStore.getGroups();
      },
    },
    watch: {
      chartStore: {
        handler() {
          console.log('%c watch store handler', 'color:cyan');
          this.redraw();
        },
        deep: true,
      },
    },
    created() {
      this.setAxesOptions();

      this.bufferCanvas = document.createElement('canvas');
      this.bufferCtx = this.bufferCanvas.getContext('2d');
    },
    mounted() {
      this.displayCanvas = this.$refs.display;
      this.displayCtx = this.displayCanvas.getContext('2d');
      this.overlayCanvas = this.$refs.overlay;
      this.overlayCtx = this.overlayCanvas.getContext('2d');
      this.bufferCanvas.width = this.width;
      this.bufferCanvas.height = this.height;
      this.bufferCtx = this.displayCanvas.getContext('2d');
      this.drawChart();
    },
    updated() {
      console.log('%c chart base updated', 'color:yellow');
      this.redraw();
    },
    methods: {
      redraw() {
        console.log('%c redraw', 'color:orange');
        this.setAxesOptions();
        this.clearDraw();
        this.drawChart();
      },
      getChartRect() {
        const option = { prop: this.chartProp, size: this.chartSize };

        const padding = option.prop.padding;
        const parentDOM = this.$parent.$refs.inner;

        const width = parentDOM.offsetWidth;
        const height = parentDOM.offsetHeight;

        const chartWidth = width - (padding.left + padding.right);
        const chartHeight = height - (padding.top + padding.bottom);

        const x1 = padding.left;
        const x2 = Math.max(width - padding.right, x1 + 1);
        const y1 = padding.top;
        const y2 = Math.max(height - padding.bottom, y1 + 1);

        return {
          x1,
          x2,
          y1,
          y2,
          padding,
          chartWidth,
          chartHeight,
          width,
          height,
        };
      },
      getPadding(padding) {
        return typeof padding === 'number' ? {
          top: padding,
          right: padding,
          bottom: padding,
          left: padding,
        } : {
          top: padding.top,
          right: padding.right,
          bottom: padding.bottom,
          left: padding.left,
        };
      },
      setAxesOptions() {
        const paramXAxes = this.chartProp.xAxes;
        const paramYAxes = this.chartProp.yAxes;
        const type = this.chartProp.type;
        const hasGroup = !!this.groups.length;

        const defaultXAxis = {
          position: 'bottom',
          min: null,
          max: null,
          autoScaleRatio: null,
          isSetMinZero: type === 'bar' || hasGroup,
          showGrid: false,
          axisLineColor: '#b4b6ba',
          gridLineColor: '#e7e9ed',
          labelIndicatorColor: '#e7e9ed',
          gridLineWidth: 1,
          ticks: null,
          timeFormat: null,
          tickSize: null,
          range: null,
          labelHeight: 20,
          labelStyle: {
            fontSize: 12,
            color: '#333',
            fontFamily: 'Droid Sans',
          },
        };

        const defaultYAxis = {
          position: 'left',
          min: null,
          max: null,
          autoScaleRatio: null,
          isSetMinZero: type === 'bar' || hasGroup,
          showGrid: true,
          axisLineColor: '#b4b6ba',
          gridLineColor: '#e7e9ed',
          labelIndicatorColor: '#e7e9ed',
          gridLineWidth: 1,
          ticks: null,
          timeFormat: null,
          tickSize: null,
          range: null,
          labelWidth: null,
          labelStyle: {
            fontSize: 12,
            color: '#333',
            fontFamily: 'Droid Sans',
          },
        };

        if (paramXAxes) {
          for (let ix = 0, ixLen = paramXAxes.length; ix < ixLen; ix++) {
            paramXAxes[ix] = _.merge({}, defaultXAxis, paramXAxes[ix]);
          }
        } else {
          this.chartProp.xAxes = [defaultXAxis];
        }

        if (paramYAxes) {
          for (let ix = 0, ixLen = paramYAxes.length; ix < ixLen; ix++) {
            paramYAxes[ix] = _.merge({}, defaultYAxis, paramYAxes[ix]);
          }
        } else {
          this.chartProp.yAxes = [defaultYAxis];
        }
      },
      setLabelOffset() {
        let labelText;
        let labelSize;

        const labelBuffer = 20;
        const xAxes = this.chartProp.xAxes;
        const yAxes = this.chartProp.yAxes;

        const ctx = this.bufferCtx;
        const xMinMax = this.xMinMax;
        const yMinMax = this.yMinMax;

        // 축의 Label 길이 중 가장 큰 value를 기준으로 label offset을 계산.
        // label offset의 buffer size 20px
        for (let ix = 0, ixLen = yAxes.length; ix < ixLen; ix++) {
          ctx.font = ChartUtil.getLabelStyle(yAxes[ix]);

          if (yAxes[ix].timeFormat !== null) {
            labelText = `${moment(yMinMax[ix].max).format(yAxes[ix].timeFormat)}`;
          } else {
            labelText = `${yMinMax[ix].max}`;
          }

          labelSize = Math.ceil(this.bufferCtx.measureText(labelText).width) || 0;

          if (yAxes[ix].position === 'left') {
            if (labelSize > this.labelOffset.left) {
              this.labelOffset.left = labelSize + labelBuffer;
            }
          } else if (yAxes[ix].position === 'right') {
            if (labelSize > this.labelOffset.right) {
              this.labelOffset.right = labelSize + labelBuffer;
            }
          }
        }

        for (let ix = 0, ixLen = xAxes.length; ix < ixLen; ix++) {
          ctx.font = ChartUtil.getLabelStyle(xAxes[ix]);

          if (xAxes[ix].timeFormat !== null) {
            labelText = `${moment(xMinMax[ix].max).format(xAxes[ix].timeFormat)}`;
          } else {
            labelText = `${xMinMax[ix].max}`;
          }

          labelSize = Math.ceil(this.bufferCtx.measureText(labelText).width) || 0;

          if (Math.round(labelSize / 2) > this.labelOffset.right) {
            this.labelOffset.right = Math.round(labelSize / 2) + labelBuffer;
          }

          if (Math.round(labelSize / 2) > this.labelOffset.left) {
            this.labelOffset.left = Math.round(labelSize / 2) + labelBuffer;
          }

          labelSize = this.chartProp.xAxes[ix].labelStyle.fontSize * 2 || 2;
          if (xAxes[ix].position === 'bottom') {
            if (labelSize > this.labelOffset.bottom) {
              this.labelOffset.bottom = labelSize;
            }
          } else if (xAxes[ix].position === 'top') {
            if (labelSize > this.labelOffset.top) {
              this.labelOffset.top = labelSize;
            }
          }
        }
      },
      createAxis() {
        let xAxisObj;
        let yAxisObj;

        this.xAxes = [];
        this.yAxes = [];

        for (let ix = 0, ixLen = this.chartProp.xAxes.length; ix < ixLen; ix++) {
          switch (this.chartProp.xAxes[ix].scaleType) {
            case 'fix':
              xAxisObj = new AxisFixedScale({
                type: 'x',
                chartRect: this.chartRect,
                options: this.chartProp.xAxes[ix],
                ctx: this.bufferCtx,
                labelOffset: this.labelOffset,
              });
              break;
            // case 'step':
            //   xAxisObj = new AxisStepsScale({
            //     type: 'x',
            //     chartRect: this.chartRect,
            //     options: this.options.xAxes[ix],
            //     ctx: this.bufferCtx,
            //     labelOffset: this.labelOffset,
            //     axisData: this.axisList.x[ix] || [],
            //   });
            //   break;
            case 'auto':
            default:
              xAxisObj = new AxisAutoScale({
                type: 'x',
                chartRect: this.chartRect,
                options: this.chartProp.xAxes[ix],
                ctx: this.bufferCtx,
                labelOffset: this.labelOffset,
              });
              break;
          }

          this.xAxes.push(xAxisObj);
        }

        for (let ix = 0, ixLen = this.chartProp.yAxes.length; ix < ixLen; ix++) {
          switch (this.chartProp.yAxes[ix].scaleType) {
            case 'fix':
              yAxisObj = new AxisFixedScale({
                type: 'y',
                chartRect: this.chartRect,
                options: this.chartProp.yAxes[ix],
                ctx: this.bufferCtx,
                labelOffset: this.labelOffset,
              });
              break;
            // case 'step':
            //   yAxisObj = new AxisStepsScale({
            //     type: 'y',
            //     chartRect: this.chartRect,
            //     options: this.options.yAxes[ix],
            //     ctx: this.bufferCtx,
            //     labelOffset: this.labelOffset,
            //     axisData: this.axisList.y[ix] || [],
            //   });
            //   break;
            case 'auto':
            default:
              yAxisObj = new AxisAutoScale({
                type: 'y',
                chartRect: this.chartRect,
                options: this.chartProp.yAxes[ix],
                ctx: this.bufferCtx,
                labelOffset: this.labelOffset,
              });
              break;
          }

          this.yAxes.push(yAxisObj);
        }

        for (let ix = 0, ixLen = this.xAxes.length; ix < ixLen; ix++) {
          this.xAxes[ix].createAxis(this.xMinMax[ix]);
        }

        for (let ix = 0, ixLen = this.yAxes.length; ix < ixLen; ix++) {
          this.yAxes[ix].createAxis(this.yMinMax[ix]);
        }
      },
      createLine() {
        const groups = this.groups;
        const graphData = this.graphData;
        const skey = Object.keys(graphData);
        let series;

        if (groups.length) {
          for (let ix = 0, ixLen = groups.length; ix < ixLen; ix++) {
            const group = groups[ix];
            for (let jx = 0, jxLen = group.length; jx < jxLen; jx++) {
              series = this.seriesList[group[jx]];

              if (series.show) {
                // this.drawSeries(group[jx], graphData[group[jx]]);
              }
            }
          }
        }

        for (let ix = 0, ixLen = skey.length; ix < ixLen; ix++) {
          series = this.seriesList[skey[ix]];

          if (!series.isExistGrp && series.show) {
            // this.drawSeries(skey[ix], graphData[skey[ix]]);
          }
        }
      },
      calculateX(value, xAxisIndex, isReqSp) {
        const maxValue = this.xAxes[xAxisIndex].axisMax;
        const minValue = this.xAxes[xAxisIndex].axisMin;
        let convertValue;

        if (value === null) {
          return null;
        }

        if (this.chartProp.xAxes[xAxisIndex].labelType === 'time') {
          convertValue = +moment(value);
        } else {
          convertValue = value;
        }

        if (convertValue > maxValue || convertValue < minValue) {
          return null;
        }

        const sp = isReqSp ? this.chartRect.x1 + this.labelOffset.left : 0;
        const scalingFactor = this.drawingXArea() / (maxValue - minValue);
        return Math.ceil(sp + (scalingFactor * (convertValue - (minValue || 0))));
      },

      calculateY(value, yAxisIndex, invert) {
        const maxValue = this.yAxes[yAxisIndex].axisMax;
        const minValue = this.yAxes[yAxisIndex].axisMin;
        let convertValue;
        let calcY;

        if (value === null) {
          return null;
        }

        if (this.chartProp.yAxes[yAxisIndex].labelType === 'time') {
          convertValue = +moment(value);
        } else {
          convertValue = value;
        }

        if (convertValue > maxValue || convertValue < minValue) {
          return null;
        }
        // Bar차트의 fillRect처리를 위해 invert값 추가 하여 Y값을 처리
        const scalingFactor = this.drawingYArea() / (maxValue - minValue);
        if (invert) {
          calcY = -(scalingFactor * (convertValue - (minValue || 0)));
        } else {
          calcY = (this.chartRect.y2 - this.labelOffset.bottom) -
            (scalingFactor * (convertValue - (minValue || 0)));
        }

        return Math.floor(calcY);
      },

      calculateXP(point, xAxisIndex, isReqSp) {
        const maxValue = this.xAxes[xAxisIndex].axisMax;
        const minValue = this.xAxes[xAxisIndex].axisMin;
        let convertValue;

        if (point === null) {
          return null;
        }

        const sp = isReqSp ? this.chartRect.x1 + this.labelOffset.left : 0;
        const value = Math.ceil((((point - sp) * (maxValue - minValue)) /
          this.drawingXArea()) + minValue);


        if (this.attr.xAxes[xAxisIndex].labelType === 'time') {
          convertValue = +moment(value);
        } else {
          convertValue = value;
        }

        return convertValue;
      },

      calculateYP(point, yAxisIndex, invert) {
        const maxValue = this.yAxes[yAxisIndex].axisMax;
        const minValue = this.yAxes[yAxisIndex].axisMin;
        let convertValue;

        if (point === null) {
          return null;
        }
        const sp = this.chartRect.y1 + this.labelOffset.top;
        const value = Math.ceil((((point - sp) * (maxValue - minValue)) / this.drawingYArea()));


        if (this.attr.yAxes[yAxisIndex].labelType === 'time') {
          convertValue = +moment(value);
        } else {
          convertValue = value;
        }

        if (!invert) {
          convertValue = maxValue - convertValue;
        }

        return convertValue;
      },

      drawingXArea() {
        return this.chartRect.chartWidth - (this.labelOffset.left + this.labelOffset.right);
      },

      drawingYArea() {
        return this.chartRect.chartHeight - (this.labelOffset.top + this.labelOffset.bottom);
      },

      drawPoint(ctx, style, radius, x, y) {
        let edgeLength;
        let xOffset;
        let yOffset;
        let height;
        let size;

        if (isNaN(radius) || radius <= 0) {
          return;
        }

        let offset;
        let leftX;
        let topY;
        let sideSize;

        switch (style) {
          // Default includes circle
          case 'triangle':
            ctx.beginPath();
            edgeLength = (3 * radius) / Math.sqrt(3);
            height = (edgeLength * Math.sqrt(3)) / 2;
            ctx.moveTo(x - (edgeLength / 2), y + (height / 3));
            ctx.lineTo(x + (edgeLength / 2), y + (height / 3));
            ctx.lineTo(x, y - ((2 * height) / 3));
            ctx.closePath();
            ctx.fill();
            break;
          case 'rect':
            size = (1 / Math.SQRT2) * radius;
            ctx.beginPath();
            ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
            ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
            break;
          case 'rectRounded':
            offset = radius / Math.SQRT2;
            leftX = x - offset;
            topY = y - offset;
            sideSize = Math.SQRT2 * radius;
            ctx.beginPath();
            this.roundedRect(ctx, leftX, topY, sideSize, sideSize, radius / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 'rectRot':
            size = (1 / Math.SQRT2) * radius;
            ctx.beginPath();
            ctx.moveTo(x - size, y);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x, y - size);
            ctx.closePath();
            ctx.fill();
            break;
          case 'cross':
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.lineTo(x, y - radius);
            ctx.moveTo(x - radius, y);
            ctx.lineTo(x + radius, y);
            ctx.closePath();
            break;
          case 'crossRot':
            ctx.beginPath();
            xOffset = Math.cos(Math.PI / 4) * radius;
            yOffset = Math.sin(Math.PI / 4) * radius;
            ctx.moveTo(x - xOffset, y - yOffset);
            ctx.lineTo(x + xOffset, y + yOffset);
            ctx.moveTo(x - xOffset, y + yOffset);
            ctx.lineTo(x + xOffset, y - yOffset);
            ctx.closePath();
            break;
          case 'star':
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.lineTo(x, y - radius);
            ctx.moveTo(x - radius, y);
            ctx.lineTo(x + radius, y);
            xOffset = Math.cos(Math.PI / 4) * radius;
            yOffset = Math.sin(Math.PI / 4) * radius;
            ctx.moveTo(x - xOffset, y - yOffset);
            ctx.lineTo(x + xOffset, y + yOffset);
            ctx.moveTo(x - xOffset, y + yOffset);
            ctx.lineTo(x + xOffset, y - yOffset);
            ctx.closePath();
            break;
          case 'line':
            ctx.beginPath();
            ctx.moveTo(x - radius, y);
            ctx.lineTo(x + radius, y);
            ctx.closePath();
            break;
          case 'dash':
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + radius, y);
            ctx.closePath();
            break;
          default:
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.stroke();
      },
      clearDraw() {
        this.clearRectRatio = (this.pixelRatio < 1) ? this.pixelRatio : 1;

        this.displayCtx.clearRect(0, 0, this.displayCanvas.width / this.clearRectRatio,
          this.displayCanvas.height / this.clearRectRatio);
        this.bufferCtx.clearRect(0, 0, this.bufferCanvas.width / this.clearRectRatio,
          this.bufferCanvas.height / this.clearRectRatio);
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width / this.clearRectRatio,
          this.overlayCanvas.height / this.clearRectRatio);
      },
    },
  };
</script>
<style>
  .ev-chart-canvas-display {
    display: block;
  }

  .ev-chart-canvas-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
