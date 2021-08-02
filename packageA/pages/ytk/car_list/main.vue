<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="content">

		<view class="list" v-if="listcar.length > 0">
			<view class="box" v-for="(item,index) in listcar" :key="index">
				<view class="minbox" @click="$debounce(bindNavCarEditor,$event,index)">
					<image class="min" :src="item.icon == '' ? 'https://image.etcchebao.com/etc-min/etc-f/icon_9.png' : item.icon" mode="aspectFit"></image>
					<view class="min">{{item.car_num}}</view>
					<view class="min">{{item.model_name}}</view>
					<view class="min"></view>
				</view>
				<view class="minbox">
					<view class="min">
						<text v-if="item.card_name == '' || item.card_name == undefined">未添加粤通卡</text>
						<text v-else>{{item.card_name}}</text>
					</view>
					<view class="min" v-if="item.card_num != ''">{{formatCardNum(item.card_num)}}</view>
				</view>
				<view class="minbox" v-if="item.is_check == 1">已认证</view>
			</view>
		</view>

		<view class="none" v-if="listcar.length == 0">
			<img class="icon-car" src="https://image.etcchebao.com/etc-min/etc-f/icon_8.png" />
			<view class="text">暂无绑定车辆</view>
		</view>

		<view class="btn">
			<view class="box" @click="$debounce(bindNavCar)">添加车辆</view>
		</view>

	</view>
</template>

<script>
	const app = getApp()
	import * as API from "@/interfaces/car"
	import { mapState } from "vuex"
	import * as utils from "@/common/utils"

	export default {
		computed: {
			...mapState({
				token: (state) => state.user.token,
				share_id: (state) => state.user.info.userid,
				userinfo: (state) => state.user.info,
				auth_info: (state) => state.user.auth_info
			})
		},
		data() {
			return {
				listcar: []
			}
		},
		onLoad(options) {

		},
		onShow() {
			this.$token(() => {
				this.loadInit();
			});//检测page是否授权，token是否过期
			this.loadInit();
		},
		mounted() {

		},
		methods: {
			/**
			 * 初始化
			 */
			loadInit() {
				this.loadListCar();
			},

			/**
			 * 加载车辆列表
			 */
			async loadListCar() {
				let res = await API.axios_car_list({
					token: "this.token"
				})
				this.listcar = res.data.list;
			},

			/**
			 * 编辑选中车辆
			 */
			bindNavCarEditor(e,index) {
				let obj = this.listcar[index];
				uni.navigateTo({
					url: "/packageA/pages/ytk/bind_car/main?car_num=" + obj.car_num + "&card_no=" + obj.card_num + "&car_color=" + obj.car_color + "&car_id=" + obj.id + "&source=" + ""
				})
			},

			/**
			 * 添加车辆
			 */
			bindNavCar() {
				uni.navigateTo({
					url: "/packageA/pages/ytk/bind_car/main"
				})
			},

			formatCardNum(card_num) {
			    return utils.formatCardNum(card_num);
			},
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

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}
	.content {
		padding: 0 0 160rpx 0;
		.list {
			padding: 20rpx;
			.box {
				position: relative;
				margin: 12rpx 0 0 0;
				background-color: #FFFFFF;
				border-radius: 4rpx;
				.minbox:nth-child(1) {
					position: relative;
					padding: 72rpx 60rpx 72rpx 213rpx;
					height: 266rpx;
					.min:nth-child(1) {
						position: absolute;
						left: 30rpx;
						top: 72rpx;
						width: 163rpx;
						height: 122rpx;
						display: block;
					}
					.min:nth-child(2) {
						font-size: 36rpx;
						font-weight: 700;
					}
					.min:nth-child(3) {
						margin: 30rpx 0 0 0;
						font-size: 28rpx;
						color: #999;
					}
					.min:nth-child(4) {
						position: absolute;
						right: 30rpx;
						top: 50%;
						transform: translate(0,-50%) rotate(45deg);
						width: 16rpx;
						height: 16rpx;
						border-top: 1rpx solid #717171;
						border-right: 1rpx solid #717171;
						box-sizing: border-box;
					}
				}
				.minbox:nth-child(2) {
					border-top: 1rpx solid #EBEBEB;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					height: 90rpx;
					line-height: 90rpx;
					padding: 0 30rpx;
					.min:nth-child(1) {
						font-size: 28rpx;
						// font-weight: 700;
					}
					.min:nth-child(2) {
						font-size: 28rpx;
						color: #999999;
						text-align: right;
					}
				}
				.minbox:nth-child(3) {
					position: absolute;
					right: 0;
					top: 25rpx;
					border-radius: 100rpx 0 0 100rpx;
					background-color: #d1a86a;
					padding: 2rpx 10rpx 2rpx 20rpx;
					font-size: 20rpx;
				}
			}
			.box:first-child {
				margin: 0;
			}
		}
		.none {
			.icon-car {
				margin: 60rpx auto 0 auto;
				display: block;
				width: 400rpx;
				height: 300rpx;
			}
			.text {
				margin: 30rpx 0 0 0;
				text-align: center;
				font-size: 28rpx;
				color: #666666;
			}
		}
		.btn {
			position: fixed;
			z-index: 1;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 140rpx;
			background-color: #FFFFFF;
			.box {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				width: 670rpx;
				height: 100rpx;
				border: 2rpx solid #FF5C2A;
				border-radius: 100rpx;
				box-sizing: border-box;
				color: #FF5C2A;
				font-size: 36rpx;
				text-align: center;
				line-height: 100rpx;
			}
		}
	}
</style>
