<template>
  <view class="box" :style="{marginTop:tabBoundheight+'rpx'}">
      <swiper class="swiper" :indicator-dots="false" :autoplay="auto" :duration="2000">
          <swiper-item>
              <view class="swiper-item uni-bg-red">
                  <!--车牌号、粤通卡号-->
                  <view class="box1">
                      <view class="box1-title">粤A9U6U2</view>
                      <view class="box1-content">1234567890</view>
                  </view>
                  <!--设置-->
                  <view class="box1">设置</view>
              </view>
          </swiper-item>
      </swiper>
  </view>
</template>

<script>
export default {
    data(){
        return {
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height*2, //胶囊相关信息
        }
    },
    computed:{
        /**
         * 计算高度（胶囊顶部距状态栏高度距离*2 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        }
    },
    created() {
        
    },
}
</script>

<style lang="scss" scoped>
    .box{  
        .swiper{
            .swiper-item{
                position: relative;
                display: flex;
                justify-content: space-between;
                margin: 15rpx auto;
                width: 720rpx;
                height: 350rpx;
                background-color: aquamarine;
                border: 1rpx solid aquamarine;
                .box1:nth-child(1){
                    &-title{
                        font-size: 23rpx;
                        color: burlywood;
                    }
                    &-content{

                    }
                }
                .box1:nth-child(2){
                    font-size: 26rpx;
                    color: #000000;
                }
            }
        }
    }
</style>