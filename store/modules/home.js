import * as API from "@/interfaces/home"
const home = {
	namespaced: true,
	state: {
		item: {},//getPhone登录组件item跳转事件，数据传递
		share_info: "",//分享配置
		top_guide: "",//顶部引导配置
		nav_four: "",//4大金刚
		nav_recormmend: "",//推荐服务
		banner: "",//banner
		etc: "",//粤通卡数据
		carc: "",//车卡数据
		memberc: "",//会员卡数据
		weather: "",//天气
		strict_shop: [],//严选商品

		vehicle_type: "",//车辆类型
		fm_index: 0,//资讯tab导航index

		ytk_bill: "111",//粤通卡账单
		info_item:{}
	},
	mutations: {
		mt_item: (state, n) => {
			state.item = n;
		},
		mt_share_info: (state, n)=> {
			state.share_info = n;
		},
		mt_top_guide: (state, n)=> {
			state.top_guide = n;
		},
		mt_nav_four: (state, n)=> {
			state.nav_four = n;
		},
		mt_nav_recormmend: (state, n)=> {
			state.nav_recormmend = n;
		},
		mt_banner: (state, n)=> {
			state.banner = n;
		},
		mt_etc: (state, n)=> {
			state.etc = n;
		},
		mt_carc: (state, n)=> {
			state.carc = n;
		},
		mt_memberc: (state, n)=> {
			state.memberc = n;
		},
		mt_strict_shop: (state, n)=> {
			state.strict_shop = n;
		},
		mt_weather: (state, n)=> {
			state.weather = n;
		},
		mt_vehicle_type: (state, n)=> {
			state.vehicle_type = n;
		},
		mt_fm_index: (state, n)=> {
			state.fm_index = n;
		},
		mt_ytk_bill: (state, n)=> {
			state.ytk_bill = n;
		},
		mt_info_item: (state, n)=> {
			state.info_item = n;
		}
	},
	actions: {
		ac_item: (context, obj)=> {
			context.commit("mt_item", obj)
		},
		ac_city_code: (context, obj)=> {
			context.commit("mt_city_code", obj)
		},
		/**
		 * 分享配置:
		 * 1 首页
		 * 2 我的
		 * 3 金币(储钱罐)
		 * 4 绑卡完成页
		 * 5 粤通卡账单首页
		 * 6 订单列表
		 * 7 卡券中心
		 * 8 资讯列表页
		 */
		async ac_share_info({
			state,
			commit
		}, payload) {
			let res = await API.axios_share({
				flag: payload
			});
			if (res.code == 0) {
				commit("mt_share_info", res.data);
			}
		},
		ac_top_guide: (context, obj)=> {
			context.commit("mt_top_guide", obj)
		},
		ac_nav_four: (context, obj)=> {
			context.commit("mt_nav_four", obj)
		},
		ac_nav_recormmend: (context, obj)=> {
			context.commit("mt_nav_recormmend", obj)
		},
		ac_banner: (context, obj)=> {
			context.commit("mt_banner", obj)
		},
		ac_etc: (context, obj)=> {
			context.commit("mt_etc", obj)
		},
		ac_carc: (context, obj)=> {
			context.commit("mt_carc", obj)
		},
		ac_memberc: (context, obj)=> {
			context.commit("mt_memberc", obj)
		},
		ac_strict_shop: (context, obj)=> {
			context.commit("mt_strict_shop", obj)
		},
		ac_weather: (context, obj)=> {
			context.commit("mt_weather", obj)
		},
		ac_vehicle_type: (context, obj)=> {
			context.commit("mt_vehicle_type", obj)
		},
		ac_ytk_bill: (context, obj)=> {
			context.commit("mt_ytk_bill", obj)
		}
	}
}

export default home;
