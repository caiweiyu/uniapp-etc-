<template>
	<view class="content">
		
		<!-- 输入手机号 -->
		<view class="phone">
			<view class="title">加油券充值手机号：</view>
			<input class="input" type="number" :value="phone_number" placeholder="请输入手机号码" placeholder-style="color: #CCCCCC" maxlength="11" :focus="isfocus" @input="bindInput" @confirm="bindConfirm" @focus="bindFocus" @blur="bindBlur" />
		</view>
		
		<!-- 提示 -->
		<view class="tip">
			<view class="box">i</view>
			<view class="box">手机号为电子邮件券账号，充值成功则不能退款</view>
			<block v-if="phone_history.length > 0">
				<view class="history" v-show="curHistory">
					<view class="num" hover-class="hover" v-for="(item,list) in phone_history" :key="index" @click="bindHistory(item)">
						<view class="num-1">{{item.phone}}</view>
						<view class="num-2">{{item.phone_location}}</view>
					</view>
					<view class="last" @click="bindHistoryClear">
						<text>清空历史记录</text>
						<view class="line"></view>
					</view>
				</view>
			</block>
		</view>
		
		<!-- 充值选项 -->
		<view class="select">
			<view class="box" hover-class="hover" v-for="(item,index) in sinoepc_init.list" :key="index" @click="bindPay(item)">
				<view class="minbox">
					<view class="min-1">
						<text class="text">{{item.recharge_price}}</text>元油券
					</view>
					<view class="min-2">
						{{item.coin_num}}元+{{item.price}}积分
					</view>
				</view>
				<view class="minbox">立即兑换</view>
				<view class="minbox"></view>
			</view>
		</view>
		
		<!-- 优惠券抵扣 -->
		<view class="coupon" @click="bindCouponPopup">
			<view class="box-1">
				<view class="minbox">优惠券抵扣</view>
				<view class="minbox">1张可用</view>
			</view>
			<view class="box-2">
				<view class="minbox">暂无可用</view>
				<view class="minbox"></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	export default {
		computed: {
			...mapState({
				info: (state) => state.user.info,
				sinoepc_init: (state) => state.sinoepc.sinoepc_init,
				phone_history: (state) => state.sinoepc.phone_history
			})
		},
		data() {
			return {
				phone_number: "",//手机号码
				isfocus: false,//input 焦点
				curHistory: false,//历史手机号码输入
			}
		},
		mounted() {
			if (this.info.hasOwnProperty("phone") == true) {
				this.phone_number = this.info.phone;
			}
		},
		methods: {
			/**
			 * 监听input输入
			 */
			bindInput(e) {
				let reg = /^[0-9]*$/;
				if (reg.test(e.detail.value)) {
					this.phone_number = e.detail.value;
				} else {
					this.isfocus = false;
					uni.showToast({
						title: "手机号码需要数字哦",
						icon: "none",
						mask: true,
						duration: 1500,
						success: ()=> {
							this.phone_number = "";
						}
					})
				}
			},
			
			/**
			 * 输入完成按钮
			 */
			bindConfirm(e) {
				let reg = /^1[3456789]\d{9}$/;
				if (reg.test(this.phone_number)) {
					uni.$emit("savePhoneNumber", {
						phone: this.phone_number
					})
				} else {
					uni.showToast({
						title: "请输入正确的手机号码",
						icon: "none",
						mask: true,
						duration: 1500,
						success: ()=> {
							this.phone_number = "";
						}
					})
					return;
				}
			},
			
			/**
			 * 空格
			 */
			changePhoneNumber(item) {
				return (item + "").replace(/(\d{4})(?=\d)/g, "$1 ");
			},
			
			/**
			 * 聚焦
			 */
			bindFocus(e) {
				uni.$emit("getPhoneNumber", {})
				this.curHistory = true;
			},
			
			/**
			 * 失焦
			 */
			bindBlur(e) {
				this.curHistory = false;
			},
			
			/**
			 * 选择历史手机号码 
			 */
			bindHistory(item) {
				this.phone_number = item.phone;
			},
			
			/**
			 * 清空历史手机号码
			 */
			bindHistoryClear() {
				uni.$emit("clearPhoneNumber", {})
			},
			
			/**
			 * 选择充值 
			 */
			bindPay(item) {
				this.bindConfirm();
				item.phone_number = this.phone_number;
				uni.$emit("pay", {
					item: item
				})
			},
			
			/**
			 * 选择优惠券（弹窗）
			 */
			bindCouponPopup() {
				uni.$emit("couponPopup", {
					show_coupons_mine: true
				})
			}
		}
	}
