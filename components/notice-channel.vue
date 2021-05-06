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
		<view class="notice-box" :style="styleTop" v-if="pic_url">
			<image :src="pic_url" class="icon-notice" @click="onClose" />
			<view @click="toJumpUrl(jump_url)">{{note}}</view>
		</view>
	</block>
</template>
<script>
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
				default: 'top: 80rpx'
			},
		},
		data() {
			return {
				pic_url: '',//https://image.etcchebao.com/etc-min/notice-bar.png
				jump_url: '',
				note: ''//尊敬的粤通卡用户，ETC车宝&粤通卡欢迎您~
			};
		},
		computed: {
			...mapState({
				is_show_home_notice: (state) => state.user.is_show_home_notice,
			}),
		},
		mounted() {
			let {
				from_type = 0
			} = this.$root.$mp.query;
			this.currentPath = "/" + this.$root.$mp.page.route;
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
					this.pic_url = res.data[0].pic_url;
					this.jump_url = res.data[0].jump_url;
					this.note = res.data[0].note;
				}
			},
			toJumpUrl(url) {
				if (url === this.currentPath) {
					return;
				}
				wx.redirectTo({
					url: url,
				});
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
		top: 80rpx;

		.icon-notice {
			width: 712rpx;
			height: 96rpx;
		}

		>view {
			position: absolute;
			top: 30rpx;
			font-size: 26rpx;
			color: #fff;
			left: 100rpx;
			width: 520rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
