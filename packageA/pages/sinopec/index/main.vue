<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-08-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-08-03 16:23:19
-->
<template>
	<view class="content">
		
		<!-- **************************** -->
		<!-- 背景图 -->
		<!-- **************************** -->
		<view class="bg">
			<image src="https://image.etcchebao.com/etc-min/etc-f/icon_36.png" mode="widthFix"></image>
		</view>
		
		<!-- **************************** -->
		<!-- 中石化加油券兑换 -->
		<!-- **************************** -->
		<view class="sinoepc">
			<!-- 购买油券 -->
			<buy-coupons></buy-coupons>
			
			<!-- 优惠券列表 -->
			<scroll-coupons></scroll-coupons>
			
			<!-- 滑动banner -->
			<swiper-banner></swiper-banner>
			
			<!-- 教程 -->
			<course></course>
			
			<!-- 易捷便利店 -->
			<store></store>
			
			<!-- 附近油站 -->
			<oil-station></oil-station>
			
			<!-- 卡券活动弹窗 -->
			<popup :type="1" ref="coupon" v-if="popup_level == 1"></popup>
			
			<!-- 积分弹窗 -->
			<popup :type="2" ref="coupon" v-if="popup_level == 3"></popup>
			
			<!-- 我的卡券弹窗 -->
			<popup :type="3" ref="coupon"></popup>
			
			<!-- 我的券 -->
			<view class="mine-coupon" @click="$debounce(bindMineCoupon)">
				<image src="https://image.etcchebao.com/etc-min/etc-f/icon_37_1.png" mode="aspectFit"></image>
				<button-getPhoneNumber v-if="!item_coupon_inner.is_need_login || item_coupon_inner.is_need_login == '1'" type="local" :item="item_coupon_inner" />
			</view>
		</view>
		
		<!-- 全局弹窗 -->
		<dialog-window ref="dialog" flag="10" v-show="popup_level == 2"></dialog-window>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	import * as API from "@/interfaces/sinoepc"
	import * as API_BASE from "@/interfaces/base"
	
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	import DialogWindow from "@/components/dialog-window"
	
	import BuyCoupons from "./components/buy-coupons"
	import ScrollCoupons from "./components/scroll-coupons"
	import SwiperBanner from "./components/swiper-banner"
	import Course from "./components/course"
	import Store from "./components/store"
	import OilStation from "./components/oil-station"
	import Popup from "./components/popup"
	export default {
		components: {
			buttonGetPhoneNumber,
			DialogWindow,
			BuyCoupons,
			ScrollCoupons,
			SwiperBanner,
			Course,
			Store,
			OilStation,
			Popup
		},
		computed: {
			...mapState({
				sinoepc_list: (state) => state.sinoepc.sinoepc_list,
				sinoepc_init: (state) => state.sinoepc.sinoepc_init,
				token: (state) => state.user.token,
				openid: (state) => state.user.info.openid,
				city: (state) => state.user.info.city,
				lat: (state) => state.user.latitude,
				lng: (state) => state.user.longitude
			})
		},
		data() {
			return {
				popup_level: 0,//弹窗等级: 1卡券活动 > 2全局弹窗 > 3积分
				dialog_window: 0,//全局弹窗返回值
				timeout: null,//计时器
				item_coupon_inner: {
					is_need_login: 1,
					jump_type: 1,
					jump_url: "/packageA/pages/sinopec/home/coupons",
					appid: "",
					subs_template_id: null
				},//组装我的券入口登录回调item
			}
		},
		onLoad(options) {
			this.loadPageProps();
		},
		onShow() {
			this.loadInit();
			
			this.$token(() => {
				this.loadInit();
			});//检测page是否授权，token是否过期
			this.$store.dispatch("home/ac_share_info",10);//分享配置
			
			uni.$emit("reflashBuyConpons", {});
		},
		onHide() {
			
		},
		onReady() {
			
		},
		onUnload() {
			
		},
		destroyed() {
			// 页面销毁清空监听
			this.loadPagePropsClear();
			// 页面销毁重置数据
			this.$store.dispatch("sinoepc/ac_sinoepc_list", {});
			this.$store.dispatch("sinoepc/ac_sinoepc_init", {});
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化
			 */
			async loadInit() {
				try {
					await this.$refs.dialog.loadPopup();//全局弹窗配置
					await Promise.all([
						this.loadIndex(),
						this.loadOilStation()
					])
				} catch(err) {
					app.log({
						err: err
					})
				}
			},
			
			/**
			 * 创建页面通讯
			 */
			loadPageProps() {
				uni.$on("savePhoneNumber", (e)=> {
					this.savePhoneNumber(e.phone);
				});//保存手机号码到历史记录
				uni.$on("clearPhoneNumber", ()=> {
					this.clearPhoneNumber();
				});//清除历史手机号码
				uni.$on("getPhoneNumber", ()=> {
					this.getPhoneNumber();
				});//获取历史记录手机号码
				uni.$on("getCoupon", (e)=> {
					this.getCoupon(e.id);
				})//获取优惠券
				uni.$on("pay_sinopec", (e)=> {
					this.downOrder(e.item);
				});//下单支付
				uni.$on("loadDialogWindow", (e)=> {
					this.loadDialogWindow(e);
				});//弹窗优先级
				uni.$on('getAllCoupon', (e)=> {
					this.getCoupon(e.id);
				});//活动卡券全部领取
			},
			
			/**
			 * 清空页面通讯
			 */
			loadPagePropsClear() {
				uni.$off("savePhoneNumber");
				uni.$off("clearPhoneNumber");
				uni.$off("getPhoneNumber");
				uni.$off("getCoupon");
				uni.$off("pay_sinopec");
				uni.$off("loadDialogWindow");
				uni.$off("getAllCoupon");
			},
			
			/**
			 * 全局弹窗回调返回等级参数
			 */
			loadDialogWindow(e) {
				this.dialog_window = e.dialog_window;
			},
			
			/**
			 * 中石化弹窗展示优先级
			 */
			loadPopupLevel() {
				this.$nextTick(()=> {
					if (this.sinoepc_init.is_show_coupon_dialog == 1) {//卡券活动
						this.popup_level = 1;
						return;
					}
					if (this.dialog_window == 2) {//全局弹窗
						this.popup_level = 2;
						return;
					}
					if (this.sinoepc_init.credit > 0) {//积分
						this.popup_level = 3;
						clearTimeout(this.timeout);
						this.timeout = setTimeout(()=>{
							uni.$emit("couponPopup", {
								popup_level: 3
							})
						},3000)
						return;
					}
				})
			},
			
			/**
			 * 中石化index数据
			 */
			async loadIndex() {
				let res = await API.axios_index({
					source_channel: 2
				})
				if (this.token) {
					for (let i = 0; i < res.data.coupon.coupon_list.length; i++) {
						res.data.coupon.coupon_list[i].xcx_select = false;
					}
				}
				for (let i = 0; i < res.data.list.length; i++) {
					res.data.list[i].xcx_mj = 0;
				}
				this.$store.dispatch("sinoepc/ac_sinoepc_list", this.$u.deepClone(res.data.list));
				this.$store.dispatch("sinoepc/ac_sinoepc_init", res.data);
				this.loadPopupLevel();
			},
			
			/**
			 * 油站列表
			 */
			async loadOilStation() {
			    let res = await API.axios_station({
			        source_channel: 2,
			        page: 1,
			        pageSize: 10,
			        lng: this.lng,
			        lat: this.lat,
			        city: "",
			        district: ""
			    });
			    let { code, msg, data } = res;
			    if (code == 0) {
			        this.$store.dispatch("sinoepc/ac_oil_station", res.data);
			    }
			},
			
			/**
			 * 保存手动输入手机号
			 */
			async savePhoneNumber(phone) {
				let res = await API.axios_save_phone({
					source_channel: 2,
					phone: phone
				})
			},
			
			/**
			 * 清空手机记录
			 */
			async clearPhoneNumber() {
				let res = await API.axios_clear_phone({
					source_channel: 2
				})
			},
			
			/**
			 * 获取手机记录
			 */
			async getPhoneNumber() {
				let res = await API.axios_get_phone_list({
					source_channel: 2
				})
				this.$store.dispatch("sinoepc/ac_phone_history", res.data.list_phone);
			},
			
			/**
			 * 领取卡券
			 */
			async getCoupon(id) {
				let res = await API.axios_get_coupon({
					source_channel: 2,
					coupon_id: id
				})
				if (res.code == 0) {
					let sinoepc_init = this.sinoepc_init;
					sinoepc_init.new_coupon_list = res.data;
					this.$store.dispatch("sinoepc/ac_sinoepc_init", sinoepc_init);
					this.getCouponList();
				}
			},
			
			/**
			 * 优惠券列表（领取卡券后刷新）
			 */
			async getCouponList() {
				let res = await API.axios_get_etc_coupon({
					source_channel: 2
				})
				if (res.code == 0) {
					let sinoepc_init = this.sinoepc_init;
					sinoepc_init.coupon = res.data;
					this.$store.dispatch("sinoepc/ac_sinoepc_init", sinoepc_init);
				}
			},
			
			/**
			 * 下单
			 */
			async downOrder(item) {
				uni.showLoading({
					title: "提交订单",
					mask: true
				})
				let res = await API.axios_coupon_order({
					source_channel: 2,
					third_no: item.third_no,
					coupon_id: item.coupon_id || 0,
					target_phone: item.phone_number
				})
				if (res.code == 0 && res.data.hasOwnProperty("trade_id") == true) {
					let trade_platform = 1;
					if (Number(res.data.pay_amount) <= 0) {//实际支付0元时
						trade_platform = 6;
					}
					this.apiRepaid(res.data.trade_id, trade_platform, res.data.pay_amount, item);
				} else {
					uni.showToast({
						title: res.msg,
						mask: true,
						duration: 1500,
						icon: 'none'
					})
				}
			},
			
			/**
			 * 获取微信小程序支付参数
			 */
			apiRepaid(trade_id, trade_platform, pay_amount, item){
			    API_BASE.apiRepaid({
			        trade_platform: trade_platform,
			        trade_mode: 3,
			        trade_id: trade_id,
			        openid: this.openid
			    }).then(res => {
			        let {code, data} = res;
					if (data.prepaid_info.hasOwnProperty("trade_status") == true && Number(data.prepaid_info.trade_status) == 3) {
						uni.navigateTo({
							url: `/packageA/pages/sinopec/home/pay_success?price=${(item.recharge_price - pay_amount).toFixed(2)}&order_id=${data.orderid}`
						})
						uni.hideLoading();
						return;
					}
			        if (code == 0) {
			            this.toPay(data, pay_amount, item)
			        } else {
						uni.hideLoading();
					}
			    })
			},
			
			/**
			 * 调起微信支付
			 */
			toPay(data, pay_amount, item) {
				let {
				    timeStamp,
				    signType,
				    nonceStr,
				    paySign,
				    package: wxpackage,
				    sucessUrl,
				    failUrl,
				} = data.prepaid_info;
				try {
				    //发起支付
				    uni.requestPayment({
				        timeStamp,
				        nonceStr,
				        package: wxpackage, //因为package 是javascript 的关键字，所以不能直接写，编译器会报错
				        signType,
				        paySign,
				        success: (res) => {
				            uni.navigateTo({
								url: `/packageA/pages/sinopec/home/pay_success?price=${(item.recharge_price - pay_amount).toFixed(2)}&order_id=${data.orderid}`
				            })
				        },
				        fail: (res) => {
				            uni.showToast({
				                title: "支付失败",
				                icon: "none",
								mask: true,
								duration: 1500
				            });
				        },
						complete: (res) => {
							uni.hideLoading();
						}
				    });
				} catch (error) {
				    app.log({
						error: error
					})
				}
			},
			
			/**
			 * 我的券
			 */
			bindMineCoupon() {
				uni.navigateTo({
					url: "/packageA/pages/sinopec/home/coupons"
				})
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
		background-color: #F2F2F2;
	}
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	.content {
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 100%;
		}
		.sinoepc {
			margin: 0 auto;
			padding: 152rpx 0 24rpx 0;
			width: 700rpx;
			.mine-coupon {
				position: fixed;
				right: 12rpx;
				bottom: 192rpx;
				width: 120rpx;
				height: 122rpx;
			}
		}
	}
</style>