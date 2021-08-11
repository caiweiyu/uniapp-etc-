<template>
	<view class="content">
		
		<!-- 卡券活动 -->
		<block v-if="type == 1 && token && sinoepc_init.is_show_coupon_dialog == 1">
			<u-popup v-model="show_coupons" mode="center" height="auto" :mask-close-able="false">
				<view class="coupons">
					<view class="box"></view>
					<view class="box">
						<scroll-view scroll-y class="scroll">
							<view class="minbox" v-for="(item,index) in sinoepc_init.new_coupon_list" :key="index">
								<view :class="['min', item.get_money.length >= 6 ? 'min-font' : '']">
									<text :class="['text', item.get_money.length >= 6 ? 'text-font' : '']">￥</text>{{item.get_money}}
								</view>
								<view class="min u-line-1">{{item.title}}</view>
								<view class="min u-line-1">{{item.expire_time}}</view>
							</view>
						</scroll-view>
					</view>
					<view class="box" @click="bindClose_1"></view>
					<view class="box" @click="bindClose_1"></view>
				</view>
			</u-popup>
		</block>
		
		<!-- 积分 -->
		<block v-if="type == 2 && token && sinoepc_init.credit && sinoepc_init.credit > 0">
			<u-popup v-model="show_integral" mode="center" height="auto" :mask-custom-style="{background: 'rgba(0, 0, 0, 0)'}">
				<view class="integral" @click="bindClose_2">
					<view class="box"></view>
					<view class="box">
						<block v-if="sinoepc_init.credit">
							<text class="text">{{sinoepc_init.credit}}</text>积分
						</block>
						<block v-else>
							<text class="text">0</text>积分
						</block>
					</view>
					<view class="box">恭喜您获得加油积分兑换</view>
				</view>
			</u-popup>
		</block>
		
		<!-- 我的卡券 -->
		<block v-if="type == 3">
			<u-popup v-model="show_coupons_mine" mode="bottom" height="auto">
				<view class="coupons_mine">
					<view class="title">
						<view class="text">选择卡券</view>
						<image class="close" src="https://image.etcchebao.com/etc-min/etc-f/icon_53.png" @click="bindClose_3"></image>
					</view>
					<view class="select" @click="bindUseCoupon">
						<view class="text">不使用卡券</view>
						<icon class="icon" type="circle" size="20" v-show="!curCoupon"></icon>
						<icon class="icon" type="success" size="20" v-show="curCoupon"></icon>
					</view>
					<view class="list" v-if="sinoepc_init.coupon.total > 0">
						<view class="name">有{{sinoepc_init.coupon.total || 0}}张卡券可用</view>
						<scroll-view class="scroll" scroll-y>
							<view class="box" v-for="(item,index) in sinoepc_init.coupon.coupon_list" :key="index" @click="bindSelectCoupon(index)">
								<view class="left-box">
									<view class="min">{{item.discount_quota}}</view>
									<view class="min">{{item.limit_msg}}</view>
								</view>
								<view class="right-box">
									<view class="min">{{item.coupon_type}}</view>
									<view class="min">{{item.coupon_title}}</view>
									<view class="min">有效期至{{item.coupon_expire_time}}</view>
								</view>
								<icon class="icon" type="circle" size="20" v-show="!item.xcx_select"></icon>
								<icon class="icon" type="success" size="20" v-show="item.xcx_select"></icon>
							</view>
						</scroll-view>
					</view>
					<view class="none" v-if="sinoepc_init.coupon.length == 0 || sinoepc_init.coupon.total <= 0">
						<image class="img" src="https://image.etcchebao.com/etc-min/order/no_card.png" mode="widthFix"></image>
						<view class="text">暂无可用于加油的优惠券</view>
					</view>
				</view>
			</u-popup>
		</block>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	export default {
		props: {
			type: {
				type: Number,
				default: 0
			}
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				sinoepc_init: (state) => state.sinoepc.sinoepc_init
			})
		},
		data() {
			return {
				show_coupons: true,
				show_integral: true,
				show_coupons_mine: false,
				curCoupon: false
			}
		},
		mounted() {
			uni.$on("couponPopup", (e)=>{
				this.show_coupons_mine = e.show_coupons_mine;
				if (this.sinoepc_init.coupon.length == 0 || this.sinoepc_init.coupon.total <= 0) {
					this.curCoupon = true;
				};//未有优惠卡券
			})
		},
		methods: {
			/**
			 * 关闭按钮
			 */
			bindClose_1() {
				this.show_coupons = false;
			},
			bindClose_2() {
				this.show_integral = false;
			},
			bindClose_3() {
				this.show_coupons_mine = false;
			},
			
			/**
			 * 是否使用卡券
			 */
			bindUseCoupon() {
				if (this.sinoepc_init.coupon.length == 0 || this.sinoepc_init.coupon.total <= 0) {
					return;
				};//未有优惠卡券
				this.curCoupon = !this.curCoupon;
				if (this.curCoupon) {
					for (let i = 0; i < this.sinoepc_init.coupon.coupon_list.length; i++) {
						this.sinoepc_init.coupon.coupon_list[i].xcx_select = false;
					}
					uni.$emit("selectETCCoupon", {
						coupon_text: `未使用`,
						coupon_id: ""
					})
				}
			},
			
			/**
			 * 选择卡券类型
			 */
			bindSelectCoupon(index) {
				for (let i = 0; i < this.sinoepc_init.coupon.coupon_list.length; i++) {
					this.sinoepc_init.coupon.coupon_list[i].xcx_select = false;
				}
				this.sinoepc_init.coupon.coupon_list[index].xcx_select = true;
				this.curCoupon = false;
				uni.$emit("selectETCCoupon", {
					coupon_text: `-￥${this.sinoepc_init.coupon.coupon_list[index].discount_quota}`,
					coupon_id: this.sinoepc_init.coupon.coupon_list[index].coupon_id,
					index: index
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.coupons {
			.box:nth-child(1) {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_47_1.png") no-repeat;
				background-size: 100% 100%;
				width: 750rpx;
				height: 347rpx;
			}
			.box:nth-child(2) {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_48_1.png") no-repeat;
				background-size: 100% 100%;
				width: 750rpx;
				height: 471rpx;
				padding: 8rpx 0 0 0;
				.scroll {
					margin: 0 0 0 86rpx;
					width: 578rpx;
					height: 100%;
					.minbox {
						margin: 12rpx auto 0 auto;
						width: 520rpx;
						height: 140rpx;
						background: url("https://image.etcchebao.com/etc-min/etc-f/icon_50.png") no-repeat;
						background-size: 100% 100%;
						position: relative;
						.min:nth-child(1) {
							font-family: "etccb-font";
							font-size: 54rpx;
							color: #FF401E;
							position: absolute;
							left: 0;
							top: 50%;
							transform: translate(0,-50%);
							width: 180rpx;
							text-align: center;
							.text {
								font-size: 28rpx;
							}
						}
						.min:nth-child(2) {
							padding: 32rpx 20rpx 0 200rpx;
							font-size: 30rpx;
							font-weight: 700;
						}
						.min:nth-child(3) {
							padding: 8rpx 20rpx 0 200rpx;
							font-size: 22rpx;
							color: #999999;
						}
						.min-font {
							font-size: 36rpx !important;
							.text-font {
								font-size: 20rpx !important;
							}
						}
					}
					.minbox:first-child {
						margin-top: 0;
					}
				}
			}
			.box:nth-child(3) {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_49_1.png") no-repeat;
				background-size: 100% 100%;
				width: 750rpx;
				height: 156rpx;
			}
			.box:nth-child(4) {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_51.png") no-repeat;
				background-size: 100% 100%;
				width: 66rpx;
				height: 66rpx;
				margin: 20rpx auto 0 auto;
			}
		}
		.integral {
			width: 360rpx;
			height: 342rpx;
			border-radius: 16rpx;
			background-color: rgba($color: #000000, $alpha: 0.7);
			padding: 18rpx 0 0 0;
			text-align: center;
			.box:nth-child(1) {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_52.png") no-repeat;
				background-size: 100% 100%;
				width: 227rpx;
				height: 227rpx;
				margin: 0 auto;
			}
			.box:nth-child(2) {
				margin: -30rpx 0 0 0;
				font-size: 34rpx;
				font-weight: 700;
				color: #FED145;
				.text {
					padding: 0 8rpx 0 0;
					font-size: 52rpx;
					font-family: "etccb-font";
				}
			}
			.box:nth-child(3) {
				color: #FFFFFF;
				font-size: 28rpx;
			}
		}
		.coupons_mine {
			background-color: #F9F9F9;
			height: 880rpx;
			.title {
				height: 120rpx;
				line-height: 120rpx;
				color: #000000;
				font-size: 32rpx;
				font-weight: 700;
				text-align: center;
				position: relative;
				.close {
					position: absolute;
					right: 0;
					top: 0;
					width: 22rpx;
					height: 22rpx;
					padding: 49rpx;
				}
			}
			.select {
				padding: 0 30rpx;
				height: 108rpx;
				background-color: #FFFFFF;
				font-size: 32rpx;
				position: relative;
				.text {
					line-height: 108rpx;
				}
				.icon {
					position: absolute;
					right: 30rpx;
					top: 50%;
					transform: translate(0,-50%);
				}
			}
			.list {
				.name {
					padding: 50rpx 30rpx 20rpx 30rpx;
					font-size: 30rpx;
					font-weight: 700;
				}
				.scroll {
					margin: 0 auto;
					width: 710rpx;
					height: 524rpx;
					.box {
						margin: 24rpx 0 0 0;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						height: 210rpx;
						border-radius: 8rpx;
						border: 1rpx solid #EBEBEB;
						box-sizing: border-box;
						position: relative;
						.left-box {
							display: flex;
							flex-wrap: wrap;
							flex-direction: column;
							justify-content: center;
							align-content: center;
							width: 215rpx;
							height: 100%;
							background-color: #F9ECD3;
							text-align: center;
							.min:nth-child(1) {
								font-size: 72rpx;
								font-weight: 700;
								font-family: 'etccb-font';
							}
							.min:nth-child(1)::before {
								content: "￥";
								display: inline-block;
								font-size: 36rpx;
								font-weight: 700;
							}
							.min:nth-child(2) {
								font-size: 24rpx;
							}
						}
						.right-box {
							padding: 34rpx 40rpx 0 40rpx;
							width: 412rpx;
							height: 100%;
							.min:nth-child(1) {
								padding: 0 8rpx;
								display: inline-block;
								height: 38rpx;
								line-height: 38rpx;
								border: 1rpx solid #D1A86A;
								color: #D1A86A;
								border-radius: 4rpx;
								font-size: 24rpx;
							}
							.min:nth-child(2) {
								margin: 20rpx 0 0 0;
								font-size: 32rpx;
								font-weight: 700;
							}
							.min:nth-child(3) {
								margin: 4rpx 0 0 0;
								font-size: 24rpx;
								color: #999999;
							}
						}
						.icon {
							position: absolute;
							right: 20rpx;
							top: 50%;
							transform: translate(0,-50%);
						}
					}
					.box:first-child {
						margin: 0;
					}
				}
			}
			.none {
				padding: 120rpx 0 0 0;
				text-align: center;
				.img {
					margin: 0 auto;
					width: 332rpx;
				}
				.text {
					margin: 22rpx 0 0 0;
					font-size: 30rpx;
				}
			}
		}
	}
</style>
