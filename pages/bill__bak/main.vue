<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-04-06 16:23:19
-->
<template>
	<view class="bill">
		<!-- 用户头像昵称 -->
		<!-- <view class="user-info" @click="toMine">
			<image class="avatar" :src="auth_info.avatar" />
			<view class="username">{{ auth_info.nickname }}</view>
			<button-get-user-info type="local" />
		</view> -->

		<!-- 导航组件 -->
		<!-- <view class="button-navigator">
			<buttonNavigator />
		</view> -->

		<!-- <notice-channel type="2" styleTop="top: 180rpx" /> -->

		<!--运营位-->
		<swiper class="swiper-wrapper-opera" v-if="operaList.length > 0">
			<swiper-item class="swiper-item-opera" v-for="(item, index) in operaList" :key="index">
				<image :src="item.pic_url" @click="toJumpUrl(item)" />
			</swiper-item>
		</swiper>

		<!-- 粤通卡（卡区） -->
		<view class="card-box">
			<swiper class="swiper-wrapper" :current="current_swpier" @change="onSwiperChange">
				<block v-if="loading">
					<swiper-item class="swiper-item" v-for="(item, index) in unitollList" :key="index">
						<unitoll-card :card_name="item.card_name" :card_num="item.card_num" :plate="item.plate" :plate_start="item.plate_start" :plate_end="item.plate_end" :type="item.type" :url="item.url"
						 card_type="confirm" />
					</swiper-item>
					<swiper-item>
						<unitoll-card empty_tip="添加粤通卡" @onAddCard="onAddCard" />
					</swiper-item>
				</block>
			</swiper>

			<view class="dots" v-if="unitollList.length>0">
				<block v-for="(key, index) in unitollList.length+1" :key="index">
					<view class="dot" :class="{ active: index == current_swpier}"></view>
				</block>
			</view>
		</view>

		<view class="bill-content" v-if="show_bill_content">
			<view class="header-box">
				<view class="item-inner">
					<view class="value">&yen; {{ passTotalMoney }}</view>
					<view class="title">本月消费</view>
				</view>
				<view class="item-inner">
					<view class="value">{{ passTotalTimes }}</view>
					<view class="title">通行次数</view>
				</view>
			</view>
			<view class="bill-list-box" v-if="billMonthList.length > 0">
				<view class="bill-list-item" v-for="(item, index) in billMonthList" :key="index">
					<block v-if="item.tradeType==3||item.tradeType==9||item.tradeType==99 ">
						<view class="item-header">
							<view class="item-left">{{item.name}} {{item.province}}</view>
							<!-- 							<view class="item-right">
								<view class="coin-wrap">
									<view class="coin-num">
										<image class="icon-coin" src="https://image.etcchebao.com/etc-min/icon-coin.png" />{{item.integral}}</view>
									<view class="btn-take" v-if="item.status==0" @click="onTakeCoin(item.serialNo)">领取</view>
									<view class="btn-take disabled" v-else>{{item.status==1?'已领取':'已过期'}}</view>
								</view>
							</view> -->
						</view>
						<view class="item-content">
							<view class="toll-wrap">
								<view class="entrance">
									<view class="title">{{ item.enStation }}</view>
									<view class="time">{{ item.enTime }}</view>
								</view>
								<view class="exit">
									<view class="title">{{ item.exitStation }}</view>
									<view class="time">{{ item.exitTime }}</view>
								</view>
							</view>
							<view class="total-money"> &yen; {{item.amount}} </view>
						</view>
					</block>
					<block v-else>
						<view class="item-content">
							<view class="biz-wrap">
								<view class="title">{{item.enStation}}</view>
								<view class="time">{{item.enTime}}</view>
							</view>
							<view class="total-money green-color"> &yen; {{item.amount}} </view>
						</view>
					</block>
				</view>
			</view>
			<!--列表空状态-->
			<view class="bill-empty-box" v-else>
				<image src="https://image.etcchebao.com/etc-min/list-empty1.png" />
				<view class="empty-text">暂无账单信息</view>
			</view>
			<!--列表空状态 end-->
		</view>
		<view v-else>
			<image class="bottom-logo logo-fixed" src="https://image.etcchebao.com/etc-min/icon-logo.png?v=0.01" />
		</view>
		<!--账单指引-->
		<view class="bill-tip-box" v-if="is_show_guide&&delay_show" @click="onCloseGuide">
			<image src="https://image.etcchebao.com/etc-min/dialog-tip.png" />
			<view class="overlay"></view>
		</view>
		<!--账单指引 end-->

		<!--收藏小程序提示-->
		<!-- <collection-guide></collection-guide> -->
		<!--收藏小程序提示 end-->

		<button-get-phone-number type="global" />

		<!--底部栏-->
		<!-- <custom-tabbar /> -->

		<!-- 全局弹窗 -->
		<dialog-window ref="dialog" flag="5"></dialog-window>
	</view>
