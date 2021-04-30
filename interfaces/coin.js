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
