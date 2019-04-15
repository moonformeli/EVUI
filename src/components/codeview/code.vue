<template>
  <div
    :style="{ height: boxHeight+'px' }"
    :class="isActive"
    class="evui-codeview"
  >
    <div
      v-if="description && !isBottom"
      ref="descriptionLayer"
      class="evui-codeview-description"
    >
      <span>{{ description }}</span>
    </div>
    <div
      ref="exampleLayer"
      class="evui-codeview-example-layer"
    >
      <slot/>
      <div
        v-if="description && isBottom"
        ref="descriptionLayer"
        class="evui-codeview-description"
      >
        <span>{{ description }}</span>
      </div>
    </div>
    <div>
      <div class="evui-codeview-split-layer"/>
      <div
        ref="codeLayer"
        class="evui-codeview-code-layer"
      >
        <codemirror
          :value="rawCode"
          :options="codeOption"
        />
      </div>
      <div class="evui-codeview-example-bar">
        <div
          :class="selectIconClasses"
          class="evui-codeview-example-bar-icon"
          @click.stop="onBottomClick"
        >
          <div>
            <icon
              class="fas fa-sort-down"
            />
            <span
              class="evui-codeview-example-bar-span"
            >{{ txtBottomBar }}</span>
          </div>
          <ev-button
            ref="try"
            type="text"
            class="evui-codeview-example-bar-button"
            @click.stop="onTryClick"
          >Try it</ev-button>
        </div>
      </div>
    </div>
    <form
      ref="form"
      method = "post"
      action = "http://jsfiddle.net/api/post/library/pure/"
      target = "_blank">
      <input
        ref="html"
        type="hidden"
        name="html">
      <input
        ref="js"
        type="hidden"
        name="js">
      <input
        ref="css"
        type="hidden"
        name="css">
      <input
        :value="description"
        type="hidden"
        name="title"
      >
      <input
        type="hidden"
        name="wrap"
        value="d">
    </form>
  </div>
</template>

<script>
  import { codemirror } from 'vue-codemirror-lite';
  import icon from '@/components/icon/icon';

  export default {
    components: {
      icon,
      codemirror,
    },
    props: {
      codeUrl: {
        type: String,
        default: '',
      },
      height: {
        type: Number,
        default: 0,
      },
      description: {
        type: String,
        default: '',
      },
      isBottom: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        resource: {},
        rawCode: '',
        boxHeight: this.height,
        txtBottomBar: 'Expand',
        isExpand: false,
        codeOption: {
          mode: 'vue',
          tabSize: 4,
          lineNumbers: false,
          lineWrapping: true,
          scrollbarStyle: null,
          readOnly: true,
        },
      };
    },
    computed: {
      isActive() {
        return [
          {
            expand: this.isExpand,
          },
        ];
      },
      selectIconClasses() {
        return [
          {
            'select-down': this.txtBottomBar !== 'Expand',
          },
        ];
      },
    },
    mounted() {
      const descriptionLayerHeight = this.$refs.descriptionLayer ?
        this.$refs.descriptionLayer.getBoundingClientRect().height + 14.5 : 0;
      const exampleLayerHeight = this.$refs.exampleLayer.getBoundingClientRect().height;
      this.boxHeight = this.isBottom ?
        exampleLayerHeight + descriptionLayerHeight + 40 :
        exampleLayerHeight + descriptionLayerHeight + 50;
    },
    created() {
      this.$http.get(this.codeUrl)
        .then((result) => {
          setTimeout(() => {
            this.rawCode = result.data;
          }, 600);
        }, (error) => {
          throw new Error(error);
        });
    },
    methods: {
      onBottomClick: function onBottomClick() {
        const codeLayerHeight = this.$refs.codeLayer.getBoundingClientRect().height;
        const exampleLayerHeight = this.$refs.exampleLayer.getBoundingClientRect().height;
        const descriptionLayerHeight = this.$refs.descriptionLayer ?
          this.$refs.descriptionLayer.getBoundingClientRect().height + 14.5 : 0;
        if (this.txtBottomBar === 'Expand') {
          this.txtBottomBar = 'Hide';
          this.boxHeight = this.isBottom ?
            codeLayerHeight + exampleLayerHeight + descriptionLayerHeight :
            codeLayerHeight + exampleLayerHeight + descriptionLayerHeight + 33;
        } else {
          this.txtBottomBar = 'Expand';
          this.boxHeight = this.isBottom ?
            exampleLayerHeight + descriptionLayerHeight :
            exampleLayerHeight + descriptionLayerHeight + 50;
        }
        this.isExpand = !this.isExpand;

        const tryClasses = this.$refs.try.$el.classList; /* expand시 try it 고정 */
        if (tryClasses.contains('evui-codeview-example-bar-button-fix')) {
          tryClasses.remove('evui-codeview-example-bar-button-fix');
        } else {
          tryClasses.add('evui-codeview-example-bar-button-fix');
        }
      },
      onTryClick: function onTryClick() {
        const parser = new DOMParser();
        const parseData = parser.parseFromString(this.rawCode, 'text/html');
        const templateCode = parseData.getElementsByTagName('template')[0].innerHTML;
        const javascriptCode = parseData.getElementsByTagName('script')[0].innerHTML;
        const styleCode = parseData.getElementsByTagName('style')[0];

        let scriptLinkString = this.linkTagInjection('https://unpkg.com/evui@2.1.0/dist/main.css');
        scriptLinkString += this.scriptTagInjection('https://unpkg.com/vue');
        scriptLinkString += this.scriptTagInjection('https://unpkg.com/evui@2.1.0/dist/evui.min.js');
        if (javascriptCode.includes('moment')) {
          scriptLinkString += this.scriptTagInjection('https://momentjs.com/downloads/moment.js');
        }

        let vueObjString = javascriptCode;
        vueObjString = vueObjString.substring(vueObjString.indexOf('{'), vueObjString.lastIndexOf(';'));
        vueObjString = `{\nel: '#app', ${vueObjString.substring(vueObjString.indexOf('{') + 1)}`;

        const htmlString =
          `<html>\n<head>\n${scriptLinkString}</head>\n<body>\n<div id="app">${templateCode.replace(/``/gi, '')}</div>\n</body>\n</html>`;
        const jsString = `new Vue(${vueObjString})`;
        const cssString = styleCode ? `${styleCode.innerHTML.trim()}` : '';

        this.$refs.html.setAttribute('value', htmlString);
        this.$refs.js.setAttribute('value', jsString);
        this.$refs.css.setAttribute('value', cssString);
        this.$refs.form.submit();
      },
      scriptTagInjection(srcString) {
        return `<script src="${srcString}"><` +
          '/script>\n';
      },
      linkTagInjection(srcString) {
        return `<link rel="stylesheet" type="text/css" href="${srcString}"/>\n`;
      },
    },
  };
