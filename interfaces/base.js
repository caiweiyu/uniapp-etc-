/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-09 14:05:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 14:13:16
 */

import request from "@/common/request";
import {G} from "@/common/constant";
import conf from '@/config/conf.js'

/**
 * 获取选项卡接口
 */
export function getTabList(data) {
	data.hash = conf.hash;
	data.version = conf.version;
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
	data.hash = conf.hash;
	data.version = conf.version;
	return request({
		url: `${G}/mini-program/v1/wx-applets/getOperaList`,
		method: "get",
		data
	});
}

//获取渠道展示
export function getChannelList(data) {
	data.hash = conf.hash;
	data.version = conf.version;
	return request({
		url: `${G}/mini-program/v1/wx-applets/getChannelList`,
		method: "get",
		data
	});
}

/**
 * 预支付接口
 * @param data
 */
export function apiRepaid(data) {
	return request({
		url: `${G}/pay/trade/repaid`,
		method: "GET",
		data,
	});
}
