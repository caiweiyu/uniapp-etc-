var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./ytkUtils.js")), o = require("./config.js"), t = require("../util.js");

import  config from './config'
import request from "@/common/request";
export default {
    authSM: function(e, t, i) {
        console.log("deviceSN :" + e), console.log("dataBuff :" + t);
        var s = "", n = e, r = t.substring(59, 61), a = t.substring(11, 27), c = t.substring(61, 69), l = t.substring(27, 59), p = {
            operType: config.mOprerType,
            applicationCode: config.mapplicationCode,
            msgType: "0001",
            deviceType: config.mdeviceType,
            chipType: "01",
            deviceSerial: n,
            algorithmId: r,
            seSerial: a,
            timestamp: c,
            deviceRandom: l
        };

        console.log("请求地址:" + o.secureURL), console.log("请求参数:", p), wx.request({
            url: o.secureURL,
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
                operType: o.mOprerType,
                applicationCode: o.obumapplicationCode,
                msgType: "0001",
                deviceType: o.mdeviceType,
                chipType: "01",
                deviceSerial: n,
                algorithmId: r,
                seSerial: a,
                timestamp: c,
                deviceRandom: l
            },
            success: function(e) {
                console.log("function-success"), console.log(e), s = e;
            },
            fail: function(e) {
                console.log("function-fail"), console.log(e), s = e;
            },
            complete: function(e) {
                console.log("function-complete"), "function" == typeof i && i(s);
            }
        });
    },
    obuActive: function(e) {
        var t = o.obuActiveURL + e.msessionId + "/req?", i = {};
        return console.log(e), "qz" == e.mode && (i.proListNo = e.proListNo, t = o.obuActiveURL2 + e.msessionId + "/obe-sam?"),
        "obuActive" === e.type || "cardActive" === e.type ? (i.instructionsResp = e.minstructionResps,
        i.mac = e.mmac, i.listNo = e.mlistNo) : "obuRecovery_one" === e.type ? (i.obuSurfaceNo = e.mdeviceSN,
        i.obuInfo1 = e.obuInfo1.toUpperCase(), i.orgCode = o.appkey) : "obuRecovery" === e.type && (i.orgCode = o.appkey,
        i.instructionsResp = e.minstructionResps, i.mac = e.mmac, i.listNo = e.mlistNo),
        new Promise(function(s, n) {
            wx.request({
                url: t,
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                    operType: o.mOprerType,
                    applicationCode: o.obumapplicationCode,
                    msgType: e.mmsgType,
                    deviceType: o.mdeviceType,
                    deviceSerial: e.mdeviceSN,
                    tokenCode: e.msessionId,
                    unEncryptDomain: JSON.stringify(i)
                },
                fail: function(e) {
                    return n(e.errMsg);
                },
                complete: function(e) {
                    return console.log(e), s(e);
                }
            });
        });
    },
    getDeviceByMac: function(i, s) {
        e.default.showLog("/***********根据mac码查询注册设备信息 *************/");
        var n = {
            macaddress: i
        }, r = o.blue_interfaceURL + "/fetchDeviceInfoByMac";
        console.log("请求地址:" + r), console.log("请求参数:", n), t.Http.urlRequest1(r, n, s, s, "", !1);
    },
    rechargeauthSM: function(e, i) {
        console.log("dataBuff :" + e);
        var s = e.substring(59, 61), n = e.substring(11, 27), r = e.substring(61, 69), a = e.substring(27, 59), c = {
            algorithmId: s,
            deviceType: o.mdeviceType,
            chipType: o.mchipType,
            deviceno: n,
            institutionCode: o.mapplicationCode,
            msgType: o.GD_RECHARGE_AUTH,
            random1: a,
            timestamp: r
        }, l = JSON.stringify(c);
        console.log("请求地址:" + o.NewRechargeAtuhURL), console.log("请求参数:" + l);
        var p = o.NewRechargeAtuhURL, u = {
            params: l
        };
        t.Http.urlRequest1(p, u, i, i, "", !1);
    },
    rechargeInit: function(e, i, s, n, r, a) {
        var c = {
            balance: i,
            billno: r,
            cardArea: s,
            cardno: n,
            institutionCode: o.mapplicationCode,
            loadtype: o.mloadtype,
            money: "",
            msgtype: o.GD_RECHARGE_INIT,
            rechargeplatform: o.mrechargeplatform,
            sessionId: e
        }, l = JSON.stringify(c);
        console.log("请求地址:" + o.NewRechargeURL), console.log("请求参数:" + l);
        var p = o.NewRechargeURL, u = {
            params: l
        };
        t.Http.urlRequest1(p, u, a, a, "", !1);
    },
    scadd: function(e, i, s, n, r, a) {
        var c = {
            billno: i,
            institutionCode: o.mapplicationCode,
            instructionResps: s,
            instructionRespsMac: n,
            msgtype: r,
            sessionId: e,
            userid: o.userInfo.userid,
            reqfrom: o.reqfrom
        }, l = JSON.stringify(c);
        console.log("请求地址:" + o.NewRechargeURL), console.log("请求参数:" + l);
        var p = o.NewRechargeURL, u = {
            params: l
        };
        t.Http.urlRequest1(p, u, a, a, "", !1);
    },
    rsaRechargeauthSM1: function(e, i) {
        console.log("dataBuff :" + e);
        var s = e.substring(e.length - 3, e.length - 1);
        console.log("malgorithmId:" + s);
        var n = e.substring(11, e.length - 3), r = {
            algorithmId: "01",
            institutionCode: o.mapplicationCode,
            msgtype: o.RSA_RECHARGE_AUTH1,
            random1: n
        }, a = JSON.stringify(r);
        console.log("请求地址:" + o.NewRechargeAtuhURL), console.log("请求参数:" + a);
        var c = o.NewRechargeAtuhURL, l = {
            params: a
        };
        t.Http.urlRequest1(c, l, i, i, "", !1);
    },
    rsaRechargeauthSM2: function(e, i, s, n, r) {
        console.log("msessionId:" + i);
        var a = {
            clientCertificate: n,
            institutionCode: o.mapplicationCode,
            masterkey: e,
            msgtype: o.RSA_RECHARGE_AUTH2,
            sessionId: i,
            signRandom: s
        }, c = JSON.stringify(a);
        console.log("请求地址:" + o.NewRechargeAtuhURL), console.log("请求参数:" + c);
        var l = o.NewRechargeAtuhURL, p = {
            params: c
        };
        t.Http.urlRequest1(l, p, r, r, "", !1);
    },
    rsaRechargeauthSM3: function(e, i, s) {
        var n = {
            clientHMAC: e,
            institutionCode: o.mapplicationCode,
            msgtype: o.RSA_RECHARGE_AUTH3,
            sessionId: i
        }, r = JSON.stringify(n);
        console.log("请求地址:" + o.NewRechargeAtuhURL), console.log("请求参数:" + r);
        var a = o.NewRechargeAtuhURL, c = {
            params: r
        };
        t.Http.urlRequest1(a, c, s, s, "", !1);
    },
    getSplitOrder: function(e, i, s, n, r) {
        var a = {
            balance: Math.round(s),
            cardArea: e,
            cardno: i,
            deviceno: n,
            institutionCode: o.mapplicationCode,
            msgtype: o.RSA_RECHARGE_FENZHANG
        }, c = JSON.stringify(a);
        console.log("请求地址:" + o.NewRechargeURL), console.log("请求参数:" + c);
        var l = o.NewRechargeURL, p = {
            params: c
        };
        t.Http.urlRequest1(l, p, r, r, "", !1);
    },
    getFile0015: function(e, i) {
        var s = {
            institutionCode: o.mapplicationCode,
            msgtype: o.RSA_RECHARGE_0015,
            sessionId: e
        }, n = JSON.stringify(s);
        console.log("请求地址:" + o.NewRechargeURL), console.log("请求参数:" + n);
        var r = o.NewRechargeURL, a = {
            params: n
        };
        t.Http.urlRequest1(r, a, i, i, "", !1);
    },
    rsaRechargeInit: function(e, i, s, n, r) {
        var a = {
            billno: i,
            institutionCode: o.mapplicationCode,
            instructionResps: s,
            instructionRespsMac: n,
            loadtype: o.mloadtype,
            msgtype: o.RSA_RECHARGE_INIT,
            rechargeplatform: o.mrechargeplatform,
            sessionId: e
        }, c = JSON.stringify(a);
        console.log("请求地址:" + o.NewRechargeURL), console.log("请求参数:" + c);
        var l = o.NewRechargeURL, p = {
            params: c
        };
        t.Http.urlRequest1(l, p, r, r, "", !1);
    },
    rsaRecharge: function(e, i, s, n, r, a) {
        var c = {
            billno: i,
            institutionCode: o.mapplicationCode,
            instructionResps: s,
            instructionRespsMac: n,
            msgtype: r,
            sessionId: e,
            userid: o.userInfo.userid,
            reqfrom: o.reqfrom
        }, l = JSON.stringify(c);
        console.log("请求地址:" + o.NewRechargeURL), console.log("请求参数:" + l);
        var p = o.NewRechargeURL, u = {
            params: l
        };
        t.Http.urlRequest1(p, u, a, a, "", !1);
    }
};
