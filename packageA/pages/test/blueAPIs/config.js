import  md5Util from './md5Util'
function getHeaderKey() {
	for (var i = new Date().getTime(), n = "", _ = 0; _ < 4; _++) n += parseInt(10 * Math.random());
	var c = parseInt(n), t = "fbd3b415abd2494378c38cc170ff80ca" + i * c;
	return i + ":" + c + ":" + md5Util.hex_md5(t);
}
var v = {
	SECOND_ONE: "4301",
	SECOND_TWO: "4302",
	SECOND_THREE: "4303",
	SECOND_FOUR: "4304",
	ACTIVE_ONE: "4201",
	ACTIVE_TWO: "4202",
	ACTIVE_THREE: "4203",
	ACTIVE_FOUR: "4204",
	ACTIVE_FIVE: "4217",
	ACTIVE_SIX: "4218",
	ACTIVE_SEVEN: "4219",
	RECOVER_ONE: "4217",
	RECOVER_TWO: "4218",
	RECOVER_THREE: "4219"
}, w = {
	SECOND_ONE: "0312",
	SECOND_TWO: "0313",
	SECOND_THREE: "0314",
	ACTIVE_ONE: "0315",
	ACTIVE_TWO: "0316",
	ACTIVE_THREE: "0317",
	ACTIVE_FOUR: "0318",
	ACTIVE_FIVE: "0319",
	ACTIVE_SIX: "0320",
	ACTIVE_SEVEN: "0321",
	RECOVER_ONE: "0322",
	RECOVER_TWO: "0323",
	RECOVER_THREE: "0324"
};
export default {
	GD_RECHARGE_AUTH: "1021",
	GD_RECHARGE_INIT: "1015",
	GD_RECHARGE_ADD: "1016",
	GD_RECHARGE_CONF: "1007",
	GD_RECHARGE_FIX: "3002",
	RSA_RECHARGE_AUTH1: "1001",
	RSA_RECHARGE_AUTH2: "1002",
	RSA_RECHARGE_AUTH3: "1003",
	RSA_RECHARGE_FENZHANG: "2014",
	RSA_RECHARGE_0015: "1004",
	RSA_RECHARGE_INIT: "1005",
	RSA_RECHARGE_ADD: "1006",
	RSA_RECHARGE_CONF: "1007",
	obuFrontKey: v,
	obuAfterKey: w,
	mOprerType: "0003",
	mapplicationCode: "U0000001",
	obumapplicationCode: "000U0000001",
	mdeviceType: "01",
	mloadtype: "3",
	mrechargeplatform: "3",
	mbalance: "11",
	mcardArea: "4401",
	mcardno: "1627222016061568",
	mbillno: "0312164f484bdb3",
	menvironment: "product",
	mchipType: "01",
}
