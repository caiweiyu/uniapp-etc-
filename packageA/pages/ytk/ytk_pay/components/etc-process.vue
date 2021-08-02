<template>
	<view class="content">
		
		<!-- ******************************** -->
		<!-- 进度条 -->
		<!-- ******************************** -->
		<view class="process">
			<view class="box" v-for="(item,index) in list" :key="index">
				<!-- 数字&&bgColor -->
				<view :class="['minbox', item.status == 1 ? 'active-1' : '']">
					<view :class="['mm', item.status == 1 ? 'active-2' : '']">{{index+1}}</view>
				</view>
				<!-- 文案 -->
				<view :class="['minbox', item.status == 1 ? 'active-3' : '']">{{item.name}}</view>
				<!-- 虚线 -->
				<view :class="['minbox',item.active == 1 ? 'active-4' : '']" v-if="index > 0">
					<view class="round" v-for="(item,index) in [0,0,0,0,0,0,0,0,0,0]" :key="index"></view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()

	export default {
		props:{
			list:{
				type:Array,
				default:[
					{ name: "支付金额", status: 1,  active:0},
					{ name: "连接设备", status: 0,  active:0},
					{ name: "充值完成", status: 0,  active:0},
				]
			}
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
		padding: 30rpx 0 0 0;
		color: #222222;
		.process {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			text-align: center;
			.box {
				margin: 0 0 0 128rpx;
				width: 100rpx;
				position: relative;
				.minbox:nth-child(1) {
					position: relative;
					margin: 0 auto;
					width: 56rpx;
					height: 56rpx;
					border-radius: 100%;
					.mm {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
						width: 38rpx;
						height: 38rpx;
						line-height: 38rpx;
						font-size: 24rpx;
						color: #FFFFFF;
						border-radius: 100%;
						background-color: #cccccc;
					}
				}
				.minbox:nth-child(2) {
					margin: 8rpx 0 0 0;
					font-size: 24rpx;
					color: #999999;
					
				}
				.minbox:nth-child(3) {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: center;
					position: absolute;
					left: -130rpx;
					top: 25rpx;
					width: 130rpx;
					height: 10rpx;
					.round {
						width: 6rpx;
						height: 6rpx;
						background-color: #cccccc;
						border-radius: 100%;
					}
				}
			}
			.box:first-child {
				margin: 0;
			}
		}
		.active-1 {
			background-color: rgba($color: #FF5C2A, $alpha: 0.1) !important;
		}
		.active-2 {
			background-color: #FF5C2A !important;
		}
		.active-3 {
			color: #222222 !important;
			font-weight: 700 !important;
		}
		.active-4{
			.round{
				background-color: #FF5C2A !important;
			}
		}
	}
</style>

