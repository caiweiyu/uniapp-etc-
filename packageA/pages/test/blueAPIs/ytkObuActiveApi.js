import  ytkUtils from './ytkUtils'
import  ytkAuthAPI from './ytkAuthAPI'
import  config from './config'
import  ytkApiProxy from './ytkApiProxy'
var y = "";

function o(e, o, n, t, i, c, u, f) {
    4 == o && (n.serviceCode = 0, n.serviceInfo = "OBU激活处理中", "function" == typeof t && t(n),
    a(e, i, c, function(e) {
        n = e, "function" == typeof t && t(n);
    })), 3 == o && (n.serviceCode = 0, n.serviceInfo = "OBU激活处理中", "function" == typeof t && t(n),
    s(e, u, i, f, function(e) {
        n = e, "function" == typeof t && t(n);
    })), 2 == o && (n.serviceCode = 0, n.serviceInfo = "卡片激活处理中", "function" == typeof t && t(n),
    r(e, u, i, f, function(o) {
        if (0 != o.serviceCode) return n = o, "function" == typeof t && t(n), !1;
        n.serviceCode = 0, n.serviceInfo = "OBU激活处理中", "function" == typeof t && t(n), s(e, u, i, f, function(e) {
            n = e, "function" == typeof t && t(n);
        });
    })), 1 == o && (n.serviceCode = 0, n.serviceInfo = "卡片激活处理中", "function" == typeof t && t(n),
    r(e, u, i, f, function(e) {
        if (0 != e.serviceCode) return n = e, "function" == typeof t && t(n), !1;
        n.serviceCode = 0, n.serviceInfo = "卡片激活成功", "function" == typeof t && t(n);
    }));
}

function n(e, o) {
    var n = {}, t = Date.parse(new Date()) / 1e3;
    console.log(t);
    var r = t.toString(16);
    console.log(r);
    var i = "C0" + r;
    ytkAuthAPI.authTrans(i, function(t) {
        if (0 != t.serviceCode) return n.serviceCode = -1, n.serviceInfo = "OBU激活 SE认证1失败",
        "function" == typeof o && o(n), !1;
        var r = "", i = t.serviceData;
        for (var s in i) r += s + ":" + i[s] + " ";
        console.log("obu激活SE认证1 返回:" + r), ytkApiProxy.authSM(e, r, function(e) {
            console.log("res data:" + e.statusCode), console.log("res data:" + e.data), 200 != e.statusCode ? (n.serviceCode = -1,
            n.serviceInfo = "OBU激活后台认证失败，请重新认证") : "0000" != e.data.respCode ? (n.serviceCode = -1,
            n.serviceInfo = "OBU激活后台认证失败，失败原因:" + e.data.respMsg + "请重新认证") : (n.serviceCode = 0,
            n.serviceInfo = e.data), "function" == typeof o && o(n);
        });
    });
}

function t(e, o) {
    var n = {}, t = e.workKey, r = e.workKeyMac, i = e.macKey, s = e.macKeyMac, c = e.serverRandom, a = e.tokenCode, u = e.signData, f = "C1" + t + r + i + s + c + a + u;
    y = a, console.log("request info =" + f), ytkAuthAPI.authTrans(f, function(e) {
        if (console.log("==密文认证2返回 =="), 0 == e.serviceCode) {
            var t = "", r = e.serviceData;
            for (var i in r) t += i + ":" + r[i] + " ";
            console.log("obu激活SE认证2 返回:" + t), console.log("SE认证成功"), n.serviceCode = 0, n.sessionId = a;
        } else n.serviceCode = -1, n.serviceInfo = "OBU激活 SE认证2失败";
        "function" == typeof o && o(n);
    });
}

function r(e, o, n, t, r) {
    var s = {
        sessionId: e,
        listNo: o,
        serialNo: n,
        callback: r
    };
    i("qz" == t ? config.obuFrontKey.SECOND_ONE : config.obuAfterKey.SECOND_ONE, "", "", "", s, t, "", "1");
}

