import  ytkUtils from './ytkUtils'
import  ytkService from './ytkService'
import  ytkDataDecode from './ytkDataDecode'
var n = void 0, i = null;

function t(e) {
    ytkService._SetDataListenerCallBack(!0, t), r(e);
}

function a() {
    var e = {};
    ytkUtils.showError(i, "数据接收超时，取消时钟"), null != i && (clearTimeout(i), i = null),
    ytkService._SetDataListenerCallBack(!1), e.serviceCode = -1, e.serviceInfo = "数据接收超时",
    n(e);
}

function r(e) {
    var t = {}, a = void 0, r = void 0, f = ytkUtils.getProtocolType();
    if (0 == f ? a = ytkDataDecode.decode_GB(e) : 1 == f && (a = ytkDataDecode.decode_WX(e)),
    0 == a.serviceCode) {
        var c = a.serviceData.strData;
        null != (r = "fe01001a2711" != c.substring(0, 12) && "2713" != c.substring(8, 12) ? l(c) : c) ? (ytkUtils.showLog(i, "接收数据成功，取消时钟"),
        null != i && (clearTimeout(i), i = null), ytkService._SetDataListenerCallBack(!1),
        t.serviceCode = 0, t.serviceInfo = "数据接收成功", t.serviceData = {}, t.serviceData.dataBuff = r,
        n(t)) : (ytkUtils.showError(i, "数据解析失败，取消时钟"), null != i && (clearTimeout(i), i = null),
        ytkService._SetDataListenerCallBack(!1), t.serviceCode = -1, t.serviceInfo = "数据解析失败",
        n(t));
    }
}

function l(e) {
    var t = ytkUtils.getDECODE_DATA_TYPE(), a = ytkUtils.hexStr2byteArray(e), r = void 0, l = 0, u = a[1], s = a[0], n = "", i = "";
    ytkUtils.showLog("指令返回数据：", e);
    var f = e.substring(4, 6);
    if (ytkUtils.showLog("opertype : ", f), 0 != u) return ytkUtils.showError("WJ结果码非00"),
    null;
    switch (s) {
      case 146:
      case 176:
      case 179:
      case 180:
        if ("11" == f || "21" == f || "01" == f) i = e; else {
            if (0 == t) {
                var c = 7;
                129 == a[5] && (129 == a[6] ? (l = 255 & a[7], c += 1) : 130 == a[6] ? (l = a[7] << 8,
                l += 255 & a[8], c += 2) : l = 255 & a[6]), r = a.slice(c, l + c), i = ytkUtils.byteArray2hexStr(r);
            } else 1 == t && (r = a.slice(5), i = ytkUtils.APDU2TPDU(ytkUtils.byteArray2hexStr(r)));
            ytkUtils.showLog("WJ有效数据长度：", i.length / 2, i), ytkUtils.showLog("操作类型ok", s);
        }
        return i;

      case 145:
      case 144:
      case 148:
      case 182:
        return n = (255 & a[3]) << 8, n += a[2], r = a.slice(4, n + 4), i = ytkUtils.byteArray2hexStr(r),
        ytkUtils.showLog("WJ有效数据长度：", n, ytkUtils.byteArray2hexStr(r)), ytkUtils.showLog("操作类型ok", s),
        i;

      case 181:
      case 178:
        return n = a[2], r = a.slice(3, n + 3), ytkUtils.showLog("WJ有效数据长度：", n, ytkUtils.byteArray2hexStr(r)),
        ytkUtils.showLog("操作类型ok", s), ytkUtils.byteArray2hexStr(r);

      default:
        return ytkUtils.showError("WJ通道类型有误"), null;
    }
}



export default {
    _StartSendData: function(e, r) {
        function l() {
            var t = "";
            if (40 * d >= e[c].length && (c++, d = 0), c < e.length && (t = e[c].length >= 40 * (d + 1) ? e[c].substring(40 * d, 40 * (d + 1)) : e[c].substring(40 * d, e[c].length)),
            "" == t) ytkUtils.showLog("数据发送完毕！"); else {
                for (var a = ytkUtils.hexStr2byteArray(t), r = new ArrayBuffer(a.byteLength), s = new DataView(r), h = 0; h < a.byteLength; h++) s.setUint8(h, a[h]);
                ytkUtils.showLog("发送分包数据：", t), ytkService._writeBLECharacteristicValue(r, function(e) {
                    0 == e.serviceCode ? (d++, l()) : (ytkUtils.showError(i, "数据发送失败，取消时钟"), null != i && (clearTimeout(i),
                    i = null), ytkService._SetDataListenerCallBack(!1), f.serviceCode = -2, f.serviceInfo = "数据发送失败",
                    n(f));
                });
            }
        }
        var f = {}, c = 0, d = 0;
        null != i && (clearTimeout(i), i = null), ytkDataDecode.init(), i = setTimeout(a, 2e4),
        ytkUtils.showLog(i, "开启时钟"), n = r, ytkService._SetDataListenerCallBack(!0, t),
        l();
    },
    _ReceiveData: r,
    _StartRecevieData: function(e) {
        ytkDataDecode.init(), n = e, ytkService._SetDataListenerCallBack(!0, t);
    },
    _StartSendDataNoResp: function(e, t) {
        function a() {
            var t = "";
            if (40 * f >= e[l].length && (l++, f = 0), l < e.length && (t = e[l].length >= 40 * (f + 1) ? e[l].substring(40 * f, 40 * (f + 1)) : e[l].substring(40 * f, e[l].length)),
            "" == t) ytkUtils.showLog("数据发送完毕！"), r.serviceCode = 0, r.serviceInfo = "数据发送完毕！",
            n(r); else {
                console.log("strTemData:" + t);
                for (var s = ytkUtils.hexStr2byteArray(t), c = new ArrayBuffer(s.byteLength), d = new DataView(c), h = 0; h < s.byteLength; h++) d.setUint8(h, s[h]);
                ytkService._writeBLECharacteristicValue(c, function(e) {
                    0 == e.serviceCode ? (f++, a()) : (ytkUtils.showError(i, "数据发送失败，取消时钟"), null != i && (clearTimeout(i),
                    i = null), ytkService._SetDataListenerCallBack(!1), r.serviceCode = -2, r.serviceInfo = "数据发送失败",
                    n(r));
                });
            }
        }
        var r = {}, l = 0, f = 0;
        ytkDataDecode.init(), n = t, a();
    }
};
