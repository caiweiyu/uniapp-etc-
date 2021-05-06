<template>
<uni-shadow-root class="vant-stepper-index"><view class="van-stepper custom-class">
  <view v-if="showMinus" data-type="minus" :style="buttonStyle" :class="'minus-class '+(utils.bem('stepper__minus', { disabled: disabled || disableMinus || value <= min }))" hover-class="van-stepper__minus--hover" hover-stay-time="70" @click="onTap" @touchstart="onTouchStart" @touchend="onTouchEnd"></view>
  <input :type="integer ? 'number' : 'digit'" :class="'input-class '+(utils.bem('stepper__input', { disabled: disabled || disableInput }))" :style="inputStyle" :value="value" :focus="focus" :disabled="disabled || disableInput" @input="onInput" @focus="onFocus" @blur="onBlur"></input>
  <view v-if="showPlus" data-type="plus" :style="buttonStyle" :class="'plus-class '+(utils.bem('stepper__plus', { disabled: disabled || disablePlus || value >= max }))" hover-class="van-stepper__plus--hover" hover-stay-time="70" @click="onTap" @touchstart="onTouchStart" @touchend="onTouchEnd"></view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>

global['__wxRoute'] = 'vant/stepper/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
var LONG_PRESS_START_TIME = 600;
var LONG_PRESS_INTERVAL = 200;
// add num and avoid float number
function add(num1, num2) {
    var cardinal = Math.pow(10, 10);
    return Math.round((num1 + num2) * cardinal) / cardinal;
}
component_1.VantComponent({
    field: true,
    classes: ['input-class', 'plus-class', 'minus-class'],
    props: {
        value: {
            type: null,
            observer: function (value) {
                if (value === '') {
                    return;
                }
                var newValue = this.range(value);
                if (typeof newValue === 'number' && +this.data.value !== newValue) {
                    this.setData({ value: newValue });
                }
            },
        },
        integer: Boolean,
        disabled: Boolean,
        inputWidth: {
            type: null,
            observer: function () {
                this.setData({
                    inputStyle: this.computeInputStyle()
                });
            },
        },
        buttonSize: {
            type: null,
            observer: function () {
                this.setData({
                    inputStyle: this.computeInputStyle(),
                    buttonStyle: this.computeButtonStyle()
                });
            }
        },
        asyncChange: Boolean,
        disableInput: Boolean,
        decimalLength: {
            type: Number,
            value: null
        },
        min: {
            type: null,
            value: 1
        },
        max: {
            type: null,
            value: Number.MAX_SAFE_INTEGER
        },
        step: {
            type: null,
            value: 1
        },
        showPlus: {
            type: Boolean,
            value: true
        },
        showMinus: {
            type: Boolean,
            value: true
        },
        disablePlus: Boolean,
        disableMinus: Boolean,
        longPress: {
            type: Boolean,
            value: true
        },
    },
    data: {
        focus: false,
        inputStyle: '',
        buttonStyle: ''
    },
    created: function () {
        this.setData({
            value: this.range(this.data.value)
        });
    },
    methods: {
        isDisabled: function (type) {
            if (type === 'plus') {
                return this.data.disabled || this.data.disablePlus || this.data.value >= this.data.max;
            }
            return this.data.disabled || this.data.disableMinus || this.data.value <= this.data.min;
        },
        onFocus: function (event) {
            this.$emit('focus', event.detail);
        },
        onBlur: function (event) {
            var value = this.range(this.data.value);
            this.triggerInput(value);
            this.$emit('blur', event.detail);
        },
        // limit value range
        range: function (value) {
            value = String(value).replace(/[^0-9.-]/g, '');
            // format range
            value = value === '' ? 0 : +value;
            value = Math.max(Math.min(this.data.max, value), this.data.min);
            // format decimal
            if (utils_1.isDef(this.data.decimalLength)) {
                value = value.toFixed(this.data.decimalLength);
            }
            return value;
        },
        onInput: function (event) {
            var _a = (event.detail || {}).value, value = _a === void 0 ? '' : _a;
            this.triggerInput(value);
        },
        onChange: function () {
            var type = this.type;
            if (this.isDisabled(type)) {
                this.$emit('overlimit', type);
                return;
            }
            var diff = type === 'minus' ? -this.data.step : +this.data.step;
            var value = add(+this.data.value, diff);
            this.triggerInput(this.range(value));
            this.$emit(type);
        },
        longPressStep: function () {
            var _this = this;
            this.longPressTimer = setTimeout(function () {
                _this.onChange();
                _this.longPressStep();
            }, LONG_PRESS_INTERVAL);
        },
        onTap: function (event) {
            var type = event.currentTarget.dataset.type;
            this.type = type;
            this.onChange();
        },
        onTouchStart: function (event) {
            var _this = this;
            if (!this.data.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
            var type = event.currentTarget.dataset.type;
            this.type = type;
            this.isLongPress = false;
            this.longPressTimer = setTimeout(function () {
                _this.isLongPress = true;
                _this.onChange();
                _this.longPressStep();
            }, LONG_PRESS_START_TIME);
        },
        onTouchEnd: function () {
            if (!this.data.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
        },
        triggerInput: function (value) {
            this.setData({
                value: this.data.asyncChange ? this.data.value : value
            });
            this.$emit('change', value);
        },
        computeInputStyle: function () {
            var style = '';
            if (this.data.inputWidth) {
                style = "width: " + utils_1.addUnit(this.data.inputWidth) + ";";
            }
            if (this.data.buttonSize) {
                style += "height: " + utils_1.addUnit(this.data.buttonSize) + ";";
            }
            return style;
        },
        computeButtonStyle: function () {
            var style = '';
            var size = utils_1.addUnit(this.data.buttonSize);
            if (this.data.buttonSize) {
                style = "width: " + size + ";height: " + size + ";";
            }
            return style;
        }
    }
});
export default global['__wxComponents']['vant/stepper/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-stepper {
  font-size: 0;
}
.van-stepper__minus,
.van-stepper__plus {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  margin: 2rpx;
  vertical-align: middle;
  border: 0;
  background-color: #f2f3f5;
  background-color: var(--stepper-background-color, #f2f3f5);
  color: #323233;
  color: var(--stepper-button-icon-color, #323233);
  width: 56rpx;
  width: var(--stepper-input-height, 56rpx);
  height: 56rpx;
  height: var(--stepper-input-height, 56rpx);
  padding: 8rpx;
  padding: var(--padding-base, 8rpx);
}
.van-stepper__minus::before,
.van-stepper__plus::before {
  width: 18rpx;
  height: 2rpx;
}
.van-stepper__minus::after,
.van-stepper__plus::after {
  width: 2rpx;
  height: 18rpx;
}
.van-stepper__minus::before,
.van-stepper__plus::before,
.van-stepper__minus::after,
.van-stepper__plus::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-color: currentColor;
  content: '';
}
.van-stepper__minus--hover,
.van-stepper__plus--hover {
  background-color: #e8e8e8;
  background-color: var(--stepper-active-color, #e8e8e8);
}
.van-stepper__minus--disabled,
.van-stepper__plus--disabled {
  color: #c8c9cc;
  color: var(--stepper-button-disabled-icon-color, #c8c9cc);
  background-color: #f7f8fa;
  background-color: var(--stepper-button-disabled-color, #f7f8fa);
}
.van-stepper__minus--disabled.van-stepper__minus--hover,
.van-stepper__minus--disabled.van-stepper__plus--hover,
.van-stepper__plus--disabled.van-stepper__minus--hover,
.van-stepper__plus--disabled.van-stepper__plus--hover {
  background-color: #f7f8fa;
  background-color: var(--stepper-button-disabled-color, #f7f8fa);
}
.van-stepper__minus {
  border-radius: 8rpx 0 0 8rpx;
  border-radius: var(--stepper-border-radius, 8rpx) 0 0 var(--stepper-border-radius, 8rpx);
}
.van-stepper__minus::after {
  display: none;
}
.van-stepper__plus {
  border-radius: 0 8rpx 8rpx 0;
  border-radius: 0 var(--stepper-border-radius, 8rpx) var(--stepper-border-radius, 8rpx) 0;
}
.van-stepper__input {
  display: inline-block;
  box-sizing: border-box;
  min-height: 0;
  margin: 2rpx;
  padding: 2rpx;
  text-align: center;
  vertical-align: middle;
  border: 0;
  border-width: 2rpx 0;
  border-radius: 0;
  -webkit-appearance: none;
  font-size: 28rpx;
  font-size: var(--stepper-input-font-size, 28rpx);
  color: #323233;
  color: var(--stepper-input-text-color, #323233);
  background-color: #f2f3f5;
  background-color: var(--stepper-background-color, #f2f3f5);
  width: 64rpx;
  width: var(--stepper-input-width, 64rpx);
  height: 56rpx;
  height: var(--stepper-input-height, 56rpx);
}
.van-stepper__input--disabled {
  color: #c8c9cc;
  color: var(--stepper-input-disabled-text-color, #c8c9cc);
  background-color: #f2f3f5;
  background-color: var(--stepper-input-disabled-background-color, #f2f3f5);
}
</style>