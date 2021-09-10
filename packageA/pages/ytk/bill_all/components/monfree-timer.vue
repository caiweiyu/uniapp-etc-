<template>
    <view>
        <!--本月消费、同行次数-->
        <view class="box">
            <view class="box1">
              <text class="box1_text">$24.80</text>
              <view class="box1_view">本月消费</view>
            </view>
            <view class="box1">
              <text class="box1_text">1</text>
              <view class="box1_view">同行次数</view>
            </view>
        </view>
        <!--可滑动 自动滚区-->
        <swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="4000" :duration="500" :circular="true">
            <swiper-item class="swiper-item" v-for="(item,index) in list" :key="index">
                <view class="swiper-item-view">{{item}}</view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    data(){
      return {
        list:[0,1,2]
      }
    }
}
</script>

<style scoped lang="scss">
  .box{
    display: flex;
    justify-content: space-around;
    height: 160rpx;
    align-items: center;
    .box1{
      width: 120rpx;
      text-align: center;
    }
  }
  .swiper{
    position: relative;
    overflow: hidden;
    width: 720rpx;
    display: block;
    margin: auto;
    height: 80rpx !important;
    .swiper-item{
      width: 100% !important;
      height: 80rpx !important;
      background-color: #ddd;
      .swiper-item-view{

      }
    }
  }
</style>