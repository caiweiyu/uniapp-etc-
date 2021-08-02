<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	
	<!-- ************************** -->
	<!-- 轮播banner -->
	<!-- ************************** -->
	<view class="swiper-box" v-if="banner">
		<swiper class="swiper"
				:indicator-dots="indicatorDots"
				:indicator-color="indicatorColor"
				:indicator-active-color="indicatorActiveColor"
				:autoplay="autoplay"
				:interval="interval"
				:duration="duration"
				:circular="circular"
				:previous-margin="previousmargin"
				:next-margin="nextmargin"
				@change="bindchange"
		>
			<swiper-item class="swiper-item" v-for="(item, index) in banner" :key="index" @click="$debounce(bindNavBanner,item)">
				<view hover-class="hover">
					<image class="img" :src="item.img_url" />
				</view>
				<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
			</swiper-item>
		</swiper>
		<view class="dots" v-if="banner.length > 1">
			<view :class="['box', current == index ? 'active' : '']" v-for="(item, index) in banner" :key="index"></view>
		</view>
	</view>
	
</template>
<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				banner: (state) => state.home.banner,
			}),
		},
		data() {
			return {
				indicatorDots: false,
				indicatorColor: "#ffffff",
				indicatorActiveColor: "#FF5C2A",
				autoplay: true,
				interval: 5000,
				duration: 300,
				circular: true,
				current: 0,
				previousmargin:"14rpx",
				nextmargin:"14rpx"
			}
		},
		methods: {
			/**
			 * banner跳转
			 */
			bindNavBanner(item) {
				eventMonitor("SY_Swiper_Whole_Other_391_Banner_click", 2, {
					url: item.jump_url
				});
				if (typeof(item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item.subs_template_id);
					miniapp.subscribe(arr, (res)=>{
						this.callbackBanner(item);
					}, (err)=> {
						this.callbackBanner(item);
					})
				} else {
					// 直接跳转
					this.callbackBanner(item);
				}
			},
			callbackBanner(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(item, (res)=>{
					
				}, (err)=> {
					
				})
			},
			
			/**
			 * 监听swiper
			 */
			bindchange(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
	.hover {
		opacity: 0.8;
	}
	.swiper-box {
		position: relative;
		margin: 28rpx 0 0 0;
		height: 221rpx;
		.swiper {
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%,0);
			width: 100vw;
			height: 221rpx;
			.swiper-item {
				position: relative;
				margin: 0 auto;
				width: 694rpx;
				.img {
					width: 694rpx;
					height: 221rpx;
					border-radius: 10rpx;
					display: block;
					margin: 0 auto;
				}
			}
		}
		.dots {
			margin: 10rpx 0 0 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			position: absolute;
			left: 50%;
			bottom: 12rpx;
			transform: translate(-50%,0);
			.box {
				margin: 0 0 0 8rpx;
				width: 8rpx;
				height: 8rpx;
				background-color: rgba($color: #AAAAAA, $alpha: 0.5);
				border-radius: 100rpx;
				&.box:first-child {
					margin: 0;
				}
				&.active {
					background-color: #FF5C2A !important;
					width: 16rpx !important;
					transition: width ease-in 0.5s; 
				}
			}
		}
	}
</style>
