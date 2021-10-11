<template>
    <view>
        <view class="box">
            <view class="item">
                <text class="item_title">提示</text>
                <view class="item_content">
                    <scroll-view class="scroll-page" :scroll-y="true">
                        <text class="text">{{content}}</text>
                    </scroll-view>
                </view>
                <view class="item_btn" @click.stop="noShow">知道了</view>
            </view>
        </view>
        <view class="box1"></view>
    </view>
</template>

<script>
export default {
    props:{
        content:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            show:true
        }
    },
    methods: {
        noShow(){
            this.$emit('showToastfn',false)
        }
    },
}
</script>

<style scoped lang="scss">
    .box1{
        position: fixed;
        z-index: 9998;
        width: 100vw;
        height: 100vh;
        background-color: #000000;
        opacity: .7;
    }
    .box{
        position: fixed;
        z-index: 9999;
        width: 100vw;
        height: 100vh;
        .item{
            width: 630rpx;
            height: 566rpx;
            background-color: #ffffff;
            border-radius: 20rpx;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            &_title{
                color: #222222;
                font-size: 34rpx;
                text-align: center;
                margin-top: 50rpx;
                display: block;
                font-weight: bold;
            }
            &_content{
                width:530rpx;
                height:300prx;
                display: block;
                margin:33rpx auto;
                color: #666666;
                font-size: 30rpx;
                text-align: left;
                .scroll-page{
                    height: 300rpx;
                    .text{
                        height: 100%;
                        overflow: auto;
                    }
                }
            }
            &_btn{
                width: 100%;
                height: 106rpx;
                line-height: 106rpx;
                text-align: center;
                color: #FF5C2A;
                font-size: 32rpx;
                border-top: 1rpx solid #EBEBEB;
                position: absolute;
                bottom: 0;
            }
        }
    }
</style>