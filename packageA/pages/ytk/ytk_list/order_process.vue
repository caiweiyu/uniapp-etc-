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

		<!-- ***************************************** -->
		<!-- 退款进度 -->
		<!-- ***************************************** -->
		<view class="process">
			<!-- 订单相关信息 -->
			<view class="about">
				<!-- 圈存卡号 -->
				<view class="box">
					<view class="minbox">圈存卡号</view>
					<view class="minbox">{{listProcess.card_num}}</view>
				</view>
				<!-- 退款金额 -->
				<view class="box">
					<view class="minbox">退款金额</view>
					<view class="minbox active">{{listProcess.money}}</view>
				</view>
				<!-- 下单时间 -->
				<view class="box">
					<view class="minbox">下单时间</view>
					<view class="minbox">{{listProcess.order_time}}</view>
				</view>
				<!-- 订单编号 -->
				<view class="box">
					<view class="minbox">订单编号</view>
					<view class="minbox">{{listProcess.order_id}}</view>
				</view>
			</view>
			<!-- 进度条 -->
			<view class="van-process" v-if="listProcess.refund_status && listProcess.refund_status.length > 0">
				<view class="box" v-for="(item,index) in listProcess.refund_status" :key="index">
					<view class="minbox">{{item.title}}</view>
					<view class="minbox">{{item.time}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import * as API from "@/interfaces/ytk"
	import { eventMonitor } from "@/common/utils"
	export default {
		data() {
			return {
				order_type: "",
				order_id: "",
				
				listProcess: ""
			}
		},
		onLoad(options) {
			this.order_type = options.order_type || 11;
			this.order_id = options.order_id || "";
			this.loadETCProcess();
			eventMonitor("YTK_RefundProgress",1,{
				order_id: this.order_id
			})
		},
		onShow() {
			this.$token(() => {
				this.order_type = this.$root.$mp.query.order_type || 11;
				this.order_id = this.$root.$mp.query.order_id || "";
				this.loadETCProcess();
			});//检测page是否授权，token是否过期
		},
		methods: {
			/**
			 * 加载订单进度接口
			 */
			async loadETCProcess() {
				let res = await API.ytk_pay_order_process({
					order_type: this.order_type,
					order_id: this.order_id
				})
				this.listProcess = res.data;
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

<style lang="scss">
	.content {
		.process {
			.about {
				border-bottom: 1rpx solid #ededed;
				font-size: 28rpx;

				.box {
					margin: 0 0 0 28rpx;
					padding: 0 28rpx 0 0;
					height: 110rpx;
					border-bottom: 1rpx solid #ededed;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: center;

					&.box:last-child {
						border-bottom: none;
					}

					.minbox:first-child {
						color: #999999;
					}

					.minbox:last-child {
						color: #222222;
					}

					.minbox.active {
						color: #FF5C2A;
					}
				}
			}

			.van-process {
				position: relative;
				margin: 0 0 0 100rpx;
				padding: 0 28rpx 0 0;
				.box {
					position: relative;
					padding: 32rpx 0;
					border-bottom: 1rpx solid #ededed;
					.minbox:first-child {
						font-size: 28rpx;
					}
					.minbox:last-child {
						margin: 15rpx 0 0 0;
						font-size: 20rpx;
						color: #999999;
					}
					&.box:first-child {
						.minbox:first-child {
							color: #FF5C2A;
						}
					}
					&.box::before {
						content: "";
						display: block;
						position: absolute;
						z-index: -1;
						left: -50rpx;
						top: 0;
						width: 50rpx;
						height: 100%;
						border-left: 1rpx solid #ededed;
					}
					&.box:last-child::before {
						content: "";
						display: block;
						position: absolute;
						z-index: -1;
						left: -50rpx;
						top: 0;
						width: 50rpx;
						height: 52rpx;
						border-left: 1rpx solid #ededed;
					}
					&.box::after {
						content: "";
						display: block;
						position: absolute;
						z-index: 2;
						left: -57rpx;
						top: 45rpx;
						width: 16rpx;
						height: 16rpx;
						background-color: #ededed;
						border-radius: 100%;
					}
					&.box:first-child::after {
						content: "";
						display: block;
						position: absolute;
						z-index: 2;
						left: -57rpx;
						top: 45rpx;
						width: 16rpx;
						height: 16rpx;
						background-color: #FF5C2A;
						border-radius: 100%;
					}
				}
				&.van-process::before {
					content: "";
					display: block;
					position: absolute;
					left: -60rpx;
					top: 0;
					width: 60rpx;
					height: 48rpx;
					background-color: #FFFFFF;
				}
				&.van-process::after {
					content: "";
					display: block;
					position: absolute;
					z-index: 2;
					left: -63rpx;
					top: 39rpx;
					width: 28rpx;
					height: 28rpx;
					background-color: rgba($color: #FF5C2A, $alpha: 0.5);
					border-radius: 100%;
				}
			}
		}
	}
</style>