</template>
<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import * as API from "@/interfaces/ytk";
	import {
		getOperaList
	} from "@/interfaces/base";
	import customTabbar from "@/components/custom-tabbar";
	import unitollCard from "@/components/unitoll-card";
	import buttonGetUserInfo from "@/components/button-getUserInfo";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import buttonNavigator from "@/components/button-navigator";
	import noticeChannel from "@/components/notice-channel";
	import CollectionGuide from "@/components/collection-guide"
	import DialogWindow from "@/components/dialog-window"
	import {
		eventMonitor
	} from "@/common/utils"
	import {
		mapState
	} from "vuex";
	export default {
		components: {
			customTabbar,
			unitollCard,
			buttonGetPhoneNumber,
			buttonGetUserInfo,
			buttonNavigator,
			noticeChannel,
			CollectionGuide,
			DialogWindow
		},
		data() {
			return {
				unitollList: [],
				passTotalTimes: 0,
				passTotalMoney: 0,
				billMonthList: [],
				current_swpier: 0,
				operaList: [],
				show_bill_content: false,
				unsubscribeFn: () => {},
				statusBarHeight: 22,
				delay_show: false,
				loading: false,//等待接口数据回调
			};
		},
		computed: {
			...mapState({
				auth_info: (state) => state.user.auth_info,
				token: (state) => state.user.token,
				is_show_guide: (state) => state.user.is_show_guide,
			}),
		},
		onShow() {
			this.$token(() => {
				this.init();
				this.getOperaList();
			});//检测page是否授权，token是否过期
			this.$store.dispatch("home/ac_share_info",5);//分享配置
			this.$refs.dialog.loadPopup();//全局弹窗配置
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		beforeDestroy() {
			//取消订阅
			this.unsubscribeFn();
		},
		mounted() {
			this.getOperaList();
			eventMonitor("WeChat_ETCBill", 1)
			setTimeout(() => {
				this.delay_show = true
			}, 1000)

			if (this.token) {
				this.init();
				this.getOperaList();
			}

			//等待授权后更新接口,订阅接口
			this.unsubscribeFn = this.$store.subscribe((mutation, state) => {
				if (mutation.type == "user/setToken") {
					if (state.user.token) {
						this.init();
					} else {
						this.unitollList = [];
						this.billMonthList = [];
						this.show_bill_content = false
					}

				}
			});
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 2
		},

		methods: {
			toMine() {
				if (this.auth_info.openid) {
					uni.navigateTo({
						url: "/pages/mine/user"
					})
				}
			},
			init() {
				this.getUserCardList();

			},
			onCloseGuide() {
				this.$store.commit("user/setIsShowBillGuide", false);
			},

			async onTakeCoin(serialNo) {
				let date = new Date();
				let month = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2,"0")}` //获取当前月份
				let res = await API.sendBillCoins({
					month, //	string	Y	年月份（格式：201003）
					source: "2", //int	Y	领取来源：1=app ; 2=小程序
					orderId: serialNo, //string	Y	账单列表的流水号（serialNo）
				})
				if (res.data) {
					uni.showToast({
						title: '领取成功',
						icon: 'none'
					})
					this.getUnitollBill();
				}

			},
			/**
			 * 获取运营位
			 */
			async getOperaList() {
				let res = await getOperaList({
					os: 1,
					location: 2, //1=金币模块，2=账单模块
				});
				if (res && res.data) {
					this.operaList = res.data;
				}

			},
			
			/**
			 * 跳转page || miniProgram
			 */
			toJumpUrl(item) {
				//jump_type   跳转类型0:不跳转1:内部小程序跳转，2:外部小程序跳转，3:h5跳转
				eventMonitor("YTKBill_Banner_YTK_Other_377_Banner_click", 2, {
					url: item.jump_url
				})
				miniapp.miniProgramRouter(item, (res) => {
				
				}, (err) => {
				
				})
			},
			
			/**
			 * 获取账单卡列表
			 */
			async getUserCardList() {
				let res = await API.getUserCardList({
					page: 1,
					page_size: 100,
					type: 2,
				});
				if (res.data.info && res.data.info.length > 0) {
					this.unitollList = res.data.info;
					for (let i = 0; i < this.unitollList.length; i++) {
						this.unitollList[i].plate_start = this.unitollList[i].plate.slice(0,2) || '';
						this.unitollList[i].plate_end = this.unitollList[i].plate.slice(2,7) || '';
					}
					this.getUnitollBill();
					this.show_bill_content = true;
				} else {
					this.$store.commit("user/setIsShowBillGuide", true);
				}
				this.loading = true;
			},
			/**
			 * 获取月账单
			 */
			async getUnitollBill() {
				let index = this.current_swpier;
				let cardNo = this.unitollList[index].card_num;
				let date = new Date(); //+ 1
				let startDate = `${date.getFullYear()}-${(date.getMonth()+1 ).toString().padStart(2,"0")}-01` //获取当前月份
				let res = await API.getUnitollBill({
					cardNo,
					startDate,
					etcos: "3" //1=android；2=ios；3=微信小程序
				});
				if (!res) {
					return;
				}
				let {
					totalMoney = 0, passTotalMoney = 0, passTotalTimes = 0, passDetail = []
				} = res.data;
				this.billMonthList = passDetail;
				//this.totalMoney =totalMoney// parseFloat(passTotalMoney / 100).toFixed("2");
				this.passTotalMoney = parseFloat(passTotalMoney / 100).toFixed("2");
				this.passTotalTimes = passTotalTimes;

			},
			onAddCard() {
				eventMonitor("YTKBill_Bottom_YTK_Other_118_Button_click", 2)
				uni.requestSubscribeMessage({
					tmplIds: ['odwFFrzxNDlJL6o3IntNbaCHRTIV2d47njhU_9PQsyQ'],
					complete: async (res) => {
						// let jump_url = "/packageA/pages/ytk/add_ytk/main";
						// if (this.unitollList.length == 0) {
						// 	let [error, res] = await API.getCardListByUsername({
						// 		token: this.token
						// 	});
						// 	let {
						// 		code,
						// 		data
						// 	} = res.data;
						// 	if (code == 0) {
						// 		if (data.list && data.list.length > 0) {
						// 			jump_url = "/packageA/pages/ytk/ytk_list/main";
						// 		}
						// 	}
						// }
						uni.navigateTo({
							url: "/packageA/pages/ytk/add_ytk/main",
						});
					}
				})

			},
			onSwiperChange(e) {
				this.current_swpier = e.mp.detail.current;
				if (this.unitollList.length <= e.mp.detail.current) {
					this.show_bill_content = false;
					return;
				}
				eventMonitor("YTKBill_Card_YTK_Other_377_Button_click", 2)
				this.getUnitollBill();
				this.show_bill_content = true
			},
		},
		/**
		 * 监听tabBar切换
		 */
		onTabItemTap(item) {
			eventMonitor("WeChat_BottomNaviClick", 2, {
				from_tab: item.text,
				to_tab: ""
			});
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
	};
</script>

<style lang="scss">
	page {
		background-color: #f9f9f9;
	}
	.bill {
		position: relative;
		padding: 20rpx 0 0 0;
		// padding-top: constant(safe-area-inset-top);
		// padding-top: env(safe-area-inset-top);


		/deep/ .card {
			width: 690rpx;
			margin: 0 auto;
		}

		.button-navigator {
			margin: 20rpx 0 0 30rpx;
			min-height: 30rpx;
		}

		.swiper-wrapper-opera {
			width: 690rpx;
			height: 108rpx;
			margin: 20rpx auto;

			.swiper-item-opera {
				image {
					width: 690rpx;
					height: 108rpx;
				}
			}
		}

		.card-box {
			position: relative;
			height: 280rpx;

			/*用来包裹所有的小圆点 */
			.dots {
				display: flex;
				flex-direction: row;
				position: absolute;
				left: calc(50% - 10rpx);
				transform: translateX(-50%);
				bottom: -15rpx;

				/*未选中时的小圆点样式 */
				.dot {
					width: 12rpx;
					height: 6rpx;
					border-radius: 50%;
					background-color: #CCC;
					margin-left: 10rpx;

					/*选中以后的小圆点样式 */
					&.active {
						width: 24rpx;
						height: 6rpx;
						background-color: #48485C;
						border-radius: 50px;
					}
				}
			}

			.swiper-wrapper {
				height: 260rpx;
				margin: 0 auto;

			}
		}



		.bill-content {
			background: #f9f9f9;
			border-radius: 20rpx 20rpx 0 0;
			padding: 30rpx;
			margin-top: 50rpx;
			// height: calc(100vh - 360rpx);
			box-sizing: border-box;

			.header-box {
				display: flex;
				align-items: center;

				.item-inner {
					flex: 1;
					text-align: center;

					.value {
						font-size: 40rpx;
						font-weight: 600;
						font-family: 'etccb-font' !important;
					}

					.title {
						font-size: 24rpx;
						color: #999;
					}
				}
			}

			.bill-list-box {
				padding-top: 15rpx;

				.bill-list-item {
					background: #fff;
					padding: 0 30rpx;
					border-radius: 20rpx 20rpx 0 0;
					margin-top: 20rpx;

					.item-header {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						padding: 20rpx 0;
						justify-content: space-between;
						border-bottom: 1rpx solid #ebebeb;

						.item-left {
							color: #222;
						}

						.item-right {
							display: flex;
							color: #666;
							align-items: center;

							.coin-wrap {
								display: flex;
								align-items: center;

								.coin-num {
									display: flex;
									align-items: center;

									.icon-coin {
										width: 30rpx;
										height: 30rpx;
										margin-right: 5rpx;
									}
								}

								.btn-take {
									background-color: rgb(255, 92, 42);
									width: 110rpx;
									height: 50rpx;
									line-height: 50rpx;
									text-align: center;
									color: #fff;
									border-radius: 100rpx;
									font-size: 26rpx;
									margin-left: 25rpx;

									&.disabled {
										background-color: #cccccc;
									}
								}
							}
						}
					}

					.item-content {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 30rpx 0;
						// margin-top: 20rpx;

						.title {
							font-size: 30rpx;
							color: #222;
							font-weight: bold;
						}

						.time {
							font-size: 24rpx;
							color: #999;
						}

						.toll-wrap {
							.entrance {
								position: relative;
								padding-left: 30rpx;

								&:after {
									content: "";
									position: absolute;
									top: 12rpx;
									left: 0;
									background: #999999;
									width: 15rpx;
									height: 15rpx;
									border-radius: 100%;
								}
							}

							.exit {
								margin-top: 20rpx;
								position: relative;
								padding-left: 30rpx;

								&:after {
									content: "";
									position: absolute;
									top: 12rpx;
									left: 0;
									display: block;
									background: url("https://image.etcchebao.com/etc-min/icon-loc.png") no-repeat;
									background-size: 100%;
									width: 14rpx;
									height: 20rpx;
								}
							}
						}

						.biz-wrap {
							position: relative;
							padding: 20rpx 0 20rpx 30rpx;

							&:after {
								content: "";
								position: absolute;
								top: 32rpx;
								left: 0;
								background: #cccccc;
								width: 15rpx;
								height: 15rpx;
								border-radius: 100%;
							}
						}

						.total-money {
							font-weight: 600;
							color: #FF5C2A;
							font-size: 44rpx;
							font-family: 'etccb-font' !important;
							&.green-color {
								color: #20ae48;
							}
						}
					}
				}
			}
		}

		.logo-fixed {
			position: absolute;
			left: 0;
			right: 0;
			bottom: -50vh;
		}

		.bill-empty-box {
			text-align: center;
			margin-top: 150rpx;

			image {
				width: 300rpx;
				height: 200rpx;
			}

			.empty-text {
				font-size: 26rpx;
				color: #cccccc;
			}
		}

		.bill-tip-box {
			height: 100vh;
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 10002;

			image {
				width: 690rpx;
				height: 633rpx;
				position: absolute;
				z-index: 100;
				left: 0;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				bottom: 0;
				margin: 0 auto;
			}

			.overlay {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 99;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.7);
			}
		}

		.user-info {
			position: relative;
			display: flex;
			align-items: center;
			padding: 12rpx 40rpx;

			.avatar {
				width: 50rpx;
				height: 50rpx;
				background: #cccccc;
				border-radius: 100px;
			}

			.username {
				font-size: 26rpx;
				color: #222;
				margin-left: 20rpx;
			}
		}


	}
</style>
