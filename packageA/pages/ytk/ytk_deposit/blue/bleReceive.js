/**
 * @Description: 微信BLE蓝牙收包组包
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";
class BLEReceive {
    constructor(emitter,devType) {
        this.emitter = emitter;
        this.devType = devType; // 0:国密 1:非国密
        this.sendData = [];
        this.isHeadPackage = true;
        /**是否为第一个数据包*/
        this.packageLength = 0;
        /**数据包的长度*/
        this.len = 0;
        /**计算包数据长度,用于判断是否是最后一个数据包*/
        this.nCmdId=0
    }

    //判断是否为第一个数据包
    isFirstPackage(data) {
        if (this.devType === 0) {
            return (Util.byte2Integer255(data[0]) === 0x50 && data.length >= 5);
        } else if (this.devType === 1) {
            return (Util.byte2Integer255(data[0]) === 0xfe && Util.byte2Integer255(data[1]) === 0x01) //Util.byte2Integer255(data[0]) === 0xfe && Util.byte2Integer255(data[1]) === 0x01
        }
    }
    //判断是否为最后一个数据包
    isLastPackage() {
        if (this.devType === 0) {
            return (this.len === this.packageLength + 5);
        } else if (this.devType === 1) {
            if(this.len === this.packageLength){
                // let data = this.sendData.slice(8, this.sendData.length);
                // let v = data.length
                // if (v > 127) {
                //     data = data.slice(5, data.length - 2);
                // } else {
                //     data = data.slice(4, data.length - 2);
                // }
                // this.sendData = data
                return true
            }
            return false
        }
    }

    //判断收到的数据包是否异常
    isErrorPackage() {
        if (this.devType === 0) {
            return (this.len > this.packageLength + 5);
        } else if (this.devType === 1) {
            return (this.len > this.packageLength)
        }
    }

    //数据包存入缓冲区
    addSendData(data) {
        data.map((item, index) => {
            this.sendData.push(item)
        })
    }

    //重置
    resets() {
        this.isHeadPackage = true;
        this.packageLength = 0;
        this.len = 0;
        this.sendData = [];
        this.nCmdId = 0;
    }

    receiveData(data) {
        Util.print('receiveData  data = ' + Util.bytes2HexString(data))
        //Util.print('this.devType = ' + this.devType)
        if (this.isHeadPackage) {
            //Util.print('receiveData  1 ')
            if (this.isFirstPackage(data)) {
                this.resets();
                //Util.print('receiveData  2 ')
                this.isHeadPackage = false;
                if (this.devType === 0) {
                    //Util.print('receiveData  3 ')
                    this.packageLength = parseInt((data[3] & 0xFF) + "", 10)
                } else if (this.devType === 1) {
                    //Util.print('receiveData  4 ')
                    let FixHead = {}
                    FixHead.bMagicNumber = data[0]
                    FixHead.bVer = data[1]
                    FixHead.nLength = parseInt(((data[2] << 8 | data[3]) & 0xFFFF) + "", 10)
                    FixHead.nCmdId = parseInt(((data[4] << 8 | data[5]) & 0xFFFF) + "", 10)
                    FixHead.nSeq = parseInt(((data[6] << 8 | data[7]) & 0xFFFF) + "", 10)
                    console.log('FixHead',FixHead)
                    this.nCmdId = FixHead.nCmdId
                    this.packageLength = parseInt(((data[2] << 8 | data[3]) & 0xFFFF) + "", 10)
                }
                this.len = 0;
            } else {
                Util.print('receiveData  err ')
                return;
            }
        }
        //Util.print('receiveData  5 ')
        this.len += data.length;
        this.addSendData(data);
        if (this.isLastPackage()) {
            if(this.devType === 1){
                Util.print('--------------nCmdId-----------: ' + this.nCmdId.toString(16))
                if(this.nCmdId===10001){ //需要登录 2711
                    this.emitter.emit("channel", {
                        type: "authEncode",
                        code: "0",
                        data: '需要登录'
                    })
                    this.resets();
                    return;
                }else if(this.nCmdId===10003){//需要初始化 2713
                    this.emitter.emit("channel", {
                        type: "initEncode",
                        code: "0",
                        data: '需要初始化'
                    })
                    this.resets();
                    return;
                }else if(this.nCmdId===10002){// 2712
                    this.emitter.emit("channel", {
                        type: "packageData",
                        code: "0",
                        data: this.sendData
                    })
                }
                this.resets();
            }else if(this.devType === 0){
                this.emitter.emit("channel", {
                    type: "packageData",
                    code: "0",
                    data: this.sendData
                })
                this.resets();
            }

        } else if (this.isErrorPackage()) {
            this.resets();
        }
    }
}
export { BLEReceive };