</script>
<style scoped>
  .evui-codeview{
    position: relative;
    width: 100%;
    border: 1px solid #dfe6e9;
    margin: 5px;
    padding: 10px 10px 20px 10px;
    border-radius: 6px;
    overflow: hidden;
    z-index: 1;
    transition: height .3s ease-in-out;
  }
  .evui-codeview.expand{
    transition: height .3s ease-in-out;
  }
  .evui-codeview-example-layer{
    position: relative;
    padding: 0px 0px 8px 0px;
  }
  .evui-codeview-split-layer{
    position: relative;
    border-bottom: 1px solid #dfe6e9;
  }
  .evui-codeview-code-layer{
    position: relative;
    width: 100%;
    font-size: 8px;
  }
  .evui-codeview-example-bar{
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 41px;
    z-index: 10;
    background-color: #ffffff;
    transition: background-color .2s ease-in-out;
  }
  .evui-codeview-example-bar:hover{
    cursor: pointer;
    background-color: #F9FAFC;
  }
  .evui-codeview-example:hover{
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  }
  .evui-codeview-example-bar-icon{
    width: 100%;
    height: 100%;
    line-height: 25px;
    display: flex;
    justify-content: space-around;
  }
  .evui-codeview-example-bar-icon i{
    height: 100%;
    line-height: 30px;
    font-size: 16px;
    color: rgba(30, 101, 188, 0.5);
    transition: all .3s ease-in-out;
  }
  .evui-codeview-example-bar-icon span{
    line-height: 40px;
    font-size: 13px;
    font-weight: bold;
    opacity: 0;
    transition: all .3s ease-in-out;
  }
  .evui-codeview-example-bar-icon:hover i, .evui-codeview-example-bar-icon:hover span{
    color: rgb(30, 101, 188);
    opacity: 1;
    transform: translateX(-6px);
    transition: all .3s ease-out;
  }
  .evui-codeview-example-bar-button{ /* 추가 */
    position: absolute;
    right: 28px;
    color: rgb(30, 101, 188);
    opacity: 0;
    outline: none;
  }
  .evui-codeview-example-bar-button-fix{ /* 추가 */
    line-height: 40px;
    padding: 0 !important;
    font-size: 13px !important;
    font-weight: bold !important;
    opacity: 1;
  }
  .evui-codeview-example-bar-icon:hover button { /* 추가 */
    line-height: 40px;
    padding: 0 !important;
    font-size: 13px !important;
    font-weight: bold !important;
    opacity: 1;
  }
  .evui-codeview-example-bar-icon.select-down i{
    transform: rotate(180deg);
    transition: transform .4s ease-out;
  }
  .evui-codeview-example-bar-icon, .evui-codeview-example-bar-icon-span {
    user-select: none;
  }
  .evui-codeview-description {
    border: 1px solid #dfe6e9;
    border-radius: 2px;
    padding: 5px 10px 8px 10px;
    margin: 5px 3px 5px 3px;
    background-color: #FAFAFA;
    text-align: left;
    line-height: 1.5;
  }
  .evui-codeview-description span{
    font-size: 13px;
  }
</style>
