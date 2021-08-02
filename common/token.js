import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()
import configWhite from "@/config/configWhite"
import store from "@/store/index"

/**
 * 检测page是否授权 => 未授权则跳转路由至登录页
 * payload 为匿名回调函数
 */
function appCheckToken(payload) {
	if (!store.state.user.token) {//未登录授权
		let come = this.$root.$mp.page.route;
		let query = this.$root.$mp.query;
		for (let i = 0; i < configWhite.length; i++) {
			if (come.indexOf(configWhite[i]) > -1) return
		} //授权白名单
		if (Object.keys(query).length > 0) {
			come += '?' + miniapp.formateObjToParamStr(query);
		} //拼接url参数
		uni.redirectTo({
			url: `/pages/login/main?call=${'api'}&noLocation=${false}&come=${encodeURIComponent(come)}`
		}) //token为空跳转到登录页
	} else {//校验token是否过期
		this.$store.dispatch("user/checkToken", payload);
	}
}

export default {
	appCheckToken
}