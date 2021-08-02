/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-09 15:29:28
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 15:59:28
 */
import {
	apiCheckLogin, getAuthLogin
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
			openid: "",
			phone: "",
			userid: 0,
		},
		auth_info: {
			openid: "",
			unionid: "",
			nickname: "点击同步微信头像",
			// avatar: "https://image.etcchebao.com/etc-min/icon-default-avatar.png",
			avatar:"https://image.etcchebao.com/etc-min/mine/undifine-user-logo.png"
		},
		jsCode: "",
		token: "",
		is_show_guide: true,
		is_show_collection: true,
		is_show_home_notice: true,
		from_type: 2,
		share_id: 0,
		task_option_key: {

		},
		latitude: "23.101494",
		longitude: "113.389287",
		city: "广州",
		city_code: "",//城市编码
	},
	mutations: {
		setUserInfo: (state, info) => {
			state.info = info;
		},
		setAuthUserInfo: (state, info) => {
			state.auth_info = info;
		},
		setNickName: (state, name) => {
			state.auth_info.nickname = name;
		},
		setAvatar: (state, name) => {
			state.auth_info.avatar = name;
		},
		setToken: (state, token) => {
			state.token = token;
		},
		setJscode: (state, code) => {
			state.jsCode = code;
		},
		setIsShowBillGuide: (state, payload) => {
			state.is_show_guide = payload;
		},
		setShareId: (state, value) => {
			state.share_id = value;
		},
		setFromType: (state, value) => {
			state.from_type = value;
		},

		setIsShowCollection: (state, value) => {
			state.is_show_collection = value
		},
		setIsShowHomeNotice: (state, value) => {
			state.is_show_home_notice = value
		},
		setTaskOptionKey: (state, value) => {
			state.task_option_key[value] = true;
		},
		setLocation: (state, {
			latitude,
			longitude
		}) => {
			state.latitude = latitude;
			state.longitude = longitude;
		},
		mt_city: (state, n)=> {
			state.city = n;
		},
		mt_city_code: (state, n)=> {
			state.city_code = n;
		}
	},
	actions: {
		async refreshJsCode({
			state,
			commit
		}) {
			let jsCode = await getJsCode();
			// console.log("刷新jsCode", jsCode)
			commit("setJscode", jsCode);
		},
		async checkToken({
			commit,
			state,
			dispatch
		},payload) {
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
					dispatch("refreshToken",payload);
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
		},payload) {
			let jsCode = await getJsCode();
			let res = await getAuthLogin({
				jsCode,
				username: state.info.phone
			});
			commit("setToken", res.data.token);
			typeof payload == 'function' && payload();
			console.log("已刷新登录");
		},

		async finishTaskGetCoin({
			state,
			commit
		}, payload) {
			//如果已经完成任务不请求
			if (state.task_option_key[payload]) {
				return Promise.resolve();
			}
			let [error, res] = await finishTaskGetCoin({
				userId: state.info.userid,
				from: 1, //0=app;1=小程序;(默认0)
				taskType: 1, //0=交易完成后的任务；1=普通任务,
				optionKey: payload, //任务名称
				token: state.token
			})
			let json = res.data;
			if (json.code == 0) {
				commit("setTaskOptionKey", payload)
				return res;
			} else {
				return Promise.resolve();
			}
		},

		ac_city: (context, obj)=> {
			context.commit("mt_city", obj)
		},
		ac_city_code: (context, obj)=> {
			context.commit("mt_city_code", obj)
		},
	},
};

export default user;
