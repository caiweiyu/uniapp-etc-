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

		<!-- ********************************** -->
		<!-- 不使用卡券 -->
		<!-- ********************************** -->
		<view class="none-coupon" @click="bindCouponNone">
			<view class="text">不使用卡券</view>
			<icon class="icon" type="circle" size="20" v-show="!curCoupon"></icon>
			<icon class="icon" type="success" size="20" v-show="curCoupon"></icon>
		</view>

		<!-- ********************************** -->
		<!-- title -->
		<!-- ********************************** -->
		<view class="title">
			<view class="box">有{{coupon_list.length}}张卡券可用</view>
			<view class="box" @click="$debounce(bindCouponOut)">查看失效优惠券</view>
		</view>

		<!-- ********************************** -->
		<!-- 卡券 -->
		<!-- ********************************** -->
		<etc-coupon type="coupon" @callbackCouponSelect="callbackCouponSelect" :coupon_list="coupon_list"></etc-coupon>

	</view>

</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	import { mapState } from "vuex"
	import * as API_YTK from "@/interfaces/ytk"
	import EtcCoupon from "./components/etc-coupon"
	export default {
		components: {
			EtcCoupon
		},
		computed: {
			...mapState({
				token: (state) => state.home.token,
			})
		},
		data() {
			return {
				curCoupon: false,//是否不使用优惠券
				coupon_list: [],
				options: null
			}
		},
		onLoad(options) {
			this.options = options;
			this.loadPoupon(options.amount);
		},
		onShow() {
			this.$token(() => {
				this.loadPoupon(this.$root.$mp.query.amount);
			});//检测page是否授权，token是否过期
		},
		methods: {
			/**
			 * 优惠券列表
			 */
			async loadPoupon(amount=0) {
				let res = await API_YTK.ytk_pay_select({
					consumeMoney: amount,
					orderType: 111,
					get_type: 2,
					page: 1,
					page_size: 10,
					token: this.token,
					bus_type: "",
					plate_num: "",
					server_id: "",
					business_ids: ""
				})
				if (res.code == 0) {
					let coupon_list = res.data.coupon_list;
					for (let i = 0; i < coupon_list.length; i++) {
						coupon_list[i].status = false;
					}
					this.coupon_list = coupon_list;
				}
			},

			/**
			 * 查看失效优惠券
			 */
			bindCouponOut() {
				uni.navigateTo({
					url: `/packageA/pages/ytk/ytk_pay/coupon_out?amount=${this.options.amount}`
				})
			},

			/**
			 * 是否不使用优惠券
			 */
			bindCouponNone() {
				this.curCoupon = !this.curCoupon;
				if (this.curCoupon) {//不使用优惠券
					let eventChannel = this.getOpenerEventChannel();
					eventChannel.on("toCoupon", function(data) {
						data.coupon_gold = 0;
						data.coupon_id = "";
						eventChannel.emit("toCoupon", data);
					})
					uni.navigateBack({})
				}
			},

			/**
			 * 选择优惠券
			 */
			callbackCouponSelect(e) {
				switch(Number(e.comeFrom)) {
					case 1:
						let eventChannel = this.getOpenerEventChannel();
						eventChannel.on("toCoupon", function(data) {
							data.coupon_gold = e.coupon_gold;
							data.coupon_id = e.coupon_id;
							eventChannel.emit("toCoupon", data);
						})
						uni.navigateBack({})
						break;
					case 2:
						let obj = null;
						let index = e.index;
						this.coupon_list[index].status = !this.coupon_list[index].status;
						obj = this.coupon_list[index];
						this.$set(this.coupon_list, index, obj);
						break;
				}
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
	page {
		background-color: #F9F9F9;
		overflow: hidden;
	}
	.content {
		padding: 108rpx 0 20rpx 0;
		.none-coupon {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
			height: 108rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			.text {
				margin: 0 0 0 28rpx;
				font-size: 32rpx;
			}
			.icon {
				margin: 0 28rpx 0 0;
			}
		}
		.title {
			margin: 0 20rpx;
			padding: 40rpx 0 0 0;
			font-size: 32rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.box:nth-child(1) {
				font-size: 32rpx;
				font-weight: 700;
			}
			.box:nth-child(2) {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}
</style>
