/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 14:55:51
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 15:39:17
 */

/**
 * 获取js_code
 */
export async function getJsCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject();
        }
      },
    });
  });
}
export function fomatPhone(value) {
  return value && value.replace(/(\d{3})\d+(\d{4})/g, "$1***$2");
}
