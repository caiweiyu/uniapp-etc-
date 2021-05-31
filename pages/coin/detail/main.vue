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
			<van-tabs :active="active" line-width="20" line-height="3">

				<van-tab title="金币明细">
					<scroll-view scroll-y class="tab-content record-tab-content" enhanced @scrolltolower="scrolltolower">
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
				</van-tab>
				<van-tab title="我的礼包">
					<scroll-view scroll-y class="tab-content bill-empty-box">
						<!-- 	<view class="gift-item" v-for="n in 9">
							<view class="left">
								<image src="" alt="" />
							</view>
							<view class="right">
								<view class="title">加油优惠券加油优惠券加油优加油优惠券加油优惠券加油优</view>
								<view class="price">888元额度</view>
								<view class="expire-time">有效期至2222年2月22日</view>
								<image class="icon-tag" src="https://image.etcchebao.com/etc-min/icon-expire.png" />
							</view>
						</view> -->
						<view class="empty-content">
							<image src="https://image.etcchebao.com/etc-min/list-empty1.png" />
							<view class="empty-text">敬请期待</view>
						</view>
<!-- 						<van-empty  class="empty-image" image="https://image.etcchebao.com/etc-min/list-empty1.png" description="敬请期待" />
 -->					</scroll-view>
				</van-tab>
			</van-tabs>
		</view>
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
				active: 0,
				coinRecordList: [],
				page: 1,
				pageTotal: 0,
				pageSize: 20,
				is_finish: false
			};
		},
		mounted() {
			this.getCoinRecord();
			eventMonitor("GoldCoin_Details", 1)
		},
		methods: {
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
			}
		}
	};
</script>

<style lang="scss" scoped>
	.coin-detail {
		.tabs-box {
			background: #2d2d38 !important;
			padding-top: 20rpx;
		}

		/deep/.van-hairline--top-bottom::after {
			border: none !important;
		}

		/deep/ .van-tabs__scroll {
			background: none !important;

			.van-tab {
				color: #bebec0;
			}

			.van-tab--active {
				color: #fff;
			}

			.van-tabs__line {
				background-color: #fff !important;
				border-radius: 20px !important;
			}
		}

		.tab-content {
			border-radius: 20rpx 20rpx 0 0;
			margin-top: 20rpx;
			padding: 43rpx 30rpx;
			height: calc(100vh - 210rpx);
			box-sizing: border-box;
		}

		// .empty-block {
		// 	background: #fff;
		//  /deep/ .van-empty__image__img{
		// 		width: 300rpx;
		// 		height: 200rpx;
		// 	}
		// }
		
		.bill-empty-box {
			text-align: center;
			margin-top: 60rpx;
			background: #fff;
			.empty-content{
				margin-top: 30%;
			}
			image {
				width: 300rpx;
				height: 200rpx;
			}
		
			.empty-text {
				font-size: 26rpx;
				color: #cccccc;
			}
		}

		.gitf-tab-content {
			background: #ebebeb;

			.gift-item {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				position: relative;
				background: #fff;
				border-radius: 10rpx;

				&:not(:first-child) {
					margin-top: 21rpx;
				}

				&.disabel {
					opacity: 0.5;
				}

				.left {
					width: 180rpx;
					height: 180rpx;
					flex-shrink: 0;

					image {
						width: 100%；;
					}
				}

				.right {
					padding-left: 20rpx;
					font-size: 26rpx;
					color: #999;

					.title {
						width: 450rpx;
						font-size: 30rpx;
						color: #222;
						font-weight: bold;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}

					.price {
						padding: 16rpx 0;
					}

					.icon-tag {
						width: 105rpx;
						height: 125rpx;
						position: absolute;
						bottom: 0;
						right: 0;
						opacity: 1;
					}
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
