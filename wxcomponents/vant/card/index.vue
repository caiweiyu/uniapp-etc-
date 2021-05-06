<template>
<uni-shadow-root class="vant-card-index"><view class="custom-class van-card">
  <view :class="utils.bem('card__header', { center: centered })">
    <view class="van-card__thumb" @click="onClickThumb">
      <image v-if="thumb" :src="thumb" :mode="thumbMode" :lazy-load="lazyLoad" class="van-card__img thumb-class"></image>
      <slot name="thumb"></slot>
      <van-tag v-if="tag" mark type="danger" custom-class="van-card__tag">
        {{ tag }}
      </van-tag>
    </view>

    <view :class="'van-card__content '+(utils.bem('card__content', { center: centered }))">
      <view>
        <view v-if="title" class="van-card__title title-class">{{ title }}</view>
        <slot v-else name="title"></slot>

        <view v-if="desc" class="van-card__desc desc-class">{{ desc }}</view>
        <slot v-else name="desc"></slot>

        <slot name="tags"></slot>
      </view>

      <view class="van-card__bottom">
        <slot name="price-top"></slot>
        <view v-if="price || price === 0" class="van-card__price price-class">{{ currency }}<text class="van-card__price-integer">{{ integerStr }}</text><text class="van-card__price-decimal">{{ decimalStr }}</text></view>
        <slot v-else name="price"></slot>
        <view v-if="originPrice || originPrice === 0" class="van-card__origin-price origin-price-class">{{ currency }} {{ originPrice }}</view>
        <view v-if="num" class="van-card__num num-class">x {{ num }}</view>
        <slot v-else name="num"></slot>
        <slot name="bottom"></slot>
      </view>
    </view>
  </view>

  <view class="van-card__footer">
    <slot name="footer"></slot>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanTag from '../tag/index.vue'
global['__wxVueOptions'] = {components:{'van-tag': VanTag}}

global['__wxRoute'] = 'vant/card/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("../mixins/link");
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: [
        'num-class',
        'desc-class',
        'thumb-class',
        'title-class',
        'price-class',
        'origin-price-class'
    ],
    mixins: [link_1.link],
    props: {
        tag: String,
        num: String,
        desc: String,
        thumb: String,
        title: String,
        price: {
            type: String,
            observer: 'updatePrice'
        },
        centered: Boolean,
        lazyLoad: Boolean,
        thumbLink: String,
        originPrice: String,
        thumbMode: {
            type: String,
            value: 'aspectFit'
        },
        currency: {
            type: String,
            value: '¥'
        }
    },
    methods: {
        updatePrice: function () {
            var price = this.data.price;
            var priceArr = price.toString().split('.');
            this.setData({
                integerStr: priceArr[0],
                decimalStr: priceArr[1] ? "." + priceArr[1] : ''
            });
        },
        onClickThumb: function () {
            this.jumpLink('thumbLink');
        }
    }
});
export default global['__wxComponents']['vant/card/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 16rpx 32rpx;
  padding: var(--card-padding, 16rpx 32rpx);
  font-size: 24rpx;
  font-size: var(--card-font-size, 24rpx);
  color: #323233;
  color: var(--card-text-color, #323233);
  background-color: #fafafa;
  background-color: var(--card-background-color, #fafafa);
}
.van-card__header {
  display: flex;
}
.van-card__header--center {
  align-items: center;
  justify-content: center;
}
.van-card__thumb {
  position: relative;
  flex: none;
  width: 176rpx;
  width: var(--card-thumb-size, 176rpx);
  height: 176rpx;
  height: var(--card-thumb-size, 176rpx);
  margin-right: 16rpx;
  margin-right: var(--padding-xs, 16rpx);
}
.van-card__thumb:empty {
  display: none;
}
.van-card__img {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  border-radius: var(--border-radius-lg, 16rpx);
}
.van-card__content {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  /* hack for flex box ellipsis */
  min-height: 176rpx;
  min-height: var(--card-thumb-size, 176rpx);
}
.van-card__content--center {
  justify-content: center;
}
.van-card__title,
.van-card__desc {
  word-wrap: break-word;
}
.van-card__title {
  font-weight: bold;
  line-height: 32rpx;
  line-height: var(--card-title-line-height, 32rpx);
}
.van-card__desc {
  line-height: 40rpx;
  line-height: var(--card-desc-line-height, 40rpx);
  color: #646566;
  color: var(--card-desc-color, #646566);
}
.van-card__bottom {
  line-height: 40rpx;
}
.van-card__price {
  display: inline-block;
  font-weight: bold;
  color: #ee0a24;
  color: var(--card-price-color, #ee0a24);
  font-size: 24rpx;
  font-size: var(--card-price-font-size, 24rpx);
}
.van-card__price-integer {
  font-size: 32rpx;
  font-size: var(--card-price-integer-font-size, 32rpx);
  font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
  font-family: var(--card-price-font-family, Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif);
}
.van-card__price-decimal {
  font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
  font-family: var(--card-price-font-family, Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif);
}
.van-card__origin-price {
  display: inline-block;
  margin-left: 10rpx;
  text-decoration: line-through;
  font-size: 20rpx;
  font-size: var(--card-origin-price-font-size, 20rpx);
  color: #646566;
  color: var(--card-origin-price-color, #646566);
}
.van-card__num {
  float: right;
}
.van-card__tag {
  position: absolute;
  top: 4rpx;
  left: 0;
}
.van-card__footer {
  flex: none;
  width: 100%;
  text-align: right;
}
</style>