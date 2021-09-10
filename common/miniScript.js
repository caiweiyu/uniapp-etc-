/*--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-22 11:30:00
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-23 15:58:36
 */
import location from "@/common/location"
import store from "@/store/index"

class miniScript {
	constructor() {
		this.Instance = null;
	}

	/**
	 * 单例
	 */
	static getInstance() {
		if (!this.Instance) {
			this.Instance = new miniScript();
		}
		return this.Instance;
	}

	/***************************************************************/
	/***                                                         ***/
	/***                  uniapp xcx 定制方法                     ***/
	/***                                                         ***/
	/***************************************************************/
	/**
	 * 判断客户端系统
	 * 系统类型 1 android 2 ios
	 */
	loadModel() {
		var model = wx.getSystemInfoSync().system.substring(0, 3).toLowerCase();
		if (model === "ios") {
			return 2;
		} else if (model === "and") {
			return 1;
		} else {
			return 1;
		}
	}

	/**
	 * 消息订阅
	 */
	subscribe(tmplIds = [''], success, fail) {
		uni.requestSubscribeMessage({
			tmplIds: tmplIds,
			success: (res) => {
				typeof success == 'function' && success(res);
			},
			fail: (err) => {
				typeof fail == 'function' && fail(err);
			}
		})
	}

	/**
	 * 小程序跳转策略
	 * 跳转类型
	 * 0:不跳转
	 * 1:内部小程序跳转
	 * 2:外部小程序跳转
	 * 3:h5跳转
	 * 4:page跳转
	 */
	miniProgramRouter(router = {}, success, fail) {
		switch (Number(router.jump_type)) {
			/*跳转内部小程序(inner miniProgram)*/
			case 1:
				if (router.jump_url[0] != "/") { //兼容内部url
					router.jump_url = "/" + router.jump_url;
				}
				// tabBar page 特殊跳转方式
				if (router.jump_url.indexOf("/pages/home/main") > -1 || router.jump_url.indexOf(
					"/pages/bill/main") > -1 || router.jump_url.indexOf("/pages/fm/home/main") > -1 || router
					.jump_url.indexOf("/pages/mine/main") > -1) {
					uni.switchTab({
						url: router.jump_url,
						success: (res) => {
							typeof success == 'function' && success(res);
						},
						fail: (err) => {
							typeof fail == 'function' && fail(err);
						}
					})
				} else {
					uni.navigateTo({
						url: router.jump_url,
						success: (res) => {
							typeof success == 'function' && success(res);
						},
						fail: (err) => {
							typeof fail == 'function' && fail(err);
						}
					})
				}
				break;
			/*跳转外部小程序(outer miniProgram)*/
			case 2:
				uni.navigateToMiniProgram({
					appId: router.appid,
					path: router.jump_url,
					success: (res) => {
						typeof success == 'function' && success(res);
					},
					fail: (err) => {
						typeof fail == 'function' && fail(err);
					}
				})
				break;
			/*跳转H5(webview)*/
			case 3:
				if (router.hasOwnProperty("isGps") == true) {
					if (router.isGps == 1) {
						location.loadCheckLocation();
						return
					}
				}
				uni.navigateTo({
					url: `/pages/webview/main?src=${encodeURIComponent(router.jump_url)}`,
					success: (res) => {
						typeof success == 'function' && success(res);
					},
					fail: (err) => {
						typeof fail == 'function' && fail(err);
					}
				})
				break;
			default:
				typeof success == 'function' && success();
				break;
		}
	}

	/**
	 * 小程序跳转策略 => 登录页专用版
	 * 跳转类型
	 * 0:不跳转
	 * 1:内部小程序跳转
	 * 2:外部小程序跳转
	 * 3:h5跳转
	 * 4:page跳转
	 */
	miniProgramRouterLogin(router = {}, success, fail) {
		switch (Number(router.jump_type)) {
			/*跳转内部小程序(inner miniProgram)*/
			case 1:
				if (router.jump_url[0] != "/") { //兼容内部url
					router.jump_url = "/" + router.jump_url;
				}
				// tabBar page 特殊跳转方式
				if (router.jump_url.indexOf("/pages/home/main") > -1 || router.jump_url.indexOf(
					"/pages/bill/main") > -1 || router.jump_url.indexOf("/pages/fm/home/main") > -1 || router
					.jump_url.indexOf("/pages/mine/main") > -1) {
					uni.reLaunch({
						url: router.jump_url,
						success: (res) => {
							typeof success == 'function' && success(res);
						},
						fail: (err) => {
							typeof fail == 'function' && fail(err);
						}
					})
				} else {
					uni.redirectTo({
						url: router.jump_url,
						success: (res) => {
							typeof success == 'function' && success(res);
						},
						fail: (err) => {
							typeof fail == 'function' && fail(err);
						}
					})
				}
				break;
			/*跳转外部小程序(outer miniProgram)*/
			case 2:
				uni.navigateToMiniProgram({
					appId: router.appid,
					path: router.jump_url,
					success: (res) => {
						typeof success == 'function' && success(res);
					},
					fail: (err) => {
						typeof fail == 'function' && fail(err);
					}
				})
				break;
			/*跳转H5(webview)*/
			case 3:
				uni.redirectTo({
					url: `/pages/webview/main?src=${encodeURIComponent(router.jump_url)}`,
					success: (res) => {
						typeof success == 'function' && success(res);
					},
					fail: (err) => {
						typeof fail == 'function' && fail(err);
					}
				})
				break;
			default:
				uni.reLaunch({
					url: `/pages/home/main`,
					success: (res) => {
						typeof success == 'function' && success(res);
					},
					fail: (err) => {
						typeof fail == 'function' && fail(err);
					}
				})
				typeof success == 'function' && success();
				break;
		}
	}

