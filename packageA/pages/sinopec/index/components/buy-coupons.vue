<template>
	<view class="content">
		
		<!-- 输入手机号 -->
		<view class="phone" @click="bindBlurFalse">
			<view class="title">加油券充值手机号：</view>
			<!-- <view class="number_show">
				<view class="box" v-for="(item,index) in phone_number" :key="index">{{item}}</view>
			</view> -->
			<view class="input-box" @click.stop="bindFocusFalse">
				<input class="input" 
					   type="number" 
					   :value="phone_number" 
					   placeholder="请输入11位手机号码" 
					   placeholder-style="color: #CCCCCC" 
					   maxlength="11" 
					   cursor-spacing="10" 
					   :focus="isfocus"
					   :hold-keyboard="false"
					   @input="bindInput" 
					   @confirm="bindConfirm" 
					   @focus="bindFocus" 
					   @blur="bindBlur" 
					   @keyboardheightchange="keyboardheightchange"
				/>
			</view>
		</view>
		
		<!-- 提示 -->
		<view class="tip">
			<view class="box">i</view>
			<view class="box">手机号为电子邮件券账号，充值成功则不能退款</view>
			<block v-if="phone_history.length > 0">
				<view class="history" v-show="curHistory">
					<scroll-view scroll-y class="scroll">
						<view class="num" hover-class="hover" v-for="(item,index) in phone_history" :key="index" @click="bindHistory(item)">
							<view class="num-1">{{item.phone}}</view>
							<view class="num-2">{{item.phone_location}}</view>
						</view>
					</scroll-view>
					<view class="last" @click="bindHistoryClear">
						<text>清空历史记录</text>
						<view class="line"></view>
					</view>
				</view>
				<view class="history-bg" v-show="curHistory" @touchend="bindBlurFalse"></view>
			</block>
		</view>
		
		<!-- 充值选项 -->
		<view class="select">
			<view :class="['box', !token || phone_number.length < 11 ? 'box-bg-3' : '', item.icon ? 'box-bg-2' : '']" hover-class="hover" v-for="(item,index) in sinoepc_init.list" :key="index" @click="$debounce(bindPay,item)">
				<view class="minbox">
					<view :class="['min-1', !token || phone_number.length < 11 ? 'text-color' : '']">
						<text class="text">{{item.recharge_price}}</text>元油券
					</view>
					<view :class="['min-2', !token || phone_number.length < 11 ? 'text-color' : '']">
						{{item.price}}元+{{item.coin_num}}积分
					</view>
				</view>
				<view :class="['minbox', !token || phone_number.length < 11 ? 'text-color' : '']">立即兑换</view>
				<view class="minbox">
					<image :src="item.icon" mode="heightFix"></image>
				</view>
				<view class="minbox" v-if="item.xcx_mj > 0">
					<text>抵扣{{item.xcx_mj}}元</text>
				</view>
			</view>
		</view>
		
		<!-- 优惠券抵扣 -->
		<view class="coupon" @click="bindCouponPopup">
			<view class="box-1">
				<view class="minbox">优惠券抵扣</view>
				<view class="minbox">{{sinoepc_init.coupon.total || 0}}张可用</view>
			</view>
			<view :class="['box-2', coupon_text == '未使用' ? '' : 'box-2-color']">
				<view class="minbox">
					<block v-if="sinoepc_init.coupon.total <= 0">
						<text>暂无可用</text>
					</block>
					<block v-else>
						<text>{{coupon_text}}</text>
					</block>
				</view>
				<view class="minbox"></view>
			</view>
		</view>
		
		<button-getPhoneNumber type="local" />
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				info: (state) => state.user.info,
				sinoepc_list: (state) => state.sinoepc.sinoepc_list,
				sinoepc_init: (state) => state.sinoepc.sinoepc_init,
				phone_history: (state) => state.sinoepc.phone_history
			}),
			phone_number_format() {
				if (this.phone_number) {
					return this.changePhoneNumber();
				}
			}//修饰手机号格式
		},
		data() {
			return {
				phone_number: "",//手机号码
				isfocus: false,//input 焦点
				curHistory: false,//历史手机号码输入
				coupon_text: "未使用",//优惠券选择文案
				coupon_id: "",//优惠券id
			}
		},
		mounted() {
			if (this.info.hasOwnProperty("phone") == true) {
				this.phone_number = this.info.phone;
			}
			uni.$on("selectETCCoupon", (e)=> {
				this.coupon_text = e.coupon_text;
				this.coupon_id = e.coupon_id;
				this.calculationCoupon(e);
			})
		},
		destroyed() {
			uni.$off("selectETCCoupon");
		},
		methods: {
			/**
			 * 计算卡券
			 */
			calculationCoupon(e) {
				let sinoepc_init = this.sinoepc_init;
				if (e.coupon_text == "未使用") {//还原原始数据
					sinoepc_init.list = this.$u.deepClone(this.sinoepc_list);
				} else {//计算卡券优惠
					sinoepc_init.list = this.$u.deepClone(this.sinoepc_list);
					let { index } = e; 
					let rule_money = Number(sinoepc_init.coupon.coupon_list[index].rule_money);//满减金额
					let quota = Number(sinoepc_init.coupon.coupon_list[index].quota);//抵扣金额
					let cash = 0;//面值 - 满减金额
					let is_zero_buy = Number(sinoepc_init.coupon.coupon_list[index].is_zero_buy);//是否支持满减后0元支付
					for (let i = 0; i < sinoepc_init.list.length; i++) {
						if (Number(sinoepc_init.list[i].recharge_price) >= rule_money) {//符合满减条件
							cash = Number(sinoepc_init.list[i].recharge_price) - quota;
							if (cash == 0) {//满减后0元支付
								if (sinoepc_init.list[i].price > cash) {//(折扣金额 > 满减金额) => 优先满减
									if (is_zero_buy == 1) {//支持满减后0元支付
										sinoepc_init.list[i].xcx_mj = quota;
										sinoepc_init.list[i].price = cash;
									}
								}
							} else if (cash > 0) {//满减后大于0元支付
								if (sinoepc_init.list[i].price > cash) {//(折扣金额 > 满减金额) => 优先满减
									sinoepc_init.list[i].xcx_mj = quota;
									sinoepc_init.list[i].price = cash;
								}
							} else {
								// 负数不符合满减规则
							}
						} else {
							//不符合满减条件
						}
					}
				}
				this.$store.commit("sinoepc/mt_sinoepc_init", sinoepc_init);
			},
			
			/**
			 * 监听input输入
			 */
			bindInput(e) {
				let reg = /^[0-9]*$/;
				let num = (e.detail.value).replace(/\s/g,"");
				if (reg.test(num)) {
					this.phone_number = num;
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
					this.curHistory = false;
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
				// uni.$emit("getPhoneNumber", {})
				// this.curHistory = true;
			},
			
			/**
			 * 失焦
			 */
			bindBlur(e) {
				// this.curHistory = false;
			},
			
			/**
			 * 键盘高度变化
			 */
			keyboardheightchange(e) {
				// if (Number(e.detail.height) == 0) {
				// 	this.curHistory = false;
				// }
			},
			
			/**
			 * 模拟得到焦点
			 */
			bindFocusFalse() {
				uni.$emit("getPhoneNumber", {})
				this.curHistory = true;
			},
			
			/**
			 * 模拟失去焦点
			 */
			bindBlurFalse() {
				this.curHistory = false;
			},
			
			/**
			 * 空格
			 */
			changePhoneNumber() {
				let num = this.phone_number;
				let format = "";
				if (num.length > 0 && num.length < 4) {
					format = num;
				} else if (num.length >= 4 && num.length < 7) {
					format = num.substring(0,3) + " " + num.substring(3,num.length);
				} else if (num.length >= 7) {
					format = num.substring(0,3) + " " + num.substring(3,7) + " " + num.substring(7,num.length);
				} else {
					format = "";
				}
				return format;
				// return this.phone_number.replace(/(\d{4})(?=\d)/g, "$1 ");
			},
			
			/**
			 * 选择历史手机号码 
			 */
			bindHistory(item) {
				this.phone_number = item.phone;
				this.curHistory = false;
			},
			
			/**
			 * 清空历史手机号码
			 */
			bindHistoryClear() {
				uni.$emit("clearPhoneNumber", {})
				this.curHistory = false;
			},
			
			/**
			 * 选择充值 
			 */
			bindPay(item) {
				let reg = /^1[3456789]\d{9}$/;
				if (reg.test(this.phone_number)) {
					item.phone_number = this.phone_number;
					item.coupon_id = this.coupon_id;
					uni.$emit("pay_sinopec", {
						item: item
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
				}
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
		position: relative;
		.phone {
			width: 100%;
			border-bottom: 1rpx solid #EBEBEB;
			position: relative;
			z-index: 3;
			.title {
				padding: 0 5rpx;
				font-size: 24rpx;
			}
			.number_show {
				padding: 0 5rpx 20rpx 5rpx;
				width: calc(100% - 10rpx);
				height: 100rpx;
				font-size: 60rpx;
				font-family: "etccb-font";
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				position: absolute;
				left: 0;
				top: 34rpx;
				.box {
					line-height: 100rpx;
				}
				.box:nth-child(3),
				.box:nth-child(7) {
					margin-right: 10rpx;
				}
			}
			.input-box {
				.input {
					padding: 0 5rpx 0 5rpx;
					width: calc(100% - 10rpx);
					height: 100rpx;
					font-size: 50rpx;
					font-family: "etccb-font" !important;
					// color: rgba($color: #000000, $alpha: 0);
				}
			}
		}
		.tip {
			padding: 30rpx 0;
			color: #FF5C2A;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 2;
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
				z-index: 3;
				left: 0;
				top: 0;
				width: 100%;
				background-color: #FFFFFF;
				color: #222222;
				.scroll {
					width: 100%;
					height: 330rpx;
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
			.history-bg {
				position: fixed;
				left: 0rpx;
				top: 0rpx;
				width: 100vw;
				height: 100vh;
				background-color: rgba($color: #000000, $alpha: 0);
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
				.minbox:nth-child(3) {
					position: absolute;
					z-index: 1;
					right: 0;
					top: 0;
					height: 30rpx;
					.img {
						display: block;
						height: 30rpx;
					}
				}
				.minbox:nth-child(4) {
					position: absolute;
					z-index: 2;
					right: 0;
					top: 0;
					height: 30rpx;
					line-height: 30rpx;
					background-color: #FC4926;
					border-radius: 0 10rpx 0 10rpx;
					color: #FFFFFF;
					font-size: 20rpx;
					font-weight: 700;
					padding: 0 12rpx;
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
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_41.png") no-repeat !important;
				background-size: 100% 100% !important;
			}
			.box-bg-3 {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_43.png") no-repeat !important;
				background-size: 100% 100% !important;
			}
			.text-color {
				color: #CCCCCC !important;
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
			.box-2-color {
				color: #FF5C2A !important;
			}
		}
	}
</style>
