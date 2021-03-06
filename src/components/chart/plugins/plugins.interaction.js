const module = {
  onMouseMoveEvent(e) {
    const offset = this.getMousePosition(e);
    const hitInfo = this.findHitItem(offset);
    const ctx = this.overlayCtx;
    const sId = hitInfo.hitId;
    this.overlayClear();

    if (sId) {
      this.seriesList[sId].itemHighlight(hitInfo.items[sId], ctx);
      const sizeInfo = this.setTooltipLayout(hitInfo, e, offset);
      this.drawTooltip(hitInfo, this.tooltipCtx, sizeInfo);
      this.tooltipDOM.style.display = 'block';
    } else {
      this.tooltipDOM.scrollTop = 0;
      this.tooltipDOM.style.display = 'none';
    }
  },
  getMousePosition(evt) {
    const e = evt.originalEvent || evt;
    const rect = this.overlayCanvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height];
  },
  findHitItem(offset) {
    const sIds = Object.keys(this.seriesList);
    const items = {};
    let hitId = null;
    let maxs = '';
    let maxv = '';
    let item = null;

    for (let ix = 0; ix < sIds.length; ix++) {
      const sId = sIds[ix];
      const series = this.seriesList[sId];

      item = series.findGraphData(offset, !!this.options.horizontal);
      if (item.data) {
        item.name = series.name;
        item.axis = { x: series.xAxisIndex, y: series.yAxisIndex };
        items[sId] = item;

        const g = item.data.b || item.data.y || 0;

        if (maxs.length < series.name.length) {
          maxs = series.name;
        }

        if (maxv.length < `${g}`.length) {
          maxv = `${g}`;
        }

        if (item.hit) {
          hitId = sId;
        }
      }
    }

    return { items, hitId, maxTip: [maxs, maxv] };
  },
  findHitItem2(offset) {
    const mouseX = offset[0];
    const mouseY = offset[1];

    const width = this.chartRect.chartWidth;
    const height = this.chartRect.chartHeight;
    const centerX = (width / 2) + this.chartRect.padding.left;
    const centerY = (height / 2) + this.chartRect.padding.top;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    let angle;
    angle = ((Math.atan2(-dy, -dx) * 180) / Math.PI) - 90;
    angle = angle < 0 ? 360 + angle : angle;
    const rad = ((angle * Math.PI) / 180) + (1.5 * Math.PI);
    const distance = Math.round(Math.sqrt((dx ** 2) + (dy ** 2)));

    const graphData = this.graphData;
    let gdata;
    let dsIndex = null;
    let sId = null;

    for (let ix = 0, ixLen = graphData.length; ix < ixLen; ix++) {
      gdata = graphData[ix];
      if (distance > gdata.ir && distance < gdata.or) {
        dsIndex = ix;
      }
    }

    if (graphData[dsIndex]) {
      for (let ix = 0, ixLen = graphData[dsIndex].data.length; ix < ixLen; ix++) {
        gdata = graphData[dsIndex].data[ix];

        if (rad > gdata.sa && rad < gdata.ea) {
          sId = gdata.id;
        }
      }
    }

    return { dsIndex, sId };
  },
};

export default module;
