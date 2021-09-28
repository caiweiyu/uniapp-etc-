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
		etc: {},//粤通卡数据
		carc: {},//车卡数据
		memberc: {},//会员卡数据
		weather: "",//天气
		nearby_store: [],//附近门店
		strict_shop: [],//严选商品

		vehicle_type: "",//车辆类型
		fm_index: 0,//资讯tab导航index

		ytk_bill: "",//粤通卡账单
		info_item:{},

		new_bill_all:{ //新账单模块
			isweekmon:0,  //周月
			bgColor:'#28BC93', //#F07365 卡片颜色控制
			entrue:true,  //控制下拉开关
			selectweek:{},  //点击单周存放的数据
			selectmon:{},  //点击单月存放的数据
			weeklist:[],   //存放静态周的列表
			selectweekindex:3,  //点击单周的下标
			selectmonindex:5,   //点击单月的下标
			monthsumBillsList:[],  //月总账单
			cardinfo:{},  //卡列表信息
			cardusenum:"",  //常用卡号
			ytkCard:"",   //粤通卡号
			show_add_coin:false,  //是否禁用点击
			isOpenWeeklist:false,  //周是否开启
			isOpenWeekorMoon:false,  //周月选择否开启
			discount_amount:"",  //节约金额
			isNeeddisCount:false,  //是否自定义banner
			isOpenWeek:false,   //周选择开关
			defaultweekvalue:[0],  //默认周选择值
			selectweekMore:{}   //选择周集
		}, 
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
		mt_nearby_store: (state, n)=> {
			state.nearby_store = n;
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
		},
		mt_new_bill_all: (state, n)=> {
			state.new_bill_all.isweekmon = n;
		},
		mt_new_bill_all_bg: (state, n)=> {
			state.new_bill_all.bgColor = n;
		},
		mt_new_bill_all_en: (state, n)=> {
			state.new_bill_all.entrue = n;
		},
		mt_new_bill_all_selectweekindex: (state, n)=> {
			state.new_bill_all.selectweekindex = n;
		},
		mt_new_bill_all_selectmonindex: (state, n)=> {
			state.new_bill_all.selectmonindex = n;
		},
		mt_new_bill_all_selectweek: (state, n)=> {
			state.new_bill_all.selectweek = n;
		},
		mt_new_bill_all_selectmon: (state, n)=> {
			state.new_bill_all.selectmon = n;
		},
		mt_new_bill_all_monthsumBillsList: (state, n)=> {
			state.new_bill_all.monthsumBillsList = n;
		},
		mt_new_bill_all_cardinfo: (state, n)=> {
			state.new_bill_all.cardinfo = n;
		},
		mt_new_bill_all_cardusenum: (state, n)=> {
			state.new_bill_all.cardusenum = n;
		},	
		mt_new_bill_all_ytkCard: (state, n)=> {
			state.new_bill_all.ytkCard = n;
		},
		mt_new_bill_all_show_add_coin: (state, n)=> {
			state.new_bill_all.show_add_coin = n;
		},
		mt_new_bill_all_isOpenWeeklist: (state, n)=> {
			state.new_bill_all.isOpenWeeklist = n;
		},
		mt_new_bill_all_isOpenWeekorMoon: (state, n)=> {
			state.new_bill_all.isOpenWeekorMoon = n;
		},
		mt_new_bill_all_discount_amount: (state, n)=> {
			state.new_bill_all.discount_amount = n;
		},
		mt_new_bill_all_isNeeddisCount: (state, n)=> {
			state.new_bill_all.isNeeddisCount = n;
		},
		mt_new_bill_all_isOpenWeek: (state, n)=> {
			state.new_bill_all.isOpenWeek = n;
		},
		mt_new_bill_all_defaultweekvalue: (state, n)=> {
			state.new_bill_all.defaultweekvalue = n;
		},
		mt_new_bill_all_selectweekMore: (state, n)=> {
			state.new_bill_all.selectweekMore = n;
		},
		mt_new_bill_all_weeklist: (state, n)=> {
			state.new_bill_all.weeklist = n;
		},
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
		ac_nearby_store: (context, obj)=> {
			context.commit("mt_nearby_store", obj)
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
