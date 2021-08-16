import ytkUtils from './ytkUtils'
var t = void 0, r = 0, a = void 0, o = "", s = "", u = !0;
export default {
    decode_GB: function(i) {
        var f = 0, c = {}, n = ytkUtils.byteArray2hexStr(i);
        ytkUtils.showLog("当前接受包的数据:", n);
        var d = ytkUtils.hexStr2byteArray(n);
        if (d.byteLength > 1 && 80 == d[0] && 1 == u ? (u = !1, t = d[3], o = n) : o += n,
        o.length / 2 >= t + 5) {
            r += 1, u = !0;
            var v = ytkUtils.hexStr2byteArray(o);
            ytkUtils.showLog("接受完第", r, "包数据，内容 ", o);
            for (var b = 0; b < t + 4; b++) f ^= v[b];
            if (console.log("bcc:" + f), v[o.length / 2 - 1] != f) return ytkUtils.showError("第", r, " 包校验bcc:Error!"),
            c.serviceCode = -1, c.serviceInfo = "校验错误。。。", c;
            128 == (128 & v[1]) && (a = ((127 & v[1]) << 8) + v[2], ytkUtils.showLog("总共:", a, "大包")),
            ytkUtils.showLog("第", r, " 包校验bcc:ok!"), s += o.substring(8, o.length - 2);
        }
        return r >= a ? (c.serviceCode = 0, c.serviceInfo = "数据接收完成！", c.serviceData = {},
        c.serviceData.strData = s, c) : (c.serviceCode = 1, c.serviceInfo = "数据接收中。。。",
        c);
    },
    decode_WX: function(i) {
        var f = 0, c = {}, n = ytkUtils.byteArray2hexStr(i);
        ytkUtils.showLog("当前接受包的数据:", n);
        var d = ytkUtils.hexStr2byteArray(n);
        if (d.byteLength > 1 && 254 == d[0] && 1 == d[1] && 1 == u ? (u = !1, t = (255 & d[2]) << 8,
        t += 255 & d[3], o = n) : o += n, "2713" != o.substring(8, 12) && o.length / 2 >= t) {
            ytkUtils.showLog("大包长度：", t, o.length), u = !0, r += 1;
            var v = ytkUtils.hexStr2byteArray(o), b = {}, l = 0, g = 0, h = 0;
            for (b.FixHead = {}, b.FixHead.MagicNumber = o.substr(2 * l, 2), l++, b.FixHead.Ver = o.substring(2 * l, 2),
            l++, b.FixHead.Len = (v[l] << 8) + v[l + 1], l += 2, b.FixHead.CmdId = (v[l] << 8) + v[l + 1],
            l += 2, b.FixHead.Seq = (v[l] << 8) + v[l + 1], l += 2, b.ProtoBuf = {}, b.ProtoBuf.BaseRequest = {},
            b.ProtoBuf.BaseRequest.Mark = o.substr(2 * l, 2), l++, g = 0, h = 0; 128 == (128 & v[l]); ) g += (127 & v[l]) << 7 * h,
            l++, h++;
            for (g += (127 & v[l]) << 7 * h, l++, b.ProtoBuf.BaseRequest.Data = o.substr(2 * l, 2 * g),
            l += g, b.ProtoBuf.Data = {}, b.ProtoBuf.Data.Mark = o.substr(2 * l, 2), l++, g = 0,
            h = 0; 128 == (128 & v[l]); ) g += (127 & v[l]) << 7 * h, l++, h++;
            for (g += (127 & v[l]) << 7 * h, l++, b.ProtoBuf.Data.Data = o.substr(2 * l, 2 * g),
            l += g, b.ProtoBuf.DataType = {}, b.ProtoBuf.DataType.Mark = o.substr(2 * l, 2),
            l++, g = 0, h = 0; 128 == (128 & v[l]); ) g += (127 & v[l]) << 7 * h, l++, h++;
            g += (127 & v[l]) << 7 * h, l++, b.ProtoBuf.DataType.Varint = g;
            for (var D = ytkUtils.hexStr2byteArray(b.ProtoBuf.Data.Data), y = 1; y < D.byteLength - 1; y++) f ^= D[y];
            console.log("byteDataContent  length  :" + D.byteLength), console.log("decode_WX bcc:" + f),
            console.log(o.substring(0, 12)), "fe01001a2711" != o.substring(0, 12) && (D[D.byteLength - 1] == f ? (128 == (128 & D[2]) && (a = 1 + (127 & D[2]),
            ytkUtils.showLog("总共:", a, "大包")), s += b.ProtoBuf.Data.Data.substr(8, 2 * D[3]),
            ytkUtils.showLog("第", r, " 包校验bcc:ok!")) : (ytkUtils.showError("第", r, " 包校验bcc:Error!"),
            ytkUtils.showLog("接受完第", r, "大包数据，内容 ", o), c.serviceCode = -1, c.serviceInfo = "校验错误。。。")),
            ytkUtils.showLog("接受完第", r, "大包数据，内容 ", o);
        }
        return "fe01001a2711" != o.substring(0, 12) && "2713" != o.substring(8, 12) ? r >= a ? (c.serviceCode = 0,
        c.serviceInfo = "数据接收完成！", c.serviceData = {}, c.serviceData.strData = s, c) : (c.serviceCode = 1,
        c.serviceInfo = "数据接收中。。。", c) : "fe01001a2711" == o.substring(0, 12) && 0 == r ? (c.serviceCode = 1,
        c.serviceInfo = "数据接收中。。。", c) : "fe01001a2711" == o.substring(0, 12) && 1 == r ? (c.serviceCode = 0,
        c.serviceInfo = "数据接收完成！", c.serviceData = {}, c.serviceData.strData = o, c) : "2713" == o.substring(8, 12) ? (c.serviceCode = 0,
        c.serviceInfo = "数据接收完成！", c.serviceData = {}, c.serviceData.strData = o, c) : void 0;
    },
    init: function() {
        t = 0, r = 0, o = "", s = "", u = !0;
    }
};
