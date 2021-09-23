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
        <swiper class="swiper" v-if="getoperalist.length > 0" :indicator-dots="false" :autoplay="true" :interval="4000" :duration="500" :circular="true">
            <swiper-item class="swiper-item" v-for="(item,index) in getoperalist" :key="index" @click.stop="openArea(item)">
                <image :src="item.pic_url" class="swiper-item-view" mode="" />
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    props:{
        getoperalist:{
          type:Array,
          default:[]
        }
    },
    data(){
      return {
        details:{
          num:0,
          sum:0
        }
      }
    },
    mounted() {
     // setTimeout(()=>{
       this.$nextTick(()=>{
         console.log('1operalist=',this.getoperalist)
       })
        
      //},50)
      setTimeout(()=>{
        console.log('2operalist=',this.getoperalist)
      },1500)
      uni.$on('pickerTimermon',(data)=>{
        console.log('data===',data);
        this.details = data;
        //uni.$off("pickerTimermon")
      })
    },
    methods: {
      openArea(item){
        console.log('参数=',item)
      }
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
    width: 100%;
    height: 108rpx;
    background-color: #F6F6F6;
    .swiper-item{
      width: 750rpx;
      .swiper-item-view{
          position: absolute;
          left: 50%;
          transform: translateX(-50%) !important;
          width: 690rpx !important;
          height: 108rpx !important;
      }
    }
  }
</style>