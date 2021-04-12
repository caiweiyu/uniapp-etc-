/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-23 10:58:10
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-23 11:11:49
 */
const cloud = require("wx-server-sdk")
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return event.userInfo //返回用户信息
}