	/**
	 * 缓存时间(24小时校验)
	 * 缓存数据
	 * set: 设置校验key，过期date
	 * get: 返回是否24小时
	 * remove: 移除校验字段
	 */
	setCacheData({
		key,
		value
	}) {
		if (!uni.getStorageSync("cacheData")) {
			uni.setStorageSync("cacheData", {});
		}
		let cacheData = uni.getStorageSync("cacheData");
		cacheData[key] = {
			timeStampOld: value
		}
		uni.setStorageSync("cacheData", cacheData);
	}
	getCacheData({
		key
	}) {
		let cacheData = uni.getStorageSync("cacheData");
		let timeStampNow = new Date().getTime();
		let timeStamp = timeStampNow - cacheData[key].timeStampOld;
		if (timeStamp >= 86400000) {
			return true;
		} else {
			return false;
		}
	}
	removeCacheData({
		key
	}) {
		let cacheData = uni.getStorageSync("cacheData");
		cacheData[key] = undefined;
		uni.setStorageSync("cacheData", cacheData);
	}


	/***************************************************************/
	/***                                                         ***/
	/***                      JS 常用方法                         ***/
	/***                                                         ***/
	/***************************************************************/
	/**
	 * 数组(对象子类，例如id小到大)排序，例：arr.sort(compareMin('age'))
	 */
	compareMin(property) {
		return function(a, b) {
			let value1 = a[property];
			let value2 = b[property];
			return value1 - value2;
		}
	}

	/**
	 * 数组(对象子类，例如id大到小)排序，例：arr.sort(compareMax('age'))
	 */
	compareMax(property) {
		return function(a, b) {
			let value1 = a[property];
			let value2 = b[property];
			return value2 - value1;
		}
	}

	clock() {
		let now = new Date();
		let year = now.getFullYear();
		let month = this.zeroAdd(now.getMonth() + 1);
		let date = this.zeroAdd(now.getDate());
		return year + '年' + month + '月' + date + '日'
	}

	/**
	 * 年月日(顺时针推移)例:new Date(1566028456328) || new Date('2020/01/01 00:00:00')
	 */
	clockwise(now = new Date()) {
		let year = now.getFullYear();
		let month = this.zeroAdd(now.getMonth() + 1);
		let date = this.zeroAdd(now.getDate());
		let day = now.getDay();
		let hour = this.zeroAdd(now.getHours());
		let minute = this.zeroAdd(now.getMinutes());
		let second = this.zeroAdd(now.getSeconds());
		let millisecond = this.zeroAdd(now.getMilliseconds());
		return {
			year: year,
			month: month,
			date: date,
			day: day,
			hour: hour,
			minute: minute,
			second: second,
			millisecond: millisecond
		};
	}

	/**
	 * 倒计时(逆时针推移)例:countDowmTime : 2020/01/01 00:00:00
	 */
	unclockwiseLong(countDowmTime) {
		let oldTime = new Date().getTime(); /*现在距离1970年的毫秒数*/
		let newTime = new Date(countDowmTime).getTime(); /*设置未来时间*/
		let secondTotal = Math.floor((newTime - oldTime) / 1000); /*未来时间距离现在的秒数*/
		let day = Math.floor(secondTotal / 86400); /*整数部分代表的是天,一天有24*60*60=86400秒*/
		let hour = Math.floor((secondTotal % 86400) / 3600); /*整数部分代表小时*/
		let minute = Math.floor(((secondTotal % 86400) % 3600) / 60);
		let second = Math.floor((((secondTotal % 86400) % 3600) % 60));
		let millisecond = Math.floor(Math.floor((newTime - oldTime) % 1000) / 10);
		return {
			day: this.zeroAdd(day),
			hour: this.zeroAdd(hour),
			minute: this.zeroAdd(minute),
			second: this.zeroAdd(second),
			millisecond: this.zeroAdd(millisecond)
		}
	}

	/**
	 * 倒计时(逆时针推移)例:countDowmTime : 600(秒)
	 */
	unclockwiseShort(countDowmTime) {
		let secondTotal = countDowmTime; /*未来时间距离现在的秒数*/
		let hour = Math.floor((secondTotal % 86400) / 3600);
		let minute = Math.floor(((secondTotal % 86400) % 3600) / 60);
		let second = Math.floor((((secondTotal % 86400) % 3600) % 60));
		// let object = {
		//   hour: this.zeroAdd(hour),
		//   minute: this.zeroAdd(minute),
		//   second: this.zeroAdd(second)
		// }
		// return object;
		return this.zeroAdd(hour) + ":" + this.zeroAdd(minute) + ":" + this.zeroAdd(second)
	}

	/**
	 * 位数不足补零
	 */
	zeroAdd(n) {
		return n >= 0 && n < 10 ? '0' + n : '' + n;
	}

	/**
	 * 随机数（整型）
	 */
	myRotate(max, min) {
		return Math.floor(Math.random() * (max - min) + min)
	}

	/**
	 * 随机数（浮点型）
	 */
	myRotatePoint(max, min) {
		return Math.random() * (max - min) + min
	}

	/**
	 * 对象拼接url(? || &)
	 */
	formateObjToParamStr(paramObj) {
		const sdata = [];
		for (let attr in paramObj) {
			sdata.push(`${attr}=${this.filter(paramObj[attr])}`);
		}
		return sdata.join('&');
	}
	filter(str) {
		str += '';
		str = str.replace(/&/g, '%26');
		str = str.replace(/\=/g, '%3D');
		return str;
	}

	/**
	 * 获取带参url中的参数
	 */
	getRequest(url) {
		let theRequest = new Object();
		if (url.indexOf("?") != -1) {
			let str = url.substr(1);
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}
}
module.exports = miniScript;
