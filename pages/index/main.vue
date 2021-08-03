<template>
	<div class="home-page">
		<image :src="backgroundImage" class="img" @load="imageLoad" mode="widthFix" @click="toVip" />
		<!--全局授权-->
		<!-- <button-get-user-info type="global" /> -->
		<button-get-phone-number type="global" :openphone="true" />
		<Coupon :coupon_info="coupon_info" @change="onTake" />
	</div>
</template>

<script>
	import {
		apiCouponData,
		apiSendCoupon
	} from "@/interfaces/index";
	import {
		chewu
	} from "@/common/constant";
	import Coupon from "./components/coupon";
	import buttonGetUserInfo from "@/components/button-getUserInfo";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import {
		mapState
	} from "vuex";
	export default {
		components: {
			Coupon,
			buttonGetPhoneNumber,
			buttonGetUserInfo
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
			}),
		},
		data() {
			return {
				coupon_info: {},
				latitude: "",
				longitude: "",
				activityId: "",
				inviterUserId: "",
				orderSource: "",
				backgroundImage: "",
				is_show_skeleton: true,
			};
		},
		onShow() {
			this.$token(() => {
				this.getCoupons();
				this.toVip();
			});//检测page是否授权，token是否过期
		},
		async mounted() {
			let {
				activityId = 0,
					inviterUserId = 0,
					orderSource = "",
					backgroundImage = "https%3A%2F%2Fimage.etcchebao.com%2Fmember%2Fbig.png", //https%3A%2F%2Fimage.etcchebao.com%2F20201105151649sdQssA.png
			} = this.$root.$mp.query;
			this.activityId = activityId;
			this.inviterUserId = inviterUserId;
			this.orderSource = orderSource;
			this.backgroundImage = decodeURIComponent(backgroundImage);

			if (this.token) {
				if (activityId && inviterUserId) {
					this.getCoupons();
				}
			} else {
				//等待授权后更新接口,订阅接口
				this.$store.subscribe((mutation, state) => {
					if (mutation.type == "user/setToken") {
						this.getCoupons();
						this.toVip();
					}
				});
			}

			uni.getLocation({
				type: "wgs84",
				success: (res) => {
					this.latitude = res.latitude;
					this.longitude = res.longitude;
				},
			});
		},
		methods: {
			imageLoad() {
				this.is_show_skeleton = false;
			},
			toVip() {
				let src = encodeURIComponent(
					`${chewu}/vip/dist/#/index?city=&activityId=${this.activityId}&inviterUserId=${this.inviterUserId}`
				);
				if (this.orderSource) {
					src = encodeURIComponent(
						`${chewu}/vip/dist/#/index?city=&activityId=${this.activityId}&inviterUserId=${this.inviterUserId}&from=${this.orderSource}`
					);
				}
				uni.navigateTo({
					url: `/pages/webview/main?src=${src}`,
				});
			},
			async onTake(entityId) {
				let res = await apiSendCoupon({
					activityId: this.activityId,
					entityId,
				});
				uni.showToast({
					title: "领取成功",
					icon: "success",
				});
				this.getCoupons();
			},
			async getCoupons() {
				let res = await apiCouponData({
					activityId: this.activityId,
					inviterUserId: this.inviterUserId,
				});
				this.coupon_info = res.data || {};
				// if (res.data) {

				// } else {
				//   uni.showToast({
				//     title: "活动已结束",
				//     icon: "none",
				//   });
				// }
			},
			/**
			 * 分享好友/群
			 */
			onShareAppMessage(options) {
				return {
					title: '欢迎您使用粤通卡ETC车宝官方小程序',
					//imageUrl: 'https://image.etcchebao.com/etc-min/share_icon.png',
				}
			},
			/**
			 * 分享朋友圈
			 */
			onShareTimeline(options) {
				return {
					title: '欢迎您使用粤通卡ETC车宝官方小程序',
					//imageUrl: 'https://image.etcchebao.com/etc-min/share_icon.png',
				}
			},
		},
	};
</script>
<style lang="scss">
	.home-page {
		font-size: 26rpx;

		.img {
			display: block;
			width: 100%;
			position: relative;
			z-index: 2;

			// height: inherit;
		}

		._van-skeleton {
			position: absolute;
			top: 0;
			z-index: 8;
			width: 100%;
		}
	}
</style>
