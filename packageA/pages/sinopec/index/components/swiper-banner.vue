<template>
	<view class="content">
		<swiper class="swiper"
				:indicator-dots="false" 
				:autoplay="true" 
				:interval="5000" 
				:duration="300"
				@change="bindchange"
		>
			<swiper-item class="swiper-item" v-for="(item,index) in sinoepc_init.ad_banner" :key="index" @click="$debounce(bindNavBanner,item)">
				<image class="img" :src="item.icon" mode="aspectFill"></image>
				<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
			</swiper-item>
		</swiper>
		<view class="dots" v-if="sinoepc_init.ad_banner.length > 1">
			<view :class="['box', current == index ? 'active' : '']" v-for="(item, index) in sinoepc_init.ad_banner" :key="index"></view>
		</view>
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
				sinoepc_init: (state) => state.sinoepc.sinoepc_init
			})
		},
		data() {
			return {
				current: 0,
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * banner跳转
			 */
			bindNavBanner(item) {
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
	.content {
		position: relative;
		.swiper {
			margin: 24rpx 0 0 0;
			width: 100%;
			height: 124rpx;
			border-radius: 20rpx;
			.swiper-item {
				width: 100%;
				height: 100%;
				.img {
					display: block;
					width: 100%;
					height: 100%;
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
