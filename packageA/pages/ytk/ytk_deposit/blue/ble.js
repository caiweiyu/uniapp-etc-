/**
 * @Description: 蓝牙
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import BLEHandler from "@/packageA/pages/ytk/ytk_deposit/blue/bleHandler"
class BLE extends BLEHandler {
    constructor(emitter,blename) {
        super(emitter,blename)
    }
    listen(callback) {
        // 蓝牙事件注册,打开channel
        this.emitter.removeAllListeners("channel")
        console.log('watchBLE-callback-1',typeof callback)
        this.emitter.on("channel", callback)
    }
    removeListen() {
        // 移除所有蓝牙事件
        this.emitter.removeAllListeners("channel")
    }
    async getDev() {
        let deviceIds = []
        // 打开蓝牙适配器状态监听
        this.onBLEConnectionStateChange()
        // 蓝牙适配器初始化
        await this.openAdapter()
        // 搜索蓝牙设备
        await this.startSearch()
        // 获取设备ID
        deviceIds = await this.onBluetoothFound()
        // 停止搜索设备
        await this.stopSearchBluetooth()
        return deviceIds

    }
    async setDev(deviceId) {
        // 连接蓝牙
        await this.connectBlue(deviceId);
        // 获取serviceId
        await this.getBLEServices()
        // 设置特征值
        await this.getCharacteristics();
        // 订阅特征值
        //await this.notifyBLECharacteristicValueChange()
        // 打开传输监听，等待设备反馈数据
        this.onBLECharacteristicValueChange()
    }
    // 发送指令
    async send(mudata, cmd) {
        let flow = await this.sentOrder(mudata, cmd)
        return flow
    }
    async close() {
        await this.closeBLEConnection()
        await this.closeBLEAdapter()
    }
}

export { BLE };
