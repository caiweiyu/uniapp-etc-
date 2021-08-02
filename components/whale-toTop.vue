<template>
	<view @click="toTop" hover-class="clsss_hover" class="whale-toTop">
		<!-- <text   class="iconfont">&#xe6a2;</text> -->
		<image class="to_top" v-if="scrollShow" src="../static/to_top.png"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollShow: false // input
			}
		},
		name: 'whaleToTop',
		props: {},
		methods: {
			toTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			show(){
				this.scrollShow = true
			},
			hide(){
				this.scrollShow = false
			}
		},
		mounted() {}
	}
</script>

<style lang="less">
	.whale-toTop {
		position: fixed;
		font-size: 80rpx;
		bottom: 100rpx;
		right: 30rpx;
		z-index: 99999;
		color: #F88F35;
		.to_top{
			width: 90rpx;
			height: 90rpx;
			border-radius: 45rpx;
		}
	}
</style>
