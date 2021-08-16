import  ytkUtils from './ytkUtils'

function e(e, a, n) {
    var s = "";
    return s = "A3" == n || "A4" == n || "82" == n ? n + a + (s = 0 == ytkUtils.getENCODE_DATA_TYPE() ? t(e) : r(e)) : e,
    ytkUtils.showLog("组拼ETCData完毕：", s.length / 2, s), s;
}

function t(e) {
    var t = e, r = e.length / 2, a = new ArrayBuffer(10), n = new DataView(a), s = void 0;
    return r > 256 ? (n.setInt8(0, r + 4 & 255), n.setInt8(1, r + 4 >> 8 & 255), n.setInt8(2, 128),
    n.setInt8(3, 130), n.setInt8(4, r >> 8 & 255), n.setInt8(5, 255 & r), s = a.slice(0, 6)) : r > 128 && r <= 256 ? (n.setInt8(0, r + 3 & 255),
    n.setInt8(1, r + 3 >> 8 & 255), n.setInt8(2, 128), n.setInt8(3, 129), n.setInt8(4, r),
    s = a.slice(0, 5)) : (n.setInt8(0, r + 2 & 255), n.setInt8(1, r + 2 >> 8 & 255),
    n.setInt8(2, 128), n.setInt8(3, r), s = a.slice(0, 4)), t = ytkUtils.byteArray2hexStr(s) + t;
}

function r(e) {
    var t = e, r = e.length / 2, a = new ArrayBuffer(2), n = new DataView(a);
    return n.setInt8(0, 255 & r), n.setInt8(1, r >> 8 & 255), t = ytkUtils.byteArray2hexStr(a) + t;
}

function a(e) {
    var t = {}, r = ytkUtils.getPagLenMax(), a = parseInt(e.length / 2 / r);
    e.length / 2 % r != 0 && (a += 1);
    console.log('r0: ',r)
    console.log('a0: ',a)
    var n = new ArrayBuffer(10);
    new DataView(n);
    t.serviceCode = 0, t.serviceInfo = "encode ok", t.serviceData = {}, t.serviceData.dataEncode = new Array();
    for (var s = 0; s < a - 1; s++) t.serviceData.dataEncode[s] = e.substr(s * r * 2, 2 * r),
    t.serviceData.dataEncode[s] = u(t.serviceData.dataEncode[s], s, a);
    return t.serviceData.dataEncode[a - 1] = e.substring((a - 1) * r * 2), t.serviceData.dataEncode[a - 1] = u(t.serviceData.dataEncode[a - 1], a - 1, a),
    t;
}

function n(e) {
    var t = {}, r = ytkUtils.getPagLenMax(), a = parseInt(e.length / 2 / r);
    e.length / 2 % r != 0 && (a += 1), t.serviceCode = 0, t.serviceInfo = "encode ok",
    t.serviceData = {}, t.serviceData.dataEncode = new Array();
    console.log('r1: ',r)
    console.log('a1: ',a)
    for (var n = 0; n < a - 1; n++) t.serviceData.dataEncode[n] = e.substr(n * r * 2, 2 * r),
    t.serviceData.dataEncode[n] = s(t.serviceData.dataEncode[n], n, a);
    return t.serviceData.dataEncode[a - 1] = e.substring((a - 1) * r * 2), t.serviceData.dataEncode[a - 1] = s(t.serviceData.dataEncode[a - 1], a - 1, a),
    t;
}

function s(e, t, r) {
    var a = e, n = new ArrayBuffer(10), s = new DataView(n), u = "", d = "", c = 0, i = e.length / 2;
    0 == t ? s.setInt8(0, 128 + (r - 1 - t & 255)) : s.setInt8(0, r - 1 - t & 255),
    a = "3301" + (u = ytkUtils.byteArray2hexStr(n).substring(0, 2)) + ytkUtils.byte2hexStr(255 & i) + a;
    for (var f = ytkUtils.hexStr2byteArray(a), l = 1; l < f.length; l++) c ^= f[l];
    a += ytkUtils.byte2hexStr(c);
    var v = ytkUtils.hexStr2byteArray(a).length;
    if (v > 127) {
        s.setInt8(0, 128 + (v % 128 & 255)), s.setInt8(1, v / 128 & 255), u = ytkUtils.byteArray2hexStr(n).substring(0, 4);
        var y = v + 8 + 4 + 3;
        s.setInt8(0, y >> 8 & 255), s.setInt8(1, 255 & y), d = ytkUtils.byteArray2hexStr(n).substring(0, 4);
    } else {
        s.setInt8(0, 255 & v), u = ytkUtils.byteArray2hexStr(n).substring(0, 2);
        var I = v + 8 + 4 + 2;
        s.setInt8(0, I >> 8 & 255), s.setInt8(1, 255 & I), d = ytkUtils.byteArray2hexStr(n).substring(0, 4);
    }
    return a = "FE01" + d + "753100000A0012" + u + a + "1800";
}

function u(e, t, r) {
    var a = e, n = new ArrayBuffer(10), s = new DataView(n), u = 0, d = e.length / 2;
    0 == t ? (s.setInt8(0, 128 + (r >> 8 & 255)), s.setInt8(1, 255 & r), s.setInt8(2, 255 & d)) : (s.setInt8(0, t + 1 >> 8 & 255),
    s.setInt8(1, t + 1 & 255), s.setInt8(2, 255 & d)), a = "50" + ytkUtils.byteArray2hexStr(n).substring(0, 6) + a;
    for (var c = ytkUtils.hexStr2byteArray(a), i = 0; i < c.length; i++) u ^= c[i];
    return a += ytkUtils.byte2hexStr(u);
}

function d(e, t) {
    var r = "";
    return console.log("channelType:", t), r = "A6" == t || "84" == t ? t + (r = c(e)) : e,
    ytkUtils.showLog("组拼ETCData完毕：", r.length / 2, r), r;
}

function c(e) {
    var t = e.length / 2;
    0 == ytkUtils.getDeviceType() && "C0" == e.substring(0, 2) && (t = 1);//有点没看明白
    var r = new ArrayBuffer(2), a = new DataView(r);
    return a.setInt8(0, 255 & t), a.setInt8(1, t >> 8 & 255), ytkUtils.byteArray2hexStr(r) + e;
}

export default {
    encode: function(t, r, s) {
        var u = ytkUtils.getProtocolType(), d = e(t, r, s), c = {};
        return 0 == u ? c = a(d) : 1 == u && (c = n(d)), c;
    },
    authEncode: function(e, t) {
        var r = ytkUtils.getProtocolType(), s = d(e, t), u = {};
        return 0 == r ? u = a(s) : 1 == r && (u = n(s)), u;
    },
    initEncode: function(e) {
        var t = {};
        if ("A2" == e || "80" == e) {
            var r = ytkUtils.getProtocolType();
            0 == r ? t = a(e) : 1 == r && (t = n(e));
        } else t = e;
        return t;
    }
};
