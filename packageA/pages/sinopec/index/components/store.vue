<template>
	<view class="content">
		
		<!-- 易捷便利店 -->
		<view class="store" v-if="sinoepc_init.yijie">
			<view class="title">易捷便利店</view>
			<image class="img" :src="sinoepc_init.yijie.icon" mode="widthFix" @click="$debounce(bindNavBanner)"></image>
		</view>
		
		<button-getPhoneNumber v-if="!sinoepc_init.yijie.is_need_login || sinoepc_init.yijie.is_need_login == '1'" type="local" :item="sinoepc_init.yijie" />
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
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
				
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * banner跳转
			 */
			bindNavBanner() {
				let item = this.sinoepc_init.yijie;
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
			}
		}
	}
</script>

<style lang="scss">
	.content {
		color: #222222;
		margin: 24rpx 0 0 0;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		position: relative;
		.store {
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
