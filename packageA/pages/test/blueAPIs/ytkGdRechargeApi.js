import  ytkUtils from './ytkUtils'
import  ytkDataAnalysis from './ytkDataAnalysis'
import  ytkAuthAPI from './ytkAuthAPI'
import  config from './config'
import  ytkApiProxy from './ytkApiProxy'

var p = "";

function o(e, o, n, t, s, c, i) {
    var r = {}, a = Date.parse(new Date()), f = "C0" + (a /= 1e3).toString(16);
    ytkAuthAPI.authTrans(f, function(e) {
        if (0 == e.serviceCode) {
            var o = "", n = e.serviceData;
            for (var t in n) o += t + ":" + n[t] + " ";
            console.log("国密充值SE认证1 返回:" + o), ytkApiProxy.rechargeauthSM(o, function(e) {
                console.log("res.statusCode:" + e.statusCode), console.log("res.errMsg:" + e.errMsg),
                null == e.errMsg && (r.serviceCode = -1, r.serviceInfo = "后台认证超时", "function" == typeof i && i(r)),
                200 != e.statusCode ? (r.serviceCode = -1, r.serviceInfo = "网络异常，请稍后再试", "function" == typeof i && i(r)) : "00" != e.data.code ? (r.serviceCode = -1,
                r.serviceInfo = "后台认证失败1，返回错误码" + e.data.code, "function" == typeof i && i(r)) : (r.serviceCode = 0,
                r.serviceInfo = e.data, "function" == typeof i && i(r));
            });
        } else r.serviceCode = -1, r.serviceInfo = "设备认证步骤一失败", "function" == typeof i && i(r);
    });
}

function n(e, o, n, t, s, c, i, r) {
    var a = {};
    for (var f in e) console.log(f + "=" + e[f]);
    console.log("authSMRes:" + e);
    var l = e.workkey, d = e.workkeyMac, u = e.mackey, v = e.mackeyMac, g = e.random2, y = e.sessionId, I = e.signdata, b = "C1" + l + d + u + v + g + y + I;
    p = y, console.log("request info =" + b), ytkAuthAPI.authTrans(b, function(e) {
        console.log("==密文认证2返回 ==");
        for (var o in e) console.log(o + ":" + e[o] + " \n ");
        if (0 == e.serviceCode) {
            var n = "", t = e.serviceData;
            for (var s in t) n += s + ":" + t[s] + " ";
            console.log("国密充值SE认证2 返回:" + n), console.log("SE认证成功"), a.serviceCode = 0, a.sessionId = y,
            "function" == typeof r && r(a);
        } else a.serviceCode = -1, a.serviceInfo = "设备认证步骤二失败", "function" == typeof r && r(a);
    });
}

