/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-10 15:14:15
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 16:56:16
 */
import request from "@/common/request";
import { G } from "@/common/constant";

/**
 * 删除车辆
 */
export function axios_delcar(data) {
	return request({
		url: `${G}/api-unitoll/v3/bind-car/remove-my-car`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

/**
 * 车架号发动机号信息匹配
 */
export function axios_carplateinfo(data) {
	return request({
		url: `${G}/peccancy/home/CarPlateInfo`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

/**
 * 获取车辆信息
 */
export function axios_getcarinfo(data) {
	return request({
		url: `${G}/api-unitoll/v3/bind-car/get-car-detail`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

/**
 * 获取车牌信息列表
 */
export function axios_getprovicelist(data) {
	return request({
		url: `${G}/m/violation/v1/illegal/provinces`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

/**
 * 车牌校验规格
 */
export function axios_getcarrule(data) {
	return request({
		url: `${G}/peccancy/query/queryRule`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

/**
 * 添加车辆
 */
export function axios_savecar(data) {
	return request({
		url: `${G}/m/violation/v1/illegal/query`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

/**
 * 车辆类型
 */
export function axios_vehicle_type(data) {
	return request({
		url: `${G}/m/app/getCarList`,
		method: "get",
		data
	});
}

/**
 * 车辆列表
 */
export function axios_car_list(data) {
	return request({
		url: `${G}/api-unitoll/v3/bind-car/get-car-list`,
		method: "get",
		data
	});
}