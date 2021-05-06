<template>
<uni-shadow-root class="vant-grid-item-index"><view :class="utils.bem('grid-item', { square })" :style="viewStyle" @click="onClick">
  <view :class="(utils.bem('grid-item__content', { center, square, clickable, surround: border && gutter }))+' '+(border ? 'van-hairline--surround' : '')" :style="contentStyle">
    <block v-if="useSlot">
      <slot></slot>
    </block>
    <block v-else>
      <view class="van-grid-item__icon">
        <van-icon v-if="icon" :name="icon" :dot="dot" :info="info"></van-icon>
        <slot v-else name="icon"></slot>
      </view>
      <view class="van-grid-item__text">
        <text v-if="text">{{ text }}</text>
        <slot v-else name="text"></slot>
      </view>
    </block>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/grid-item/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("../mixins/link");
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
component_1.VantComponent({
    relation: {
        name: 'grid',
        type: 'ancestor',
        current: 'grid-item',
    },
    mixins: [link_1.link],
    props: {
        icon: String,
        dot: Boolean,
        info: null,
        text: String,
        useSlot: Boolean
    },
    data: {
        viewStyle: '',
    },
    mounted: function () {
        this.updateStyle();
    },
    methods: {
        updateStyle: function () {
            if (!this.parent) {
                return;
            }
            var _a = this.parent, data = _a.data, children = _a.children;
            var columnNum = data.columnNum, border = data.border, square = data.square, gutter = data.gutter, clickable = data.clickable, center = data.center;
            var width = 100 / columnNum + "%";
            var styleWrapper = [];
            styleWrapper.push("width: " + width);
            if (square) {
                styleWrapper.push("padding-top: " + width);
            }
            if (gutter) {
                var gutterValue = utils_1.addUnit(gutter);
                styleWrapper.push("padding-right: " + gutterValue);
                var index = children.indexOf(this);
                if (index >= columnNum) {
                    styleWrapper.push("margin-top: " + gutterValue);
                }
            }
            var contentStyle = '';
            if (square && gutter) {
                var gutterValue = utils_1.addUnit(gutter);
                contentStyle = "\n          right: " + gutterValue + ";\n          bottom: " + gutterValue + ";\n          height: auto;\n        ";
            }
            this.setData({
                viewStyle: styleWrapper.join('; '),
                contentStyle: contentStyle,
                center: center,
                border: border,
                square: square,
                gutter: gutter,
                clickable: clickable
            });
        },
        onClick: function () {
            this.$emit('click');
            this.jumpLink();
        }
    }
});
export default global['__wxComponents']['vant/grid-item/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-grid-item {
  position: relative;
  float: left;
  box-sizing: border-box;
}
.van-grid-item--square {
  height: 0;
}
.van-grid-item__content {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  padding: 32rpx 16rpx;
  padding: var(--grid-item-content-padding, 32rpx 16rpx);
  background-color: #fff;
  background-color: var(--grid-item-content-background-color, #fff);
}
.van-grid-item__content::after {
  z-index: 1;
  border-width: 0 2rpx 2rpx 0;
  border-width: 0 var(--border-width-base, 2rpx) var(--border-width-base, 2rpx) 0;
}
.van-grid-item__content--surround::after {
  border-width: 2rpx;
  border-width: var(--border-width-base, 2rpx);
}
.van-grid-item__content--center {
  align-items: center;
  justify-content: center;
}
.van-grid-item__content--square {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.van-grid-item__content--clickable:active {
  background-color: #f2f3f5;
  background-color: var(--grid-item-content-active-color, #f2f3f5);
}
.van-grid-item__icon {
  font-size: 52rpx;
  font-size: var(--grid-item-icon-size, 52rpx);
}
.van-grid-item__text {
  word-wrap: break-word;
  color: #646566;
  color: var(--grid-item-text-color, #646566);
  font-size: 24rpx;
  font-size: var(--grid-item-text-font-size, 24rpx);
}
</style>