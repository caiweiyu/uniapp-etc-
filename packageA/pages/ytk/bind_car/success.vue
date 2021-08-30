<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="bind-result-page">
		<view class="info">
			<image class="icon-success" src="https://image.etcchebao.com/etc-min/icon_success.png" alt="" />
			<view class="text"> 绑定成功 </view>
		</view>
		<view class="btn-group">
			<button class="ant-button" @click="toBack">返回上级</button>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			/**
			 * 返回上级
			 */
			toBack() {
				uni.navigateBack({
					
				})
			}
		},
		/**
		 * 分享好友/群
		 */
		onShareAppMessage(res) {
			return app.shareAppMessage();
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(res) {
			return app.shareTimeline();
		},
	}
</script>

<style lang="scss" scoped>
	.bind-result-page {
		padding: 88rpx;
		text-align: center;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		height: 700rpx;
	
		.text {
			color: #28bc93;
			font-size: 34rpx;
			font-weight: bold;
			margin-top: 25rpx;
		}
	
		.icon-success {
			height: 163rpx;
			width: 163rpx;
		}
	
		.tip {
			padding-top: 50rpx;
			font-size: 28rpx;
			color: #999;
			text-align: center;
		}
	
		.btn-group {
			width: 100%;
	
			.ant-button {
				background: none;
				border: 2rpx solid #ff5c2a;
				color: #ff5c2a;
				border-radius: 100rpx;
	
				&+.ant-button {
					margin-top: 40rpx;
				}
	
				&.lottery {
					color: #222222;
					border: 2rpx solid #ff5c2a;
					background-color: #ff5c2a;
				}
			}
		}
	}
</style>
