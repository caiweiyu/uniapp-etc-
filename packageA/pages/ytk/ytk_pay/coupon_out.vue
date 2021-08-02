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
		<!-- 卡券 -->
		<!-- ********************************** -->
		<etc-coupon type="coupon-out" @callbackCouponSelect="callbackCouponSelect" :coupon_list="coupon_list"></etc-coupon>
		
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
				coupon_list: []
			}
		},
		onLoad(options) {
			this.loadPouponOut(options.amount);
		},
		onShow() {
			this.$token(() => {
				this.loadPouponOut(this.$root.$mp.query.amount);
			});//检测page是否授权，token是否过期
		},
		methods: {
			/**
			 * 优惠券列表(失效)
			 */
			async loadPouponOut(amount) {
				let res = await API_YTK.ytk_pay_select({
					consumeMoney: amount,
					orderType: 111,
					get_type: 1,
					page: 1,
					page_size: 1,
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
			 * 选择优惠券
			 */
			callbackCouponSelect(e) {
				switch(Number(e.comeFrom)) {
					case 1:
						
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
	}
</style>