function i(e, o, n, t, r, s, c, a) {
    var u = {}, y = r.sessionId, g = r.listNo, p = r.serialNo, E = r.callback, C = {
        mmsgType: e,
        msessionId: y,
        mlistNo: g,
        mdeviceSN: p,
        minstructionResps: o,
        mmac: n,
        type: "cardActive",
        mode: s
    };
    return "qz" == s && (C.proListNo = c), ytkApiProxy.obuActive(C).then(function(e) {
        if (200 != e.statusCode) return u.serviceCode = -1, u.serviceInfo = "卡片二发步骤" + a + "后台认证失败",
        "function" == typeof E && E(u), !1;
        if (null != e.data.respMsg) return u.serviceCode = -1, u.serviceInfo = e.data.respMsg,
        "function" == typeof E && E(u), !1;
        if ("" == e.data.unEncryptDomain.nextOrder || "4304" == e.data.msgType) return u.serviceCode = 0,
        u.serviceInfo = "卡片激活成功", "function" == typeof E && E(u), !0;
        console.log("卡片二发步骤  写卡  begin : ");
        var o = e.data.unEncryptDomain.instructions, n = e.data.unEncryptDomain.mac, t = e.data.unEncryptDomain.nextOrder;
        ytkUtils.numberToHexString(parseInt((o.length + n.length) / 2), 2, !1);
        ytkUtils.numberToHexString(parseInt((o.length + n.length) / 2), 2, !0);
        var d = o + n, y = "", g = "", p = "", C = "11";
        "qz" == s && (c = e.data.unEncryptDomain.proListNo, C = "10"), ytkAuthAPI.cosTrans(d, C, "82", function(e) {
            if (0 != e.serviceCode) return u.serviceCode = -1, u.serviceInfo = e.serviceInfo,
            "function" == typeof E && E(u), !1;
            if (console.log("硬件返回", e), "qz" == s) {
                var o = (e.serviceData.dataBuff.length / 2).toString(16), n = o.length < 2 ? "0" + o : o;
                y = e.serviceData.dataBuff.substring(10), g = "81" + n + e.serviceData.dataBuff,
                p = y.substring(y.length - 8, y.length), "1" == a && i(config.obuFrontKey.SECOND_TWO, g, p, t, r, s, c, "2"),
                "2" == a && i(config.obuFrontKey.SECOND_THREE, g, p, t, r, s, c, "3"), "3" == a && i(config.obuFrontKey.SECOND_FOUR, g, p, t, r, s, c, "4");
            } else y = e.serviceData.dataBuff.substring(10), g = y.substring(0, y.length - 8),
            p = y.substring(y.length - 8, y.length), "1" == a && i(config.obuAfterKey.SECOND_TWO, g, p, t, r, s, c, "2"),
            "2" == a && i(config.obuAfterKey.SECOND_THREE, g, p, t, r, s, c, "3");
        });
    });
}

function s(e, o, n, t, r) {
    var i = {
        sessionId: e,
        listNo: o,
        serialNo: n,
        callback: r
    }, s = "qz" == t ? config.obuFrontKey.ACTIVE_ONE : config.obuAfterKey.ACTIVE_ONE;
    console.log(s), c(s, "", "", "", i, t, "", "1");
}

function c(e, o, n, t, r, i, s, a) {
    var u = {}, f = r.sessionId, y = r.listNo, g = r.serialNo, p = r.callback, E = {
        mmsgType: e,
        msessionId: f,
        mlistNo: y,
        mdeviceSN: g,
        minstructionResps: o,
        mmac: n,
        type: "obuActive",
        mode: i
    };
    return "qz" == i && (E.proListNo = s), ytkApiProxy.obuActive(E).then(function(e) {
        if (200 != e.statusCode) return u.serviceCode = -1, u.serviceInfo = "obu激活" + a + "后台认证失败",
        "function" == typeof p && p(u), !1;
        if (null != e.data.respMsg) return u.serviceCode = -1, u.serviceInfo = e.data.respMsg,
        "function" == typeof p && p(u), !1;
        var o = "", n = "", t = "", f = "21";
        if ("qz" == i && (s = e.data.unEncryptDomain.proListNo || "", f = "20"), "4204" == e.data.msgType && "qz" == i) return c(config.obuFrontKey.ACTIVE_FIVE, "", "", "", r, i, s, "5"),
        !0;
        if ("0321" === e.data.msgType || "4219" == e.data.msgType) return u.serviceCode = 0,
        u.serviceInfo = "obu激活成功", "function" == typeof p && p(u), !0;
        console.log("OBU二发  写卡  begin : ");
        var d = e.data.unEncryptDomain.instructions, y = e.data.unEncryptDomain.mac, g = e.data.unEncryptDomain.nextOrder, E = d + y;
        ytkAuthAPI.cosTrans(E, f, "82", function(e) {
            if (0 != e.serviceCode) return u.serviceCode = -1, u.serviceInfo = e.serviceInfo,
            "function" == typeof p && p(u), !1;
            if (console.log("硬件返回", e), "qz" == i) {
                var f = (e.serviceData.dataBuff.length / 2).toString(16), d = f.length < 2 ? "0" + f : f;
                o = e.serviceData.dataBuff.substring(10), n = "81" + d + e.serviceData.dataBuff,
                t = o.substring(o.length - 8, o.length), "1" == a && c(config.obuFrontKey.ACTIVE_TWO, n, t, g, r, i, s, "2"),
                "2" == a && c(config.obuFrontKey.ACTIVE_THREE, n, t, g, r, i, s, "3"), "3" == a && c(config.obuFrontKey.ACTIVE_FOUR, n, t, g, r, i, s, "4"),
                "5" == a && c(config.obuFrontKey.ACTIVE_SIX, n, t, g, r, i, s, "6"), "6" == a && c(config.obuFrontKey.ACTIVE_SEVEN, n, t, g, r, i, s, "7");
            } else o = e.serviceData.dataBuff.substring(10), n = o.substring(0, o.length - 8),
            t = o.substring(o.length - 8, o.length), "1" == a && c(config.obuAfterKey.ACTIVE_TWO, n, t, g, r, i, s, "2"),
            "2" == a && c(config.obuAfterKey.ACTIVE_THREE, n, t, g, r, i, s, "3"), "3" == a && c(config.obuAfterKey.ACTIVE_FOUR, n, t, g, r, i, s, "4"),
            "4" == a && c(config.obuAfterKey.ACTIVE_FIVE, n, t, g, r, i, s, "5"), "5" == a && c(config.obuAfterKey.ACTIVE_SIX, n, t, g, r, i, s, "6"),
            "6" == a && c(config.obuAfterKey.ACTIVE_SEVEN, n, t, g, r, i, s, "7");
        });
    });
}

