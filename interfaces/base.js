/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-09 14:05:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 14:13:16
 */

import request from "@/common/request";
import {
	G
} from "@/common/constant";

/**
 * 获取选项卡接口
 */
export function getTabList(data) {
	return request({
		url: `${G}/mini-program/v1/wx-applets/getTabList`,
		method: "get",
		data
	});
}

/**
 * 获取运营位接口
 */
export function getOperaList(data) {
	return request({
		url: `${G}/mini-program/v1/wx-applets/getOperaList`,
		method: "get",
		data
	});
}

//获取渠道展示
export function getChannelList(data) {

	return request({
		url: `${G}/mini-program/v1/wx-applets/getChannelList`,
		method: "get",
		data
	});
}

/**
 * 微信支付支付链接
 * trade_id
 * trade_platform=1
 * trade_mode=3
 * openid
 * token
 * source_channel
 * sourceChannel
 */
export function apiRepaid(data) {
	return request({
		url: `${G}/pay/trade/repaid`,
		method: "GET",
		data,
	});
}

export function getStrategy() {
	return request({
		url: `${G}/mini-program/v1/wx-applets/strategy`,
		method: "GET"
	});
}

/**
 * 用户其他信息（是否绑卡，是否关注公众号）
 */
export function getOtherInfo() {
	return request({
		url: `${G}/mini-program/v1/wechat/otherInfo`,
		method: "GET"
	});
}



/**
 * 事件统计打点
 */

export function event(data = {}) {
	return uni.request({
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		url: `${G}/api-etclog/v1/listen/event`,
		method: "POST",
		data
	});
}

export function getPayPrompt() {
	return request({
		url: `${G}/mini-program/v1/wx-applets/payPrompt`,
		method: "GET"
	});
}


