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
 * 中石化首页
 * https://api-fuel.etcchebao.com/zsh-coupon/index
 */
export function axios_index(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/index`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "get",
		data
	});
}

/**
 * 使用教程
 * https://api-fuel.etcchebao.com/zsh-coupon/use-help 
 */
export function axios_user_help(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/use-help`,
		method: "get",
		data
	});
}

/**
 * 油站列表
 * https://api-fuel.etcchebao.com/zsh-coupon/station  
 */
export function axios_station(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/station`,
		method: "get",
		data
	});
}

/**
 * 中石化油站地区
 * https://api-fuel.etcchebao.com/zsh-coupon/station-area  
 */
export function axios_station_area(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/station-area`,
		method: "get",
		data
	});
}

/**
 * 保存手动输入手机号
 * https://api-fuel.etcchebao.com/zsh-coupon/save-phone  
 */
export function axios_save_phone(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/save-phone`,
		method: "get",
		data
	});
}

/**
 * 清空手机记录
 * https://api-fuel.etcchebao.com/zsh-coupon/clear-phone  
 */
export function axios_clear_phone(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/clear-phone`,
		method: "get",
		data
	});
}

/**
 * 获取手机记录
 * https://api-fuel.etcchebao.com/zsh-coupon/get-phone-list
 */
export function axios_get_phone_list(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/get-phone-list`,
		method: "get",
		data
	});
}

/**
 * 中石化电子券下单
 * https://api-fuel.etcchebao.com/zsh-coupon/coupon-order  
 */
export function axios_coupon_order(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/coupon-order`,
		method: "get",
		data
	});
}

/**
 * 优惠券列表
 * https://api-fuel.etcchebao.com/zsh-coupon/get-etc-coupon
 */
export function axios_get_etc_coupon(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/get-etc-coupon`,
		method: "get",
		data
	});
}

/**
 * 电子券列表
 * https://api-fuel.etcchebao.com/zsh-coupon/coupon-list 
 */
export function axios_coupon_list(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/coupon-list`,
		method: "get",
		data
	});
}

/**
 * 中石化电子券订单详情
 * https://api-fuel.etcchebao.com/zsh-coupon/order-detail  
 */
export function axios_order_detail(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/order-detail`,
		method: "get",
		data
	});
}

/**
 * 中石化电子券领取优惠券
 * https://api-fuel.etcchebao.com/zsh-coupon/get-coupon
 */
export function axios_get_coupon(data) {
	return request({
		url: `${G}/api-fuel/zsh-coupon/get-coupon`,
		method: "get",
		data
	});
}