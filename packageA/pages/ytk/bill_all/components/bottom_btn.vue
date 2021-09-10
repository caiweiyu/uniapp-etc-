<template>
  <view class="box">
      <view>本月已领31，未领32</view>
      <view>一键领取</view>
  </view>
</template>

<script>
export default {
    data(){
        return {
            
        }
    }
}
</script>

<style scoped lang='scss'>
    .box{
        position: fixed;
        transform: translateX(-50%);
        left: 50%;
        bottom: 50rpx;
        width: 650rpx;
        height: 80rpx;
        border:1rpx solid #ddd;
        background-color: #ddd;
        border-radius: 5rpx;
        box-shadow: #999 #ddd;
        display: flex;
        justify-content: space-between;
    }
</style>