<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="nav-icon">
		
		<!-- ************************** -->
		<!-- 四大金刚 -->
		<!-- ************************** -->
		<view class="nav-block main-icon-block" v-if="nav_four">
			<view class="grid-item" hover-class="hover" v-for="(item, index) in nav_four" :key="index" @click="$debounce(bindNav, item, index)">
				<view class="icon-inner">
					<image class="main-icon" :src="item.i_url" />
					<view class="title">{{item.i_title}}</view>
					<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
				</view>
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 推荐服务 -->
		<!-- ************************** -->
		<view class="nav-block sub-icon-block" v-if="nav_recormmend">
			<view class="grid-item" hover-class="hover" v-for="(item, index) in nav_recormmend" :key="index" @click="bindNav(item, index)">
				<view class="icon-inner">
					<image class="sub-icon" :src="item.i_url" />
					<view class="title">{{item.i_title}}</view>
					<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
				</view>
			</view>
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
				nav_four: (state) => state.home.nav_four,
				nav_recormmend: (state) => state.home.nav_recormmend,
			}),
		},
		data() {
			return {
				
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 跳转
			 */
			bindNav(item) {
				eventMonitor("SY_Icon_Whole_Other_391_Icon_click", 2, {
					icon: item.i_title
				});
				if (typeof(item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item.subs_template_id);
					miniapp.subscribe(arr, (res)=>{
						this.callback(item);
					}, (err)=> {
						this.callback(item);
					})
				} else {
					// 直接跳转
					this.callback(item);
				}
			},
			callback(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(item, (res)=>{
					
				}, (err)=> {
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.hover {
		opacity: 0.8;
	}
	.nav-icon {
		position: relative;
		margin: 36rpx 0 20rpx 0;
		.sub-icon-block {
			margin-top: 28rpx;
		}
		.nav-block {
			display: flex;
			flex-wrap: wrap;

			.grid-item {
				position: relative;
				width: 25%;
				text-align: center;
				margin-top: 28rpx;

				.icon-inner {
					font-size: 0;
					.main-icon {
						margin: 0 auto;
						width: 90rpx;
						height: 90rpx;
						// background-color: #C8C9CC;
					}

					.sub-icon {
						margin: 0 auto;
						width: 72rpx;
						height: 72rpx;
						// background-color: #C8C9CC;
					}

					.title {
						font-size: 24rpx;
						margin-top: 8rpx;
						color: #222;
					}

				}
			}
			.grid-item:nth-child(1),
			.grid-item:nth-child(2),
			.grid-item:nth-child(3),
			.grid-item:nth-child(4) {
				margin-top: 0;
			}
		}


	}
</style>
