<template>
  <div class="outer">
    <div class="button-outer">
      <ev-button
        :type="'primary'"
        @click="addTab"
      >
        Add Tab
      </ev-button>
      <ev-button
        :type="'primary'"
        @click="randomChangeTab"
      >
        Change Tab
      </ev-button>
    </div>
    <div class="tab-default-outer">
      <ev-tabs
        v-model="tabItems"
        :active-tab-value="activeTabValue"
        :min-tab-width="100"
        @change-tab="changeTab"
      >
        <ev-tab-panel
          v-for="item in tabItems"
          :key="item.value"
          :value="item.value"
        >
          <div
            style="width: 400px;height: 300px"
          />
        </ev-tab-panel>
      </ev-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        seq: 0,
        tabItems: [],
        activeTabValue: '1',
      };
    },
    created() {
      this.createTabs();
    },
    methods: {
      createTabs() {
        for (let ix = 0; ix < 4; ix++) {
          this.tabItems.push({
            title: `appended tab${this.seq}`,
            value: `${this.seq}`,
          });

          this.seq++;
        }
      },
      addTab() {
        this.tabItems.push({
          title: `appended tab${this.seq}`,
          value: `${this.seq}`,
        });
        // this.activeTabValue = `${this.seq}`;
        this.seq++;
      },
      changeTab(oldValue, newValue) {
        this.activeTabValue = newValue;
      },
      randomChangeTab() {
        this.activeTabValue = `${Math.floor(Math.random() * Math.floor(this.seq))}`;
        if (this.tabItems[0].icon) {
          this.$set(this.tabItems[0], 'icon', '');
        } else {
          this.$set(this.tabItems[0], 'icon', 'ei-close');
        }
      },
    },
  };
</script>

<style scoped>
  p{
    margin-left: 30px;
  }
  .button-outer {
    margin-bottom: 5px;
  }
  .outer {
    width: 100%;
  }
  .tab-default-outer {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
