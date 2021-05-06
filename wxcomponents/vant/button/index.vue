<template>
<uni-shadow-root class="vant-button-index"><button :id="id" :class="'custom-class '+(utils.bem('button', [type, size, { block, round, plain, square, loading, disabled, hairline, unclickable: disabled || loading }]))+' '+(hairline ? 'van-hairline--surround' : '')" hover-class="van-button--active hover-class" :lang="lang" :style="(baseStyle)+' '+(customStyle)" :open-type="openType" :business-id="businessId" :session-from="sessionFrom" :send-message-title="sendMessageTitle" :send-message-path="sendMessagePath" :send-message-img="sendMessageImg" :show-message-card="showMessageCard" :app-parameter="appParameter" :aria-label="ariaLabel" @click="onClick" @getuserinfo="bindGetUserInfo" @contact="bindContact" @getphonenumber="bindGetPhoneNumber" @error="bindError" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting">
  <block v-if="loading">
    <van-loading custom-class="loading-class" :size="loadingSize" :type="loadingType" :color="loadingColor(type,color,plain)"></van-loading>
    <view v-if="loadingText" class="van-button__loading-text">
      {{ loadingText }}
    </view>
  </block>
  <block v-else>
    <van-icon v-if="icon" size="1.2em" :name="icon" class="van-button__icon" custom-style="line-height: inherit;"></van-icon>
    <view class="van-button__text">
      <slot></slot>
    </view>
  </block>
</button></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs><wxs module="loadingColor" src="./index-loadingColor.wxs"></wxs>
<script>
import VanIcon from '../icon/index.vue'
import VanLoading from '../loading/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon,'van-loading': VanLoading}}

