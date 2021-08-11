<template>
	<view class="content">
		
		<!-- 附近油站 -->
		<view class="oil-station">
			<view class="top">
				<view class="title">附近油站</view>
				<view class="more" @click="$debounce(bindMore)">更多油站</view>
			</view>
			<view class="bottom">
				<view class="box" v-for="(item,index) in oil_station" :key="index" @click="$debounce(bindMap, item)">
					<view class="minbox u-line-1">{{item.name}}</view>
					<view class="minbox">
						<image class="min-1" src="https://image.etcchebao.com/etc-min/etc-f/icon_45.png"></image>
						<view class="min-2 u-line-1">{{item.address}}</view>
					</view>
					<view class="minbox">
						<image class="min-1" src="https://image.etcchebao.com/etc-min/etc-f/icon_46.png" @click.stop="bindCallPhone(item)"></image>
						<view class="min-2" @click.stop="bindCallPhone(item)">{{item.telephone}}</view>
					</view>
					<view class="minbox">
						<image class="min-1" src="https://image.etcchebao.com/etc-min/etc-f/icon_44.png"></image>
						<view class="min-2">{{item.juli}}</view>
					</view>
				</view>
			</view>
			<view class="last">— 已为你推荐周边最近的油站 —</view>
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
				sinoepc_init: (state) => state.sinoepc.sinoepc_init,
				oil_station: (state) => state.sinoepc.oil_station
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
			 * 更多油站
			 */
			bindMore() {
				uni.navigateTo({
					url: "/packageA/pages/sinopec/home/sinoepc_list"
				})
			},
			
			/**
			 * 拨打电话
			 */
			bindCallPhone(item) {
				uni.makePhoneCall({
					phoneNumber: item.telephone
				})
			},
			
			/**
			 * 去地图导航
			 */
			bindMap(item) {
				uni.navigateTo({
				    url: `/pages/location/main?latitude=${item.lat}&longitude=${item.lng}&address=${item.address}&name=${item.name}`
				})
			}
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
		position: relative;
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
							display: inline-block;
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
