/*
 * @Description:拦截器
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:17:21
 * @LastEditors: yongqing
 * @LastEditTime: 2021-04-09 19:34:13
 */
const intercept = function(fn, interceptors) {
	return function(...args) {
    
		const self = this;
		if (fn._promisify) {
			const callit = function(args) {
				let promise = fn.apply(this, args);
				const successInterceptors = interceptors.success;
				if (typeof successInterceptors === 'function') {
					promise = promise.then(rst => {
						return successInterceptors(rst);
					});
				}
				const failInterceptors = interceptors.fail;
				if (typeof failInterceptors === 'function') {
					promise = promise.catch(e => {
						throw failInterceptors(e);
					});
				}
				return promise;
			};

			const configInterceptors = interceptors.config;
			if (typeof configInterceptors === 'function') {
				args = configInterceptors.apply(self, args);
			}
			if (isPromise(args)) {
				return args.then(res => {
					return callit(res);
				});
			} else {
				return callit(args);
			}
		} else {
			let originalOption = args[0];
			let option = originalOption;
			const callit = function(args) {
				['fail', 'success', 'complete'].forEach(item => {
					const bak = args[item];
					if (typeof bak === 'function') {
						args[item] = res => {
							if (typeof interceptors[item] === 'function') {
								res = interceptors[item].call(self, res);
							}
							bak.call(self, res);
						};
					}
				});
				return fn.call(self, args);
			};

			const configInterceptors = interceptors.config;
			if (typeof configInterceptors === 'function') {
				option = configInterceptors.call(self, originalOption);
			}
			if (isPromise(option)) {
				return option
					.then(res => {
						return callit(res);
					})
					.catch(e => {
						const failInterceptors = interceptors.fail;
						if (typeof failInterceptors === 'function') {
							e = failInterceptors.call(self, e);
						}
						const failFunc = originalOption.fail;
						if (typeof failFunc === 'function') {
							failFunc.call(self, e);
						}
					});
			} else {
				return callit(option);
			}
		}
	};
};

function isPromise(obj) {
	return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export default intercept;
