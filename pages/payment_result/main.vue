<!--
 * @Description:APP 调起支付 结果页
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-23 13:58:11
-->
<template>
	<view class="payment-result-page">
		<view class="i-success" v-if="payState == 1">
			<image class="icon-status" src="https://image.etcchebao.com/etc-min/icon_success.png" alt="" />
			<view class="text"> 支付成功</view>
		</view>
		<view class="i-fail" v-else>
			<image class="icon-status" src="https://image.etcchebao.com/etc-min/icon_fail.png" alt="" />
			<view class="text"> 支付失败</view>
		</view>
		<view class="tip">{{payState==1?mini_pay_suc_msg:mini_pay_fail_msg}}</view>
		<view class="btn-group" v-if="mini_pay_button_status==1">
			<button class="ant-button" open-type="launchApp" :app-parameter="'payState='+payState" @error="launchAppError">
				返回APP
			</button>
		</view>
	</view>
</template>
<script>
	import {
		getPayPrompt
	} from "@/interfaces/base"
	export default {
		data() {
			return {
				payState: 1, //0支付失败 1支付成功,
				mini_pay_button_status: 0,
				mini_pay_suc_msg: "",
				mini_pay_fail_msg: ""

			};
		},
		computed: {},
		mounted() {
			let {
				payState
			} = this.$root.$mp.query;
			this.payState = payState || 1;
			this.getPayPrompt();
		},
		methods: {
			launchAppError() {},
			async getPayPrompt() {
				let res = await getPayPrompt();
				let {
					mini_pay_button_status,
					mini_pay_suc_msg,
					mini_pay_fail_msg
				} = res.data;

				this.mini_pay_button_status = mini_pay_button_status;
				this.mini_pay_suc_msg = mini_pay_suc_msg
				this.mini_pay_fail_msg = mini_pay_fail_msg

			}
		},
	};
</script>
<style lang="scss">
	.payment-result-page {
		padding: 100rpx 0rpx 0;
		text-align: center;
		background: #ffffff;

		.text {
			font-size: 34rpx;
			font-weight: bold;
			margin-top: 25rpx;
		}

		.money {
			font-size: 46rpx;
			margin-top: 80rpx;
			font-weight: bold;
		}

		.i-success {
			color: #28bc93;
		}

		.i-fail {
			color: #ff5c2a;
		}

		.icon-status {
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
