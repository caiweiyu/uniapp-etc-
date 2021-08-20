/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 10:56:54
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-29 16:47:37
 */

import request from "@/common/request";
import {
	G
} from "@/common/constant";

/**
 * 获取车牌区域编号
 */
export function getProvinces() {
	return request({
		url: `${G}/m/violation/v1/illegal/provinces`,
		method: "get",
	});
}

export function getUserCardList(data) {
	return request({
		url: `${G}/api-unitoll/v3/card-bill/cardList`,
		method: "get",
		data
	});
}

export function getBillInfo(data) {
	return request({
		url: `${G}/api-unitoll/v3/card-bill/getBillInfo`,
		method: "post",
		data
	});
}

export function getCardListByUsername(data) {
	return uni.request({
		url: `${G}/api-unitoll/card/get-card-list-by-username`,
		// url: `https://g-test.etcchebao.com/api-unitoll/card/get-card-list-by-username`,
		method: "get",
		data
	});
}

export function getCardByLicense(data) {
	return request({
		url: `${G}/api-unitoll/v3/bind-car/get-card-by-license`,
		method: "post",
		data
	});
}
export function isBindCard(data) {
	return request({
		url: `${G}/api-unitoll/card/isBindCard`,
		method: "post",
		data
	});
}

export function unifiedVerifyCode(data) {
	return request({
		url: `${G}/api-unitoll/card/unifiedVerifyCode`,
		method: "post",
		data
	});
}



export function unifiedBindCard(data) {
	return request({
		url: `${G}/api-unitoll/v3/bind-car/unified-bind-card`,
		method: "post",
		data
	});
}


export function getUnitollBill(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/monthBill`,
		method: "post",
		data
	});
}
/**
 *领取金币
 *
 * @export
 * @param {*} data
 * @returns
 */
export function sendBillCoins(data) {
	return request({
		url: `${G}/unitoll-new/unitoll/sendBillCoins`,
		method: "post",
		data
	});
}

/**
 * 粤通卡列表
 * https://api-unitoll-test.etcchebao.com/card/cardList
 */
export function ytk_list(data) {
	return request({
		url: `${G}/api-unitoll/card/cardList`,
		method: "get",
		data
	});
}

/**
 * 粤通卡默认选项
 */
export function ytk_default(data) {
	return request({
		url: `${G}/api-unitoll/v3/unitoll-data/changeCCardByToken`,
		// header: {
		// 	"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		// },
		method: "post",
		data
	});
}

/**
 * 粤通卡充值金额列表
 */
export function ytk_pay_gold(data) {
	return request({
		url: `${G}/mini-program/v1/ytc-recharge/rechargeV2`,
		method: "get",
		data
	})
}

/**
 * 粤通卡充值满减说明
 */
export function ytk_pay_full_minus_tip(data) {
	return request({
		url: `${G}/mini-program/v1/ytc-recharge/ReduceCode`,
		method: "get",
		data
	})
}

/**
 * 粤通卡充值满减金额获取
 */
export function ytk_pay_full_minus_get(data) {
	return request({
		url: `${G}/mini-program/v1/ytc-recharge/ReduceAmount`,
		method: "get",
		data
	})
}

/**
 * 粤通卡充值引导文，文案配置接口
 */
export function ytk_pay_list(data) {
	return request({
		url: `${G}/mini-program/v1/ytc-recharge/navStep`,
		method: "get",
		data
	});
}

/**
 * 判断金额档位是否有卡卷可使用
 * https://api-coupon-test.etcchebao.com/coupon/getCouponList
 */
export function ytk_pay_select(data) {
	return request({
		url: `${G}/api-coupon/coupon/getCouponList`,
		method: "get",
		data
	});
}

/**
 * 订单详情
 * https://g-test.etcchebao.com/m/usercenter/order/orderDetail
 */
export function ytk_pay_order_detail(data) {
	return request({
		url: `${G}/m/usercenter/order/orderDetail`,
		method: "get",
		data
	});
}

/**
 * 退款原因&&金额
 * https://api-unitoll-test.etcchebao.com/pay/get-refund-reason
 */
export function ytk_pay_order_refund(data) {
	return request({
		url: `${G}/api-unitoll/pay/get-refund-reason`,
		method: "get",
		data
	});
}

/**
 * 提交退款申请
 * https://api-unitoll-test.etcchebao.com/pay/submit-refund-reason
 */
export function ytk_pay_order_refund_commit(data) {
	return request({
		url: `${G}/api-unitoll/pay/submit-refund-reason`,
		method: "get",
		data
	});
}

/**
 * 退款进度
 * https://api-order-test.etcchebao.com/etc-order/refund-schedule
 */
export function ytk_pay_order_process(data) {
	return request({
		url: `${G}/api-order/etc-order/refund-schedule`,
		method: "get",
		data
	});
}

/**
 * 订单异常处理
 * https://api-unitoll.etcchebao.com/card/isAllowLoad 
 */
export function ytk_pay_order_error(data) {
	return request({
		url: `${G}/api-unitoll/card/isAllowLoad`,
		method: "get",
		data
	});
}
