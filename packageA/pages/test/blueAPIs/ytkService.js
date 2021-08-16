import ytkUtils from './ytkUtils'
var t = void 0, s = void 0, o = "", n = [],
    r = "0000FF17-0000-1000-8000-00805F9B34FB",
    a = "0000FF03-0000-1000-8000-00805F9B34FB",
    f = "0000FF02-0000-1000-8000-00805F9B34FB",
    u = "0000FEE7-0000-1000-8000-00805F9B34FB",
    v = "0000FEC8-0000-1000-8000-00805F9B34FB",
    d = "0000FEC7-0000-1000-8000-00805F9B34FB";

function e(e, t, s, n) {
    var r = {};
    ytkUtils.showLog("deviceId:" + e + "  deviceName:" + t), null != t && (o = e, wx.createBLEConnection({
        deviceId: o,
        success: function (e) {
            ytkUtils.showLog("已连接,开始使能服务", o), c(s, function (e) {
                0 == e.serviceCode ? ((r = e).serviceInfo = o + "已连接,并使能成功!", "function" == typeof n && n(r)) : ((r = e).serviceInfo = "连接成功，但服务使能失败!",
                "function" == typeof n && n(r));
            });
        },
        fail: function (e) {
            ytkUtils.showError(e), (r = e).serviceInfo = "连接失败!", "function" == typeof n && n(r);
        }
    }));
}

function c(e, c) {
    var t = {};
    wx.getBLEDeviceServices({
        deviceId: o,
        success: function (s) {
            for (var n = "", l = "", h = 0; h < s.services.length; h++) {
                var C = s.services[h].uuid;
                C == r ? l = C : C == u && (n = C);
            }
            "" != l && l == r ? wx.getBLEDeviceCharacteristics({
                deviceId: o,
                serviceId: l,
                success: function (s) {
                    for (var n = 0, u = 0; u < s.characteristics.length; u++) {
                        var v = s.characteristics[u].uuid;
                        v == a ? n++ : v == f && n++;
                    }
                    n < 2 ? (t.serviceCode = -1, t.serviceInfo = "getBLEDeviceCharacteristics temp<2!",
                    "function" == typeof c && c(t)) : wx.notifyBLECharacteristicValueChange({
                        deviceId: o,
                        serviceId: r,
                        characteristicId: a,
                        state: !0,
                        success: function (s) {
                            ytkUtils.setDeviceType(0, e), t.serviceCode = 0, t.serviceInfo = "enable success!",
                            "function" == typeof c && c(t);
                        },
                        fail: function () {
                            t.serviceCode = -2, t.serviceInfo = "notifyBLECharacteristicValueChange fail!",
                            "function" == typeof c && c(t);
                        }
                    });
                },
                fail: function () {
                    t.serviceCode = -3, t.serviceInfo = "getBLEDeviceCharacteristics fail!", "function" == typeof c && c(t);
                }
            }) : "" == l && n == u ? wx.getBLEDeviceCharacteristics({
                deviceId: o,
                serviceId: n,
                success: function (s) {
                    for (var n = 0, r = 0; r < s.characteristics.length; r++) {
                        var a = s.characteristics[r].uuid;
                        a == v ? n++ : a == d && n++;
                    }
                    n < 2 ? (t.serviceCode = -1, t.serviceInfo = "getBLEDeviceCharacteristics temp<2!",
                    "function" == typeof c && c(t)) : wx.notifyBLECharacteristicValueChange({
                        deviceId: o,
                        serviceId: u,
                        characteristicId: v,
                        state: !0,
                        success: function (s) {
                            ytkUtils.setDeviceType(1, e), t.serviceCode = 0, t.serviceInfo = "enable success!",
                            "function" == typeof c && c(t);
                        },
                        fail: function () {
                            t.serviceCode = -2, t.serviceInfo = "notifyBLECharacteristicValueChange fail!",
                            "function" == typeof c && c(t);
                        }
                    });
                },
                fail: function () {
                    t.serviceCode = -3, t.serviceInfo = "getBLEDeviceCharacteristics fail!", "function" == typeof c && c(t);
                }
            }) : (t.serviceCode = -4, t.serviceInfo = "UNdiscover the service!", "function" == typeof c && c(t));
        },
        fail: function () {
            t.serviceCode = -5, t.serviceInfo = "getBLEDeviceServices fail!", "function" == typeof c && c(t);
        }
    });
}
wx.onBLECharacteristicValueChange(function (e) {
    ytkUtils.showLog("有回复"), 1 == t && s(e.value);
})

export default {
    reallyConnect: function (e) {
        ytkUtils.showLog("/***********扫描设备开始 *************/");
        var c = new Date();
        console.log("***********扫描设备开始时间 *************", c.getSeconds()), n = [], wx.startBluetoothDevicesDiscovery({
            success: function (c) {
                wx.onBluetoothDeviceFound(function (c) {
                    for (var i = 0; i < c.devices.length; i++) {
                        for (var t = !1, s = 0; s < n.length; s++) if (c.devices[i].deviceId == n[s].deviceId) {
                            t = !0;
                            break;
                        }
                        0 == t && (n.push(c.devices[i]), c.devices[i].name, "function" == typeof e && e(n));
                    }
                });
            }
        });
    },
    reallyDisConnect: function (e) {
        var c = {};
        wx.closeBLEConnection({
            deviceId: o,
            success: function (e) {
                ytkUtils.showLog("closeBLEConnection:", o);
            }
        }),
            wx.closeBluetoothAdapter({
                success: function (t) {
                    ytkUtils.showLog("closeBluetoothAdapter", o), c.serviceCode = 0, c.serviceInfo = "蓝牙已断开!",
                    "function" == typeof e && e(c);
                }
            });
    },
    _writeBLECharacteristicValue: function (e, c) {
        var t = {};
        0 == ytkUtils.getDeviceType() ? wx.writeBLECharacteristicValue({
            deviceId: o,
            serviceId: r,
            characteristicId: f,
            value: e,
            success: function (e) {
                ytkUtils.showLog("writeBLECharacteristicValue success", e.errMsg), t.serviceCode = 0,
                    t.serviceInfo = e.errMsg, "function" == typeof c && c(t);
            }
        }) : 1 == ytkUtils.getDeviceType() ? wx.writeBLECharacteristicValue({
            deviceId: o,
            serviceId: u,
            characteristicId: d,
            value: e,
            success: function (e) {
                ytkUtils.showLog("writeBLECharacteristicValue success", e.errMsg), t.serviceCode = 0,
                    t.serviceInfo = e.errMsg, "function" == typeof c && c(t);
            }
        }) : (t.serviceCode = -1, t.serviceInfo = "getDeviceType is fail", "function" == typeof c && c(t));
    },
    _SetDataListenerCallBack: function (e, c) {
        1 == e ? (t = !0, s = c) : 0 == e && (t = !1);
    },
    stopScan: function (c, i, t, s) {
        wx.stopBluetoothDevicesDiscovery({
            success: function (o) {
                e(c, i, t, function (e) {
                    "function" == typeof s && s(e);
                });
            }
        });
    },
    connectToDev: e
};
