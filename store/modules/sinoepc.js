const sinoepc = {
	namespaced: true,
	state: {
		sinoepc_init: {},//中石化首页数据集合
		phone_history: [],//手机号码历史记录
		oil_station: [],//附近油站
	},
	mutations: {
		mt_sinoepc_init: (state, n) => {
			state.sinoepc_init = n;
		},
		mt_phone_history: (state, n) => {
			state.phone_history = n;
		},
		mt_oil_station: (state, n) => {
			state.oil_station = n;
		}
	},
	actions: {
		ac_sinoepc_init: (context, obj)=> {
			context.commit("mt_sinoepc_init", obj)
		},
		ac_phone_history: (context, obj)=> {
			context.commit("mt_phone_history", obj)
		},
		ac_oil_station: (context, obj)=> {
			context.commit("mt_oil_station", obj)
		}
	}
}

export default sinoepc;
