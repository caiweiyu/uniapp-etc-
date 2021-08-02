<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: yongqing
 * @LastEditTime: 2020-07-28 10:28:55
-->

<template>
	<view class="pay-result-page">
		<image class="icon-success" src="https://image.etcchebao.com/etc-min/icon_success.png" alt="" />
		<view class="text">
			支付成功
		</view>
		<view class="money">￥{{ money }}</view>
		<view class="btn-group">
			<button class="ant-button lottery" @click="toLottery" v-if="isLotteryPay">
				去抽奖
			</button>
			<button class="ant-button" @click="toDownLoadApp">
				下载APP激活会员卡
			</button>
			<button class="ant-button" @click="toBackHome" v-if="!isLotteryPay">
				返回首页
			</button>
		</view>
		<image v-if="!isLotteryPay" mode="widthFix" style="width: 100%;"
			src="https://image.etcchebao.com/etc-min/guide.jpg" />
	</view>
</template>

<script>
	import {
		wap
	} from "@/common/constant";
	export default {
		data() {
			return {
				src: "",
				money: "",
				orderSource: '', //渠道id
				isLotteryPay: false
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
				src
			} = this.$root.$mp.query;
			this.src = src;
			this.money = money;
			this.orderSource = uni.getStorageSync('lotteryFrom')
			var lotteryTime = uni.getStorageSync('lotteryTime')
			if (lotteryTime) {
				var time_end = new Date()
				var time_start = new Date(lotteryTime)
				time_start.setTime(time_start.setHours(time_start.getHours() + 1))
				if (new Date(time_end).getTime() < new Date(time_start).getTime()) {
					this.isLotteryPay = true
				}
			}
		},
		methods: {
			toBackHome() {
				uni.redirectTo({
					url: "/pages/webview/main?src=" + this.src
				});
			},
			toLottery() {
				uni.redirectTo({
					url: "/pages/lottery/main?orderSource=" + this.orderSource
				});
			},
			toDownLoadApp() {
				uni.navigateTo({
					url: `/pages/webview/main?src=${encodeURIComponent(
          `${wap}/download.html`
        )}`,
				});
			},

		},
	};
</script>
<style lang="scss">
	.pay-result-page {
		padding: 100rpx 0rpx 0;
		text-align: center;
		background: #ffffff;

		.text {
			color: #28bc93;
			font-size: 34rpx;
			font-weight: bold;
			margin-top: 25rpx;
		}

		.money {
			font-size: 46rpx;
			margin-top: 80rpx;
			font-weight: bold;
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
			padding: 88rpx 100rpx;

			.ant-button {
				background: none;
				border: 2rpx solid #d1a86a;
				color: #d1a86a;
				border-radius: 100rpx;

				&+.ant-button {
					margin-top: 40rpx;
				}

				&.lottery {
					color: #222222;
					border: 2rpx solid #f1cf92;
					background-color: #f1cf92;
				}
			}
		}
	}
</style>
