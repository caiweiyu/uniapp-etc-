<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 16:30:38
 * @LastEditors: yongqing
 * @LastEditTime: 2021-04-07 10:49:58
-->
<template>
	<view class="card" v-if="card_num">
		<view :class="'item ' + (type == 1 ? 'red' : 'green')" @click="requestSubscribeMessage">
			<view class="item-content" v-if="card_type !== 'confirm'">
				<view class="header">
					<view class="card-info">
						<view class="car-plate">{{ plate }}</view>
						<view class="card-no">{{ formatCardNum }}</view>
					</view>
				</view>
				<view class="footer">
					<image class="card-icon" src="https://image.etcchebao.com/etc-min/unitoll_small_logo.png" alt="" />
					<view class="card-type">{{ card_name }}</view>
				</view>
				<image class="unitoll-logo" src="https://image.etcchebao.com/etc-min/unitoll_logo.png" />
			</view>
			<view v-else class="item-content-confirm">
				<view class="card-info">
					<view class="car-plate">{{ plate }}</view>
					<view class="card-no">{{ formatCardNum }}</view>
				</view>
			</view>
			<!-- <view class="card-confirm"  @click="toConfirm">确认信息</view> -->
		</view>
	</view>
	<view v-else-if="empty_tip" class="card" @click="$emit('onAddCard')">
		<view class="item gray">
			<view class="add-box">
				<image class="icon-add" src="https://image.etcchebao.com/etc-min/icon_add.png" />
				<view class="add-text">{{ empty_tip }}</view>
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
			type: {
				type: String,
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
		},
		computed: {
			formatCardNum() {
				if (this.card_num) {
					return (this.card_num + "").replace(/(\d{4})(?=\d)/g, "$1 ");
				}
			},
		},
		methods: {
			toConfirm() {
				uni.navigateTo({
					url: `/pages/ytk/bind_ytk/main?card_num=${this.card_num}`
				})
			},
			requestSubscribeMessage() {
				wx.requestSubscribeMessage({
					tmplIds: ['odwFFrzxNDlJL6o3IntNbaCHRTIV2d47njhU_9PQsyQ'],
					success(res) {}
				})
			}
		},
	};
</script>

<style lang="scss" scoped>
	.card {
		height: 100%;

		.item {
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

			.card-confirm {
				position: absolute;
				color: #ffffff;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				top: 90rpx;
				right: 40rpx;

				&::after {
					content: "";
					display: inline-block;
					width: 0;
					height: 0;
					border-width: 14rpx;
					border-style: solid;
					border-color: transparent transparent transparent #ffffff;
					margin-left: 12rpx;
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
					.car-plate {
						font-size: 46rpx;
					}

					.card-no {
						color: rgba($color: #FFFFFF, $alpha: 0.6);
						font-size: 30rpx;
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
				padding: 0 33rpx;

				.header {
					padding-top: 30rpx;

					.card-info {
						.car-plate {
							font-size: 46rpx;
						}

						.card-no {
							color: rgba($color: #FFFFFF, $alpha: 0.6);
							font-size: 30rpx;
						}
					}
				}

				.footer {
					margin-top: 40rpx;
					font-size: 30rpx;
					padding: 23rpx 0;
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
