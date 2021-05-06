<template>
<uni-shadow-root class="vant-popup-index"><van-overlay v-if="overlay" :show="show" :z-index="zIndex" :custom-style="overlayStyle" :duration="duration" @click="onClickOverlay"></van-overlay>
<view v-if="inited" :class="'custom-class '+(classes)+' '+(utils.bem('popup', [position, { round, safe: safeAreaInsetBottom, safeTop: safeAreaInsetTop }]))" :style="'z-index: '+(zIndex)+'; -webkit-transition-duration:'+(currentDuration)+'ms; transition-duration:'+(currentDuration)+'ms; '+(display ? '' : 'display: none;')+';'+(customStyle)" @transitionend="onTransitionEnd">
  <slot></slot>
  <van-icon v-if="closeable" :name="closeIcon" :class="'van-popup__close-icon van-popup__close-icon--'+(closeIconPosition)" @click.native="onClickCloseIcon"></van-icon>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
import VanOverlay from '../overlay/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon,'van-overlay': VanOverlay}}

global['__wxRoute'] = 'vant/popup/index'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var transition_1 = require("../mixins/transition");
component_1.VantComponent({
    classes: [
        'enter-class',
        'enter-active-class',
        'enter-to-class',
        'leave-class',
        'leave-active-class',
        'leave-to-class'
    ],
    mixins: [transition_1.transition(false)],
    props: {
        round: Boolean,
        closeable: Boolean,
        customStyle: String,
        overlayStyle: String,
        transition: {
            type: String,
            observer: 'observeClass'
        },
        zIndex: {
            type: Number,
            value: 100
        },
        overlay: {
            type: Boolean,
            value: true
        },
        closeIcon: {
            type: String,
            value: 'cross'
        },
        closeIconPosition: {
            type: String,
            value: 'top-right'
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true
        },
        position: {
            type: String,
            value: 'center',
            observer: 'observeClass'
        },
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: false
        }
    },
    created: function () {
        this.observeClass();
    },
    methods: {
        onClickCloseIcon: function () {
            this.$emit('close');
        },
        onClickOverlay: function () {
            this.$emit('click-overlay');
            if (this.data.closeOnClickOverlay) {
                this.$emit('close');
            }
        },
        observeClass: function () {
            var _a = this.data, transition = _a.transition, position = _a.position;
            var updateData = {
                name: transition || position
            };
            if (transition === 'none') {
                updateData.duration = 0;
            }
            this.setData(updateData);
        }
    }
});
export default global['__wxComponents']['vant/popup/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-popup {
  position: fixed;
  box-sizing: border-box;
  max-height: 100%;
  overflow-y: auto;
  transition-timing-function: ease;
  animation: ease both;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  background-color: var(--popup-background-color, #fff);
  border-radius: 20rpx 20rpx 0 0;
}
.van-popup--center {
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.van-popup--center.van-popup--round {
  border-radius: 40rpx;
  border-radius: var(--popup-round-border-radius, 40rpx);
}
.van-popup--top {
  top: 0;
  left: 0;
  width: 100%;
}
.van-popup--top.van-popup--round {
  border-radius: 0 0 40rpx 40rpx;
  border-radius: 0 0 var(--popup-round-border-radius, 40rpx) var(--popup-round-border-radius, 40rpx);
}
.van-popup--right {
  top: 50%;
  right: 0;
  transform: translate3d(0, -50%, 0);
}
.van-popup--right.van-popup--round {
  border-radius: 40rpx 0 0 40rpx;
  border-radius: var(--popup-round-border-radius, 40rpx) 0 0 var(--popup-round-border-radius, 40rpx);
}
.van-popup--bottom {
  bottom: 0;
  left: 0;
  width: 100%;
}
.van-popup--bottom.van-popup--round {
  border-radius: 40rpx 40rpx 0 0;
  border-radius: var(--popup-round-border-radius, 40rpx) var(--popup-round-border-radius, 40rpx) 0 0;
}
.van-popup--left {
  top: 50%;
  left: 0;
  transform: translate3d(0, -50%, 0);
}
.van-popup--left.van-popup--round {
  border-radius: 0 40rpx 40rpx 0;
  border-radius: 0 var(--popup-round-border-radius, 40rpx) var(--popup-round-border-radius, 40rpx) 0;
}
.van-popup--bottom.van-popup--safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.van-popup--safeTop {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}
.van-popup__close-icon {
  position: absolute;
  z-index: 1;
  z-index: var(--popup-close-icon-z-index, 1);
  color: #969799;
  color: var(--popup-close-icon-color, #969799);
  font-size: 36rpx;
  font-size: var(--popup-close-icon-size, 36rpx);
}
.van-popup__close-icon--top-left {
  top: 32rpx;
  top: var(--popup-close-icon-margin, 32rpx);
  left: 32rpx;
  left: var(--popup-close-icon-margin, 32rpx);
}
.van-popup__close-icon--top-right {
  top: 32rpx;
  top: var(--popup-close-icon-margin, 32rpx);
  right: 32rpx;
  right: var(--popup-close-icon-margin, 32rpx);
}
.van-popup__close-icon--bottom-left {
  bottom: 32rpx;
  bottom: var(--popup-close-icon-margin, 32rpx);
  left: 32rpx;
  left: var(--popup-close-icon-margin, 32rpx);
}
.van-popup__close-icon--bottom-right {
  right: 32rpx;
  right: var(--popup-close-icon-margin, 32rpx);
  bottom: 32rpx;
  bottom: var(--popup-close-icon-margin, 32rpx);
}
.van-popup__close-icon:active {
  opacity: 0.6;
}
.van-scale-enter-active,
.van-scale-leave-active {
  transition-property: opacity, transform;
}
.van-scale-enter,
.van-scale-leave-to {
  transform: translate3d(-50%, -50%, 0) scale(0.7);
  opacity: 0;
}
.van-fade-enter-active,
.van-fade-leave-active {
  transition-property: opacity;
}
.van-fade-enter,
.van-fade-leave-to {
  opacity: 0;
}
.van-center-enter-active,
.van-center-leave-active {
  transition-property: opacity;
}
.van-center-enter,
.van-center-leave-to {
  opacity: 0;
}
.van-bottom-enter-active,
.van-bottom-leave-active,
.van-top-enter-active,
.van-top-leave-active,
.van-left-enter-active,
.van-left-leave-active,
.van-right-enter-active,
.van-right-leave-active {
  transition-property: transform;
}
.van-bottom-enter,
.van-bottom-leave-to {
  transform: translate3d(0, 100%, 0);
}
.van-top-enter,
.van-top-leave-to {
  transform: translate3d(0, -100%, 0);
}
.van-left-enter,
.van-left-leave-to {
  transform: translate3d(-100%, -50%, 0);
}
.van-right-enter,
.van-right-leave-to {
  transform: translate3d(100%, -50%, 0);
}
</style>