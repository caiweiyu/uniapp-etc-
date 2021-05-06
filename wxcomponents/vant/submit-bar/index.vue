<template>
<uni-shadow-root class="vant-submit-bar-index"><view class="van-submit-bar custom-class">
  <slot name="top"></slot>

  <view class="van-submit-bar__tip">
    <van-icon v-if="tipIcon" size="12px" :name="tipIcon" custom-class="van-submit-bar__tip-icon"></van-icon>
    <view v-if="hasTip" class="van-submit-bar__tip-text">
      {{ tip }}
    </view>
    <slot name="tip"></slot>
  </view>

  <view :class="'bar-class '+(utils.bem('submit-bar__bar', { safe: safeAreaInsetBottom }))">
    <slot></slot>
    <view v-if="hasPrice" class="van-submit-bar__text">
      <text>{{ label || '合计：' }}</text>
      <text class="van-submit-bar__price price-class">
        <text class="van-submit-bar__currency">{{ currency }} </text>
        <text class="van-submit-bar__price-integer">{{ integerStr }}</text><text>{{decimalStr}}</text>
      </text>
      <text class="van-submit-bar__suffix-label">{{ suffixLabel }}</text>
    </view>
    <van-button round :type="buttonType" :loading="loading" :disabled="disabled" class="van-submit-bar__button" custom-class="button-class" custom-style="width: 100%;" @click="onSubmit">
      {{ loading ? '' : buttonText }}
    </van-button>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanButton from '../button/index.vue'
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-button': VanButton,'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/submit-bar/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: [
        'bar-class',
        'price-class',
        'button-class'
    ],
    props: {
        tip: {
            type: null,
            observer: 'updateTip'
        },
        tipIcon: String,
        type: Number,
        price: {
            type: null,
            observer: 'updatePrice'
        },
        label: String,
        loading: Boolean,
        disabled: Boolean,
        buttonText: String,
        currency: {
            type: String,
            value: '¥'
        },
        buttonType: {
            type: String,
            value: 'danger'
        },
        decimalLength: {
            type: Number,
            value: 2,
            observer: 'updatePrice'
        },
        suffixLabel: String,
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        updatePrice: function () {
            var _a = this.data, price = _a.price, decimalLength = _a.decimalLength;
            var priceStrArr = typeof price === 'number' && (price / 100).toFixed(decimalLength).split('.');
            this.setData({
                hasPrice: typeof price === 'number',
                integerStr: priceStrArr && priceStrArr[0],
                decimalStr: decimalLength && priceStrArr ? "." + priceStrArr[1] : ''
            });
        },
        updateTip: function () {
            this.setData({ hasTip: typeof this.data.tip === 'string' });
        },
        onSubmit: function (event) {
            this.$emit('submit', event.detail);
        }
    }
});
export default global['__wxComponents']['vant/submit-bar/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  user-select: none;
  z-index: 100;
  z-index: var(--submit-bar-z-index, 100);
  background-color: #fff;
  background-color: var(--submit-bar-background-color, #fff);
}
.van-submit-bar__tip {
  padding: 20rpx;
  padding: var(--submit-bar-tip-padding, 20rpx);
  color: #f56723;
  color: var(--submit-bar-tip-color, #f56723);
  font-size: 24rpx;
  font-size: var(--submit-bar-tip-font-size, 24rpx);
  line-height: 1.5;
  line-height: var(--submit-bar-tip-line-height, 1.5);
  background-color: #fff7cc;
  background-color: var(--submit-bar-tip-background-color, #fff7cc);
}
.van-submit-bar__tip:empty {
  display: none;
}
.van-submit-bar__tip-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
  vertical-align: middle;
  font-size: 24rpx;
  font-size: var(--submit-bar-tip-icon-size, 24rpx);
  min-width: calc(24rpx * 1.5);
  min-width: calc(var(--submit-bar-tip-icon-size, 24rpx) * 1.5);
}
.van-submit-bar__tip-text {
  display: inline;
  vertical-align: middle;
}
.van-submit-bar__bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 32rpx;
  padding: var(--submit-bar-padding, 0 32rpx);
  height: 100rpx;
  height: var(--submit-bar-height, 100rpx);
  font-size: 28rpx;
  font-size: var(--submit-bar-text-font-size, 28rpx);
  background-color: #fff;
  background-color: var(--submit-bar-background-color, #fff);
}
.van-submit-bar__bar--safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.van-submit-bar__text {
  flex: 1;
  text-align: right;
  color: #323233;
  color: var(--submit-bar-text-color, #323233);
  padding-right: 24rpx;
  padding-right: var(--padding-sm, 24rpx);
  font-weight: 500;
  font-weight: var(--font-weight-bold, 500);
}
.van-submit-bar__price {
  color: #ee0a24;
  color: var(--submit-bar-price-color, #ee0a24);
  font-weight: 500;
  font-weight: var(--font-weight-bold, 500);
  font-size: 24rpx;
  font-size: var(--submit-bar-price-font-size, 24rpx);
}
.van-submit-bar__price-integer {
  font-size: 40rpx;
  font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
}
.van-submit-bar__currency {
  font-size: 24rpx;
  font-size: var(--submit-bar-currency-font-size, 24rpx);
}
.van-submit-bar__suffix-label {
  margin-left: 10rpx;
}
.van-submit-bar__button {
  width: 220rpx;
  width: var(--submit-bar-button-width, 220rpx);
  font-weight: 500;
  font-weight: var(--font-weight-bold, 500);
  --button-default-height: 80rpx !important;
  --button-default-height: var(--submit-bar-button-height, 80rpx) !important;
  --button-line-height: 80rpx !important;
  --button-line-height: var(--submit-bar-button-height, 80rpx) !important;
}
</style>