<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="content">
		
		<!-- ************************** -->
		<!-- 粤通卡服务 -->
		<!-- ************************** -->
		<view class="block">
			<view class="box" v-for="(item,index) in [0,0,0,0,0,0,0,0,0,0]" :key="index">
				<view class="minbox">
					<view class="title" v-if="index == 0">粤通卡服务</view>
					<view class="img">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_6.png" mode=""></image>
					</view>
				</view>
				<view class="text">提车</view>
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 其他服务 -->
		<!-- ************************** -->
		<view class="block block-top">
			<view class="box" v-for="(item,index) in [0,0,0,0,0,0,0,0,0,0,0,0]" :key="index">
				<view class="minbox">
					<view class="title" v-if="index == 0">其他服务</view>
					<view class="img">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_6.png" mode=""></image>
					</view>
				</view>
				<view class="text">提车</view>
			</view>
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
		onLoad(optins) {
			
		},
		onShow() {
			
		},
		onHide() {
			
		},
		methods: {
			
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

<style lang="scss">
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	.content {
		padding: 40rpx 0 0 0;
		color: #222222;
		.block {
			padding: 82rpx 0 0 0;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			.box {
				margin: 55rpx 0 0 0;
				flex: 0 0 25%;
				.minbox {
					position: relative;
					margin: 0 auto;
					width: 60rpx;
					height: 60rpx;
					.img {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						>image {
							position: absolute;
							left: 0;
							top: 0;
							right: 0;
							bottom: 0;
							margin: auto;
						}
					}
					.title {
						position: absolute;
						left: 0;
						top: -82rpx;
						width: 400rpx;
						font-size: 32rpx;
						font-weight: 700;
					}
				}
				.text {
					margin: 5rpx 0 0 0;
					font-size: 24rpx;
					text-align: center;
				}
			}
			.box:nth-child(1),
			.box:nth-child(2),
			.box:nth-child(3),
			.box:nth-child(4) {
				margin-top: 0;
			}
		}
		.block-top {
			margin: 80rpx 0 0 0;
		}
	}
</style>