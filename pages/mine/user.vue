<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-04 17:34:17
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 16:09:12
-->
<template>
	<div class="logout">
		<span></span>
		<div class="cell">
			<div class="title">账号</div>
			<div class="value">{{ fomat_phone }}</div>
		</div>
		<div class="cell">
			<div class="exit" @click="toLogout">退出账号</div>
		</div>
		<image class="bottom-logo" src="https://image.etcchebao.com/etc-min/icon-logo.png?v=0.01" />
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import {
		fomatPhone
	} from "@/common/utils";
	// import eventBus from "@/common/eventBus"

	export default {
		computed: {
			...mapState({
				phone: (state) => state.user.info.phone,
				token: (state) => state.user.token,
			}),
			fomat_phone() {
				return fomatPhone(this.phone);
			},
		},
		mounted() {
			console.log(this.$root);

		},

		methods: {
			// goback() {
			// 	wx.navigateBack({
			// 		delta: 1, // 回退前 delta(默认为1) 页面
			// 		success: (res) => {
			// 			eventBus.emit("receviceMine", {
			// 				a: 1
			// 			})
			// 		}
			// 	});
			// },
			toLogout() {
				uni.showModal({
					title: "提示",
					content: "确定要退出登录吗",
					success: (res) => {
						if (res.confirm) {
							this.$store.commit("user/setToken", "");
							this.$store.commit("user/setAuthUserInfo", {
								openid: "",
								unionid: "",
								nickname: "点击同步微信头像",
								// avatar: "https://image.etcchebao.com/etc-min/icon-default-avatar.png",
								avatar:"https://image.etcchebao.com/etc-min/mine/undifine-user-logo.png"
							});
							this.$store.dispatch("user/refreshJsCode");
							this.$store.commit("home/mt_new_bill_all_cardusenum", "");
							wx.navigateBack({
								delta: 1, // 回退前 delta(默认为1) 页面
							});
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.logout {
		height: 100vh;
		background: #f9f9f9;
		overflow: hidden;

		.cell {
			background: #fff;
			box-sizing: border-box;
			padding: 36rpx 30rpx;
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			color: #222;
			margin-top: 20rpx;

			.title {
				font-weight: bold;
			}

			.value {
				font-weight: normal;
			}

			.exit {
				flex: 1;
				text-align: center;
			}
		}
	}
</style>
