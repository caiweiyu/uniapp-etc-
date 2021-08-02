<!--
 * @Description:
 * @Version: 1.0
 * @Autor: 
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: 
 * @LastEditTime: 2020-07-28 10:28:55
-->

<template>
	<view class="pay-result-page">
		<image class="icon-success" src="https://image.etcchebao.com/etc-min/pay_success.png" alt="" />
		<view class="text">支付成功</view>
		<view class="money">{{money}}</view>
		<view class="btn-group">
			<view class="ant-button" @click="toBackHome">返回首页</view>
			<view class="ant-button" @click="toOrderDetail" v-if="detailUrl">查看订单</view>
		</view>
	</view>
</template>

<script>
	import {
		store
	} from "@/common/constant";
	export default {
		data() {
			return {
				money: "",
				homeUrl: "",
				backUrl: "",
				detailUrl: ""
			};
		},
		computed: {},
		onShow() {
			this.$token(() => {
				
			});//检测page是否授权，token是否过期
		},
		mounted() {
			let {
				money,
				homeUrl = '',
				backUrl = '',
				detailUrl = '',
			} = this.$root.$mp.query;
			this.homeUrl = decodeURIComponent(homeUrl);
			this.backUrl = decodeURIComponent(backUrl);
			this.detailUrl = decodeURIComponent(detailUrl);
			this.money = money;
		},
		methods: {
			toBackHome() {
				if (this.homeUrl) {
					uni.redirectTo({
						url: "/pages/webview/main?src=" + encodeURIComponent(this.homeUrl)
					});
				}else if (this.backUrl) {
					uni.redirectTo({
						url: "/pages/webview/main?src=" + encodeURIComponent(this.backUrl)
					});
				} else {
					uni.navigateBack({
						delta: 1
					})
				}

			},
			toOrderDetail() {
				uni.navigateTo({
					url: "/pages/webview/main?src=" + encodeURIComponent(this.detailUrl)
				});
			}
		},
	};
</script>
<style lang="scss">
	.hover-view {
		opacity: 0.7;
	}
	.pay-result-page {
		padding: 150rpx 0rpx 0;
		text-align: center;
		background: #ffffff;

		.text {
			color: #FF5C2A;
			font-size: 34rpx;
			font-weight: bold;
			margin-top: 10rpx;
		}

		.money {
			font-size: 46rpx;
			margin-top: 50rpx;
			font-weight: bold;
			color: #222222;
		}
		.money::before {
			content: "￥";
			display: inline-block;
			vertical-align: bottom;
			margin: 0 0 4rpx 0;
			font-size: 28rpx;
			color: #222222;
		}

		.icon-success {
			height: 102rpx;
			width: 102rpx;
		}

		.tip {
			padding-top: 50rpx;
			font-size: 28rpx;
			color: #999;
			text-align: center;
		}

		.btn-group {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			margin: 240rpx 40rpx 0 40rpx;
			.ant-button {
				width: 320rpx;
				height: 96rpx;
				border-radius: 100rpx;
				line-height: 96rpx;
				font-size: 32rpx;
			}
			.ant-button:nth-child(1) {
				border: 1rpx solid #FF5C2A;
				box-sizing: border-box;
				color: #FF5C2A;
			}
			.ant-button:nth-child(2) {
				margin: 0 0 0 30rpx;
				border: 1rpx solid #FF5C2A;
				box-sizing: border-box;
				background-color: #FF5C2A;
				color: #FFFFFF;
			}
		}
	}
</style>
