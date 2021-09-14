/**
 * @Description: 蓝牙工具类  封装小程序蓝牙流程方法 处理事件通信
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import * as t from "@/packageA/pages/ytk/ytk_deposit/blue/tools"
import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";
class BLEHandler {
    constructor(emitter,blename) {
        this.emitter = emitter
        this.blename = blename
        this.readCharacteristicId = "";
        this.writeCharacteristicId = "";
        this.notifyCharacteristicId = "";
        this.deviceId = "";
        this.serviceId = "";

        //国密
        this.serviceId_0='0000FF17-0000-1000-8000-00805F9B34FB';
        this.characteristics_uuid_0_0= '0000FF03-0000-1000-8000-00805F9B34FB';//indicate
        this.characteristics_uuid_0_1= '0000FF02-0000-1000-8000-00805F9B34FB';//write read
        //非国密
        this.serviceId_1= '0000FEE7-0000-1000-8000-00805F9B34FB';
        this.characteristics_uuid_1_0= '0000FEC8-0000-1000-8000-00805F9B34FB';//indicate
        this.characteristics_uuid_1_1= '0000FEC7-0000-1000-8000-00805F9B34FB';//write read
        this.devType = -1
    }
    async openAdapter() {
        let [err, res] = await t._openAdapter.call(this);
        if (err != null) {
            this.emitter.emit("channel", {
                type: "connect",
                code: "-2",
                data: "请开启手机蓝牙功能"
            })
            return;
        }
        return true
    }
    async startSearch() {
        let [err, res] = await t._startSearch.call(this);
        if (err != null) {
            return;
        }
        this.emitter.emit("channel", {
            type: "connect",
            code: "0",
            data: "开始搜索设备"
        })

    }
    async onBluetoothFound() {
        let [err, res] = await t._onBluetoothFound.call(this);
        if (err != null) {
            this.emitter.emit("channel", {
                type: "connect",
                code: "-2",
                data: "未找到设备"
            })
            return '';
        }
        return res
    }

    async stopSearchBluetooth() {
        let [err, res] = await t._stopSearchBluetooth.call(this);
        if (err != null) {
            return;
        }
    }
    async connectBlue(deviceId) {
        this.deviceId = deviceId;
        let [err, res] = await t._connectBlue.call(this);
        if (err != null) {
            return;
        }
    }
    async getBLEServices() {
        let [err, res] = await t._getBLEServices.call(this);
        if (err != null) {
            return;
        }
    }
    async getCharacteristics() {
        let [err, res] = await t._getCharacteristics.call(this);
        if (err != null) {
            this.emitter.emit("channel", {
                type: "connect",
                code: "-2",
                data: "蓝牙设备有误" //无法订阅特征值
            })
            // 取消连接
            this.closeBLEConnection()
            this.closeBLEAdapter()
            return;
        }
        [err, res] = await t._notifyBLECharacteristicValueChange.call(this);
        if (err != null) {
            return;
        }
        this.emitter.emit("channel", {
            type: "connect",
            code: "0",
            data: "蓝牙已连接",
            devType: this.devType
        })
        return true
    }
    async notifyBLECharacteristicValueChange() {
        let [err, res] = await t._notifyBLECharacteristicValueChange.call(this);
        if (err != null) {
            return;
        }
    }
    async closeBLEConnection() {
        let [err, res] = await t._closeBLEConnection.call(this);
        if (err != null) {
            return;
        }
    }
    async closeBLEAdapter() {
        let [err, res] = await t._closeBLEAdapter.call(this);
        if (err != null) {
            return;
        }
    }
    sleep(delay) {
        var start = (new Date()).getTime();
        while((new Date()).getTime() - start < delay) {
            continue;
        }
    }
    async sentOrder(data, cmd) {
        for (let i=0;i<data.length;i++) {
            let _this = this;
            let max_wx_frame_len =20
            let pos = 0;
            let arrayBuffer = new Uint8Array(data[i]).buffer;
            let bytes = arrayBuffer.byteLength;
            while (bytes > 0) {
                let tmpBuffer;
                if (bytes > max_wx_frame_len) {
                    tmpBuffer = arrayBuffer.slice(pos, pos + max_wx_frame_len);
                    console.log('sendBuffer: ',tmpBuffer)
                    Util.print('------sendBuffer-HexString------:'+Util.bytes2HexString(tmpBuffer));

                    pos += max_wx_frame_len;
                    bytes -= max_wx_frame_len;
                    let [err, res] = await t._writeBLECharacteristicValue.call(this, tmpBuffer)
                    if (err != null) {
                        return false
                    }
                    console.log("发送数据成功！")
                    _this.sleep(2)
                } else {
                    tmpBuffer = arrayBuffer.slice(pos, pos + bytes);
                    console.log('sendBuffer: ',tmpBuffer)
                    Util.print('------sendBuffer-HexString------:'+Util.bytes2HexString(tmpBuffer));
                    pos += bytes;
                    bytes -= bytes;
                    let [err, res] = await t._writeBLECharacteristicValue.call(this, tmpBuffer)
                    if (err != null) {
                        return false
                    }
                    console.log("最后一帧发送数据成功！")
                }
            }
        }
        return true
    }

    // 打开蓝牙适配器状态监听
    onBLEConnectionStateChange() {
        wx.onBLEConnectionStateChange(res => {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            if (!res.connected) {
                this.closeBLEAdapter()
                //wx.setStorageSync("bluestatus", "");
                this.emitter.emit("channel", {
                    type: "connect",
                    code: "-1",
                    data: "蓝牙已断开"
                })
            }
        }, err => {
            console.log('err', err)
        })
    }

    // 收到设备推送的notification
    onBLECharacteristicValueChange() {
        let lastDate = new Date().getTime()
        wx.onBLECharacteristicValueChange(res => {
            let arrbf = new Uint8Array(res.value)
            //let nowDate = new Date().getTime()
            //console.log(`收到硬件数据反馈！命令码为：${arrbf}`)
            this.emitter.emit("channel", {
                type: "response",
                code: "0",
                data: arrbf
            })
        })
    }
    _mapToArray(arrbf) {
        let arr = []
        arrbf.map(item => {
            arr.push(item)
        })
        return arr
    }
}
export default BLEHandler