</script>

<style lang="scss">
	.hover {
		opacity: 0.7;
	}
	.content {
		background-color: #FFFFFF;
		padding: 32rpx 20rpx 0 20rpx;
		border-radius: 20rpx;
		color: #222222;
		.phone {
			width: 100%;
			border-bottom: 1rpx solid #EBEBEB;
			position: relative;
			.title {
				padding: 0 5rpx;
				font-size: 24rpx;
			}
			.input {
				padding: 0 5rpx 20rpx 5rpx;
				width: calc(100% - 10rpx);
				height: 100rpx;
				font-size: 60rpx;
				font-family: "etccb-font";
			}
		}
		.tip {
			padding: 30rpx 0;
			color: #FF5C2A;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1;
			.box:nth-child(1) {
				margin: 0 10rpx 0 0;
				font-size: 20rpx;
				width: 26rpx;
				height: 26rpx;
				line-height: 26rpx;
				text-align: center;
				border: 2rpx solid #FF5C2A;
				border-radius: 100%;
			}
			.history {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				background-color: #FFFFFF;
				color: #222222;
				.num {
					height: 110rpx;
					border-bottom: 1rpx solid #EBEBEB;
					display: flex;
					flex-wrap: wrap;
					flex-direction: column;
					justify-content: center;
					.num-1 {
						font-size: 30rpx;
					}
					.num-2 {
						font-size: 24rpx;
						padding: 4rpx 0 0 0;
						color: #999999;
					}
				}
				.last {
					position: relative;
					text-align: center;
					line-height: 82rpx;
					height: 82rpx;
					font-size: 24rpx;
					color: #C0C0C0;
					.line {
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translate(-50%,0);
						width: calc(100% + 40rpx);
						height: 2rpx;
						border-bottom: 1rpx solid #EBEBEB;
					}
				}
			}
		}
		.select {
			padding: 0 0 28rpx 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			.box {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_42.png") no-repeat;
				background-size: 100% 100%;
				margin: 10rpx 0 0 9rpx;
				width: 214rpx;
				height: 192rpx;
				position: relative;
				.minbox:nth-child(1) {
					width: 100%;
					height: 128rpx;
					text-align: center;
					.min-1 {
						padding: 24rpx 0 0 0;
						color: #229CF4;
						font-weight: 700;
						font-size: 28rpx;
						.text {
							font-size: 40rpx;
							font-family: "etccb-font";
						}
					}
					.min-2 {
						padding: 4rpx 0 0 0;
						font-size: 24rpx;
					}
				}
				.minbox:nth-child(2) {
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 62rpx;
					line-height: 62rpx;
					text-align: center;
					font-size: 26rpx;
					color: #229CF4;
				}
			}
			.box:nth-child(3n+1) {
				margin-left: 0;
			}
			.box:nth-child(1),
			.box:nth-child(2),
			.box:nth-child(3) {
				margin-top: 0;
			}
			.box-bg-2 {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_41.png") no-repeat;
				background-size: 100% 100%;
			}
			.box-bg-3 {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_43.png") no-repeat;
				background-size: 100% 100%;
			}
		}
		.coupon {
			height: 100rpx;
			line-height: 100rpx;
			line-height: 100rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			border-top: 1rpx solid #EBEBEB;
			.box-1 {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				.minbox:nth-child(2) {
					margin: 0 0 0 14rpx;
					padding: 0 12rpx;
					background-color: #FF5C2A;
					font-size: 24rpx;
					color: #FFFFFF;
					border-radius: 100rpx 100rpx 100rpx 0;
					height: 30rpx;
					line-height: 30rpx;
				}
			}
			.box-2 {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #999999;
				.minbox:nth-child(2) {
					margin: 0 0 0 10rpx;
					width: 15rpx;
					height: 15rpx;
					border-top: 1rpx solid #999999;
					border-right: 1rpx solid #999999;
					transform: rotate(45deg);
				}
			}
		}
	}
</style>
