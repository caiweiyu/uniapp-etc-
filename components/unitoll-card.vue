<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 16:30:38
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-04-07 10:49:58
-->
<template>

	<view class="card" v-if="card_num">
		<view :class="'item ' + (type == 1 ? 'red' : 'green')" @click="requestSubscribeMessage">

			<!-- 使用位置 => 粤通卡列表 -->
			<view class="item-content" v-if="card_type == 'confirm'">
				<!-- 粤通卡号，绑车牌 -->
				<view class="header">
					<view class="card-info">
						<view class="car-plate">
							<text v-if="plate == ''">未绑定</text>
							<text decode="true">{{plate_start}}&nbsp;{{plate_end}}</text>
						</view>
						<view class="card-no">{{formatCardNum}}</view>
					</view>
				</view>
				<!-- 底部粤通卡name -->
				<view class="footer">
					<image class="card-icon" src="https://image.etcchebao.com/etc-min/unitoll_small_logo.png" alt="" />
					<view class="card-type">{{card_name}}</view>
				</view>
				<!-- logo -->
				<image class="unitoll-logo" src="https://image.etcchebao.com/etc-min/unitoll_logo.png" />
				<!-- 箭头 -->
				<!-- <image class="icon" src="https://image.etcchebao.com/etc-min/etc-f/icon_18.png"></image> -->
				<!-- 待处理订单 -->
				<view class="order" v-if="order_num > 0 && !default_card" @click.stop="$debounce(bindOrder)">
					<view class="text">{{order_num}}个订单待处理</view>
					<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_18.png"></image>
				</view>
			</view>

			<!-- 使用位置 => 账单bill -->
			<view v-else class="item-content-confirm">
				<view class="card-info">
					<view class="car-plate">
						<text decode="true">{{plate_start}}&nbsp;{{plate_end}}</text>
					</view>
					<view class="card-no">{{formatCardNum}}</view>
				</view>
			</view>

		</view>
	</view>

	<!-- 未添加粤通卡（请添加粤通卡） -->
	<view v-else-if="empty_tip" class="card" @click="$emit('onAddCard')">
		<view class="item gray">
			<view class="add-box">
				<image class="icon-add" src="https://image.etcchebao.com/etc-min/icon_add.png" />
				<view class="add-text">{{empty_tip}}</view>
			</view>
			<image class="unitoll-logo" src="https://image.etcchebao.com/etc-min/unitoll_logo.png" />
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			card_type: {
				type: String,
				default: "",
			},
			card_name: {
				type: String,
				default: "",
			},
			card_num: {
				type: String,
				default: "",
			},
			plate: {
				type: String,
				default: "",
			},
			plate_start: {
				type: String,
				default: "",
			},
			plate_end: {
				type: String,
				default: "",
			},
			type: {
				type: [Number, String],
				default: "",
			},
			url: {
				type: String,
				default: "",
			},
			empty_tip: {
				type: String,
				default: "",
			},
			order_id: {
				type: String,
				default: ""
			},
			order_num: {
				type: [Number, String],
				default: 0
			},
			default_card: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			formatCardNum() {
				if (this.card_num) {
					return (this.card_num + "").replace(/(\d{4})(?=\d)/g, "$1 ");
				}
			},
		},
		data() {
			return {

			}
		},
		methods: {
			toConfirm() {
				uni.navigateTo({
					url: `/packageA/pages/ytk/bind_ytk/main?card_num=${this.card_num}`
				})
			},

			/**
			 * 订阅消息
			 */
			requestSubscribeMessage() {
				if (this.order_num > 0 || this.default_card) return
				wx.requestSubscribeMessage({
					tmplIds: ['odwFFrzxNDlJL6o3IntNbaCHRTIV2d47njhU_9PQsyQ'],
					success(res) {}
				})
			},

			/**
			 * 未处理订单
			 */
			bindOrder() {
				if (Number(this.order_num) > 1) { //多个未处理订单
					uni.navigateTo({
						url: `/packageA/pages/order/home/main`
					})
				} else { //一个订单未处理
					uni.navigateTo({
						url: `/packageA/pages/ytk/ytk_list/order_detail?orderId=${this.order_id}`
					})
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.card {
		height: 100%;
		width: 690rpx;
		margin: 0 auto;

		.item {
			// margin-bottom: 16rpx;
			height: inherit;
			position: relative;
			color: #fff;
			border-radius: 8rpx;
			overflow: hidden;

			&.red {
				background: #f07365;
			}

			&.green {
				background: #28bc93;
			}

			&.gray {
				background: #48485c;
			}

			.add-box {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				left: 40rpx;
				transform: translateY(-50%);

				.icon-add {
					width: 36rpx;
					height: 36rpx;
				}

				.add-text {
					font-size: 36rpx;
					padding-left: 20rpx;
					line-height: 1;
				}
			}

			.unitoll-logo {
				width: 331rpx;
				height: 194rpx;
				position: absolute;
				right: 14rpx;
				top: 5rpx;
				opacity: 0.2;
			}

			.item-content-confirm {
				position: relative;
				z-index: 10;
				padding: 54rpx 47rpx;

				.card-info {
					letter-spacing: 5rpx;

					.car-plate {
						font-size: 48rpx;
						line-height: 68rpx;
					}

					.card-no {
						color: rgba($color: #FFFFFF, $alpha: 0.5);
						font-size: 30rpx;
						line-height: 42rpx;
					}
				}

				&:after {
					content: '';
					width: 20rpx;
					height: 20rpx;
					border-color: #FFFFFF #ffffff transparent transparent;
					border-style: solid;
					border-width: 4rpx;
					position: absolute;
					top: 50%;
					transform: translateY(-50%) rotate(45deg);
					right: 50rpx;
				}
			}

			.item-content {
				position: relative;
				z-index: 10;
				padding: 0 28rpx;

				.header {
					padding-top: 24rpx;

					.card-info {
						letter-spacing: 5rpx;

						.car-plate {
							font-size: 48rpx;
							line-height: 68rpx;
						}

						.card-no {
							color: rgba($color: #FFFFFF, $alpha: 0.6);
							font-size: 30rpx;
							line-height: 42rpx;
						}
					}
				}

				.footer {
					margin-top: 40rpx;
					font-size: 24rpx;
					padding: 28rpx 0;
					border-top: 1rpx dashed rgba($color: #FFFFFF, $alpha: 0.3);
					display: flex;
					align-items: center;
					flex-direction: row;
					line-height: 1.3;

					.card-icon {
						width: 36rpx;
						height: 22rpx;
						margin-right: 10rpx;
					}
				}

				.icon {
					position: absolute;
					right: 28rpx;
					bottom: 120rpx;
					width: 13rpx;
					height: 24rpx;
				}

				.order {
					position: absolute;
					right: 28rpx;
					bottom: 0;
					height: 82rpx;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;

					.text {
						font-size: 24rpx;
					}

					.img {
						margin: 2rpx 0 0 10rpx;
						width: 13rpx;
						height: 24rpx;
					}
				}
			}

			.corner-mark {
				position: absolute;
				top: 25rpx;
				right: 0;
				height: 48rpx;
				font-size: 24rpx;
				line-height: 48rpx;
				background: rgba(0, 0, 0, 0.3);
				border-top-left-radius: 24rpx;
				border-bottom-left-radius: 24rpx;
				padding: 0 10rpx 0 5rpx;

				.corner-mark-type {
					position: relative;
					padding-left: 50rpx;

					.i {
						display: inline-block;
						width: 26rpx;
						height: 26rpx;
						border-radius: 13rpx;
						border: 1rpx solid #fff;
						position: absolute;
						top: 8rpx;
						left: 10rpx;
					}

					::before {
						content: "";
						width: 14rpx;
						height: 6rpx;
						display: inline-block;
						border: 1rpx solid #fff;
						border-width: 0 0 2rpx 2rpx;
						transform: rotate(-45deg);
						-ms-transform: rotate(-45deg);
						-moz-transform: rotate(-45deg);
						-webkit-transform: rotate(-45deg);
						-o-transform: rotate(-45deg); // vertical-align: baseline;
						position: absolute;
						top: 8rpx;
						left: 6rpx;
					}
				}
			}
		}
	}
</style>
