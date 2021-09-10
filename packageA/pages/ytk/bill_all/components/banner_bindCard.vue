<template>
  <view class="box">
        <view class="swiper-item uni-bg-red">
            <!--车牌号、粤通卡号-->
            <view class="box1">
                <view class="box1-title">粤A9U6U2</view>
                <view class="box1-content">1234567890</view>
            </view>
            <!--设置-->
            <view class="box1">设置</view>
        </view>
  </view>
</template>

<script>
export default {
    data(){
        return {
            list:[]
        }
    },
    methods:{
        stopTouchMove(){
            return true;
        }
    },
    computed:{
        
    },
    created() {
        
    },
}
</script>

<style lang="scss" scoped>
    .box{  
        .swiper-item{
            position: relative;
            display: flex;
            justify-content: space-between;
            margin: auto;
            width: 720rpx;
            height: 250rpx;
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
</style>