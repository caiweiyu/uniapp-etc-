<template>
  <view class="box">
    <view class="box_bottom">
        <image :src="allImage[2]" class="box_bottom_image" mode="" @click.stop="agreeIdea" />
        <view class="box_bottom_view">
            <image class="box1" :src="isAgree ? allImage[1] : allImage[0]" mode="" @click.stop="isCheck" />
            <text class="box2">我同意授权ETC车宝将我的车辆信息及姓名、身份证号身份信息共享给腾讯微保用于领取救援服务并投保意外险</text>
        </view>
    </view>
  </view>
</template>

<script>
export default {
    data(){
        return{
            allImage:[
                "https://image.etcchebao.com/etc-min/wb/unchecked_icon.png",
                "https://image.etcchebao.com/etc-min/wb/checked_icon.png",
                "https://image.etcchebao.com/etc-min/wb/wb_submit.png"
            ],
            isAgree:false
        }
    },
    methods: {
        isCheck(){
            this.isAgree = !this.isAgree;
        },
        agreeIdea(){
            if(!this.isAgree){
                uni.showToast({
                    title: '请先同意授权',
                    duration: 1500,
                    icon:"none",
                    mask:true
                });
                return;
            }
            console.log('正在跳转第三方小程序...')
        }
    },
    mounted() {
  
    },
}
</script>

<style scoped lang="scss">
    .box{
        position: relative;
        width: 100%;
        height: 2000rpx;
        background-color: #ddd;
        &_bottom{
            position: fixed;
            z-index: 1;
            bottom: 0;
            border: 1rpx solid transparent;
            width: 100%;
            height: 300rpx;
            background-color: #ffffff;
            &_image{
                width: 618rpx;
                height: 134rpx;
                display: block;
                margin: auto;
                margin-top: 21rpx;
            }
            &_view{
                display: flex;
                flex-direction: row;
                margin: auto;
                vertical-align: middle;
                .box1{
                    display: inline-block;
                    width: 32rpx;
                    height: 32rpx;
                    border-radius: 50%;
                    margin: 16rpx 0 0 40rpx;
                }
                .box2{
                    color: #999999;
                    font-size: 24rpx;
                    height: 65rpx;
                    width: 597rpx;
                    display: inline-block;
                    text-align: center;
                    margin: 16rpx 0 0 17rpx;
                }
            }
        }
    }
</style>