<template>
	<view class="content">
		<!-- 背景图 -->
		<view class="bg">
			<image src="../../../assets/cdn/01.jpg" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import * as API from "@/interfaces/sinoepc"
	export default {
		computed: {
			
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
				app.log({
					res: res
				})
			},
			
			/**
			 * 保存手动输入手机号
			 */
			async savePhoneNumber() {
				let res = await API.axios_save_phone({
					
				})
				app.log({
					res: res
				})
			},
			
			/**
			 * 清空手机记录
			 */
			async clearPhoneNumber() {
				let res = await API.axios_clear_phone({
					
				})
				app.log({
					res: res
				})
			},
			
			/**
			 * 获取手机记录
			 */
			async getPhoneNumber() {
				let res = await API.axios_get_phone_list({
					
				})
				app.log({
					res: res
				})
			},
		}
	}
</script>

<style lang="scss">
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
	}
</style>