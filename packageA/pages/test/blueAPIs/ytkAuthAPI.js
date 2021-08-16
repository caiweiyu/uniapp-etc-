import  ytkUtils from './ytkUtils'
import  ytkDataInteract from './ytkDataInteract'
import  ytkDataAnalysis from './ytkDataAnalysis'
import  ytkDataEncode from './ytkDataEncode'

function t(e, t, n, s) {
    var i = {};
    if ("10" == t || "20" == t || "11" == t || "21" == t || "00" == t || "01" == t || "30" == t) {
        var c = {};
        c = ytkDataEncode.encode(e, t, n), ytkUtils.showLog("发送设备信息：" + c.serviceData.dataEncode),
        ytkDataInteract._StartSendData(c.serviceData.dataEncode, function(e) {
            0 == e.serviceCode ? (ytkUtils.showLog("APDU透传指令成功111"), i = e, "function" == typeof s && s(i)) : (i.serviceCode = -1,
            i.serviceInfo = "设备返回超时", "function" == typeof s && s(i));
        });
    } else i.serviceCode = -1, i.serviceInfo = "command参数错误！", "function" == typeof s && s(i);
}

export default {
    selectICDir: function(e, o) {
        var f = {}, s = ytkUtils.getTLVCommand("010700A4000002" + e), i = "", c = "";
        1 == ytkUtils.getTRANSFER_TYPE() && (s = ytkUtils.TPDU2APDU(s));
        var u = ytkUtils.getCMD_TYPE();
        0 == u ? (i = "10", c = "82") : 1 == u && (i = "00", c = "A3"), console.log("hex:" + s),
        t(s, i, c, function(t) {
            if (0 == t.serviceCode) {
                var s = ytkDataAnalysis._analysisIs9000(t.serviceData.dataBuff);
                f = t, 0 == s.serviceCode && (ytkUtils.showLog("IC卡进目录成功"), f.serviceInfo = "IC卡进" + e + "目录成功"),
                "function" == typeof o && o(f);
            } else f = t, "function" == typeof o && o(f);
        });
    },
    selectEsamDir: function(e, t) {
        var o = {}, f = ytkUtils.getTLVCommand("010700A4000002" + e), s = "", i = "";
        1 == ytkUtils.getTRANSFER_TYPE() && (f = ytkUtils.TPDU2APDU(f));
        var c = ytkUtils.getCMD_TYPE();
        0 == c ? (s = "20", i = "82") : 1 == c && (s = "00", i = "A3"), this.cosTrans(f, s, i, function(f) {
            if (0 == f.serviceCode) {
                var s = ytkDataAnalysis._analysisIs9000(f.serviceData.dataBuff);
                o = f, 0 == s.serviceCode && (ytkUtils.showLog("esam卡进目录成功"), o.serviceInfo = "esam卡进" + e + "目录成功"),
                "function" == typeof t && t(o);
            } else o = f, "function" == typeof t && t(o);
        });
    },
    cosTrans: t,
    authTrans: function(e, t) {
        var n = {}, s = "";
        if (0 == ytkUtils.getDeviceType() ? s = "84" : 1 == ytkUtils.getDeviceType() && (s = "A6"),
        "A6" == s || "84" == s) {
            var i = {};
            i = ytkDataEncode.authEncode(e, s), ytkDataInteract._StartSendData(i.serviceData.dataEncode, function(e) {
                0 == e.serviceCode ? (ytkUtils.showLog("APDU透传指令成功222"), n = e, "function" == typeof t && t(n)) : (n = e,
                "function" == typeof t && t(n));
            });
        } else n.serviceCode = -1, n.serviceInfo = "command参数错误！", "function" == typeof t && t(n);
    },
    wxAuth: function(e) {
        var t = {}, n = new Array();
        n[0] = "FE0100124E2100010A06080012024F4B1200", console.log("微信认证指令1 ：" + n), ytkDataInteract._StartSendData(n, function(f) {
            "2713" != f.serviceData.dataBuff.substring(8, 12) ? (t.serviceCode = -1, t.serviceInfo = "设备返回信息异常",
            "function" == typeof e && e(t)) : 0 == f.serviceCode && "2713" == f.serviceData.dataBuff.substring(8, 12) ? (ytkUtils.showLog("APDU透传指令成功444"),
            n[0] = "FE0100164E2300020A06080012024F4B100018002000", console.log("微信认证指令2 ：" + n),
            ytkDataInteract._StartSendDataNoResp(n, function(a) {
                t = a, "function" == typeof e && e(t);
            })) : (t = f, "function" == typeof e && e(t));
        });
    }
};
