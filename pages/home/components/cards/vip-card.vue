<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="unitoll-card-container">
		
		<!-- ************************** -->
		<!-- curLevel判断会员等级，使用样式区分会员卡类型 -->
		<!-- ************************** -->
		<view :class="['content', curLevel == 2 ? 'level-2' : '', curLevel == 3 ? 'level-3' : '']">
			
			<!-- ************************** -->
			<!-- 未绑定 -->
			<!-- ************************** -->
			<view class="empty-box" v-if="!curCard">
				<view :class="['desc', curLevel == 2 ? 'desc-level-2' : '', curLevel == 3 ? 'desc-level-3' : '']">预计一年为你省3125元</view>
				<view :class="['btn', curLevel == 2 ? 'btn-level-2' : '', curLevel == 3 ? 'btn-level-3' : '']">
					<view class="text">999</view>
					<view class="text">开通</view>
					<view class="text">￥200</view>
				</view>
				<view :class="['btn-setting', curLevel == 2 ? 'btn-setting-level-2' : '', curLevel == 3 ? 'btn-setting-level-3' : '']">设置</view>
			</view>
			
			<!-- ************************** -->
			<!-- 已绑定 -->
			<!-- ************************** -->
			<view class="card-box" v-if="curCard">
				<view class="info-wrap">
					<view :class="['btn-setting', curLevel == 2 ? 'btn-setting-level-2' : '', curLevel == 3 ? 'btn-setting-level-3' : '']">设置</view>
				</view>
				<view class="bill-wrap">
					<view :class="['left-inner', curLevel == 2 ? 'left-inner-level-2' : '', curLevel == 3 ? 'left-inner-level-3' : '']">
						<view class="inner-item">
							<view class="name">累计已省</view>
							<view class="value"><text class="text">10000</text>元</view>
						</view>
						<view class="inner-item">
							<view class="name">金币数量</view>
							<view class="value"><text class="text">2000</text>枚</view>
						</view>
					</view>
					<view :class="['right-inner', curLevel == 2 ? 'right-inner-level-2' : '', curLevel == 3 ? 'right-inner-level-3' : '']">
						<!-- none-class: 黑金卡无需继续升级按钮 -->
						<view :class="['inner-item', curLevel == 3 ? 'none-class' : '']">
							<image class="img"></image>
							<view class="title">
								<text class="text" v-if="curLevel == 1">升级铂钻</text>
								<text class="text" v-if="curLevel == 2">升级黑金</text>
							</view>
						</view>
						<view :class="['inner-item', 'align-self', curLevel == 3 ? 'none-class' : '']">
							<text class="text"></text>
						</view>
						<view class="inner-item">
							<image class="img"></image>
							<view class="title">邀请有礼</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import { mapState } from "vuex"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				memberc: (state) => state.home.memberc,
			}),
		},
		data() {
			return {
				curLevel: 1,//vip等级(1,2,3)
				curCard: true,//是否绑卡
			}
		},
		mounted() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.unitoll-card-container {
		.content {
			// background-image: url($card-vip-1) no-repeat;
			border-radius: 20rpx;
			background-size: 100%;
			width: 694rpx;
			height: 280rpx;
			margin: 0 auto;
			padding: 30rpx 44rpx;
			box-sizing: border-box;
			.card-box {
				.info-wrap {
					position: relative;
					height: 80rpx;
					.btn-setting {
						position: absolute;
						right: 0;
						top: 19rpx;
						width: 100rpx;
						height: 40rpx;
						border: 1rpx solid #9F3300;
						border-radius: 20rpx;
						font-size: 20rpx;
						line-height: 42rpx;
						text-align: center;
						color: #9F3300;
					}
					.btn-setting-level-2 {
						border: 1rpx solid #3F3C5D;
						color: #3F3C5D;
					}
					.btn-setting-level-3 {
						border: 1rpx solid #FFD8A1;
						color: #FFD8A1;
					}
				}
				.bill-wrap {
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-top: 1rpx solid rgba($color: #FFFFFF, $alpha: 0);
					padding-top: 28rpx;
					margin-top: 28rpx;
					.left-inner {
						display: flex;
						align-items: center;
						.inner-item {
							margin-left: 60rpx;
							font-size: 20rpx;
							.name {
								color: rgba($color: #9F3300, $alpha: 0.5);
							}
							.value {
								color: #9F3300;
								margin-top: 8rpx;
								.text {
									font-size: 40rpx;
									font-weight: bold;
								}
							}
						}
						.inner-item:first-child {
							margin-left: 0;
						}
					}
					.left-inner-level-2 {
						.inner-item {
							.name {
								color: rgba($color: #3F3C5D, $alpha: 0.5);
							}
							.value {
								color: #3F3C5D;
							}
						}
					}
					.left-inner-level-3 {
						.inner-item {
							.name {
								color: rgba($color: #FFD8A1, $alpha: 0.5);
							}
							.value {
								color: #FFD8A1;
							}
						}
					}
					.right-inner {
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 180rpx;
						.inner-item {
							text-align: center;
							.img {
								width: 27rpx;
								height: 31rpx;
								background-color: #C8C9CC;
							}
							.title {
								font-size: 20rpx;
								color: #9F3300;
								margin-top: 8rpx;
							}
						}
						.align-self{
							align-self: flex-end;
							height: 37rpx;
							.text{
								display: inline-block;
								height: 23rpx;
								width: 1rpx;
								background-color: rgba($color: #9F3300, $alpha: 0.5);
							}
						}
						.none-class {
							opacity: 0;
						}
					}
					.right-inner-level-2 {
						.align-self{
							.text{
								background-color: rgba($color: #3F3C5D, $alpha: 0.5);
							}
						}
						.title {
							color: #3F3C5D;
						}
					}
					.right-inner-level-3 {
						.align-self{
							.text{
								background-color: rgba($color: #FFD8A1, $alpha: 0.5);
							}
						}
						.title {
							color: #FFD8A1;
						}
					}
				}
			}
			.empty-box {
				position: relative;
				.desc {
					font-size: 24rpx;
					color: rgba($color: #9F3300, $alpha: 0.5);
					padding-top: 70rpx;
				}
				.desc-level-2 {
					color: rgba($color: #3F3C5D, $alpha: 0.5);
				}
				.desc-level-3 {
					color: rgba($color: #FFD8A1, $alpha: 0.5);
				}
				.btn {
					// width: 200rpx;
					display: inline-block;
					padding: 0 20rpx;
					height: 60rpx;
					background: #FFFFFF;
					border-radius: 100rpx;
					margin-top: 48rpx;
					text-align: center;
					.text {
						display: inline-block;
						vertical-align: middle;
					}
					.text:nth-child(1) {
						font-size: 28rpx;
						font-weight: 700;
						margin: 12rpx 0 0 0;
						color: #9F3300;
					}
					.text:nth-child(1)::before {
						content: '￥';
						display: inline-block;
						font-size: 20rpx;
						color: #9F3300;
						font-weight: 700;
					}
					.text:nth-child(2) {
						font-size: 24rpx;
						font-weight: 700;
						margin: 10rpx 0 0 0;
						color: #9F3300;
					}
					.text:nth-child(3) {
						font-size: 16rpx;
						margin: 20rpx 0 0 10rpx;
						color: rgba($color: #9F3300, $alpha: 0.5);
						text-decoration: line-through;
					}
				}
				.btn-level-2 {
					.text:nth-child(1) {
						color: #3F3C5D;
					}
					.text:nth-child(1)::before {
						color: #3F3C5D;
					}
					.text:nth-child(2) {
						color: #3F3C5D;
					}
					.text:nth-child(3) {
						color: rgba($color: #3F3C5D, $alpha: 0.5);
					}
				}
				.btn-level-3 {
					background-color: #FFD8A1;
					.text:nth-child(1) {
						color: #373737;
					}
					.text:nth-child(1)::before {
						color: #373737;
					}
					.text:nth-child(2) {
						color: #373737;
					}
					.text:nth-child(3) {
						color: rgba($color: #373737, $alpha: 0.5);
					}
				}
				.btn-setting {
					position: absolute;
					right: 0;
					top: 19rpx;
					width: 100rpx;
					height: 40rpx;
					border: 1rpx solid #9F3300;
					border-radius: 20rpx;
					font-size: 20rpx;
					line-height: 42rpx;
					text-align: center;
					color: #9F3300;
				}
				.btn-setting-level-2 {
					border: 1rpx solid #3F3C5D;
					color: #3F3C5D;
				}
				.btn-setting-level-3 {
					border: 1rpx solid #FFD8A1;
					color: #FFD8A1;
				}
			}
		}
		.level-2 {
			// background: url($card-vip-2) no-repeat;
			background-size: 100%;
		}
		.level-3 {
			// background: url($card-vip-3) no-repeat;
			background-size: 100%;
		}
	}
</style>
