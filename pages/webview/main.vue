<template>
	<block v-if="show">
		<web-view :src="loadUrl" @message="(e) => handleMessage(e)"></web-view>
	</block>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp();
	import config from "@/config/conf"
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				show: false,
				src: "",
				loadUrl: "",
				jumpUrl: "",
			};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				openid: (state) => state.user.info.openid,
				latitude: (state) => state.user.latitude,
				longitude: (state) => state.user.longitude,
				share_id: (state) => state.user.share_id
			}),
		},
		async onShow() {
			let {
				src,
				isNeedLogin = 1,
				isGps = 1
			} = this.$root.$mp.query;
			this.src = src;
			let jumpUrl = decodeURIComponent(src);
			try {
				await this.loadIsNeedLogin(jumpUrl, isNeedLogin);
				await this.loadIsGps(this.jumpUrl, isGps);
				await this.loadVerson(this.jumpUrl, 1);
				this.loadUrl = this.jumpUrl;
				this.show = true;
				console.log('this.loadUrl',this.loadUrl)
			} catch(err) {

			}
		},
		onLoad() {

		},
		methods: {
			/**
			 * token 授权
			 */
			loadIsNeedLogin(jumpUrl, isNeedLogin) {
				if (isNeedLogin) {
					let key = jumpUrl.indexOf('?') > -1 ? '&' : '?'
					this.jumpUrl = jumpUrl.concat(`${key}token=${this.token}&openid=${this.openid}`)
					this.$token(() => {
						let key = jumpUrl.indexOf('?') > -1 ? '&' : '?'
						this.jumpUrl = jumpUrl.concat(`${key}token=${this.token}&openid=${this.openid}`)
					}); //检测page是否授权，token是否过期
				}
			},

			/**
			 * 经纬度
			 */
			loadIsGps(jumpUrl, isGps) {
				if (isGps) {
					let key = jumpUrl.indexOf('?') > -1 ? '&' : '?'
					this.jumpUrl = jumpUrl.concat(`${key}lat=${this.latitude}&lng=${this.longitude}`)
				}
			},

			/**
			 * verson
			 */
			loadVerson(jumpUrl, verson) {
				if (verson) {
					let key = this.jumpUrl.indexOf('?') > -1 ? '&' : '?'
					this.jumpUrl = this.jumpUrl.concat(`${key}miniversion=${config.miniversion}&minicode=${config.hash}`)
				}
			},

			handleMessage(e) {
				let data = e.mp.detail.data;
				if (Object.keys(data).length <= 0) {
					return;
				}
				let params = data[data.length - 1];
				let event = params.event || ''
				switch (event) {
					case 'tradePay': //发起支付
						this.onTradePay(params);
						break
					case 'test':
						console.log('event', event)
						break
				}
			},
			/**
			 * H5 发起支付
			 * @param {Object} params
			 */
			onTradePay(params) {
				let {
					timeStamp,
					signType,
					nonceStr,
					paySign,
					package: wxpackage,
					sucessUrl,
					failUrl,
				} = params;
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
								url: sucessUrl,
							});
						},
						fail: (res) => {
							if (failUrl) {
								uni.redirectTo({
									url: failUrl,
								});
								return;
							}
							uni.showToast({
								title: "支付失败",
								icon: "none"
							});

						},
					});
				} catch (error) {
					console.log(error);
				}
			},

			/**
			 * webview分享path 处理
			 */
			webviewShare(options) {
				let host = "";
				let path = "";
				let type = 1;//0小程序 1H5
				for (let i = 0; i < options.webViewUrl.length; i++) {
					if (options.webViewUrl[i] == '?') {
						break;
					} else {
						host += options.webViewUrl[i];
					}
				}
				
				// 条件判断对接H5业务
				let BASE_URL = "";
				if (config.fix !== '') {
				    BASE_URL = "-" + config.fix;
				}
				if (host.indexOf(`https://store${BASE_URL}.etcchebao.com`) > -1) {
					//商城
					host = `https://store${BASE_URL}.etcchebao.com/#/home`;
				} else if (host.indexOf(`https://cp${BASE_URL}.etcchebao.com`) > -1) {
					// 资讯
					host = this.webviewShareCallBack(options, host);
				} else if (host.indexOf(`https://user${BASE_URL}.etcchebao.com/lbsoil/`) > -1) {
					// 加油
					if (host.indexOf(`https://user${BASE_URL}.etcchebao.com/lbsoil/confirm.html`) > -1) {
						host = `https://user${BASE_URL}.etcchebao.com/lbsoil/refuel-list.html`
					} else {
						host = this.webviewShareCallBack(options, host);
					}
				} else if (host.indexOf(`https://chewu${BASE_URL}.etcchebao.com/vip/dist`) > -1) {
					// 会员卡
					host = `https://chewu${BASE_URL}.etcchebao.com/vip/dist/#/index`;
				} else {
					type = 0;
				}
				
				// 拼接path
				if (type == 1) {
					path = `/pages/login/main?from_type=2&share_id=${this.share_id}&h5_url=${encodeURIComponent(host)}`;
				} else {
					path = `/pages/home/main?from_type=2&share_id=${this.$store.state.user.info.userid}`;
				}
				
				app.log({ 
					host: host,
					path: path
				})
				return path
			},
			webviewShareCallBack(options, host) {
				let parameter = "";
				app.log({
					"options.webViewUrl": options.webViewUrl,
					host: host
				})
				parameter = miniapp.getRequest(options.webViewUrl.substring(host.length,options.webViewUrl.length));
				for (let key in parameter) {
					if (key != "fuel_no" && key != "miniversion" && key != "minicode" && key != "token" && key != "openid" && key != "lat" && key != "lng" && key != "lng") {
						if (host.indexOf("?") > -1) {
							host += `&${key}=${parameter[key]}`
						} else {
							host += `?${key}=${parameter[key]}`
						}
					}
				}
				app.log({
					parameter: parameter,
					host: host
				})
				return host;
			}
		},
		/**
		 * 分享好友/群
		 */
		onShareAppMessage(options) {
			return {
				title: '欢迎您使用粤通卡ETC车宝官方小程序',
				//imageUrl: 'https://image.etcchebao.com/etc-min/share_icon.png',
				path: this.webviewShare(options)
			}
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(options) {
			return {
				title: '欢迎您使用粤通卡ETC车宝官方小程序',
				//imageUrl: 'https://image.etcchebao.com/etc-min/share_icon.png',
				path: this.webviewShare(options)
			}
		},
	};
</script>
<style lang="scss">
	.container {
		font-size: 26rpx;
	}
</style>