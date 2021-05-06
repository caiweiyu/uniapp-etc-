<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-09 14:59:31
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 15:58:36
       open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
-->
<template>
	<block v-if="!token">
		<button :class="type == 'local' ? 'auth-btn-local' : 'auth-btn-global'" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
		 @click="onGetPhoneNumber">
			获取手机号(透明度为0)
		</button>
	</block>
</template>
<script>
	import {
		getAuthPhone
	} from "@/interfaces/index";
	import {
		mapState
	} from "vuex";
	export default {
		props: {
			type: {
				type: String,
				default: "global",
			},
		},
		data() {
			return {};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				jsCode: (state) => state.user.jsCode,
				from_type: (state) => state.user.from_type,
				share_id: (state) => state.user.share_id,
			}),
		},
		mounted() {
			let {
				from_type = 2, share_id = 0
			} = this.$root.$mp.query;
			if (Number(from_type) > 0) {
				this.$store.commit("user/setFromType", Number(from_type));
			}
			if (Number(share_id) > 0) {
				this.$store.commit("user/setShareId", Number(share_id));
			}
			//每次刷新拿到最新jscode
			if (!this.token) {
				this.$store.dispatch("user/refreshJsCode");
			}
		},
		methods: {
			onGetPhoneNumber() {
				this.$store.dispatch("user/refreshJsCode");
			},
			async getPhoneNumber(e) {
				let {
					iv,
					encryptedData,
					errMsg
				} = e.mp.detail;
				if (errMsg === "getPhoneNumber:ok") {
					console.log(
						`iv:${iv}\nencryptedData:${encryptedData}\njsCode:${this.jsCode}`
					);
					uni.showLoading({
						title: "登录中……",
					});
					try {
						let {
							data: {
								token,
								...other
							},
						} = await getAuthPhone({
							iv,
							encryptData: encryptedData,
							jsCode: this.jsCode,
							fromType: this.from_type, //注册渠道 3=粤通卡小程序 2=ETC车宝公众号
							shareId: this.share_id,
						});
						console.log('other', other);
						uni.hideLoading();
						this.$store.commit("user/setUserInfo", other);
						this.$store.commit("user/setToken", token);
						this.$emit("success");
					} catch (error) {
						console.error(error);
						uni.hideLoading();
					}
				} else {
					this.$store.dispatch("user/refreshJsCode");
					console.log("获取手机号失败", errMsg);
					this.$emit("fail");
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.auth-btn-global {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 9998;
		top: 0;
		opacity: 0;
	}

	.auth-btn-local {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 9998;
		top: 0;
		left: 0;
		opacity: 0;
	}
</style>
