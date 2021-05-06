/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-09 15:29:28
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 15:59:28
 */
import {
	apiCheckLogin,
	getChebaoToken
} from "@/interfaces/index";

import {
	finishTaskGetCoin
} from "@/interfaces/coin";
import {
	getJsCode
} from "@/common/utils";
const user = {
	namespaced: true,
	state: {
		info: {
			headerUrl: "https://image.etcchebao.com/etc-min/icon-default-avatar.png",
			nickName: "未登录",
			openid: "",
			phone: "",
			userid: 0,
		},
		auth_info: {
			openid: "",
			unionid: "",
			nickname: "",
			avatar: "",
		},
		jsCode: "",
		token: "",
		is_show_guide: true,
		is_show_collection: true,
		is_show_home_notice: true,
		from_type: 1,
		share_id: 0,
	},
	mutations: {
		setUserInfo: (state, info) => {
			state.info = info;
		},
		setAuthUserInfo: (state, info) => {
			state.auth_info = info;
		},
		setToken: (state, token) => {
			state.token = token;
		},
		setJscode: (state, code) => {
			state.jsCode = code;
		},
		setIsShowGuide: (state, payload) => {
			state.is_show_guide = payload;
		},
		setShareId: (state, value) => {
			state.share_id = value;
		},
		setFromType: (state, value) => {
			state.from_type = value;
		},
		setShareId: (state, value) => {
			state.share_id = value;
		},

		setIsShowCollection: (state, value) => {
			state.is_show_collection = value
		},
		setIsShowHomeNotice: (state, value) => {
			state.is_show_home_notice = value
		},

	},
	actions: {
		async refreshJsCode({
			state,
			commit
		}) {
			let jsCode = await getJsCode();
			console.log("刷新jsCode", jsCode)
			commit("setJscode", jsCode);
		},
		async checkToken({
			commit,
			state,
			dispatch
		}) {
			const token = state.token;
			//token 存在手机号就一定存在
			if (token) {
				let res = await apiCheckLogin({
					token,
				});
				//如果token 失效
				if (!res.data) {
					//清空现有token
					commit("setToken", "");
					//重新请求token
					dispatch("refreshToken");
				} else {
					console.log("已登录");
				}
			} else {
				console.log("未登录");
			}
		},
		async refreshToken({
			state,
			commit
		}) {
			let jsCode = await getJsCode();
			// let res = await getChebaoToken({
			//   jsCode,
			//   phone: state.info.phone,
			//   type: 1,
			//   fromType: 2,
			// });
			let res = await getAuthLogin({
				jsCode,
				username: state.info.phone
			});
			commit("setToken", res.data.token);
			console.log("已刷新登录");
		},

		async finishTaskGetCoin({
			state,
			commit
		}, payload) {
			let res = await finishTaskGetCoin({
				userId: state.info.userid,
				from: 1, //0=app;1=小程序;(默认0)
				taskType: 1, //0=交易完成后的任务；1=普通任务,
				optionKey: payload, //任务名称
				token: state.token
			})
			
		}
	},
};

export default user;