function t(e, o, n, r, a, f, l) {
    var d = {};
    ytkApiProxy.rechargeInit(e, o, n, r, f, function(f) {
        if (200 != f.statusCode) return console.log("获取初始化指令 后台返回失败"), d.serviceCode = -1,
        d.serviceInfo = "网络异常，请稍后再试", void ("function" == typeof l && l(d));
        if ("00" == f.data.code) c(f.data, function(o, n, t) {
            console.log("mInstructionsResp  : " + o), console.log("mInstructionsMacResp  : " + n),
            ytkApiProxy.scadd(e, t, o, n, config.GD_RECHARGE_ADD, function(o) {
                return 200 != o.statusCode ? (console.log("圈存初始化 后台认证失败" + o.statusCode), d.serviceCode = -1,
                d.serviceInfo = "网络异常，请稍后再试", void ("function" == typeof l && l(d))) : "00" != o.data.code ? (console.log("圈存初始化 后台认证失败hahhah:" + o.data.code),
                d.serviceCode = o.data.code, d.serviceInfo = "充值失败", void ("function" == typeof l && l(d))) : "request:ok" != o.errMsg ? (console.log(o.respMsg),
                d.serviceCode = -1, d.serviceInfo = o.errMsg, void ("function" == typeof l && l(d))) : (ytkUtils.showLog("/***********圈存初始化完成，进行圈存确认*************/"),
                d.serviceCode = 0, d.serviceInfo = "充值写卡", "function" == typeof l && l(d), void i(o.data, function(o, n) {
                    console.log("mInstructionsResp  : " + o), console.log("mInstructionsMacResp  : " + n),
                    console.log("圈存确认  begin: "), d.serviceCode = 0, d.serviceInfo = "充值确认", "function" == typeof l && l(d),
                    ytkApiProxy.scadd(e, t, o, n, config.GD_RECHARGE_CONF, function(e) {
                        return console.log("status code :" + e.statusCode), null != e.statusCode && 200 != e.statusCode ? (console.log("圈存确认 后台认证失败"),
                        d.serviceCode = -1, d.serviceInfo = "网络异常，请稍后再试", void ("function" == typeof l && l(d))) : null != e.statusCode && "request:ok" != e.errMsg ? (console.log(e.respMsg),
                        d.serviceCode = -1, d.serviceInfo = e.errMsg, void ("function" == typeof l && l(d))) : "00" == e.data.code ? (ytkUtils.showLog("/***********圈存确认完成，充值成功*************/"),
                        d.serviceCode = 0, d.serviceInfo = "充值成功", d.serviceObj = {
                            returnMoney: e.data.returnMoney ? Number(e.data.returnMoney) : 0,
                            totalMoney: e.data.totalMoney ? Number(e.data.totalMoney) : 0,
                            transferMoney: e.data.transferMoney ? Number(e.data.transferMoney) : 0,
                            billPrice: e.data.billPrice ? Number(e.data.billPrice) : 0
                        }, void ("function" == typeof l && l(d))) : (d.serviceCode = -1, d.serviceInfo = "后台返回" + e.data.code,
                        void ("function" == typeof l && l(d)));
                    });
                }));
            });
        }); else if ("51" == f.data.code) console.log("写卡成功半条 res billno:" + f.data.billno),
        s(f.data, e, o, n, r, a, f.data.billno, function(e) {
            d = e, "function" == typeof l && l(d);
        }); else if ("61" == f.data.code || "73" == f.data.code) console.log("写卡失败半条 res billno:" + f.data.billno),
        t(e, o, n, r, a, f.data.billno, function(e) {
            d = e, "function" == typeof l && l(d);
        }); else {
            if ("45" == f.data.code) return console.log(f.respMsg), d.serviceCode = f.data.code,
            d.serviceInfo = "需要设置分账规则", void ("function" == typeof l && l(d));
            if ("42" == f.data.code) return console.log(f.respMsg), d.serviceCode = f.data.code,
            d.serviceInfo = "账户资金不足", void ("function" == typeof l && l(d));
            if ("41" == f.data.code) return console.log(f.respMsg), d.serviceCode = f.data.code,
            d.serviceInfo = "该卡片未绑定账户", void ("function" == typeof l && l(d));
            d.serviceCode = f.data.code, d.serviceInfo = "获取初始化指令 后台返回失败", "function" == typeof l && l(d);
        }
    });
}

function s(e, o, n, s, i, r, a, f) {
    var l = {};
    l.serviceCode = 0, l.serviceInfo = "充值确认", "function" == typeof f && f(l), c(e, function(e, c, d) {
        console.log("mInstructionsResp  : " + e), console.log("mInstructionsMacResp  : " + c),
        console.log("补办条圈存确认  begin: "), ytkApiProxy.scadd(o, d, e, c, config.GD_RECHARGE_FIX, function(e) {
            return console.log("补办条圈存确认 后台返回:" + e), 200 != e.statusCode ? (console.log("补办条圈存确认 后台返回失败"),
            l.serviceCode = -1, l.serviceInfo = "网络异常，请稍后再试", void ("function" == typeof f && f(l))) : "61" != e.data.code ? "00" == e.data.code ? (l.serviceCode = 0,
            l.serviceInfo = "充值成功", l.serviceObj = {
                returnMoney: e.data.returnMoney ? Number(e.data.returnMoney) : 0,
                totalMoney: e.data.totalMoney ? Number(e.data.totalMoney) : 0,
                transferMoney: e.data.transferMoney ? Number(e.data.transferMoney) : 0,
                billPrice: e.data.billPrice ? Number(e.data.billPrice) : 0
            }, void ("function" == typeof f && f(l))) : (l.serviceCode = -1, l.serviceInfo = e.data.code,
            void ("function" == typeof f && f(l))) : (console.log("存在写卡失败半条,进行补录"), void t(o, n, s, i, r, a, function(e) {
                l = e, "function" == typeof f && f(l);
            }));
        });
    });
}

