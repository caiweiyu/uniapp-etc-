/*
 * @Description: 接口
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-06-03 17:02
 * @LastEditors: caiweiyu
 * @LastEditTime: 2021-06-03 17:02
 */

import request from "@/common/request";

import { G } from "@/common/constant";

import {gateway}  from "@/common/constant";

//获取订单状态
export function getOrderStatus(data) {
	return request({
		url: `${G}/api-order/etc-order/orderStatus`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

//获取订单类型
export function getOrderType(data) {
	return request({
		url: `${G}/api-order/etc-order/orderType`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

//获取顶部广告栏相关数据
export function getTopBanner(data) {
	return request({
		url: `${G}/api-order/etc-order/topBanner`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

//获取订单列表相关
export function getOrderList(data) {
	return request({
		url: `${gateway}/v34/merge/orderlist`,
		method: "post",
		data
	});
}

//获取我的服务相关
export function myservice(data) {
	return request({
		url: `${G}/mini-program/v1/member/my-service`,
		method: "post",
		data
	});
}

//获取订单信息
export function getOrderInfo(data) {
	return request({
		url: `${G}/usercenter/mr/getOrderInfo`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}
//获取
// export function integrallData(data) {
// 	return request({
// 		url: `${G}/usercenter/mr/integrallData`,
// 		header: {
// 			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
// 		},
// 		method: "post",
// 		data
// 	});
// }
//获取会员专区运营位配置接口
export function memberpersonal(data) {
	return request({
		url: `${G}/mini-program/v1/member/personal`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "get",
		data
	});
}

//获取金币
export function userTotalCoin(data) {
	return request({
		url: `${G}/usercenter/coin/userTotalCoin`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}
//获取我的卡券积分模块
export function integrallData(data) {
	return request({
		url: `${G}/usercenter/mr/integrallData`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}
//获取会员
export function getUserInfo(data) {
	return request({
		url: `${G}/usercenter/mr/getUserInfo`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}
//卡券中心
export function getCouponList(data) {
	return request({
		url: `${G}/api-coupon/coupon/getCouponList`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}
