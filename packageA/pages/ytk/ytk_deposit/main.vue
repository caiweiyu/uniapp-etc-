<template>
	<!-- <view> -->
	<view class="box">

		<view class="box_process">
			<etc-process :list="listStatus"></etc-process>
		</view>

		<view class="box_tip">
			<veiw class="box_tip_header">
				<view @click="bindStudyToast">
					<view class="box_tip_header_box1">请按照以下提示进行操作</view>
					<image src="https://image.etcchebao.com/etc-min/ytk-qc-file/qc_tip.png"></image>
				</view>
				<view @click="bindYTKStudy">
					<text v-text="step_connect.gnav[0].name"></text>
					<!-- <image v-if="step_connect.gnav[0].jump_url != ''" src="https://image.etcchebao.com/etc-min/ytk-qc-file/icon-right.png"></image> -->
				</view>
			</veiw>
			<view class="box_tip_content">
				<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration"
					:previous-margin="previousmargin" :next-margin="nextmargin" :circular="circular" :current="current"
					@change="bindchange">
					<swiper-item class="swiper-item" v-for="(item, index) in banner" :key="index">
						<view hover-class="hover" class="hover-banner">
							<view class="text">
								<text>{{item.msg.one}}</text>
								<text>{{item.msg.two}}</text>
								<text>{{item.msg.three}}</text>
							</view>
							<image class="img" :src="item.url" />
						</view>
					</swiper-item>
				</swiper>
				<view class="dots">
					<view :class="['box', current == index ? 'active' : '']" v-for="(item, index) in banner"
						:key="index"></view>
				</view>
			</view>
		</view>

		<view class="box_tip_bottom">
			<view class="font_header">
				<text>待圈存金额</text>
				<view v-if="load_money>0">
					<text>￥</text>
					{{load_money}}
				</view>
			</view>
			<view class="font_status" v-if="isRestart">
				<view :class="[status_active?'animate_imformation':'']"></view>
				<view v-if="orderId!==''" class="animate_block" @click="resGetDev">
					{{ depositProgress>0 ? depositProgress+'%' : (tipStatusLoading ? tipStatusLoading :'开始连接')}}
				</view>
			</view>
			<view class="font_status" v-if="!isRestart">
				<view :class="[status_active?'animate_imformation':'']"></view>
				<view v-if="orderId!==''" class="animate_block" @click="getDev">
					{{ depositProgress>0 ? depositProgress+'%' : (tipStatusLoading ? tipStatusLoading :'开始连接')}}
					<!-- {{tipStatusLoading ? tipStatusLoading : (depositProgress>0 ? depositProgress+'%':'开始连接')}} -->
				</view>
			</view>
			<text class="font_tip">
				{{connectStatus}}
			</text>
			<view class="font_Card">
				<image class="font_Card_box1" src="https://image.etcchebao.com/etc-min/ytk-qc-file/qc_tip.png"></image>
				<view class="font_Card_box2">圈存过程中请勿移动卡片</view>
			</view>
		</view>

		<u-popup v-model="show_detail" mode="bottom" @close="onDetailClose" height="60%">
			<view class="quanc-popup">
				<view class="box_tip_popup">
					<view>请选择需连接的设备</view>
					<image src="https://image.etcchebao.com/etc-min/ytk-qc-file/img_shebeihao.png"></image>
					<text>设备号在设备表面</text>
				</view>
				<view class="box_tip_popupcontent" v-if="devCheck && deviceList">
					<text>设备号</text>
					<block v-if="deviceList.length > 0">
						<view v-for="(item,index) in deviceList" :key="index">
							<view>
								<image src="https://image.etcchebao.com/etc-min/ytk-qc-file/ic_shebei.png"></image>
								<text>{{item.senumber}}</text>
							</view>
							<text @click="(()=>{show_detail = false;setDev(item)})"
								:class="[current_index==index?'index_actice':'']">连接</text>
						</view>
					</block>
				</view>
			</view>
		</u-popup>

		<!-- ***************************** -->
		<!-- 充值教程弹窗 -->
		<!-- ***************************** -->
		<u-popup v-model="study_toast" height="600rpx" mode="bottom">
			<view class="popup-activity">
				<view class="title" v-text="step_connect.gstep.title"></view>
				<scroll-view scroll-y class="dec">
					<view v-for="(item,index) in step_connect.gstep.point" :key="index" v-text="item"></view>
				</scroll-view>
				<view class="close" @click="bindStudyToast">
					<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_25.png"></image>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import EtcProcess from "../ytk_pay/components/etc-process"

	import * as Events from 'eventemitter2'

	const emitter = new Events.EventEmitter2();
	import * as bleProxy from "@/packageA/pages/ytk/ytk_deposit/blue/bleProxy";
	import {
		BLE
	} from "@/packageA/pages/ytk/ytk_deposit/blue/ble";
	const ble = new BLE(emitter, '');
	import {
		CMDHelper
	} from "@/packageA/pages/ytk/ytk_deposit/blue/cmdHelper";
	//const cmdHelper = new CMDHelper(emitter,92)
	import {
		BLEReceive
	} from "@/packageA/pages/ytk/ytk_deposit/blue/bleReceive";
	//const bleReceive = new BLEReceive(emitter,0)
	import {
		DepositCard
	} from "@/packageA/pages/ytk/ytk_deposit/blue/depositCard";
	//const depositCard = new DepositCard(emitter,ble,cmdHelper,deviceInfo)

	import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";
	import {
		mapState
	} from "vuex";
	import conf from '@/config/conf'
	import * as API from "@/interfaces/base";
	import * as API_YTK from "@/interfaces/ytk";

	import {
		eventMonitor
	} from "@/common/utils"

	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()

	export default {
		data() {
			return {
				emitter: emitter,
				ble: ble,
				connectStatus: "",
				devType: -1,
				cmdHelper: null,
				bleReceive: null,

				deviceId: '',
				deviceList: [],
				macsar: [],
				devCheck: false,

				deviceInfo: '',
				depositCard: null,
				orderId: '',
				depositState: "",
				depositProgress: '',
				tipStatusLoading: '', //重试提示

				balance: 0,
				cardInfo: null,
				//cardNo:"1913222300077490",
				cardNo: "",
				load_money: 0,
				order_type:11,
				listStatus: [{
						name: "支付金额",
						status: 1,
						active: 1
					},
					{
						name: "连接设备",
						status: 1,
						active: 1
					},
					{
						name: "充值完成",
						status: 0,
						active: 0
					},
				],
				// indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				circular: true,
				// easingfunction:"linear",
				nextmargin: "20rpx",
				previousmargin: "28rpx",
				// nextmargin: "40rpx",
				// previousmargin: "25rpx",
				status_active: false,
				current: 0,
				current_index: -1,
				banner: [{
						url: "https://image.etcchebao.com/etc-min/ytk-qc-file/qc_bg3.png",
						msg: {
							one: "1.开启手机蓝牙",
							two: "2.插入待充值卡片",
							three: "3.开启充值设备"
						}
					},
					{
						url: "https://image.etcchebao.com/etc-min/ytk-qc-file/qc_bg2.png",
						msg: {
							one: "1.开启手机蓝牙",
							two: "2.插入待充值卡片",
							three: "3.开启充值设备"
						}
					}
				],
				show_detail: false,
				touch_stop: true,

				study_toast: false, //粤通卡圈存指引弹窗
				step_connect: "", //粤通卡圈存引导和配置
				isRestart: false, //是否属于重启
				bleStatus: false, //蓝牙链接状态
				initEncodeCount: 0, //非国密初始化次数
				authEncodeCount: 0, //非国密登录次数
			};
		},
		onLoad(options) {
			this.initAll();
			this.watchBLE();
			this.getYTKConfig();
			if (options.orderid) {
				this.orderId = options.orderid;
			}
			if (options.cardNo) {
				this.cardNo = options.cardNo;
			}
			if (options.load_money) {
				this.load_money = options.load_money;
			}else{
				this.loadOrderDetail(options.orderid)
			}
			eventMonitor("YTK_LinkDevice", 1, {
				order_id: this.orderId
			})
		},
		onShow() {
			this.$token(() => {
				this.orderId = this.$root.$mp.query.orderid || "";
				this.cardNo = this.$root.$mp.query.cardNo || "";
				this.load_money = this.$root.$mp.query.load_money || "";
				this.initAll();
				this.watchBLE();
				this.getYTKConfig();
			});//检测page是否授权，token是否过期
		},
		mounted() {},
		components: {
			EtcProcess
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				openid: (state) => state.user.info.openid,
			}),
		},
		methods: {
			bindchange(e) {
				this.current = e.detail.current;
			},
			onDetailClose() {
				this.tipStatusLoading = '开始连接';
				this.connectStatus = '';
				this.show_detail = false;
				//解开禁用
				this.touch_stop = true;
			},
			async loadOrderDetail(orderId) {
				let res = await API_YTK.ytk_pay_order_detail({
					orderType: this.order_type,
					orderId: orderId
				});
				let {code,data,msg} = res;
				if(code == 0){
					this.$nextTick(()=>{
						this.load_money = data.load_money
					})
				}
			},
			initAll() {
				//const ble = new BLE(emitter, '');
				//this.ble = ble
				//this.ble.close()
				this.devType = -1
				this.cmdHelper = null
				this.bleReceive = null
				//this.connectStatus = ''
				this.deviceId = ''
				this.deviceList = []
				this.macsar = []
				this.mac2 = []
				this.devCheck = false
				this.deviceInfo = null
				this.depositCard = null
				this.depositState = ''
				this.depositProgress = ''
				this.initEncodeCount = 0 //非国密初始化次数
				this.authEncodeCount = 0 //非国密登录次数
			},
			resGetDev() { //重新搜索设备先关闭蓝牙再初始化
				this.initAll()
				this.touch_stop = true;
				if (this.bleStatus) {
					console.log('resGetDev', '111111')
					this.ble.close()
				} else {
					console.log('resGetDev', '22222')
					this.getDev()
				}
			},
			getDev() {
				eventMonitor("LinkDevice_Start_YTK_YTKRecharge_387_Button_click", 2, {
					order_id: this.orderId
				})
				eventMonitor("LinkDevice_Retry_YTK_Other_387_Button_click", 2, {
					order_id: this.orderId
				})
				// this.initAll()
				// if(deviceList && deviceList.length > 0){
				//     this.show_detail = true;
				// }else{
				console.log('getDev', '11111')
				if (this.touch_stop == true) {
					//禁用点击
					console.log('getDev', '22222')
					this.touch_stop = false;
					this.macsar = [];
					this.deviceId = '';
					this.tipStatusLoading = '正在查找设备';
					this.ble.getDev().then(res => {
						console.log('deviceIds', res)
						//this.deviceId = res[0].deviceId
						for (let i = 0; i < res.length; i++) {
							this.macsar.push(res[i].mac)
							this.mac2[res[i].mac] = res[i].deviceId;
						}
						this.macsar = [...new Set(this.macsar)]
						this.fetchDevicenoByMac()
					});
					this.status_active = true
				}
				// }
			},
			setDev(data) {
				eventMonitor("LinkDevice_Popover_YTK_YTKRecharge_387_Button_click", 2, {
					order_id: this.orderId
				})
				this.tipStatusLoading = '';
				console.log('data------', data)
				this.deviceInfo = data;
				this.deviceId = this.mac2[this.str2mac(data.macaddress)]
				this.ble.setDev(this.deviceId)
				this.status_active = false
				this.current_index = data.index
			},
			str2mac(str) {
				let mac = []
				for (let i = 0; i < str.length; i += 2) {
					mac.push(str.substr(i, 2))
				}
				return mac.join(":")
			},
			//扫描发现设备
			fetchDevicenoByMac() {
				this.deviceList = []
				bleProxy.fetchDevicenoByMac({
					//version: "4.4.0",
					mac: this.macsar.join(",").replace(/:/g, ""),
				}).then(res => {
					let {
						code,
						data
					} = res;
					if (code == 0) {
						if (data.info && data.info.length > 0) {
							console.log('Device_list',data.info)
							this.deviceList = data.info;
							if (this.deviceList.length === 1) {
								//this.setDev(this.deviceList[0])
								this.devCheck = true
								this.tipStatusLoading = '已找到设备';
								this.status_active = false;
								this.show_detail = true
							} else if (this.deviceList.length > 1) {
								// this.depositState = 0
								// this.depositProgress = "已经发现充值设备，开始连接"
								this.depositProgress = 0;
								this.tipStatusLoading = '已找到设备';
								this.status_active = false;
								this.devCheck = true
								this.show_detail = true
							} else if (this.deviceList.length == 0) {
								this.tipStatusLoading = '重试';
								this.status_active = false;
								this.devCheck = false;
								this.isRestart = true
							}
						} else {
							this.tipStatusLoading = '重试';
							this.connectStatus = '';
							this.status_active = false;
							this.show_detail = false;
							this.isRestart = true
						}
					} else {
						this.tipStatusLoading = '重试';
						this.connectStatus = '';
						this.status_active = false;
						this.show_detail = false;
						this.isRestart = true
					}
					//解除点击
					this.touch_stop = true
				})
			},
			checkCardno() {
				this.connectStatus = "检测卡号是否一致"
				this.depositProgress = 32
				bleProxy.checkCardno({
					cardno: this.cardInfo.cardNum,
					order_id: this.orderId
				}).then(res => {
					let {
						code,
						data
					} = res;
					if (code == 0) {
						if (data.res) {
							if (this.devType === 0) {
								this.sendBlueOrders(this.cmdHelper.getCmdC2Guomi())
							} else if (this.devType === 1) {
								//检测设备绑定
								this.bindDevice()
							}
						}
					}
				})
			},
			bindDevice() { //非国密
				bleProxy.bindDevice({
					cardno: this.cardInfo.cardNum,
					senumber: this.deviceInfo.senumber,
					device_type: 1,
					option_type: 1,
					order_id: this.orderId
				}).then(res => {
					let {
						code,
						data
					} = res;
					if (code == 0) {
						if (data.result === "success") {
							this.sendBlueOrders(this.cmdHelper.getCmdC2())
						}
					}
				})
			},

			// 下发蓝牙指令
			sendBlueOrders(data) {
				console.log('data : ', data)
				let currCmd = this.cmdHelper.currCmd
				console.log('currCmd : ', currCmd)
				return new Promise((resolve, reject) => {
					let flow = this.ble.send(data) //发送数据
					if (flow) {
						resolve()
					} else {
						reject()
					}
				})
			},
			watchBLE() {
				let that = this;
				if (this.ble) {
					//console.log('this.ble', this.ble)
					this.ble.listen(res => {
						//console.log('watchBLE', res)
						this.touch_stop = false; //禁止点击
						if (res.type === 'connect') { //连接
							console.log('connect', res)
							if (res.code === "-1") {
								this.bleStatus = false
								if (this.isRestart) {
									this.getDev()
								}
							} else if (res.code === "-2") {
								this.connectStatus = res.data
								this.depositProgress = 0;
								this.tipStatusLoading = '开始';
								this.status_active = false;
								this.devCheck = false;
								this.isRestart = true
								this.touch_stop = true
								wx.showModal({
									title: "提示",
									content: res.data,
									showCancel: false,
									confirmText: "确定",
								});
							} else {
								this.connectStatus = res.data
								if (res.data === "蓝牙已连接") {
									this.depositProgress = 9
									this.connectStatus = "充值设备服务被正常开启"
									this.bleStatus = true
									this.devType = res.devType
									if (this.deviceInfo) {
										this.bleReceive = new BLEReceive(emitter, this.devType)
										this.cmdHelper = new CMDHelper(emitter, Number(this.deviceInfo.maxpacklen))
										this.depositProgress = 18
										this.connectStatus = "充值设备响应成功"
										if (this.devType === 0) {
											that.sendBlueOrders(this.cmdHelper.getHandshakeGuomi()) //握手
										} else if (this.devType === 1) {
											that.sendBlueOrders(this.cmdHelper.authEncode()) //登录
											//that.sendBlueOrders(this.cmdHelper.getCmdA2()) //握手
										}
										this.depositCard = new DepositCard(this.emitter, this.ble, this.cmdHelper,
											this.deviceInfo)
									}
								}
							}
						} else if (res.type === 'response') { //接收
							console.log('response', res)
							if (res.code === "0") {
								this.bleReceive.receiveData(res.data)
							}
						} else if (res.type === 'depositProgress') { //圈存进度
							console.log('depositProgress', res)
							if (res.code === -1 && res.msg !== '') {
								wx.showModal({
									title: "提示",
									content: res.msg,
									showCancel: false,
									confirmText: "确定",
								});
								this.tipStatusLoading = '重试';
								this.status_active = false;
								this.touch_stop = true; //解除点击
							} else if (res.code === 0 && res.msg !== '' && res.data > 0) {
								this.connectStatus = res.msg //圈存状态
								this.depositProgress = res.data //进度值
							}
						} else if (res.type === 'authEncode') {
							console.log('authEncode', res)
							if (res.code === "0") {
								this.authEncodeCount = this.authEncodeCount + 1
								if (this.authEncodeCount < 4) {
									console.log('authEncodeCount-1', this.authEncodeCount)
									that.sendBlueOrders(this.cmdHelper.authEncode())
								} else {
									console.log('authEncodeCount-2', this.authEncodeCount)
									this.connectStatus = "设备连接登录失败";
									this.depositProgress = 0;
									this.tipStatusLoading = '重试';
									this.status_active = false;
									this.devCheck = false;
									this.isRestart = true
									this.touch_stop = true
									this.ble.close()
								}

							}
						} else if (res.type === 'initEncode') {
							console.log('initEncode', res)
							if (res.code === "0") {
								this.initEncodeCount = this.initEncodeCount + 1
								if (this.initEncodeCount < 30) {
									console.log('initEncodeCount-1', this.initEncodeCount)
									that.sendBlueOrders(this.cmdHelper.initEncode())

									// let intType = this.initEncodeCount % 4
									// switch (intType) {
									// 	case 0:
									// 		that.sendBlueOrders(this.cmdHelper.initEncode())
									// 	case 1:
									// 		that.sendBlueOrders(this.cmdHelper.initEncode1())
									// 	case 2:
									// 		that.sendBlueOrders(this.cmdHelper.initEncode2())
									// 	case 3:
									// 		that.sendBlueOrders(this.cmdHelper.initEncode3())
									// }
								} else {
									console.log('initEncodeCount-2', this.initEncodeCount)
									this.connectStatus = "设备连接初始化失败";
									this.depositProgress = 0;
									this.tipStatusLoading = '重试';
									this.status_active = false;
									this.devCheck = false;
									this.isRestart = true
									this.touch_stop = true
									this.ble.close()
								}
							}
						} else if (res.type === 'encode') {
							console.log('encode', res)
							if (res.code === "0") {
								that.sendBlueOrders(this.cmdHelper.getCmdA2())
							}
						} else if (res.type === 'packageData') {
							console.log('packageData', res)
							if (res.code === "0") {
								this.cmdHelper.receiveDataWrite(res.data)
							}
						} else if (res.type === 'frameData') {
							console.log('frameData', res);
							if (res.code === "0") {
								let currCmd = this.cmdHelper.currCmd
								this.depositCard.setOrderId(this.orderId)
								this.depositCard.processRecvData(currCmd, res)
							}
						} else if (res.type === 'balance') {
							console.log('balance', res);
							if (res.code === "0") {
								this.balance = res.data
							}
						} else if (res.type === 'cardInfo') {
							console.log('cardInfo', res);
							if (res.code === "0") {
								this.cardInfo = res.data.cardInfo
								if (res.data.depositState === 3) {
									this.connectStatus = "圈存成功"
									this.depositProgress = 100
									this.isRestart = false
									if (this.devType === 0) {
										that.sendBlueOrders(this.cmdHelper.getCmdC3Guomi()) //强制断电
									} else {
										that.sendBlueOrders(this.cmdHelper.getCmdC3()) //强制断电
									}
									this.ble.close()
									this.tipStatusLoading = "圈存成功";
									this.touch_stop = true; //解除点击
									uni.redirectTo({
										url: `/packageA/pages/ytk/ytk_deposit/pay_success?plateNum=${this.cardInfo.plateNum}&cardNum=${this.cardInfo.cardNum}&balance=${this.balance}`
									})
								} else {
									this.checkCardno()
								}
							}
						}
					})
				}
			},

			/**
			 * 粤通卡充值引导文，文案配置接口
			 */
			async getYTKConfig() {
				let res = await API_YTK.ytk_pay_list({

				})
				this.step_connect = res.data.step_connect;
			},

			/**
			 * 粤通卡教程弹窗
			 */
			bindStudyToast() {
				this.study_toast = !this.study_toast;
			},

			/**
			 * 粤通卡充值教程
			 */
			bindYTKStudy() {
				if (typeof(this.step_connect.gnav[0].subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(this.step_connect.gnav[0].subs_template_id);
					miniapp.subscribe(arr, (res) => {
						this.callbackYTKStudy();
					}, (err) => {
						this.callbackYTKStudy();
					})
				} else {
					// 直接跳转
					this.callbackYTKStudy();
				}
			},
			callbackYTKStudy() {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(this.step_connect.gnav[0], (res) => {

				}, (err) => {

				})
			}
		},
		onUnload() {

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

<style lang="scss" scoped>
	.quanc-popup {
		background-color: #FFFFFF;
		height: 100%;
		padding: 40rpx 0 0 0;
		border-radius: 20rpx 20rpx 0 0;
	}

	.box {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background-color: #FFFFFF;

		&_process {
			height: 161rpx;
			background-color: #FFFFFF;
		}

		&_tip {
			padding-top: 20rpx;
			background-color: #F6F6F6;

			&_header {
				width: 100%;
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				text-align: center;
				background-color: #FFFFFF;
				font-size: 28rpx;

				>view:nth-child(1) {
					.box_tip_header_box1{
						display: inline-block;
						color: #999999;
						margin: 40rpx 0 0 28rpx;
						text-align: left;
						vertical-align: middle;
					}
					image {
						width: 28rpx;
						height: 28rpx;
						display: inline-block;
						vertical-align: middle;
						margin: 40rpx 0 0 8rpx;
					}
				}

				>view:nth-child(2) {
					display: inline-block;
					color: #FF5C2A;
					margin-right: 28rpx;
					margin-top: 40rpx;

					>text {
						vertical-align: bottom;
					}

					>image {
						width: 12.5rpx;
						height: 24rpx;
						vertical-align: middle;
						margin-left: 7rpx;
					}
				}
			}

			&_content {
				background-color: #FFFFFF;

				.swiper {
					// width: 694rpx;
					width: 750rpx;
					height: 250rpx;
					margin: 0 auto;

					.swiper-item {
						position: relative;

						.hover-banner {
							background-color: #F6F6F6;
							display: block;
							width: 694rpx;
							height: 220rpx;
							border-radius: 14rpx;

							.img {
								width: 588rpx;
								height: 130rpx;
								border-radius: 14rpx;
								display: inline-block;
								padding-top: 10rpx;
								padding-left: 38rpx;
								margin: auto;
							}

							.text {
								display: flex;
								justify-content: center;
								padding-top: 30rpx;

								>text {
									color: #999999;
									font-size: 24rpx;
								}

								>text:nth-child(2) {
									margin: 0 48rpx 0 49rpx;
								}
							}
						}
					}

					.hover-index {
						display: flex;
						justify-content: center;
						width: 100%;
						margin-top: 24rpx;

						>view {
							width: 20rpx;
							height: 20rpx;
							background-color: blue;
						}
					}
				}

				.dots {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: center;

					.box {
						margin: 0 0 0 10rpx;
						width: 15rpx;
						height: 10rpx;
						background-color: rgba($color: #999999, $alpha: 0.2);
						border-radius: 12rpx;

						&.box:first-child {
							margin: 0;
						}

						&.active {
							background-color: #141516 !important;
							width: 30rpx !important;
							transition: width linear 0.2s;
						}
					}
				}
			}

			&_bottom {
				height: 100%;
				position: relative;

				.font_header {
					padding: 62rpx 0 69rpx 0;
					margin: auto;
					text-align: center;
					position: relative;

					>view {
						font-size: 80rpx;
						color: #FF5C2A;
						font-weight: bold;
						font-family: 'etccb-font';
						>text {
							font-size: 28rpx !important;
						}
					}
					>text {
						text-align: center;
						font-size: 24rpx;
						color: #999999;
					}
				}

				.font_status {
					position: relative;
					width: 100%;
					height: 300rpx;
					.animate_block {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						background: linear-gradient(to bottom, #FF9343 0%, #FF5C2A 100%);
						width: 244rpx;
						height: 244rpx;
						line-height: 240rpx;
						// border:28rpx solid #FFEEE9;
						margin: auto;
						border-radius: 50%;
						text-align: center;
						font-size: 34rpx;
						color: #FFFFFF;
					}

					.animate_imformation {
						position: absolute;
						display: block;
						left: 50%;
						top: 50%;
						border-radius: 100%;
						width: 244rpx;
						height: 244rpx;
						animation: pulse 1s infinite alternate;
						box-sizing: content-box;
						transform: translate(-50%, -50%);
						background: #FFEEE9;
					}
				}

				// .font_status_active {
				// 	animation: pulse 1s infinite alternate;
				// 	box-sizing: content-box;
				// }
				@keyframes pulse {
					0% {
						width: 244rpx;
						height: 244rpx;
					}

					100% {
						width: 300rpx;
						height: 300rpx;
					}
				}
				.font_tip{
					display: block;
					margin: 10rpx 0 0 0;
					text-align: center;
					color: #666666;
					font-size: 24rpx;
				}
				.font_Card {
					text-align: center;
					margin: auto;
					.font_Card_box2{
						margin-left: 8rpx;
						color: #28BC93;
						font-size: 24rpx;
						font-weight: bold;
						vertical-align: middle;
						display: inline-block;
					}
					.font_Card_box1 {
						width: 28rpx;
						height: 28rpx;
						display: inline-block;
						vertical-align: middle;
						margin-left: 8rpx;
					}
				}
			}

			&_popup {
				>view {
					color: #222222;
					font-size: 36rpx;
					font-weight: bold;
					margin: 32rpx 0 40rpx 0;
					text-align: center;
				}

				>image {
					width: 255rpx;
					height: 136rpx;
					display: block;
					margin: 0 auto;
				}

				>text {
					margin: 20rpx 0 0 0;
					color: #999999;
					font-size: 24rpx;
					display: block;
					text-align: center;
				}
			}

			&_popupcontent {
				>text {
					font-size: 28rpx;
					color: #999999;
					margin-left: 28rpx;
					margin-bottom: 30rpx;
				}

				>view {
					display: flex;
					justify-content: space-between;
					margin: 45rpx 0 30rpx 0;

					>view {
						>image {
							display: inline-block;
							width: 32rpx;
							height: 32rpx;
							margin: 0 16rpx 0 28rpx;
							vertical-align: middle;
						}

						>text {
							vertical-align: middle;
						}

						color: #222222;
						font-size: 32rpx;
						font-weight: bold;
					}

					>text {
						font-size: 24rpx;
						color: #FF5C2A;
						border: 2rpx solid #FF5C2A;
						border-radius: 120rpx;
						display: block;
						width: 112rpx;
						height: 48rpx;
						line-height: 48rpx;
						text-align: center;
						margin-right: 28rpx;
					}

					.index_actice {
						color: #FFFFFF !important;
						background-color: #FF5C2A;
					}
				}

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
			margin: 0 28rpx;
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
			right: 22rpx;
			top: 37rpx;
			width: 40rpx;
			height: 40rpx;

			.img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
