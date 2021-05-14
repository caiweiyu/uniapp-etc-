<template>
<uni-shadow-root class="vant-picker-index"><template v-if="wxTemplateName === 'toolbar'">
  <view v-if="showToolbar" class="van-picker__toolbar van-hairline--top-bottom toolbar-class">
    <view class="van-picker__cancel" hover-class="van-picker__cancel--hover" hover-stay-time="70" data-type="cancel" @click="_$self.$parent.$parent[('emit')]($event)">
      {{ cancelButtonText }}
    </view>
    <view v-if="title" class="van-picker__title van-ellipsis">{{ title }}</view>
    <view class="van-picker__confirm" hover-class="van-picker__confirm--hover" hover-stay-time="70" data-type="confirm" @click="_$self.$parent.$parent[('emit')]($event)">
      {{ confirmButtonText }}
    </view>
  </view>
</template>

<view class="van-picker custom-class">
  <toolbar v-bind="{showToolbar, cancelButtonText, title, confirmButtonText}" v-if="toolbarPosition === 'top'" wx-template-name="toolbar"></toolbar>
  <view v-if="loading" class="van-picker__loading">
    <loading color="#1989fa"></loading>
  </view>
  <view class="van-picker__columns" :style="'height: '+(itemHeight * visibleItemCount)+'px'" @touchmove.stop.prevent="_$self.$parent.$parent[('noop')]($event)">
    <picker-column v-for="(item,index) in (isSimple(columns) ? [columns] : columns)" :key="item.index" class="van-picker__column" :data-index="index" custom-class="column-class" :value-key="valueKey" :initial-options="isSimple(columns) ? item : item.values" :default-index="item.defaultIndex || defaultIndex" :item-height="itemHeight" :visible-item-count="visibleItemCount" active-class="active-class" @change="_$self.$parent.$parent[('onChange')]($event)"></picker-column>
    <view class="van-picker__frame van-hairline--top-bottom" :style="'height: '+(itemHeight)+'px'"></view>
  </view>
  <toolbar v-bind="{showToolbar, cancelButtonText, title, confirmButtonText}" v-if="toolbarPosition === 'bottom'" wx-template-name="toolbar"></toolbar>
</view></uni-shadow-root>
</template>
<wxs module="isSimple" src="./index-isSimple.wxs"></wxs>
<script>
import PickerColumn from '../picker-column/index.vue'
import Loading from '../loading/index.vue'
global['__wxVueOptions'] = {components:{'picker-column': PickerColumn,'loading': Loading}}

