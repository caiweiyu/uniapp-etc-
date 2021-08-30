/**
 * @Description: 蓝牙指令组装
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import cmd from '@/packageA/pages/ytk/ytk_deposit/blue/cmd'
import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";
class CMDHelper {
    constructor(emitter,maxFrameLen) {
        this.MAX_PACKAGE_LEN = 1200;
        /** 最大包长 */
        this.MAX_FRAME_LEN = maxFrameLen;
        /** 最大帧长度 */
        this.emitter = emitter
        this.frameData = [];
        this.currCmd = 0;
        this.devType = -1;

        this.recvData = [];
        this.packNum = 0;
    }
    authEncode() { //非国密登录
        this.devType = 1;
        this.frameData = []
        this.currCmd = cmd.CMD_HANDSHAKE
        Util.print('------非国密登录authEncode------');
        let sendBuf = Util.hexString2Bytes("fe0100184e2100010a06080012024f4b1206313233313234")
        let list = []
        list.push(sendBuf)
        return list;
    }
    initEncode() { //非国密初始化
        this.devType = 1;
        this.frameData = []
        this.currCmd = cmd.CMD_HANDSHAKE
        Util.print('------非国密初始化initEncode------');
		let sendBuf = Util.hexString2Bytes("FE010014753100000A00120633018001A2221800")
        let list = []
        list.push(sendBuf)
        return list;
    }
    initEncode1() { //非国密初始化
        this.devType = 1;
        this.frameData = []
        this.currCmd = cmd.CMD_HANDSHAKE
        Util.print('------非国密初始化initEncode1------');
        let sendBuf1 = Util.hexString2Bytes("FE0100164E2300020A06080012024F4B10001800");//安卓 电服2
        let sendBuf2 = Util.hexString2Bytes("2000000000000000000000000000000000000000");
        let list = []
        list.push(sendBuf1)
        list.push(sendBuf2)
        return list;
    }
    initEncode2() { //非国密初始化
        this.devType = 1;
        this.frameData = []
        this.currCmd = cmd.CMD_HANDSHAKE
        Util.print('------非国密初始化initEncode2------');
        let sendBuf = Util.hexString2Bytes("FE0100124E2100010A06080012024F4B1200");//电服1
        let list = []
        list.push(sendBuf)
        return list;
    }
    initEncode3() { //非国密初始化
        this.devType = 1;
        this.frameData = []
        this.currCmd = cmd.CMD_HANDSHAKE
        Util.print('------非国密初始化initEncode3------');
        let sendBuf = Util.hexString2Bytes("FE010014753100000A00120633018001A2221800");//ios
        let list = []
        list.push(sendBuf)
        return list;
    }
    /** APP握手 A2 APP和读卡器建立握手 */
    getCmdA2() {
        Util.print('------握手------');
        this.devType = 1;
        this.frameData = []
        this.currCmd = cmd.CMD_HANDSHAKE
        let data = []
        data[0] = 0xA2
        return this.buildFrame(data);
    }

    /** 获取卡余额*/
    getCardBalanceFrame() {
        Util.print('------获取卡余额------');
        this.frameData = []
        this.currCmd = cmd.CMD_CARD_BALANCE
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_CARD_BALANCE)
        return this.doIccCommand(data);
    }

    /** 获取卡卡号*/
    getCardNumber() {
        Util.print('------获取卡卡号------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CARD_NUMBER;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_CARD_NUMBER)
        return this.doIccCommand(data);
    }

    /** 获取读卡器的电池电量 */
    getCmdC2() {
        Util.print('------获取读卡器的电池电量------');
        this.frameData = []
        this.currCmd = cmd.CMD_GET_BATTERY_LEVEL
        let data = []
        data[0] = 0xC2
        return this.doObuCommand(data);
    }

    /** 强制读卡器断电 */
    getCmdC3() {
        Util.print('------强制读卡器断电------');
        this.frameData = []
        this.currCmd = cmd.CMD_CUT_OFF_ELECTRICITY
        let data = []
        data[0] = 0xC3
        return this.doObuCommand(data);
    }

    /** 获取认证1 */
    getVerify1C0() {
        Util.print('------获取认证1------');
        this.frameData = []
        this.currCmd = cmd.CMD_AUTHENTICATE_ONE
        let data = []
        data[0] = 0xC0
        return this.doAuthenticate(data);
    }

    /**获取认证2*/
    /**
     * @param serverCertificate
     * @param random2
     * @return
     */
    getVerify2(serverCertificate, random2) {
        Util.print('------获取认证2------');
        this.frameData = [];
        this.currCmd = cmd.CMD_AUTHENTICATE_TWO;

        let certi = Util.hexString2Bytes(serverCertificate)
        let ran = Util.hexString2Bytes(random2)
        let data = []
		data[0] = 0xC1;
        certi.map((item, index) => {
			data.push(item)
        })
        ran.map((item, index) => {
			data.push(item)
        })
        return this.doAuthenticate(data);
    }

    /**
     * 获取认证3
     */
    getVerify3(serverHMAC) {
        Util.print('------获取认证3------');
        this.frameData = [];
        this.currCmd = cmd.CMD_AUTHENTICATE_THREE;
        let f1 = Util.hexString2Bytes(serverHMAC)
        let data = []
		data[0] = 0xC2;
        f1.map((item, index) => {
			data.push(item)
        })
        return this.doAuthenticate(data);
    }

    /**
     * 圈存初始化
     */
    doDepositInit(instructions) {
        Util.print('------圈存初始化------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_INIT;
        let f1 = Util.hexString2Bytes(instructions)
        return this.doIccCommandEnc(f1);
    }

    /**0015上下线*/
    doDepositGetFifteen(instructions) {
        Util.print('------0015上下线------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_GET_FIFTEEN;
        let f1 = Util.hexString2Bytes(instructions)
        return this.doIccCommandEnc(f1);
    }

    /**
     * 圈存写卡
     */
    doDepositWrite(instructions) {
        Util.print('------圈存写卡------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_WRITE;
        let f1 = Util.hexString2Bytes(instructions)
        return this.doIccCommandEnc(f1);
    }

    /**圈存写卡2*/
    doDepositWrite2(instructions) {
        Util.print('------圈存写卡2------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_WRITE2;
        let f1 = Util.hexString2Bytes(instructions)
        return this.doIccCommandEnc(f1);
    }

    /**圈存写卡2*/
    doDepositHalf(instructions) {
        Util.print('------圈存写卡2s------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_HALF_1;
        let f1 = Util.hexString2Bytes(instructions)
        return this.doIccCommandEnc(f1);
    }

// 密文
    doIccCommandEnc(tlv) { // apdu: data1_len, data1,
        if (!tlv) {
            return null;
        }
        let data = []
        data[0] = 0xA3;
        data[1] = 0x01;
        data[2] = tlv.length & 0xFF;
        data[3] = ((tlv.length >> 8) & 0xFF);
        tlv.map((item, index) => {
            data.push(item)
        })
        return this.buildFrame(data);
    }

// 明文
    doIccCommand(src) {
        let data = []
        data[0] = 0xA3;
        data[1] = 0x0;
        data[2] = (src.length & 0xFF);
        data[3] = ((src.length >> 8) & 0xFF);
        src.map((item, index) => {
            data.push(item)
        })
        return this.buildFrame(data);
    }

// 认证
    doAuthenticate(apdu) {
        let data = []
        let len = apdu.length
        data[0] = 0xA6;
        data[1] = (len & 0xFF);
        data[2] = ((len >> 8) & 0xFF);
        apdu.map((item, index) => {
            data.push(item)
        })
        return this.buildFrame(data);
    }

    /** APP握手 80 APP和读卡器建立握手（国密） */
    getHandshakeGuomi() {
        Util.print('Guomi------握手------');
        this.devType = 0;
        this.frameData = [];
        this.currCmd = cmd.CMD_HANDSHAKE_GUOMI;
        let data = []
        data[0] = 0x80;
        return this.buildFrameGuomi(data);
    }

    /**获取卡余额（国密）*/
    getCardBalanceFrameGuomi() {
        Util.print('Guomi------获取卡余额------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CARD_BALANCE_GUOMI;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_CARD_BALANCE)
        return this.doIccCommandGuomi(data);
    }

    /**获取卡卡号（国密）*/
    getCardNumberGuomi() {
        Util.print('Guomi------获取卡卡号------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CARD_NUMBER_GUOMI;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_CARD_NUMBER)
        return this.doIccCommandGuomi(data);
    }

    /**获取卡片信息（国密）*/
    getCardInfoGuomi() {
        Util.print('Guomi------获取卡片信息------');
        this.frameData = [];
        this.currCmd = cmd.CMD_READ_0015_GUOMI;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_READ_CARD_0015_FILE)
        return this.doIccCommandGuomi(data);
    }

    /**读取EF01文件（国密）*/
    getEF01() {
        Util.print('Guomi------读取EF01文件------');
        this.frameData = [];
        this.currCmd = cmd.CMD_READ_EF01_GUOMI;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_READ_EF01_GUOMI)
        return this.doEsamCommandGuomi(data);
    }

    /**读取EF1D文件（国密）*/
    getEF1D() {
        Util.print('Guomi------读取EF1D文件------');
        this.frameData = [];
        this.currCmd = cmd.CMD_READ_EF1D_GUOMI;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_READ_EF1D_GUOMI)
        return this.doEsamCommandGuomi(data);
    }

    /** 激活卡片（国密） */
    activateCardGuomi(cmdString) {
        Util.print('Guomi------激活卡片------');
        this.frameData = [];
        this.currCmd = cmd.CMD_ACTIVATE_CARD_GUOMI;
        let data = Util.hexString2Bytes(cmdString)
        return this.doIccCommandEncGuomi(data);
    }

    /** 激活蓝牙obu（国密） */
    activateObuGuomi(cmdString) {
        Util.print('Guomi------激活蓝牙obu------');
        this.frameData = [];
        this.currCmd = cmd.CMD_ACTIVATE_OBU_GUOMI;
        let data = Util.hexString2Bytes(cmdString)
        return this.doEsamCommandEncGuomi(data);
    }

    /**验证PIN码类型（国密）*/
    checkPINTypeGuomi() {
        Util.print('Guomi------验证PIN码类型------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CHECK_PIN_TYPE_GUOMI;
        let data = Util.hexString2Bytes(cmd.DIRECT_CMD_CARD_PIN_TYPE)
        return this.doIccCommandGuomi(data);
    }

    /**验证SE指令（国密）*/
    checkSE1Guomi(directCmd) {
        Util.print('Guomi------验证SE指令------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CHECK_SE_ONE_GUOMI;
        let data = Util.hexString2Bytes(directCmd)
        return this.doSeCommandGuomi(data);
    }

    /**再次验证SE指令（国密）*/
    checkSE2Guomi(directCmd) {
        Util.print('Guomi------再次验证SE指令------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CHECK_SE_TWO_GUOMI;
        let data = Util.hexString2Bytes(directCmd)
        return this.doSeCommandGuomi(data);
    }

    /**验证PIN码（国密）*/
    checkPINGuomi(directCmd) {
        Util.print('Guomi------验证PIN码------ : '+directCmd);
        this.frameData = [];
        this.currCmd = cmd.CMD_CHECK_PIN_GUOMI
        let data = Util.hexString2Bytes(directCmd)
        return this.doIccCommandGuomi(data);
    }

    /**获取读卡器的电池电量（国密）*/
    getCmdC2Guomi() {
        Util.print('Guomi------获取读卡器的电池电量------');
        this.frameData = [];
        this.currCmd = cmd.CMD_GET_BATTERY_LEVEL_GUOMI;
        let data = []
        data[0] = 0xC2
        return this.doObuCommandGuomi(data);
    }

    /**强制读卡器断电（国密）*/
    getCmdC3Guomi() {
        Util.print('Guomi------强制读卡器断电------');
        this.frameData = [];
        this.currCmd = cmd.CMD_CUT_OFF_ELECTRICITY_GUOMI;
        let data = []
        data[0] = 0xC3; // 断电指令
        return this.doObuCommandGuomi(data);
    }

    /**认证（国密）*/
    getVerify1C0Guomi() {
        Util.print('Guomi------认证------');
        this.frameData = [];
        this.currCmd = cmd.CMD_AUTHENTICATE_GUOMI;
        let data = []
		data[0] = 0xC0;
		data[1] = 0x15;
		data[2] = 0x08;
		data[3] = 0x37;
		data[4] = 0x89;
        return this.doAuthenticateGuomi(data);
    }

    /**认证结果（国密）*/
    /**
     * @param workkey
     * @param workkeyMac
     * @param mackey
     * @param mackeyMac
     * @param random2
     * @param signdata
     * @return
     */
    getVerify2Guomi(workkey, workkeyMac, mackey, mackeyMac, random2, sessionId, signdata) {
        Util.print('Guomi------认证结果------');
        this.frameData = [];
        this.currCmd = cmd.CMD_AUTHENTICATE_RESULT_GUOMI;
        let wk = Util.hexString2Bytes(workkey)
        let wkmac = Util.hexString2Bytes(workkeyMac)
        let mk = Util.hexString2Bytes(mackey)
        let mkmac = Util.hexString2Bytes(mackeyMac)
        let ran = Util.hexString2Bytes(random2)
        let session = Util.hexString2Bytes(sessionId)
        let s2 = Util.hexString2Bytes(signdata)
        let apdu = []
        apdu[0] = 0xC1;
        wk.map((item, index) => {
            apdu.push(item)
        })
        wkmac.map((item, index) => {
            apdu.push(item)
        })
        mk.map((item, index) => {
            apdu.push(item)
        })
        mkmac.map((item, index) => {
            apdu.push(item)
        })
        ran.map((item, index) => {
            apdu.push(item)
        })
        session.map((item, index) => {
            apdu.push(item)
        })
        s2.map((item, index) => {
            apdu.push(item)
        })
        return this.doAuthenticateGuomi(apdu);
    }

    /**圈存初始化（国密）*/
    doDepositInitGuomi(instructions, instructionsMac) {
        Util.print('Guomi------圈存初始化------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_INIT_GUOMI;
        let f1 = Util.hexString2Bytes(instructions)
        let mac = Util.hexString2Bytes(instructionsMac)
        let apdu = []
        f1.map((item, index) => {
            apdu.push(item)
        })
        mac.map((item, index) => {
            apdu.push(item)
        })
        return this.doIccCommandEncGuomi(apdu);
    }

    /**圈存写卡（国密）*///可能会导致半条流水
    doDepositWriteGuomi(instructions, instructionsMac) {
        Util.print('Guomi------圈存写卡------');
        this.frameData = [];
        this.currCmd = cmd.CMD_DEPOSIT_WRITE_GUOMI;
        let f1 = Util.hexString2Bytes(instructions);
        let mac = Util.hexString2Bytes(instructionsMac)
        let data = []
        f1.map((item, index) => {
            data.push(item)
        })
        mac.map((item, index) => {
            data.push(item)
        })
        return this.doIccCommandEncGuomi(data);
    }

	// 密文 ICC通道(国密)
    doIccCommandEncGuomi(tlv) {
        let data = []
        data[0] = 0x82;
        data[1] = 0x11;
        data[2] = tlv.length & 0xFF;
        data[3] = ((tlv.length >> 8) & 0xFF);
        tlv.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

	// 密文 ESAM通道(国密)
    doEsamCommandEncGuomi(tlv) {
        let data = []
        data[0] = 0x82;
        data[1] = 0x21;
        data[2] = tlv.length & 0xFF;
        data[3] = ((tlv.length >> 8) & 0xFF);
        tlv.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

	// 明文 SE通道(国密)
	// Data Type,bit0:数据类型(0-明文数据，1-加密数据),bit1~3保留(设置为0),bit4~7(1-ICC,2-ESAM,3-SE,其他-保留)
    doSeCommandGuomi(src) {
        let data = []
        data[0] = 0x82;
        data[1] = 0x30;//Data Type
        data[2] = src.length & 0xFF;
        data[3] = ((src.length >> 8) & 0xFF);
        src.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

	// 明文 ICC通道(国密)
    doIccCommandGuomi(src) {
        let data = []
        data[0] = 0x82;
        data[1] = 0x10;
        data[2] = src.length & 0xFF;
        data[3] = ((src.length >> 8) & 0xFF);
        src.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

	// 明文 ESAM通道(国密)
    doEsamCommandGuomi(src) {
        let data = []
        data[0] = 0x82;
        data[1] = 0x20;
        data[2] = (src.length & 0xFF);
        data[3] = ((src.length >> 8) & 0xFF);
        src.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

	// 认证(国密)
    doAuthenticateGuomi(apdu) {
        let len = apdu.length
        let data = []
        data[0] = 0x84;
        data[1] = (len & 0xFF);
        data[2] = ((len >> 8) & 0xFF);
        apdu.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

	// 指令
    doObuCommand(apdu) {
        let data = []
        data[0] = 0xA5;
        data[1] = (apdu.length & 0xFF); // 传入数据的长度
        apdu.map((item, index) => {
            data.push(item)
        })
        return this.buildFrame(data);
    }

	// 指令(国密)
    doObuCommandGuomi(apdu) {
        let data = []
        data[0] = 0x81;
        data[1] = (apdu.length & 0xFF); 		// 传入数据的长度 低位
        data[2] = ((apdu.length >> 8) & 0xFF); 	// 传入数据的长度 高位
        apdu.map((item, index) => {
            data.push(item)
        })
        return this.buildFrameGuomi(data);
    }

    /**
     * 创建ble通道 非国密
     * @param data 数据指令
     * @param len 数据长度
     * @return
     */
    buildFrame(data) {
        let len = data.length
        Util.print('------buildFrame data------'+ Util.bytes2HexString(data));
        Util.print('------buildFrame len------'+ len);
        let list = []
        let frameBuf = []
        let pgklen = 0
        let pgknum = 0
        let pgkindex = 1
        let dataPointer = 0
        let mPackageSn = 0;
        if (len === 0 || len > this.MAX_PACKAGE_LEN) {
            return null;
        }
        pgknum = parseInt((len / this.MAX_FRAME_LEN))
        if ((len % this.MAX_FRAME_LEN) !== 0) {
            pgknum++;
        }

        // mPackageSn++;
        // if (mPackageSn > 0xF) {
        //     mPackageSn = 0;
        // }
        do {

            mPackageSn++;
            if (mPackageSn > 0xF) {
                mPackageSn = 0;
            }

            // 开始分帧组数据
            if (pgkindex < pgknum) {
                pgklen = this.MAX_FRAME_LEN;
            } else {
                pgklen = len % this.MAX_FRAME_LEN;
                if (pgklen === 0) {
                    pgklen = this.MAX_FRAME_LEN;
                }
            }
            frameBuf = new Array(pgklen + 5); // 初始化帧长度
            frameBuf[0] = 0x33; // st


            frameBuf[1] = mPackageSn; // sn
            if (pgkindex === 1) {
                frameBuf[2] = (((pgknum - pgkindex) & 0x7F) | 0x80); // ctl
            } else {
                frameBuf[2] = ((pgknum - pgkindex) & 0x7F); // ctl
            }


            frameBuf[3] = (pgklen & 0xFF); // len
            let tmpdata = data.slice(dataPointer, dataPointer + pgklen);
            tmpdata.map((item, index) => {
                frameBuf[index + 4] = item
            })
            dataPointer += pgklen;
            let snToData = frameBuf.slice(1, frameBuf.length - 1);
            frameBuf[pgklen + 4] = Util.GetBcc(snToData, pgklen + 3); // bcc
            //处理
            let tempH = new Array(), tempA = new Array(), tempB = new Array(2);
            tempH[0] = 0x0A
            tempH[1] = 0x00
            tempH[2] = 0x12
            let v = frameBuf.length

            if (v > 127) {
                tempA[0] = (0x80 + (v % 0x80 & 0xFF))
                tempA[1] = (v / 0x80 & 0xFF)
            } else {
                tempA[0] = (0xFF & v)
            }
            //Util.print('tempA-: ' + Util.bytes2HexString(tempA));

            tempA.map((item, index) => {
                tempH.push(item)
            })

            tempB[0] = 0x18
            tempB[1] = 0x00

            frameBuf.map((item, index) => {
                tempH.push(item)
            })

            tempB.map((item, index) => {
                tempH.push(item)
            })
            let nLength = tempH.length + 8, nCmdId = 30001, nSeq = 0;
            let sendBuf = new Array(nLength);
            sendBuf[0] = 0xFE;
            sendBuf[1] = 0x01;
            sendBuf[2] = ((nLength >> 8) & 0xFF);
            sendBuf[3] = (nLength & 0xFF);
            sendBuf[4] = ((nCmdId >> 8) & 0xFF);
            sendBuf[5] = (nCmdId & 0xFF);
            sendBuf[6] = ((nSeq >> 8) & 0xFF);
            sendBuf[7] = (nSeq & 0xFF);

            tempH.map((item, index) => {
                sendBuf[index + 8] = item
                //sendBuf.push(item)
            })

            list.push(sendBuf); // send包创建,一个frameBuf为一帧数据
            pgkindex++;
        } while (pgkindex <= pgknum);
        // for (let i = 0; i < list.length; i++) {
        //     Util.print('------list-16str------' + i + ' : ' + Util.bytes2HexString(list[i]));
        // }
        return list;

    }


    /**
     * 创建ble通道(国密)
     * @param data  数据指令
     * @param len  数据长度
     * @return
     */
    buildFrameGuomi(data) {
        let len = data.length
        Util.print('Guomi------buildFrame data------'+ Util.bytes2HexString(data));
        Util.print('Guomi------buildFrame len------'+ len);
		let list = []
		let frameBuf = []
        let pgklen = 0
        let pgknum = 0
        let pgkindex = 1
        let dataPointer = 0
        if (len === 0 || len > this.MAX_PACKAGE_LEN) {
            return null;
        }
        pgknum = parseInt((len / this.MAX_FRAME_LEN))
        if ((len % this.MAX_FRAME_LEN) !== 0) {
            pgknum++;
        }
        do {
            // 开始分帧组数据
            if (pgkindex < pgknum) {
                pgklen = this.MAX_FRAME_LEN;
            } else {
                pgklen = len % this.MAX_FRAME_LEN;

                if (pgklen === 0) {
                    pgklen = this.MAX_FRAME_LEN;
                }
            }
            frameBuf = new Array(pgklen + 5); // 初始化帧长度
            frameBuf[0] = 0x50; // st
            let hightValue, lowValue, ctlData;
            if (pgkindex === 1) {
                ctlData = 32768 + pgknum; // ctl
                hightValue = (ctlData >> 8);
                lowValue = (ctlData & 0xFF);
            } else {
                ctlData = (pgkindex & 0x7FFF); // ctl
                hightValue = (ctlData >> 8);
                lowValue = (ctlData & 0xFF);
            }
            frameBuf[1] = hightValue;
            frameBuf[2] = lowValue;
            frameBuf[3] = (pgklen & 0xFF);
            let tmpdata = data.slice(dataPointer, dataPointer + pgklen);
            tmpdata.map((item, index) => {
                frameBuf[index + 4] = item
            })
            dataPointer += pgklen;
            frameBuf[pgklen + 4] = Util.GetBcc(frameBuf, pgklen + 4); // bcc
            list.push(frameBuf); // send包创建,一个frameBuf为一帧数据
            pgkindex++;
        } while (pgkindex <= pgknum)
        // for (let i = 0; i < list.length; i++) {
        //     Util.print('Guomi------list-16str------' + i + ' : ' + Util.bytes2HexString(list[i]));
        // }
        return list;
    }


    //解包
    receiveDataWrite(data) {
        // 收到的数据处理（已经解析）
        if (data.length === 0) {
            return;
        }
        Util.print('ringWrite  data = ' + Util.bytes2HexString(data))
        data.map((item, index) => {
            this.recvData.push(item)
        })
        Util.print('recvData--1  data = ' + Util.bytes2HexString(this.recvData))
        // 判断收到的数据是否为最后一帧数据
        let isLastFrames;
        if (this.devType === 0) {
            isLastFrames = this.isLastFrameGuomi(this.recvData)
        } else if (this.devType === 1) {
            isLastFrames = this.isLastFrame(this.recvData)
        }
        Util.print('recvData--2  data = ' + Util.bytes2HexString(this.recvData))
        if (this.recvData.length === 0) {
            return;
        }
        this.recvData.map((item, index) => {
            this.frameData.push(item)
        })
        Util.print('frameData  data = ' + Util.bytes2HexString(this.frameData))
        this.recvData = [];
        if (isLastFrames) {
            Util.print('收到完整数据，通知接收----------------------  data = ' + Util.bytes2HexString(this.frameData))
            this.emitter.emit("channel", {
                type: "frameData",
                code: "0",
                data: this.frameData
            })
        } else {
            Util.print('非最后帧数据')
        }
    }

    /**
     * 判断收到的数据是否为最后一帧数据
     *
     * @param indata
     * @return
     */
    isLastFrame(indata) {
        let data = indata.slice(8, indata.length);

        let v = data.length
        if (v > 127) {
            data = data.slice(5, data.length - 2);
        } else {
            // if(this.currCmd === cmd.CMD_AUTH){
            //     data = data.slice(4, data.length - 3);
            // }else {
            //     data = data.slice(4, data.length - 2);
            // }
            data = data.slice(4, data.length - 2);
        }
        //let data = indata
        Util.print('------待处理帧数据------: '+Util.bytes2HexString(data));
        let success = false;
        if (Util.byte2Integer255(data[0]) !== 0x33) {
            Util.print('isLastFrame -- 1')
            data = null;
            return false;
        }
        let recvlen = Util.byte2Integer255(data[3]);
        Util.print('------待处理帧数据------recvlen: '+recvlen)
        Util.print('------待处理帧数据------data.length: '+data.length)
        if (recvlen + 5 !== data.length) {
            Util.print('isLastFrame -- 2')
            data = null;
            return false;
        }
        let snToData = new Array(data.length - 2);
        let tempData = data.slice(1, data.length - 1);
        tempData.map((item, index) => {
            snToData[index] = item
        })
        if (Util.byte2Integer255(data[data.length - 1]) !== Util.byte2Integer255(Util.GetBcc(snToData, snToData.length))) {
            Util.print('isLastFrame -- 3')
            data = null;
            return false;
        }
        let datas = new Array(data.length - 5);
        let tempDatas = data.slice(4, data.length - 1);
        tempDatas.map((item, index) => {
            datas[index] = item
        })
        success = Util.byte2Integer127(data[2]) === 0;
        this.recvData = datas;
        Util.print('isLastFrame -- 4')
        return success;
    }

    /**
     * 判断收到的数据是否为最后一帧数据
     *
     * @param indata
     * @return
     */
    isLastFrameGuomi(indata) {
        let data = indata;
        let success = false;
        Util.print('Guomi------待处理帧数据------: '+Util.bytes2HexString(data));
        if (Util.byte2Integer255(data[0]) !== 0x50) {//80
            //print('不相等')
            data = null;
            this.packNum = 0;
            return false;
        }
        //print('相等')
        // 长度校验
        let recvlen = Util.byte2Integer255(data[3]);
        //Util.print('待处理帧数据 recvlen = ' + recvlen)
        //Util.print('待处理帧数据 data.length = ' + data.length)
        if (recvlen + 5 !== data.length) {
            //Util.print('待处理帧数据 datass = ' + data[3])
            data = null;
            this.packNum = 0;
            return false;
        }

        // BCC校验
        if (Util.byte2Integer255(data[data.length - 1]) !== Util.byte2Integer255(Util.GetBcc(data, data.length - 1))) {
            data = null;
            this.packNum = 0;
            return false;
        }
        let datas = new Array(data.length - 5);
        let tempDatas = data.slice(4, data.length - 1);
        tempDatas.map((item, index) => {
            datas[index] = item
        })
        // CTL分包校验
        // 取第二个字节判断头包来获取包的数量
        let ctlValue = Util.getUnsignedShort(((data[1] << 8) + data[2]));
        if (ctlValue > 32768) {
            // 表示此包为头包 解析data[2]来获得
            this.packNum = ctlValue - 32768;
            // 只有一个包
            success = this.packNum === 1;
        } else {
            // 表示该包为分包,且当前的索引数等于包的数量表示为最后一帧
            success = ctlValue === this.packNum;
        }
        this.recvData = datas;
        return success;
    }
}
export { CMDHelper };