global['__wxRoute'] = 'vant/button/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var button_1 = require("../mixins/button");
var open_type_1 = require("../mixins/open-type");
component_1.VantComponent({
    mixins: [button_1.button, open_type_1.openType],
    classes: ['hover-class', 'loading-class'],
    data: {
        baseStyle: ''
    },
    props: {
        icon: String,
        plain: Boolean,
        block: Boolean,
        round: Boolean,
        square: Boolean,
        loading: Boolean,
        hairline: Boolean,
        disabled: Boolean,
        loadingText: String,
        customStyle: String,
        loadingType: {
            type: String,
            value: 'circular'
        },
        type: {
            type: String,
            value: 'default'
        },
        size: {
            type: String,
            value: 'normal'
        },
        loadingSize: {
            type: String,
            value: '20px'
        },
        color: {
            type: String,
            observer: function (color) {
                var style = '';
                if (color) {
                    style += "color: " + (this.data.plain ? color : 'white') + ";";
                    if (!this.data.plain) {
                        // Use background instead of backgroundColor to make linear-gradient work
                        style += "background: " + color + ";";
                    }
                    // hide border when color is linear-gradient
                    if (color.indexOf('gradient') !== -1) {
                        style += 'border: 0;';
                    }
                    else {
                        style += "border-color: " + color + ";";
                    }
                }
                if (style !== this.data.baseStyle) {
                    this.setData({ baseStyle: style });
                }
            }
        }
    },
    methods: {
        onClick: function () {
            if (!this.data.disabled && !this.data.loading) {
                this.$emit('click');
            }
        }
    }
});
export default global['__wxComponents']['vant/button/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  -webkit-appearance: none;
  -webkit-text-size-adjust: 100%;
  height: 88rpx;
  height: var(--button-default-height, 88rpx);
  line-height: 40rpx;
  line-height: var(--button-line-height, 40rpx);
  font-size: 32rpx;
  font-size: var(--button-default-font-size, 32rpx);
  transition: opacity 0.2s;
  transition: opacity var(--animation-duration-fast, 0.2s);
  border-radius: 4rpx;
  border-radius: var(--button-border-radius, 4rpx);
}
.van-button::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: inherit;
  border-radius: inherit;
  /* inherit parent's border radius */
  transform: translate(-50%, -50%);
  opacity: 0;
  content: ' ';
  background-color: #000;
  background-color: var(--black, #000);
  border-color: #000;
  border-color: var(--black, #000);
}
.van-button::after {
  border-width: 0;
}
.van-button--active::before {
  opacity: 0.15;
}
.van-button--unclickable::after {
  display: none;
}
.van-button--default {
  color: #323233;
  color: var(--button-default-color, #323233);
  background: #fff;
  background: var(--button-default-background-color, #fff);
  border: 2rpx solid #ebedf0;
  border: var(--button-border-width, 2rpx) solid var(--button-default-border-color, #ebedf0);
}
.van-button--primary {
  color: #fff;
  color: var(--button-primary-color, #fff);
  background: #07c160;
  background: var(--button-primary-background-color, #07c160);
  border: 2rpx solid #07c160;
  border: var(--button-border-width, 2rpx) solid var(--button-primary-border-color, #07c160);
}
.van-button--info {
  color: #fff;
  color: var(--button-info-color, #fff);
  background: #1989fa;
  background: var(--button-info-background-color, #1989fa);
  border: 2rpx solid #1989fa;
  border: var(--button-border-width, 2rpx) solid var(--button-info-border-color, #1989fa);
}
.van-button--danger {
  color: #fff;
  color: var(--button-danger-color, #fff);
  background: #ee0a24;
  background: var(--button-danger-background-color, #ee0a24);
  border: 2rpx solid #ee0a24;
  border: var(--button-border-width, 2rpx) solid var(--button-danger-border-color, #ee0a24);
}
.van-button--warning {
  color: #fff;
  color: var(--button-warning-color, #fff);
  background: #ff976a;
  background: var(--button-warning-background-color, #ff976a);
  border: 2rpx solid #ff976a;
  border: var(--button-border-width, 2rpx) solid var(--button-warning-border-color, #ff976a);
}
.van-button--plain {
  background: #fff;
  background: var(--button-plain-background-color, #fff);
}
.van-button--plain.van-button--primary {
  color: #07c160;
  color: var(--button-primary-background-color, #07c160);
}
.van-button--plain.van-button--info {
  color: #1989fa;
  color: var(--button-info-background-color, #1989fa);
}
.van-button--plain.van-button--danger {
  color: #ee0a24;
  color: var(--button-danger-background-color, #ee0a24);
}
.van-button--plain.van-button--warning {
  color: #ff976a;
  color: var(--button-warning-background-color, #ff976a);
}
.van-button--large {
  width: 100%;
  height: 100rpx;
  height: var(--button-large-height, 100rpx);
}
.van-button--normal {
  padding: 0 30rpx;
  font-size: 28rpx;
  font-size: var(--button-normal-font-size, 28rpx);
}
.van-button--small {
  min-width: 120rpx;
  min-width: var(--button-small-min-width, 120rpx);
  height: 60rpx;
  height: var(--button-small-height, 60rpx);
  padding: 0 16rpx;
  padding: 0 var(--padding-xs, 16rpx);
  font-size: 24rpx;
  font-size: var(--button-small-font-size, 24rpx);
}
.van-button--mini {
  display: inline-block;
  min-width: 100rpx;
  min-width: var(--button-mini-min-width, 100rpx);
  height: 44rpx;
  height: var(--button-mini-height, 44rpx);
  font-size: 20rpx;
  font-size: var(--button-mini-font-size, 20rpx);
}
.van-button--mini + .van-button--mini {
  margin-left: 10rpx;
}
.van-button--block {
  display: flex;
  width: 100%;
}
.van-button--round {
  border-radius: 1998rpx;
  border-radius: var(--button-round-border-radius, 1998rpx);
}
.van-button--square {
  border-radius: 0;
}
.van-button--disabled {
  opacity: 0.5;
  opacity: var(--button-disabled-opacity, 0.5);
}
.van-button__text {
  display: inline;
}
.van-button__loading-text,
.van-button__icon + .van-button__text:not(:empty) {
  margin-left: 8rpx;
}
.van-button__icon {
  min-width: 1em;
  line-height: inherit !important;
  vertical-align: top;
}
.van-button--hairline {
  padding-top: 2rpx;
  border-width: 0;
}
.van-button--hairline::after {
  border-color: inherit;
  border-width: 2rpx;
  border-radius: calc(4rpx * 2);
  border-radius: calc(var(--button-border-radius, 4rpx) * 2);
}
.van-button--hairline.van-button--round::after {
  border-radius: 1998rpx;
  border-radius: var(--button-round-border-radius, 1998rpx);
}
.van-button--hairline.van-button--square::after {
  border-radius: 0;
}
</style>