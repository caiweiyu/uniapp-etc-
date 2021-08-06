<template>
  <view class="box">
        <!--返回-->
        <view class="container">
            <navigator open-type='navigateBack'>
                <image class="back" src="https://image.etcchebao.com/etc-min/etc-f/icon_12.png" />
            </navigator>
            <view>支付结果</view>
            <view></view>
        </view>
		<!-- 充值完成 -->
		<image class="img" src="https://image.etcchebao.com/etc-min/ytk-qc-file/icon_list_suc.png"></image>
		<text>支付成功</text>
        <view class="box_text">
            xxx
        </view>
		<view class="box_bottom">
			<view @click="toHome">返回首页</view>
			<view @click="toOrder">查看订单</view>
		</view>
  </view>
</template>

<script>
const app = getApp()
import * as API from "@/interfaces/sinoepc";
import { mapState } from "vuex"
export default {
    props:{
         
    },
    data(){
      return {
        order:{},
        status:true
      }
    },
    methods: {
        toHome() {
            this.status = false
            uni.switchTab({
                url: `/pages/home/main`
            })
        },
        toOrder() {
            this.status = false
            uni.navigateTo({
                url: `/packageA/pages/order/home/main`
            })
        },
    },
    onShow(){

    },
    onLoad(options){
        if (options) {
            this.order = options;
        }
    },
    onUnload(){
        if(this.status){
            uni.navigateTo({
                url:`/packageA/pages/ytk/ytk_list/main`
            })
        }
    },
    mounted() {
     
    },
}
</script>

<style lang="scss" scoped>
    	.box {
        position: relative;
        .container{
            display: flex;
            justify-content: space-between;
            // position: absolute;
            // top: 86rpx;
            margin-top: 100rpx;
            .back{
                width: 62rpx;
                height: 62rpx;
                flex-shrink: 0;
                display: flex;
                // left: 26rpx;
            }
            view{
				font-size: 36rpx;
				color: #0D0D0D;
				font-weight: bold;
                display: inline-block;
                vertical-align: middle;
                margin-top: 15rpx;
            }
        }
		.img {
			padding-top: 160rpx;
			width: 102rpx;
			height: 102rpx;
			display: block;
			margin: auto;
		}

		>text {
			margin: 10rpx 0 124rpx 0;
			text-align: center;
			color: #FF5C2A;
			font-size: 34rpx;
			font-weight: bold;
			display: block;
		}
		.box_text{
			width: 80%;
			text-align: center;
			margin: auto;
		}
		&_content {
			display: flex;
			justify-content: space-between;

			>text:nth-child(1) {
				color: #999999;
				font-size: 28rpx;
				margin-left: 28rpx;
			}

			>text:nth-child(2) {
				color: #222222;
				font-size: 28rpx;
				font-weight: bold;
				margin-right: 28rpx;
			}

			.margin-content {
				margin: 40rpx 0;
			}

			.color {
				color: #FF5C2A !important;
			}
		}

		&_bottom {
			display: flex;
			justify-content: space-between;
			text-align: center;
			margin-top: 64rpx;

			>view:nth-child(1) {
				border: 2rpx solid #FF5C2A;
				border-radius: 120rpx;
				height: 100rpx;
				width: 333rpx;
				line-height: 100rpx;
				color: #FF5C2A;
				font-size: 32rpx;
				margin-left: 28rpx;
			}

			>view:nth-child(2) {
				border: 2rpx solid #FF5C2A;
				background-color: #FF5C2A;
				border-radius: 120rpx;
				height: 100rpx;
				width: 333rpx;
				line-height: 100rpx;
				color: #ffffff;
				font-size: 32rpx;
				margin-right: 28rpx;
			}
		}
	}
</style>