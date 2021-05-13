<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-29 15:45:46
-->
<template>
	<view class="ytk-list">
		<view class="tip">为您获取到以下关联粤通卡，请确认</view>
		<view v-for="(item, index) in cardList" :key="index">
			<!-- type 1=储蓄卡，2=记账卡 -->
			<unitoll-card :card_name="item.card_name" :card_num="item.card_no" :plate="item.license" :type="item.card_name.indexOf('储蓄卡')?1:2"
			 :url="item.url" card_type="confirm" />
		</view>

		<view class="btn-fixed">
			<view class="btn-primary plain" @click="onAdd">不是我的，重新添加</view>
		</view>
	</view>
</template>

<script>
	import unitollCard from "@/components/unitoll-card";
	import * as API from "@/interfaces/ytk";
	import {
		mapState
	} from "vuex";
	export default {
		components: {
			unitollCard,
		},
		data() {
			return {
				cardList: [
					// {
					//   license: "粤AWY726",
					//   color: "12001237050177295",
					//   card_no: "2001237050177295",
					//   bank: "",
					//   url: "http:\/\/api-unitoll.etcchebao.com\/img\/yuetongka.png",
					//   base_img_url:
					//     "http:\/\/api-unitoll.etcchebao.com\/img\/yuetongka_bj.png",
					//   card_name: "粤通卡 储蓄卡",
					//   color_text: "黄色",
					// },
				],
			};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
			}),
		},
		mounted() {
			this.getCardListByUsername();
		},
		methods: {
			async getCardListByUsername() {
				let [error, res] = await API.getCardListByUsername({
					token: this.token
				});
				let {
					code,
					data
				} = res.data;
				if (code == 0) {
					if (data.list && data.list.length > 0) {
						this.cardList = data.list;
					}
				}

			},
			onAdd() {
				uni.navigateTo({
					url: "/pages/ytk/add_ytk/main",
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.ytk-list {
		.tip {
			font-size: 26rpx;
			color: #999;
			padding: 40rpx 30rpx;
		}

		/deep/.card {
			width: 690rpx;
			margin: 0 auto;

			.item {
				margin-bottom: 20px;
			}
		}
	}
</style>
