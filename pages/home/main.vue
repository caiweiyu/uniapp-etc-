<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="home-page" :style="[{paddingTop: statusBarHeight * 2 + 75 + 'rpx'}]">
		<view class="header-block">
			
			<!-- 顶部引导配置图 -->
			<view class="inline-img" :style="[{paddingTop: statusBarHeight * 2 + 'rpx'}, {paddingBottom: 10 + 'rpx'}]">
				<!-- 顶部引导 -->
				<view class="top-img">
					<image class="img" v-if="top_guide" :src="top_guide.img_url" mode="left aspectFit" @click="$debounce(bindTopGuide)"></image>
				</view>
				<!-- 签到btn -->
				<view class="sign-img" @click="bindSign">
					<image class="img" :src="sign ? 'https://image.etcchebao.com/etc-min/etc-f/icon_6_1.png' : 'https://image.etcchebao.com/etc-min/etc-f/icon_7_1.png'"></image>
				</view>
			</view>
			
			<!-- loading 刷新page -->
			<!-- <view class="loading-reflash" v-if="goTop">
				<view class="box" v-for="index in [0,0,0]" :key="index"></view>
			</view> -->
			
			<!-- 车宝logo -->
			<view class="logo-box">
				<image src="https://image.etcchebao.com/etc-min/etc-f/icon_2.png" class="img-logo" />
				<view class="cer-wrap">
					<image class="img-cer" src="https://image.etcchebao.com/etc-min/etc-f/icon_1.png" />
					<text>官方认证粤通卡账单查询工具</text>
				</view>
			</view>
			
			<!--卡区域列表-->
			<swiper-cards @callback_card="callback_card" v-cloak></swiper-cards>
			
			<!--图标导航-->
			<nav-icon></nav-icon>

			<!--运营轮播图-->
			<operate-banner></operate-banner>

			<!--附近门店-->
			<!-- <nearby-stores></nearby-stores> -->

			<!--热门资讯-->
			<hot-consult @callback_msg="callback_msg" ref="hot_consult" :message_tab="message_tab" :message_article="message_article"></hot-consult>

			<!--严选购物-->
			<!-- <strict-shop ref="strict_shop">
				<button-get-phone-number type="local" slot="getPhoneNumber" />
			</strict-shop> -->

			<!-- 空格 -->
			<view class="space-white"></view>

			<!-- 全局弹窗 -->
			<dialog-window ref="dialog" flag="1"></dialog-window>

			<!-- 右上角提示收藏小程序 -->
			<collection-guide></collection-guide>
			
		</view>
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()

	import * as API from "@/interfaces/home"
	import {
		videoConfig,
		articleList,
		playConfig,
		bannerList,
		tabList,
		articleClick,
		videoList,
		dataList,
		tabVideoList,
		articleDetail
	} from "@/interfaces/info"
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"

	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	import collectionGuide from "@/components/collection-guide"
	import DialogWindow from "@/components/dialog-window"
	import SwiperCards from "./components/cards/index"
	import NavIcon from "./components/nav-icon"
	import OperateBanner from "./components/operate-banner"
	import NearbyStores from "./components/nearby-stores"
	import HotConsult from "./components/hot-consult"
	import StrictShop from "./components/strict-shop"

	export default {
		components: {
			SwiperCards,
			NavIcon,
			OperateBanner,
			NearbyStores,
			HotConsult,
			StrictShop,
			buttonGetPhoneNumber,
			collectionGuide,
			DialogWindow
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				openid: (state) => state.user.info.openid,
				unionid: (state) => state.user.info.unionid,
				share_id: (state) => state.user.info.userid,
				userinfo: (state) => state.user.info,
				auth_info: (state) => state.user.auth_info,
				latitude: (state) => state.user.latitude,
				longitude: (state) => state.user.longitude,
				city: (state) => state.user.city,

				city_code: (state) => state.user.city_code,
				share_info: (state) => state.home.share_info,
				top_guide: (state) => state.home.top_guide,
				nav_four: (state) => state.home.nav_four,
				nav_recormmend: (state) => state.home.nav_recormmend,
				banner: (state) => state.home.banner,
				etc: (state) => state.home.etc,
				carc: (state) => state.home.carc,
				memberc: (state) => state.home.memberc,
				strict_shop: (state) => state.home.strict_shop,
				ytk_bill: (state) => state.home.ytk_bill,
				fm_index: (state) => state.home.fm_index
			}),
		},
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync()['statusBarHeight'],
				unsubscribeFn: () => {},
				curLoading: true,//严选商品加载中
				goTop: false,//返回顶部
				sign: true, //是否能签到1否2是
				message_tab: [], //热门资讯tab
				message_article: {}, //热门资讯文章列表
				type: 0, // tab栏目type_id
			}
		},
		watch:{
			token: {
				handler (n, o) {
					if(n || o) {
						this.loadCardEtc();//粤通卡
						this.loadCardPlate();//车卡
						// this.loadCardVip();//VIP卡
					}
				},
				deep: true
			},
			fm_index: {
				handler (n, o) {
					if(n) {
						this.getIndex(this.message_tab[this.fm_index]);
					}
				},
				deep: true,
				immediate: true
			}
		},
		onLoad(options) {
			this.loadToken();
			uni.$on("etc", (data)=>{
				this.loadCardEtc();//粤通卡
			});//监听粤通卡emit触发刷新
			uni.$on("carc", (data)=>{
				this.loadCardPlate();//车卡
			});//监听车卡emit触发刷新
			eventMonitor("WeChat_HomePage", 1);
			console.log(new RegExp(0-9))
		},
		onShow() {
			this.$token(() => {
				this.loadInit(1);
			});//检测page是否授权，token是否过期
			this.$store.dispatch("home/ac_share_info",1);//分享配置
			this.$refs.dialog.loadPopup();//全局弹窗配置
			if (this.token) this.loadSign(); //检查是否签到
			this.loadCheckLocation(); //检查是否地理位置授
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		mounted() {

		},
		beforeDestroy() {
			this.unsubscribeFn();
		},
		methods: {
			/**
			 * token
			 */
			loadToken() {
				/*** 是否授权token ***/
				if (this.token) {
					this.loadInit(1);
				} else {
					this.loadInit(0);
				}
				//等待授权后更新接口,订阅接口
				// this.unsubscribeFn = this.$store.subscribe((mutation, state) => {
				// 	if (mutation.type == "user/setToken") {
				// 		if (state.user.token) {
				// 			this.loadInit(1);
				// 			this.loadSign()
				// 		}
				// 	}
				// })
			},

			/**
			 * 初始化
			 * 默认未登录
			 */
			async loadInit(num = 0) {
				try {
					switch (num) {
						// 未登录
						case 0:
							await Promise.all([
								this.loadGetLocation(),//地理位置授权
								this.loadTopGuide(), //顶部运营位
								this.loadCardEtc(),//粤通卡
								this.loadCardPlate(),//车卡
								//this.loadCardVip(),//VIP卡
								this.loadNavFour(), //4大金刚
								this.loadNavRecormmend(), //推荐服务
								this.loadBanner(), //banner
								this.gettabList(),
								// this.loadStrictShop(),//严选商品
							]);
							break;
							// 已登录
						case 1:
							await Promise.all([
								this.loadGetLocation(),//地理位置授权
								this.loadTopGuide(), //顶部运营位
								this.loadCardEtc(),//粤通卡
								this.loadCardPlate(),//车卡
								//this.loadCardVip(),//VIP卡
								this.loadNavFour(), //4大金刚
								this.loadNavRecormmend(), //推荐服务
								this.loadBanner(), //banner
								this.gettabList(),
								// this.loadStrictShop(),//严选商品
							]);
							break;
					}
					if (this.goTop) {
						wx.stopPullDownRefresh();//停止刷新动作
						this.goTop = false;
					}//返回顶部
				} catch (err) {
					app.log({
						err: err
					})
				}
			},

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
							// this.loadGetLocation();
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
			 * 计算签到状态
			 */
			async loadSign() {
				let res = await API.axios_sign({

				})
				this.sign = res.data;
			},

			/**
			 * 获取顶部配置接口
			 */
			async loadTopGuide() {
				let res = await API.axios_top_guide({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_top_guide", res.data);
			},
			bindTopGuide() {
				if (typeof(this.top_guide.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(this.top_guide.subs_template_id);
					miniapp.subscribe(arr, (res) => {
						this.callbackTopGuide();
					}, (err) => {
						this.callbackTopGuide();
					})
				} else {
					// 直接跳转
					this.callbackTopGuide();
				}
			},
			callbackTopGuide() {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(this.top_guide, (res) => {

				}, (err) => {

				})
			},

			/**
			 * 4大金刚接口
			 */
			async loadNavFour() {
				let res = await API.axios_nav_four({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_nav_four", res.data);
			},

			/**
			 * 推荐服务接口
			 */
			async loadNavRecormmend() {
				let res = await API.axios_nav_recormmend({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_nav_recormmend", res.data);
			},

			/**
			 * banner配置接口
			 */
			async loadBanner() {
				let res = await API.axios_banner({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_banner", res.data);
			},

			/**
			 * 粤通卡数据接口
			 * 车卡数据接口
			 * 会员卡数据接口
			 */
			async loadCardEtc() {
				let res = await API.axios_etc({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_etc", res.data);
				if (!this.token || String(res.data.top) == "null") return;
				// this.loadYTKBill(res.data.top.num);
			},
			async loadCardPlate() {
				let res = await API.axios_carc({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_carc", res.data);
				if (this.token) {
					this.loadWeather();
				}
			},
			async loadCardVip() {
				let res = await API.axios_memberc({
					citycode: this.city_code
				})
				this.$store.dispatch("home/ac_memberc", res.data);
			},
			/**
			 * 卡片区域回调
			 * ytk 粤通卡
			 * car 车卡
			 * vip vip卡
			 */
			callback_card(e) {
				switch (e.comeForm) {
					case "ytk":
						this.loadCardEtc();
						break;
					case "car":

						break;
					case "vip":

						break;
				}
			},

			/**
			 * 粤通卡账单
			 */
			// async loadYTKBill(carno) {
			// 	let res = await API.axios_ytk_bill({
			// 		startDate: miniapp.clock(new Date().getTime()).substring(0, 8) + "01",
			// 		cardNo: carno,
			// 	})
			// 	this.$store.dispatch("home/ac_ytk_bill", res.data);
			// },

			/**
			 * 天气预报接口
			 */
			async loadWeather() {
				let res = await API.axios_weather({
					lat: this.latitude,
					lon: this.longitude,
					cityName: this.city
				})
				this.$store.dispatch("home/ac_weather", res.data);
			},

			/**
			 * 热门资讯回调
			 * tab切换
			 * list文章导航
			 */
			callback_msg(e) {
				switch (Number(e.comeForm)) {
					case 1:
						this.type = e.type || 0;
						if (e.index == 0) {
							this.getIndex(e.item);
						}
						break;
					case 2:
						/**
						 * 资讯类型
						 * 4 文章
						 */
						this.inFormationDetail(e.item);
						break;
					case 3:
						this.$set(this.message_tab, this.fm_index, e.obj);
						break;
				}
			},
			async getarticleDetail(articleId,type){
				let res = await articleDetail({
					noContent:1,
					articleId:articleId,
					type:type,
				})
				let {code,msg,data} = res;
				if(code == 0 && msg == 'success'){
					if(data.jumpUrl){
						let h5_url = data.jumpUrl.replace('https','http');
						h5_url = h5_url.replace('http','https');
						uni.navigateTo({
							url: `/pages/webview/main?src=${encodeURIComponent(h5_url)}&isNeedLogin=0&isGps=0`,
						});
					}
				}
			},
			/**
			 * 去文章/视频详情
			 */
			inFormationDetail(item) {
					if([0,1,8,9].indexOf(this.type) != -1){
						this.getarticleDetail(item.articleId,4)
					}else if([5,6].indexOf(this.type) != -1){
						let param = item.contentId || item.id
						if(item.contentType == 2){ //视频
							uni.navigateTo({url: '/pages/fm/video/main?ID='+param});
						}else if(item.contentType == 1){ //文章
							this.getarticleDetail(param,4)
						}else{
							uni.navigateTo({url: '/pages/fm/video/main?ID='+param});
						}
					}else if([4].indexOf(this.type) != -1){
						let param = item.id;
						uni.navigateTo({url: '/pages/fm/video/main?ID='+param});
					}
			},
			/**
			 * 获取tab栏
			 */
			async gettabList() {
				let res = await tabList({})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					//过滤type=2或者type=3
					let arr = [];
					for (let i = 0; i < data.length; i++) {
						if (data[i].type == 2 || data[i].type == 3) {
							data.splice(i, 1)
						} else {
							arr.push(data[i]);
						}
					}
					this.$forceUpdate();
					this.message_tab = arr;
					this.getIndex(this.message_tab[this.fm_index]);
					// this.$refs.hot_consult.getTabRect();
				}
			},
			/**
			 * 获取下标
			 */
			getIndex(item) {
				// console.log(item)
				let id = item.id || 0;
				let type = item.type;
				if ([4, 5, 6].indexOf(type) == -1) {
					this.getarticleList(id);
				} else {
					switch (type) {
						case 4: //自己的视频链接
							this.gettabVideoList();
							break;
						case 5: // 汽车之家 contentfrom=1
							this.getdataList(1);
							break;
						case 6: // 蜂槽 contentfrom=2
							this.getdataList(2);
							break;
					}
				}
			},
			/**
			 * 获取资讯文章分类列表
			 */
			async getarticleList(index) {
				let res = await articleList({
					tabId: index,
					pageNumber: 1,
					pageSize: 3,
				})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					this.message_article = data;
					this.$refs.hot_consult.loadSwiperArticle();
				}
			},
			/**
			 * 获取外部视频链接 传递的参数 - contentId
			 */
			async getdataList(index) {
				let res = await dataList({
					pageNumber: 1,
					contentFrom: index,
					pageSize: 3
				});
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					for(let i=0;i<data.list.length;i++){
						if(data.list[i].contentType==2){
							data.list[i].type_id=2
						}
					}
					this.message_article = data;
					this.$refs.hot_consult.loadSwiperArticle();
				}
			},
			/**
			 * 获取自己的视频 传递的参数 - id
			 */
			async gettabVideoList() {
				let res = await tabVideoList({
					pageSize: 3,
					page: 1
				})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					for(let i=0;i<data.list.length;i++){
						data.list[i].type_id=2
					}
					this.message_article = data;
					this.$refs.hot_consult.loadSwiperArticle();
				}
			},

			/**
			 * 严选商品列表
			 */
			async loadStrictShop() {
				this.curLoading = true;
				// let res = await API.axios_banner({
				// 	token: this.token,
				// 	citycode: this.city_code,

				// })
				await setTimeout(() => {
					if (this.strict_shop.length == 0) {
						this.$store.dispatch("home/ac_strict_shop", [...[], ...[0, 1, 0]]);
					} else {
						this.$store.dispatch("home/ac_strict_shop", [...this.strict_shop, ...[0, 0, 1]]);
					}
					this.$refs.strict_shop.bindPull();
					this.curLoading = false;
				}, 500)
			},
			
			/**
			 * 签到按钮
			 */
			bindSign() {
				eventMonitor("SY_Top_SignIn_SignIn_391_Icon_click", 2);
				uni.navigateTo({
					url: "/pages/coin/home/main"
				})
			}
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
		 * 触发下拉刷新时执行
		 */
		onPullDownRefresh() {
			this.loadToken();
			this.goTop = true;
		},
		/**
		 * page下拉触底
		 */
		onReachBottom(e) {
			// this.loadStrictShop();
		},
		/**
		 * scrollTop
		 */
		onPageScroll(e) {

		},
		/**
		 * 收藏小程序到我的收藏夹
		 */
		onAddToFavorites(e) {

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
	.space-white {
		width: 100%;
		height: 30rpx;
	}
	.home-page {
		background-color: #E4F5EF;
		image {
			display: block;
			width: 100%;
			height: 100%;
		}
		.header-block {
			padding: 20rpx 0 0 0;
			min-height: 100vh;
			background: linear-gradient(180deg, #E4F5EF 0%, #FFFFFF 10%, #EBECEC 80%, #EBECEC 100%);
			.inline-img {
				position: fixed;
				z-index: 10;
				left: 0;
				top: 0;
				width: 100%;
				background-color: #E4F5EF;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				.top-img {
					display: block;
					margin: 12rpx 0 0 30rpx;
					width: 400rpx;
					height: 58rpx;
					.img {
						display: block;
						width: 100%;
						height: 100%;
					}
				}
				.sign-img {
					display: block;
					margin: 15rpx 210rpx 0 0;
					width: 48rpx;
					height: 48rpx;
					.img {
						display: block;
						width: 100%;
						height: 100%;
					}
				}
			}
			.logo-box {
				display: flex;
				align-items: center;
				margin-left: 30rpx;
				.img-logo {
					width: 172rpx;
					height: 44.5rpx;
				}
				.cer-wrap {
					display: flex;
					background: #FFFFFF;
					padding: 0 22rpx 0 55rpx;
					height: 34rpx;
					line-height: 34rpx;
					border-radius: 100px;
					margin-left: 20rpx;
					position: relative;
					.img-cer {
						position: absolute;
						left: 0;
						top: 0;
						right: 0;
						bottom: 0;
						margin: 6rpx auto auto 15rpx;
						width: 34rpx;
						height: 28rpx;
					}
					>text {
						color: #09B27F;
						font-size: 20rpx;
					}
				}
			}
			.loading {
				padding: 20rpx 0;
				width: 100%;
			}
			.loading-reflash {
				margin: -60rpx 0 0 0;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: center;
				height: 60rpx;
				.box {
					margin: 0 0 0 10rpx;
					width: 12rpx;
					height: 12rpx;
					border-radius: 100%;
					background-color: #999;
				}
				.box:nth-child(1) {
					margin-left: 0;
					animation: aniamte-1 linear 0.9s infinite;
				}
				.box:nth-child(2) {
					animation: aniamte-2 linear 0.9s infinite;
				}
				.box:nth-child(3) {
					animation: aniamte-3 linear 0.9s infinite;
				}
				@keyframes aniamte-1 {
					0% {
						background-color: #999;
					}
					33.33% {
						background-color: #333;
					}
					66.66% {
						background-color: #999;
					}
					100% {
						background-color: #999;
					}
				}
				@keyframes aniamte-2 {
					0% {
						background-color: #999;
					}
					33.33% {
						background-color: #999;
					}
					66.66% {
						background-color: #333;
					}
					100% {
						background-color: #999;
					}
				}
				@keyframes aniamte-3 {
					0% {
						background-color: #999;
					}
					33.33% {
						background-color: #999;
					}
					66.66% {
						background-color: #999;
					}
					100% {
						background-color: #333;
					}
				}
			}
		}
	}
</style>
