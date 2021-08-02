<template>
	<view>
		<!--收藏小程序提示-->
		<view class="main-collection-tip-box" v-if="is_show_collection" :style="{top:(statusBarHeight+80)+'rpx'}">
			<view class="btn-close" @click="onCloseCollection"></view>
			<view class="btn-add" @click="onAddCollection"></view>
		</view>
		<!--收藏小程序弹窗-->
		<view class="sub-collection-tip-box" v-if="is_show_sub_collection" @click="is_show_sub_collection=false">
			<image class="img" :style="{top:(statusBarHeight+80)+'rpx'}" src="https://image.etcchebao.com/etc-min/sub_guide_tip.png" />
			<view class="overlay"></view>
		</view>
	</view>
</template>
<script>
	import { mapState } from "vuex";
	const app = getApp();
	export default {
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight * 2,
				is_show_sub_collection: false
			}
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				is_show_collection: (state) => state.user.is_show_collection,
			}),
		},
		mounted() {
			this.changeCollectionTime();
		},
		methods: {
			/**
			 * 30天后没添加我的小程序，再次弹出
			 * 1001 发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表）
			 * 1089 微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）
			 */
			changeCollectionTime() {
				if (app.globalData.options.scene == 1089) {//已收藏
					uni.setStorageSync("cacheCollection", 1);
					return;
				}
				if (!uni.getStorageSync("cacheCollection")) {//首次创建收藏缓存
					uni.setStorageSync("cacheCollection", new Date().getTime());
				} else {//已有签到缓存
					if (Number(uni.getStorageSync("cacheCollection")) == 1) {//已收藏
						return;
					}
					let val = new Date().getTime() - uni.getStorageSync("cacheCollection");
					let unit = app.globalData.timeStampDay * 30;
					if (val - unit >= 0) {
						this.$store.commit("user/setIsShowCollection", true);
						this.is_show_sub_collection = true;
						uni.setStorageSync("cacheCollection", new Date().getTime());
					} else {
						console.log('收藏提示屏蔽未满30天')
					}
				}
			},
			
			onAddCollection() {
				this.$store.commit("user/setIsShowCollection", false);
				this.is_show_sub_collection = true;
			},
			onCloseCollection() {
				this.$store.commit("user/setIsShowCollection", false);
				this.is_show_sub_collection = false;
			},
		},
	}
</script>

<style lang="scss">
	.main-collection-tip-box {
		background: url("https://image.etcchebao.com/etc-min/main_guide_tip.png") no-repeat;
		background-size: 100%;
		width: 492rpx;
		height: 80rpx;
		position: fixed;
		top: 160rpx;
		right: 30rpx;
		z-index: 10001;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.btn-close {
			width: 60rpx;
			height: 50rpx;
		}

		.btn-add {
			width: 110rpx;
			height: 50rpx;
		}
	}

	.sub-collection-tip-box {
		height: 100vh;
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 10002;

		.img {
			width: 460rpx;
			height: 545rpx;
			position: absolute;
			top: 160rpx;
			right: 20rpx;
			z-index: 10001;

		}

		.overlay {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.7);
		}
	}
</style>
