<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-04-22 17:16:48
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-04-22 20:31:54
-->
<template>
	<block v-if="is_show_home_notice">
		<view class="notice-box" :style="styleTop" v-if="info.pic_url">
			<image :src="info.pic_url" class="icon-notice" @click="onClose" />
			<view class="note" @click.stop="toJumpUrl()">{{info.note}}</view>
		</view>
	</block>
</template>
<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import * as API from "@/interfaces/base";
	import {
		mapState
	} from "vuex";
	export default {
		props: {
			type: {
				type: String,
				default: "1",
			},
			styleTop: {
				type: String,
				default: 'top: 0rpx'
			},
		},
		data() {
			return {

				info: {

				}
			};
		},
		computed: {
			...mapState({
				is_show_home_notice: (state) => state.user.is_show_home_notice,
				token: (state) => state.user.token,
			}),
		},
		mounted() {
			let {
				from_type = 0
			} = this.$root.$mp.query;
			this.getChannelList(from_type);

		},
		methods: {
			onClose() {
				this.$store.commit("user/setIsShowHomeNotice", false);
			},
			async getChannelList(from_type) {
				let res = await API.getChannelList({
					os: 1,
					location: this.type,
					fromType: from_type,
				});
				if (res.data.length > 0) {
					this.info = res.data[0];
				}
			},
			
			/**
			 * 跳转page || miniProgram
			 */
			toJumpUrl() {
				miniapp.miniProgramRouter(this.info, (res) => {
				
				}, (err) => {
				
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.notice-box {
		display: block;
		margin: 0 auto;
		position: absolute;
		z-index: 2;
		top: 0;
		left: 50%;
		transform: translateX(-50%);

		.icon-notice {
			width: 712rpx;
			height: 96rpx;
		}

		.note {
			position: absolute;
			top: 30rpx;
			font-size: 26rpx;
			color: #fff;
			left: 100rpx;
			width: 520rpx;
			height: 96rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
