<template>
<uni-shadow-root class="vant-sidebar-item-index"><view :class="(utils.bem('sidebar-item', { selected, disabled }))+' '+(selected ? 'active-class' : '')+' '+(disabled ? 'disabled-class' : '')+' custom-class'" hover-class="van-sidebar-item--hover" hover-stay-time="70" @click="onClick">
  <view class="van-sidebar-item__text">
    <van-info v-if="info !== null || dot" :dot="dot" :info="info" custom-style="right: 4px"></van-info>
    {{ title }}
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanInfo from '../info/index.vue'
global['__wxVueOptions'] = {components:{'van-info': VanInfo}}

global['__wxRoute'] = 'vant/sidebar-item/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: [
        'active-class',
        'disabled-class',
    ],
    relation: {
        type: 'ancestor',
        name: 'sidebar',
        current: 'sidebar-item',
    },
    props: {
        dot: Boolean,
        info: null,
        title: String,
        disabled: Boolean
    },
    methods: {
        onClick: function () {
            var _this = this;
            var parent = this.parent;
            if (!parent || this.data.disabled) {
                return;
            }
            var index = parent.children.indexOf(this);
            parent.setActive(index).then(function () {
                _this.$emit('click', index);
                parent.$emit('change', index);
            });
        },
        setActive: function (selected) {
            return this.setData({ selected: selected });
        }
    }
});
export default global['__wxComponents']['vant/sidebar-item/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-sidebar-item {
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  border-left: 6rpx solid transparent;
  user-select: none;
  padding: 40rpx 24rpx 40rpx 16rpx;
  padding: var(--sidebar-padding, 40rpx 24rpx 40rpx 16rpx);
  font-size: 28rpx;
  font-size: var(--sidebar-font-size, 28rpx);
  line-height: 40rpx;
  line-height: var(--sidebar-line-height, 40rpx);
  color: #323233;
  color: var(--sidebar-text-color, #323233);
  background-color: #fafafa;
  background-color: var(--sidebar-background-color, #fafafa);
}
.van-sidebar-item__text {
  position: relative;
  display: inline-block;
}
.van-sidebar-item--hover:not(.van-sidebar-item--disabled) {
  background-color: #f2f3f5;
  background-color: var(--sidebar-active-color, #f2f3f5);
}
.van-sidebar-item::after {
  border-bottom-width: 2rpx;
}
.van-sidebar-item--selected {
  color: #323233;
  color: var(--sidebar-selected-text-color, #323233);
  font-weight: 500;
  font-weight: var(--sidebar-selected-font-weight, 500);
  border-color: #ee0a24;
  border-color: var(--sidebar-selected-border-color, #ee0a24);
}
.van-sidebar-item--selected::after {
  border-right-width: 2rpx;
}
.van-sidebar-item--selected,
.van-sidebar-item--selected.van-sidebar-item--hover {
  background-color: #fff;
  background-color: var(--sidebar-selected-background-color, #fff);
}
.van-sidebar-item--disabled {
  color: #c8c9cc;
  color: var(--sidebar-disabled-text-color, #c8c9cc);
}
</style>