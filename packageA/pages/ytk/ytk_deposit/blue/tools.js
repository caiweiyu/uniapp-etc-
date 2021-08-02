/**
 * @Description: 微信蓝牙api
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import errToString from "@/packageA/pages/ytk/ytk_deposit/blue/error";
import { print } from "@/packageA/pages/ytk/ytk_deposit/blue/util";
function _openAdapter() {
    print(`准备初始化蓝牙适配器...`);
    return wx.openBluetoothAdapter().then(
        (res) => {
            print(`✔ 适配器初始化成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 初始化失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 * @param {Array<string>} services
 * @param { Int } interval
 */
function _startSearch() {
    print(`准备搜寻附近的蓝牙外围设备...`);
    return promisify(wx.startBluetoothDevicesDiscovery, {
        interval: 1000,
		allowDuplicatesKey:true
    }).then(
        (res) => {
            print(`✔ 搜索成功!`);
            return [null, res]

        },
        (err) => {
            print(`✘ 搜索蓝牙设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

/**
 *@param {Array<string>} devices
 *@deviceId 设备ID
 */
function _onBluetoothFound() {
    print(`监听搜寻新设备事件...`);
    return _onBluetoothFound_promise.call(this).then(res => {
        print(`✔ 设备ID找到成功!`);
        return [null, res]
    }, err => {
        print(`✘ 设备ID找到失败!`);
        return [errToString(err), null]

    })
}

/**
 * @param {Array} devices 查找到设备数组
 * @param {int} count 计数器-嗅探2次
 */
function _onBluetoothFound_promise() {
    let devices = []
    let count = 0
    return new Promise((resolve, reject) => {
        wx.onBluetoothDeviceFound(res => {
            console.log('res- : ',res)
            res.devices.forEach(device => {
                if (!!device.localName) {
                    if(device.advertisData!=null){
                        let bf = device.advertisData.slice(2, 8);
                        let mac = Array.prototype.map.call(new Uint8Array(bf), x => ('00' + x.toString(16)).slice(-2)).join(':');
                        device.mac= mac.toUpperCase()
                        console.log('mac- : ',device.mac);
                    }
                    devices.push(device)
                    count++
                }
            })
            if(count >= 1){
                resolve(devices)
            }



            // devices.push(...res.devices)
            // count++
            // if (count > 1) {
            //     devices.forEach(element => {
            //         // if ((element.name && element.name == this.blename) || (element.localName && element.localName == this.blename)) {
            //         //     this.deviceId = element.deviceId
            //         //     resolve(res)
            //         // }
            //     });
            //     reject('device not found')
            // }

            print(`已嗅探蓝牙设备数：${devices.length}...`)
        }, err => {
            reject(err)
        })
    })
}

function _stopSearchBluetooth() {
    print(`停止查找新设备...`);
    return wx.stopBluetoothDevicesDiscovery().then(
        (res) => {
            print(`✔ 停止查找设备成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 停止查询设备失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _connectBlue() {
    print(`准备连接设备...`);
    return promisify(wx.createBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => {
            print(`✔ 连接蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 连接蓝牙失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _closeBLEConnection() {
    print(`断开蓝牙连接...`)
    return promisify(wx.closeBLEConnection, {
        deviceId: this.deviceId,
    }).then(
        (res) => {
            print(`✔ 断开蓝牙成功！`);
            return [null, res]
        },
        (err) => {
            print(`✘ 断开蓝牙连接失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

function _closeBLEAdapter() {
    print(`释放蓝牙适配器...`)
    return wx.closeBluetoothAdapter().then(res => {
        print(`✔ 释放适配器成功！`)
        return [null, res]
    }, err => {
        print(`✘ 释放适配器失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

function _getBLEServices() {
    print(`获取蓝牙设备所有服务...`)
    return promisify(wx.getBLEDeviceServices, {
        deviceId: this.deviceId
    }).then(res => {
        let serviceId_0 =''
        let serviceId_1 =''
        for (let i = 0; i < res.services.length; i++) {
            if (res.services[i].isPrimary) {
                if(res.services[i].uuid === this.serviceId_0){
                    serviceId_0 = this.serviceId_0
                }
                if(res.services[i].uuid === this.serviceId_1){
                    serviceId_1 = this.serviceId_1
                }
            }
        }
        if(serviceId_0 === this.serviceId_0){
            //国密
            this.serviceId = this.serviceId_0;
            this.notifyCharacteristicId = this.characteristics_uuid_0_0;
            this.writeCharacteristicId = this.characteristics_uuid_0_1;
            this.readCharacteristicId = this.characteristics_uuid_0_1;
            this.devType = 0
        }else if(serviceId_1 === this.serviceId_1){
            //非国密
            this.serviceId = this.serviceId_1;
            this.notifyCharacteristicId = this.characteristics_uuid_1_0;
            this.writeCharacteristicId = this.characteristics_uuid_1_1;
            this.readCharacteristicId = this.characteristics_uuid_1_1;
            this.devType = 1
        }
        print(`✔ 获取service成功！`)
        return [null, res]
    }, err => {
        print(`✘ 获取service失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

function _getCharacteristics() {
    print(`开始获取特征值...`);
    return promisify(wx.getBLEDeviceCharacteristics, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
    }).then(
        (res) => {
            print(`✔ 获取特征值成功！`);
            // for (let i = 0; i < res.characteristics.length; i++) {
            //     let item = res.characteristics[i];
            //     if (item.properties.read) {
            //         this.readCharacteristicId = item.uuid;
            //         print(`readCharacteristicId:${item.uuid}`)
            //     }
            //     if (item.properties.write && !item.properties.read) {
            //         this.writeCharacteristicId = item.uuid;
            //         print(`writeCharacteristicId:${item.uuid}`)
            //     }
            //     if (item.properties.notify || item.properties.indicate) {
            //         this.notifyCharacteristicId = item.uuid;
            //         print(`notifyCharacteristicId:${item.uuid}`)
            //     }
            // }
            return [null, res]
        },
        (err) => {
            print(`✘ 获取特征值失败！${errToString(err)}`);
            return [errToString(err), null]
        }
    );
}

// 订阅特征值
function _notifyBLECharacteristicValueChange() {
    return promisify(wx.notifyBLECharacteristicValueChange, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.notifyCharacteristicId,
        state: true
    }).then(res => {
        print(`deviceId: ${this.deviceId}`)
        print(`serviceId: ${this.serviceId}`)
        print(`notifyCharacteristicId: ${this.deviceId}`)
        print(`writeCharacteristicId: ${this.writeCharacteristicId}`)
        print(`readCharacteristicId: ${this.readCharacteristicId}`)
        print(`✔ 订阅notify成功！`)
        return [null, res]
    }, err => {
        print(`✘ 订阅notify失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

function _writeBLECharacteristicValue(mudata) {
    return promisify(wx.writeBLECharacteristicValue, {
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.writeCharacteristicId,
        value: mudata,
    }).then(res => {
        print(`✔ 写入数据成功！`)
        return [null, res]
    }, err => {
        print(`✘ 写入数据失败！${errToString(err)}`)
        return [errToString(err), null]
    })
}

/**
 * 对微信接口的promise封装
 * @param {function} fn
 * @param {object} args
 */
function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        fn({
            ...(args || {}),
            success: (res) => resolve(res),
            fail: (err) => reject(err),
        });
    });
}

/**
 * 对微信接口回调函数的封装
 * @param {function} fn
 */
function promisify_callback(fn) {
    return new Promise((resolve, reject) => {
        fn(
            (res) => {
                resolve(res);
            },
            (rej) => {
                reject(rej);
            }
        );
    });
}

export {
    _getCharacteristics,
    _connectBlue,
    _getBLEServices,
    _closeBLEConnection,
    _closeBLEAdapter,
    _stopSearchBluetooth,
    _notifyBLECharacteristicValueChange,
    _onBluetoothFound,
    _startSearch,
    _openAdapter,
    _writeBLECharacteristicValue,
    promisify,
    promisify_callback,
};
