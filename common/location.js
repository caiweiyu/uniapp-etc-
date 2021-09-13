import store from "@/store/index"

/**
 * app show检测地理位置授权
 * 主要用于检测location缓存(初始授权location是不调用toast)
 */
function loadShowLocation() {
	uni.getSetting({
		success: (res)=> {
			if (!res.authSetting["scope.userLocation"]) {
				setCacheData({
					key: "location",
					value: new Date().getTime()
				});
			} else {
				if (uni.getStorageSync("cacheData")["location"]) {
					removeCacheData({key: "location"});
				}
			}
		}
	})
}

/**
 * 检测用户是否地理位置授权
 */
function loadCheckLocation() {
	return new Promise((resolve, reject)=>{
		uni.getSetting({
			success: (res)=> {
				if (!res.authSetting["scope.userLocation"]) {
					if (uni.getStorageSync("cacheData")["location"] == undefined) {
						// 首次不弹
						return;
					}
					loadSetLocation();
				} else {
					// loadGetLocation();
					resolve();
					if (uni.getStorageSync("cacheData")["location"]) {
						removeCacheData({key: "location"});
					}
				}
			}
		})
	})
}

/**
 * 获取用户地理位置
 */
function loadGetLocation() {
	return new Promise((resolve, reject)=>{
		if (uni.canIUse("getLocation")) {
			uni.getLocation({
				type: 'wgs84',
				success: ({
					latitude,
					longitude,
					...other
				}) => {
					store.commit("user/setLocation", {
						latitude,
						longitude
					})
					resolve();
				},
				fail: (err) => {
					loadSetLocation();
				}
			})
		} else {
			uni.showModal({
				title: "微信版本过低，暂不支持地理位置授权功能，请升级至微信最新版本",
				showCancel: false
			})
		}
	})
}

/**
 * openSetting地理位置
 */
function loadSetLocation() {
	uni.showModal({
		title: "提示",
		content: "为给您提供优质的车主商家服务，请提供地理位置授权",
		showCancel: false,
		success: (result)=>{
			if (result.confirm) {
				uni.openSetting({
				
				})
			}
			removeCacheData({key: "location"});
			setCacheData({
				key: "location",
				value: new Date().getTime()
			});
		}
	})
}

/**
 * 缓存时间(24小时校验)
 * 缓存数据
 * set: 设置校验key，过期date
 * get: 返回是否24小时
 * remove: 移除校验字段
 */
function setCacheData({
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
function getCacheData({
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
function removeCacheData({
	key
}) {
	let cacheData = uni.getStorageSync("cacheData");
	cacheData[key] = undefined;
	uni.setStorageSync("cacheData", cacheData);
}

export default {
	loadShowLocation,
	loadCheckLocation,
	loadGetLocation
}