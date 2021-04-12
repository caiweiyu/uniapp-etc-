<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			if (!wx.cloud) {
				console.error('请使用 2.2.3 或以上的基础库以使用云能力')
			} else {
				wx.cloud.init()
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			test: ''
		},
		mounted() {
			//app 启动检查token 是否过期
			console.log("app 启动检查token 是否过期");
			this.$store.dispatch("user/checkToken");
		},
	}
</script>

<style>
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	/*    @import './assets/scss/common.scss'; */
</style>
