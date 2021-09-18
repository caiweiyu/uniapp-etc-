<template>
  <view class="box">
      <view class="box_title">
        <block v-if="mark==1">
            <image class="img" src="https://image.etcchebao.com/etc-min/bill_all/antion.png"></image><text class="text">本月账单仅供参考</text>
        </block>
        <block v-else>
            <image class="img" src="https://image.etcchebao.com/etc-min/bill_all/ic_check.png"></image><text class="text">本月账单已核准</text>
        </block>
      </view>
      <scroll-view :scroll-y="true" class="scroll-page">
        <view class="box" v-for="(item,index) in list" :key="index"></view>
      </scroll-view>
  </view>
</template>

<script>
export default {
    data(){
      return {
        list:[
          0,1,2
        ],
        mark:2
      }
    }
}
</script>

<style scoped lang="scss">
  .box{
      position: relative;
      &_title{
        width: 100%;
        height: 53rpx;
        line-height: 73rpx;
        padding-left: 34rpx;
        background-color: #F6F6F6;
        .img{
          display: inline-block;
          vertical-align: middle;
          width: 32rpx;
          height: 32rpx;
          margin-right: 10rpx;
        }
        .text{
          vertical-align: middle;
          color: #999999;
          font-size: 24rpx;
        }
      }
      .scroll-page{
          width: 100%;
          height: auto !important;
          display: flex;
          flex-direction: column;
          background-color: #F6F6F6;
          .box{
            background-color: #FFFFFF;
            margin: 20rpx auto;
            width: 690rpx;
            height: 300rpx;
            border-radius: 16rpx;
            display: block;
          }
      }
  }
</style>