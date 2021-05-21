<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 17:16:48
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 20:31:54
-->
<template>
	<view class="costom-tabbar">
		<view class="tabbar-list">
			<view :class="['tabbar-item', { active: currentPath === item.jump_url }]" v-for="(item, index) in tabbarData" :key="index"
			 @click="toJumpUrl(item)">
				<image :src="currentPath === item.jump_url ? item.pic_url2 : item.pic_url1" />
				<view class="title">{{ item.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as API from "@/interfaces/base";
	import {
		eventMonitor
	} from "@/common/utils"
	export default {
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
			toJumpUrl({
				jump_url,
				jump_type,
				appid
			}) {
				eventMonitor("WeChat_BottomNaviClick", 2, {
					from_tab: this.currentPath,
					to_tab: jump_url
				})

				if (jump_url === this.currentPath) {
					return;
				}
				let whiteList = ['/pages/ytk/bill/main', '/pages/coin/home/main']
				if (whiteList.indexOf(jump_url) > -1) {
					wx.redirectTo({
						url: jump_url,
					});
				} else {
					if (jump_type == 1) {
						uni.navigateTo({
							url: jump_url,
						});
					} else if (jump_type == 2) {
						uni.navigateToMiniProgram({
							appId: appid,
							path: jump_url
						})
					} else if (jump_type == 3) {
						if (jump_url.indexOf("?") > -1) {
							jump_url = jump_url + "&token=" + this.token;
						} else {
							jump_url = jump_url + "?token=" + this.token;
						}
						uni.navigateTo({
							url: `/pages/webview/main?src=${encodeURIComponent(jump_url)}`,
						});
					}
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
