/**
 * @Description: 蓝牙圈存逻辑
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import * as bleProxy from "@/packageA/pages/ytk/ytk_deposit/blue/bleProxy";
import cmd from '@/packageA/pages/ytk/ytk_deposit/blue/cmd'
import CMDRes from "@/packageA/pages/ytk/ytk_deposit/blue/cmdRes"
import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";

class DepositCard extends CMDRes {
    constructor(emitter, ble, cmdHelper, deviceInfo) {
        super(emitter);
        this.emitter = emitter;
        this.ble = ble;
        this.cmdHelper = cmdHelper;
        this.deviceInfo = deviceInfo;
    }

    balance = 0;
    cardInfo = null;
    depositState = 0;
    /** 0:圈存正常 1:圈存半条流水 2:圈存写卡失败  3圈存成功 */
    orderId = '';
    billno = '';

    setDepositState(depositState) {
        this.depositState = depositState;
    }

    setOrderId(orderId) {
        this.orderId = orderId;
    }
    //国密划账
    loadPayV2(){
        bleProxy.loadPayV2({
            cardno: this.cardInfo.cardNum,
            deviceno: this.deviceInfo.senumber,
            orderId: this.orderId,
            balance: this.balance,
            type: 1,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data == this.orderId) {
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: 0,
                        data: 68,
                        msg: "圈存划账成功"
                    })
                    //开始圈存初始化
                    this.getinitializeinsV2()
                }
            }
        })
    }
    //非国密划账
    loadPay(){
        bleProxy.loadPay({
            cardno: this.cardInfo.cardNum,
            deviceno: this.deviceInfo.senumber,
            orderId: this.orderId,
            balance: this.balance
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data == this.orderId) {
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: 0,
                        data: 68,
                        msg: "圈存划账"
                    })
                    //获取圈存指令集
                    this.getIns()
                }
            }
        })
    }
    //国密认证1021
    secretConfirmV2(data) {
        Util.print('Guomi------国密认证1021------', data);
        bleProxy.secretConfirmV2({
            random1: data.random1,
            timestamp: data.timestamp,
            deviceno: data.deviceno,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    this.sendBlueOrders(this.cmdHelper.getVerify2Guomi(data.workkey, data.workkeyMac, data.mackey, data.mackeyMac, data.random2, data.sessionId, data.signdata))
                }
            }
        })
    }

    //获取初始化指令集（国密）
    getinitializeinsV2() {
        Util.print('Guomi------获取初始化指令集------');
        bleProxy.getinitializeinsV2({
            cardArea: this.cardInfo.cardArea,
            orderId: this.orderId,
            cardno: this.cardInfo.cardNum,
            balance: this.balance,
            deviceno: this.deviceInfo.senumber,
            billno: this.billno,//消费billno，半条流水61情况下要传值，其他情况传空
            type: 1,//圈存设备类型 1 充值宝、充值易，2 行车记录仪，3 NFC
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {//00：表示成功
                    this.sendBlueOrders(this.cmdHelper.doDepositInitGuomi(data.instructions, data.instructionsMac))
                } else if (data.code == "51") {//51：表示存在半条流水
                    this.depositState = 1
                    this.sendBlueOrders(this.cmdHelper.doDepositInitGuomi(data.instructions, data.instructionsMac))
                } else if (data.code == "61" || data.code == "73") {//61：表示存在写卡失败记录 //73：表示存在已付款未消费订单
                    this.depositState = 2
                    this.getinitializeinsV2() //获取初始化指令
                }
            }
        })
    }

    //获取圈存指令集（国密）
    getloadinsV2(data) {
        Util.print('Guomi------获取圈存指令集------', data);
        bleProxy.getloadinsV2({
            instructionResps: data.instructions,
            instructionRespsMac: data.instructionsMac,
            orderId: this.orderId,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    this.sendBlueOrders(this.cmdHelper.doDepositWriteGuomi(data.instructions, data.instructionsMac))
                }
            }
        })

    }

    //圈存确认（国密）
    loadconfirmV2(data) {
        Util.print('Guomi------圈存确认------', data);
        bleProxy.loadconfirmV2({
            instructionResps: data.instructions,
            instructionRespsMac: data.instructionsMac,
            orderId: this.orderId,
            deviceno: this.deviceInfo.senumber,
            cardno: this.cardInfo.cardNum,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {//GET_CONFIRM_GUOMI
                    this.depositState = 3
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: 0,
                        data: 90,
                        msg: "圈存确认成功，更新粤通卡信息"
                    })
                    this.sendBlueOrders(this.cmdHelper.getCardBalanceFrameGuomi())
                }
            }
        })

    }

    // //国密获取校验指令集（补全半条记录） 貌似没用上
    // getCheckInstructionV2(data) {
    //     bleProxy.getCheckInstructionV2({
    //         instructionResps: data.instructions,
    //         instructionRespsMac: data.instructionsMac,
    //         orderId: this.orderId,
    //         deviceno: this.deviceInfo.senumber,
    //         cardno: this.cardInfo.cardNum,
    //     }).then(res => {
    //         let {code, data} = res;
    //         if (code == 0) {
    //             if (data.code == "00") {//GET_CONFIRM_GUOMI
    //                 this.sendBlueOrders(this.cmdHelper.doDepositWriteGuomi(data.instructions, data.instructionsMac))
    //             }
    //         }
    //     })
    //
    // }
    //上送校验结果（补全半条记录）
    sendsignresultV2(data) {
        Util.print('Guomi------上送校验结果（补全半条记录）------', data);
        bleProxy.sendsignresultV2({
            instructionResps: data.instructions,
            instructionRespsMac: data.instructionsMac,
            orderId: this.orderId,
            deviceno: this.deviceInfo.senumber,
            cardno: this.cardInfo.cardNum,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {//00：表示成功 //GET_CONFIRM_GUOMI
                    // 补齐半条流水成功,直接显示圈存成功
                    this.depositState = 3
                    this.sendBlueOrders(this.cmdHelper.getHandshakeGuomi())//握手 重新触发获取余额
                } else if (data.code == "61") {//61：表示存在写卡失败记录
                    this.depositState = 0
                    this.billno = data.billno
                    // 获取初始化指令集
                    this.getinitializeinsV2()
                }
            }
        })
    }

    //非国密
    //第一步握手认证
    firstconfirm(data) {
        Util.print('------第一步握手认证------', data);
        bleProxy.firstconfirm({
            random1: data
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: code,
                        data: 45,
                        msg: "第一步握手认证成功"
                    })
                    this.sendBlueOrders(this.cmdHelper.getVerify2(data.serverCertificate, data.random2))
                }
            }
        })
    }

    //第二步握手认证
    secondconfirm(data) {
        Util.print('------第二步握手认证------', data);
        bleProxy.secondconfirm({
            clientCertificate: data.clientCertificate,
            masterkey: data.masterkey,
            signRandom: data.signRandom,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: 0,
                        data: 54,
                        msg: "第二步握手认证成功"
                    })
                    this.sendBlueOrders(this.cmdHelper.getVerify3(data.serverHMAC))
                }
            }
        })
    }

    //第三步握手认证
    thirdconfirm(data) {
        Util.print('------第三步握手认证------', data);
        bleProxy.thirdconfirm({
            clientHMAC: data
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    //三部握手成功
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: 0,
                        data: 63,
                        msg: "第三步握手认证成功"
                    })
                    //划账
                    this.loadPay()
                }
            }
        })
    }

    //获取粤通卡圈存初始化指令
    getIns(data) {
        Util.print('------获取粤通卡圈存初始化指令------');
        bleProxy.getIns({
            cardArea: this.cardInfo.cardArea,
            cardno: this.cardInfo.cardNum,
            balance: this.balance,
            deviceno: this.deviceInfo.senumber,
            orderId: this.orderId
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "51") {//51：表示存在半条流水
                    this.depositState = 1
                } else if (data.code == "61" || data.code == "73") {//61：表示存在写卡失败记录 //73：表示存在已付款未消费订单
                    this.depositState = 2
                }
                this.sendBlueOrders(this.cmdHelper.doDepositInit(data.instructions)) // 圈存初始化
            }
        })
    }

    //请求初始化指令集（1005）
    getinitializeins(data) {
        Util.print('------请求初始化指令集（1005）------', data);
        bleProxy.getinitializeins({
            instructionResps: data
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    this.sendBlueOrders(this.cmdHelper.doDepositWrite(data.instructions)) // 圈存写卡 CMD_DEPOSIT_WRITE
                }
            }
        })
    }

    //获取圈存指令集（1006）
    getloadins(data) {
        Util.print('------获取圈存指令集（1006）------', data);
        bleProxy.getloadins({
            instructionResps: data,
            orderId: this.orderId
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    this.sendBlueOrders(this.cmdHelper.doDepositWrite2(data.instructions)) // 圈存写卡2 CMD_DEPOSIT_WRITE2
                }
            }
        })
    }

    //圈存结果确认
    loadconfirm(data) {
        Util.print('------圈存结果确认------', data);
        bleProxy.loadconfirm({
            instructionResps: data,
            cardno: this.cardInfo.cardNum,
            deviceno: this.deviceInfo.senumber
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    //获取圈存结果
                    this.depositState = 3
                    this.sendBlueOrders(this.cmdHelper.getCmdA2())//握手 重新触发获取余额
                }
            }
        })
    }

    //获取0015文件指令集(1004)
    getfifteenins(data) {
        Util.print('------获取0015文件指令集(1004)------');
        bleProxy.getfifteenins({}).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    //获取圈存结果
                    this.sendBlueOrders(this.cmdHelper.doDepositGetFifteen(data.instructions)) //CMD_DEPOSIT_GET_FIFTEEN
                } else {
                    //获取上下线指令集失败，请返回重新操作。
                }
            }
        })
    }

    //获取校验指令集
    getinstructions(data) {
        Util.print('------获取校验指令集------', data);
        bleProxy.getinstructions({
            instructionResps: data,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    //获取圈存结果
                    this.sendBlueOrders(this.cmdHelper.doDepositHalf(data.instructions)) //CMD_DEPOSIT_HALF_1
                } else {
                    //获取上下线指令集失败，请返回重新操作。
                }
            }
        })
    }

    //上传校验结果(3002)
    sendsignresult(data) {
        Util.print('------上传校验结果(3002)------', data);
        bleProxy.sendsignresult({
            instructionResps: data,
            deviceno: this.deviceInfo.senumber,
            orderId: this.orderId,
        }).then(res => {
            let {code, data} = res;
            if (code == 0) {
                if (data.code == "00") {
                    // 补齐半条流水成功,直接显示圈存成功
                    // 更新圈存进度提示--充值圈存成功
                    this.depositState = 3
                    this.sendBlueOrders(this.cmdHelper.getCmdA2())//握手 重新触发获取余额
                } else if (data.code == "61") {
                    // 获取0015上下线指令集
                    this.depositState = 0
                    this.getfifteenins()
                }
            }
        })
    }

    //发送指令
    sendBlueOrders(data) {
        return new Promise((resolve, reject) => {
            let flow = this.ble.send(data)//发送数据
            if (flow) {
                resolve()
            } else {
                reject()
            }
        })
    }

    processRecvData(currCmd, res) {
        if (Util.byte2Integer255(res.data[1]) !== 0x00) {
            Util.print('------设备发送给手机返回的数据错误------,currCmd:' + currCmd + ";data=" + Util.bytes2HexString(res.data));
            this.emitter.emit("channel", {
                type: "depositProgress",
                code: -1,
                data: 0,
                msg: "接收数据失败"
            })
            return
        }
        let [code, msg, data] = [-1, '', '']
        switch (currCmd) {
            case cmd.CMD_AUTH:
                /**登录*/
                // [code, msg, data] = this.resCmdA2(res.data)
                // if (code === 0) {
                //     this.sendBlueOrders(this.cmdHelper.initEncode())
                // }
                //this.sendBlueOrders(this.cmdHelper.initEncode())
                break;
            case cmd.CMD_INIT:
                /**初始化*/
                // [code, msg, data] = this.resCmdA2(res.data)
                // if (code === 0) {
                //     this.sendBlueOrders(this.cmdHelper.getCardBalanceFrame())
                // }
                this.sendBlueOrders(this.cmdHelper.getCardBalanceFrame())
                break;
            case cmd.CMD_HANDSHAKE:
                /**APP和读卡器建立握手*/
                [code, msg, data] = this.resCmdA2(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.getCardBalanceFrame())
                }
                break;
            case cmd.CMD_CARD_BALANCE:
                /** 读取卡片余额*/
                [code, msg, data] = this.resCardBalanceFrame(res.data)
                if (code === 0) {
                    this.balance = data
                    this.emitter.emit("channel", {
                        type: "balance",
                        code: "0",
                        data: this.balance
                    })
                    this.sendBlueOrders(this.cmdHelper.getCardNumber())
                }
                break;
            case cmd.CMD_CARD_NUMBER:
                /** 获取卡卡号*/
                [code, msg, data] = this.resCardNumber(res.data)
                if (code === 0) {
                    this.cardInfo = data
                    this.emitter.emit("channel", {
                        type: "cardInfo",
                        code: "0",
                        data: {
                            cardInfo: this.cardInfo,
                            depositState: this.depositState
                        }
                    })
                    //this.sendBlueOrders(this.cmdHelper.getCmdC2())
                }
                break;
            case cmd.CMD_GET_BATTERY_LEVEL:
                /** 获取读卡器的电池电量 */
                [code, msg, data] = this.resCmdC2(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.getVerify1C0())
                }
                break;
            case cmd.CMD_AUTHENTICATE_ONE:
                /** 获取认证1 */
                [code, msg, data] = this.resVerify1C0(res.data)
                if (code === 0) {
                    this.firstconfirm(data)
                }
                break;
            case cmd.CMD_AUTHENTICATE_TWO:
                /**获取认证2*/
                [code, msg, data] = this.resVerify2(res.data)
                if (code === 0) {
                    this.secondconfirm(data)
                }
                break;
            case cmd.CMD_AUTHENTICATE_THREE:
                /**获取认证3*/
                [code, msg, data] = this.resVerify3(res.data)
                if (code === 0) {
                    this.thirdconfirm(data)
                }
                break;
            case cmd.CMD_DEPOSIT_INIT:
                /**圈存初始化*/
                [code, msg, data] = this.resdoDepositInit(res.data)
                if (code === 0) {
                    if (this.depositState === 0) {
                        this.emitter.emit("channel", {
                            type: "depositProgress",
                            code: 0,
                            data: 70,
                            msg: "圈存初始化成功，开始圈存写卡"
                        })
                        //圈存初始化响应集 HANDLER_INIT_DEPOSIT
                        //Util.print('------圈存初始化响应集------');
                        this.getinitializeins(data)
                    } else if (this.depositState === 1 || this.depositState === 2) {
                        this.emitter.emit("channel", {
                            type: "depositProgress",
                            code: 0,
                            data: 72,
                            msg: "圈存初始化成功，处理半条流水"
                        })
                        // 处理半条流水/写卡失败
                        //Util.print('------处理半条流水/写卡失败------');
                        //HANDLER_HALF_DEPOSIT_VERIFY sendMessage(HANDLER_HALF_DEPOSIT_VERIFY, instructionRespInit); 获取0015上下线指令集
                        this.getfifteenins(data)
                    }
                }

                break;
            case cmd.CMD_DEPOSIT_GET_FIFTEEN:
                /**0015上下线*/
                [code, msg, data] = this.resdoDepositGetFifteen(res.data)
                if (this.depositState === 1) {
                    // 发送3001半条初始化指令集 HANDLER_HALF_DEPOSIT_VERIFY_INIT // load/getinitializeins
                    //Util.print('------发送3001半条初始化指令集------');
                    this.getinstructions(data)
                } else if (this.depositState === 0 || this.depositState === 2) {
                    // 发送1005圈存初始化指令集 HANDLER_INIT_DEPOSIT //load/getinitializeins
                    //Util.print('------发送1005圈存初始化指令集------');
                    this.getinitializeins(data)
                }
                break;
            case cmd.CMD_DEPOSIT_WRITE:
                /**圈存写卡*/
                [code, msg, data] = this.resdoDepositWrite(res.data)
                if (code === 0) {
                    this.getloadins(data)
                }
                break;
            case cmd.CMD_DEPOSIT_WRITE2:
                /**圈存写卡2*/
                [code, msg, data] = this.resdoDepositWrite2(res.data)
                if (code === 0) {
                    this.loadconfirm(data)
                }
                break;
            case cmd.CMD_DEPOSIT_HALF_1:
                /**圈存写卡2*/
                [code, msg, data] = this.resdoDepositHalf(res.data)
                if (code === 0) {
                    this.sendsignresult(data)
                }
                break;

            /**国密开始    */
            case cmd.CMD_HANDSHAKE_GUOMI:
                /** APP握手 80 APP和读卡器建立握手（国密） */
                [code, msg, data] = this.resHandshakeGuomi(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.getCardBalanceFrameGuomi())
                }
                break;
            case cmd.CMD_CARD_BALANCE_GUOMI:
                /**获取卡余额（国密）*/
                [code, msg, data] = this.resCardBalanceFrameGuomi(res.data)
                if (code === 0) {
                    this.balance = data
                    this.emitter.emit("channel", {
                        type: "balance",
                        code: "0",
                        data: this.balance
                    })
                    this.sendBlueOrders(this.cmdHelper.getCardNumberGuomi())
                }
                break;
            case cmd.CMD_CARD_NUMBER_GUOMI:
                /**获取卡卡号（国密）*/
                [code, msg, data] = this.resCardNumberGuomi(res.data)
                if (code === 0) {
                    this.cardInfo = data
                    this.emitter.emit("channel", {
                        type: "cardInfo",
                        code: "0",
                        data: {
                            cardInfo: this.cardInfo,
                            depositState: this.depositState
                        }

                    })
                    //this.sendBlueOrders(this.cmdHelper.getCmdC2Guomi())//检查电量
                }
                break;
            case cmd.CMD_READ_0015_GUOMI:
                /**0015文件（国密）*/
                [code, msg, data] = this.resCardInfoGuomi(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.getEF01())
                }
                break;
            case cmd.CMD_READ_EF01_GUOMI: //貌似与设备审核相关
                /**读取EF01文件（国密）*/
                [code, msg, data] = this.resEF01(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.getEF1D())
                }
                break;
            case cmd.CMD_READ_EF1D_GUOMI:
                /**读取EF1D文件（国密）*/
                [code, msg, data] = this.resEF1D(res.data)
                if (code === 0) {
                    //获取三个文件信息（国密） 貌似用于审核
                }
                break;
            case cmd.CMD_ACTIVATE_CARD_GUOMI:
                /** 激活卡片（国密） */
                [code, msg, data] = this.resactivateCardGuomi(res.data)
                break;
            case cmd.CMD_ACTIVATE_OBU_GUOMI:
                /** 激活蓝牙obu（国密） */
                [code, msg, data] = this.resactivateObuGuomi(res.data)
                break;
            case cmd.CMD_CHECK_PIN_TYPE_GUOMI:
                /**验证PIN码类型（国密）*/
                [code, msg, data] = this.rescheckPINTypeGuomi(res.data, this.cardInfo)
                if (code === 0) {
                    if (Array.isArray(data)) {
                        if (data[0] === cmd.CMD_CHECK_SE_ONE_GUOMI) {
                            this.sendBlueOrders(this.cmdHelper.checkSE1Guomi(data[1]))
                        } else if (data[0] === cmd.CMD_CHECK_PIN_GUOMI) {
                            this.sendBlueOrders(this.cmdHelper.checkPINGuomi(data[1]))
                        }
                    }
                }
                break;
            case cmd.CMD_CHECK_SE_ONE_GUOMI:
                /**验证SE指令（国密）*/
                [code, msg, data] = this.rescheckSE1Guomi(res.data)
                if (code === 0) {
                    if (Array.isArray(data)) {
                        if (data[0] === cmd.CMD_CHECK_SE_TWO_GUOMI) {
                            this.sendBlueOrders(this.cmdHelper.checkSE2Guomi(data[1]))
                        } else if (data[0] === cmd.CMD_CHECK_PIN_GUOMI) {
                            this.sendBlueOrders(this.cmdHelper.checkPINGuomi(data[1]))
                        }
                    }
                }
                break;
            case cmd.CMD_CHECK_SE_TWO_GUOMI:
                /**再次验证SE指令（国密）*/
                [code, msg, data] = this.rescheckSE2Guomi(res.data)
                if (code === 0) {
                    if (Array.isArray(data)) {
                        this.sendBlueOrders(this.cmdHelper.checkPINGuomi(data[1]))
                    }
                }
                break;
            case cmd.CMD_CHECK_PIN_GUOMI:
                /**验证PIN码（国密）*/
                [code, msg, data] = this.rescheckPINGuomi(res.data)
                if (code === 0) {
                    //开始圈存划账
                    this.loadPayV2()
                }
                break;
            case cmd.CMD_GET_BATTERY_LEVEL_GUOMI:
                /**获取读卡器的电池电量（国密）*/
                [code, msg, data] = this.resCmdC2Guomi(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.getVerify1C0Guomi())/**认证（国密）*/
                }
                break;
            case cmd.CMD_AUTHENTICATE_GUOMI:
                /**认证（国密）*/
                [code, msg, data] = this.resVerify1C0Guomi(res.data)
                if (code === 0) {
                    this.secretConfirmV2(data) //国密认证
                }
                break;
            case cmd.CMD_AUTHENTICATE_RESULT_GUOMI:
                /**认证结果（国密）*/
                [code, msg, data] = this.resVerify2Guomi(res.data)
                if (code === 0) {
                    this.sendBlueOrders(this.cmdHelper.checkPINTypeGuomi()) /**验证PIN码类型（国密）*/
                }
                break;
            case cmd.CMD_DEPOSIT_INIT_GUOMI:
                /**圈存初始化（国密）*/
                [code, msg, data] = this.resdoDepositInitGuomi(res.data)
                if (code === 0) {
                    if (this.depositState === 0 || this.depositState === 2) {
                        //处理正常流程/写卡失败
                        //Util.print('Guomi------处理正常流程/写卡失败------');
                        this.emitter.emit("channel", {
                            type: "depositProgress",
                            code: 0,
                            data: 70,
                            msg: "圈存初始化成功，开始圈存写卡"
                        })
                        this.getloadinsV2(data) //获取圈存指令集
                    } else if (this.depositState === 1) {
                        // 处理半条流水/写卡失败
                        //Util.print('Guomi------处理半条流水/写卡失败------');
                        this.emitter.emit("channel", {
                            type: "depositProgress",
                            code: 0,
                            data: 72,
                            msg: "圈存初始化成功，开始处理半条流水校验"
                        })
                        this.sendsignresultV2(data)
                    }
                }
                break;
            case cmd.CMD_DEPOSIT_WRITE_GUOMI: // 这里可能会导致半条流水，半条流水需要另外处理
                /**圈存写卡（国密）*/
                [code, msg, data] = this.resdoDepositWriteGuomi(res.data)
                if (code === 0) { //HANDLER_CONFIRM_GUOMI
                    this.emitter.emit("channel", {
                        type: "depositProgress",
                        code: 0,
                        data: 71,
                        msg: "圈存写卡成功，开始圈存确认"
                    })
                    this.loadconfirmV2(data) // 圈存确认指令响应集（国密）
                }
                break;
            default:
        }
    }
}

export {DepositCard};
