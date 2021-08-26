<template>
	<view class="content">
		
		<!-- 使用教程 -->
		<view class="course" @click="$debounce(bindCourse)">
			<view class="title">使用教程</view>
			<image class="img" :src="sinoepc_init.use_help" mode="widthFix"></image>
		</view>
		
		<button-getPhoneNumber v-if="!item_course.is_need_login || item_course.is_need_login == '1'" type="local" :item="item_course" />
		
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
				item_course: {
					is_need_login: 1,
					jump_type: 1,
					jump_url: "/packageA/pages/sinopec/home/detail",
					appid: "",
					subs_template_id: null
				},//组装教程入口登录回调item
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 使用教程(去详情页)
			 */
			bindCourse() {
				eventMonitor("ZSHJYQDHSY_Using_JY_JY-ZSHDZQCZ_406_Button_click", 2)
				uni.navigateTo({
					url: "/packageA/pages/sinopec/home/detail"
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
		.course {
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
