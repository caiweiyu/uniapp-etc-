const sinoepc = {
	namespaced: true,
	state: {
		sinoepc_init: {}
	},
	mutations: {
		mt_sinoepc_init: (state, n) => {
			state.sinoepc_init = n;
		}
	},
	actions: {
		ac_sinoepc_init: (context, obj)=> {
			context.commit("mt_sinoepc_init", obj)
		}
	}
}

export default sinoepc;
