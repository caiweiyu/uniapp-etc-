<template>
<uni-shadow-root class="vant-toast-index"><van-overlay v-if="mask || forbidClick" :show="show" :z-index="zIndex" :custom-style="mask ? '' : 'background-color: transparent;'"></van-overlay>
<van-transition :show="show" :custom-style="'z-index: '+(zIndex)" custom-class="van-toast__container">
  <view :class="'van-toast van-toast--'+(type === 'text' ? 'text' : 'icon')+' van-toast--'+(position)" @touchmove.stop.prevent="noop">
    
    <text v-if="type === 'text'">{{ message }}</text>

    
    <block v-else>
      <van-loading v-if="type === 'loading'" color="white" :type="loadingType" custom-class="van-toast__loading"></van-loading>
      <van-icon v-else class="van-toast__icon" :name="type"></van-icon>
      <text v-if="message" class="van-toast__text">{{ message }}</text>
    </block>

    <slot></slot>
  </view>
</van-transition></uni-shadow-root>
</template>

<script>
import VanIcon from '../icon/index.vue'
import VanLoading from '../loading/index.vue'
import VanOverlay from '../overlay/index.vue'
import VanTransition from '../transition/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon,'van-loading': VanLoading,'van-overlay': VanOverlay,'van-transition': VanTransition}}

global['__wxRoute'] = 'vant/toast/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    props: {
        show: Boolean,
        mask: Boolean,
        message: String,
        forbidClick: Boolean,
        zIndex: {
            type: Number,
            value: 1000
        },
        type: {
            type: String,
            value: 'text'
        },
        loadingType: {
            type: String,
            value: 'circular'
        },
        position: {
            type: String,
            value: 'middle'
        }
    },
    methods: {
        // for prevent touchmove
        noop: function () { }
    }
});
export default global['__wxComponents']['vant/toast/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-toast {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  color: #fff;
  color: var(--toast-text-color, #fff);
  font-size: 28rpx;
  font-size: var(--toast-font-size, 28rpx);
  line-height: 40rpx;
  line-height: var(--toast-line-height, 40rpx);
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: rgba(50, 50, 51, 0.88);
  background-color: var(--toast-background-color, rgba(50, 50, 51, 0.88));
  border-radius: 8rpx;
  border-radius: var(--toast-border-radius, 8rpx);
}
.van-toast__container {
  position: fixed;
  top: 50%;
  left: 50%;
  width: fit-content;
  transform: translate(-50%, -50%);
  max-width: 70%;
  max-width: var(--toast-max-width, 70%);
}
.van-toast--text {
  min-width: 192rpx;
  min-width: var(--toast-text-min-width, 192rpx);
  padding: 16rpx 24rpx;
  padding: var(--toast-text-padding, 16rpx 24rpx);
}
.van-toast--icon {
  width: 180rpx;
  width: var(--toast-default-width, 180rpx);
  min-height: 180rpx;
  min-height: var(--toast-default-min-height, 180rpx);
  padding: 32rpx;
  padding: var(--toast-default-padding, 32rpx);
}
.van-toast--icon .van-toast__icon {
  font-size: 96rpx;
  font-size: var(--toast-icon-size, 96rpx);
}
.van-toast--icon .van-toast__text {
  padding-top: 16rpx;
}
.van-toast__loading {
  margin: 20rpx 0;
}
.van-toast--top {
  transform: translate(0, -30vh);
}
.van-toast--bottom {
  transform: translate(0, 30vh);
}
</style>