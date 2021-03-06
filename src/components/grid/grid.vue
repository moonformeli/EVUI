<template>
  <div
    v-resize="onResize"
    v-cloak
    :class="getTableClass"
  >
    <div
      ref="header"
      class="table-header"
    >
      <ul class="column-list">
        <li
          v-if="useCheckbox.use"
          style="width: 30px;"
          class="column"
        >
          <ev-checkbox
            v-if="isHeaderCheckBox"
            v-model="isHeaderChecked"
            :type="`square`"
            @on-click="onCheckAll"
          />
        </li>
        <li
          v-for="(column, index) in orderedColumns"
          v-show="!column.hide"
          :key="index"
          :style="`width: ${column.width}px;`"
          class="column"
          @click="onSort(column.field)"
        >
          <span class="column-name">{{ column.caption }}</span>
          <ev-icon
            :cls="'ei-s ei-s-arrow-down'"
            style="margin: 3px 0 0 0; font-size: 12px;"
          />
          <span
            class="column-option"
            @click.stop.prevent="onClickOption($event, column.field, index)"
          >
            <ev-icon
              :cls="'ei-s ei-s-arrow-down'"
              style="margin: 3px 0 0 0; font-size: 12px;"
            />
          </span>
        </li>
        <div class="column dummy"/>
      </ul>
    </div>
    <div
      ref="body"
      class="table-body"
      @scroll="onScroll"
    >
      <div
        :style="`height: ${vScrollTopHeight}px;`"
        class="vscroll-spacer"
      />
      <table>
        <tbody>
          <tr
            v-for="(row, rowIndex) in viewStore"
            :key="rowIndex"
            :class="row[2] === selected ? 'selected' : ''"
            @click="onRowClick($event, row)"
          >
            <td
              v-if="useCheckbox.use"
              style="width: 30px;"
            >
              <ev-checkbox
                v-model="row[1]"
                :type="`square`"
                @on-click="onCheck($event, row)"
                @click.native.stop=""
              />
            </td>
            <td
              v-for="(column, viewIndex) in orderedColumns"
              v-show="!column.hide"
              :key="viewIndex"
              :data-name="column.field"
              :data-index="column.index"
              :style="
              `width: ${column.width}px; height: ${rowHeight}px; line-height: ${rowHeight}px`"
            >
              {{ row[2][column.index] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        :style="`height: ${vScrollBottomHeight}px;`"
        class="vscroll-spacer"
      />
    </div>
    <TableFilter
      v-if="showColumnOption"
      v-model="filterCondition"
      :show.sync="showColumnOption"
      @sort="onSort"
    />
  </div>
</template>
<script>
  import resize from 'vue-resize-directive';
  import _ from 'lodash-es';
  import TableFilter from './grid.filter';

  const ROW_INDEX = 0;
  const ROW_CHECK_INDEX = 1;
  const ROW_DATA_INDEX = 2;

  export default {
    name: 'EvTableNew',
    directives: {
      resize,
    },
    components: {
      TableFilter,
    },
    props: {
      columns: {
        type: Array,
        default: () => [],
      },
      rows: {
        type: Array,
        default: () => [],
      },
      selected: {
        type: Array,
        default: () => [],
      },
      checked: {
        type: Array,
        default: () => [],
      },
      option: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        originStore: [],
        filteredStore: [],
        viewStore: [],
        orderedColumns: [],
        sortOrder: 'desc',
        sortField: '',
        adjust: this.option.adjust || false,
        useSelect: this.option.useSelect || true,
        useCheckbox: this.option.useCheckbox || {},
        rowHeight: this.option.rowHeight || 24,
        columnWidth: this.option.columnWidth || 80,
        lastScroll: {},
        vScrollTopHeight: 0,
        vScrollBottomHeight: 0,
        hasVerticalScrollBar: false,
        showColumnOption: false,
        sortList: {},
        filterList: {},
        filterCondition: {},
        checkedRows: this.checked.map(item => item),
        prevCheckedRow: [],
        isHeaderChecked: false,
      };
    },
    computed: {
      getTableClass() {
        return {
          table: true,
          adjust: this.adjust,
          'v-scroll': this.hasVerticalScrollBar,
        };
      },
      useFilter() {
        let result = false;
        const columns = Object.keys(this.filterList || {});

        for (let ix = 0; ix < columns.length; ix++) {
          if (this.filterList[columns[ix]].use) {
            result = true;
            break;
          }
        }

        return result;
      },
      isHeaderCheckBox() {
        const option = this.useCheckbox;

        return option.use && option.headerCheck && option.mode !== 'single';
      },
    },
    watch: {
      rows(value) {
        this.setStore(value);
      },
      filterCondition: {
        deep: true,
        handler(value) {
          this.$set(this.filterList, value.field, value);
          this.filteredStore.length = 0;

          if (this.useFilter) {
            this.setFilter();
          }

          this.updateVScroll();
        },
      },
    },
    created() {
      this.orderedColumns = this.columns.map((column, index) => ({ index, ...column }));
    },
    mounted() {
      this.calculatedColumn();
      this.setStore(this.rows);
      this.$forceUpdate();
    },
    methods: {
      getColumnName(field) {
        return this.columns.find(column => column.field === field).caption;
      },
      getColumnIndex(field) {
        return this.columns.findIndex(column => column.field === field);
      },
      calculatedColumn() {
        let columnWidth = this.columnWidth;
        let remainWidth = 0;
        if (this.adjust) {
          const el = this.$refs.body;
          let elWidth = el.clientWidth;
          const elHeight = el.clientHeight;
          const result = this.orderedColumns.reduce((acc, column) => {
            if (column.hide) {
              return acc;
            }

            if (column.width) {
              acc.totalWidth += column.width;
            } else {
              acc.emptyCount++;
            }

            return acc;
          }, { totalWidth: 0, emptyCount: 0 });

          if (this.rowHeight * this.rows.length > elHeight) {
            elWidth += 17;
          }

          columnWidth = elWidth - result.totalWidth;
          if (columnWidth > 0) {
            remainWidth = columnWidth -
              (Math.floor(columnWidth / result.emptyCount) * result.emptyCount);
            columnWidth = Math.floor(columnWidth / result.emptyCount);
          } else {
            columnWidth = this.columnWidth;
          }

          columnWidth = columnWidth < 40 ? 40 : columnWidth;
          this.columnWidth = columnWidth;
        }

        this.orderedColumns.map((column) => {
          const item = column;
          if (!item.width && !item.hide) {
            item.width = columnWidth;
          }
          return item;
        });

        if (remainWidth) {
          this.orderedColumns[this.orderedColumns.length - 1].width += remainWidth;
        }
      },
      setSort() {
        const index = this.getColumnIndex(this.sortField);
        const desc = (a, b) => (a > b ? -1 : 1);
        const asc = (a, b) => (a < b ? -1 : 1);
        const type = this.columns[index].type || 'string';
        const sortFn = this.sortOrder === 'desc' ? desc : asc;

        if (type === 'string') {
          this.originStore.sort((a, b) => sortFn(a[ROW_DATA_INDEX][index].toLowerCase(),
            b[ROW_DATA_INDEX][index].toLowerCase()));
        } else {
          this.originStore.sort((a, b) => sortFn(a[ROW_DATA_INDEX][index],
            b[ROW_DATA_INDEX][index]));
        }
      },
      likeSearch(search, origin) {
        if (typeof search !== 'string' || origin === null) {
          return false;
        }

        let regx = search.replace(new RegExp('([\\.\\\\\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-])', 'g'), '\\$1');
        regx = regx.replace(/%/g, '.*').replace(/_/g, '.');

        return RegExp(`^${regx}$`, 'gi').test(origin);
      },
      stringFilter(item, condition) {
        const type = condition.type;
        const value = condition.value;
        const index = condition.index;
        let result;

        if (type === 'equal') {
          result = item[ROW_DATA_INDEX][index] === value;
        } else if (type === 'notEqual') {
          result = item[ROW_DATA_INDEX][index] !== value;
        } else if (type === 'like') {
          result = this.likeSearch(`%${value}%`, item[ROW_DATA_INDEX][index]);
        } else if (type === 'notLike') {
          result = !this.likeSearch(`%${value}%`, item[ROW_DATA_INDEX][index]);
        }

        return result;
      },
      numberFilter(item, condition) {
        const type = condition.type;
        const value = condition.value;
        const index = condition.index;
        let result;

        if (type === 'equal') {
          result = item[ROW_DATA_INDEX][index] === value;
        } else if (type === 'greaterThan') {
          result = item[ROW_DATA_INDEX][index] > value;
        } else if (type === 'lessThan') {
          result = item[ROW_DATA_INDEX][index] < value;
        }

        return result;
      },
      getFilteredData(data, filterType, condition) {
        const filterFn = filterType === 'string' ? this.stringFilter : this.numberFilter;
        const filteredData = [];

        for (let ix = 0; ix < data.length; ix++) {
          if (filterFn(data[ix], condition)) {
              filteredData.push(data[ix]);
          }
        }

        return filteredData;
      },
      setFilter() {
        let filteredStore = [];
        let field;
        let index;
        let filter;
        let columnType;
        const fields = Object.keys(this.filterList || {});
        const store = this.originStore;

        for (let ix = 0; ix < fields.length; ix++) {
          field = fields[ix];
          filter = this.filterList[field];
          index = this.getColumnIndex(field);
          columnType = this.columns[index].type;
          if (filter.use && filter.conditions.length) {
            for (let jx = 0; jx < filter.conditions.length; jx++) {
              if (filter.conditions[jx].use) {
                if (!filteredStore.length) {
                  filteredStore = this.getFilteredData(store, columnType, {
                      ...filter.conditions[jx],
                      index,
                  });
                } else if (filter.method === 'or') {
                  filteredStore.push(...this.getFilteredData(store, columnType, {
                      ...filter.conditions[jx],
                      index,
                  }));
                } else {
                  filteredStore = this.getFilteredData(filteredStore, columnType, {
                      ...filter.conditions[jx],
                      index,
                  });
                }
              }
            }
          }
        }

        this.filteredStore = _.uniqBy(filteredStore, JSON.stringify);
      },
      setStore(value, makeIndex = true) {
        const store = [];
        let checked;

        if (makeIndex) {
          for (let ix = 0; ix < value.length; ix++) {
            checked = this.checked.findIndex(item => item === value[ix]) !== -1;
            store.push([ix, checked, value[ix]]);
          }
        }

        this.originStore = store;

        if (this.sortField) {
          this.setSort();
        }

        if (this.useFilter) {
          this.setFilter();
        }

        this.updateVScroll();
      },
      updateHScroll() {
        const headerEl = this.$refs.header;
        const bodyEl = this.$refs.body;

        headerEl.scrollLeft = bodyEl.scrollLeft;
      },
      updateVScroll() {
        const el = this.$refs.body;
        const offset = 5;
        const rowHeight = this.rowHeight;
        const rowCount = Math.ceil(el.clientHeight / rowHeight);
        const store = this.useFilter ? this.filteredStore : this.originStore;
        const totalScrollHeight = store.length * rowHeight;
        const firstVisibleIndex = Math.floor(el.scrollTop / rowHeight);
        const lastVisibleIndex = firstVisibleIndex + rowCount;
        const firstIndex = Math.max(firstVisibleIndex - offset, 0);
        const lastIndex = lastVisibleIndex + offset;

        this.hasVerticalScrollBar = rowCount < this.originStore.length;
        this.viewStore = store.slice(firstIndex, lastIndex);

        this.vScrollTopHeight = firstIndex * rowHeight;
        this.vScrollBottomHeight = totalScrollHeight - (this.viewStore.length * rowHeight)
          - this.vScrollTopHeight;
      },
      unCheckedRow(row) {
        const index = this.originStore.findIndex(item => item === row);

        if (index !== -1) {
          this.$set(this.originStore, index, row);
        }
      },
      onSort(field) {
        if (this.sortField === field) {
          this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        } else {
          this.sortField = field;
          this.sortOrder = 'desc';
        }

        this.setStore(this.originStore, false);
      },
      onScroll() {
        const el = this.$refs.body;
        const scrollTop = el.scrollTop;
        const scrollLeft = el.scrollLeft;
        const lastTop = this.lastScroll.top;
        const lastLeft = this.lastScroll.left;
        const isHorizontal = !(scrollLeft === lastLeft);
        const isVertical = !(scrollTop === lastTop);

        if (isVertical) {
          this.updateVScroll();
        }

        if (isHorizontal) {
          this.updateHScroll();
        }

        this.lastScroll.top = scrollTop;
        this.lastScroll.left = scrollLeft;
      },
      onClickOption(e, field, index) {
        if (this.showColumnOption) {
            this.showColumnOption = false;
            return;
        }

        const rect = e.currentTarget.parentElement.getBoundingClientRect();
        const top = rect.height;
        const left = (rect.width * (index + 1)) - 12;
        let condition = this.filterList[field];

        if (!condition) {
          condition = {
            use: false,
            method: 'or',
            type: this.orderedColumns[index].type || 'string',
            conditions: [],
            field,
          };
        }

        condition.field = field;
        condition.top = top;
        condition.left = left;

        this.filterCondition = condition;
        this.showColumnOption = true;
      },
      onRowClick(event, row) {
        if (!this.useSelect) {
          return;
        }

        const cellInfo = event.target.dataset;
        const rowData = row[ROW_DATA_INDEX];

        this.$emit('update:selected', rowData);
        this.$emit('click-row', event, row[ROW_INDEX], cellInfo.name, cellInfo.index, rowData);
      },
      onCheck(event, row) {
        if (this.useCheckbox.mode === 'single' && this.prevCheckedRow.length) {
          this.prevCheckedRow[1] = false;
          this.unCheckedRow(this.prevCheckedRow);
        }

        if (row[ROW_CHECK_INDEX]) {
          if (this.useCheckbox.mode === 'single') {
            this.checkedRows = [row[ROW_DATA_INDEX]];
          } else {
            this.checkedRows.push(row[ROW_DATA_INDEX]);
          }

          if (this.checkedRows.length === this.originStore.length) {
            this.isHeaderChecked = true;
          }
        } else {
          if (this.isHeaderChecked) {
            this.isHeaderChecked = false;
          }

          if (this.useCheckbox.mode === 'single') {
            this.checkedRows = [];
          } else {
            this.checkedRows.splice(this.checkedRows.indexOf(row[ROW_DATA_INDEX]), 1);
          }
        }

        this.prevCheckedRow = row;
        this.$emit('update:checked', this.checkedRows);
        this.$emit('check-one', event, row[ROW_INDEX], row[ROW_DATA_INDEX]);
      },
      onCheckAll(event) {
        const status = this.isHeaderChecked;
        const checked = [];
        let item;

        for (let ix = 0; ix < this.originStore.length; ix++) {
          item = this.originStore[ix];
          if (status) {
            checked.push(item);
          }

          item[ROW_CHECK_INDEX] = status;
        }

        this.checkedRows = checked;
        this.$emit('update:checked', checked);
        this.$emit('check-all', event, checked);
        this.$forceUpdate();
      },
      onResize() {
        this.orderedColumns.map((column) => {
          const item = column;

          item.width = 0;

          return item;
        });

        this.calculatedColumn();
        this.$forceUpdate();
      },
    },
  };
</script>
<style scoped>
  .table {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid black;
    padding-top: 30px;
  }
  .table-header {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    background-color: darkgray;
    border-bottom: 1px solid black;
  }
  .column-list {
    white-space: nowrap;
    width: 100%;
  }
  .column {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    vertical-align: top;
    border-right: 1px solid black;
    padding: 0 3px;
    user-select: none;
  }
  .adjust .column:last-child {
    border-right: 0;
  }
  .column.dummy {
    width: 0px;
  }
  .column-name {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .column-option {
    position: absolute;
    right: 0;
    height: 100%;
    background-color: transparent;
    box-shadow: inset 0 0 3px #000000;
  }
  .v-scroll .dummy {
    width: 17px;
  }
  .table-body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-anchor: none;
    background-color: lightgray;
  }
  .table-body table {
    clear: both;
    /*margin: 0 auto;*/
    border-spacing: 0;
    border-collapse: collapse;
  }
  .table-body tr {
    white-space: nowrap;
    border-bottom: 1px solid black;
  }
  .table-body tr.selected {
    background: #2D89EF;
  }
  .table-body td {
    display: inline-block;
    padding: 0 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .table-body td:last-child {
    border-right: 0;
  }
  .vscroll-spacer {
    opacity: 0;
    clear: both;
  }
  [v-cloak] {
    display: none;
  }
</style>
