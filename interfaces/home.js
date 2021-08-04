/*
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-03-10 15:14:15
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-03-10 16:56:16
 */
import request from "@/common/request";
import { G } from "@/common/constant";
/**
 * 获取业务h5_url地址
 */
export function axios_h5_url(data) {
	return request({
		url: `${G}/mini-program/v1/wx-applets/h5Url`,
		method: "GET",
		data
	});
}

/**
 * 城市编码
 */
export function axios_city_code(data) {
	return request({
		url: `${G}/api-mall/mine/location`,
		method: "get",
		data
	});
}

/**
 * 获取分享配置接口
 */
export function axios_share(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/share`,
		method: "get",
		data
	});
}

/**
 * 获取顶部引导配置接口
 */
export function axios_top_guide(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/top-guide`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "get",
		data
	});
}

/**
 * 获取四大金刚配置接口
 */
export function axios_nav_four(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/nav-four`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "post",
		data
	});
}

/**
 * 获取推荐服务配置接口
 */
export function axios_nav_recormmend(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/nav-recommend`,
		method: "get",
		data
	});
}

/**
 * 获取banner配置接口
 */
export function axios_banner(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/banner`,
		method: "get",
		data
	});
}

/**
 * 获取会员专区运营位配置接口
 */
export function axios_personal(data) {
	return request({
		url: `${G}/mini-program/v1/member/personal`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "post",
		data
	});
}

/**
 * 获取粤通卡数据接口
 */
export function axios_etc(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/etc`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "get",
		data
	});
}

/**
 * 获取车卡数据接口
 */
export function axios_carc(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/carc`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "get",
		data
	});
}

/**
 * 获取会员卡数据接口
 */
export function axios_memberc(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/memberc`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "get",
		data
	});
}

/**
 * 天气预报
 * https://api-home.etcchebao.com/weather/homeWeather
 */
export function axios_weather(data) {
	return request({
		url: `${G}/api-home/weather/homeWeather`,
		method: "post",
		data
	});
}

/**
 * 粤通卡账单
 */
export function axios_ytk_bill(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/monthBill2`,
		method: "post",
		data
	});
}

/**
 * 全局弹窗
 * /mini-program/v1/home-index/popUp
 */
export function axios_global_popup(data) {
	return request({
		url: `${G}/mini-program/v1/home-index/popUp`,
		method: "get",
		data
	});
}

/**
 * 是否签到（签到状态）
 * /mini-program/v1/coin/isSignin
 */
export function axios_sign(data) {
	return request({
		url: `${G}/mini-program/v1/coin/isSignin`,
		method: "get",
		data
	});
}
