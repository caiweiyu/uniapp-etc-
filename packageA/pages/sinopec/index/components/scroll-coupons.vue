<template>
	<view class="content">
		
		<!-- 卡券列表 -->
		<view class="scroll-coupon" v-if="sinoepc_init.new_coupon_list.length > 0">
			<image src="https://image.etcchebao.com/etc-min/etc-f/icon_38_1.png"></image>
			<scroll-view scroll-x class="scroll">
				<view :class="['box', item.status != 1 ? 'box-active' : '']" hover-class="hover" v-for="(item,index) in sinoepc_init.new_coupon_list" :key="index" @click="$debounce(getCoupon, item)">
					<view :class="['minbox', item.status != 1 ? 'text-color' : '', item.get_money.length >= 6 ? 'minbox-font' : '']">
						<text :class="['text', item.get_money.length >= 6 ? 'text-font' : '']">￥</text>{{item.get_money}}
					</view>
					<view :class="['minbox', item.status != 1 ? 'text-color' : '']">
						<view class="min">{{item.title}}</view>
						<view :class="['min', item.status != 1 ? 'text-color' : '']">{{item.expire_time}}</view>
					</view>
					<view :class="['minbox', item.status != 1 ? 'text-color' : '']">
						<text :decode="true" v-if="item.status != 1">已经\n领取</text>
						<text :decode="true" v-else>立即\n领取</text>
					</view>
				</view>
			</scroll-view>
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
				
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 领取电子卡券
			 */
			getCoupon(item) {
				if (item.status != 1) {
					// uni.showToast({
					// 	title: "请不要重复领取",
					// 	icon: "none",
					// 	mask: true,
					// 	duration: 1500
					// })
				} else {
					uni.$emit("getCoupon", {
						id: item.id
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.hover {
		opacity: 0.7;
	}
	.content {
		margin: 24rpx 0 0 0;
		position: relative;
		color: #222222;
		.scroll-coupon {
			width: 100%;
			height: 260rpx;
			.scroll {
				position: absolute;
				left: 0;
				top: 84rpx;
				width: 100%;
				height: 160rpx;
				white-space: nowrap;
				.box {
					display: inline-block;
					vertical-align: top;
					margin: 0 0 0 20rpx;
					padding: 0 148rpx 0 0;
					width: 570rpx;
					height: 150rpx;
					background: url("https://image.etcchebao.com/etc-min/etc-f/icon_39.png") no-repeat;
					background-size: 100% 100%;
					position: relative;
					.minbox:nth-child(1) {
						display: inline-block;
						vertical-align: top;
						padding: 0 40rpx 0 10rpx;
						min-width: 140rpx;
						line-height: 150rpx;
						text-align: center;
						font-weight: 700;
						color: #FF401E;
						font-family: "etccb-font";
						font-size: 62rpx;
						.text {
							font-size: 34rpx;
						}
					}
					.minbox:nth-child(2) {
						display: inline-block;
						vertical-align: top;
						.min:nth-child(1) {
							padding: 36rpx 0 0 0;
							font-size: 34rpx;
							font-weight: 700;
						}
						.min:nth-child(2) {
							padding: 4rpx 0 0 0;
							font-size: 26rpx;
							color: #666666;
						}
					}
					.minbox:nth-child(3) {
						position: absolute;
						right: 32rpx;
						top: 50%;
						transform: translate(0,-50%);
						text-align: center;
						color: #FF401E;
						font-size: 32rpx;
						font-weight: 700;
					}
					.text-color {
						color: #CCCCCC !important;
					}
					.minbox-font {
						font-size: 42rpx !important;
						.text-font {
							font-size: 24rpx !important;
						}
					}
				}
				.box-active {
					background: url("https://image.etcchebao.com/etc-min/etc-f/icon_40.png") no-repeat;
					background-size: 100% 100%;
				}
				.box:last-child {
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
