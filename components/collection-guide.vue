<template>
	<view>
		<!--收藏小程序提示-->
		<view class="main-collection-tip-box" v-if="is_show_collection" :style="{top:(statusBarHeight+40)+'px'}">
			<view class="btn-close" @click="onCloseCollection"></view>
			<view class="btn-add" @click="onAddCollection"></view>
		</view>
		<!--收藏小程序弹窗-->
		<view class="sub-collection-tip-box" v-if="is_show_sub_collection" @click="is_show_sub_collection=false">
			<image :style="{top:(statusBarHeight+40)+'px'}" src="https://image.etcchebao.com/etc-min/sub_guide_tip.png" />
			<view class="overlay"></view>
		</view>
	</view>
</template>
<script>
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 2,
				is_show_sub_collection: false
			}
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				is_show_collection: (state) => state.user.is_show_collection,
			}),
		},
		methods: {
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

		image {
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
