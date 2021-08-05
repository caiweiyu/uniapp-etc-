<template>
	<view class="content">
		
		<!-- 附近油站 -->
		<view class="oil-station">
			<view class="top">
				<view class="title">附近油站</view>
				<view class="more">更多油站</view>
			</view>
			<view class="bottom">
				<view class="box" v-for="(item,index) in [0,0,0,0,0,0]" :key="index">
					<view class="minbox u-line-1">中石化东圃加油站</view>
					<view class="minbox">
						<image class="min-1" src="https://image.etcchebao.com/etc-min/etc-f/icon_45.png"></image>
						<view class="min-2 u-line-1">东圃大马路66号店东圃大马路66号店东圃大马路66号店东圃大马路66号店东圃大马路66号店</view>
					</view>
					<view class="minbox">
						<image class="min-1" src="https://image.etcchebao.com/etc-min/etc-f/icon_46.png"></image>
						<view class="min-2">020-882066</view>
					</view>
					<view class="minbox">
						<image class="min-1" src="https://image.etcchebao.com/etc-min/etc-f/icon_44.png"></image>
						<view class="min-2">3.2km</view>
					</view>
				</view>
			</view>
			<view class="last">— 已为你推荐周边最近的油站 —</view>
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
	.content {
		margin: 24rpx 0 0 0;
		padding: 0 25rpx;
		background-color: #FFFFFF;
		color: #222222;
		border-radius: 20rpx;
		.oil-station {
			.top {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 25rpx 0 0 0;
				.title {
					font-size: 34rpx;
					font-weight: 700;
				}
				.more {
					font-size: 28rpx;
					color: #999999;
				}
				.more::after {
					content: "";
					display: inline-block;
					vertical-align: middle;
					width: 12rpx;
					height: 12rpx;
					margin: -4rpx 0 0 10rpx;
					border-top: 1rpx solid #999999;
					border-right: 1rpx solid #999999;
					transform: rotate(45deg);
				}
			}
			.bottom {
				.box {
					padding: 40rpx 90rpx 40rpx 0;
					border-bottom: 1rpx solid #EBEBEB;
					position: relative;
					.minbox:nth-child(1) {
						font-size: 34rpx;
						font-weight: 700;
					}
					.minbox:nth-child(2) {
						margin: 12rpx 0 0 0;
						padding: 0 0 0 32rpx;
						position: relative;
						.min-1 {
							position: absolute;
							left: 0;
							top: 50%;
							transform: translate(0,-50%);
							width: 24rpx;
							height: 27rpx;
						}
						.min-2 {
							color: #999999;
							font-size: 28rpx;
						}
					}
					.minbox:nth-child(3) {
						margin: 12rpx 0 0 0;
						padding: 0 0 0 32rpx;
						position: relative;
						.min-1 {
							position: absolute;
							left: 0;
							top: 50%;
							transform: translate(0,-50%);
							width: 24rpx;
							height: 27rpx;
						}
						.min-2 {
							color: #229CF4;
							font-size: 28rpx;
						}
					}
					.minbox:nth-child(4) {
						position: absolute;
						right: 0;
						top: 50%;
						transform: translate(0,-50%);
						text-align: center;
						.min-1 {
							margin: 0 auto;
							width: 49rpx;
							height: 49rpx;
						}
						.min-2 {
							margin: 4rpx 0 0 0;
							font-size: 20rpx;
						}
					}
				}
			}
			.last {
				color: #B6B6B6;
				font-size: 24rpx;
				height: 84rpx;
				line-height: 84rpx;
				text-align: center;
			}
		}
	}
</style>
