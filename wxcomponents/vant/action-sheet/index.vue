<template>
<uni-shadow-root class="vant-action-sheet-index"><van-popup :show="show" position="bottom" :round="round" :z-index="zIndex" :overlay="overlay" custom-class="van-action-sheet" :safe-area-inset-bottom="safeAreaInsetBottom" :close-on-click-overlay="closeOnClickOverlay" @close="onClickOverlay">
  <view v-if="title" class="van-hairline--bottom van-action-sheet__header">
    {{ title }}
    <van-icon name="close" custom-class="van-action-sheet__close" @click="onClose"></van-icon>
  </view>
  <view v-if="description" class="van-action-sheet__description">
    {{ description }}
  </view>
  <view v-if="actions && actions.length">
    
    <button v-for="(item,index) in (actions)" :key="item.index" :open-type="item.openType" :style="item.color ? 'color: ' + item.color : ''" :class="(utils.bem('action-sheet__item', { disabled: item.disabled || item.loading }))+' van-hairline--top '+(item.className || '')" hover-class="van-action-sheet__item--hover" :data-index="index" @click="onSelect" @getuserinfo="bindGetUserInfo" @contact="bindContact" @getphonenumber="bindGetPhoneNumber" @error="bindError" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting" :lang="lang" :session-from="sessionFrom" :send-message-title="sendMessageTitle" :send-message-path="sendMessagePath" :send-message-img="sendMessageImg" :show-message-card="showMessageCard" :app-parameter="appParameter">
      <block v-if="(!item.loading)">
        {{ item.name }}
        <text v-if="item.subname" class="van-action-sheet__subname">{{ item.subname }}</text>
      </block>
      <van-loading v-else custom-class="van-action-sheet__loading" size="20px"></van-loading>
    </button>
  </view>
  <slot></slot>
  <view v-if="cancelText" class="van-action-sheet__cancel" hover-class="van-action-sheet__cancel--hover" hover-stay-time="70" @click="onCancel">
    {{ cancelText }}
  </view>
</van-popup></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
import VanPopup from '../popup/index.vue'
import VanLoading from '../loading/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon,'van-popup': VanPopup,'van-loading': VanLoading}}

global['__wxRoute'] = 'vant/action-sheet/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var button_1 = require("../mixins/button");
var open_type_1 = require("../mixins/open-type");
component_1.VantComponent({
    mixins: [button_1.button, open_type_1.openType],
    props: {
        show: Boolean,
        title: String,
        cancelText: String,
        description: String,
        round: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 100
        },
        actions: {
            type: Array,
            value: []
        },
        overlay: {
            type: Boolean,
            value: true
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true
        },
        closeOnClickAction: {
            type: Boolean,
            value: true
        },
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        onSelect: function (event) {
            var index = event.currentTarget.dataset.index;
            var item = this.data.actions[index];
            if (item && !item.disabled && !item.loading) {
                this.$emit('select', item);
                if (this.data.closeOnClickAction) {
                    this.onClose();
                }
            }
        },
        onCancel: function () {
            this.$emit('cancel');
        },
        onClose: function () {
            this.$emit('close');
        },
        onClickOverlay: function () {
            this.$emit('click-overlay');
            this.onClose();
        }
    }
});
export default global['__wxComponents']['vant/action-sheet/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-action-sheet {
  max-height: 90% !important;
  max-height: var(--action-sheet-max-height, 90%) !important;
  color: #323233;
  color: var(--action-sheet-item-text-color, #323233);
}
.van-action-sheet__item,
.van-action-sheet__cancel {
  text-align: center;
  font-size: 32rpx;
  font-size: var(--action-sheet-item-font-size, 32rpx);
  line-height: 100rpx;
  line-height: var(--action-sheet-item-height, 100rpx);
  background-color: #fff;
  background-color: var(--action-sheet-item-background, #fff);
}
.van-action-sheet__item--hover,
.van-action-sheet__cancel--hover {
  background-color: #f2f3f5;
  background-color: var(--active-color, #f2f3f5);
}
.van-action-sheet__cancel::before {
  display: block;
  content: ' ';
  height: 16rpx;
  height: var(--action-sheet-cancel-padding-top, 16rpx);
  background-color: #f7f8fa;
  background-color: var(--action-sheet-cancel-padding-color, #f7f8fa);
}
.van-action-sheet__item--disabled {
  color: #c8c9cc;
  color: var(--action-sheet-item-disabled-text-color, #c8c9cc);
}
.van-action-sheet__item--disabled.van-action-sheet__item--hover {
  background-color: #fff;
  background-color: var(--action-sheet-item-background, #fff);
}
.van-action-sheet__subname {
  margin-left: 8rpx;
  margin-left: var(--padding-base, 8rpx);
  font-size: 24rpx;
  font-size: var(--action-sheet-subname-font-size, 24rpx);
  color: #646566;
  color: var(--action-sheet-subname-color, #646566);
}
.van-action-sheet__header {
  text-align: center;
  font-weight: 500;
  font-weight: var(--font-weight-bold, 500);
  font-size: 32rpx;
  font-size: var(--action-sheet-header-font-size, 32rpx);
  line-height: 88rpx;
  line-height: var(--action-sheet-header-height, 88rpx);
}
.van-action-sheet__description {
  text-align: center;
  padding: 32rpx;
  padding: var(--padding-md, 32rpx);
  color: #646566;
  color: var(--action-sheet-description-color, #646566);
  font-size: 28rpx;
  font-size: var(--action-sheet-description-font-size, 28rpx);
  line-height: 40rpx;
  line-height: var(--action-sheet-description-line-height, 40rpx);
}
.van-action-sheet__close {
  position: absolute !important;
  top: 0;
  right: 0;
  line-height: inherit !important;
  padding: 0 24rpx;
  padding: var(--action-sheet-close-icon-padding, 0 24rpx);
  font-size: 36rpx !important;
  font-size: var(--action-sheet-close-icon-size, 36rpx) !important;
  color: #969799;
  color: var(--action-sheet-close-icon-color, #969799);
}
.van-action-sheet__loading {
  display: flex !important;
  height: 100rpx;
  height: var(--action-sheet-item-height, 100rpx);
}
</style>