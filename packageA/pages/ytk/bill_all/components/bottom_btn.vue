<template>
  <view class="box">
      <view class="box1">
            <img class="box1_1" src="https://image.etcchebao.com/etc-min/bill_all/coin_icon.png" alt="">
            <text class="box1_2">本月已领: 1000</text>
            <text class="box1_3">未领: 40</text>
      </view>
      <view class="box2">
          一键领取
      </view>
  </view>
</template>

<script>
export default {
    data(){
        return {}
    },
}
</script>

<style scoped lang='scss'>
    .box{
        width: 690rpx;
        height: 90rpx;
        line-height: 90rpx;
        background-color: #FFEAE4;
        border-radius: 16rpx;
        display: flex;
        font-size: 26rpx;
        justify-content: space-between;
        .box1{
            display: flex;
            &_1{
                display: inline-block;
                vertical-align: middle;
                margin: 30rpx 0 30rpx 33rpx;
                width: 30rpx;
                height: 30rpx;
            }
            &_2{
               margin: 0 20rpx 0 10rpx;
            }
            &_3{
                color: #FF5C2A;
            }
        }
        .box2{
            width: 160rpx;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 120rpx;
            background-color: #FF5C2A;
            color: #FFFFFF;
            text-align: center;
            margin: 20rpx 20rpx 20rpx 0;
        }
    }
</style>