<template>
    <view>
        <!--本月消费、同行次数-->
        <view class="container">
            <view class="box">
              <view class="box1">
                ¥<text class="box1_text">{{details.sum}}</text>
                <view class="box1_view">本月消费</view>
              </view>
              <view class="box1">
                <text class="box1_text">{{details.num}}</text>
                <view class="box1_view">通行次数</view>
              </view>
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
        details:{
          num:0,
          sum:0
        },
        list:[0,1,2]
      }
    },
    mounted() {
      uni.$on('pickerTimermon',(data)=>{
        console.log('data===',data);
        this.details = data;
      })
    },
    methods: {
      
    },
}
</script>

<style scoped lang="scss">
  .container{
      width: 750rpx;
      height: 207rpx;
      padding-top: 30rpx;
      background-color: #F6F6F6;
      .box{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin:auto;
        width: 690rpx;
        height: 150rpx;
        //@errorpadding: 30rpx 30rpx 20rpx 30rpx;
        border-radius: 16rpx;
        background-color: #FFFFFF;
        .box1{
            width: 120rpx;
            text-align: center;
            &_text{
              color: #222222;
              font-size: 48rpx;
            }
            &_view{
              color: #999999;
              font-size: 24rpx;
            }
        }
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