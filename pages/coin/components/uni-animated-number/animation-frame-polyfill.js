/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-03 18:43:15
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-03 18:44:03
 */
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Mengdi Gao
 *
 * Rewritten from MIT Licensed GitHub Gist at https://gist.github.com/paulirish/1579671
 * >  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * >  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * >
 * >  requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 */

const frameDuration = 16; // milliseconds
let expectedOrLastCallTime = 0;

/**
 * @param callback
 * @returns {number} The Request ID
 */
export function requestAnimationFrame(callback) {
  const currentTime = Date.now();
  expectedOrLastCallTime = Math.max(
    expectedOrLastCallTime + frameDuration,
    currentTime
  );

  return setTimeout(() => {
    callback(Date.now());
  }, expectedOrLastCallTime - currentTime);
}

export function cancelAnimationFrame(requestId) {
  clearTimeout(requestId);
}
