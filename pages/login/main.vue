<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-22 11:30:00
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-23 15:58:36   open_id: this.$store.state.user.auth_info.openid
-->
<template>
	<view class="content">
		<view class="bg">
			<image src="https://image.etcchebao.com/etc-min/etc-f/icon_15.png" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="home" :style="{top: statusBarHeight * 2 + 10 + 'rpx'}" @click="bindGohome">
				<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_35.png"></image>
			</view>
			<view class="title" :style="{paddingTop: statusBarHeight * 2 + 100 + 'rpx'}">欢迎使用ETC车宝</view>
			<view class="base" v-if="!token">
				<view class="box-1">
					<text v-if="type == 1">请完成手机号授权以继续使用</text>
					<text v-if="type == 2">需要获取你的微信头像，昵称</text>
				</view>
				<view class="box-2" hover-class="hover">
					<text v-if="type == 1">微信用户一键登录</text>
					<text v-if="type == 2">授权进入ETC车宝</text>
					<button-getPhoneNumber type="local" :url="url" :item="item" :call="call" :openphone="true"></button-getPhoneNumber>
				</view>
				<view class="box-3">
					登录代表您已同意<text @click="bindAgreement_1">《隐私协议》</text>和<text @click="bindAgreement_2">《用户协议》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	const app = getApp()

	import * as API from "@/interfaces/home"
	import { mapState } from "vuex"
	import { user } from "@/common/constant"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				share_id: (state) => state.user.info.userid,
				userinfo: (state) => state.user.info,
				auth_info: (state) => state.user.auth_info,
			})
		},
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync()['statusBarHeight'],
				type: 1,//1手机号token,2头像昵称
				url: "",//跳转url
				item: {},//事件对象
				call: "component",//调用方式(component || api)
			}
		},
		mounted() {

		},
		onLoad(options) {

		},
		async onShow() {
			let options = this.$root.$mp.query;

			// B接口生成的码(参数键值最大限制32)
			if(options.scene){
				// options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
				let scene = decodeURIComponent(options.scene);
				let obj = {};
				for (let i = 0; i < scene.split('&').length;i++){
					let arr = scene.split('&')[i].split('=');
					obj[arr[0]] = arr[1];
				}
				if(obj.hasOwnProperty("f") == true){ // from_type 节省字段缩写
					if (Number(obj.f) > 0) {
						this.$store.commit("user/setFromType", Number(obj.f));
					}
				}
				if(obj.hasOwnProperty("s") == true){ // share_id 节省字段缩写
					if (Number(obj.s) > 0) {
						this.$store.commit("user/setShareId", Number(obj.s));
					}
				}
				if(obj.hasOwnProperty("b") == true){ //业务参数用于中转(内嵌业务)（以下划线隔开）
					await this.getH5Url(obj.b);
				}
			}
			//兼容AC接口小程序码(带路径128位)
			if (options.hasOwnProperty("b") == true) {
				await this.getH5Url(options.b);
			}
			if (options.hasOwnProperty("f") == true) { // from_type 节省字段缩写
				if (Number(options.f) > 0) {
					this.$store.commit("user/setFromType", Number(options.f));
				}
			}
			if(options.hasOwnProperty("s") == true){ // share_id 节省字段缩写
				if (Number(options.s) > 0) {
					this.$store.commit("user/setShareId", Number(options.s));
				}
			}

			if (options.hasOwnProperty("h5_url") == true) {
				this.url = options.h5_url;
			}
			if (options.hasOwnProperty("item") == true) {
				this.item = JSON.parse(decodeURIComponent(options.item));
			}//接收事件对象
			if (options.hasOwnProperty("call") == true) {
				this.call = options.call;
			}//接收调用方式
			if (options.hasOwnProperty("noLocation") == false) {
				this.loadGetLocation();
			}//禁止非onLuanch进入首页时执行地理位置查询
			if (options.hasOwnProperty("token") == true) {
				this.$store.commit("user/setToken", "");
				return
			}//登录超时
			console.log('this.url',this.url)
			if (this.token != "") {
				if (this.url == "") {
					uni.switchTab({
						url: "/pages/home/main"
					})
				} else {
					uni.reLaunch({
						url: `/pages/webview/main?src=${this.url}`
					})
				}
			} else {
				console.log("未登录login")
			}
			this.loadCheckLocation();
		},
		onHide() {

		},
		methods: {
			/**
			 * 检测用户是否地理位置授权
			 * 1、当用户首次进入首页时，默认弹窗引导用户授权地理位置弹窗；
			   2、当用户拒绝时，默认公司地址为地理位置；（有效期为24小时）；
			   3、用户拒绝24小时内，访问首页不引导授权地理位置；24小时后再引导用户授权地理位置；
			 */
			loadCheckLocation() {
				uni.getSetting({
					success: (res)=> {
						if (!res.authSetting["scope.userLocation"]) {
							if (uni.getStorageSync("cacheData")["location"] == undefined) {
								// 首次不弹
								return;
							}
							if (!miniapp.getCacheData({key: "location"})) {
								// 24小时后触发函数再弹弹窗
								return;
							}
							uni.showModal({
								title: "提示",
								content: "为给您提供优质的车主商家服务，请提供地理位置授权",
								success: (result)=>{
									if (result.confirm) {
										uni.openSetting({

										})
									}
									miniapp.removeCacheData({key: "location"});
									miniapp.setCacheData({
										key: "location",
										value: new Date().getTime()
									});
								}
							})
						} else {
							this.loadGetLocation();
							if (uni.getStorageSync("cacheData")["location"]) {
								miniapp.removeCacheData({key: "location"});
							}
						}
					}
				})
			},

			/**
			 * 获取用户地理位置
			 */
			loadGetLocation() {
				if (uni.canIUse("getLocation")) {
					uni.getLocation({
						type: 'wgs84',
						success: ({
							latitude,
							longitude,
							...other
						}) => {
							this.$store.commit("user/setLocation", {
								latitude,
								longitude
							})
							this.loadCityCode(latitude,longitude);
						},
						fail: (err) => {
							this.$store.commit("user/setLocation", {
								latitude: 23.101494,
								longitude: 113.389287
							})//拒绝授权地理位置获取，保存公司经纬度113.389287,23.101494
							this.loadCityCode();
							if (uni.getStorageSync("cacheData")["location"] == undefined) {
								miniapp.setCacheData({
									key: "location",
									value: new Date().getTime()
								});
							}
						}
					})
				} else {
					uni.showModal({
						title: "微信版本过低，暂不支持地理位置授权功能，请升级至微信最新版本",
						showCancel: false
					})
				}
			},

			/**
			 * 城市编码接口
			 */
			async loadCityCode(latitude=23.101494,longitude=113.389287) {
				let res = await API.axios_city_code({
					lat: latitude,
					lng: longitude
				})
				let cityName = res.data.result.addressComponent.city;
				let cityCode = res.data.result.cityCode;
				this.$store.dispatch("user/ac_city", cityName);
				this.$store.dispatch("user/ac_city_code", cityCode);
			},
			/**
			 * 获取业务路径
			 */
			async getH5Url(b) {
				let res = await API.axios_h5_url({
					param: b
				})
				let {code,data,msg} = res;
				if(code == 0 && !!data.h5_url){
					this.url = encodeURIComponent(data.h5_url)
				}
			},

			/**
			 * 返回首页
			 */
			bindGohome() {
				uni.switchTab({
					url: "/pages/home/main"
				})
			},

			/**
			 * 隐私协议
			 */
			bindAgreement_1() {
				uni.navigateTo({
					url: `/pages/webview/main?src=${encodeURIComponent(user + "/agreement/product.html")}&isNeedLogin=${0}&isGps=${0}`
				})
			},

			/**
			 * 用户协议
			 */
			bindAgreement_2() {
				uni.navigateTo({
					url: `/pages/webview/main?src=${encodeURIComponent(user + "/agreement/user.html")}&isNeedLogin=${0}&isGps=${0}`
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

<style lang="scss" scoped>
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	.hover {
		opacity: 0.8;
	}
	.content {
		color: #222222;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
		.main {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			.home {
				position: fixed;
				left: 20rpx;
				// top: 100rpx;
				width: 60rpx;
				height: 60rpx;
				border: 1rpx solid #cccccc;
				border-radius: 100%;
				.img {
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					width: 40rpx;
					height: 40rpx;
				}
			}
			.title {
				margin: 0 40rpx 0 40rpx;
				font-size: 48rpx;
				font-weight: 700;
				text-align: center;
			}
			.base {
				position: absolute;
				left: 0;
				bottom: 80rpx;
				width: 100%;
				text-align: center;
				.box-1 {
					font-size: 24rpx;
				}
				.box-2 {
					position: relative;
					margin: 20rpx auto 0 auto;
					width: 670rpx;
					height: 100rpx;
					line-height: 100rpx;
					background-color: #FF5C2A;
					border-radius: 100rpx;
					font-size: 34rpx;
					color: #FFFFFF;
				}
				.box-3 {
					margin: 120rpx 0 0 0;
					font-size: 24rpx;
					>text {
						color: #FF5C2A;
					}
				}
			}
		}
	}
</style>
