<template>
<uni-shadow-root class="vant-nav-bar-index"><view :class="(utils.bem('nav-bar', { fixed }))+' custom-class '+(border ? 'van-hairline--bottom' : '')" :style="'z-index: '+(zIndex)+'; padding-top: '+(safeAreaInsetTop ? statusBarHeight : 0)+'px;'">
  <view class="van-nav-bar__left" @click="onClickLeft">
    <block v-if="leftArrow || leftText">
      <van-icon v-if="leftArrow" size="16px" name="arrow-left" custom-class="van-nav-bar__arrow"></van-icon>
      <view v-if="leftText" class="van-nav-bar__text" hover-class="van-nav-bar__text--hover" hover-stay-time="70">{{ leftText }}</view>
    </block>
    <slot v-else name="left"></slot>
  </view>
  <view class="van-nav-bar__title title-class van-ellipsis">
    <block v-if="title">{{ title }}</block>
    <slot v-else name="title"></slot>
  </view>
  <view class="van-nav-bar__right" @click="onClickRight">
    <view v-if="rightText" class="van-nav-bar__text" hover-class="van-nav-bar__text--hover" hover-stay-time="70">{{ rightText }}</view>
    <slot v-else name="right"></slot>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/nav-bar/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: ['title-class'],
    props: {
        title: String,
        fixed: Boolean,
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        border: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 1
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true
        },
    },
    data: {
        statusBarHeight: 0
    },
    created: function () {
        var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
        this.setData({ statusBarHeight: statusBarHeight });
    },
    methods: {
        onClickLeft: function () {
            this.$emit('click-left');
        },
        onClickRight: function () {
            this.$emit('click-right');
        }
    }
});
export default global['__wxComponents']['vant/nav-bar/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-nav-bar {
  position: relative;
  text-align: center;
  user-select: none;
  height: 88rpx;
  height: var(--nav-bar-height, 88rpx);
  line-height: 88rpx;
  line-height: var(--nav-bar-height, 88rpx);
  background-color: #fff;
  background-color: var(--nav-bar-background-color, #fff);
}
.van-nav-bar__text {
  display: inline-block;
  vertical-align: middle;
  margin: 0 -32rpx;
  margin: 0 -var(--padding-md, 32rpx);
  padding: 0 32rpx;
  padding: 0 var(--padding-md, 32rpx);
  color: #1989fa;
  color: var(--nav-bar-text-color, #1989fa);
}
.van-nav-bar__text--hover {
  background-color: #f2f3f5;
  background-color: var(--active-color, #f2f3f5);
}
.van-nav-bar__arrow {
  vertical-align: middle;
  font-size: 32rpx;
  font-size: var(--nav-bar-arrow-size, 32rpx);
  color: #1989fa;
  color: var(--nav-bar-text-color, #1989fa);
}
.van-nav-bar__arrow + .van-nav-bar__text {
  margin-left: -40rpx;
  padding-left: 50rpx;
}
.van-nav-bar--fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.van-nav-bar__title {
  max-width: 60%;
  margin: 0 auto;
  color: #323233;
  color: var(--nav-bar-title-text-color, #323233);
  font-weight: 500;
  font-weight: var(--font-weight-bold, 500);
  font-size: 32rpx;
  font-size: var(--nav-bar-title-font-size, 32rpx);
}
.van-nav-bar__left,
.van-nav-bar__right {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-size: var(--font-size-md, 28rpx);
}
.van-nav-bar__left {
  left: 32rpx;
  left: var(--padding-md, 32rpx);
}
.van-nav-bar__right {
  right: 32rpx;
  right: var(--padding-md, 32rpx);
}
</style>