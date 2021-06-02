<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 18:37:57
-->
<template>
	<view class="act">
		<view class="act-box" :style="{paddingTop:statusBarHeight+'px'}">
			<image src="https://image.etcchebao.com/etc-min/coin-bg-new.png" class="bg-image" />
			<image src="https://image.etcchebao.com/etc-min/icon-fish.png" class="icon-fish" />
			<image src="https://image.etcchebao.com/etc-min/icon-bubble-left.png" class="icon-bubble-left" />
			<image src="https://image.etcchebao.com/etc-min/icon-bubble-right-1.png" class="icon-bubble-right-1" />
			<image src="https://image.etcchebao.com/etc-min/icon-bubble-right-2.png" class="icon-bubble-right-2" />
			<canvas id="canvas" type="2d"></canvas>
			<view v-if="show_add_coin" :class="['coin-add-num', { anmation: show_add_coin_anmation }]">
				<image src="https://image.etcchebao.com/etc-min/icon-coin-big-1.png" /> +{{
          currentCoinNum
        }}
			</view>
			<image src="https://image.etcchebao.com/etc-min/icon-bottle.png" class="icon-bottle" />
			<!--显示金币数量-->
			<block v-if="totalCoins > 0">
				<image src="https://image.etcchebao.com/etc-min/coin10.png" v-if="totalCoins <= 10" class="bottle-coin" />

				<image v-else-if="totalCoins > 10 && totalCoins <= 100" src="https://image.etcchebao.com/etc-min/coin100.png" class="bottle-coin" />
				<image v-else-if="totalCoins > 100" src="https://image.etcchebao.com/etc-min/coin100-later.png" class="bottle-coin" />
			</block>
			<view class="act-content">
				<!--金币攻略-->
				<image src="https://image.etcchebao.com/etc-min/icon-gl.png" class="icon-gl" @click="toIntroduct" />
				<view class="user-box">
					<navigator url="/pages/user/mine/main" class="user-info">
						<image class="avatar" :src="auth_info.avatar" />
						<view class="username">{{ auth_info.nickname }}</view>
					</navigator>
					<navigator url="/pages/coin/detail/main" class="coin-total" v-if="token">
						<image class="icon-coin" src="https://image.etcchebao.com/etc-min/icon-coin-big-1.png" />
						<AnimatedNumber :value="totalCoins" />
						<image class="icon-arrow" src="https://image.etcchebao.com/etc-min/icon-arrow.png" />
					</navigator>
					<button-get-user-info type="local" />
				</view>
				<notice-channel type="1" styleTop="top: 80rpx" />
				<view class="coin-box">
					<view class="coin-item" :style="{ 'animation-delay': random['r_' + index] + 's' }" v-for="(item, index) in boxList"
					 :key="index">
						<block v-if="item.status == 0">
							<view :class="['coin-take-num', { active: index == current }]" @click="onTakeCoin(item, index)">
								<image src="https://image.etcchebao.com/etc-min/coin-take-num.png" />
								<view>+{{ item.coins }}</view>
							</view>
							<view class="coin-title">{{ item.title }}</view>
						</block>
						<view v-else-if="item.status == 1" class="disabled" @click="onTakeDisableCoin(item.title,item.coins)">
							<view class="coin-take-num ">
								<image src="https://image.etcchebao.com/etc-min/coin-take-num.png" />
								<view>+{{ item.coins }}</view>
							</view>
							<view class="coin-title">{{ item.title }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="login-tip" v-if="!token">
				<image src="https://image.etcchebao.com/etc-min/icon_finger_1.png" class="icon-finger" />
				<image src="https://image.etcchebao.com/etc-min/icon_login_tip.png" class="icon-login-tip" />
			</view>
		</view>
		<view class="exchange-box">
			<view class="launchApp-box" v-if="scene==1069 || scene==1036">
				<image src="https://image.etcchebao.com/etc-min/launchApp.png" />
				<button open-type="launchApp" class="btn-app" @error="launchAppError">打开app</button>
			</view>

			<!-- <view class="gift-icon-box">
        <image src="https://image.etcchebao.com/etc-min/gift_bg.png" />
        <view>有新礼包到啦，快来瞅瞅 autoplay~</view>
      </view> -->
			<view class="swiper-box">
				<swiper class="swiper" v-if="operaList.length > 0" @change="swiperChange">
					<swiper-item class="swiper-item" v-for="(item, index) in operaList" :key="index">
						<view>
							<image :src="item.pic_url" @click="toJump(item)" />
						</view>
					</swiper-item>
				</swiper>
				<view class="dots">
					<block v-for="(item, index) in operaList" :key="index">
						<view class="dot" :class="{ active: index == currentSwiper}"></view>
					</block>
				</view>
			</view>

			<view class="panel-wrap">
				<view class="panel-header">
					<view class="left"> 金币兑好礼 </view>
					<!-- <view class="right">
            <image />
            <text>恭喜某…获得加油优惠券</text>
          </view> -->
				</view>
				<view class="panel-content">
					<!--<view class="goods-list-block">
					 <view class="goods-grid" v-for="n in 1" @click="toDetail">
						  <view class="goods-list-item">
							<view class="img-box">
							  <image class="goods-img" />
							  <image class="good-tag" />
							</view>
							<view class="info-box">
							  <view class="title">商品最长七个字商品最长七个字</view>
							  <view class="cost-coin">
								<image
								  src="https://image.etcchebao.com/etc-min/icon-coin.png"
								/>
								<text>450</text>
							  </view>
							</view>
						  </view>
						</view>
						<view class="goods-grid">
							<view class="goods-list-item more-item">
								<text>更多好券敬请期待</text>
							</view>
						</view>
					</view>
					 -->
					<view class="prize-empty-box">
						<image src="https://image.etcchebao.com/etc-min/list-empty.png" />
						<view class="empty-text">更多好礼,敬请期待</view>
					</view>
				</view>
			</view>
			<image class="bottom-logo" src="https://image.etcchebao.com/etc-min/icon-logo.png?v=0.01" />
		</view>

		<!--全局授权-->

		<button-get-phone-number type="global" />
		<view class="space-white-60"></view>
		<van-popup :show="show_dialog" custom-style="background: none;zIndex:99999" @close="onDetailClose">
			<view class="prize-content" @click="onDetailClose">
				<image src="https://image.etcchebao.com/etc-min/coin-dialog.png?v=1" class="coin-dialog" />
				<view class="prize-info-box">
					<view class="title">签到成功</view>
					<view class="prize-num">
						<image src="https://image.etcchebao.com/etc-min/icon-coin-big-1.png" /> +{{currentCoinNum}}</view>
				</view>
			</view>
		</van-popup>
		<custom-tabbar />
	</view>
</template>

<script>
	import customTabbar from "@/components/custom-tabbar";
	import lottie from "lottie-miniprogram";
	import AnimatedNumber from "@/components/uni-animated-number/index";
	import * as API from "@/interfaces/coin";
	import {
		store
	} from "@/common/constant"
	import {
		getOperaList,
		getOtherInfo
	} from "@/interfaces/base";
	import buttonGetUserInfo from "@/components/button-getUserInfo";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import noticeChannel from "@/components/notice-channel";
	import {
		finishTaskGetCoin
	} from "@/interfaces/coin";
	import boxList from "./data.json"
	import {
		mapState
	} from "vuex";
	import {
		eventMonitor
	} from "@/common/utils"
	export default {
		data() {
			function getRandom() {
				return (Math.random() * 4).toFixed(2);
			}
			return {
				show_dialog: false,
				random: {
					r_0: getRandom(),
					r_1: getRandom(),
					r_2: getRandom(),
					r_3: getRandom(),
					r_5: getRandom(),
					r_5: getRandom(),
				},
				is_recevice_coin: false,
				current: -1,
				show_add_coin: false,
				show_add_coin_anmation: false,
				totalCoins: 25,
				boxList: [],
				operaList: [],
				currentCoinNum: 0,
				scene: 0,
				unsubscribeFn: () => {},
				statusBarHeight: 22,
				currentSwiper: 0
			};
		},
		components: {
			customTabbar,
			AnimatedNumber,
			buttonGetPhoneNumber,
			buttonGetUserInfo,
			noticeChannel
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				share_id: (state) => state.user.info.userid,
				userinfo: (state) => state.user.info,
				auth_info: (state) => state.user.auth_info
			}),
		},
		beforeDestroy() {
			//取消订阅
			this.unsubscribeFn();
		},
		mounted() {
			eventMonitor("WeChat_GoldCoin", 1)
			this.getOperaList();
			if (this.token) {
				this.init();
			} else {
				this.boxList = boxList
			}
			//等待授权后更新接口,订阅接口
			this.unsubscribeFn = this.$store.subscribe((mutation, state) => {
				if (mutation.type == "user/setToken") {
					if (state.user.token) {
						this.init();
						this.getOperaList();
					} else {
						this.boxList = boxList
						this.totalCoins = 25;
						this.currentCoinNum = 0;
					}

				}
			});

			let {
				scene
			} = uni.getLaunchOptionsSync();
			this.scene = scene;
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 2
			console.log(uni.getSystemInfoSync())
		},
		methods: {
			swiperChange(e) {
				this.currentSwiper = e.detail.current
			},
			async init() {
				//签到
				await this.querySign();
				await this.getOtherInfo();
				//是否首次登陆
				await this.$store.dispatch("user/finishTaskGetCoin", "wechat_first_login")
				//是否是新用户
				if (this.userinfo.is_new == 1) {
					await this.$store.dispatch("user/finishTaskGetCoin", "wechat_regist")
				}


				this.getCoinTask();
			},
			async getOtherInfo() {
				let res = await getOtherInfo();
				let {
					is_subscribe,
					is_bangcard
				} = res.data;
				//是否关注公众号
				if (is_subscribe == 1) {
					await this.$store.dispatch("user/finishTaskGetCoin", "wechat_focus")
				}

				// //是否关绑卡
				if (is_bangcard == 1) {
					await this.$store.dispatch("user/finishTaskGetCoin", "unitoll_bind")
				}

			},
			async putFinishTaskGetCoin(optionKey) {
				try {
					let res = await finishTaskGetCoin({
						userId: this.userinfo.userid,
						from: 1, //0=app;1=小程序;(默认0)
						taskType: 1, //0=交易完成后的任务；1=普通任务,
						optionKey, //任务名称
						token: this.token
					})
				} catch (e) {
					console.log(e)
				}

			},
			launchAppError(e) {
				console.log(e)
			},
			openStore() {
				let src = encodeURIComponent(
					`${store}/#/home?token=${this.token}`
				);
				uni.navigateTo({
					url: `/pages/webview/main?src=${src}`,
				});
			},
			onShareAppMessage(res) {
				return {
					title: "粤通卡车主专享，每天领金币，兑换超值好礼",
					imageUrl: "https://image.etcchebao.com/etc-min/share_icon.png",
					path: '/pages/coin/home/main?from_type=2&share_id' + this.share_id
				}
			},
			onShareTimeline(res) {
				return {
					title: "粤通卡车主专享，每天领金币，兑换超值好礼",
					imageUrl: "https://image.etcchebao.com/etc-min/share_icon.png",
					path: '/pages/coin/home/main?from_type=2&share_id' + this.share_id
				}
			},
			toIntroduct() {
				uni.navigateTo({
					url: "/pages/coin/introduction/main",
				});
			},

			async getCoinTask() {
				let {
					data: {
						boxList = [],
						totalCoins = 0
					},
				} = await API.getCoinTask();
				this.totalCoins = totalCoins;
				this.boxList = boxList.filter((item) => item.status !== 2).splice(0, 5);
			},
			toJump({
				jump_type,
				jump_url,
				appid
			}) {
				eventMonitor("GoldCoin_Banner_GoldCoin_Other_376_Banner_click", 2, {
					url: jump_url
				})
				//jump_type   跳转类型0:不跳转1:内部小程序跳转，2:外部小程序跳转，3:h5跳转
				if (jump_type == 1) {
					uni.navigateTo({
						url: jump_url,
					});
				} else if (jump_type == 2) {
					uni.navigateToMiniProgram({
						appId: appid,
						path: jump_url
					})
				} else if (jump_type == 3) {
					if (jump_url.indexOf("?") > -1) {
						jump_url = jump_url + "&token=" + this.token;
					} else {
						jump_url = jump_url + "?token=" + this.token;
					}
					uni.navigateTo({
						url: `/pages/webview/main?src=${encodeURIComponent(jump_url)}`,
					});
				}

			},
			/**
			 * 获取运营位
			 */
			async getOperaList() {
				let res = await getOperaList({
					os: 1,
					location: 1, //1=金币模块，2=账单模块
				});
				this.operaList = res.data;
			},
			toDetail() {
				this.show_detail = true;
			},
			delay(timeout) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve();
					}, timeout);
				});
			},
			onTakeDisableCoin(title, coins) {
				if (title == '添加粤通卡') {
					uni.showToast({
						title: '请进入账单添加粤通卡，获取金币',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				if (title === '关注ETC车宝公众号') {
					uni.showToast({
						title: '请搜索【ETC车宝】公众号并关注，获取金币',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				eventMonitor("GoldCoin_Collect_GoldCoin_Receive_376_Icon_click", 2, {
					coins: coins,
					task: title
				})
			},
			async onTakeCoin(item, index) {
				let res = await API.getCoin({
					relateId: item.relateId,
				});
				if (res.code != 0) {
					return;
				}
				this.current = index;
				this.currentCoinNum = item.coins;
				this.anmationCoin(index)
				eventMonitor("GoldCoin_Collect_GoldCoin_Receive_376_Icon_click", 2, {
					coins: item.coins,
					task: item.title
				})


			},
			async querySign() {
				let [error, res] = await API.querySign({
					token: this.token,
					city: this.auth_info.city,
					channel: 2,
					token: this.token
				})

				let json = res.data.data;

				if (json.sign && json.coins != 0) {
					this.currentCoinNum = json.coins;
					this.show_dialog = true;
				}
			},
			onDetailClose() {
				this.show_dialog = false;
				//this.anmationCoin();
			},

			anmationCoin(index) {
				setTimeout(() => {
					if (index) {
						this.boxList.splice(index, 1);
						this.current = -1;
					}
					wx.createSelectorQuery()
						.select("#canvas")
						.node(async (res) => {
							const canvas = res.node;
							const context = canvas.getContext("2d");
							canvas.width = 400 * 2;
							canvas.height = 760 * 2;
							lottie.setup(canvas); //要执行动画，必须调用setup,传入canvas对象
							lottie.loadAnimation({
								//微信小程序给的接口，调用就完事了，原理不太懂
								loop: false, //是否循环播放（选填）
								autoplay: true, //是否自动播放（选填）
								path: "https://image.etcchebao.com/etc-min/coin.json", //lottie json包的网络链接，可以防止小程序的体积过大，要注意请求域名要添加到小程序的合法域名中
								rendererSettings: {
									context, //es6语法：等同于context:context（必填）
								},
							});
							await this.delay(1500);
							this.show_add_coin = true;
							await this.delay(100);
							this.show_add_coin_anmation = true;
							await this.delay(1700);
							this.show_add_coin = false;
							this.show_add_coin_anmation = false;
							this.totalCoins = this.totalCoins + this.currentCoinNum;
						})
						.exec();
				}, 500);
			}
		},
	};
</script>

<style lang="scss" scoped>
	@keyframes fingerAnimate {
		0% {
			transform: translate3d(0, 0, 0);
		}

		10% {
			transform: translate3d(-25px, -25px, 0);
		}

		20% {
			transform: translate3d(0, 0, 0);
		}

		30% {
			transform: translate3d(-25px, -25px, 0);
		}

		40% {
			transform: translate3d(0, 0, 0);
		}

		50% {
			transform: translate3d(-25px, -25px, 0);
		}

		60% {
			transform: translate3d(0, 0, 0);
		}

		100% {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes updown1 {
		0% {
			transform: translateY(0px);
		}

		50% {
			transform: translateY(10px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@keyframes updown {
		0% {
			transform: translateY(0px);
		}

		50% {
			transform: translateY(20px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@keyframes fish {
		0% {
			opacity: 0;
			transform: translateX(200px);
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: translateX(-300px);
		}
	}

	@keyframes bubbleAnimat {
		0% {
			opacity: 0;
			transform: translateY(0);
		}

		50% {
			opacity: 0.7;
		}

		100% {
			opacity: 0.1;
			transform: translateY(-150px);
		}
	}

	.act {
		position: relative;

		#canvas {
			position: absolute;
			top: 0;
			width: 400px;
			height: 760px;
			z-index: 5;
			left: 50%;
			transform: translateX(-50%);
			pointer-events: none;
			z-index: 9999;
		}

		.login-tip {
			.icon-finger {
				width: 201rpx;
				height: 193rpx;
				position: absolute;
				bottom: 40rpx;
				left: 50%;

				z-index: 9;
				animation: fingerAnimate 6s infinite;
			}

			.icon-login-tip {
				width: 374rpx;
				height: 80rpx;
				position: absolute;
				bottom: 150px;
				right: 40rpx;
				z-index: 9;
				animation: updown1 5s infinite;
			}

		}



		.act-box {
			width: 750rpx;
			height: 1080rpx;
			padding-top: 88rpx;
			// padding-top: constant(safe-area-inset-top);
			// padding-top: env(safe-area-inset-top);
			position: relative;
			overflow: hidden;

			.bg-image {
				width: 750rpx;
				height: 1156rpx;
				position: absolute;
				top: 0;
			}

			.icon-fish {
				width: 292rpx;
				height: 59rpx;
				z-index: 4;
				position: absolute;
				top: 250rpx;
				right: 0;
				transform: translateX(60px);
				animation: fish 10s infinite;
			}

			.icon-bubble-left {
				width: 60rpx;
				height: 60rpx;
				z-index: 4;
				position: absolute;
				left: 100rpx;
				bottom: 180rpx;
				animation: bubbleAnimat 8s infinite;
				transform: translateY(0);
			}

			.icon-bubble-right-1 {
				width: 60rpx;
				height: 60rpx;
				z-index: 4;
				position: absolute;
				right: 100rpx;
				bottom: 200rpx;
				opacity: 0;
				animation: bubbleAnimat 10s infinite;
				animation-delay: 5s;
			}

			.icon-bubble-right-2 {
				width: 30rpx;
				height: 30rpx;
				z-index: 4;
				position: absolute;
				right: 100rpx;
				bottom: 130rpx;
				opacity: 0;
				animation: bubbleAnimat 10s infinite;
				animation-delay: 5s;
			}

			.icon-bottle {
				z-index: 4;
				position: absolute;
				width: 486rpx;
				height: 623rpx;
				bottom: 40rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
			}

			.bottle-coin {
				width: 344rpx;
				height: 242rpx;
				bottom: 120rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				z-index: 5;
				position: absolute;
			}

			.coin-add-num {
				font-size: 60rpx;
				font-weight: 600;
				color: #ffa402;
				display: flex;
				justify-content: center;
				align-items: center;
				bottom: 150rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				z-index: 6;
				position: absolute;
				transition: all 1.6s linear;

				&.anmation {
					transform: translateY(-190px);
					opacity: 0;
				}

				image {
					width: 65rpx;
					height: 65rpx;
					margin-right: 20rpx;
				}
			}

			.act-content {
				position: relative;
				z-index: 6;

				.icon-gl {
					position: absolute;
					width: 78rpx;
					height: 86rpx;
					right: 30rpx;
					top: 120rpx;
				}

				// .notice-box {
				// 	display: block;
				// 	margin: 0 auto;
				// 	position: absolute;
				// 	z-index: 2;
				// 	top: 120rpx;

				// 	.icon-notice {
				// 		width: 712rpx;
				// 		height: 96rpx;
				// 	}

				// 	>view {
				// 		position: absolute;
				// 		top: 30rpx;
				// 		font-size: 26rpx;
				// 		color: #fff;
				// 		left: 100rpx;
				// 		width: 520rpx;
				// 		overflow: hidden;
				// 		text-overflow: ellipsis;
				// 		white-space: nowrap;
				// 	}
				// }

				.user-box {
					position: relative;
					display: flex;
					align-items: center;
					width: 342rpx;

					.user-info {
						display: flex;
						align-items: center;
						padding: 10rpx 20rpx 10rpx 40rpx;
						width: inherit;

						.avatar {
							width: 50rpx;
							height: 50rpx;
							background: #cccccc;
							border-radius: 100px;
							flex-shrink: 0;
						}

						.username {
							font-size: 26rpx;
							color: #fff;
							margin-left: 10rpx;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							max-width: 210rpx;
						}
					}

					.coin-total {
						display: flex;
						align-items: center;
						height: 48rpx;
						background: linear-gradient(90deg, #349dee, #1b6fe5);
						border-radius: 24px;
						font-size: 30rpx;
						font-weight: 500;
						color: #fff;
						padding: 0 20rpx 0 6rpx;
						margin-left: 30rpx;

						.icon-coin {
							width: 44rpx;
							height: 44rpx;
							margin-right: 10rpx;
						}

						.icon-arrow {
							width: 24rpx;
							height: 24rpx;
							margin-left: 30rpx;
						}
					}
				}

				.coin-box {
					display: flex;
					justify-content: space-around;
					margin-top: 140rpx;

					.coin-item {
						width: 110rpx;
						text-align: center;
						color: #fffae2;
						animation: updown 6s infinite;

						.disabled {
							opacity: 0.5;
						}

						.coin-num {
							width: 110rpx;
							height: 110rpx;
							margin: 0 auto;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 100%;
							border: 1px dashed #caf9ff;
						}

						.coin-take-num {
							position: relative;
							width: 116rpx;
							height: 122rpx;
							transition: all 0.5s linear;

							&.active {
								transform: scale(1.2);
								opacity: 0;

								&+.coin-title {
									opacity: 0;
								}
							}



							>image {
								position: absolute;
								width: 116rpx;
								height: 122rpx;
								margin: 0 auto;
								left: 0;
								right: 0;

							}

							>view {
								position: absolute;
								bottom: 10rpx;
								left: 0;
								right: 0;
								margin: 0 auto;
							}
						}

						.coin-title {
							font-size: 22rpx;
							margin-top: 5rpx;
							transition: all 0.5s linear;
						}
					}
				}
			}
		}

		// 兑换
		.exchange-box {
			position: relative;
			top: -25rpx;
			border-radius: 20rpx 20rpx 0 0;
			background: #f9f9f9;
			padding: 30rpx;

			.launchApp-box {
				width: 260rpx;
				height: 72rpx;
				position: absolute;
				top: -42rpx;
				left: 0;
				right: 0;
				margin: 0 auto;

				image {
					width: 260rpx;
					height: 72rpx;
				}

				.btn-app {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}

			.gift-icon-box {
				width: 640rpx;
				height: 134rpx;
				position: absolute;
				top: -70rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				text-align: center;
				z-index: 2;

				image {
					position: absolute;
					width: 640rpx;
					height: 134rpx;
					left: 0;
				}

				>view {
					position: absolute;
					color: #ed5117;
					font-size: 30rpx;
					z-index: 2;
					top: 50rpx;
					left: 160rpx;
					width: 400rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.swiper-box {
				position: relative;

				.swiper {
					height: 220rpx;
					width: 690rpx;

					.swiper-item {
						background: #e7e7e7;

						image {
							width: 690rpx;
							height: 220rpx;
							border-radius: 10rpx;
						}
					}
				}

				/*用来包裹所有的小圆点 */
				.dots {
					display: flex;
					flex-direction: row;
					position: absolute;
					left: calc(50% - 10rpx);
					transform: translateX(-50%);
					bottom: 15rpx;

					/*未选中时的小圆点样式 */
					.dot {
						width: 8rpx;
						height: 8rpx;
						border-radius: 50%;
						background-color: #CCC;
						margin-left: 10rpx;

						/*选中以后的小圆点样式 */
						&.active {
							width: 28rpx;
							height: 8rpx;
							background-color: #FF5C2A;
							border-radius: 50px;
						}
					}
				}
			}

			.panel-wrap {
				.panel-header {
					padding: 40rpx 0;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						font-size: 34rpx;
						font-weight: bold;
						color: #222222;
					}

					.right {
						display: flex;
						align-items: center;

						image {
							width: 32rpx;
							height: 32rpx;
							border-radius: 100px;
						}

						text {
							font-size: 24rpx;
							color: #999;
							margin-left: 10rpx;
						}
					}
				}

				.panel-content {
					.prize-empty-box {
						text-align: center;
						margin-top: 60rpx;

						image {
							width: 300rpx;
							height: 200rpx;
						}

						.empty-text {
							font-size: 26rpx;
							color: #cccccc;
						}
					}

					.goods-list-block {
						display: flex;
						flex-wrap: wrap;
						margin-top: -15rpx;

						.goods-grid {
							width: 33.333%;
							margin-top: 15rpx;
						}

						.goods-list-item {
							width: 220rpx;
							height: 328rpx;
							background: #fff;
							border-radius: 8rpx;
							margin: 0 auto;

							&.more-item {
								display: flex;
								align-items: center;
								justify-content: center;

								text {
									color: #ccc;
									width: 105rpx;
									font-size: 26rpx;
								}
							}

							.img-box {
								position: relative;
								width: 220rpx;
								height: 223rpx;
								display: flex;
								align-items: center;
								justify-content: center;

								.goods-img {
									width: 155rpx;
									height: 102rpx;
									background: #999;
								}

								.good-tag {
									width: 100rpx;
									height: 32rpx;
									position: absolute;
									top: 0;
									right: 0;
									background: #666;
								}
							}

							.info-box {
								padding: 10rpx 15rpx;

								.title {
									font-size: 26rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									color: #222;
									font-weight: 500;
								}

								.cost-coin {
									display: flex;
									align-items: center;
									justify-content: center;
									margin-top: 10rpx;

									image {
										width: 30rpx;
										height: 30rpx;
									}

									text {
										font-size: 26rpx;
										color: #ff5c2a;
										margin-left: 10rpx;
									}
								}
							}
						}
					}
				}
			}
		}

		.detail-content {
			padding: 30rpx;

			.btn-footer {
				padding: 30rpx 20rpx;

				.tip-status {
					color: #ff5c2a;
					font-size: 24rpx;
					text-align: center;
					margin-bottom: 10rpx;
				}

				.btn-img {
					vertical-align: middle;
					width: 42rpx;
					height: 42rpx;
					margin-right: 10rpx;
				}

				.btn-text {
					vertical-align: middle;
				}
			}

			.img {
				width: 251rpx;
				height: 166rpx;
				display: block;
				margin: 80rpx auto;
				background: #ffa402;
			}

			.info-box {
				padding: 40rpx 0;
				border-bottom: 1rpx solid #ebebeb;

				.title {
					font-size: 36rpx;
					font-weight: bold;
					color: #222222;
				}

				.desc {
					font-size: 24rpx;
					color: #999999;
					margin-top: 10rpx;
				}
			}

			.service-box {
				margin-top: 42rpx;

				.title {
					font-size: 30rpx;
					color: #222;
					font-weight: bold;
				}

				p {
					font-size: 24rpx;
					color: #999;
					line-height: 40rpx;
				}
			}
		}

		.confirm-content {
			height: 1034rpx;
			padding: 30rpx;
			box-sizing: border-box;

			.goods-item {
				display: flex;
				align-items: center;
				padding: 40rpx 0;
				border-bottom: 1rpx solid #ebebeb;

				.left {
					width: 140rpx;
					height: 140rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #ebebeb;
					flex-shrink: 0;

					image {
						width: 100%;
					}
				}

				.right {
					margin-left: 40rpx;

					.title {
						font-size: 30rpx;
						font-weight: bold;
						color: #222222;
					}

					.goods-num {
						font-size: 24rpx;
						color: #999999;
					}
				}
			}

			.cell-item {
				display: flex;
				justify-content: space-between;
				font-size: 30rpx;
				margin-top: 37rpx;

				.title {
					color: #999;
				}

				.value {
					color: #222;
				}
			}

			.sumbit-bar {
				position: absolute;
				bottom: 80rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 690rpx;
				box-sizing: border-box;
				padding: 40rpx 0rpx;
				border-top: 1rpx solid #ebebeb;

				.total {
					font-size: 30rpx;
					color: #222;

					text {
						color: #999;
					}
				}

				.btn-confirm {
					width: 265rpx;
					height: 100rpx;
					line-height: 100rpx;
					background: #ff5c2a;
					border-radius: 50rpx;
					color: #fff;
					text-align: center;
				}
			}
		}

		.success-content {
			padding: 0rpx 30rpx;
			text-align: center;

			.box {
				width: 564rpx;
				margin: 0 auto;
				padding: 200rpx 0;
			}

			.icon-success {
				width: 105rpx;
				height: 105rpx;
			}

			.name {
				color: #28bc93;
				font-size: 34rpx;
			}

			.desc {
				margin-top: 60rpx;
				font-size: 28rpx;
				color: #999999;
			}
		}
	}

	.prize-content {
		position: relative;

		.coin-dialog {
			width: 668rpx;
			height: 768rpx;
		}

		.prize-info-box {
			position: absolute;
			width: 668rpx;

			margin: 0 auto;
			top: 35%;
			left: 0;
			right: 0;
			text-align: center;

			.title {
				font-size: 30rpx;
				color: #3c280f;
			}

			.prize-num {
				margin-top: 30rpx;
				font-size: 40rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #ff4e00;

				image {
					width: 78rpx;
					height: 78rpx;
					margin-right: 10rpx;
				}

			}
		}

	}
</style>
