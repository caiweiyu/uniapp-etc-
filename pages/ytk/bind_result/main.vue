<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 11:07:53
-->

<template>
  <view class="bind-result-page">
    <view class="info">
      <image
        class="icon-success"
        src="https://image.etcchebao.com/etc-min/icon_success.png"
        alt=""
      />
      <view class="text"> 绑定成功 </view>
    </view>
    <view class="btn-group">
      <button class="ant-button" @click="toBill">查看账单</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {
	  //绑定粤通卡
	  this.$store.dispatch("user/finishTaskGetCoin","unitoll_bind")
  },
  methods: {
    toBill() {
      uni.redirectTo({
        url: "/pages/ytk/bill/main",
      });
    },
  },
};
</script>
<style lang="scss">
.bind-result-page {
  padding: 88rpx ;
  text-align: center;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 700rpx;
  .text {
    color: #28bc93;
    font-size: 34rpx;
    font-weight: bold;
    margin-top: 25rpx;
  }

  .icon-success {
    height: 163rpx;
    width: 163rpx;
  }

  .tip {
    padding-top: 50rpx;
    font-size: 28rpx;
    color: #999;
    text-align: center;
  }

  .btn-group {
    width: 100%;

    .ant-button {
      background: none;
      border: 2rpx solid #d1a86a;
      color: #d1a86a;
      border-radius: 100rpx;
      & + .ant-button {
        margin-top: 40rpx;
      }
      &.lottery {
        color: #222222;
        border: 2rpx solid #f1cf92;
        background-color: #f1cf92;
      }
    }
  }
}
</style>
