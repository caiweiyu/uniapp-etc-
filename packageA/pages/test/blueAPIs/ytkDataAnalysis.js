import ytkUtils from './ytkUtils'
function e(e) {
    var t = ytkUtils.hexStr2byteArray(e), a = {}, s = 0, i = 0, c = t.byteLength;
    if (c >= 4) {
        for (;s < c; ) {
            var l = t[s++];
            if (128 == (128 & t[s])) {
                var n = 15 & t[s++];
                1 == n ? i = t[s] : 2 == n && (i = t[s++] << 8, i += t[s]);
            } else i = t[s];
            if (s += i - 1, ytkUtils.showLog("WJ9000校验第" + l + "条：", t[s], t[s + 1]), 144 != t[s] || 0 != t[s + 1]) {
                a.serviceCode = -1, a.serviceInfo = "WJ第" + l + "包APDU非9000";
                break;
            }
            s += 2, a.serviceCode = 0, a.serviceInfo = "9000认证成功";
        }
        return a;
    }
    return a.serviceCode = -2, a.serviceInfo = "9000认证失败，长度有误", a;
}
export default {
    analysisCardInfo: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (55 == i) {
            var l = a.slice(2, 10), n = a.slice(10, 11), o = a.slice(11, 12), y = a.slice(12, 14), d = a.slice(14, 22), u = a.slice(22, 26), f = (a.slice(26, 30),
            a.slice(30, 42)), v = a.slice(42, 43), h = a.slice(43, 44), b = a.slice(44, 45), S = a.slice(49, 53), A = parseInt((255 & S[0]) << 24);
            return A += parseInt((255 & S[1]) << 16), A += parseInt((255 & S[2]) << 8), A += parseInt(255 & S[3]),
            ytkUtils.showLog("cardIssuerID：", ytkUtils.byteArray2hexStr(l), "bindedPlate", ytkUtils.byteArray2hexStr(f), "balance:", A),
            s.serviceCode = 0, s.serviceInfo = "获取卡片信息成功", s.serviceData = {}, s.serviceData.cardIssuerID = ytkUtils.byteArray2hexStr(l),
            s.serviceData.cardType = ytkUtils.byteArray2hexStr(n), s.serviceData.cardVersion = ytkUtils.byteArray2hexStr(o),
            s.serviceData.roadswebID = ytkUtils.byteArray2hexStr(y), s.serviceData.cardNo = ytkUtils.byteArray2hexStr(d),
            s.serviceData.SignedDate = ytkUtils.byteArray2hexStr(u), s.serviceData.bindedPlate = ytkUtils.byteArray2hexStr(f),
            s.serviceData.userType = ytkUtils.byteArray2hexStr(v), s.serviceData.vehColor = ytkUtils.byteArray2hexStr(h),
            s.serviceData.vehType = ytkUtils.byteArray2hexStr(b), s.serviceData.intbalance = A,
            s.card0015 = t.substring(4, 90), s;
        }
        return s.serviceCode = -3, s.serviceInfo = "获取卡片信息失败，信息长度有误", s;
    },
    analysisDeviceInfo: function(e) {
        var t = ytkUtils.hexStr2byteArray(e), a = {}, s = 0, i = t.byteLength, c = t[s++];
        switch (ytkUtils.showLog(e), c) {
          case 192:
            if (17 == i) {
                var l = t.slice(1);
                return ytkUtils.showLog("deviceSN:", ytkUtils.byteArray2hexStr(l)), a.serviceCode = 0,
                a.serviceInfo = "获取设备信息成功", a.serviceData = {}, a.serviceData.deviceSN = ytkUtils.byteArray2hexStr(l),
                a;
            }
            return a.serviceCode = -1, a.serviceInfo = "获取设备信息失败，信息长度有误", a;

          case 204:
            if (17 == i) {
                var n = t.slice(1, 3), o = t.slice(3, 4), y = t.slice(4, 12), d = t.slice(12, 16), u = t.slice(16);
                return ytkUtils.showLog("deviceSN:", ytkUtils.byteArray2hexStr(y), "bleMac:", ytkUtils.byteArray2hexStr(d), "flag:", ytkUtils.byteArray2hexStr(u)),
                a.serviceCode = 0, a.serviceInfo = "获取设备信息成功", a.serviceData = {}, a.serviceData.verId = ytkUtils.byteArray2hexStr(n),
                a.serviceData.battery = ytkUtils.byteArray2hexStr(o), a.serviceData.deviceSN = ytkUtils.byteArray2hexStr(y),
                a.serviceData.bleMac = ytkUtils.byteArray2hexStr(d), a.serviceData.flag = u, a;
            }
            return a.serviceCode = -1, a.serviceInfo = "获取设备信息失败，信息长度有误", a;

          default:
            return a.serviceCode = -2, a.serviceInfo = "获取设备信息失败，指令类型有误", ytkUtils.showError("WJ获取设备信息失败:", "指令类型有误"),
            a;
        }
    },
    analysisInitInfo: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (20 == i) {
            var l = a.slice(2, 6), n = a.slice(6, 8), o = a.slice(8, 9), y = a.slice(9, 10), d = a.slice(10, 14), u = a.slice(14, 18), f = parseInt((255 & l[0]) << 24);
            return f += parseInt((255 & l[1]) << 16), f += parseInt((255 & l[2]) << 8), f += parseInt(255 & l[3]),
            ytkUtils.showLog("intbalance：", f, "pseudoRand:", ytkUtils.byteArray2hexStr(d), "Mac1:", ytkUtils.byteArray2hexStr(u), "CardSeq:", ytkUtils.byteArray2hexStr(n)),
            s.serviceCode = 0, s.serviceInfo = "解析圈存初始化成功", s.serviceData = {}, s.serviceData.intbalance = f,
            s.serviceData.CardSeq = ytkUtils.byteArray2hexStr(n), s.serviceData.keyVersion = ytkUtils.byteArray2hexStr(o),
            s.serviceData.algTag = ytkUtils.byteArray2hexStr(y), s.serviceData.pseudoRand = ytkUtils.byteArray2hexStr(d),
            s.serviceData.Mac1 = ytkUtils.byteArray2hexStr(u), s;
        }
        return s.serviceCode = -3, s.serviceInfo = "解析圈存初始化失败，信息长度有误", s;
    },
    analysisLoadCreadit: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (8 == i) {
            var l = a.slice(2, 6);
            return ytkUtils.showLog("TAG", ytkUtils.byteArray2hexStr(l)), s.serviceCode = 0,
            s.serviceInfo = "圈存成功", s.serviceData = {}, s.serviceData.TAG = ytkUtils.byteArray2hexStr(l),
            s;
        }
        return s.serviceCode = -3, s.serviceInfo = "圈存解析失败，长度有误", s;
    },
    analysisgetObuSysInfo: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (31 == i) {
            var l = a.slice(2, 10), n = a.slice(10, 11), o = a.slice(11, 12), y = a.slice(12, 20), d = a.slice(20, 24), u = a.slice(24, 28), f = a.slice(28, 29);
            return ytkUtils.showLog("contractProvider", ytkUtils.byteArray2hexStr(l), "contractSerialNumber", ytkUtils.byteArray2hexStr(y), "issueFlag", ytkUtils.byteArray2hexStr(f)),
            s.serviceCode = 0, s.serviceInfo = "获取OBU系统成功", s.serviceData = {}, s.serviceData.contractProvider = ytkUtils.byteArray2hexStr(l),
            s.serviceData.contractType = ytkUtils.byteArray2hexStr(n), s.serviceData.contractVersion = ytkUtils.byteArray2hexStr(o),
            s.serviceData.contractSerialNumber = ytkUtils.byteArray2hexStr(y), s.serviceData.contractSignedDate = ytkUtils.byteArray2hexStr(d),
            s.serviceData.contractExpiredDate = ytkUtils.byteArray2hexStr(u), s.serviceData.issueFlag = ytkUtils.byteArray2hexStr(f),
            s.obuSysEF01 = t.substring(4, t.length - 4), s;
        }
        return s.serviceCode = -1, s.serviceInfo = "OBU系统信息解析失败，长度有误", s;
    },
    analysisGetRand: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (8 == i) {
            var l = a.slice(2, 6);
            return ytkUtils.showLog("rand", ytkUtils.byteArray2hexStr(l)), s.serviceCode = 0,
            s.serviceInfo = "获取随机数成功", s.serviceData = {}, s.serviceData.rand = ytkUtils.byteArray2hexStr(l),
            s;
        }
        return s.serviceCode = -1, s.serviceInfo = "获取随机数失败，长度有误", s;
    },
    _analysisIs9000: e,
    analysisVehCipherInfo: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (i >= 3) {
            var l = a.slice(2, i - 2);
            return ytkUtils.showLog("cipherVehInfo", ytkUtils.byteArray2hexStr(l)), s.serviceCode = 0,
            s.serviceInfo = "获取密文车辆信息成功", s.serviceData = {}, s.serviceData.cipherVehInfo = ytkUtils.byteArray2hexStr(l),
            s;
        }
        return s.serviceCode = -1, s.serviceInfo = "获取密文车辆信息失败，长度有误", s;
    },
    analysisCardOwnerRecord: function(t) {
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (59 == i) {
            var l = a.slice(2, 3), n = a.slice(3, 4), o = a.slice(4, 24), y = a.slice(24, 56), d = a.slice(56, 57);
            return ytkUtils.showLog("ownerName：", ytkUtils.byteArray2hexStr(o), "ownerLicenseNumber：", ytkUtils.byteArray2hexStr(y), "ownerLicenseType:", d),
            s.serviceCode = 0, s.serviceInfo = "获取持卡人信息成功", s.serviceData = {}, s.serviceData.ownerId = ytkUtils.byteArray2hexStr(l),
            s.serviceData.staffId = ytkUtils.byteArray2hexStr(n), s.serviceData.ownerName = ytkUtils.byteArray2hexStr(o),
            s.serviceData.ownerLicenseNumber = ytkUtils.byteArray2hexStr(y), s.serviceData.ownerLicenseType = ytkUtils.byteArray2hexStr(d),
            s;
        }
        return s.serviceCode = -3, s.serviceInfo = "获取持卡人信息失败，信息长度有误", s;
    },
    analysisCardTransactionRecord: function(e) {
        var t = ytkUtils.hexStr2byteArray(e), a = {}, s = t.byteLength, i = 0;
        if (s >= 4) {
            for (a.serviceCode = 0, a.serviceInfo = "获取交易记录信息成功", a.serviceData = {}, a.serviceData.CardTransactionRecordData = []; i < s; ) {
                var c = t[i++], l = t[i] - 1;
                if (ytkUtils.showLog("WJ9000校验第" + c + "条：", t[i + l], t[i + l + 1]), 144 != t[i + l] || 0 != t[i + l + 1]) break;
                var n = {};
                i++, n.onlineSn = t.slice(2, 4), i += 2, n.overdrawLimit = t.slice(4, 7), i += 3,
                n.transAmount = t.slice(7, 11), i += 4, n.transType = t.slice(11, 12), i += 1, n.terminalNo = t.slice(12, 18),
                i += 6, n.transDate = t.slice(18, 22), i += 4, n.transTime = t.slice(22, 25), i += 3,
                i += 2, a.serviceData.CardTransactionRecordData.push(n), console.log("cardTransactionRecordBean：", n, i);
            }
            return console.log("交易记录：", a), a;
        }
        return a.serviceCode = -3, a.serviceInfo = "获取交易记录失败，信息长度有误", a;
    },
    analysisgetCardConsumeRecord: function(e) {
        var t = ytkUtils.hexStr2byteArray(e), a = {}, s = t.byteLength, i = 0;
        if (s >= 4) {
            for (a.serviceCode = 0, a.serviceInfo = "获取过站信息成功", a.serviceData = {}, a.serviceData.CardConsumeRecordData = []; i < s; ) {
                var c = t[i++], l = t[i] - 1;
                if (ytkUtils.showLog("WJ9000校验第" + c + "条：", t[i + l], t[i + l + 1]), 144 != t[i + l] || 0 != t[i + l + 1]) break;
                var n = {};
                i++, n.tollRoadNetworkId = t.slice(2, 4), i += 2, n.tollStationId = t.slice(4, 6),
                i += 2, n.tollLaneId = t.slice(6, 7), i += 1, n.timeUnix = t.slice(7, 11), i += 4,
                n.vehicleModel = t.slice(11, 12), i += 1, n.passStatus = t.slice(12, 13), i += 1,
                n.reserve1 = t.slice(13, 22), i += 9, n.staffNo = t.slice(22, 25), i += 3, n.mtcSequenceNo = t.slice(25, 26),
                i += 1, n.staffNo = t.slice(26, 38), i += 12, n.mtcSequenceNo = t.slice(38, 42),
                i += 4, i += 2, a.serviceData.CardConsumeRecordData.push(n), console.log("cardConsumeRecordBean", n, i);
            }
            return console.log("过站信息：", a), a;
        }
        return a.serviceCode = -3, a.serviceInfo = "获取过站信息失败，信息长度有误", a;
    },
    analysisgeEF1DVehInfoInfo: function(t) {
        console.log(" analysisgeEF1DVehInfoInfo :" + t);
        var a = ytkUtils.hexStr2byteArray(t), s = {}, i = a.byteLength, c = e(t);
        if (0 != c.serviceCode) return s = c;
        if (console.log("allLenVaildData :" + i), 133 == i) {
            var l = a.slice(3, 4), n = a.slice(4, 12), o = a.slice(12, 13), y = a.slice(13, 30), d = a.slice(30, 42), u = a.slice(42, 44), f = a.slice(44, 45), v = a.slice(45, 46), h = a.slice(46, 50), b = a.slice(50, 51), S = a.slice(51, 52), A = a.slice(52, 54), D = a.slice(54, 57), x = a.slice(57, 73), g = a.slice(73, 89), I = a.slice(89, 90), C = a.slice(90, 98), L = a.slice(98, 106), p = a.slice(106, 130);
            return ytkUtils.showLog("bindedPlate", ytkUtils.byteArray2hexStr(d), "vehWheels", ytkUtils.byteArray2hexStr(b), "SN", ytkUtils.byteArray2hexStr(n)),
            s.serviceCode = 0, s.serviceInfo = "获取EF1D 车辆成功", s.serviceData = {}, s.serviceData.version = ytkUtils.byteArray2hexStr(l),
            s.serviceData.SN = ytkUtils.byteArray2hexStr(n), s.serviceData.vehPerformance = ytkUtils.byteArray2hexStr(o),
            s.serviceData.VIN = ytkUtils.byteArray2hexStr(y), s.serviceData.bindedPlate = ytkUtils.byteArray2hexStr(d),
            s.serviceData.vehColor = ytkUtils.byteArray2hexStr(u), s.serviceData.vehType = ytkUtils.byteArray2hexStr(f),
            s.serviceData.userType = ytkUtils.byteArray2hexStr(v), s.serviceData.vehSize = ytkUtils.byteArray2hexStr(h),
            s.serviceData.vehWheels = ytkUtils.byteArray2hexStr(b), s.serviceData.VehAxle = ytkUtils.byteArray2hexStr(S),
            s.serviceData.wheelbase = ytkUtils.byteArray2hexStr(A), s.serviceData.vehLoad = ytkUtils.byteArray2hexStr(D),
            s.serviceData.vehDescription = ytkUtils.byteArray2hexStr(x), s.serviceData.engineNumber = ytkUtils.byteArray2hexStr(g),
            s.serviceData.VehHeadHigh = ytkUtils.byteArray2hexStr(I), s.serviceData.VMAC = ytkUtils.byteArray2hexStr(C),
            s.serviceData.VMAC2 = ytkUtils.byteArray2hexStr(L), s.serviceData.reserve = ytkUtils.byteArray2hexStr(p),
            s.obuVehEF1D = t.substring(6, t.length - 4), s;
        }
        return s.serviceCode = -1, s.serviceInfo = "OBU系统信息解析失败，长度有误", s;
    },
    analysisObuId: function(e) {
        for (var r = "", t = 0; t < parseInt(e.length / 2); t++) r += +(48 ^ parseInt(e.slice(2 * t, 2 * (t + 1)), 16));
        return r;
    },
    analysisPlate: function(e, t) {
        var a = e.toUpperCase();
        a.indexOf("0", 16);
        console.log("palteStr:" + a), console.log("vehClolor:" + t);
        var s = ytkUtils.decodeFromGb2312("%" + a.substring(0, 2) + "%" + a.substring(2, 4) + "%" + a.substring(4, 6) + "%" + a.substring(6, 8) + "%" + a.substring(8, 10) + "%" + a.substring(10, 12) + "%" + a.substring(12, 14) + "%" + a.substring(14, 16) + "%" + a.substring(16, 18) + "%" + a.substring(18, 20));
        return console.log(s), s.replace(/\u0000/g, "");
    }
};
