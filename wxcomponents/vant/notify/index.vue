<template>
<uni-shadow-root class="vant-notify-index"><van-transition name="slide-down" :show="show" custom-class="van-notify__container" :custom-style="'z-index: '+(zIndex)+';'" @click.native="onTap">
  <view :class="'van-notify van-notify--'+(type)" :style="'background:'+(background)+';color:'+(color)+';'">
    <view v-if="safeAreaInsetTop" :style="'height: '+(statusBarHeight)+'px'"></view>
    <text>{{ message }}</text>
  </view>
</van-transition></uni-shadow-root>
</template>

<script>
import VanTransition from '../transition/index.vue'
global['__wxVueOptions'] = {components:{'van-transition': VanTransition}}

global['__wxRoute'] = 'vant/notify/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var color_1 = require("../common/color");
component_1.VantComponent({
    props: {
        message: String,
        background: String,
        type: {
            type: String,
            value: 'danger'
        },
        color: {
            type: String,
            value: color_1.WHITE
        },
        duration: {
            type: Number,
            value: 3000
        },
        zIndex: {
            type: Number,
            value: 110
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: false
        }
    },
    data: {
        show: false,
    },
    created: function () {
        var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
        this.setData({ statusBarHeight: statusBarHeight });
    },
    methods: {
        show: function () {
            var _this = this;
            var _a = this.data, duration = _a.duration, onOpened = _a.onOpened;
            clearTimeout(this.timer);
            this.setData({ show: true });
            wx.nextTick(onOpened);
            if (duration > 0 && duration !== Infinity) {
                this.timer = setTimeout(function () {
                    _this.hide();
                }, duration);
            }
        },
        hide: function () {
            var onClose = this.data.onClose;
            clearTimeout(this.timer);
            this.setData({ show: false });
            wx.nextTick(onClose);
        },
        onTap: function (event) {
            var onClick = this.data.onClick;
            if (onClick) {
                onClick(event.detail);
            }
        }
    }
});
export default global['__wxComponents']['vant/notify/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-notify {
  text-align: center;
  word-wrap: break-word;
  padding: 12rpx 30rpx;
  padding: var(--notify-padding, 12rpx 30rpx);
  font-size: 28rpx;
  font-size: var(--notify-font-size, 28rpx);
  line-height: 40rpx;
  line-height: var(--notify-line-height, 40rpx);
}
.van-notify__container {
  position: fixed;
  top: 0;
  box-sizing: border-box;
  width: 100%;
}
.van-notify--primary {
  background-color: #1989fa;
  background-color: var(--notify-primary-background-color, #1989fa);
}
.van-notify--success {
  background-color: #07c160;
  background-color: var(--notify-success-background-color, #07c160);
}
.van-notify--danger {
  background-color: #ee0a24;
  background-color: var(--notify-danger-background-color, #ee0a24);
}
.van-notify--warning {
  background-color: #ff976a;
  background-color: var(--notify-warning-background-color, #ff976a);
}
</style>