<template>
<uni-shadow-root class="vant-radio-index"><view class="van-radio custom-class">
  <view v-if="labelPosition === 'left'" :class="'label-class '+(utils.bem('radio__label', [labelPosition, { disabled }]))" @click="onClickLabel">
    <slot></slot>
  </view>
  <view class="van-radio__icon-wrap" :style="'font-size: '+(utils.addUnit(iconSize))+';'" @click="onChange">
    <slot v-if="useIconSlot" name="icon"></slot>
    <van-icon v-else name="success" :class="utils.bem('radio__icon', [shape, { disabled, checked: value === name }])" :style="'font-size: '+(utils.addUnit(iconSize))+';'+(checkedColor && !disabled && value === name ? 'border-color:' + checkedColor + '; background-color:' + checkedColor + ';' : '')" custom-class="icon-class" :custom-style="'line-height: '+(utils.addUnit(iconSize))+';font-size: .8em;display: block;'"></van-icon>
  </view>
  <view v-if="labelPosition === 'right'" :class="'label-class '+(utils.bem('radio__label', [labelPosition, { disabled }]))" @click="onClickLabel">
    <slot></slot>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/radio/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    field: true,
    relation: {
        name: 'radio-group',
        type: 'ancestor',
        current: 'radio',
    },
    classes: ['icon-class', 'label-class'],
    props: {
        name: null,
        value: null,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: {
            type: String,
            value: 'right'
        },
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: 'round'
        },
        iconSize: {
            type: null,
            value: 20
        }
    },
    methods: {
        emitChange: function (value) {
            var instance = this.parent || this;
            instance.$emit('input', value);
            instance.$emit('change', value);
        },
        onChange: function () {
            if (!this.data.disabled) {
                this.emitChange(this.data.name);
            }
        },
        onClickLabel: function () {
            var _a = this.data, disabled = _a.disabled, labelDisabled = _a.labelDisabled, name = _a.name;
            if (!disabled && !labelDisabled) {
                this.emitChange(name);
            }
        }
    }
});
export default global['__wxComponents']['vant/radio/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-radio {
  display: flex;
  align-items: center;
  overflow: hidden;
  user-select: none;
}
.van-radio__icon-wrap {
  flex: none;
}
.van-radio__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 1em;
  height: 1em;
  color: transparent;
  text-align: center;
  transition-property: color, border-color, background-color;
  border: 2rpx solid #c8c9cc;
  border: 2rpx solid var(--radio-border-color, #c8c9cc);
  font-size: 40rpx;
  font-size: var(--radio-size, 40rpx);
  transition-duration: 0.2s;
  transition-duration: var(--radio-transition-duration, 0.2s);
}
.van-radio__icon--round {
  border-radius: 100%;
}
.van-radio__icon--checked {
  color: #fff;
  color: var(--white, #fff);
  background-color: #1989fa;
  background-color: var(--radio-checked-icon-color, #1989fa);
  border-color: #1989fa;
  border-color: var(--radio-checked-icon-color, #1989fa);
}
.van-radio__icon--disabled {
  background-color: #ebedf0;
  background-color: var(--radio-disabled-background-color, #ebedf0);
  border-color: #c8c9cc;
  border-color: var(--radio-disabled-icon-color, #c8c9cc);
}
.van-radio__icon--disabled.van-radio__icon--checked {
  color: #c8c9cc;
  color: var(--radio-disabled-icon-color, #c8c9cc);
}
.van-radio__label {
  word-wrap: break-word;
  margin-left: 20rpx;
  margin-left: var(--radio-label-margin, 20rpx);
  color: #323233;
  color: var(--radio-label-color, #323233);
  line-height: 40rpx;
  line-height: var(--radio-size, 40rpx);
}
.van-radio__label--left {
  float: left;
  margin: 0 20rpx 0 0;
  margin: 0 var(--radio-label-margin, 20rpx) 0 0;
}
.van-radio__label--disabled {
  color: #c8c9cc;
  color: var(--radio-disabled-label-color, #c8c9cc);
}
.van-radio__label:empty {
  margin: 0;
}
</style>