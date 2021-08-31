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

		<!-- ***************************** -->
		<!-- 充值进度 -->
		<!-- ***************************** -->
		<view class="my-process">
			<etc-process></etc-process>
		</view>

		<!-- ***************************** -->
		<!-- 选择充值金额 -->
		<!-- ***************************** -->
		<view class="select-gold">
			<view :class="['box', indexGold == index ? 'active' : '']" v-for="(item,index) in listGold" :key="index" @click="$debounce(bindSelect,$event,index)">
				<text>{{item.amount}}</text>
				<image class="icon" src="https://image.etcchebao.com/etc-min/etc-f/icon_21.png" v-if="item.is_icon_reduce == 1"></image>
			</view>
		</view>

		<!-- ***************************** -->
		<!-- 优惠券||折扣 -->
		<!-- ***************************** -->
		<view class="coupons">
			<!-- 立减优惠 -->
			<view class="box" v-if="msgActivity.discount_switch == 'on' && curCutShow">
				<view class="left">
					<view class="minbox-1">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_23.png"></image>
					</view>
					<view class="minbox-2">立减优惠</view>
					<view class="minbox-3" @click="bindActivity">
						<view class="min">{{msgActivity.discount_title}}</view>
					</view>
				</view>
				<view class="right">
					<view class="minbox-1">
						<text class="text-1">-￥{{full_reduction}}</text>
					</view>
					<view class="minbox-2"></view>
				</view>
			</view>
			<!-- 优惠券抵扣 -->
			<view class="box" @click="bindTicket">
				<view class="left">
					<view class="minbox-1">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_22.png"></image>
					</view>
					<view class="minbox-2">优惠券抵扣</view>
					<!-- <view class="minbox-3"></view> -->
				</view>
				<view class="right">
					<view class="minbox-1">
						<text class="text-1" v-if="indexGold >= 0 && coupon_list.length > 0">-￥{{coupon_gold}}</text>
						<text class="text-2" v-else>暂无可用</text>
					</view>
					<view class="minbox-2">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_24.png"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- ***************************** -->
		<!-- 提交订单 -->
		<!-- ***************************** -->
		<view class="submit-order">
			<view class="left">
				<view class="box-1">
					共计<text>{{total_gold}}</text>
				</view>
				<view class="box-2">已优惠￥{{total_discount}}</view>
			</view>
			<view :class="['right', indexGold == -1 ? 'active' : '']" @click="bindOrder">提交订单</view>
		</view>

		<!-- ***************************** -->
		<!-- 活动详情弹窗 -->
		<!-- ***************************** -->
		<block v-if="msgActivity.discount_switch == 'on' && curCutShow">
			<u-popup
				v-model="curActivity"
				mode="bottom"
				height="600rpx"
			>
				<view class="popup-activity">
					<view class="title u-line-1">{{msgActivity.discount_title}}</view>
					<scroll-view scroll-y class="dec">
						<text>{{msgActivity.discount_content}}</text>
					</scroll-view>
					<view class="close" @click="bindActivity">
						<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_25.png"></image>
					</view>
				</view>
			</u-popup>
		</block>

		<!-- ***************************** -->
		<!-- 提交订单确认弹窗 -->
		<!-- ***************************** -->
		<u-popup
			v-model="curOrder"
		    mode="bottom"
			height="600rpx"
		>
			<view class="popup-order">
				<view class="title">请核对充值信息</view>
				<view class="dec">
					<!-- 车牌号码 -->
					<view class="box">
						<view class="left">车牌号码</view>
						<view class="right">
							<text v-if="plate == ''">未绑定</text>
							<text v-else>{{plate}}</text>
						</view>
					</view>
					<!-- 粤通卡号 -->
					<view class="box">
						<view class="left">粤通卡号</view>
						<view class="right">{{formatCardNum}}</view>
					</view>
					<!-- 充值金额 -->
					<view class="box">
						<view class="left">充值金额</view>
						<view class="right">
							<text>￥{{listGold[indexGold].amount}}</text>
						</view>
					</view>
				</view>
				<view class="btn" @click="$debounce(ApiPrepaid)">确认</view>
				<view class="close" @click="bindOrder">
					<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_25.png"></image>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()

	import * as bleProxy from "@/packageA/pages/ytk/ytk_deposit/blue/bleProxy"
	import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util"
	import { mapState } from "vuex"
	import conf from '@/config/conf'
	import * as API from "@/interfaces/base"
	import * as API_YTK from "@/interfaces/ytk"
	import { eventMonitor } from "@/common/utils"
	import EtcProcess from "./components/etc-process"
	export default {
		components: {
			EtcProcess
		},
		computed: {
			...mapState({
			    token: (state) => state.user.token,
			    openid: (state) => state.user.info.openid,
			}),
			formatCardNum() {
				if (this.cardNo) {
					return (this.cardNo + "").replace(/(\d{4})(?=\d)/g, "$1 ");
				}
			}
		},
		data() {
			return {
				cardNo: "",//粤通卡号
				plate: "",//车牌

				indexGold: -1,//选择金额index
				listGold: [
					// { amount: 50, cut: false },
					// { amount: 100, cut: false },
					// { amount: 200, cut: false },
					// { amount: 500, cut: false },
					// { amount: 1000, cut: false },
					// { amount: 1500, cut: false }
				],//选择金额列表
				recharge_id: -1,//选择金额挡位id

				coupon_list: [],//优惠券列表
				coupon_gold: 0,//优惠金额
				coupon_id: "",//卡券id
				full_reduction: 0,//满减

				curActivity: false,//活动详情弹窗show
				msgActivity: {},//活动详情弹窗内容
				
				curOrder: false,//订单确认弹窗

				total_gold: 0,//共实际支付
				total_discount: 0,//总优惠
				
				curLock: true,//禁止多次支付
				curCutShow: false,//是否存在满减优惠
			}
		},
		onLoad(options) {
			this.cardNo = options.cardNo || "";
			this.plate = options.plate || "";
			this.loadGoldList();
			this.loadFullMinusTip();
			this.checkRandomOrder();
			eventMonitor("YTK_Order", 1);
		},
		onShow() {
			this.$token(() => {
				this.cardNo = this.$root.$mp.query.cardNo || "";
				this.plate = this.$root.$mp.query.plate || "";
				this.loadGoldList();
				this.loadFullMinusTip();
				this.checkRandomOrder();
			});//检测page是否授权，token是否过期
		},
		onHide() {

		},
		methods: {
			/**
			 * 充值列表
			 */
			async loadGoldList() {
				let res = await API_YTK.ytk_pay_gold({
					cardNo: this.cardNo
				})
				this.listGold = res.data.list;
				for (let i = 0; i < this.listGold.length; i++) {
					this.listGold[i].amount = (this.listGold[i].amount * 0.01).toFixed(2);
				}
				let num = 0;
				for(let i = 0; i < this.listGold.length; i++) {
					if (Number(this.listGold[i].is_icon_reduce) == 1) {
						num++;
					}
				}
				if (num > 0) {
					this.curCutShow = true;
				}
			},
			
			/**
			 * 满减说明
			 */
			async loadFullMinusTip() {
				let res = await API_YTK.ytk_pay_full_minus_tip({
					
				})
				this.msgActivity = res.data;
			},
			
			/**
			 * 选择金额
			 */
			bindSelect(e,index) {
				this.coupon_gold = 0;
				this.full_reduction = 0;
				this.total_gold = 0;
				this.total_discount = 0;
				this.indexGold = index;
				this.recharge_id = -1;
				if (this.listGold[index].is_icon_reduce == 0) {
					this.recharge_id = this.listGold[index].id;
					this.checkSelect(this.listGold[index].amount);
				} else {
					this.loadFullMinusGet(index);//先算立减
				}
			},
			
			/**
			 * 满减金额获取
			 */
			async loadFullMinusGet(index) {
				if (this.msgActivity.discount_switch != 'on' && this.curCutShow) return;
				let res = await API_YTK.ytk_pay_full_minus_get({
					cardNo: this.cardNo,
					id: this.listGold[index].id
				})
				this.recharge_id = this.listGold[index].id;
				this.full_reduction = res.data.amount ?? 0;
				this.full_reduction = (this.full_reduction * 0.01).toFixed(2);
				this.checkSelect((this.listGold[index].amount - this.full_reduction).toFixed(2));//再算优惠券
			},

			/**
			 * 检测每次选择金额可用卡券
			 */
			async checkSelect(consumeMoney) {
				let res = await API_YTK.ytk_pay_select({
					consumeMoney: consumeMoney,
					orderType: 111,
					get_type: 2,
					page: 1,
					page_size: 1,
					token: this.token
				})
				if (res.code == 0) {
					let coupon_list = res.data.coupon_list;
					if (coupon_list.length > 0) {
						this.coupon_gold = coupon_list[0].discount_quota;
						this.coupon_id = coupon_list[0].coupon_id;
					}
					this.coupon_list = coupon_list;
					this.total_gold = (Number(this.listGold[this.indexGold].amount) - Number(this.coupon_gold) - Number(this.full_reduction)).toFixed(2);
					this.total_discount = (Number(this.coupon_gold) + Number(this.full_reduction)).toFixed(2);
				}
			},

			/**
			 * 优惠券
			 */
			bindTicket() {
				if (this.indexGold < 0 || this.coupon_list.length <= 0) {
					uni.showToast({
						title: "暂无可用卡券",
						mask: true,
						duration: 1500,
						icon: "none"
					})
					return
				}
				uni.navigateTo({
					url: `/packageA/pages/ytk/ytk_pay/coupon?amount=${(this.listGold[this.indexGold].amount - this.full_reduction).toFixed(2)}`,
					events: {
						toCoupon: (data)=> {
							this.coupon_gold = data.coupon_gold;
							this.coupon_id = data.coupon_id;
							this.total_gold = (Number(this.listGold[this.indexGold].amount) - Number(this.coupon_gold) - Number(this.full_reduction)).toFixed(2);
							this.total_discount = (Number(this.coupon_gold) + Number(this.full_reduction)).toFixed(2);
						}
					},
					success: (res)=> {
						res.eventChannel.emit("toCoupon", {
							coupon_gold: 0,
							coupon_id: ""
						})
					}
				})
			},

			/**
			 * 活动详情
			 */
			bindActivity() {
				this.curActivity = !this.curActivity;
			},

			/**
			 * 确认订单
			 */
			bindOrder() {
				if (this.indexGold == -1) {
					uni.showToast({
						title: "请选择充值金额",
						mask: true,
						duration: 1500,
						icon: "none"
					})
					return
				}
				this.curOrder = !this.curOrder;
				eventMonitor("YTKOrder_Bottom_YTK_YTKRecharge_385_Button_click", 2);
			},

			/**
			 * onLoad时检测是否有未支付订单
			 * 有未支付订单未处理，提示处理订单弹窗
			 */
			checkRandomOrder() {
				bleProxy.checkRandomOrder({
				    cardNo: this.cardNo
				}).then(res => {
				    let {code, data} = res;
				    if (code == 0 && data.length > 0) {
						//有未处理订单
						if (String(data[0].trade_id) == "null") return; 
						uni.showModal({
							title: "提示",
							content: `您有订单未支付哦！订单金额：￥${data[0].recharge_money}，已优惠金额：￥${data[0].privilege_amount}`,
							showCancel: true,
							confirmText: "去处理",
							success: (res)=> {
								if (res.confirm) {
									this.apiRepaid(data[0].trade_id)
								}
							}
						})
				    }
				})
			},

			/**
			 * 获取微信小程序支付参数
			 */
			apiRepaid(trade_id, trade_platform=1){
			    API.apiRepaid({
			        trade_platform: trade_platform,
			        trade_mode:3,
			        trade_id:trade_id,
			        openid:this.openid,
			        //token:this.token,
			        //source_channel:2,
			        //sourceChannel:2
			    }).then(res => {
			        let {code, data} = res;
					if (data.prepaid_info.hasOwnProperty("trade_status") == true && Number(data.prepaid_info.trade_status) == 3) {
						uni.redirectTo({
						    url: "/packageA/pages/ytk/ytk_deposit/main?orderid="+data.orderid+"&trade_id="+data.trade_id+"&summary_order_id="+data.summary_order_id
						});
						return;
					}
			        if (code == 0) {
			            this.onTradePay(data)
			        }
			    })
			},

			/**
			 * 调起微信小程序支付
			 * https://user-test.etcchebao.com/hfrecharge/index.html?setShareBtn=2&clientVersion=4.4.1&token=92ce1d85a258812bc2df26f7f3cf288f&platform=app_android&distinct_id=d510fc40b04b0ec9fe3cac3a815b6de5&timestamp=1630309517018
			 */
			onTradePay(data) {
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
			                uni.redirectTo({
			                    url: "/packageA/pages/ytk/ytk_deposit/main?orderid="+data.orderid+"&trade_id="+data.trade_id+"&summary_order_id="+data.summary_order_id
			                });
			            },
			            fail: (res) => {
			                // if (failUrl) {
			                //     uni.redirectTo({
			                //         url: "/pages/test/blue",
			                //     });
			                //     return;
			                // }
			                uni.showToast({
			                    title: "支付失败",
			                    icon: "none"
			                });
			            },
						complete: (res) => {
							this.curLock = true;
							uni.hideLoading()
						}
			        });
			    } catch (error) {
			        console.log(error);
			    }
			},

			/**
			 * 下单接口
			 */
			ApiPrepaid() {
				if (!this.curLock) return;
				this.curLock = false;
				uni.showLoading({
					title: "提交订单",
					mask: true
				})
				eventMonitor("YTKOrder_Popover_YTK_YTKRecharge_385_Button_click", 2)
			    let data = []
			    data["trade_num"] = this.listGold[this.indexGold].amount;// change
			    data["card_no"] = this.cardNo;
			    data["load_type"] = 0;
			    data["order_type"] = "11";
				
			    // data["privilege_amount"] = "0";//优惠后的价格
				data["privilege_amount"] = this.full_reduction;//立减的价格
				
				data["recharge_id"] =  this.recharge_id;//充值金额挡位id

				data["coupon_id"] = this.coupon_id;// change
				
				if (this.coupon_id) data["discount_type"] = 3;

			    // //vip
			    // data["vip_merge_type"] = "1"; // 1：套餐，2：特权
			    // data["vip_merge_id"] = ""; // 套餐ID
			    // data["reduction_id"] = "";// 会员卡规则ID
			    // data["vip_discount"] = ""; // VIP套餐减免金额

			    //data["kcoin"] = "2";//金币抵扣

			    data['token'] = this.token //需要签名必须在这里加上
			    //data['token'] = 'a2afed3a6eef13cea272d8460a9af670';

			    data["isWifi"] = conf.isWifi;
			    data["distinct_id"] = conf.distinct_id;
			    data["appMarketChannel"] = conf.appMarketChannel;
			    data["network_type"] = conf.network_type;
			    data["version"] = conf.version;
			    data["etcos"] = miniapp.loadModel();;
			    data['time'] = Date.parse(new Date());
			    data['sign'] = Util.create_sign(data, "OUVYIBwViFAA6MunV5GMPJ5I4ptCMDqS")
			    let dataobj = {}
			    for(let item in data){
			        dataobj[item] = data[item]
			    }
			    bleProxy.prepaidV3(dataobj).then(res => {
			        let {code, data} = res;
					let trade_platform = 1;
			        if (code == 0) {
			            let trade_id = data.trade_id || ''
			            if(trade_id){
							if (Number(data.trade_amount) <= 0) {//实际支付0元时
								trade_platform = 6;
							}
			                this.apiRepaid(trade_id, trade_platform);
			            }
			        } else {
						this.curLock = true;
						this.loadReflash();
						uni.showToast({
							title: data.msg,
							mask: true,
							duration: 1500,
							icon: "none"
						})
					}
					uni.hideLoading()
			    })
			},
			
			/**
			 * 刷新页面
			 */
			loadReflash() {
				this.coupon_gold = 0;
				this.full_reduction = 0;
				this.total_gold = 0;
				this.total_discount = 0;
				this.indexGold = -1;
				this.recharge_id = -1;
				this.curOrder = false;
				this.loadGoldList();
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
		background-color: #F6F6F6;
	}
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	.content {
		padding: 0 0 148rpx 0;
		.my-process {
			background-color: #FFFFFF;
		}
		.select-gold {
			padding: 32rpx 28rpx 28rpx 28rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: left;
			text-align: center;
			background-color: #FFFFFF;
			.box {
				margin: 20rpx 0 0 20rpx;
				width: 218rpx;
				height: 96rpx;
				line-height: 96rpx;
				border-radius: 14rpx;
				font-size: 40rpx;
				font-weight: 700;
				border: 1rpx solid #F6F6F6;
				box-sizing: border-box;
				background-color: #F6F6F6;
				position: relative;
				.icon {
					position: absolute;
					right: 0;
					top: 0;
					width: 36rpx;
					height: 30rpx;
				}
				&.box:nth-child(1),
				&.box:nth-child(2),
				&.box:nth-child(3) {
					margin-top: 0;
				}
				&.box:nth-child(3n+1) {
					margin-left: 0;
				}
				&.box::before {
					content: "￥";
					display: inline-block;
					font-size: 24rpx;
					font-weight: 700;
				}
				&.active {
					border: 1rpx solid #FF5C2A;
					color: #FF5C2A;
					box-sizing: border-box;
					background-color: rgba($color: #FF5C2A, $alpha: 0.1);
				}
			}
		}
		.coupons {
			margin: 20rpx 0 0 0;
			padding: 0 28rpx;
			background-color: #FFFFFF;
			.box {
				height: 108rpx;
				line-height: 108rpx;
				border-top: 1rpx solid #EBEBEB;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				.left {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					.minbox-1 {
						width: 30rpx;
						height: 30rpx;
					}
					.minbox-2 {
						margin: 0 0 0 16rpx;
						font-size: 32rpx;
					}
					.minbox-3 {
						margin: 0 0 0 16rpx;
						padding: 40rpx 0;
						.min {
							padding: 0 15rpx;
							height: 28rpx;
							line-height: 28rpx;
							border-radius: 100rpx;
							background-color: rgba($color: #FF5C2A, $alpha: 0.1);
							color: #FF5C2A;
							font-size: 20rpx;
						}
					}
				}
				.right {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					.minbox-1 {
						font-size: 32rpx;
						.text-1 {
							color: #FF5C2A;
						}
						.text-2 {
							color: #999999;
						}
					}
					.minbox-2 {
						margin: 0 0 0 16rpx;
						width: 13rpx;
						height: 24rpx;
					}
				}
				&.box:first-child {
					border-top: none;
				}
			}
		}
		.submit-order {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 118rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			.left {
				margin: 0 0 0 28rpx;
				.box-1 {
					font-size: 28rpx;
					>text {
						margin: 0 0 0 8rpx;
						color: #FF5C2A;
						font-size: 44rpx;
						font-weight: 700;
					}
					>text::before {
						content: "￥";
						display: inline-block;
						font-size: 24rpx;
						color: #FF5C2A;
					}
				}
				.box-2 {
					color: #999999;
					font-size: 24rpx;
				}
			}
			.right {
				margin: 0 28rpx 0 0;
				width: 220rpx;
				height: 78rpx;
				text-align: center;
				line-height: 78rpx;
				background-color: #FF5C2A;
				font-size: 32rpx;
				font-weight: 700;
				border-radius: 100rpx;
				color: #FFFFFF;
				&.active {
					background-color: #F7CBBE;
				}
			}
		}
		.popup-activity {
			padding: 32rpx 0 28rpx 0;
			width: 750rpx;
			height: 600rpx;
			background-color: #FFFFFF;
			border-radius: 12rpx 12rpx 0 0;
			position: relative;
			.title {
				margin: 0 80rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 700;
			}
			.dec {
				margin: 40rpx auto 0 auto;
				color: #999999;
				font-size: 28rpx;
				line-height: 70rpx;
				width: 694rpx;
				height: 480rpx;
			}
			.close {
				position: absolute;
				right: 0;
				top: 0;
				width: 90rpx;
				height: 110rpx;
				.img {
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					display: block;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		.popup-order {
			padding: 32rpx 0 28rpx 0;
			width: 750rpx;
			height: 600rpx;
			background-color: #FFFFFF;
			border-radius: 12rpx 12rpx 0 0;
			position: relative;
			.title {
				margin: 0 28rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 700;
			}
			.dec {
				margin: 64rpx 28rpx 0 28rpx;
				.box {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					font-size: 28rpx;
					margin: 40rpx 0 0 0;
					.left {
						color: #999999;
					}
					.right {
						>text {
							color: #FF5C2A;
							font-weight: 700;
						}
					}
					&.box:nth-child(1) {
						margin: 0;
					}
				}
			}
			.btn {
				margin: 140rpx auto 0 auto;
				width: 694rpx;
				height: 100rpx;
				border-radius: 100rpx;
				background-color: #FF5C2A;
				color: #FFFFFF;
				font-size: 34rpx;
				font-weight: 700;
				text-align: center;
				line-height: 100rpx;
			}
			.close {
				position: absolute;
				right: 0;
				top: 0;
				width: 90rpx;
				height: 110rpx;
				.img {
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					display: block;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}
</style>
