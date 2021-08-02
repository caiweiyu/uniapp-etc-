<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-04 14:41:55
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-04 18:28:36
-->
<template>
	<view class="coin-detail">
		<view class="tabs-box">
			<u-tabs :list="list" :current="active" :is-scroll="false" bar-width="50" bar-height="4" inactive-color="#bebec0" active-color="#FFFFFF" @change="change"></u-tabs>
		</view>
		<scroll-view scroll-y v-show="active == 0" class="tab-content record-tab-content" enhanced @scrolltolower="scrolltolower">
			<view class="record-item" v-for="(item,index) in coinRecordList" :key="index">
				<view class="left">
					<view class="title">{{item.remark}}</view>
					<view class="time">{{item.createTime}}</view>
				</view>
				<view class="right">
					<image src="https://image.etcchebao.com/etc-min/icon-coin.png" />
					<text>{{item.coins>0?`+${item.coins}`:`${item.coins}`}}</text>
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y v-show="active == 1" class="tab-content bill-empty-box">
			<view class="empty-content">
				<image class="img" src="https://image.etcchebao.com/etc-min/list-empty1.png" />
				<view class="empty-text">敬请期待</view>
			</view>
		</scroll-view>
	</view>
</template> 

<script>
	import * as API from "@/interfaces/coin";
	import {
		eventMonitor
	} from "@/common/utils"
	export default {
		data() {
			return {
				list: [{name: "金币明细"}, {name: "我的礼包"}],
				active: 0,
				coinRecordList: [],
				page: 1,
				pageTotal: 0,
				pageSize: 20,
				is_finish: false
			};
		},
		onShow() {
			this.$token(() => {
				this.loadInit();
			});//检测page是否授权，token是否过期
		},
		mounted() {
			this.loadInit();
			eventMonitor("GoldCoin_Details", 1)
		},
		methods: {
			/**
			 * 初始化
			 */
			loadInit() {
				this.getCoinRecord();
			},
			
			async getCoinRecord() {
				let res = await API.queryCoinRecord({
					pageNumber: this.page
				})
				let {
					pageTotal = 0, result = []
				} = res.data;
				this.coinRecordList = this.coinRecordList.concat(result);
				if (pageTotal <= this.page) {
					this.is_finish = true;
				} else {
					this.is_finish = false;
				}
			},
			scrolltolower() {
				if (this.is_finish) {
					return
				}
				this.page++;
				this.getCoinRecord();
			},
			change(index) {
				this.active = index;
			}
		}
	};
</script>

<style lang="scss" scoped>
	view,text {
		box-sizing: border-box;
	}
	.coin-detail {
		.tabs-box {
			background: #2d2d38 !important;
			padding: 20rpx 0 60rpx 0;
		}
		/deep/ .u-tabs {
			background: none !important;
		}
		.tab-content {
			border-radius: 20rpx 20rpx 0 0;
			margin-top: -20rpx;
			padding: 43rpx 30rpx;
			width: 100%;
			height: calc(100vh - 210rpx);
			box-sizing: border-box;
		}
		.bill-empty-box {
			text-align: center;
			margin-top: -20rpx;
			background: #fff;
			.empty-content{
				margin-top: 30%;
				.img {
					width: 300rpx;
					height: 200rpx;
				}
				.empty-text {
					font-size: 26rpx;
					color: #cccccc;
				}
			}
		}
		.record-tab-content {
			background: #fff;
			padding: 0 30rpx;
			.record-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #ebebeb;
				padding: 40rpx 0;
				.left {
					.title {
						font-size: 36rpx;
						font-weight: bold;
						color: #222222;
					}
					.time {
						font-size: 24rpx;
						color: #999999;
					}
				}
				.right {
					display: flex;
					align-items: center;
					image {
						width: 42rpx;
						height: 42rpx;
					}
					text {
						margin-left: 20rpx;
						font-size: 36rpx;
						color: #ff5c2a;
						&.decrease {
							color: #999;
						}
					}
				}
			}
		}
	}
</style>
