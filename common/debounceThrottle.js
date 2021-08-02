/**
 * 函数防抖
 * 引用方式
 * 		全局
 * 		main.js import后再以下方式use
 * 	    Vue.prototype.$debounce = tool.debounce
 * 		局部
 *		直接import进来
 * 使用方式
 * 	   	1:
 *     	@click="$debounce(fn,...arg)"
 * 	   	2:
 * 	   	onPageScroll(e) {
 *			this.$debounce((a, b, c)=> {
 *				console.log(a, b, c)
 *			}, a, b, c)
 *		},
 *		3:
 *		this.$debounce(this.fn, a, b, c)
 */
let noClickDebounce = true;//lock
function debounce(fn) {
	let param = []
	for (let i = 1; i < arguments.length; i++) {
		param.push(arguments[i])
	}
	if (noClickDebounce) {
		noClickDebounce = false;
		if (param.length > 0) {
			fn(...param)
		} else {
			fn()
		}
		setTimeout(() => {
			noClickDebounce = true;
		}, 1000)
	}
}

/**
 * 函数节流
 * 引用方式
 * 		全局
 *      main.js import后再以下方式user
 *      Vue.prototype.$throttle = tool.throttle
 *		局部
 *		直接import进来
 * 使用方式
 * 		1:
 * 		@click="$throttle(fn,...arg)"
 * 		2:
 *		onPageScroll(e) {
 *			this.$throttle((a, b, c)=> {
 *				console.log(a, b, c)
 *			}, a, b, c)
 *		},
 *		3:
 *		this.$throttle(this.fn, a, b, c)
 */
let enterTime = 0; //触发的时间
function throttle(fn) {
	let param = []
	let gapTime = 500; //间隔时间，如果interval不传，则默认300ms
	let backTime = new Date().getTime(); //第一次函数return即触发的时间
	for (let i = 1; i < arguments.length; i++) {
		param.push(arguments[i])
	}
	if (backTime - enterTime > gapTime) {
		enterTime = backTime;
		if (param.length > 0) {
			fn(...param)
		} else {
			fn()
		}
	}
}

export default {
	debounce,
	throttle
}