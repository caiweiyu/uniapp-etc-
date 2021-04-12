/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 10:56:54
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-29 16:47:37
 */

import request from "@/common/request";
import { G } from "@/common/constant";
/**
 * 获取车牌区域编号
 */
export function getProvinces() {
  return request({
    url: `${G}/m/violation/v1/illegal/provinces`,
    method: "get",
  });
}

export function getUserCardList(data){
  return request({
    url: `${G}/api-unitoll/v3/card-bill/cardList`,
    method: "get",
    data
  });
}

export function getBillInfo(data){
  return request({
    url: `${G}/api-unitoll/v3/card-bill/getBillInfo`,
    method: "post",
    data
  });
}

export function getCardListByUsername(){
  return request({
    url: `${G}/api-unitoll/card/get-card-list-by-username`,
    method: "get"
  });
}

export function getCardByLicense(data){
  return request({
    url: `${G}/api-unitoll/v3/bind-car/get-card-by-license`,
    method: "post",
    data
  });
}
export function isBindCard(data){
  return request({
    url: `${G}/api-unitoll/card/isBindCard`,
    method: "post",
    data
  });
}

export function unifiedVerifyCode(data){
  return request({
    url: `${G}/api-unitoll/card/unifiedVerifyCode`,
    method: "post",
    data
  });
}



export function unifiedBindCard(data){
  return request({
    url: `${G}/api-unitoll/v3/bind-car/unified-bind-card`,
    method: "post",
    data
  });
}


export function getUnitollBill(data){
  return request({
    url: `${G}/unitoll-new/unitoll/monthBill2`,
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
export function sendBillCoins(data){
  return request({
    url: `${G}/unitoll-new/unitoll/sendBillCoins`,
    method: "post",
    data
  });
}



