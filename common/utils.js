/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 14:55:51
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 15:39:17
 */
import {
	event
} from "@/interfaces/base";
import conf from '@/config/conf.js'
import store from "@/store/index"
/**
 * 获取js_code
 */
export async function getJsCode() {
	return new Promise((resolve, reject) => {
		wx.login({
			success(res) {
				if (res.code) {
					resolve(res.code);
				} else {
					reject();
				}
			},
		});
	});
}
export function fomatPhone(value) {
	return value && value.replace(/(\d{3})\d+(\d{4})/g, "$1***$2");
}

export function formatCardNum(card_num) {
    return (card_num + "").replace(/(\d{4})(?=\d)/g, "$1 ");
}
/**
 * 事件统计
 */
export function eventMonitor(event_name, event_type, extra = {}) {
	event_type = event_type || 1;
	let {
		platform,
		model,
		screenHeight,
		screenWidth,
		system,
		SDKVersion,
		...other
	} = uni.getSystemInfoSync();
	let pages = getCurrentPages();
	let url = (pages[pages.length - 1]).route;
	let {
		token,
		info,
		from_type
	} = store.state.user;
	let extend = {
		...extra,
		openid: info.openid,
		unionid: info.unionid
	}
	const params = {
		model: model,
		ds: `${screenWidth*2}*${screenHeight*2}`,
		loc: '',
		event_type,
		from_type,
		etcos: platform == 'ios' ? 2 : 1,
		version: conf.version,
		token,
		url,
		event_name,
		ua: `(platform:${platform})(model:${model})(system:${system})(SDKVersion:${SDKVersion})`,
		distinct_id: "unkown",
		nfc_type: "",
		source: 6, //1：安卓，2：ios，3：H5（站内），4：H5（站外）5：后端，6：微信小程序，7：支付宝小程序
		extra: JSON.stringify(extend)
	}
	event(params)
		.then(data => {
			console.log("事件监控-请求成功", event_name);
		})
		.catch(() => {
			console.error("事件监控-请求失败", event_name);
		});
}
