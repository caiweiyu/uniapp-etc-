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

		<view class="top">
			<view class="box">实际支付(元)</view>
			<view class="box">{{detail.recharge_money}}</view>
			<view class="box">{{detail.order_status}}</view>
		</view>

		<view class="main max">
			<!-- <view class="box">
				<view class="minbox">圈存类型</view>
				<view class="minbox minblack">{{detail.order_type}}</view>
			</view> -->
			<view class="box">
				<view class="minbox">圈存卡号</view>
				<view class="minbox minblack">
					<text :user-select="true">{{detail.card_num}}</text>
				</view>
			</view>
			<view class="box">
				<view class="minbox">车牌号码</view>
				<view class="minbox minblack">{{detail.plate_num}}</view>
			</view>
		</view>

		<view class="main">
			<view class="box">
				<view class="minbox">充值金额</view>
				<view class="minbox minblack">￥{{Number(detail.load_money).toFixed(2)}}</view>
			</view>
			<view class="box">
				<view class="minbox">优惠抵扣</view>
				<view class="minbox minblack">-￥{{Number(detail.money).toFixed(2)}}</view>
			</view>
			<view class="box">
				<view class="minbox">优惠券抵扣</view>
				<view class="minbox minblack">-￥{{Number(detail.coupon).toFixed(2)}}</view>
			</view>
		</view>

		<view class="main max">
			<view class="box">
				<view class="minbox minblack">实际支付</view>
				<view class="minbox minblack">￥{{Number(detail.recharge_money).toFixed(2)}}</view>
			</view>
		</view>

		<view class="main none-boder">
			<view class="box">
				<view class="minbox">订单编号</view>
				<view class="minbox">
					<text :user-select="true">{{detail.order_id}}</text>
				</view>
			</view>
			<view class="box">
				<view class="minbox">订单来源</view>
				<view class="minbox">{{detail.order_source}}</view>
			</view>
			<view class="box">
				<view class="minbox">下单时间</view>
				<view class="minbox">{{detail.order_time}}</view>
			</view>
			<view class="box">
				<view class="minbox">支付方式</view>
				<view class="minbox">{{detail.trade_platform}}</view>
			</view>
			<view class="box">
				<view class="minbox">支付时间</view>
				<view class="minbox">{{detail.trade_time}}</view>
			</view>
			<view class="box"  v-if="isBlock && detail.order_status_id == 25">
				<view class="minbox"></view>
				<view class="minbox"><tolinkServe :data="detail.order_id" /></view>
			</view>

		</view>

		<view class="btn-group" v-if="isBlock && detail.order_status_id == 0">
			<view class="ant-button" @click="$debounce(toRefund)">申请退款</view>
			<view class="ant-button" @click="$debounce(toBule)">继续写卡</view>
		</view>

		<view class="btn-group" v-if="isBlock && (detail.order_status_id==13 || detail.order_status_id==15 || detail.order_status_id == 19)">
			<view class="ant-button" @click="$debounce(toProcess)">退款进度</view>
		</view>

	</view>
</template>

