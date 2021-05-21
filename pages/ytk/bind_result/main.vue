<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 11:07:53
-->

<template>
	<view class="bind-result-page">
		<view class="info">
			<image class="icon-success" src="https://image.etcchebao.com/etc-min/icon_success.png" alt="" />
			<view class="text"> 绑定成功 </view>
		</view>
		<view class="btn-group">
			<button class="ant-button" @click="toBill">查看账单</button>
		</view>

		<van-popup :show="show_dialog" custom-style="background: none;zIndex:99999" @close="onDetailClose">
			<view class="prize-content" @click="onDetailClose">
				<image src="https://image.etcchebao.com/etc-min/coin-dialog.png?v=1" class="coin-dialog" />
				<view class="prize-info-box">
					<view class="title">{{title}}</view>
					<view class="prize-num">
						<image src="https://image.etcchebao.com/etc-min/icon-coin-big-1.png" /> +{{currentCoinNum}}</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import {
		finishTaskGetCoin
	} from "@/interfaces/coin";
	import {
		eventMonitor
	} from "@/common/utils"
	export default {
		data() {
			return {
				currentCoinNum: 0,
				title: "",
				show_dialog: false
			};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				userid: (state) => state.user.info.userid,
				userinfo: (state) => state.user.info
			}),
		},
		async mounted() {
			//绑定粤通卡
			//this.$store.dispatch("user/finishTaskGetCoin", "unitoll_bind")

			let [error, res] = await finishTaskGetCoin({
				userId: this.userid,
				from: 1, //0=app;1=小程序;(默认0)
				taskType: 1, //0=交易完成后的任务；1=普通任务,
				optionKey: "unitoll_bind", //任务名称
				token: this.token
			})

			let json = res.data;
			if (json.code == 0) {
				this.show_dialog = true;
				this.title = json.data.title;
				this.currentCoinNum = json.data.coins
			}

			eventMonitor("YTK_BindSuccess", 1)

		},
		methods: {
			toBill() {
				eventMonitor("BindSuccess_Middle_YTK_BindCard_329_Button_click", 2)
				uni.redirectTo({
					url: "/pages/ytk/bill/main",
				});
			},
			onDetailClose() {
				this.show_dialog = false;
			},
		},
	};
</script>
<style lang="scss">
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

	.prize-content {
		position: relative;

		.coin-dialog {
			width: 668rpx;
			height: 768rpx;
		}

		.prize-info-box {
			position: absolute;
			width: 668rpx;

			margin: 0 auto;
			top: 35%;
			left: 0;
			right: 0;
			text-align: center;

			.title {
				font-size: 30rpx;
				color: #3c280f;
			}

			.prize-num {
				margin-top: 30rpx;
				font-size: 40rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #ff4e00;

				image {
					width: 78rpx;
					height: 78rpx;
					margin-right: 10rpx;
				}

			}
		}

	}
</style>
