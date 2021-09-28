<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-03-29 15:45:46
-->
<template>
	<view class="ytk-list">

		<block v-if="loading">
			<!-- ****************************** -->
			<!-- 粤通卡列表为空 -->
			<!-- ****************************** -->
			<view class="list-none" v-if="cardList.length <= 0" @click="onAdd">
				<view class="box">
					<image class="minbox" src="https://image.etcchebao.com/etc-min/etc-f/icon_19.png"></image>
					<view class="minbox">添加粤通卡充值</view>
				</view>
				<image class="logo" src="https://image.etcchebao.com/etc-min/etc-f/icon_20.png" mode="widthFix" />
			</view>

			<!-- ****************************** -->
			<!-- 粤通卡列表 -->
			<!-- ****************************** -->
			<block v-if="cardList.length > 0" >
				<view class="list" v-for="(item, index) in cardList" :key="index" @click="$debounce(toConfirm,item)">
					<!-- type 1=储蓄卡，2=记账卡 -->
					<unitoll-card :card_name="item.card_name" :card_num="item.cardno" :plate="item.plate" :plate_start="item.plate_start" :plate_end="item.plate_end" :type="item.type_card"
					:url="item.url" card_type="confirm" :order_id="item.order_id" :order_num="item.num" :default_card="default_card" />
				</view>
			</block>

			<!-- ****************************** -->
			<!-- tab -->
			<!-- ****************************** -->
			<view class="tab" v-if="!default_card">
				<view class="box" v-for="(item,index) in step_pay.gnav" :key="index" v-text="item.name" @click="$debounce(bindNav,item)"></view>
			</view>

			<!-- ****************************** -->
			<!-- tip -->
			<!-- ****************************** -->
			<view class="tip" v-if="!default_card">
				<view class="title" v-text="step_pay.gstep.title"></view>
				<view class="box" v-for="(item,index) in step_pay.gstep.point" :key="index" v-text="item"></view>
			</view>

			<!-- ****************************** -->
			<!-- 充值记录 -->
			<!-- ****************************** -->
			<view class="record" @click="$debounce(bindRecord)" v-if="!default_card">
				<view class="box">
					<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_17_1.png"></image>
					<view class="text">充值记录</view>
				</view>
			</view>

			<!-- ****************************** -->
			<!-- 粤通卡充值介绍弹窗 -->
			<!-- ****************************** -->
			<etc-recharge v-if="!default_card"></etc-recharge>
		</block>

		<!-- ****************************** -->
		<!-- loadong -->
		<!-- ****************************** -->
		<view v-if="!loading"
			  :style="[
				  {margin: '0 auto'},
				  {padding: '300rpx 0 0 0'},
				  {width: '50rpx'}
			  ]"
		>
			<u-loading mode="circle" size="50" color="#FF5C2A"></u-loading>
		</view>

		<!-- ****************************** -->
		<!-- 添加粤通卡 -->
		<!-- ****************************** -->
		<view class="btn">
			<view class="box" @click="$debounce(onAdd)">
				<image class="minbox" src="https://image.etcchebao.com/etc-min/etc-f/icon_16.png"></image>
				<view class="minbox">添加粤通卡</view>
			</view>
		</view>
		
		<block v-show="!default_card">
			<dialog-window ref="dialog" flag="9"></dialog-window>
		</block>

	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()

	import unitollCard from "@/components/unitoll-card"
	import EtcRecharge from "./components/etc-recharge"
	import DialogWindow from "@/components/dialog-window"
	import * as API from "@/interfaces/ytk"
	import { eventMonitor } from "@/common/utils"
	import { mapState } from "vuex"
	import conf from '@/config/conf.js'
	export default {
		components: {
			unitollCard,
			EtcRecharge,
			DialogWindow
		},
		data() {
			return {
				cardList: [
					// {
					//   license: "粤AWY726",
					//   color: "12001237050177295",
					//   cardno: "2001237050177295",
					//   bank: "",
					//   url: "http:\/\/api-unitoll.etcchebao.com\/img\/yuetongka.png",
					//   base_img_url: "http:\/\/api-unitoll.etcchebao.com\/img\/yuetongka_bj.png",
					//   card_name: "粤通卡 储蓄卡",
					//   color_text: "黄色",
					//   type_card: 0
					// },
					// {
					//   license: "粤AWY726",
					//   color: "12001237050177295",
					//   cardno: "2001237050177295",
					//   bank: "",
					//   url: "http:\/\/api-unitoll.etcchebao.com\/img\/yuetongka.png",
					//   base_img_url: "http:\/\/api-unitoll.etcchebao.com\/img\/yuetongka_bj.png",
					//   card_name: "粤通卡 记账卡",
					//   color_text: "黄色",
					//   type_card: 1
					// }
				],

				loading: false,//加载中...
				step_pay: "",//粤通卡充值引导和配置
				options: "",
				default_card: false
			};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
			}),
		},
		onShow() {
			this.$token(() => {
				this.get_ytk_pay_order_error();
				this.getCardList();
			});//检测page是否授权，token是否过期
			this.$store.dispatch("home/ac_share_info",9);//分享配置
			this.$refs.dialog.loadPopup();//全局弹窗配置
			this.get_ytk_pay_order_error();
			this.getCardList();
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		onLoad(options) {
			this.options = options;
			if (this.options.hasOwnProperty("comeForm") == true) {
				switch(Number(this.options.comeForm)) {
					case 1:
						uni.setNavigationBarTitle({
							title: "选择默认粤通卡"
						})
						this.default_card = true;
						break;
					case 2:
						uni.setNavigationBarTitle({
							title: "选择账单粤通卡"
						});
						this.default_card = true;
						break;
				}
			} else {
				uni.setNavigationBarTitle({
					title: "粤通卡充值"
				})
				eventMonitor("YTK_RechargeCardlist_109",1)
			}
		},
		mounted() {
			// eventMonitor("YTK_BillCardlist_118",1)
			this.getYTKConfig();
		},
		methods: {
			/**
			 * 点击卡片
			 */
			async toConfirm(item) {
				if (this.options.hasOwnProperty("comeForm") == true) {//首页进入，选择切换卡片
					switch(Number(this.options.comeForm)){
						case 1:
							let res = await API.ytk_default({
								os: miniapp.loadModel(),
								cardno: item.cardno
							})
							if (res.data) {
								let eventChannel = this.getOpenerEventChannel();
								eventChannel.on("getData", function(data) {
									data.comeForm = "ytk";
									eventChannel.emit("getData", data);
								})
								uni.navigateBack({});
							} else {
								uni.showToast({
									title: "设置默认粤通卡失败",
									mask: true,
									duration: 1500,
									icon: "none"
								})
							}
							break;
						case 2:
							uni.navigateBack({})
							uni.$emit("chooseCard",item)
							uni.$emit("chooseCardbottom",item)
							this.$store.commit("home/mt_new_bill_all_cardusenum", item.cardno);
							break;
					}

				} else {
					eventMonitor("CardList_Card_YTK_YTKRecharge_109_Card_click", 2);
					let res = await API.isBindCard({
					    version: conf.version,
					    cardNo: item.cardno,
					});
					let {type, phone}=res.data;
					if (type == 1) {
						if (Number(item.type_card) == 2) {//储值卡充值
							uni.navigateTo({
								url: `/packageA/pages/ytk/ytk_pay/main?cardNo=${item.cardno}&plate=${item.plate}`
							})
						} else {//记账卡不充值
							uni.showToast({
								title: "记账卡暂不充值",
								mask: true,
								duration: 1500,
								icon: "none"
							})
						}
					} else {
					    uni.navigateTo({
							url: `/packageA/pages/ytk/bind_ytk/main?card_num=${item.cardno}&color_code=${item.color}&color_text=${item.color_text}&phone=${phone}&plate_number=${item.plate}&type=${type}`,
					    });
					}
				}
			},

			/**
			 * 获取粤通卡列表
			 */
			async getCardList() {
				let res = await API.ytk_list({
					token: this.token,
					type: 2,
					page: 1,
					page_size: 20
				});
				let {
					code,
					data
				} = res;
				if (code == 0) {
					if (data.cardList && data.cardList.length > 0) {
						this.cardList = data.cardList;
						for (let i = 0; i < this.cardList.length; i++) {
							this.cardList[i].type_card = this.cardList[i].card_name.indexOf('储值卡') == -1 ? 1 : 2;
							this.cardList[i].plate_start = this.cardList[i].plate.slice(0,2);
							this.cardList[i].plate_end = this.cardList[i].plate.slice(2,7);
						}
					}
				}
				this.loading = true;
			},

			/**
			 * 粤通卡充值引导文，文案配置接口
			 */
			async getYTKConfig() {
				let res = await API.ytk_pay_list({

				})
				this.step_pay = res.data.step_pay;
			},

			/**
			 * 获取异常订单
			 */
			async get_ytk_pay_order_error(){
				if (this.$root.$mp.query.hasOwnProperty("comeForm") == false) {
					if(Number(this.$root.$mp.query.comeForm) == 1){
						let res = await API.ytk_pay_order_error({});
						let {code,msg,data} = res;
						if(code==0){
							if(data.order_id != ''){
								uni.showModal({
									title:"您有订单异常",
									content:data.message,
									showCancel: true,
									confirmText:'立即处理',
									success:(res=>{
										if(res.confirm) {
											uni.navigateTo({
												url: `/packageA/pages/ytk/ytk_list/order_detail?orderId=${data.order_id}`
											})
										}
									}),
									fail:(res=>{
						
									})
								})
							}
						}
					}
				}
			},

			/**
			 * 添加粤通卡
			 */
			onAdd() {
				if (this.options.hasOwnProperty("comeForm") == false) {
					eventMonitor("CardList_Bottom_YTK_Other_109_Button_click", 2)
				}
				uni.navigateTo({
					url: `/packageA/pages/ytk/add_ytk/main`,
				});
			},

			/**
			 * 充值记录
			 */
			bindRecord() {
				let order_status_id = '011002';
				uni.navigateTo({
					url: `/packageA/pages/order/home/main?order_status_id=${order_status_id}`
				})
			},

			/**
			 * 充值引导配置跳转
			 */
			bindNav(item) {
				if (typeof(item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item.subs_template_id);
					miniapp.subscribe(arr, (res) => {
						this.callbackNav(item);
					}, (err) => {
						this.callbackNav(item);
					})
				} else {
					// 直接跳转
					this.callbackNav(item);
				}
			},
			callbackNav(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(item, (res) => {

				}, (err) => {

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
		background-color: #F6F6F6;
	}
	.ytk-list {
		padding: 30rpx 0 160rpx 0;
		.list {
			margin-bottom: 16rpx;
		}
		.tab {
			margin: 30rpx auto 0 auto;
			width: 690rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			.box {
				margin: 0 20rpx 20rpx 0;
				padding: 0 20rpx;
				color: #FF5C2A;
				border: 1rpx solid #FF5C2A;
				border-radius: 100rpx;
				height: 48rpx;
				line-height: 48rpx;
				font-size: 24rpx;
			}
			.box.first-child {
				margin-left: 0;
			}
		}
		.tip {
			margin: 0 auto;
			width: 690rpx;
			.title {
				color: #666666;
				font-size: 24rpx;
			}
			.box {
				margin: 16rpx 0 0 0;
				color: #666666;
				font-size: 24rpx;
			}
		}
		.record {
			position: fixed;
			z-index: 99;
			right: 30rpx;
			bottom: 192rpx;
			width: 108rpx;
			height: 108rpx;
			.box:nth-child(1) {
				position: relative;
				width: 108rpx;
				height: 108rpx;
				background-color: #FFFFFF;
				border-radius: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-content: center;
				box-shadow: 0 10rpx 20rpx 5rpx rgba($color: #000000, $alpha: 0.1);
				.img {
					margin: 0 auto;
					width: 32rpx;
					height: 32rpx;
				}
				.text {
					padding: 2rpx 0 0 0;
					font-size: 20rpx;
					color: #999999;
					text-align: center;
				}
			}
		}
		.list-none {
			margin: 0 auto;
			width: 690rpx;
			height: 260rpx;
			background-color: #FFFFFF;
			border-radius: 8rpx;
			position: relative;
			.box {
				position: absolute;
				z-index: 1;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				width: 670rpx;
				height: 100rpx;
				color: #28BC93;
				font-size: 36rpx;
				text-align: center;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				.minbox:nth-child(1) {
					margin: 4rpx 16rpx 0 0;
					width: 36rpx;
					height: 36rpx;
				}
				.minbox:nth-child(2) {

				}
			}
			.logo {
				position: absolute;
				right: 10rpx;
				top: 15rpx;
				width: 325rpx;
			}
		}
		.btn {
			position: fixed;
			z-index: 99;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 140rpx;
			background-color: #F6F6F6;
			.box {
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				width: 670rpx;
				height: 100rpx;
				border-radius: 100rpx;
				color: #FFFFFF;
				background-color: #FF5C2A;
				font-size: 34rpx;
				text-align: center;
				line-height: 100rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				.minbox:nth-child(1) {
					margin: 4rpx 16rpx 0 0;
					width: 36rpx;
					height: 36rpx;
				}
				.minbox:nth-child(2) {

				}
			}
		}
	}
</style>
