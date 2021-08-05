<template>
	<view class="content">
		
		<!-- 使用教程 -->
		<view class="course">
			<view class="title">使用教程</view>
			<image class="img" :src="sinoepc_init.use_help" mode="widthFix"></image>
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
		color: #222222;
		margin: 20rpx 0 0 0;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		.course {
			padding: 25rpx 25rpx 28rpx 25rpx;
			.title {
				font-size: 34rpx;
				font-weight: 700;
			}
			.img {
				margin: 28rpx 0 0 0;
				display: block;
				width: 100%;
			}
		}
	}
</style>
