
<template>
	<view class="box">
        <!--返回-->
        <navigator open-type='navigateBack'>
                <image class="back" src="https://image.etcchebao.com/etc-min/etc-f/icon_12.png" />
        </navigator>
		<!-- 充值完成 -->
		<image class="img" src="https://image.etcchebao.com/etc-min/ytk-qc-file/icon_list_suc.png"></image>
		<text>充值完成</text>
		<view class="box_content">
			<text>车牌号码</text>
			<text>{{order.plateNum}}</text>
		</view>
		<view class="box_content">
			<text class="margin-content">粤通卡号</text>
			<text class="margin-content">{{order.cardNum}}</text>
		</view>
		<view class="box_content">
			<text>卡内余额</text>
			<text class="color">{{(Number(order.balance)/100).toFixed(2)=="NaN"?"":(Number(order.balance)/100).toFixed(2)}}</text>
		</view>
		<view class="box_bottom">
			<view @click="toHome">返回首页</view>`
			<view @click="toOrder">查看订单</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import { eventMonitor } from "@/common/utils"
	export default {
		props: {

		},
		data() {
			return {
				order: {
					plateNum: "",
					cardNum: "",
					balance: "1000",
				},
                status:true
			}
		},
		methods: {
			toHome() {
                this.status = false
				eventMonitor("LoadResult_Back_YTK_Other_388_Button_click", 2, {
					order_id: this.order
				})

				uni.switchTab({
					url: `/pages/home/main`
				})
			},
			toOrder() {
                this.status = false
				uni.navigateTo({
					url: `/packageA/pages/order/home/main`
				})

                eventMonitor("LoadResult_Check_YTK_Other_388_Button_click", 2, {
					order_id: this.order
				})
			},
		},
        onUnload(){
            if(this.status){
                uni.navigateTo({
                    url:`/packageA/pages/ytk/ytk_list/main`
                })
            }
        },
		onLoad(options) {
			if (options) {
				this.order = options;
			}
			eventMonitor("YTK_LoadSuccess", 1, {
				order_id: this.order
			})
		},
		mounted() {

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
	.box {
        position: relative;
        .back{
            width: 62rpx;
            height: 62rpx;
            flex-shrink: 0;
            display: flex;
            position: absolute;
            top: 86rpx;
            left: 26rpx;
        }
		.img {
			padding-top: 160rpx;
			width: 102rpx;
			height: 102rpx;
			display: block;
			margin: auto;
		}

		>text {
			margin: 10rpx 0 165rpx 0;
			text-align: center;
			color: #FF5C2A;
			font-size: 34rpx;
			font-weight: bold;
			display: block;
		}

		&_content {
			display: flex;
			justify-content: space-between;

			>text:nth-child(1) {
				color: #999999;
				font-size: 28rpx;
				margin-left: 28rpx;
			}

			>text:nth-child(2) {
				color: #222222;
				font-size: 28rpx;
				font-weight: bold;
				margin-right: 28rpx;
			}

			.margin-content {
				margin: 40rpx 0;
			}

			.color {
				color: #FF5C2A !important;
			}
		}

		&_bottom {
			display: flex;
			justify-content: space-between;
			text-align: center;
			margin-top: 64rpx;

			>view:nth-child(1) {
				border: 2rpx solid #FF5C2A;
				border-radius: 120rpx;
				height: 100rpx;
				width: 333rpx;
				line-height: 100rpx;
				color: #FF5C2A;
				font-size: 32rpx;
				margin-left: 28rpx;
			}

			>view:nth-child(2) {
				border: 2rpx solid #FFFFFF;
				background-color: #FF5C2A;
				border-radius: 120rpx;
				height: 100rpx;
				width: 333rpx;
				line-height: 100rpx;
				color: #FFFFFF;
				font-size: 32rpx;
				margin-right: 28rpx;
			}
		}
	}
</style>