function c(e, o) {
    console.log("初始化指令集  写卡  begin : "), console.log(e);
    var n = e.billno, t = e.instructions + e.instructionsMac;
    console.log("distributeStr=" + t), console.log("============sechargeInit begin:"),
    ytkAuthAPI.cosTrans(t, "11", "82", function(e) {
        for (var t in e) console.log(t + " :" + e[t]);
        var s = "", c = "", i = "";
        if (0 == e.serviceCode) {
            for (var r in e.serviceData) console.log(r + " :" + e.serviceData[r]);
            console.log("code : " + e.serviceCode + "\ndata : " + e.serviceData.dataBuff), s = e.serviceData.dataBuff.substring(10),
            console.log("cmdResult : " + s), c = s.substring(0, s.length - 8), console.log("硬件返回 mInstructions: " + c),
            i = s.substring(s.length - 8, s.length), console.log("硬件返回 mInstructionsMacResp: " + i);
        }
        "function" == typeof o && o(c, i, n);
    });
}

function i(e, o) {
    console.log("圈存  写卡  begin : ");
    for (var n in e) console.log(n + "=" + e[n]);
    var t = e.instructions + e.instructionsMac;
    console.log("distributeStr=" + t), console.log("============sechargeInit begin:"),
    ytkAuthAPI.cosTrans(t, "11", "82", function(e) {
        console.log(e);
        var n = "", t = "", s = "";
        if (0 == e.serviceCode) {
            for (var c in e.serviceData) console.log(c + " :" + e.serviceData[c]);
            console.log("code : " + e.serviceCode + "\ndata : " + e.serviceData.dataBuff), n = e.serviceData.dataBuff.substring(10),
            console.log("cmdResult : " + n), t = n.substring(0, n.length - 8), console.log("硬件返回 mInstructions: " + t),
            s = n.substring(n.length - 8, n.length), console.log("硬件返回 mInstructionsMacResp: " + s);
        }
        "function" == typeof o && o(t, s);
    });
}

function r(e) {
    var o = {}, n = ytkUtils.getTLVCommand("010500b0951801");
    console.log("======hex======:" + n);
    var t = "", s = "";
    1 == ytkUtils.getTRANSFER_TYPE() && (n = ytkUtils.TPDU2APDU(n));
    var c = ytkUtils.getCMD_TYPE();
    0 == c ? (t = "10", s = "82") : 1 == c && (t = "10", s = "A3"), ytkAuthAPI.cosTrans(n, t, s, function(n) {
        0 == n.serviceCode ? (ytkUtils.showLog("读取pintype码1"), console.log("pintype码返回信息：" + n.serviceData.dataBuff),
        o.serviceCode = 0, o.serviceInfo = n.serviceData.dataBuff, "function" == typeof e && e(o)) : (o = n,
        "function" == typeof e && e(o));
    });
}

function a(e, o, n) {
    var t = {}, s = ytkUtils.getTLVCommand("011780D3000012" + e + o);
    console.log("======hex======:" + s);
    var c = "", i = "";
    1 == ytkUtils.getTRANSFER_TYPE() && (s = ytkUtils.TPDU2APDU(s));
    var r = ytkUtils.getCMD_TYPE();
    0 == r ? (c = "30", i = "82") : 1 == r && (c = "30", i = "A3"), ytkAuthAPI.cosTrans(s, c, i, function(e) {
        0 == e.serviceCode ? (ytkUtils.showLog("读取pin码1"), console.log("pin码返回信息：" + e.serviceData.dataBuff),
        t.serviceCode = 0, t.serviceInfo = e.serviceData.dataBuff, "function" == typeof n && n(t)) : (t = e,
        "function" == typeof n && n(t));
    });
}

