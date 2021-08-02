/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-09 15:17:14
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 15:59:54
 */
import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import user from "./modules/user";
import home from "./modules/home";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
	home,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key),
      },
      paths: ["user"]
    }),
  ],
});
export default store;
