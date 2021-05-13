<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 10:44:49
-->
<template>
  <view class="add-ytk">
    <view class="plate-num">
      <view class="plate-num-content">
        <view class="content-left">
          <view class="title">车牌号</view>
          <view class="area" @click="plate_picker_show = true">
            {{ plate_value }} <span class="arrow"></span>
          </view>
        </view>
        <view class="content-right">
          <input
            class="input-item"
            :value="plate_detail"
			@input="plateDetailChange"
            placeholder="填写车牌号"
          />
        </view>
        <view
          :class="['btn-small', { disabled: !plate_detail }]"
          @click="checkCard"
          >查询关联卡片</view
        >
      </view>
    </view>
    <view class="plate-color">
      <view class="plate-color-title">车牌颜色</view>
      <view class="plate-color-list">
        <view
          :class="['plate-color-item', { active: item.id == vehicle_color }]"
          v-for="item in plateColorList"
          @click="onSelectColor(item)"
          :key="item.id"
          >{{ item.text }}</view
        >
      </view>
    </view>
    <view class="input-group">
      <view class="input-group-item">
        <view class="input-group-item__title">粤通卡号</view>
        <view class="input-group-item__inner">
          <input v-model="card_num" placeholder="请输入粤通卡号" />
        </view>
      </view>
    </view>
    <view class="btn-footer">
      <view class="btn-primary" @click="onSubmit">添加</view>
    </view>
    <car-plate
      v-model="plate_picker_show"
      :defautValue="plate_value"
      @onConfirm="onConfirm"
    />
  </view>
</template>

<script>
import { PLATE_COLOR_LIST } from "@/common/constant";
import * as API from "@/interfaces/ytk";
import carPlate from "@/components/car-plate";
export default {
  data() {
    return {
      query_car_num: "",
      plate_detail: "",
      plate_value: "粤 A",
      plateColorList: PLATE_COLOR_LIST,
      card_num: "",
      vehicle_color: "02",
      vehicle_color_text: "蓝牌",
      plate_picker_show: false,
    };
  },
  components: {
    carPlate,
  },
  computed: {
    plate_number() {
      return this.plate_value.replace(/\s/g, "") + this.plate_detail;
    },
  },
  created() {},
  mounted() {},
  methods: {
	  plateDetailChange(e){
		 this.plate_detail= e.detail.value.toLocaleUpperCase();
	  },
    async checkCard() {
      if (!this.plate_detail || !this.plate_value) {
        uni.showToast({
          title: "请输入车牌号",
          icon: "none",
        });
        return;
      }
      let res = await API.getCardByLicense({
        plate_number: this.plate_number,
        vehicle_color: this.vehicle_color,
      });

      this.card_num = res.data.card_num;
      if (this.card_num == "") {
        uni.showToast({
          title: "暂无关联卡号",
          icon: "none",
        });
      }
    },
    onSelectColor({ id, text }) {
      this.vehicle_color = id;
      this.vehicle_color_text = text;
    },
    onConfirm(value) {
      this.plate_value = value;
    },
    async onSubmit() {
      if (this.card_num == "") {
        uni.showToast({
          title: "请输入卡号",
          icon: "none",
        });
        return false;
      }
      let res = await API.isBindCard({
        version: "4.4.0",
        cardNo: this.card_num,
      });
       let { type, phone}=res.data;
     // let { type, phone } = { type: 2, phone: "13719477521" };
      if (type == 1) {
        uni.redirectTo({
          url: "/pages/ytk/bind_result/main",
        });
      } else {
        uni.navigateTo({
          url: `/pages/ytk/bind_ytk/main?card_num=${this.card_num}&color_code=${this.vehicle_color}&color_text=${this.vehicle_color_text}&phone=${phone}&plate_number=${this.plate_number}&type=${type}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-ytk {
  padding: 10rpx 40rpx;

  .plate-num {
    background: #ffffff;
    &-content {
      display: flex;
      align-items: center;
      padding: 40rpx 0rpx;
      border-bottom: 1rpx solid #ebebeb;

      .content-left {
        width: 250rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .title {
          font-size: 32rpx;
          color: #222;
        }
        .area {
          margin-right: 24rpx;
          .arrow {
            display: inline-block;
            width: 0;
            height: 0;
            border-width: 8rpx;
            border-style: solid;
            border-color: #cccccc transparent transparent transparent;
            margin-top: 5rpx;
            vertical-align: middle;
          }
        }
        &:after {
          content: "";
          width: 1rpx;
          height: 30rpx;
          background: #ebebeb;
          position: absolute;
          top: 50%;
          right: 0;
          margin-top: -15rpx;
        }
      }
      .content-right {
        flex: 1;
      }
    }
    &-detail {
      display: flex;
      align-items: center;
      padding: 40rpx 30rpx;
      color: #222;
      font-size: 32rpx;
      .icon-car {
        width: 60rpx;
        height: 60rpx;
      }
      .car-num {
        padding-left: 20rpx;
        padding-right: 34rpx;
      }
    }
  }
  .plate-color {
    padding: 40rpx 0;
    border-bottom: 1rpx solid #efefef;
    &-title {
      color: #222;
      font-size: 30rpx;
      font-weight: 500;
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &-item {
      color: #222222;
      width: 204rpx;
      height: 76rpx;
      line-height: 76rpx;
      text-align: center;
      border: 2rpx solid #ebebeb;
      border-radius: 38rpx;
      margin-top: 40rpx;
      &.active {
        color: #d6ab75;
        border: 2rpx solid #d6ab75;
      }
    }
  }
}
</style>
