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
			<popup :type="1" v-if="popup_level == 1"></popup>
			
			<!-- 积分弹窗 -->
			<popup :type="2" v-if="popup_level == 3"></popup>
			
			<!-- 我的卡券弹窗 -->
			<popup :type="3"></popup>
			
			<!-- 我的券 -->
			<view class="mine-coupon">
				<image src="https://image.etcchebao.com/etc-min/etc-f/icon_37.png" mode="aspectFit"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	import * as API from "@/interfaces/sinoepc"
	import * as API_BASE from "@/interfaces/base"
	
	import BuyCoupons from "./components/buy-coupons"
	import ScrollCoupons from "./components/scroll-coupons"
	import SwiperBanner from "./components/swiper-banner"
	import Course from "./components/course"
	import Store from "./components/store"
	import OilStation from "./components/oil-station"
	import Popup from "./components/popup"
	export default {
		components: {
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
				sinoepc_init: (state) => state.sinoepc.sinoepc_init,
				openid: (state) => state.user.info.openid,
				city: (state) => state.user.info.city,
				lat: (state) => state.user.latitude,
				lng: (state) => state.user.longitude
			})
		},
		data() {
			return {
				popup_level: 0,//弹窗等级: 卡券活动 > 全局弹窗 > 积分
				curLock: true,//禁止连续下单
			}
		},
		onLoad(options) {
			this.loadInit();
			this.loadPageProps();
		},
		onShow() {
			
		},
		onHide() {
			
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化
			 */
			async loadInit() {
				try {
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
			 * 页面通讯
			 */
			loadPageProps() {
				uni.$on("savePhoneNumber", (e)=> {
					this.savePhoneNumber(e.phone);
				});
				uni.$on("clearPhoneNumber", ()=> {
					this.clearPhoneNumber();
				});
				uni.$on("getPhoneNumber", ()=> {
					this.getPhoneNumber();
				});
				uni.$on("pay", (e)=> {
					this.downOrder(e.item);
				})
			},
			
			/**
			 * 中石化index数据
			 */
			async loadIndex() {
				let res = await API.axios_index({
					source_channel: 2
				})
				this.$store.dispatch("sinoepc/ac_sinoepc_init", res.data);
			},
			
			async loadOilStation(){
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
			 * 下单
			 */
			async downOrder(item) {
				if (!this.curLock) return;  
				let res = await API.axios_coupon_order({
					source_channel: 2,
					third_no: item.third_no,
					coupon_id: item.id,
					target_phone: item.phone_number
				})
				if (res.code == 0 && res.data.hasOwnProperty("trade_id") == true) {
					this.apiRepaid(res.data.trade_id);
				} else {
					uni.showToast({
						title: "订单异常",
						mask: true,
						duration: 1500,
						icon: 'none'
					})
					this.curLock = true;
				}
			},
			
			/**
			 * 获取微信小程序支付参数
			 */
			apiRepaid(trade_id){
			    API_BASE.apiRepaid({
			        trade_platform: 1,
			        trade_mode: 3,
			        trade_id: trade_id,
			        openid: this.openid
			    }).then(res => {
			        let {code, data} = res;
			        if (code == 0) {
			            this.toPay(data)
			        } else {
						this.curLock = true;
					}
			    })
			},
			
			/**
			 * 调起微信支付
			 */
			toPay(data) {
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
							this.curLock = true;
						}
				    });
				} catch (error) {
				    app.log({
						error: error
					})
				}
			}
		}
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
				bottom: 100rpx;
				width: 120rpx;
				height: 122rpx;
			}
		}
	}
</style>