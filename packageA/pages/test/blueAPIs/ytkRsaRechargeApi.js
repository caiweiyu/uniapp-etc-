import  ytkUtils from './ytkUtils'
import  ytkAuthAPI from './ytkAuthAPI'
import  config from './config'
import  ytkApiProxy from './ytkApiProxy'
var l = "";

function o(e, o, n, t, c, s, i, f) {
    var r = {};
    ytkAuthAPI.authTrans("C0", function(e) {
        if (0 == e.serviceCode) {
            var o = "", n = e.serviceData;
            for (var t in n) o += t + ":" + n[t] + " ";
            console.log("rsa充值认证1 返回:" + o), ytkApiProxy.rsaRechargeauthSM1(o, function(e) {
                "request:ok" != e.errMsg && (r.serviceCode = -1, r.serviceInfo = "后台认证" + e.errMsg,
                "function" == typeof f && f(r)), 200 != e.statusCode ? (r.serviceCode = -1, r.serviceInfo = "设备认证步骤一，后台返回失败，请重新认证",
                "function" == typeof f && f(r)) : "00" != e.data.code ? (r.serviceCode = e.data.code,
                r.serviceInfo = "设备认证步骤二失败，后台返回失败，请重新认证", "function" == typeof f && f(r)) : (r.serviceCode = 0,
                r.serviceInfo = e.data, "function" == typeof f && f(r));
            });
        } else r.serviceCode = -1, r.serviceInfo = "设备认证步骤一失败", "function" == typeof f && f(r);
    });
}

function n(e, o, n, t, c, s, i, f, r) {
    var a = {}, u = e.random2, v = e.sessionId, g = "C1" + e.serverCertificate + u;
    l = v, console.log("request info =" + g), ytkAuthAPI.authTrans(g, function(e) {
        console.log("==密文认证2返回 ==");
        for (var o in e) console.log(o + ":" + e[o] + " \n ");
        if (0 == e.serviceCode) {
            var n = "", t = e.serviceData;
            for (var c in t) n += c + ":" + t[c] + " ";
            console.log("rsa充值认证2 返回:" + n), console.log("rsa充值认证2 成功"), a.serviceCode = 0,
            a.serviceInfo = n, a.sessionId = v, "function" == typeof r && r(a);
        } else a.serviceCode = -1, a.serviceInfo = "设备认证步骤二失败", "function" == typeof r && r(a);
    });
}

function t(e, o, n, t, c, s, i, f, r, u) {
    var l = {};
    console.log("authSMRes:" + e);
    var v = e.substring(11, 267);
    console.log("signRandom:" + v);
    var g = e.substring(267, 523);
    console.log("masterkey:" + g);
    var C = e.substring(523, e.length - 1);
    console.log("clientCertificate:" + C), ytkApiProxy.rsaRechargeauthSM2(g, f, v, C, function(e) {
        if (console.log("res data:" + e.statusCode), console.log("res data:" + e.data),
        200 != e.statusCode) l.serviceCode = -1, l.serviceInfo = "设备认证步骤二，后台返回失败，请重新认证",
        "function" == typeof u && u(l); else if ("00" != e.data.code) l.serviceCode = e.data.code,
        l.serviceInfo = "设备认证步骤二，后台返回失败，请重新认证", "function" == typeof u && u(l); else {
            var o = e.data.serverHMAC;
            console.log("serverHMAC:" + o);
            var n = "C2" + o;
            console.log("request info =" + n), ytkAuthAPI.authTrans(n, function(e) {
                console.log("==密文认证3返回 ==");
                for (var o in e) console.log(o + ":" + e[o] + " \n ");
                if (0 == e.serviceCode) {
                    var n = "", t = e.serviceData;
                    for (var c in t) n += c + ":" + t[c] + " ";
                    console.log("rsa充值认证3 返回:" + n), console.log("rsa充值认证3 成功");
                    var s = n.substring(11, n.length - 1);
                    ytkApiProxy.rsaRechargeauthSM3(s, f, function(e) {
                        200 != e.statusCode ? (l.serviceCode = -1, l.serviceInfo = "设备认证步骤三，后台返回失败，请重新认证",
                        "function" == typeof u && u(l)) : "00" != e.data.code ? (l.serviceCode = e.data.code,
                        l.serviceInfo = "设备认证步骤三，后台返回失败，请重新认证", "function" == typeof u && u(l)) : (l.serviceCode = 0,
                        l.serviceInfo = "RSA 认证成功", "function" == typeof u && u(l));
                    });
                } else l.serviceCode = -1, l.serviceInfo = "设备认证步骤三失败", "function" == typeof u && u(l);
            });
        }
    });
}

