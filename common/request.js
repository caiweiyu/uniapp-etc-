/*
 * @Description: http request  请求封装
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:17:21
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 19:34:13
 */

import useIntercept from "./intercept";
import store from "@/store/index";
import conf from '@/config/conf.js'
function showError(message, show = true) {
  show &&
    uni.showToast({
      title: message || "请求异常",
      icon: "none",
    });
}

/**
 * 拦截器
 */
const interceptRequest = useIntercept(uni.request, {
  config(params) {
    // console.log("=====发送请求=====", params);
    uni.showLoading({
      title: "请求中",
    });

    let token = store.state.user.token;
    if (token) {
      params.data["token"] = "2ab4f80a5bceb9db51478a9be5fc6b47";
    }
	if(params.url.indexOf("/mini-program/v1")>-1){
		 params.data["hash"]= conf.hash;
		 params.data["version"] = conf.version;
	}
    return params;
  },
  success(res) {
    // console.log("=====返回结果=====", res);
    uni.hideLoading();
    if (res.statusCode == 200 && res.data.code == 0) {
      return res.data;
    } else {
      showError(res.data.msg);
      return false;
    }
  },
  fail(e) {
    console.log(e);
    uni.hideLoading();
    return e;
  },
});

const request = ({
  url = "",
  method = "get",
  data = {},
  header = {
    "content-type": "application/x-www-form-urlencoded", //formdata 数据传输
  },
}) => {
  return new Promise((resolve, reject) => {
    interceptRequest({
      url,
      method,
      data,
      header,
      success(res) {
        resolve(res);
      },
      fail(res) {
        console.log("fail", res);
        reject(res);
      },
    });
  });
};

export default request;