function f(e, o, n, t) {
    var s = {};
    r(function(n) {
        if (0 == n.serviceCode) {
            var c = n.serviceInfo.substring(4, 6), i = ytkUtils.strToHexCharCode(c).substring(2);
            console.log("ascPinType" + i), console.log("cardNo:" + e);
            var r = ytkUtils.strToHexCharCode(e).substring(2);
            console.log("ascCardNo:" + r), a(i, r, function(e) {
                if (0 == e.serviceCode) {
                    var n = "123456";
                    if (console.log("cardVersion:" + o), console.log("init pinCode:" + n), o < 64) {
                        if ("61" == e.serviceInfo.substring(e.serviceInfo.length - 4).substring(0, 2)) return s.serviceCode = -1,
                        s.serviceInfo = "获取PIN码错误", void ("function" == typeof t && t(s));
                        n = e.serviceInfo.substring(e.serviceInfo.length - 16, e.serviceInfo.length - 4),
                        console.log("ascpinCode" + n), n = ytkUtils.hexCharCodeToStr(n), console.log("ascpinCode" + n);
                    }
                    s.serviceCode = 0, s.serviceInfo = n, "function" == typeof t && t(s);
                } else s.serviceCode = -1, s.serviceInfo = "获取PIN码失败", "function" == typeof t && t(s);
            });
        } else s.serviceCode = -1, s.serviceInfo = "获取PIN码类型失败", "function" == typeof t && t(s);
    });
}

function l(e, o, n) {
    var t = {}, s = ytkUtils.byte2hexStr(parseInt(e.length / 2)), c = "01" + ytkUtils.byte2hexStr(5 + parseInt(e.length / 2)) + "00200000" + s + e;
    console.log("hex" + c), c = ytkUtils.getTLVCommand(c), console.log("tlv hex" + c);
    var i = "", r = "";
    1 == ytkUtils.getTRANSFER_TYPE() && (c = ytkUtils.TPDU2APDU(c));
    var a = ytkUtils.getCMD_TYPE();
    0 == a ? (i = "10", r = "82") : 1 == a && (i = "00", r = "A3"), ytkAuthAPI.cosTrans(c, i, r, function(e) {
        if (0 == e.serviceCode) {
            var o = ytkDataAnalysis._analysisIs9000(e.serviceData.dataBuff);
            t = e, 0 == o.serviceCode && (ytkUtils.showLog("PIN认证成功"), t.serviceInfo = "PIN认证成功"),
            "function" == typeof n && n(t);
        } else t = e, "function" == typeof n && n(t);
    });
}

function d(e, o, n, t, s, c, i, r) {
    var a = {};
    ytkAuthAPI.selectICDir("3F00", function(e) {
        console.log("====3f00============="), 0 == e.serviceCode ? f(t, s, c, function(e) {
            if (0 == e.serviceCode) {
                ytkUtils.showLog(e.serviceCode, e.serviceInfo);
                var o = e.serviceInfo;
                console.log("pinCode:" + o), ytkAuthAPI.selectICDir("1001", function(e) {
                    0 == e.serviceCode ? (console.log("进入1001目录成功，开始验证PIN 码"), l(o, c, function(e) {
                        0 == e.serviceCode ? (a.serviceCode = 0, a.serviceInfo = "PIN码认证成功", "function" == typeof r && r(a)) : (a = e,
                        "function" == typeof r && r(a));
                    })) : (a.serviceCode = -1, a.serviceInfo = "进入1001目录失败", "function" == typeof r && r(a));
                });
            } else a = e, "function" == typeof r && r(a);
        }) : (a.serviceCode = -1, a.serviceInfo = "进入3f00目录失败", "function" == typeof r && r(a));
    });
}


export default {
    gdNewChargeProcess: function(e, s, c, i, r, a, f) {
        var l = {};
        l.serviceCode = 0, l.serviceInfo = "充值平台安全认证", "function" == typeof f && f(l), o(0, 0, 0, 0, 0, 0, function(o) {
            0 == o.serviceCode ? (ytkUtils.showLog("/***********国密充值认证1完成，开始国密充值认证2*************/"),
            n(o.serviceInfo, 0, 0, 0, 0, 0, 0, function(o) {
                if (0 == o.serviceCode) {
                    ytkUtils.showLog("/***********国密充值认证2完成，开始国密Pin码认证*************/");
                    var n = o.sessionId;
                    d(0, 0, 0, e, i, r, 0, function(o) {
                        0 == o.serviceCode ? (l.serviceCode = 0, l.serviceInfo = "充值初始化", "function" == typeof f && f(l),
                        ytkUtils.showLog("/***********国密Pin码认证完成，获取圈存初始化指令集*************/"), t(n, s, c, e, r, a, function(e) {
                            l = e, "function" == typeof f && f(l);
                        })) : (l = o, "function" == typeof f && f(l));
                    });
                } else l = o, "function" == typeof f && f(l);
            })) : (l = o, "function" == typeof f && f(l));
        });
    }
};
