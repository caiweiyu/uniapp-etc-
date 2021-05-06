<template>
<uni-shadow-root class="vant-cell-group-index"><view v-if="title" class="van-cell-group__title">
  {{ title }}
</view>
<view :class="'custom-class van-cell-group '+(border ? 'van-hairline--top-bottom' : '')">
  <slot></slot>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'vant/cell-group/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    props: {
        title: String,
        border: {
            type: Boolean,
            value: true
        }
    }
});
export default global['__wxComponents']['vant/cell-group/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-cell-group__title {
  padding: 32rpx 32rpx 16rpx;
  padding: var(--cell-group-title-padding, 32rpx 32rpx 16rpx);
  font-size: 28rpx;
  font-size: var(--cell-group-title-font-size, 28rpx);
  line-height: 32rpx;
  line-height: var(--cell-group-title-line-height, 32rpx);
  color: #969799;
  color: var(--cell-group-title-color, #969799);
}
</style>