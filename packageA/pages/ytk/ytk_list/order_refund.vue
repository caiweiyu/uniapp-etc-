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
		<!-- 退款 -->
		<!-- ***************************************** -->
		<view class="refund">
			<view class="box">
				<view class="minbox-1">退款金额</view>
				<view class="minbox-2">￥{{listRefund.refund_amount}}</view>
			</view>
			<view class="box">
				<view class="minbox-1">退款原因</view>
				<view class="minbox-3" @click="$debounce(bindProplem)">
					<text v-if="curProplemText == ''">请选择</text>
					<text v-else>{{curProplemText}}</text>
				</view>
			</view>
			<view class="box">
				<view class="minbox-1">退款说明</view>
				<view class="minbox-4">
					<input :value="val" placeholder="选填" maxlength="100" placeholder-class="place" @input="bindInput" />
				</view>
			</view>
		</view>

		<!-- ***************************************** -->
		<!-- 是否同意协议 -->
		<!-- ***************************************** -->
		<view class="agreement" @click="bindRefundAgreement">
			<icon class="box" type="success" size="16" v-show="agreement"></icon>
			<icon class="box" type="circle" size="16" v-show="!agreement"></icon>
			<view class="box">
				我已经阅读并同意
				<text @click.stop="$debounce(bindAgreement)">ETC车宝用户退款协议</text>
			</view>
		</view>

		<!-- ***************************************** -->
		<!-- 提交申请按钮 -->
		<!-- ***************************************** -->
		<view class="refund-commit-btn" @click="$debounce(bindCommit)">提交申请</view>

		<!-- ***************************************** -->
		<!-- 退款原因弹窗 -->
		<!-- ***************************************** -->
		<u-popup
			v-model="curProplem"
		    mode="bottom"
			height="auto"
		>
			<view class="popup-proplem">
				<view class="title">退款原因</view>
				<scroll-view scroll-y class="main">
					<view class="box" v-for="(item, index) in listRefund.refund_reason" :key="index" @click="bindSelectProblem($event, index)">
						<view class="text">{{item.name}}</view>
						<icon class="minbox" type="success" size="16" v-show="curProplemIndex == index"></icon>
						<icon class="minbox" type="circle" size="16" v-show="curProplemIndex != index"></icon>
					</view>
				</scroll-view>
				<view class="btn" @click="bindProplem">关闭</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	const app = getApp()

	import * as API from "@/interfaces/ytk"
	import { eventMonitor } from "@/common/utils"
	export default {
		data() {
			return {
				order_id: "",
				listRefund: "",

				agreement: true,//是否同意用户协议

				val: "",//退款说明

				curProplem: false,//原因弹窗
				curProplemText: "",//退款文案
				curProplemIndex: -1,//退款选项index
			}
		},
		onLoad(options) {
			this.order_id = options.order_id || "";
			this.order_type = options.order_type || "";
			this.loadRefund();
			eventMonitor("YTK_RefundProgress",1,{
				order_id: this.order_id
			})
		},
		onShow() {
			this.$token(() => {
				this.order_id = this.$root.$mp.query.order_id || "";
				this.order_type = this.$root.$mp.query.order_type || "";
				this.loadRefund();
			});//检测page是否授权，token是否过期
		},
		methods: {
			/**
			 * 退款原因 && 金额
			 */
			async loadRefund() {
				let res = await API.ytk_pay_order_refund({
					order_id: this.order_id
				})
				this.listRefund = res.data;
			},

			/**
			 * 是否同意用户退款协议
			 */
			bindRefundAgreement() {
				this.agreement = !this.agreement;
			},

			/**
			 * 用户退款协议content
			 */
			bindAgreement() {

			},

			/**
			 * 退款原因弹窗
			 */
			bindProplem() {
				this.curProplem = !this.curProplem;
			},

			/**
			 * 选择退款原因
			 */
			bindSelectProblem(e, index) {
				this.curProplemText = this.listRefund.refund_reason[index].name;
				this.curProplemIndex = index;
				eventMonitor("Refund_Reason_YTK_Refund_389_Picker_click",2,{
					order_id: this.order_id,
					reason: this.listRefund.refund_reason[this.curProplemIndex].name
				})
			},

			/**
			 * 监听input输入
			 */
			bindInput(e) {
				this.val = e.detail.value;
			},

			/**
			 * 提交申请
			 */
			async bindCommit() {
				if (this.curProplemText == "") {
					uni.showToast({
						title: "请选择退款原因",
						icon: "none",
						mask: true,
						duration: 1500
					})
					return;
				}
				if (!this.agreement) {
					uni.showToast({
						title: "请同意用户退款协议",
						icon: "none",
						mask: true,
						duration: 1500
					})
					return;
				}
				let res = await API.ytk_pay_order_refund_commit({
					order_id: this.order_id,
					reason: this.listRefund.refund_reason[this.curProplemIndex].name,
					explain: this.val || ""
				})
				if (res.code == 0) {
					uni.redirectTo({
						url: `/packageA/pages/ytk/ytk_list/order_process?order_id=${this.order_id}&order_type=${this.order_type}`
					})
					eventMonitor("Refund_Submit_YTK_Refund_389_Button_click",2,{
						order_id: this.order_id,
						reason: this.listRefund.refund_reason[this.curProplemIndex].name
					})
				}
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
		.refund {
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
				.minbox-1 {
					width: 120rpx;
				}
				.minbox-2 {
					color: #FF5C2A;
				}
				.minbox-3 {
					color: #999999;
					padding: 0 0 0 40rpx;
					height: 100%;
					line-height: 110rpx;
				}
				.minbox-3::after {
					content: "";
					display: inline-block;
					vertical-align: middle;
					width: 12rpx;
					height: 12rpx;
					border-top: 1rpx solid #cccccc;
					border-right: 1rpx solid #cccccc;
					transform: rotate(45deg);
					margin: -6rpx 0 0 10rpx;
				}
				.minbox-4 {
					width: calc(100% - 150rpx);
					height: 100%;
					>input {
						font-size: 28rpx;
						width: 100%;
						height: 100%;
					}
					.place {
						color: #999999;
					}
				}
			}
		}
		.agreement {
			margin: 40rpx 28rpx 0 28rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			.box:last-child {
				margin: 0 0 0 15rpx;
				color: #999999;
				font-size: 24rpx;
				>text {
					margin: 0 0 0 10rpx;
					text-decoration: underline;
				}
			}
		}
		.refund-commit-btn {
			position: fixed;
			left: 50%;
			bottom: 20rpx;
			transform: translate(-50%,0);
			background-color: #FF5C2A;
			color: #FFFFFF;
			font-size: 36rpx;
			text-align: center;
			line-height: 100rpx;
			width: 690rpx;
			border-radius: 100rpx;
		}
		.popup-proplem {
			padding: 20rpx 0 20rpx 0;
			background-color: #FFFFFF;
			border-radius: 20rpx 20rpx 0 0;
			.title {
				text-align: center;
				font-size: 30rpx;
			}
			.main {
				margin: 20rpx auto 0 auto;
				width: 690rpx;
				height: 600rpx;
				.box {
					position: relative;
					width: 100%;
					height: 110rpx;
					border-bottom: 1rpx solid #ededed;
					font-size: 28rpx;
					.text {
						line-height: 110rpx;
					}
					.minbox {
						position: absolute;
						right: 0;
						top: 50%;
						transform: translate(0,-50%);
					}
				}
			}
			.btn {
				margin: 20rpx auto 0 auto;
				background-color: #FF5C2A;
				color: #FFFFFF;
				font-size: 36rpx;
				text-align: center;
				line-height: 100rpx;
				width: 690rpx;
				border-radius: 100rpx;
			}
		}
	}
</style>
