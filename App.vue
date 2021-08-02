<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	import store from "@/store/index"
	export default {
		onLaunch: function(options) {
			console.log('App Launch');
			this.globalData.options = options;
			if (!wx.cloud) {
				console.error('请使用 2.2.3 或以上的基础库以使用云能力')
			} else {
				wx.cloud.init()
			}
			this.loadGetUpdateManager();
		},
		onShow: function(options) {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			options: '',
			test: '',
			timeStampDay: 86400000
		},
		mounted() {
			//app 启动检查token 是否过期
			console.log("app 启动检查token 是否过期");
			// this.$store.dispatch("user/checkToken");
		},
		methods: {
			/**
			 * console.log
			 * 例：app.log({ a: 1, b: 2, c: 3 })
			 */
			log({
				...other
			}) {
				console.log("⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩")
				console.log("测试log", other)
				console.log("⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧⇧")
			},
			
			/**
			 * 分享
			 */
			shareAppMessage() {
				let router = getCurrentPages()[getCurrentPages().length - 1].route || "";
				if (router) {
					router = `${router}?from_type=2&share_id=${store.state.user.info.userid}`;
				} else {
					router = `/pages/home/main?from_type=2&share_id=${store.state.user.info.userid}`;
				}
				let app_message = {
					title: '欢迎您使用粤通卡ETC车宝官方小程序',
					imageUrl: '',//https://image.etcchebao.com/etc-min/share_icon.png
					path: router
				}
				let num = 0;
				let share_info = store.state.home.share_info || [];
				if (share_info.length > 0) {
					num = miniapp.myRotate(share_info.length, 0); //随机一组列表数据
					app_message.title = share_info[num].title;
					app_message.imageUrl = share_info[num].img_url;
					
					if (share_info[num].path) {
						let key = share_info[num].path.indexOf('?') > -1 ? '&' : '?'
						app_message.path = share_info[num].path.concat(`${key}share_id=${store.state.user.info.userid}`);
					} else {
						app_message.path = router;
					}
					
					if (app_message.path[0] != "/") { //兼容内部url
						app_message.path = "/" + app_message.path;
					}
				}
				this.log({
					app_message: app_message
				})
				return {
					title: app_message.title,
					imageUrl: app_message.imageUrl,
					path: app_message.path
				}
			},
			
			/**
			 * 朋友圈
			 */
			shareTimeline() {
				let router = getCurrentPages()[getCurrentPages().length - 1].route || "";
				if (router) {
					router = `${router}?from_type=2&share_id=${store.state.user.info.userid}`;
				} else {
					router = `/pages/home/main?from_type=2&share_id=${store.state.user.info.userid}`;
				}
				let app_message = {
					title: '欢迎您使用粤通卡ETC车宝官方小程序',
					imageUrl: '',//https://image.etcchebao.com/etc-min/share_icon.png
					path: router
				}
				let num = 0;
				let share_info = store.state.home.share_info || [];
				if (share_info.length > 0) {
					num = miniapp.myRotate(share_info.length, 0); //随机一组列表数据
					app_message.title = share_info[num].title;
					app_message.imageUrl = share_info[num].img_url;
					
					if (share_info[num].path) {
						let key = share_info[num].path.indexOf('?') > -1 ? '&' : '?'
						app_message.path = share_info[num].path.concat(`${key}share_id=${store.state.user.info.userid}`);
					} else {
						app_message.path = router;
					}
					
					if (app_message.path[0] != "/") { //兼容内部url
						app_message.path = "/" + app_message.path;
					}
				}
				this.log({
					app_message: app_message
				})
				return {
					title: app_message.title,
					imageUrl: app_message.imageUrl,
					path: app_message.path
				}
			},

			/**
			 * 小程序更新
			 */
			loadGetUpdateManager() {
				if (wx.canIUse('getUpdateManager')) {
					const updateManager = wx.getUpdateManager()
					updateManager.onCheckForUpdate(function(res) {
						console.log('onCheckForUpdate====', res)
						// 请求完新版本信息的回调
						if (res.hasUpdate) {
							console.log('res.hasUpdate====')
							updateManager.onUpdateReady(function() {
								wx.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用？',
									success: function(res) {
										console.log('success====', res)
										// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
										if (res.confirm) {
											// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
											updateManager.applyUpdate()
										}
									}
								})
							})
							updateManager.onUpdateFailed(function() {
								// 新的版本下载失败
								wx.showModal({
									title: '已经有新版本了哟~',
									content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
								})
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	/*    @import './assets/scss/common.scss'; */
	@import "uview-ui/index.scss";
	::-webkit-scrollbar {
		display: none !important;  /**处理屏蔽全局的滚动样式 */
	}
	/deep/ .u-mode-center-box {
		background: none !important;
	}
	/deep/ .u-drawer-bottom {
		background: none !important;
	}
</style>
