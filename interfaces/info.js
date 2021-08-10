/*
 * @Description: 接口
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-06-03 17:02
 * @LastEditors: caiweiyu
 * @LastEditTime: 2021-06-03 17:02
 */

import request from "@/common/request";


import {G}  from "@/common/constant";

//获取资讯音频配置
export function videoConfig(data) {
	return request({
		url: `${G}/fm-new/fm/videoConfig`,
		header: {
			"content-type": "application/x-www-form-urlencoded", //formdata 数据传输
		},
		method: "post",
		data
	});
}

//获取资讯分类列表
export function articleList(data) {
	return request({
		url: `${G}/fm-new/fm/articleList`,
		method: "get",
		data
	});
}

//获取播放配置
export function playConfig(data) {
	return request({
		url: `${G}/fm-new/fm/playConfig`,
		method: "get",
		data
	});
}

//获取banner图配置
export function bannerList(data) {
	return request({
		url: `${G}/fm-new/fm/bannerList`,
		method: "get",
		data
	});
}

//获取tab栏信息
export function tabList(data) {
	return request({
		url: `${G}/fm-new/fm/tabList`,
		method: "get",
		data
	});
}

//获取文章详情
export function articleDetail(data) {
	return request({
		url: `${G}/fm-new/fm/articleDetail`,
		method: "post",
		data
	});
}

/*获取外部视频链接(汽车之家,蜂槽)
	params:
		contentfrom = 1 汽车之家,
		contentfrom=2 蜂槽
 	author:caiweiyu
*/
export function dataList(data) {
	return request({
		url: `${G}/fm-new/fm/autohome/dataList`,
		method: "post",
		data
	});
}

/*
 自己的视频链接
*/
export function tabVideoList(data) {
	return request({
		url: `${G}/fm-new/fm/tabVideoList`,
		method: "post",
		data
	});
}

/*
&videoId=11410
&artistId=0
&source=0
&page=1
*/
//获取视频资讯详情
export function videoList(data) {
	return request({
		url: `${G}/fm-new/fm/videoList`,
		method: "post",
		data
	});
}

//文章点击数
export function articleClick(data) {
	return request({
		url: `${G}/fm-new/fm/articleClick`,
		method: "post",
		data
	});
}

/**
 * 点击点赞
 */
 export function focusLikeClick(data) {
	return request({
		url: `${G}/fm-new/fm/like`,
		method: "post",
		data
	});
}

/**
 * 提交评论
 */
 export function formaddComment(data) {
	return request({
		url: `${G}/fm-new/fm/addComment`,
		method: "post",
		data
	});
}
