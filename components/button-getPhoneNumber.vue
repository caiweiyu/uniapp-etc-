<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-03-09 14:59:31
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-03-10 15:58:36
       open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
-->
<template>
	<block v-if="!token">
		<!-- 首页login -->
		<button v-if="openphone && curDebuond"
			:class="type == 'local' ? 'auth-btn-local' : (type == 'global' ? 'auth-btn-global' : 'auth-btn-static')"
			open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" @click="onGetPhoneNumber">获取手机号(透明度为0)</button>
		<!-- 非首页 -->
		<button v-else
			:class="type == 'local' ? 'auth-btn-local' : (type == 'global' ? 'auth-btn-global' : 'auth-btn-static')"
			@click.stop="bindNav">跳转授权页面come(透明度为0)</button>
	</block>
</template>
<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp();
	
	import { getAuthPhone } from "@/interfaces/index";
	import { mapState } from "vuex";
	export default {
		props: {
			type: {
				type: String,
				default: "global",
			}, //触发范围类型
			url: {
				type: String,
				default: ""
			}, //接收url
			item: {
				type: Object,
				default: {},
			}, //事件对象
			call: {
				type: String,
				default: "component"
			},//调用方式(component || api)
			openphone: {
				type: Boolean,
				default: false,
			}, //按钮事件类型(仅首页为getPhone)
		},
		data() {
			return {
				come: "pages/home/main",//page来源(默认首页),
				curDebuond: true,//禁止连续触发手机号授权button
				avatar:"https://image.etcchebao.com/etc-min/mine/undifine-user-logo.png", //默认头像
			};
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				jsCode: (state) => state.user.jsCode,
				from_type: (state) => state.user.from_type,
				share_id: (state) => state.user.share_id,
				userid: (state) => state.user.info.userid,
			})
		},
		mounted() {
			let {
				from_type = 0,
				share_id = 0,
				come = this.come,
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
			if (come != '') {
				this.come = decodeURIComponent(come);
			}
			if (this.openphone) {
				app.log({
					type: this.type,
					item: this.item,
					url: this.url,
					come: this.come,
					openphone: this.openphone
				})
			}
		},
		methods: {
			onGetPhoneNumber() {
				this.$store.dispatch("user/refreshJsCode");
			},

			/**
			 * 非login来源，跳转login登录页
			 */
			bindNav() {
				let come = this.$root.$mp.page.route;
				let query = this.$root.$mp.query;
				if (Object.keys(query).length > 0) {
					come += '?' + miniapp.formateObjToParamStr(query);
				}
				uni.redirectTo({
					url: `/pages/login/main?url=${this.url}&item=${encodeURIComponent(JSON.stringify(this.item))}&noLocation=${false}&come=${encodeURIComponent(come)}`
				})
			},

			async getPhoneNumber(e) {
				if (this.curDebuond) {
					this.curDebuond = false;
					setTimeout(()=>{
						this.curDebuond = true;
					},1000)
					let {
						iv,
						encryptedData,
						errMsg
					} = e.mp.detail;
					if (errMsg === "getPhoneNumber:ok") {
						console.log(`iv:${iv}\nencryptedData:${encryptedData}\njsCode:${this.jsCode}`);
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
							this.$store.dispatch("user/refreshJsCode");
							this.callback(1);
							let user_info = uni.getStorageSync('user_info')
							if(user_info){
								console.log(user_info,'---000user_info')
								this.$store.commit("user/setNickName", user_info.nickname);
								this.$store.commit("user/setAvatar", user_info.avatar);
							}
						} catch (error) {
							console.error(error);
							uni.hideLoading();
						}
					} else {
						this.$store.dispatch("user/refreshJsCode");
						this.$emit("fail");
						console.log("获取手机号失败", errMsg);
						this.callback(2);
					}
				}
			},

			/**
			 * callback
			 * 登录成功 success
			 * 登录失败 fail
			 */
			callback(num) {
				switch (Number(num)) {
					// 登录成功 success
					case 1:
						// ⇩⇩⇩⇩⇩⇩ H5(优先) ⇩⇩⇩⇩⇩⇩
						if (this.url != "") { //有跳转H5，去跳H5
							uni.reLaunch({
								url: `/pages/webview/main?src=${this.url}`
							})
							return
						}
						// ⇩⇩⇩⇩⇩⇩ 标签组件触发(最后) ⇩⇩⇩⇩⇩⇩
						if (this.item.hasOwnProperty("jump_type") == true || this.item.hasOwnProperty("jump_url") ==
							true || this.item.hasOwnProperty("appid") == true) {//判断item是否有对应字段存在，进行tiao转操作
							this.loadNavigate(this.item);
						} else {//否则无item 按照come来源返回
							this.loadComeSuc();
						}
						break;
						// 登录失败 fail
					case 2:
						// 登录失败直接返回来源页
						this.loadComeFail();
						break;
				}
			},
			
			/**
			 * come 来源路由返回
			 * success
			 * fail
			 */
			loadComeSuc() {
				this.loadNavigate({
					jump_type: 1,
					jump_url: this.come,
					subs_template_id: null
				});
			},
			loadComeFail() {
				if (this.call == "api") {
					this.loadNavigate({
						jump_type: 1,
						jump_url: "/pages/home/main",
						subs_template_id: null
					});
				} else {
					this.loadNavigate({
						jump_type: 1,
						jump_url: this.come,
						subs_template_id: null
					});
				}
			},

			/**
			 * 跳转
			 */
			loadNavigate(item) {
				if (typeof(item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item.subs_template_id);
					miniapp.subscribe(arr, (res) => {
						this.callbackNavigate(item);
					}, (err) => {
						this.callbackNavigate(item);
					})
				} else {
					// 直接跳转
					this.callbackNavigate(item);
				}
			},
			callbackNavigate(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouterLogin(item, (res) => {
					
				}, (err) => {
					this.loadNavigate({
						jump_type: 1,
						jump_url: "/pages/home/main",
						subs_template_id: null
					});
				})
			},

			/**
			 * 系统提示弹窗
			 */
			showToast(msg) {
				uni.showToast({
					title: msg,
					mask: true,
					duration: 1500,
					icon: "none"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.auth-btn-global {
		width: 100vw;
		height: calc(100vh - 100px);
		position: fixed;
		z-index: 9998;
		top: 0;
		opacity: 0;
	}

	.auth-btn-static {
		width: 100vw;
		height: calc(100vh - 50rpx);
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
