<template>
	<view class="header-page">
		<scroll-view :refresher-enabled="true" :scroll-y="true"
			:refresher-triggered="triggered" :refresher-threshold="80"
			refresher-background="linear-gradient(to top, #F3FFFB 0%, #F4F4F4 100%)" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" @refresherabort="onAbort"
			:scroll-with-animation="true"
		>
			<view class="home-page">
				<Index ref="index"></Index>
				<Order ref="order"></Order>
				<Serve ref="serve"></Serve>
			</view>
		</scroll-view>
		<!-- 全局弹窗 -->
		<dialog-window ref="dialog" flag="2"></dialog-window>
	</view>
</template>
<script>
	const app = getApp()
	import Index from "./components/index"
	import Order from "./components/order"
	import Serve from "./components/serve"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import DialogWindow from "@/components/dialog-window"
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
	export default {
		data(){
			return {
				triggered:false,
				Isfreshing:false,
				goTop:false
			}
		},
		components: {
			Index,
			Order,
			Serve,
			DialogWindow
		},
		methods:{
			onRefresh() { 
				this.triggered = true;
				let timer = setTimeout(() => {
					this.triggered = false;
					wx.stopPullDownRefresh();
					clearTimeout(timer)
				}, 1500)
			},
			/* 下拉被复位 */
			onRestore() {
				this.$refs.index.init();
				this.$refs.serve.init()
			},
			/**
			 * 触发下拉刷新时执行
			 */
			// onPullDownRefresh() {
			// 	this.$refs.index.init();
			// 	this.$refs.serve.init()
			// 	setTimeout(()=>{
			// 		uni.stopPullDownRefresh();
			// 	},1000)
			// },
			/* 下拉被中止，没下拉完就松手就会触发 */
			onAbort() {
				console.log('无效下拉')
			},
		},
		computed: {
			
		},
		onShow() {
			this.$token(() => {
				this.$refs.index.init();
				this.$refs.serve.init();
			});//检测page是否授权，token是否过期
			this.$store.dispatch("home/ac_share_info",2);//分享配置
			this.$refs.dialog.loadPopup();//全局弹窗配置
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		/**
		 * 监听tabBar切换
		 */
		onTabItemTap(item) {
			eventMonitor("WeChat_BottomNaviClick", 2, {
				from_tab: item.text,
				to_tab: ""
			});
		},
		/**
		 * 分享好友/群
		 */
		onShareAppMessage(res) {
			return app.shareAppMessage();
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(res) {
			return app.shareTimeline();
		},
	}
</script>
<style lang="scss" scoped>
	.header-page{
		overflow-x: hidden;
		width: 100%;
		// font-family: 'etccb-font';
		.home-page{
			width: 100vw;
			height: 100vh;
			background-color: #F4F4F4;
		}
	}
</style> 


