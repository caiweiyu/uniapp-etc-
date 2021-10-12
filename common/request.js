/*
 * @Description: http request  请求封装
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:17:21
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 19:34:13
 * @test phone 18520575938
 */

import useIntercept from "./intercept";
import store from "@/store/index";
import conf from '@/config/conf.js'
import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()

function showError(message, show = true) {
	show &&
		uni.showToast({
			title: message || "请求异常",
			icon: "none",
		});
}

/**
 * 拦截器
 */
const interceptRequest = useIntercept(uni.request, {
	config(params) {
		// console.log("=====发送请求=====", params);
		// uni.showLoading({
		//   title: "请求中",
		// });

		if (params.url.indexOf("/api-unitoll/v3/load/prepaid") > -1) {
			//params.url = params.url.replace("-test",""); //测试
			return params;
		}

		let token = store.state.user.token;
		// console.log(token)
		if (token) {
			params.data["token"] = token;
		}
		if (params.url.indexOf("/mini-program/v1") > -1) {
			params.data["hash"] = conf.hash;
			params.data["miniversion"] = conf.miniversion;
            params.data["version"] = conf.version;
			params.data["etcos"] = miniapp.loadModel();
			params.data["latitude"] = store.state.user.latitude
			params.data["longitude"] = store.state.user.longitude
			//测试多token
			if (params.url.indexOf("/mini-program/v1/wechat/authPhone") > -1 || params.url.indexOf("/mini-program/v1/wechat/authLogin") > -1) {
				params.data["token"] = "";
			}

		} else {
			params.data["isWifi"] = conf.isWifi;
			params.data["distinct_id"] = conf.distinct_id;
			params.data["appMarketChannel"] = conf.appMarketChannel;
			params.data["network_type"] = conf.network_type;
			params.data["version"] = conf.version;
			params.data["etcos"] = 2;//miniapp.loadModel();
			params.data["token"] = '98e57f6474b5a75313fec3ded7ae532f';//"0c2b5b9a41ed93bc637acadacaba5127" //正式token
			// params.url = params.url.replace("-test","");
		}
		params.data["from_type"] = store.state.user.from_type
		params.data["app_type"] = conf.app_type;
		return params;
	},
	success: (res) => {
		// console.log("=====返回结果=====", res);
		// uni.hideLoading();
		if ((res.statusCode == 200 && (res.data.code == 0 || res.data.code == 4000)) || res.data.code == 70 || res.data.code == 51 || res.data.code == 61) {
			return res.data;
		}else {
			if (res.data.code == -10001 || res.data.code == -1 || res.data.code == 23) return false; //token过期不弹提示
			showError(res.data.msg);
			return false;
		}
	},
	fail: (e) => {
		console.log(e);
		// uni.hideLoading();
		return e;
	},
});

const request = ({
	url = "",
	method = "get",
	data = {},
	header = {
		"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
	},
}) => {
	return new Promise((resolve, reject) => {
		interceptRequest({
			url,
			method,
			data,
			header,
			success(res) {
				resolve(res);
			},
			fail(res) {
				console.log("fail", res);
				reject(res);
			},
		});
	});
};

export default request;
