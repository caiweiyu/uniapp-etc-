/*
 * @Description: 接口
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:21:15
 * @LastEditors: yongqing
 * @LastEditTime: 2021-01-13 11:14:31
 */

import request from "@/common/request";

import {G} from "@/common/constant";


export function getChebaoToken(data) {
  return request({
    url: `${G}/carowner/wechat/getChebaoToken`,
    method: "POST",
    data,
  });
}
/**
 * 获取用户信息（获取基础信息）
 * @param {Object} params
 */
export function getAuthInfo(data) {
  return request({
    url: `${G}/mini-program/v1/wechat/authInfo`,
    method: "POST",
    data,
  });
}
/**
 * 授权登录（获取手机号并登录）
 * @param {Object} params
 */
export function getAuthPhone(data) {
  return request({
    url: `${G}/mini-program/v1/wechat/authPhone`,
    method: "POST",
    data,
  });
}
/**
 * 静默登录（token 过期后可以拿jsCode跟手机号登录,前提是已经授权登陆过）
 * @param {Object} params
 */
export function getAuthLogin(data) {
  return request({
    url: `${G}/mini-program/v1/wechat/authLogin`,
    method: "POST",
    data,
  });
}

export function apiCheckLogin(data) {
  return request({
	url: `${G}/mini-program/v1/wechat/isLogin`,
    method: "GET",
    data,
  });
}
export function wechatAppletBanner() {
  return request({
    url: `${G}/carowner/wechatAppletBanner`,
    method: "get",
  });
}

/**
 * 红包列表
 * @param {Object} params
 */
export function apiCouponData(data) {
  return request({
    url: `${G}/activity/distribution/couponData`,
    method: "GET",
    data,
  });
}

/**
 * 领取红包
 * @param {Object} params
 */
export function apiSendCoupon(data) {
  return request({
    url: `${G}/activity/sendCoupon`,
    method: "POST",
    data,
  });
}

/**
 * 获取抽奖数据
 * @param data
 */
export function apiLotteryData(data) {
  return request({
    url: `${G}/activity/weekly/lotteryData`,
    method: "GET",
    data,
  });
}

/**
 * 抽奖
 * @param data
 */
export function apiLottery(data) {
  return request({
    url: `${G}/activity/weekly/lottery`,
    method: "GET",
    data,
  });
}
