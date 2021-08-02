<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="zs-content">

		<!-- ************************** -->
		<!-- 标题 -->
		<!-- ************************** -->
		<view class="title" @click="toFlue">
			<view class="box">严选购物</view>
			<view class="box">更多</view>
		</view>

		<!-- ************************** -->
		<!-- 门店列表 -->
		<!-- ************************** -->
		<view class="stores-list">
			<view class="pull" :id="`pull_${index}`" v-for="(item,index) in strict_shop_pull" :key="index">
				<view class="box" v-for="(itemmin,indexmin) in item" :key="indexmin">
					<view class="minbox">
						<image class="img" src="" mode=""></image>
					</view>
					<view class="minbox">小程序开发工具的控制台查看</view>
					<view class="minbox" v-if="itemmin == 1">
						<view class="text">99</view>
						<view class="text">销量 1000</view>
					</view>
					<view class="minbox" v-if="itemmin == 1">
						<view class="text">6.5</view>
						<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_4.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>

		<slot name="getPhoneNumber" />

	</view>
</template>

<script>
	import {
		user,
		chewu
	} from "@/common/constant"
	import {
		mapState
	} from "vuex";
	export default {
		props: {
			
		},
		data() {
			return {
				strict_shop_pull: ""
			}
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				
				strict_shop: (state) => state.home.strict_shop,
			})
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化 
			 */
			loadInit() {
				
			},
			
			/**
			 * 瀑布流数据
			 */
			bindPull() {
				let arr = [[],[]];
				let strict_shop = this.strict_shop;
				for (let i = 0; i < strict_shop.length; i++) {
					if ((i+1) % 2 == 0) {
						arr[1].push(strict_shop[i]);
					} else {
						arr[0].push(strict_shop[i]);
					}
				}
				this.strict_shop_pull = arr;
			},
			
			/**
			 * 加油入口测试
			 */
			toFlue() {
				//console.log(user)
				uni.navigateTo({
					url: `/pages/webview/main?src=${encodeURIComponent(`${user}/lbsoil/refuel-list.html?isGps=1`)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 清浮动  */
	.clearfix {
	  zoom:1;
	}
	.clearfix:after {
	  display:block;
	  overflow:hidden; 
	  clear:both; height:0;
	  visibility:hidden;
	  content:".";
	}
	.zs-content {
		position: relative;
		margin: 30rpx 0 0 0;
		padding: 0 0 30rpx 0;
		color: #222222;
		border-radius: 20rpx;

		.title {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;

			.box:nth-child(1) {
				font-size: 32rpx;
				font-weight: 700;
			}

			.box:nth-child(2) {
				font-size: 24rpx;
				color: #CCCCCC;
				margin: 0 0 0 10rpx;
			}
		}

		.stores-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 20rpx 0 0 0;
			.pull {
				width: 334rpx;
				.box {
					margin: 24rpx 0 0 0;
					padding: 0 0 10rpx 0;
					width: 100%;
					border-radius: 20rpx;
					overflow: hidden;
					background-color: #FFFFFF;

					.minbox {
						width: auto;
					}

					.minbox:nth-child(1) {
						width: 334rpx;
						height: 334rpx;
						background-color: #ccc;
						border-radius: 20rpx 20rpx 0 0;
						overflow: hidden;
						position: relative;
					}

					.minbox:nth-child(2) {
						margin: 5rpx 0 0 0;
						padding: 0 20rpx;
						font-size: 28rpx;
						font-weight: 700;
						line-height: 40rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.minbox:nth-child(3) {
						margin: 5rpx 0 0 0;
						padding: 0 20rpx;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: bottom;

						.text:nth-child(1) {
							color: #FF5C2A;
							font-size: 36rpx;
							font-weight: 700;
						}

						.text:nth-child(1)::before {
							content: '￥';
							display: inline-block;
							font-size: 24rpx;
							font-weight: lighter;
						}

						.text:nth-child(2) {
							color: #999999;
							font-size: 24rpx;
							line-height: 54rpx;
						}
					}

					.minbox:nth-child(4) {
						margin: 0 0 0 0;
						padding: 0 20rpx;

						.text {
							display: inline-block;
							vertical-align: middle;
							font-size: 30rpx;
							font-weight: 700;
						}

						.text::before {
							content: '￥';
							display: inline-block;
							font-size: 24rpx;
							font-weight: lighter;
						}

						.img {
							display: inline-block;
							vertical-align: middle;
							margin: 6rpx 0 0 10rpx;
							width: 42rpx;
							height: 20rpx;
						}
					}
				}

				.box:nth-child(1) {
					margin: 0;
				}
			}
		}
	}
</style>
