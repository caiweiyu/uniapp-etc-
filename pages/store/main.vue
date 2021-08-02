<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2020-07-28 10:27:17
-->
<template>
	<view class="content">
		<block v-if="token">
			<web-view :src="url" @message="(e) => handleMessage(e)"></web-view>
		</block>
		<block v-else>
			<button-getPhoneNumber type="local" url="/pages/home/main" come="store" ref="getphone"></button-getPhoneNumber>
		</block>
	</view>
</template>

<script>
	import { store } from "@/common/constant"
	import { mapState } from "vuex"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				openid: (state) => state.user.info.openid,
				latitude: (state) => state.user.latitude,
				longitude: (state) => state.user.longitude,
			})
		},
		data() {
			return {
				url: store+'/#/home'
			}
		},
		mounted() {
			// uni.hideTabBar({})
		},
		onLoad() {
			let key = this.url.indexOf('?') > -1 ? '&' : '?'
			this.url = this.url.concat(`${key}token=${this.token}&openid=${this.openid}&lat=${this.latitude}&lng=${this.longitude}`)
			console.log('this.url: ',this.url)
		},
		onShow() {
			this.$token(() => {
				
			});//检测page是否授权，token是否过期
		},
		methods: {
			handleMessage(e) {
				let data = e.mp.detail.data;
				console.log('data',data)
				if (Object.keys(data).length <= 0) {
					return;
				}
				//let {event,params} = data[data.length - 1];
				let params = data[data.length - 1];
				let event = params.event || ''
				switch (event) {
					case 'tradePay': //发起支付
		                this.onTradePay(params);
		                break
		            case 'test':
		                console.log('event',event)
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
			}
		},
	}
</script>

<style>
</style>
