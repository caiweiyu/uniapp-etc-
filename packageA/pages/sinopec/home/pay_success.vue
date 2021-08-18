<template>
  <view class="box">
        <!--返回-->
        <view class="container" :style="{marginTop:(statusBarHeight)+'rpx'}">
			<view class="nav container-item">
				<image class="imgs" src="https://image.etcchebao.com/etc-min/etc-f/icon_3.png" />
				<view class="boxs">
					<navigator open-type='navigateBack'>
						<view class="minbox1"></view>
					</navigator>
					<view class="minbox2" @click="loadreLaunch"></view>
				</view>
			</view>
            <view class="container-item">支付结果</view>
            <view class="container-item" style="opacity:0;width:158rpx">完成</view>
        </view>
		<!-- 充值完成 -->
		<image class="img" src="https://image.etcchebao.com/etc-min/ytk-qc-file/icon_list_suc.png"></image>
		<text>支付成功</text>
        <view class="box_text">
            恭喜你！中石化加油券充值成功！
		  此订单为您节省<text class="text">{{order.price}}</text>元
        </view>
		<view class="box_bottom">
			<view @click="toHome">返回首页</view>
			<view @click="toOrder(order.order_id)">查看订单</view>
		</view>
  </view>
</template>

<script>
const app = getApp()
export default {
    props:{
         
    },
    data(){
      return {
        order:{
			price:0,
			order_id:""
		},
		statusBarHeight: uni.getSystemInfoSync().statusBarHeight * 2,
        status:true
      }
    },
    methods: {
		loadreLaunch(){
			this.status = false
			uni.switchTab({
				url: `/pages/home/main`
			})
		},
        toHome() {
            this.status = false
            uni.navigateTo({
                url: `/packageA/pages/sinopec/index/main`
            })
        },
        toOrder(order_id) {
            this.status = false
            uni.navigateTo({
				url: `/packageA/pages/sinopec/home/pay_detail?order_id=${order_id}`
			});
        },
    },
    onUnload(){
        if(this.status){
            uni.navigateTo({
                url:`/packageA/pages/sinopec/index/main`
            })
        }
    },
	onShow(){
		this.$store.dispatch("home/ac_share_info",10);//分享配置
    },
    mounted() {
     	let {
			price,
			order_id
		} = this.$root.$mp.query;
		this.order.price = price;
		this.order.order_id = order_id;
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
        .container{
            display: flex;
            justify-content: space-between;
			margin:0 25rpx;
            // position: absolute;
            // top: 86rpx;
            .container-item{
				font-size: 36rpx;
				color: #0D0D0D;
				font-weight: bold;
                display: inline-block;
                vertical-align: middle;
                margin-top: 15rpx;
            }
			.nav {
				position: relative;
				width: 158rpx;
				height: 58rpx;
				.imgs {
					width: 100%;
					height: 100%;
				}
				.boxs {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					.minbox1 {
						width: 80rpx;
						height: 58rpx;
					}
					.minbox2 {
						width: 78rpx;
						height: 58rpx;
					}
				}
			}

        }
		.img {
			padding-top: 160rpx;
			width: 102rpx;
			height: 102rpx;
			display: block;
			margin: auto;
		}

		>text {
			margin: 10rpx 0 124rpx 0;
			text-align: center;
			color: #FF5C2A;
			font-size: 34rpx;
			font-weight: bold;
			display: block;
		}
		.box_text{
			width: 80%;
			text-align: center;
			margin: auto;
			color: #999999;
			font-size: 26rpx;
			.text{
				margin: 0 10rpx;
			}
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
				border: 2rpx solid #FF5C2A;
				background-color: #FF5C2A;
				border-radius: 120rpx;
				height: 100rpx;
				width: 333rpx;
				line-height: 100rpx;
				color: #ffffff;
				font-size: 32rpx;
				margin-right: 28rpx;
			}
		}
	}
</style>