global['__wxRoute'] = 'vant/picker/index'
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
var shared_1 = require("./shared");
component_1.VantComponent({
    classes: ['active-class', 'toolbar-class', 'column-class'],
    props: __assign(__assign({}, shared_1.pickerProps), { valueKey: {
            type: String,
            value: 'text'
        }, toolbarPosition: {
            type: String,
            value: 'top'
        }, defaultIndex: {
            type: Number,
            value: 0
        }, columns: {
            type: Array,
            value: [],
            observer: function (columns) {
                if (columns === void 0) { columns = []; }
                this.simple = columns.length && !columns[0].values;
                this.children = this.selectAllComponents('.van-picker__column');
                if (Array.isArray(this.children) && this.children.length) {
                    this.setColumns().catch(function () { });
                }
            }
        } }),
    beforeCreate: function () {
        this.children = [];
    },
    methods: {
        noop: function () { },
        setColumns: function () {
            var _this = this;
            var data = this.data;
            var columns = this.simple ? [{ values: data.columns }] : data.columns;
            var stack = columns.map(function (column, index) {
                return _this.setColumnValues(index, column.values);
            });
            return Promise.all(stack);
        },
        emit: function (event) {
            var type = event.currentTarget.dataset.type;
            if (this.simple) {
                this.$emit(type, {
                    value: this.getColumnValue(0),
                    index: this.getColumnIndex(0)
                });
            }
            else {
                this.$emit(type, {
                    value: this.getValues(),
                    index: this.getIndexes()
                });
            }
        },
        onChange: function (event) {
            if (this.simple) {
                this.$emit('change', {
                    picker: this,
                    value: this.getColumnValue(0),
                    index: this.getColumnIndex(0)
                });
            }
            else {
                this.$emit('change', {
                    picker: this,
                    value: this.getValues(),
                    index: event.currentTarget.dataset.index
                });
            }
        },
        // get column instance by index
        getColumn: function (index) {
            return this.children[index];
        },
        // get column value by index
        getColumnValue: function (index) {
            var column = this.getColumn(index);
            return column && column.getValue();
        },
        // set column value by index
        setColumnValue: function (index, value) {
            var column = this.getColumn(index);
            if (column == null) {
                return Promise.reject(new Error('setColumnValue: 对应列不存在'));
            }
            return column.setValue(value);
        },
        // get column option index by column index
        getColumnIndex: function (columnIndex) {
            return (this.getColumn(columnIndex) || {}).data.currentIndex;
        },
        // set column option index by column index
        setColumnIndex: function (columnIndex, optionIndex) {
            var column = this.getColumn(columnIndex);
            if (column == null) {
                return Promise.reject(new Error('setColumnIndex: 对应列不存在'));
            }
            return column.setIndex(optionIndex);
        },
        // get options of column by index
        getColumnValues: function (index) {
            return (this.children[index] || {}).data.options;
        },
        // set options of column by index
        setColumnValues: function (index, options, needReset) {
            if (needReset === void 0) { needReset = true; }
            var column = this.children[index];
            if (column == null) {
                return Promise.reject(new Error('setColumnValues: 对应列不存在'));
            }
            var isSame = JSON.stringify(column.data.options) === JSON.stringify(options);
            if (isSame) {
                return Promise.resolve();
            }
            return column.set({ options: options }).then(function () {
                if (needReset) {
                    column.setIndex(0);
                }
            });
        },
        // get values of all columns
        getValues: function () {
            return this.children.map(function (child) { return child.getValue(); });
        },
        // set values of all columns
        setValues: function (values) {
            var _this = this;
            var stack = values.map(function (value, index) {
                return _this.setColumnValue(index, value);
            });
            return Promise.all(stack);
        },
        // get indexes of all columns
        getIndexes: function () {
            return this.children.map(function (child) { return child.data.currentIndex; });
        },
        // set indexes of all columns
        setIndexes: function (indexes) {
            var _this = this;
            var stack = indexes.map(function (optionIndex, columnIndex) {
                return _this.setColumnIndex(columnIndex, optionIndex);
            });
            return Promise.all(stack);
        }
    }
});
export default global['__wxComponents']['vant/picker/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-picker {
  position: relative;
  overflow: hidden;
  -webkit-text-size-adjust: 100%;
  /* avoid iOS text size adjust */
  user-select: none;
  background-color: #fff;
  background-color: var(--picker-background-color, #fff);
}
.van-picker__toolbar {
  display: flex;
  justify-content: space-between;
  height: 88rpx;
  height: var(--picker-toolbar-height, 88rpx);
  line-height: 88rpx;
  line-height: var(--picker-toolbar-height, 88rpx);
}
.van-picker__cancel,
.van-picker__confirm {
  padding: 0 32rpx;
  padding: var(--picker-action-padding, 0 32rpx);
  font-size: 28rpx;
  font-size: var(--picker-action-font-size, 28rpx);
  color: #1989fa;
  color: var(--picker-action-text-color, #1989fa);
}
.van-picker__cancel--hover,
.van-picker__confirm--hover {
  background-color: #f2f3f5;
  background-color: var(--picker-action-active-color, #f2f3f5);
}
.van-picker__title {
  max-width: 50%;
  text-align: center;
  font-weight: 500;
  font-weight: var(--font-weight-bold, 500);
  font-size: 32rpx;
  font-size: var(--picker-option-font-size, 32rpx);
}
.van-picker__columns {
  position: relative;
  display: flex;
}
.van-picker__column {
  flex: 1 1;
  width: 0;
}
.van-picker__loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  background-color: var(--picker-loading-mask-color, rgba(255, 255, 255, 0.9));
}
.van-picker__loading .van-loading,
.van-picker__frame {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
}
</style>