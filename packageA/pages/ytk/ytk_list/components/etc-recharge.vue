<template>
	<view class="content">
		
		<u-popup
			v-model="showPopup"
		    mode="center"
			height="auto"
			z-index="999999"
		>
			<view class="recharge">
				<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_28.png" mode="widthFix"></image>
				<view class="desc">
					<view class="text" :key="index" v-for="(item,index) in list">{{item}}</view>
				</view>
				<view class="btn-close" @click="bindClosePopup">已有设备，开始充值</view>
				<view class="not-show" @click="bindCloseFover">不再提示</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPopup: false,
				list: [
					"1.在线为ETC储值卡进行充值",
					"2.支持蓝牙OBU、充值易设备进行圈存",
					"3.暂不支持手机NFC圈存"
				]
			}
		},
		mounted() {
			this.loadPopup();
		},
		methods: {
			/**
			 * 判断是否显示弹窗
			 */
			loadPopup() {
				if (!uni.getStorageSync("cache_recharge")) {
					uni.setStorageSync("cache_recharge", "true");
					this.showPopup = true;
				} else {
					if (uni.getStorageSync("cache_recharge") == "true") {
						this.showPopup = true;
					} else {
						this.showPopup = false;
					}
				}
			},
			
			/**
			 * 已有设备，开始充值
			 * 关闭弹窗
			 */
			bindClosePopup() {
				this.showPopup = !this.showPopup;
			},
			
			/**
			 * 不在提示
			 */
			bindCloseFover() {
				uni.setStorageSync("cache_recharge", "false");
				this.showPopup = false;
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.recharge {
			width: 630rpx;
			height: 960rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			.img {
				display: block;
				width: 100%;
			}
			.desc {
				margin: 40rpx 28rpx 0 28rpx;
				font-size: 28rpx;
				color: #666666;
				.text {
					margin: 8rpx 0 0 0;
					&.text:first-child {
						margin: 0;
					}
				}
			}
			.btn-close {
				width: 558rpx;
				height: 98rpx;
				background-color: #FF6D40;
				color: #FFFFFF;
				font-size: 32rpx;
				text-align: center;
				line-height: 98rpx;
				border-radius: 100rpx;
				margin: 48rpx auto 0 auto;
			}
			.not-show {
				padding: 32rpx 0 26rpx 0;
				color: #999999;
				font-size: 32rpx;
				text-align: center;
			}
		}
	}
</style>