<script>
	const app = getApp()
	import * as API from "@/interfaces/ytk"
	import conf from '@/config/conf.js'
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
	import tolinkServe from './components/tolink-serve'
	export default {
		computed: {
			...mapState({
				token: (state)=> state.user.token
			})
		},
		components:{
			tolinkServe
		},
		data() {
			return {
				detail: {
					recharge_money: 0,
					order_status: "",
					order_type: "",
					card_num: "",
					plate_num: "",
					load_money: "",
					money: "",
					coupon: "",
					recharge_money: "",
					order_id: "",
					order_source: "",
					order_time: "",
					trade_platform: "",
					trade_time: "",
					order_status_id:""
				},
				order_id: null,
				order_type: null,
				isBlock:false //限制没显示之前不允许出现按钮
			}
		},
		onLoad(options) {
			this.order_id = options.orderId || "";
			this.order_type = options.order_type || 11;
			this.loadOrderDetail(options.orderId);
			eventMonitor("YTK_Orderdetail", 1, {
				order_id: this.order_id
			});
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('getData', (res) => {
				eventChannel.emit('getData',{data:'goback'})
			})
		},
		onShow() {
			this.$token(() => {
				this.order_id = this.$root.$mp.query.orderId || "";
				this.order_type = this.$root.$mp.query.order_type || 11;
				this.loadOrderDetail(this.order_id);
			});//检测page是否授权，token是否过期
			if (this.order_id && this.order_type) {
				this.loadOrderDetail(this.order_id);
			}
		},
		methods: {
			/**
			 * 订单详情
			 */
			async loadOrderDetail(orderId) {
				let res = await API.ytk_pay_order_detail({
					orderType: this.order_type,
					orderId: orderId
				})
				this.detail = res.data;
				if(res.data.order_id){
					console.log('进入')
					this.isBlock = true;
				}
				console.log(res.data,'----res----')
				this.order_type = this.getUrlkey(this.detail.refund_url).order_type;
			},

			/**
			 * 解析url parman
			 */
			getUrlkey(url) {
				let params = {};
				if(url.indexOf("?") != -1) {
					let urls = url.split("?");
					let arr = urls[1].split("&");
					for(let i = 0, l = arr.length; i < l; i++) {
						let a = arr[i].split("=");
						params[a[0]] = a[1];
					}
				}
				return params;
			},

			/**
			 * 申请退款
			 */
			toRefund() {
				eventMonitor("YTKOrderdetail_Bottom_YTK_Refund_373_Button_click", 2, {
					order_id: this.order_id
				})
				uni.navigateTo({
					url: `/packageA/pages/ytk/ytk_list/order_refund?order_id=${this.order_id}&order_type=${this.order_type}`
				})
			},

			/**
			 * 退款进度
			 */
			toProcess() {
				uni.navigateTo({
					url: `/packageA/pages/ytk/ytk_list/order_process?order_id=${this.order_id}&order_type=${this.order_type}`
				})
			},

			/**
			 * 继续写卡
			 */
			toBule() {
				eventMonitor("YTKOrderdetail_Bottom_YTK_Load_373_Button_click", 2, {
					order_id: this.order_id
				})
				uni.redirectTo({
				    url: "/packageA/pages/ytk/ytk_deposit/main?orderid="+this.detail.order_id+"&load_money="+this.detail.load_money+"&trade_id="+this.detail.trade_id+"&summary_order_id="+this.detail.summary_order_id
				});
			}
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
	.content {
		padding: 0 0 150rpx 0;
		.top {
			width: 100%;
			height: 200rpx;
			background-color: #E2E7EB;
			position: relative;
			overflow: hidden;
			.box:nth-child(1) {
				margin: 45rpx 0 0 40rpx;
				font-size: 28rpx;
				color: #666;
			}
			.box:nth-child(2) {
				margin: 15rpx 0 0 40rpx;
				font-size: 60rpx;
				font-weight: 700;
			}
			.box:nth-child(3) {
				position: absolute;
				right: 40rpx;
				bottom: 40rpx;
				font-size: 28rpx;
				color: #FF5C2A;
			}
		}
		.main {
			margin: 50rpx 28rpx 0 28rpx;
			padding: 0 0 40rpx 0;
			border-bottom: 1rpx solid #EBEBEB;
			font-size: 28rpx;
			.box {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				margin: 40rpx 0 0 0;
				.minbox {
					color: #999999;
				}
				.minblack {
					color: #222222;
				}
			}
			.box:first-child {
				margin-top: 0;
			}
		}
		.max {
			font-size: 32rpx;
		}
		.none-boder {
			border: none;
		}
		.btn-group {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 130rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			text-align: center;
			background-color: #FFFFFF;
			.ant-button {
				// margin: 0 0 0 25rpx;
				margin:auto;
				background: none;
				border: 2rpx solid#FF5C2A;
				color: #FF5C2A;
				border-radius: 100rpx;
				width: 330rpx;
				height: 100rpx;
				line-height: 100rpx;
				&.ant-button:nth-child(2) {
					margin: 0 25rpx 0 0;
					background-color: #FF5C2A;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
