<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 17:16:48
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-03-09 20:31:54
-->
<template>
	<view class="costom-tabbar">
		<view class="tabbar-list">
			<view :class="['tabbar-item', { active: currentPath === item.jump_url }]" v-for="(item, index) in tabbarData" :key="index" @click="toJumpUrl(item)">
				<image :src="currentPath === item.jump_url ? item.pic_url2 : item.pic_url1" />
				<view class="title">{{ item.title }}</view>
				<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" />
			</view>
		</view>
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	import * as API from "@/interfaces/base"
	import { eventMonitor } from "@/common/utils"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				token: (state) => state.user.token
			}),
		},
		data() {
			return {
				tabbarData: [],
				currentPath: "",
			};
		},
		mounted() {
			this.currentPath = "/" + this.$root.$mp.page.route;
			this.getTabList();
			if (this.$store.state.user.token) {
				this.getTabList();
			} else {
				//等待授权后更新接口 添加订阅
				this.$store.subscribe((mutation, state) => {
					if (mutation.type == "user/setToken") {
						this.getTabList();
					}
				});
			}
		},
		methods: {
			async getTabList() {
				let res = await API.getTabList({
					os: 1,
				});
				if (res.data && res.data.length > 0) {
					this.tabbarData = res.data;
				}

			},
			toJumpUrl(item) {
				this.$store.dispatch("home/ac_item", item);
				if (item.is_need_login == '1') return; 
				
				eventMonitor("WeChat_BottomNaviClick", 2, {
					from_tab: this.currentPath,
					to_tab: item.jump_url
				})

				if (item.jump_url === this.currentPath) {
					return;
				}
				let whiteList = ['/pages/bill/main', '/pages/coin/home/main']
				if (whiteList.indexOf(item.jump_url) > -1) {
					wx.redirectTo({
						url: item.jump_url,
					});
				} else {
					miniapp.miniProgramRouter(item, (res) => {
					
					}, (err) => {
					
					})
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.costom-tabbar {
		background: #ffffff;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		border-top: 1rpx solid #f0f2f5;
		padding-top: 2rpx;
		z-index: 999999;
		.tabbar {
			&-list {
				display: flex;
				align-items: center;
				justify-content: space-around;
				font-size: 0;
			}
			&-item {
				position: relative;
				flex: 1;
				text-align: center;
				color: #979797;
				>image {
					width: 55rpx;
					height: 55rpx;
				}

				>.title {
					font-size: 22rpx;
					padding-bottom: 10rpx;
				}

				&.active {
					color: #fe9c00;
				}
			}
		}
	}
</style>
