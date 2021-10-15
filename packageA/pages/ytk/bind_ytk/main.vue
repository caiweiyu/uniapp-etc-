<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-03-10 15:41:12
-->
<template>
	<view class="bind-ytk">
		<view class="plate-num">
			<view class="plate-num-detail">
				<view class="icon-car" />
				<view class="car-num">{{ plate_number }}</view>
				<view class="car-color">{{ color_text }}</view>
			</view>
		</view>

		<view class="input-group">
			<view class="input-group-item">
				<view class="input-group-item__title">粤通卡号</view>
				<view class="input-group-item__inner"> {{ card_num }} </view>
			</view>
			<view class="input-group-item">
				<view class="input-group-item__title">手机号</view>
				<view class="input-group-item__inner"> {{ fomat_phone }} </view>
			</view>

			<view class="input-group-item">
				<view class="input-group-item__title">验证码</view>
				<view class="input-group-item__inner">
					<input placeholder="请输入验证码" v-model="code" />
				</view>
				<view :class="['btn-small', { disabled: disabled }]" @click="sendCode">
					{{ disabled ? countDown + "s后获取" : "获取验证码" }}
				</view>
			</view>
		</view>
		<view class="tip">
			<view>1.验证码将下发至您粤通卡预留的手机号</view>
			<view>2.更换手机号请致电96533</view>
		</view>
		<view class="btn-footer">
			<view class="btn-primary" @click="onSubmit">提交</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import * as API from "@/interfaces/ytk";
	import {
		fomatPhone,
		eventMonitor
	} from "@/common/utils";
	const APP_VERSION = "4.4.0";
	const COUNT_TIME = 60;
	export default {
		data() {
			return {
				color_code: "",
				color_text: "",
				phone: "",
				plate_number: "",
				card_num: "",
				type: 2,
				code: "",
				countDown: COUNT_TIME,
				disabled: false,

				cardNo: "",
				plate: "",
			};
		},
		computed: {
			fomat_phone() {
				return fomatPhone(this.phone);
			},
		},
		onLoad(options) {
			this.cardNo = options.cardNo || "";
			this.plate = options.plate || "";
		},
		onShow() {
			this.$token(() => {
				
			});//检测page是否授权，token是否过期
		},
		mounted() {
			let {
				color_code,
				color_text,
				phone,
				plate_number,
				card_num,
				type,
			} = this.$root.$mp.query;
			this.color_code = color_code;
			this.color_text = color_text;
			this.phone = phone;
			this.plate_number = plate_number;
			this.card_num = card_num;
			this.type = type;
		},
		methods: {
			async sendCode() {
				if (this.disabled) {
					return;
				}
				try {
					let res = await API.unifiedVerifyCode({
						version: APP_VERSION,
						type: this.type,
						phone: this.phone,
					});
					if (res && res.data) {
						this.disabled = true;
						let timer = setInterval(() => {
							this.countDown--;
							if (this.countDown <= 0) {
								clearInterval(timer);
								this.disabled = false;
								this.countDown = COUNT_TIME;
							}
						}, 1000);
					}
				} catch (error) {
					this.disabled = false;
				}
			},
			async onSubmit() {
				if (!this.code) {
					uni.showToast({
						title: "请输入短信验证码",
						icon: "none",
					});
					return;
				}
				let res = await API.unifiedBindCard({
					version: APP_VERSION,
					type: this.type,
					phone: this.phone,
					card_no: this.card_num,
					code: this.code,
					plate_number: this.plate_number,
					vehicle_color: this.color_code,
				});
				if (res.data) {
					uni.redirectTo({
						url: `/packageA/pages/ytk/bind_result/main?cardNo=${this.card_num}&plate=${this.plate_number}`,
					});
					this.$store.commit("home/mt_new_bill_all_bindCardSuccess", true);
				}
				uni.$emit("etc",{})
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

<style lang="scss" scoped>
	.bind-ytk {
		padding: 10rpx 40rpx;

		.tip {
			padding: 20px 0;
			color: #666666;
			font-size: 28rpx;
		}
		.btn-primary{
			background-color: #FF6D40;
			color: #ffffff;
		}
		.plate-num {
			background: #ffffff;

			&-detail {
				display: flex;
				align-items: center;
				padding: 40rpx 30rpx;
				color: #222;
				font-size: 32rpx;
				font-weight: bold;
				background: #ffffff;
				border: 1rpx solid #ebebeb;
				box-shadow: 0px 5rpx 10rpx 0rpx rgba(165, 165, 165, 0.1);
				border-radius: 4rpx;

				.icon-car {
					background: url("https://image.etcchebao.com/etc-min/icon_car.png") no-repeat;
					background-size: 100%;
					width: 60rpx;
					height: 60rpx;
				}

				.car-num {
					padding-left: 20rpx;
					padding-right: 34rpx;
				}
			}
		}
	}
</style>
