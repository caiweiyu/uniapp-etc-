<template>
<uni-shadow-root class="vant-uploader-index"><view class="van-uploader">
  <view class="van-uploader__wrapper">
    
    <view v-for="(item,index) in (lists)" :key="item.index" v-if="previewImage" class="van-uploader__preview">
      <image v-if="item.isImage" :mode="imageFit" :src="item.url || item.path" :alt="item.name || ('图片' + index)" class="van-uploader__preview-image" :style="'width: '+(utils.addUnit(previewSize))+'; height: '+(utils.addUnit(previewSize))+';'" :data-url="item.url || item.path" @click="doPreviewImage"></image>
      <view v-else class="van-uploader__file" :style="'width: '+(utils.addUnit(previewSize))+'; height: '+(utils.addUnit(previewSize))+';'">
        <van-icon name="description" class="van-uploader__file-icon"></van-icon>
        <view class="van-uploader__file-name van-ellipsis">{{ item.name || item.url || item.path }}</view>
      </view>
      <van-icon v-if="deletable" name="clear" class="van-uploader__preview-delete" :data-index="index" @click.native="deleteItem"></van-icon>
    </view>

    
    <block v-if="isInCount">
      <view class="van-uploader__slot" @click="startUpload">
        <slot></slot>
      </view>

      
      <view :class="'van-uploader__upload '+(disabled ? 'van-uploader__upload--disabled': '')" :style="'width: '+(utils.addUnit(previewSize))+'; height: '+(utils.addUnit(previewSize))+';'" @click="startUpload">
        <van-icon name="plus" class="van-uploader__upload-icon"></van-icon>
        <text v-if="uploadText" class="van-uploader__upload-text">{{ uploadText }}</text>
      </view>
    </block>
  </view>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/uploader/index'
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var utils_1 = require("./utils");
component_1.VantComponent({
    props: {
        disabled: Boolean,
        multiple: Boolean,
        uploadText: String,
        useBeforeRead: Boolean,
        previewSize: {
            type: null,
            value: 90
        },
        name: {
            type: [Number, String],
            value: ''
        },
        accept: {
            type: String,
            value: 'image'
        },
        sizeType: {
            type: Array,
            value: ['original', 'compressed']
        },
        capture: {
            type: Array,
            value: ['album', 'camera']
        },
        fileList: {
            type: Array,
            value: [],
            observer: 'formatFileList'
        },
        maxSize: {
            type: Number,
            value: Number.MAX_VALUE
        },
        maxCount: {
            type: Number,
            value: 100
        },
        deletable: {
            type: Boolean,
            value: true
        },
        previewImage: {
            type: Boolean,
            value: true
        },
        previewFullImage: {
            type: Boolean,
            value: true
        },
        imageFit: {
            type: String,
            value: 'scaleToFill'
        },
        camera: {
            type: String,
            value: 'back'
        },
        compressed: {
            type: Boolean,
            value: true
        },
        maxDuration: {
            type: Number,
            value: 60
        }
    },
    data: {
        lists: [],
        computedPreviewSize: '',
        isInCount: true
    },
    methods: {
        formatFileList: function () {
            var _a = this.data, _b = _a.fileList, fileList = _b === void 0 ? [] : _b, maxCount = _a.maxCount;
            var lists = fileList.map(function (item) { return (__assign(__assign({}, item), { isImage: typeof item.isImage === 'undefined' ? utils_1.isImageFile(item) : item.isImage })); });
            this.setData({ lists: lists, isInCount: lists.length < maxCount });
        },
        startUpload: function () {
            var _this = this;
            if (this.data.disabled)
                return;
            var _a = this.data, _b = _a.name, name = _b === void 0 ? '' : _b, capture = _a.capture, maxCount = _a.maxCount, multiple = _a.multiple, maxSize = _a.maxSize, accept = _a.accept, sizeType = _a.sizeType, lists = _a.lists, camera = _a.camera, compressed = _a.compressed, maxDuration = _a.maxDuration, _c = _a.useBeforeRead // 是否定义了 beforeRead
            , useBeforeRead = _c === void 0 ? false : _c // 是否定义了 beforeRead
            ;
            var chooseFile = null;
            var newMaxCount = maxCount - lists.length;
            // 设置为只选择图片的时候使用 chooseImage 来实现
            if (accept === 'image') {
                chooseFile = new Promise(function (resolve, reject) {
                    wx.chooseImage({
                        count: multiple ? (newMaxCount > 9 ? 9 : newMaxCount) : 1,
                        sourceType: capture,
                        sizeType: sizeType,
                        success: resolve,
                        fail: reject
                    });
                });
            }
            else if (accept === 'video') {
                chooseFile = new Promise(function (resolve, reject) {
                    wx.chooseVideo({
                        sourceType: capture,
                        compressed: compressed,
                        maxDuration: maxDuration,
                        camera: camera,
                        success: resolve,
                        fail: reject
                    });
                });
            }
            else {
                chooseFile = new Promise(function (resolve, reject) {
                    wx.chooseMessageFile({
                        count: multiple ? newMaxCount : 1,
                        type: 'file',
                        success: resolve,
                        fail: reject
                    });
                });
            }
            chooseFile
                .then(function (res) {
                var file = null;
                if (utils_1.isVideo(res, accept)) {
                    file = __assign({ path: res.tempFilePath }, res);
                }
                else {
                    file = multiple ? res.tempFiles : res.tempFiles[0];
                }
                // 检查文件大小
                if (file instanceof Array) {
                    var sizeEnable = file.every(function (item) { return item.size <= maxSize; });
                    if (!sizeEnable) {
                        _this.$emit('oversize', { name: name });
                        return;
                    }
                }
                else if (file.size > maxSize) {
                    _this.$emit('oversize', { name: name });
                    return;
                }
                // 触发上传之前的钩子函数
                if (useBeforeRead) {
                    _this.$emit('before-read', {
                        file: file,
                        name: name,
                        callback: function (result) {
                            if (result) {
                                // 开始上传
                                _this.$emit('after-read', { file: file, name: name });
                            }
                        }
                    });
                }
                else {
                    _this.$emit('after-read', { file: file, name: name });
                }
            })
                .catch(function (error) {
                _this.$emit('error', error);
            });
        },
        deleteItem: function (event) {
            var index = event.currentTarget.dataset.index;
            this.$emit('delete', { index: index, name: this.data.name });
        },
        doPreviewImage: function (event) {
            if (!this.data.previewFullImage)
                return;
            var curUrl = event.currentTarget.dataset.url;
            var images = this.data.lists
                .filter(function (item) { return item.isImage; })
                .map(function (item) { return item.url || item.path; });
            this.$emit('click-preview', { url: curUrl, name: this.data.name });
            wx.previewImage({
                urls: images,
                current: curUrl,
                fail: function () {
                    wx.showToast({ title: '预览图片失败', icon: 'none' });
                }
            });
        }
    }
});
export default global['__wxComponents']['vant/uploader/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-uploader {
  position: relative;
  display: inline-block;
}
.van-uploader__wrapper {
  display: flex;
  flex-wrap: wrap;
}
.van-uploader__slot:empty {
  display: none;
}
.van-uploader__slot:not(:empty) + .van-uploader__upload {
  display: none !important;
}
.van-uploader__upload {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 160rpx;
  height: 160rpx;
  margin: 0 16rpx 16rpx 0;
  background-color: #fff;
  border: 2rpx dashed #ebedf0;
  border-radius: 8rpx;
}
.van-uploader__upload-icon {
  display: inline-block;
  width: 48rpx;
  height: 48rpx;
  color: #969799;
  font-size: 48rpx;
}
.van-uploader__upload-text {
  margin-top: 16rpx;
  color: #969799;
  font-size: 24rpx;
}
.van-uploader__upload--disabled {
  opacity: 0.5;
  opacity: var(--uploader-disabled-opacity, 0.5);
}
.van-uploader__preview {
  position: relative;
  margin: 0 16rpx 16rpx 0;
}
.van-uploader__preview-image {
  display: block;
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
}
.van-uploader__preview-delete {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  color: #969799;
  font-size: 36rpx;
  background-color: #fff;
  border-radius: 100%;
}
.van-uploader__file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  background-color: #f7f8fa;
  border-radius: 8rpx;
}
.van-uploader__file-icon {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  color: #646566;
  font-size: 40rpx;
}
.van-uploader__file-name {
  box-sizing: border-box;
  width: 100%;
  margin-top: 16rpx;
  padding: 0 10rpx;
  color: #646566;
  font-size: 24rpx;
  text-align: center;
}
</style>