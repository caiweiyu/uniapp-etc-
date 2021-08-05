<template>
	<view class="content">
		
		<!-- 卡券列表 -->
		<view class="scroll-coupon" v-if="sinoepc_init.coupon.total > 0">
			<image src="https://image.etcchebao.com/etc-min/etc-f/icon_38.png"></image>
			<scroll-view scroll-x class="scroll">
				<view :class="['box']" hover-class="hover" v-for="(item,index) in sinoepc_init.coupon.coupon_list" :key="index">
					<view class="minbox">60</view>
					<view class="minbox">满足200元可用</view>
					<view class="minbox">有效期至2021-12-30</view>
					<view class="minbox">
						<text :decode="true">立即\n领取</text>
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
					padding: 0 148rpx 0 140rpx;
					width: 570rpx;
					height: 150rpx;
					background: url("https://image.etcchebao.com/etc-min/etc-f/icon_39.png") no-repeat;
					background-size: 100% 100%;
					position: relative;
					.minbox:nth-child(1) {
						position: absolute;
						left: 0;
						top: 50%;
						transform: translate(0,-50%);
						width: 140rpx;
						text-align: center;
						font-size: 62rpx;
						font-weight: 700;
						color: #FF401E;
						font-family: "etccb-font";
					}
					.minbox:nth-child(1)::before {
						content: "￥";
						display: inline-block;
						vertical-align: middle;
						font-size: 34rpx;
						font-weight: 700;
						color: #FF401E;
						padding: 4rpx 0 0 0;
					}
					.minbox:nth-child(2) {
						padding: 36rpx 0 0 0;
						font-size: 34rpx;
						font-weight: 700;
					}
					.minbox:nth-child(3) {
						padding: 4rpx 0 0 0;
						font-size: 26rpx;
						color: #666666;
					}
					.minbox:nth-child(4) {
						position: absolute;
						right: 32rpx;
						top: 50%;
						transform: translate(0,-50%);
						color: #FF401E;
						font-size: 32rpx;
						font-weight: 700;
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
