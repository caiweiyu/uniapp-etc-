/*
 * @Description: 
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-09-14 15:14:15
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 16:56:16
 */
import request from "@/common/request";

import { G } from "@/common/constant";

/**
 * 获取月消费账单
 * @param {*} data 
 * @returns 
 */
export function getMonthBill2(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/monthBill2`,
		method: "post",
		data
	});
}

/**
 * 获取总月账单
 * @param {*} data 
 * @returns 
 */
export function getsumMonthBill(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/sumMonthBill`,
		method: "post",
		data
	});
}

/**
 * 获取卡片列表
 * @param {*} data 
 * @returns 
 */
export function getCardList(data) {
	return request({
		url: `${G}/api-unitoll/v3/card-bill/cardList`,
		method: "post",
		data
	});
}

/**
 * 获取账单相关信息
 * @param {*} data 
 * @returns 
 */
export function getbillInfoByApp(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/billInfoByApp`,
		method: "post",
		data
	});
}

/**
 * 获取近半年周列表
 * @param {*} data 
 * @returns 
 */
export function getstatisWeekData(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/statisWeekData`,
		method: "post",
		data
	});
}

/**
 * 获取一周账单金币
 * @param {*} data 
 * @returns 
 */
export function sendWeekBillCoins(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/sendWeekBillCoins`,
		method: "post",
		data
	});
}

/**
 * 获取用户等级
 * @param {*} data 
 * @returns 
 */
export function getUserLevel(data) {
	return request({
		url: `${G}/api-card/vipcard/vip/get-user-level`,
		method: "post",
		data
	});
}