<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="content">
		<view class="nav">
			<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_3.png" mode=""></image>
			<view class="box">
				<view class="minbox" @click="loadBack"></view>
				<view class="minbox" @click="loadreLaunch"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 返回上一级
			 */
			loadBack() {
				uni.navigateBack({})
			},
			
			/**
			 * 返回首页
			 */
			loadreLaunch() {
				uni.reLaunch({
					url: "/pages/home/main"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}
	.content {
		.nav {
			position: relative;
			width: 158rpx;
			height: 58rpx;
			.img {
				width: 100%;
				height: 100%;
			}
			.box {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				.minbox {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
