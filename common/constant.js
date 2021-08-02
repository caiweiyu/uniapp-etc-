/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2019-05-07 23:11:54
 * @LastEditors: yongqing
 * @LastEditTime: 2021-04-06 15:53:45
 */

import conf from '@/config/conf.js'

let BASE_URL = "";
if (conf.fix !== '') {
    BASE_URL = "-" + conf.fix;
}
export const cp = `https://cp${BASE_URL}.etcchebao.com`;
export const wap = `https://wap${BASE_URL}.etcchebao.com`;
export const chewu = `https://chewu${BASE_URL}.etcchebao.com`;
export const store = `https://store${BASE_URL}.etcchebao.com`;
export const user = `https://user${BASE_URL}.etcchebao.com`;
export const gateway = `https://gateway${BASE_URL}.etcchebao.com`;
export const G = `https://g${BASE_URL}.etcchebao.com`;


export const PLATE_COLOR_LIST = [
    {
        id: "02",
        text: "蓝牌",
    },
    {
        id: "01",
        text: "黄牌",
    },
    {
        id: "06",
        text: "黑牌",
    },
    {
        id: "98",
        text: "白色",
    },
    {
        id: "97",
        text: "蓝白渐变色",
    },
    {
        id: "4",
        text: "渐变绿色",
    },
    {
        id: "5",
        text: "黄绿双拼色",
    },
];
