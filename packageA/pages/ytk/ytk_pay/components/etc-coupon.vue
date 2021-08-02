<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	
	<!-- ********************************* -->
	<!-- 卡券 -->
	<!-- ********************************* -->
	<view class="content">
		
		<!-- 有效卡券 -->
		<view class="coupon" v-if="type == 'coupon'">
			<view class="box" v-for="(item,index) in coupon_list" :key="index" @click="$debounce(bindCouponSelect,item)">
				<view class="top">
					<view class="left-box">
						<view class="min">{{item.discount_quota}}</view>
						<view class="min">{{item.limit_msg}}</view>
					</view>
					<view class="right-box">
						<view class="min">{{item.coupon_type}}</view>
						<view class="min">{{item.coupon_title}}</view>
						<view class="min">有效期至{{item.coupon_expire_time}}</view>
					</view>
				</view>
				<view class="bottom">
					<view class="box" @click.stop="bindDetail($event, index)">
						<view class="min">查看详情</view>
						<image :class="['min', item.status ? 'active' : '']" src="https://image.etcchebao.com/etc-min/etc-f/icon_27.png"></image>
					</view>
					<view class="box" v-show="item.status">{{item.description}}</view>
				</view>
			</view>
		</view>
		
		<!-- 失效卡券 -->
		<view class="coupon-out" v-if="type == 'coupon-out'">
			<view class="box" v-for="(item,index) in coupon_list" :key="index" @click="$debounce(bindCouponSelect,item)">
				<view class="top">
					<view class="left-box">
						<view class="min">{{item.discount_quota}}</view>
						<view class="min">{{item.limit_msg}}</view>
					</view>
					<view class="right-box">
						<view class="min">{{item.coupon_type}}</view>
						<view class="min">{{item.coupon_title}}</view>
						<view class="min">有效期至{{item.coupon_expire_time}}</view>
					</view>
				</view>
				<view class="bottom">
					<view class="box" @click.stop="bindDetail($event, index)">
						<view class="min">查看详情</view>
						<image :class="['min', item.status ? 'active' : '']" src="https://image.etcchebao.com/etc-min/etc-f/icon_27.png"></image>
					</view>
					<view class="box" v-show="item.status">{{item.description}}</view>
				</view>
			</view>
		</view>
		
	</view>
	
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: "coupon"
			},
			coupon_list: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 选择优惠券
			 */
			bindCouponSelect(item) {
				this.$emit("callbackCouponSelect", {
					comeFrom: 1,
					coupon_gold: item.discount_quota,
					coupon_id: item.coupon_id
				})
			},
			
			/**
			 * 查看详情
			 */
			bindDetail(e,index) {
				this.$emit("callbackCouponSelect", {
					comeFrom: 2,
					index: index
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.coupon {
			margin: 20rpx 20rpx 0 20rpx;
			.box {
				margin-top: 20rpx;
				background-color: #FFFFFF;
				.top {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					height: 210rpx;
					border-radius: 8rpx;
					border: 1rpx solid #EBEBEB;
					border-bottom: none;
					box-sizing: border-box;
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
				}
				.bottom {
					// min-height: 80rpx;
					border-radius: 8rpx;
					border: 1rpx solid #EBEBEB;
					.box:nth-child(1) {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: center;
						margin: 0 20rpx;
						height: 80rpx;
						.min:nth-child(1) {
							font-size: 24rpx;
							color: #999999;
						}
						.min:nth-child(2) {
							width: 20rpx;
							height: 12rpx;
						}
						.active {
							transform: rotate(180deg);
						}
					}
					.box:nth-child(2) {
						margin: 0 20rpx;
						padding: 0 0 20rpx 0;
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
			.box:first-child {
				margin-top: 0;
			}
		}
		.coupon-out {
			margin: 20rpx 20rpx 0 20rpx;
			.box {
				margin-top: 20rpx;
				background-color: #FFFFFF;
				.top {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					height: 210rpx;
					border-radius: 8rpx;
					border: 1rpx solid #EBEBEB;
					border-bottom: none;
					box-sizing: border-box;
					.left-box {
						display: flex;
						flex-wrap: wrap;
						flex-direction: column;
						justify-content: center;
						align-content: center;
						width: 215rpx;
						height: 100%;
						background-color: #EBEBEB;
						text-align: center;
						color: #CCCCCC;
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
						color: #CCCCCC;
						.min:nth-child(1) {
							padding: 0 8rpx;
							display: inline-block;
							height: 38rpx;
							line-height: 38rpx;
							border: 1rpx solid #CCCCCC;
							color: #CCCCCC;
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
							color: #CCCCCC;
						}
					}
				}
				.bottom {
					// min-height: 80rpx;
					border-radius: 8rpx;
					border: 1rpx solid #EBEBEB;
					.box:nth-child(1) {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: center;
						margin: 0 20rpx;
						height: 80rpx;
						.min:nth-child(1) {
							font-size: 24rpx;
							color: #CCCCCC;
						}
						.min:nth-child(2) {
							width: 20rpx;
							height: 12rpx;
						}
						.active {
							transform: rotate(180deg);
						}
					}
					.box:nth-child(2) {
						margin: 0 20rpx;
						padding: 0 0 20rpx 0;
						font-size: 24rpx;
						color: #CCCCCC;
					}
				}
			}
			.box:first-child {
				margin-top: 0;
			}
		}
	}
</style>
