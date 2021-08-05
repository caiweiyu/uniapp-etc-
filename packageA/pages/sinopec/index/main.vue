<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-08-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-08-03 16:23:19
-->
<template>
	<view class="content">
		
		<!-- **************************** -->
		<!-- 背景图 -->
		<!-- **************************** -->
		<view class="bg">
			<image src="@/static/img/icon_36.png" mode="widthFix"></image>
		</view>
		
		<!-- **************************** -->
		<!-- 中石化加油券兑换 -->
		<!-- **************************** -->
		<view class="sinoepc">
			<!-- 购买油券 -->
			<buy-coupons></buy-coupons>
			
			<!-- 优惠券列表 -->
			<scroll-coupons></scroll-coupons>
			
			<!-- 滑动banner -->
			<swiper-banner></swiper-banner>
			
			<!-- 教程 -->
			<course></course>
			
			<!-- 易捷便利店 -->
			<store></store>
			
			<!-- 附近油站 -->
			<oil-station></oil-station>
			
			<!-- 我的券 -->
			<view class="mine-coupon">
				<image src="@/static/img/icon_37.png" mode="aspectFit"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	import * as API from "@/interfaces/sinoepc"
	
	import BuyCoupons from "./components/buy-coupons"
	import ScrollCoupons from "./components/scroll-coupons"
	import SwiperBanner from "./components/swiper-banner"
	import Course from "./components/course"
	import Store from "./components/store"
	import OilStation from "./components/oil-station"
	export default {
		components: {
			BuyCoupons,
			ScrollCoupons,
			SwiperBanner,
			Course,
			Store,
			OilStation
		},
		computed: {
			...mapState({
				sinoepc_init: (state) => state.sinoepc.sinoepc_init
			})
		},
		data() {
			return {
				
			}
		},
		onLoad(options) {
			this.loadInit();
		},
		onShow() {
			
		},
		onHide() {
			
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化
			 */
			async loadInit() {
				try {
					await Promise.all([
						this.loadIndex(),
					])
				} catch(err) {
					app.log({
						err: err
					})
				}
			},
			
			/**
			 * 中石化index数据
			 */
			async loadIndex() {
				let res = await API.axios_index({
					source_channel: 2
				})
				this.$store.commit("sinoepc/mt_sinoepc_init", res.data);
			},
			
			/**
			 * 保存手动输入手机号
			 */
			async savePhoneNumber() {
				let res = await API.axios_save_phone({
					source_channel: 2,
					phone: ""
				})
			},
			
			/**
			 * 清空手机记录
			 */
			async clearPhoneNumber() {
				let res = await API.axios_clear_phone({
					source_channel: 2
				})
			},
			
			/**
			 * 获取手机记录
			 */
			async getPhoneNumber() {
				let res = await API.axios_get_phone_list({
					source_channel: 2
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	.content {
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 100%;
		}
		.sinoepc {
			margin: 0 auto;
			padding: 152rpx 0 20rpx 0;
			width: 700rpx;
			.mine-coupon {
				position: fixed;
				right: 0;
				bottom: 100rpx;
				width: 120rpx;
				height: 122rpx;
			}
		}
	}
</style>