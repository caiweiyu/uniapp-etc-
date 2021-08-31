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
		<view class="describe">{{describe}}</view>
		<view class="btn-group">
			<view :class="['ant-button', !detailUrl ? 'ant-button-max' : '']" @click="toBackHome">
				<text>{{backName}}</text>
				<image class="img" :src="backMarkImg" mode="heightFix" v-if="backMarkImg"></image>
			</view>
			<view :class="['ant-button', !detailUrl ? 'ant-button-max' : '']" @click="toOrderDetail" v-if="detailUrl">
				<text>{{detailName}}</text>
				<image class="img" :src="detailMarkImg" mode="heightFix" v-if="detailMarkImg"></image>
			</view>
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
				backUrl: "",
				detailUrl: "",
				backName: "",
				detailName: "",
				backMarkImg: "",
				detailMarkImg: "",
				describe: "",
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
				backUrl = '',
				detailUrl = '',
				backName = '返回首页',
				detailName = '查看订单',
				backMarkImg = '',
				detailMarkImg = '',
				describe = '',
			} = this.$root.$mp.query;
			this.backUrl = decodeURIComponent(backUrl);
			this.detailUrl = decodeURIComponent(detailUrl);
			this.backMarkImg = decodeURIComponent(backMarkImg);
			this.detailMarkImg = decodeURIComponent(detailMarkImg);
			this.describe = decodeURIComponent(describe);
			this.backName = decodeURIComponent(backName);
			this.detailName = decodeURIComponent(detailName);
			this.money = money;
		},
		methods: {
			toBackHome() {
				if (this.backUrl) {
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
		padding: 220rpx 0rpx 0;
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
			margin-top: 28rpx;
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

		.describe {
			color: #999999;
			font-size: 26rpx;
			margin: 60rpx auto 0 auto;
			width: 518rpx;
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
			margin: 76rpx 30rpx 0 30rpx;
			.ant-button {
				width: 330rpx;
				height: 96rpx;
				border-radius: 100rpx;
				line-height: 96rpx;
				font-size: 32rpx;
				position: relative;
				.img {
					height: 36rpx;
					position: absolute;
					right: 0;
					top: -15rpx;
				}
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
			.ant-button-max {
				width: 100%;
			}
		}
	}
</style>
