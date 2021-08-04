<template>
	<view class="content">
		
		<!-- 输入手机号 -->
		<view class="phone">
			<view class="title">加油券充值手机号：</view>
			<input class="input" type="number" v-model="phone_number" placeholder="请输入手机号码" placeholder-style="color: #222222" maxlength="11" :focus="isfocus" @input="bindInput" @confirm="bindConfirm" @focus="bindFocus" @blur="bindBlur" />
		</view>
		
		<!-- 提示 -->
		<view class="tip">
			<view class="box">i</view>
			<view class="box">手机号为电子邮件券账号，充值成功则不能退款</view>
		</view>
		
		<!-- 充值选项 -->
		<view class="select">
			<view class="box" hover-class="hover" v-for="(item,index) in sinoepc_init.list" :key="index">
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
		<view class="coupon">
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
				sinoepc_init: (state) => state.sinoepc.sinoepc_init
			})
		},
		data() {
			return {
				phone_number: "",//手机号码
				isfocus: false,//input 焦点
			}
		},
		mounted() {
			
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
				if (reg.test(e.detail.value)) {
					this.phone_number = e.detail.value;
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
				}
			},
			
			/**
			 * 聚焦
			 */
			bindFocus(e) {
				console.log(e)
			},
			
			/**
			 * 失焦
			 */
			bindBlur(e) {
				console.log(e)
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
			.title {
				font-size: 24rpx;
			}
			.input {
				padding: 0 0 20rpx 0;
				width: 100%;
				height: 100rpx;
				font-size: 60rpx;
				font-weight: 700;
				font-family: "etccb-font";
			}
		}
		.tip {
			padding: 30rpx 0;
			color: #FF5C2A;
			font-size: 24rpx;
			display: flex;
			align-items: center;
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
		}
		.select {
			padding: 0 0 28rpx 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			.box {
				margin: 12rpx 0 0 9rpx;
				width: 214rpx;
				height: 192rpx;
				border: 2rpx solid #BBE4FF;
				box-sizing: border-box;
				border-radius: 10rpx;
				position: relative;
				.minbox:nth-child(1) {
					width: 100%;
					height: 128rpx;
					background-color: #E8F6FF;
					text-align: center;
					border-radius: 10rpx 10rpx 0 0;
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
					border-top: 2rpx dashed #BBE4FF;
					background-color: #E8F6FF;
					border-radius: 0 0 10rpx 10rpx;
				}
				.minbox:nth-child(2)::before {
					content: "";
					display: block;
					position: absolute;
					z-index: 1;
					left: -14rpx;
					bottom: 47rpx;
					width: 28rpx;
					height: 28rpx;
					background-color: #FFFFFF;
					border-radius: 100%;
					border-right: 2rpx solid #BBE4FF;
					border-top: 2rpx solid #BBE4FF;
					transform: rotate(45deg);
				}
				.minbox:nth-child(2)::after {
					content: "";
					display: block;
					position: absolute;
					z-index: 1;
					right: -14rpx;
					bottom: 47rpx;
					width: 28rpx;
					height: 28rpx;
					background-color: #FFFFFF;
					border-radius: 100%;
					border-left: 2rpx solid #BBE4FF;
					border-top: 2rpx solid #BBE4FF;
					transform: rotate(-45deg);
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
