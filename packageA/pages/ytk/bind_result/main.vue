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
			<image class="icon-success" src="https://image.etcchebao.com/etc-min/etc-f/icon_26.png" alt="" />
			<view class="text"> 绑定成功 </view>
		</view>
		<view class="btn-group">
			<view class="ant-button" @click="toBill">查看账单</view>
			<view class="ant-button" @click="toPay">立即充值</view>
		</view>

		<!-- 签到成功，金币弹窗 -->
		<u-popup v-model="show_dialog"
				 mode="center"
				 height="auto"
				 @close="onDetailClose"
		>
			<view class="prize-content" @click="onDetailClose">
				<image src="https://image.etcchebao.com/etc-min/coin-dialog.png?v=1" class="coin-dialog" />
				<view class="prize-info-box">
					<view class="title">{{title}}</view>
					<view class="prize-num">
						<image src="https://image.etcchebao.com/etc-min/icon-coin-big-1.png" /> +{{currentCoinNum}}
					</view>
				</view>
			</view>
		</u-popup>
		
		<dialog-window ref="dialog" flag="4"></dialog-window>
	</view>
</template>

<script>
	const app = getApp()
	import { mapState } from "vuex";
	import { finishTaskGetCoin } from "@/interfaces/coin";
	import { eventMonitor } from "@/common/utils"
	import DialogWindow from "@/components/dialog-window"
	export default {
		components: {
			DialogWindow
		},
		data() {
			return {
				currentCoinNum: 0,
				title: "",
				show_dialog: false,

				cardNo: "",
				plate: "",
				order_id: ""
			};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				userid: (state) => state.user.info.userid,
				userinfo: (state) => state.user.info,
				type: (state) => state.home.new_bill_all.type
			}),
		},
		onShow() {
			this.$token(() => {
				this.loadInit();
			});//检测page是否授权，token是否过期
			this.$store.dispatch("home/ac_share_info",4);//分享配置
			this.$refs.dialog.loadPopup();//全局弹窗配置
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		onLoad(options) {
			this.cardNo = options.cardNo || "";
			this.plate = options.plate || "";
			this.order_id = options.order_id || "";
			eventMonitor("YTK_BindSuccess", 1);
		},
		async mounted() {
			this.loadInit();
			eventMonitor("YTK_BindSuccess", 1)
		},
		methods: {
			/**
			 * 初始化
			 */
			async loadInit() {
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
			},
			
			toBill() {
				eventMonitor("BindSuccess_Middle_YTK_BindCard_329_Button_click", 2)
				if([1,2,3,4].indexOf(Number(this.type)) > -1){
					uni.navigateTo({
						 url: '/packageA/pages/ytk/bill/main'
					});
				}else{
					uni.switchTab({
						url: "/pages/bill/main"
					});
				}	
			},
			toPay() {
				eventMonitor("BindSuccess_Middle_YTK_YTKRecharge_329_Button_click", 2);
				uni.redirectTo({
					url: `/packageA/pages/ytk/ytk_pay/main?cardNo=${this.card_num}&plate=${this.plate_number}&order_id=${this.order_id}`,
				});
			},
			onDetailClose() {
				this.show_dialog = false;
			},
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
	};
</script>
<style lang="scss">
	/deep/ .u-mode-center-box {
		background: none !important;
	}
	.bind-result-page {
		padding: 220rpx 0 0 0;
		text-align: center;

		.text {
			color: #FF5C2A;
			font-size: 34rpx;
			font-weight: bold;
			margin-top: 10rpx;
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
			margin: 256rpx 28rpx 0 28rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;

			.ant-button {
				background: none;
				border: 2rpx solid#FF5C2A;
				color: #FF5C2A;
				border-radius: 100rpx;
				width: 330rpx;
				height: 100rpx;
				line-height: 100rpx;

				&+.ant-button {
					// margin-top: 40rpx;
				}

				&.lottery {
					color: #222222;
					border: 2rpx solid #FF5C2A;
					background-color: #FF5C2A;
				}

				&.ant-button:nth-child(2) {
					background-color: #FF5C2A;
					color: #FFFFFF;
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
