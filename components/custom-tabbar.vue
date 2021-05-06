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
			 @click="toJumpUrl(item.jump_url)">
				<image :src="currentPath === item.jump_url ? item.pic_url2 : item.pic_url1" />
				<view class="title">{{ item.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as API from "@/interfaces/base";
	export default {
		data() {
			return {
				tabbarData: [],
				currentPath: "",
			};
		},
		mounted() {
			this.currentPath = "/" + this.$root.$mp.page.route;
			// this.getTabList();
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
				if (res.data.length > 0) {
					this.tabbarData = res.data;
				}

			},
			toJumpUrl(url) {
				if (url === this.currentPath) {
					return;
				}
				let whiteList = ['/pages/ytk/bill/main', '/pages/coin/home/main']
				if (whiteList.indexOf(url) > -1) {
					wx.redirectTo({
						url: url,
					});
				} else {
					wx.navigateTo({
						url: url,
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
		padding-top: 10rpx;

		.tabbar {
			&-list {
				display: flex;
				align-items: center;
				justify-content: space-around;
			}

			&-item {
				flex: 1;
				text-align: center;
				color: #979797;

				>image {
					width: 44rpx;
					height: 44rpx;
				}

				>.title {
					font-size: 18rpx;
				}

				&.active {
					color: #fe9c00;
				}
			}
		}
	}
</style>