function a(e, o, n, t) {
    var r = {
        EF01: n,
        sessionId: e,
        serialNo: o,
        callback: t
    };
    u(config.obuAfterKey.RECOVER_ONE, "", "", "", r, "1");
}

function u(e, o, n, t, r, i) {
    var s = {}, c = r.sessionId, a = r.serialNo, f = r.callback, y = r.EF01, g = {
        mmsgType: e,
        msessionId: c,
        mlistNo: "1" === i ? "" : r.listNo,
        mdeviceSN: a,
        minstructionResps: o,
        mmac: n,
        type: "1" === i ? "obuRecovery_one" : "obuRecovery",
        obuInfo1: y
    };
    return ytkApiProxy.obuActive(g).then(function(e) {
        if (200 != e.statusCode) return s.serviceCode = -1, s.serviceInfo = "obu激活" + i + "后台认证失败",
        "function" == typeof f && f(s), !1;
        if (null != e.data.respMsg) return s.serviceCode = -1, s.serviceInfo = e.data.respMsg,
        "function" == typeof f && f(s), !1;
        if ("0324" === e.data.msgType) return s.serviceCode = 0, s.serviceInfo = "obu激活成功",
        "function" == typeof f && f(s), !0;
        console.log("OBU二发  写卡  begin : ");
        var o = e.data.unEncryptDomain.instructions, n = e.data.unEncryptDomain.mac, t = e.data.unEncryptDomain.nextOrder, c = o + n, a = "", d = "", y = "";
        ytkAuthAPI.cosTrans(c, "21", "82", function(o) {
            0 == o.serviceCode && (a = o.serviceData.dataBuff.substring(10), d = a.substring(0, a.length - 8),
            y = a.substring(a.length - 8, a.length), "1" == i && (r.listNo = e.data.unEncryptDomain.listNo,
            u(config.obuAfterKey.RECOVER_TWO, d, y, t, r, "2")), "2" == i && u(config.obuAfterKey.RECOVER_THREE, d, y, t, r, "3"));
        });
    });
}



export default  {
    obuActiveProcess: function(e, r, i, s, c, a) {
        var u = {};
        if ("qz" == a) return o("", i, u, s, e, c, r, a), !1;
        u.serviceCode = 0, u.serviceInfo = "激活认证处理中", "function" == typeof s && s(u), console.log(a, "mode"),
        n(e, function(n) {
            if (0 != n.serviceCode) return u.serviceCode = -1, u.serviceInfo = "SE认证1失败", "function" == typeof s && s(u),
            !1;
            t(n.serviceInfo, function(n) {
                if (0 != n.serviceCode) return u = n, "function" == typeof s && s(u), !1;
                o(n.sessionId, i, u, s, e, c, r, a);
            });
        });
    }
};
