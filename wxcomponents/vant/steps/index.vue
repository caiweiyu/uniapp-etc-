<template>
<uni-shadow-root class="vant-steps-index"><view :class="'custom-class '+(utils.bem('steps', [direction]))">
  <view class="van-step__wrapper">
    <view v-for="(item,index) in (steps)" :key="item.index" :class="(utils.bem('step', [direction, status(index, active)]))+' van-hairline'" :style="status(index, active) === 'inactive' ? 'color: ' + inactiveColor: ''">
      <view class="van-step__title" :style="index === active ? 'color: ' + activeColor : ''">
        <view>{{ item.text }}</view>
        <view class="desc-class">{{ item.desc }}</view>
      </view>
      <view class="van-step__circle-container">
        <block v-if="index !== active">
          <van-icon v-if="inactiveIcon" :color="status(index, active) === 'inactive' ? inactiveColor: activeColor" :name="inactiveIcon" custom-class="van-step__icon"></van-icon>
          <view v-else class="van-step__circle" :style="'background-color: ' + (index < active ? activeColor : inactiveColor)"></view>
        </block>

        <van-icon v-else :name="activeIcon" :color="activeColor" custom-class="van-step__icon"></van-icon>
      </view>
      <view v-if="index !== steps.length - 1" class="van-step__line" :style="'background-color: ' + (index < active ? activeColor : inactiveColor)"></view>
    </view>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs><wxs module="status" src="./index-status.wxs"></wxs>
<script>
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/steps/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var color_1 = require("../common/color");
component_1.VantComponent({
    classes: ['desc-class'],
    props: {
        icon: String,
        steps: Array,
        active: Number,
        direction: {
            type: String,
            value: 'horizontal'
        },
        activeColor: {
            type: String,
            value: color_1.GREEN
        },
        inactiveColor: {
            type: String,
            value: color_1.GRAY_DARK
        },
        activeIcon: {
            type: String,
            value: 'checked'
        },
        inactiveIcon: String
    }
});
export default global['__wxComponents']['vant/steps/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-steps {
  overflow: hidden;
  background-color: #fff;
  background-color: var(--steps-background-color, #fff);
}
.van-steps--horizontal {
  padding: 20rpx;
}
.van-steps--horizontal .van-step__wrapper {
  position: relative;
  display: flex;
  overflow: hidden;
}
.van-steps--vertical {
  padding-left: 20rpx;
}
.van-steps--vertical .van-step__wrapper {
  padding: 0 0 0 40rpx;
}
.van-step {
  position: relative;
  flex: 1;
  font-size: 28rpx;
  font-size: var(--step-font-size, 28rpx);
  color: #969799;
  color: var(--step-text-color, #969799);
}
.van-step--finish {
  color: #323233;
  color: var(--step-finish-text-color, #323233);
}
.van-step__circle {
  border-radius: 50%;
  width: 10rpx;
  width: var(--step-circle-size, 10rpx);
  height: 10rpx;
  height: var(--step-circle-size, 10rpx);
  background-color: #969799;
  background-color: var(--step-circle-color, #969799);
}
.van-step--horizontal {
  padding-bottom: 28rpx;
}
.van-step--horizontal:first-child .van-step__title {
  transform: none;
}
.van-step--horizontal:first-child .van-step__circle-container {
  padding: 0 16rpx 0 0;
  transform: translate3d(0, 50%, 0);
}
.van-step--horizontal:last-child {
  position: absolute;
  right: 0;
  width: auto;
}
.van-step--horizontal:last-child .van-step__title {
  text-align: right;
  transform: none;
}
.van-step--horizontal:last-child .van-step__circle-container {
  right: 0;
  padding: 0 0 0 16rpx;
  transform: translate3d(0, 50%, 0);
}
.van-step--horizontal .van-step__circle-container {
  position: absolute;
  bottom: 12rpx;
  z-index: 1;
  transform: translate3d(-50%, 50%, 0);
  background-color: #fff;
  background-color: var(--white, #fff);
  padding: 0 16rpx;
  padding: 0 var(--padding-xs, 16rpx);
}
.van-step--horizontal .van-step__title {
  display: inline-block;
  transform: translate3d(-50%, 0, 0);
  font-size: 24rpx;
  font-size: var(--step-horizontal-title-font-size, 24rpx);
}
.van-step--horizontal .van-step__line {
  position: absolute;
  right: 0;
  bottom: 12rpx;
  left: 0;
  height: 2rpx;
  transform: translate3d(0, 50%, 0);
  background-color: #ebedf0;
  background-color: var(--step-line-color, #ebedf0);
}
.van-step--horizontal.van-step--process {
  color: #323233;
  color: var(--step-process-text-color, #323233);
}
.van-step--horizontal.van-step--process .van-step__icon {
  display: block;
  line-height: 1;
  font-size: 24rpx;
  font-size: var(--step-icon-size, 24rpx);
}
.van-step--vertical {
  padding: 20rpx 20rpx 20rpx 0;
  line-height: 36rpx;
}
.van-step--vertical::after {
  border-bottom-width: 2rpx;
}
.van-step--vertical:last-child::after {
  border-bottom-width: none;
}
.van-step--vertical:first-child::before {
  position: absolute;
  top: 0;
  left: -30rpx;
  z-index: 1;
  width: 2rpx;
  height: 40rpx;
  content: '';
  background-color: #fff;
  background-color: var(--white, #fff);
}
.van-step--vertical .van-step__icon,
.van-step--vertical .van-step__circle,
.van-step--vertical .van-step__line {
  position: absolute;
  top: 38rpx;
  left: -28rpx;
  z-index: 2;
  transform: translate3d(-50%, -50%, 0);
}
.van-step--vertical .van-step__icon {
  line-height: 1;
  font-size: 24rpx;
  font-size: var(--step-icon-size, 24rpx);
}
.van-step--vertical .van-step__line {
  z-index: 1;
  width: 2rpx;
  height: 100%;
  transform: translate3d(-50%, 0, 0);
  background-color: #ebedf0;
  background-color: var(--step-line-color, #ebedf0);
}
</style>