function c(e, o, n, t, c, f) {
    ytkUtils.showLog("/***********获取分账信息开始  *************/");
    var d = {};
    ytkApiProxy.getSplitOrder(e, o, n, t, function(a) {
        if (200 != a.statusCode) d.serviceCode = -1, d.serviceInfo = "获取分账信息,后台返回失败", "function" == typeof f && f(d); else if ("51" == a.data.code) i(a.data.billno, a.data.money, c, e, o, n, t, function(e) {
            d = e, "function" == typeof f && f(d);
        }); else if ("00" == a.data.code || "61" == a.data.code || "73" == a.data.code) {
            var u = a.data.billno, l = a.data.money;
            ytkUtils.showLog("/***********获取分账信息完成  *************/"), s(u, l, c, function(e) {
                d = e, "function" == typeof f && f(d);
            });
        } else "45" == a.data.code ? (console.log(a.respMsg), d.serviceCode = a.data.code,
        d.serviceInfo = "需要设置分账规则", "function" == typeof f && f(d)) : "41" == a.data.code ? (console.log(a.respMsg),
        d.serviceCode = a.data.code, d.serviceInfo = "该卡片未绑定账户", "function" == typeof f && f(d)) : "42" == a.data.code ? (console.log(a.respMsg),
        d.serviceCode = a.data.code, d.serviceInfo = "账户资金不足", "function" == typeof f && f(d)) : (d.serviceCode = a.data.code,
        d.serviceInfo = "获取分账信息,后台返回失败", "function" == typeof f && f(d));
    });
}

function s(e, o, n, t) {
    var c = {};
    ytkUtils.showLog("/***********获取初0015指令集开始  *************/"), ytkApiProxy.getFile0015(n, function(o) {
        200 != o.statusCode ? (c.serviceCode = -1, c.serviceInfo = "获取0015指令,后台返回失败", "function" == typeof t && t(c)) : "00" != o.data.code ? (c.serviceCode = o.data.code,
        c.serviceInfo = "获取0015指令,后台返回失败", "function" == typeof t && t(c)) : f(o.data, function(o) {
            if ("" == o) return console.log("写卡失败 1"), c.serviceCode = -1, c.serviceInfo = "写卡失败",
            void ("function" == typeof t && t(c));
            ytkUtils.showLog("/***********获取初始化指令集开始  *************/"), ytkApiProxy.rsaRechargeInit(n, e, o, "", function(o) {
                200 != o.statusCode ? (c.serviceCode = -1, c.serviceInfo = "获取初始化指令,后台返回失败", "function" == typeof t && t(c)) : "00" != o.data.code ? (c.serviceCode = o.data.code,
                c.serviceInfo = "获取初始化指令,后台返回失败", "function" == typeof t && t(c)) : (c.serviceCode = 0,
                c.serviceInfo = "充值写卡", "function" == typeof t && t(c), f(o.data, function(o) {
                    if ("" == o) return console.log("写卡失败 2"), c.serviceCode = -1, c.serviceInfo = "写卡失败",
                    void ("function" == typeof t && t(c));
                    ytkApiProxy.rsaRecharge(n, e, o, "", config.RSA_RECHARGE_ADD, function(o) {
                        200 != o.statusCode ? (c.serviceCode = -1, c.serviceInfo = "获取圈存指令,后台返回失败", "function" == typeof t && t(c)) : "00" != o.data.code ? (c.serviceCode = o.data.code,
                        c.serviceInfo = "获取圈存指令,后台返回失败", "function" == typeof t && t(c)) : (c.serviceCode = 0,
                        c.serviceInfo = "充值确认", "function" == typeof t && t(c), f(o.data, function(o) {
                            if ("" == o) return console.log("写卡失败 3"), c.serviceCode = -1, c.serviceInfo = "写卡失败",
                            void ("function" == typeof t && t(c));
                            ytkUtils.showLog("/***********获取圈存确认指令 开始  *************/"), ytkApiProxy.rsaRecharge(n, e, o, "", config.RSA_RECHARGE_CONF, function(e) {
                                console.log(" res.errMsg:" + e.errMsg), null != e.statusCode && 200 != e.statusCode ? (c.serviceCode = -1,
                                c.serviceInfo = "获取圈存确认结果,后台返回失败", ytkUtils.showLog("/***********" + c.serviceInfo + "*************/"),
                                "function" == typeof t && t(c)) : null != e.statusCode && "00" != e.data.code ? (c.serviceCode = e.data.code,
                                c.serviceInfo = "获取圈存确认结果,后台返回失败", ytkUtils.showLog("/***********" + c.serviceInfo + "*************/"),
                                "function" == typeof t && t(c)) : null != e.statusCode && (c.serviceCode = 0, c.serviceInfo = "充值成功",
                                c.serviceObj = {
                                    returnMoney: e.data.returnMoney ? Number(e.data.returnMoney) : 0,
                                    totalMoney: e.data.totalMoney ? Number(e.data.totalMoney) : 0,
                                    transferMoney: e.data.transferMoney ? Number(e.data.transferMoney) : 0,
                                    billPrice: e.data.billPrice ? Number(e.data.billPrice) : 0
                                }, ytkUtils.showLog("/***********" + c.serviceInfo + "*************/"), "function" == typeof t && t(c));
                            });
                        }));
                    });
                }));
            });
        });
    });
}

