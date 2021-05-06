<template>
<uni-shadow-root class="vant-notice-bar-index"><view v-if="show" :class="'custom-class '+(utils.bem('notice-bar', { withicon: mode, wrapable }))" :style="'color: '+(color)+'; background-color: '+(backgroundColor)+';'" @click="onClick">
  <van-icon v-if="leftIcon" size="16px" :name="leftIcon" class="van-notice-bar__left-icon"></van-icon>
  <slot v-else name="left-icon"></slot>

  <view class="van-notice-bar__wrap">
    <view :class="'van-notice-bar__content '+(!scrollable && !wrapable ? 'van-ellipsis' : '')" :animation="animationData">
      {{ text }}
    </view>
  </view>

  <van-icon v-if="mode === 'closeable'" class="van-notice-bar__right-icon" name="cross" @click.native.stop.prevent="onClickIcon"></van-icon>
  <navigator v-else-if="mode === 'link'" :url="url" :open-type="openType">
    <van-icon class="van-notice-bar__right-icon" name="arrow"></van-icon>
  </navigator>
  <slot v-else name="right-icon"></slot>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/notice-bar/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var FONT_COLOR = '#ed6a0c';
var BG_COLOR = '#fffbe8';
component_1.VantComponent({
    props: {
        text: {
            type: String,
            value: '',
            observer: function () {
                var _this = this;
                wx.nextTick(function () {
                    _this.init();
                });
            },
        },
        mode: {
            type: String,
            value: ''
        },
        url: {
            type: String,
            value: ''
        },
        openType: {
            type: String,
            value: 'navigate'
        },
        delay: {
            type: Number,
            value: 1
        },
        speed: {
            type: Number,
            value: 50,
            observer: function () {
                var _this = this;
                wx.nextTick(function () {
                    _this.init();
                });
            }
        },
        scrollable: {
            type: Boolean,
            value: true
        },
        leftIcon: {
            type: String,
            value: ''
        },
        color: {
            type: String,
            value: FONT_COLOR
        },
        backgroundColor: {
            type: String,
            value: BG_COLOR
        },
        wrapable: Boolean
    },
    data: {
        show: true
    },
    created: function () {
        this.resetAnimation = wx.createAnimation({
            duration: 0,
            timingFunction: 'linear'
        });
    },
    destroyed: function () {
        this.timer && clearTimeout(this.timer);
    },
    methods: {
        init: function () {
            var _this = this;
            Promise.all([
                this.getRect('.van-notice-bar__content'),
                this.getRect('.van-notice-bar__wrap')
            ]).then(function (rects) {
                var contentRect = rects[0], wrapRect = rects[1];
                if (contentRect == null ||
                    wrapRect == null ||
                    !contentRect.width ||
                    !wrapRect.width) {
                    return;
                }
                var _a = _this.data, speed = _a.speed, scrollable = _a.scrollable, delay = _a.delay;
                if (scrollable && wrapRect.width < contentRect.width) {
                    var duration = (contentRect.width / speed) * 1000;
                    _this.wrapWidth = wrapRect.width;
                    _this.contentWidth = contentRect.width;
                    _this.duration = duration;
                    _this.animation = wx.createAnimation({
                        duration: duration,
                        timingFunction: 'linear',
                        delay: delay
                    });
                    _this.scroll();
                }
            });
        },
        scroll: function () {
            var _this = this;
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.setData({
                animationData: this.resetAnimation
                    .translateX(this.wrapWidth)
                    .step()
                    .export()
            });
            setTimeout(function () {
                _this.setData({
                    animationData: _this.animation
                        .translateX(-_this.contentWidth)
                        .step()
                        .export()
                });
            }, 20);
            this.timer = setTimeout(function () {
                _this.scroll();
            }, this.duration);
        },
        onClickIcon: function () {
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.setData({ show: false });
        },
        onClick: function (event) {
            this.$emit('click', event);
        }
    }
});
export default global['__wxComponents']['vant/notice-bar/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-notice-bar {
  display: flex;
  align-items: center;
  height: 80rpx;
  height: var(--notice-bar-height, 80rpx);
  padding: 0 32rpx;
  padding: var(--notice-bar-padding, 0 32rpx);
  font-size: 28rpx;
  font-size: var(--notice-bar-font-size, 28rpx);
  color: #ed6a0c;
  color: var(--notice-bar-text-color, #ed6a0c);
  line-height: 48rpx;
  line-height: var(--notice-bar-line-height, 48rpx);
  background-color: #fffbe8;
  background-color: var(--notice-bar-background-color, #fffbe8);
}
.van-notice-bar--withicon {
  position: relative;
  padding-right: 80rpx;
}
.van-notice-bar--wrapable {
  height: auto;
  padding: 16rpx 32rpx;
  padding: var(--notice-bar-wrapable-padding, 16rpx 32rpx);
}
.van-notice-bar--wrapable .van-notice-bar__wrap {
  height: auto;
}
.van-notice-bar--wrapable .van-notice-bar__content {
  position: relative;
  white-space: normal;
}
.van-notice-bar__left-icon {
  display: flex;
  align-items: center;
  margin-right: 8rpx;
  vertical-align: middle;
  font-size: 32rpx;
  font-size: var(--notice-bar-icon-size, 32rpx);
  min-width: 44rpx;
  min-width: var(--notice-bar-icon-min-width, 44rpx);
}
.van-notice-bar__right-icon {
  position: absolute;
  top: 20rpx;
  right: 30rpx;
  font-size: 32rpx;
  font-size: var(--notice-bar-icon-size, 32rpx);
  min-width: 44rpx;
  min-width: var(--notice-bar-icon-min-width, 44rpx);
}
.van-notice-bar__wrap {
  position: relative;
  flex: 1;
  overflow: hidden;
  height: 48rpx;
  height: var(--notice-bar-line-height, 48rpx);
}
.van-notice-bar__content {
  position: absolute;
  white-space: nowrap;
}
.van-notice-bar__content.van-ellipsis {
  max-width: 100%;
}
</style>