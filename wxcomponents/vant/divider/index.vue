<template>
<uni-shadow-root class="vant-divider-index"><view :class="'custom-class '+(utils.bem('divider', [{dashed, hairline}, contentPosition]))" :style="(borderColor  ? 'border-color: ' + borderColor + ';' : '')+(textColor ? 'color: ' + textColor + ';' : '')+' '+(fontSize ? 'font-size: ' + fontSize + 'px;' : '')+' '+(customStyle)">
  <slot></slot>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'vant/divider/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    props: {
        dashed: {
            type: Boolean,
            value: false
        },
        hairline: {
            type: Boolean,
            value: false
        },
        contentPosition: {
            type: String,
            value: ''
        },
        fontSize: {
            type: Number,
            value: ''
        },
        borderColor: {
            type: String,
            value: ''
        },
        textColor: {
            type: String,
            value: ''
        },
        customStyle: {
            type: String,
            value: ''
        }
    }
});
export default global['__wxComponents']['vant/divider/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-divider {
  display: flex;
  align-items: center;
  border-style: solid;
  border-width: 0;
  margin: 32rpx 0;
  margin: var(--divider-margin, 32rpx 0);
  color: #969799;
  color: var(--divider-text-color, #969799);
  font-size: 28rpx;
  font-size: var(--divider-font-size, 28rpx);
  line-height: 48rpx;
  line-height: var(--divider-line-height, 48rpx);
  border-color: #ebedf0;
  border-color: var(--divider-border-color, #ebedf0);
}
.van-divider::before,
.van-divider::after {
  display: block;
  flex: 1;
  box-sizing: border-box;
  height: 2rpx;
  border-color: inherit;
  border-style: inherit;
  border-width: 2rpx 0 0;
}
.van-divider::before {
  content: '';
}
.van-divider--hairline::before,
.van-divider--hairline::after {
  transform: scaleY(0.5);
}
.van-divider--dashed {
  border-style: dashed;
}
.van-divider--center::before,
.van-divider--left::before,
.van-divider--right::before {
  margin-right: 32rpx;
  margin-right: var(--divider-content-padding, 32rpx);
}
.van-divider--center::after,
.van-divider--left::after,
.van-divider--right::after {
  content: '';
  margin-left: 32rpx;
  margin-left: var(--divider-content-padding, 32rpx);
}
.van-divider--left::before {
  max-width: 10%;
  max-width: var(--divider-content-left-width, 10%);
}
.van-divider--right::after {
  max-width: 10%;
  max-width: var(--divider-content-right-width, 10%);
}
</style>