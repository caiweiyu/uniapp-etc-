<template>
<uni-shadow-root class="vant-progress-index"><view class="van-progress custom-class" :style="'height: '+(utils.addUnit(strokeWidth))+'; '+(trackColor ? 'background: ' + trackColor : '')">
  <view class="van-progress__portion" :style="'width: '+(percentage)+'%; background: '+(inactive ? '#cacaca' : color)">
    <view v-if="showPivot && getters.text(pivotText, percentage)" :style="'color: '+(textColor)+'; background: '+(pivotColor ? pivotColor : inactive ? '#cacaca' : color)" class="van-progress__pivot">
      {{ getters.text(pivotText, percentage) }}
    </view>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs><wxs src="./index.wxs" module="getters"></wxs>
<script>

global['__wxRoute'] = 'vant/progress/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var color_1 = require("../common/color");
component_1.VantComponent({
    props: {
        inactive: Boolean,
        percentage: Number,
        pivotText: String,
        pivotColor: String,
        trackColor: String,
        showPivot: {
            type: Boolean,
            value: true
        },
        color: {
            type: String,
            value: color_1.BLUE
        },
        textColor: {
            type: String,
            value: '#fff'
        },
        strokeWidth: {
            type: null,
            value: 4
        }
    }
});
export default global['__wxComponents']['vant/progress/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-progress {
  position: relative;
  height: 8rpx;
  height: var(--progress-height, 8rpx);
  border-radius: 8rpx;
  border-radius: var(--progress-height, 8rpx);
  background: #ebedf0;
  background: var(--progress-background-color, #ebedf0);
}
.van-progress__portion {
  position: absolute;
  left: 0;
  height: 100%;
  border-radius: inherit;
  background: #1989fa;
  background: var(--progress-color, #1989fa);
}
.van-progress__pivot {
  position: absolute;
  top: 50%;
  right: 0;
  box-sizing: border-box;
  min-width: 2em;
  text-align: center;
  word-break: keep-all;
  border-radius: 1em;
  transform: translateY(-50%);
  color: #fff;
  color: var(--progress-pivot-text-color, #fff);
  padding: 0 10rpx;
  padding: var(--progress-pivot-padding, 0 10rpx);
  font-size: 20rpx;
  font-size: var(--progress-pivot-font-size, 20rpx);
  line-height: 1.6;
  line-height: var(--progress-pivot-line-height, 1.6);
  background-color: #1989fa;
  background-color: var(--progress-pivot-background-color, #1989fa);
}
</style>