function i(e, o, n, t, s, i, r, d) {
    var u = {};
    console.log("修复写卡成功半条 begin"), console.log("获取初0015指令集 begin"), u.serviceCode = 0,
    u.serviceInfo = "充值确认处理中", "function" == typeof d && d(u), ytkApiProxy.getFile0015(n, function(o) {
        200 != o.statusCode ? (u.serviceCode = -1, u.serviceInfo = "获取0015指令,后台返回失败", "function" == typeof d && d(u)) : "00" != o.data.code ? (u.serviceCode = o.data.code,
        u.serviceInfo = "获取0015指令,后台返回失败", "function" == typeof d && d(u)) : f(o.data, function(o) {
            if ("" == o) return console.log("写卡失败 4"), u.serviceCode = -1, u.serviceInfo = "写卡失败",
            void ("function" == typeof d && d(u));
            console.log("调用3001接口 begin"), ytkApiProxy.scadd(n, e, o, "", "3001", function(o) {
                return console.log("补办条圈存确认 后台返回:" + o), 200 != o.statusCode ? (console.log("补办条圈存确认 后台返回失败"),
                u.serviceCode = -1, u.serviceInfo = "补办条圈存确认 后台返回失败", void ("function" == typeof d && d(u))) : "00" != o.data.code ? (u.serviceCode = -1,
                u.serviceInfo = o.data.code, void ("function" == typeof d && d(u))) : (console.log("3001接口 后台返回:" + o.data.code),
                void f(o.data, function(o) {
                    if ("" == o) return console.log("写卡失败 5"), u.serviceCode = -1, u.serviceInfo = "写卡失败",
                    void ("function" == typeof d && d(u));
                    console.log("调用3002接口上送校验结果 begin"), ytkApiProxy.scadd(n, e, o, "", "3002", function(e) {
                        return console.log("补办条圈存确认 后台返回:" + e), 200 != e.statusCode ? (console.log("补办条圈存确认 后台返回失败"),
                        u.serviceCode = -1, u.serviceInfo = "补办条圈存确认 后台返回失败", void ("function" == typeof d && d(u))) : "61" != e.data.code ? "00" == e.data.code ? (u.serviceCode = 0,
                        u.serviceInfo = "充值成功", void ("function" == typeof d && d(u))) : (u.serviceCode = -1,
                        u.serviceInfo = e.data.code, void ("function" == typeof d && d(u))) : (console.log("存在写卡失败半条,进行补录"),
                        void c(t, s, i, r, n, function(e) {
                            u = e, "function" == typeof d && d(u);
                        }));
                    });
                }));
            });
        });
    });
}

function f(e, o) {
    console.log("RSA圈存 写卡  begin : "), console.log(e);
    var n = e.instructions;
    console.log("distributeStr=" + n), console.log("============sechargeInit begin:"),
    ytkAuthAPI.cosTrans(n, "01", "A3", function(e) {
        var n = "", t = "";
        0 == e.serviceCode && (console.log("code : " + e.serviceCode + "\ndata : " + e.serviceData.dataBuff),
        n = e.serviceData.dataBuff.substring(10), console.log("cmdResult : " + n), t = n.substring(0, n.length)),
        "function" == typeof o && o(t);
    });
}

export default {
    rsaRechargeProcess: function(e, s, i, f, a, d, u, l) {
        var v = {};
        v.serviceCode = 0, v.serviceInfo = "充值平台安全认证", "function" == typeof l && l(v), ytkUtils.showLog("/***********RSA充值认证1处理中  *************/"),
        ytkUtils.showLog("/***********intbalance  *************/" + s), o(0, 0, 0, 0, 0, 0, 0, function(o) {
            0 == o.serviceCode ? (ytkUtils.showLog("/***********RSA充值认证1完成， RSA充值认证2处理中 *************/"),
            n(o.serviceInfo, 0, 0, 0, 0, 0, 0, 0, function(o) {
                if (0 == o.serviceCode) {
                    ytkUtils.showLog("/***********RSA充值认证2完成， RSA充值认证3处理中 *************/");
                    var n = o.sessionId;
                    t(o.serviceInfo, 0, 0, 0, 0, 0, 0, n, 0, function(o) {
                        0 == o.serviceCode ? (ytkUtils.showLog("/***********RSA充值认证3完成， 充值申请处理中 *************/"),
                        v.serviceCode = 0, v.serviceInfo = "充值初始化", "function" == typeof l && l(v), c(i, e, s, u, n, function(e) {
                            v = e, "function" == typeof l && l(v);
                        })) : (v = o, "function" == typeof l && l(v));
                    });
                } else v = o, "function" == typeof l && l(v);
            })) : (v = o, "function" == typeof l && l(v));
        });
    }
};
