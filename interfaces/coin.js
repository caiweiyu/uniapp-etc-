/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-10 15:14:15
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 16:56:16
 */
import request from "@/common/request";
import {
	G
} from "@/common/constant";

export function getCoinTask() {
	return request({
		url: `${G}/usercenter/coin/wechat/coinBox`,
		method: "post",
	});
}
export function getCoin(data) {
	return request({
		url: `${G}/usercenter/coin/getTaskCoin`,
		method: "post",
		data
	});
}
export function queryCoinRecord(data) {
	return request({
		url: `${G}/usercenter/coin/queryCoinRecord`,
		method: "post",
		data
	});
}

/**
 * 签到领取金币
 * @param {Object} data
 */
export function querySign(data) {
	return uni.request({
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		url: `${G}/usercenter/coin/sign`,
		method: "post",
		data
	});
}



/**
 * 完成任务领取金币
 */


export function finishTaskGetCoin(data) {
	//这个接口不需要拦截，需要单独做处理
	return uni.request({
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		url: `${G}/usercenter/coin/finishTaskGetCoin2`,
		method: "post",
		data
	});
}
