<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-04-22 17:16:48
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-04-22 20:31:54
-->
<template>
	<block v-if="!auth_info.openid">
		<button :class="type == 'local' ? 'auth-btn-local' : 'auth-btn-global'" @click="$debounce(getUserInfo)">
			获取用户信息(透明度为0)
		</button>
	</block>
</template>
<script>
	import {
		getAuthInfo
	} from "@/interfaces/index";
	import {
		mapState
	} from "vuex";
	import {
		eventMonitor
	} from "@/common/utils"
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
				auth_info: (state) => state.user.auth_info,
				jsCode: (state) => state.user.jsCode,
				from_type: (state) => state.user.from_type,
				share_id: (state) => state.user.share_id,
			}),
		},
		mounted() {
			let {
				from_type = 0, share_id = 0
			} = this.$root.$mp.query;
			from_type = parseInt(from_type)
			share_id = parseInt(share_id)
			if (from_type > 0) {
				this.$store.commit("user/setFromType", from_type);
			}
			if (share_id > 0) {
				this.$store.commit("user/setShareId", share_id);
			}
			//每次刷新拿到最新jscode
			if (!this.auth_info.openid) {
				this.$store.dispatch("user/refreshJsCode");
			}
		},
		methods: {
			getUserInfo() {
				eventMonitor("WD_Avatar_Whole_Other_392_Image_click",2)
				uni.getUserProfile({
					desc: '用于完善会员资料',
					lang: "zh_CN",
					success: async ({
						iv,
						encryptedData,
						errMsg
					}) => {
						if (errMsg === "getUserProfile:ok") {
							uni.showLoading({
								title: "正在初始化",
							});
							let {
								data: {
									...other
								},
							} = await getAuthInfo({
								iv,
								encryptData: encryptedData,
								jsCode: this.jsCode,
								fromType: this.from_type, //注册渠道 3=粤通卡小程序 2=ETC车宝公众号
								shareId: this.share_id,
							});
							console.log('other',other)
							uni.hideLoading();
							this.$store.commit("user/setAuthUserInfo", other);
							this.$emit("success");
							this.$store.dispatch("user/refreshJsCode");
							uni.setStorageSync('user_info', other)
						} else {
							this.$store.dispatch("user/refreshJsCode");
							console.log("获取用户信息失败", errMsg);
							this.$emit("fail");
						}
					}
				})



			},
		},
	};
</script>

<style lang="scss" scoped>
	.auth-btn-global {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 9997;
		top: 0;
		opacity: 0;
	}

	.auth-btn-local {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 9997;
		top: 0;
		left: 0;
		opacity: 0;
	}
</style>
