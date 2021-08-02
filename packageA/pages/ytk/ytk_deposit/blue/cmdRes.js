/**
 * @Description: 对应蓝牙接收的完整数据解析处理
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";
import * as Gbk from "@/packageA/pages/ytk/ytk_deposit/blue/gbk";
import cmd from '@/packageA/pages/ytk/ytk_deposit/blue/cmd'
class CMDRes {
    constructor(emitter) {
        this.emitter = emitter
    }
    /** 00为正常*/
    /** 51 未半条流水 上一次圈存异常*/
    /** 61 是否存在写卡失败记录，如果是，返回该单据  上一次写卡失败*/
    /** 73 是否存在写卡失败记录，如果是，返回该单据 上一次写卡失败*/
    /** 00代表没电，非00代表有电*/

    /** 0x00 表示正常返回；其他表示错误*/
    /** 0xB2 ICC复位响应握手响应   返回读卡器中的ICC卡复位操作结果 返回握手信息（非国密）*/
    /** 0xB3 ICC通道指令响应   返回读卡器中的ICC卡通道操作结果（非国密）*/
    /** 0xB5 读卡器通道指令响应 返回读卡器通道操作结果（非国密）*/
    /** 0xB6 读卡器通道指令响应 返回读卡器认证结果（非国密）*/
    /** 0x90 ICC复位响应握手响应   返回读卡器中的ICC卡复位操作结果 返回握手信息（国密）*/
    /** 0x92 ICC通道指令响应   返回读卡器中的ICC卡通道操作结果（国密）*/
    /** 0x91 读卡器通道指令响应 返回读卡器通道操作结果（国密）*/
    /** 0x94 读卡器通道指令响应 返回读卡器认证结果（国密）*/
    //获取余额
    getCardBalance(data) {
        let temp = Util.bytes2HexString(data);
        let length = parseInt(temp.substring(6, 8), 16) + parseInt(temp.substring(8, 10), 16) * 256;
        let datastring = Util.byte2Hex(data, 5, length);
        Util.print('datastring: ' + datastring)
        datastring = datastring.substring(8, 16);
        let balance = parseInt(datastring, 16) + "";// 余额(分)
        //balance =  (balance/100).toFixed(2)
        Util.print('balance: ' + balance)
        return balance
    }

    /**
     * 根据蓝牙发送过来的数据,获取指令集响应
     *
     * @param data
     * @return
     */
    getInstructionResp(data){
        let temp = Util.bytes2HexString(data);
        let length = parseInt(temp.substring(6, 8), 16) + parseInt(temp.substring(8, 10), 16) * 256;
        let instructionResps = Util.byte2Hex(data, 5, length);
        return instructionResps;
    }
    /**
     * 根据蓝牙发送过来的数据,获取指令集响应（国密） 用于 激活卡片（国密）激活蓝牙OBU（国密）
     *
     * @param data
     * @return
     */
    getInstructionRespGuomi(data){
        let instructionResps = Util.byte2Hex(data, 5, data.length-9);//该参数不固定长度，从第5位到最后4字节
        let instructionRespsMac = Util.byte2Hex(data, data.length-4, 4);//该参数固定长度，4字节
        let resps ={}
        resps.instructions=instructionResps;
        resps.instructionsMac=instructionRespsMac;
        return resps;
    }
    /***
     * 获取卡区域、卡号
     *
     * @param data
     * @return
     */
    getCardInfo(data) {
        let temp = Util.bytes2HexString(data);
        let length = parseInt(temp.substring(6, 8), 16) + parseInt(temp.substring(8, 10), 16) * 256;
        let content = Util.byte2Hex(data, 5, length);
        //let content = Util.bytes2HexString(data.slice(5,length + 5));
        let cardVer = content.substring(26, 28);
        let cardArea = content.substring(28, 32);
        let cardNum = content.substring(32, 48); // 卡号
        // let validity = content.substring(48, 56);
        let validity = content.substring(56, 64);
        let plateNum = content.substring(64, 88)
        let plateNumStr = '';
        for (let i = 0; i < plateNum.length; i += 2){
            plateNumStr += "%" + plateNum.substr(i, 2).toUpperCase();
        }
        let de_gbk = Gbk.decode(plateNumStr)
        let cardInfo ={}
        cardInfo.cardVer= cardVer;
        cardInfo.cardArea= cardArea;
        cardInfo.cardNum=cardNum;
        cardInfo.validity=validity;
        cardInfo.plateNum=de_gbk.replace(/\u0000/g, "");
        Util.print(cardInfo)
        return cardInfo;
    }

    /**
     * 验证PIN码
     * @param paramString
     * @return
     */
    verityPIN(paramString){
        let param = Util.hexString2Bytes(paramString);
        if (param != null && param.length >= 3) {
            let head = [0x00, 0x20, 0x00, 0x00];
            let temp = (param.length).toString(16);
            if (temp.length % 2 === 1) {
                temp = "0" + temp.toString(16);
            }
            let len = Util.hexString2Bytes(temp);
            let frame = new Array(head.length + len.length + param.length);

            head.map((item, index) => {
                frame[index] = item
            })

            len.map((item, index) => {
                frame[index + head.length] = item
            })

            param.map((item, index) => {
                frame[index + head.length + len.length] = item
            })
            return Util.bytes2HexString(frame);
        }
        return "";
    }
    resData(code,msg,data,progress){
        Util.print(msg,data)
        progress = Number(progress)
        if(msg !== "" && (progress>0 || code===-1)){
            this.emitter.emit("channel", {
                type: "depositProgress",
                code: code,
                data: progress,
                msg: msg,
            })
        }
        return [code,msg,data]
    }
    /** APP握手 A2 APP和读卡器建立握手 */
    resCmdA2(data) { //CMD_HANDSHAKE
        Util.print('------握手------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0xB2){
            return this.resData(-1,'握手失败','')
        }else {
            return this.resData(0,'握手成功','')
        }
    }

    /** 获取卡余额*/
    resCardBalanceFrame(data) { //CMD_CARD_BALANCE
        Util.print('------读取卡余额------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0xB3){
            return this.resData(-1,'读取卡余额失败',0)
        }
        let res = this.getCardBalance(data)
        return this.resData(0,'获取卡余额成功',res)
    }

    /** 获取卡卡号*/
    resCardNumber(data) { //CMD_CARD_NUMBER
        Util.print('------获取卡卡号------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0xB3){
            return this.resData(-1,'读取卡信息失败','')
        }
        let res = this.getCardInfo(data)
        return this.resData(0,'读取卡信息成功',res)
    }

    /** 获取读卡器的电池电量 */
    resCmdC2(data) { //CMD_GET_BATTERY_LEVEL
        Util.print('------获取读卡器的电池电量------:'+Util.bytes2HexString(data));
        /** 00代表没电，非00代表有电 */
        if(Util.byte2Integer255(data[0]) != 0xB5){
            return this.resData(-1,'获取电量失败','',33)
        }
        let powerSituation = Util.byte2Hex(data, 4, 1);
        Util.print('powerSituation : '+powerSituation)
        if(powerSituation == "00"){
            return this.resData(-1,'电量不足','',33)
            //HANDLER_NO_POWER
        }else {
            return this.resData(0,'电量充足','',33)
            //CMD_AUTHENTICATE_ONE
        }
    }

    /** 强制读卡器断电 */
    resCmdC3(data) { //CMD_CUT_OFF_ELECTRICITY
        //无返回 无需处理
    }

    /** 获取认证1 */
    resVerify1C0(data) { //CMD_AUTHENTICATE_ONE
        Util.print('------获取认证1------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0xB6){
            return this.resData(-1,'认证指令Ⅰ失败','',40)
        }
        let c0Data = Util.byte2Hex(data, 5, 33);
        //Util.print('CMD_C0---',c0Data)
        let random1 = c0Data.substring(0, c0Data.length - 2);
        //Util.print('认证random1: ',random1)
        //let algorithmId = c0Data.substring(c0Data.length - 2, c0Data.length);
        return this.resData(0,'认证指令Ⅰ成功',random1,40)
        // HANDLER_CHECK_STEP_ONE
        // 粤通卡圈存第一步握手认证 "/load/firstconfirm"
    }

    /**获取认证2*/
    /**
     * @param serverCertificate
     * @param random2
     * @return
     */
    resVerify2(data) { // CMD_AUTHENTICATE_TWO 验证2 C1+渠道证书号+渠道证书+Rnd2
        Util.print('------获取认证2------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0xB6){
            return this.resData(-1,'认证指令Ⅱ失败','',50)
        }
        let c1Data = Util.bytes2HexString(data);
        //Util.print("c1Data:" + c1Data)
        let c1Length;
        if (parseInt(c1Data.substring(6, 8), 16) != 0) {
            c1Length = parseInt(c1Data.substring(6, 8), 16) * 256 + parseInt(c1Data.substring(4, 6), 16);
        } else {
            c1Length = parseInt(c1Data.substring(4, 6), 16);
        }
        let signRandom = Util.byte2Hex(data, 5, 128);// 随机数签名
        let masterkey = Util.byte2Hex(data, 133, 128);// 共享主密钥
        let clientCertificate = Util.byte2Hex(data, 261, c1Length - 257); // 终端证书

        let Info ={}
        Info.clientCertificate= clientCertificate;
        Info.masterkey= masterkey;
        Info.signRandom= signRandom;
        Util.print(Info)
        return this.resData(0,'认证指令Ⅱ成功',Info,50)
        // HANDLER_CHECK_STEP_TWO
        //粤通卡圈存第二步握手认证 "load/secondconfirm"
    }

    /**
     * 获取认证3
     */
    resVerify3(data) { //CMD_AUTHENTICATE_THREE
        Util.print('------获取认证3------:'+Util.bytes2HexString(data));
        let clientHMAC = Util.byte2Hex(data, 5, 20);
        return this.resData(0,'认证指令Ⅲ成功',clientHMAC,60)
        //HANDLER_CHECK_STEP_THREE
        //粤通卡圈存第二步握手认证 "load/thirdconfirm"
    }

    /**
     * 圈存初始化
     */
    resdoDepositInit(data) { //CMD_DEPOSIT_INIT
        Util.print('------圈存初始化------:'+Util.bytes2HexString(data));
        let instructionRespInit = this.getInstructionResp(data);
        return this.resData(0,'',instructionRespInit)

        // if (this.depositState == 0) { // load/getinitializeins
        //     //圈存初始化响应集 HANDLER_INIT_DEPOSIT
        // }
        // // 处理半条流水/写卡失败
        // else if (this.depositState == 1 || this.depositState == 2) {
        //
        //     // HANDLER_HALF_DEPOSIT_VERIFY sendMessage(HANDLER_HALF_DEPOSIT_VERIFY, instructionRespInit); 获取0015上下线指令集
        // }

    }

    /**0015上下线*/
    resdoDepositGetFifteen(data) { //CMD_DEPOSIT_GET_FIFTEEN
        Util.print('------0015上下线------:'+Util.bytes2HexString(data));
        let instructionFifteen = this.getInstructionResp(data);
        return this.resData(0,'',instructionFifteen)

        // if (this.depositState == 1) { // load/getinitializeins
        //     // 发送3001半条初始化指令集 HANDLER_HALF_DEPOSIT_VERIFY_INIT // load/getinitializeins
        // } // 处理半条流水/写卡失败
        // else if (this.depositState == 0 || this.depositState == 2) {
        //     // 发送1005圈存初始化指令集 HANDLER_INIT_DEPOSIT //load/getinitializeins
        //
        // }
    }

    /**
     * 圈存写卡
     */
    resdoDepositWrite(data) { //CMD_DEPOSIT_WRITE
        Util.print('------圈存写卡------:'+Util.bytes2HexString(data));
        let instructionFifteen = this.getInstructionResp(data);
        //HANDLER_WRITE_DEPOSIT
        return this.resData(0,'',instructionFifteen)
    }

    /**圈存写卡2*/
    resdoDepositWrite2(data) { //CMD_DEPOSIT_WRITE2
        Util.print('------圈存写卡2------:'+Util.bytes2HexString(data));
        let instructionFifteen = this.getInstructionResp(data);
        //HANDLER_CONFIRM_DEPOSIT
        return this.resData(0,'',instructionFifteen)
    }

    /**圈存写卡2*/
    resdoDepositHalf(data) { //CMD_DEPOSIT_HALF_1
        Util.print('------圈存写卡2s------:'+Util.bytes2HexString(data));
        let instructionFifteen = this.getInstructionResp(data);
        //HANDLER_HALF_DEPOSIT_VERIFY_RESULT
        return this.resData(0,'',instructionFifteen)
    }




    //国密
    /** APP握手 80 APP和读卡器建立握手（国密） */
    resHandshakeGuomi(data) { //CMD_HANDSHAKE_GUOMI
        Util.print('Guomi------握手------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x90){
            return this.resData(-1,'握手失败','')
        }else {
            return this.resData(0,'握手成功','')
        }
    }

    /**获取卡余额（国密）*/
    resCardBalanceFrameGuomi(data) { //CMD_CARD_BALANCE_GUOMI
        Util.print('Guomi------获取卡余额------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'获取卡余额失败',0)
        }
        let res = this.getCardBalance(data)
        return this.resData(0,'获取卡余额成功',res)
    }

    /**获取卡卡号（国密）*/
    resCardNumberGuomi(data) {//CMD_CARD_NUMBER_GUOMI
        Util.print('Guomi------获取卡卡号------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'获取卡卡号失败','')
        }
        let res = this.getCardInfo(data)
        return this.resData(0,'获取卡片信息成功',res)
    }

    /**读取0015文件（国密）*/
    resCardInfoGuomi(data) { //CMD_READ_0015_GUOMI
        Util.print('Guomi------读取0015文件------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'读取0015文件失败','')
        }
        //0015文件
        let fileEf01String = Util.bytes2HexString(data);
        return this.resData(0,'读取0015文件成功',fileEf01String)
    }

    /**读取EF01文件（国密）*/
    resEF01(data) { //CMD_READ_EF01_GUOMI
        Util.print('Guomi------读取EF01文件------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'取EF01文件失败','')
        }
        let fileEf01String = Util.bytes2HexString(data);
        return this.resData(0,'取EF01文件成功',fileEf01String)
    }

    /**读取EF1D文件（国密）*/
    resEF1D(data) { //CMD_READ_EF1D_GUOMI
        Util.print('Guomi------读取EF1D文件------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'读取EF1D文件失败','')
        }
        let fileEf1dString = Util.bytes2HexString(data);
        return this.resData(0,'读取EF1D文件成功',fileEf1dString)
    }

    /** 激活卡片（国密） */
    resactivateCardGuomi(data) { //CMD_ACTIVATE_CARD_GUOMI
        Util.print('Guomi------激活卡片------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'激活卡片失败','')
        }
        let resps = this.getInstructionRespGuomi(data);
        return this.resData(0,'',resps)
        //HANDLER_ACTIVATE_CAR_AND_OBU_GUOMI
    }

    /** 激活蓝牙obu（国密） */
    resactivateObuGuomi(data) { //CMD_ACTIVATE_OBU_GUOMI
        Util.print('Guomi------激活蓝牙obu------:'+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'激活蓝牙obu失败','')
        }
        let resps = this.getInstructionRespGuomi(data);
        return this.resData(0,'',resps)
        //HANDLER_ACTIVATE_CAR_AND_OBU_GUOMI
    }

    /**验证PIN码类型（国密）*/
    rescheckPINTypeGuomi(data,cardInfo) { //CMD_CHECK_PIN_TYPE_GUOMI
        Util.print('Guomi------验证PIN码类型------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'验证PIN码类型失败','')
        }
        if(cardInfo.cardVer == undefined || cardInfo.cardNum ==undefined){
            return this.resData(-1,'卡片信息错误','')
        }

        let checkPINTypeData = Util.bytes2HexString(data);
        let cardVersion = parseInt(cardInfo.cardVer,16)
        //Util.print("Guomi------卡片版本号------: " + cardVersion)
        if (cardVersion < 64) {
            let temp = checkPINTypeData.substring(18, 20);
            //Util.print("Guomi------密码类型------: " + temp)
            let ascPinType = Util.strToHexCharCode(temp);
            //Util.print("Guomi------密码类型------: " + ascPinType)
            //Util.print("Guomi------卡片版本号------: " + cardVersion)
            let ascCardNo = Util.strToHexCharCode(cardInfo.cardNum);
            let paramData = "80D3000012" + ascPinType + ascCardNo;
            let paramHead = [0x01, (paramData.length/ 2 & 0xff)];
            let head = new Array(2);
            head[0] =  0x80;
            head[1] = ((paramData.length / 2 + 2) & 0xff);
            let cmdstr = Util.bytes2HexString(head) + Util.bytes2HexString(paramHead) + paramData;
            //Util.print("Guomi---cmdstr: " + cmdstr)
            return this.resData(0,'',[cmd.CMD_CHECK_SE_ONE_GUOMI,cmdstr])
            //CMDHelper.checkSE1Guomi(cmd) //CMD_CHECK_SE_ONE_GUOMI  cmdstr
        }else {
            return this.resData(0,'',[cmd.CMD_CHECK_PIN_GUOMI,cmd.DIRECT_CMD_CARD_PIN])
            //CMDHelper.checkPINGuomi(DIRECT_CMD_CARD_PIN) // CMD_CHECK_PIN_GUOMI
        }

    }

    /**验证SE指令（国密）*/
    rescheckSE1Guomi(data) { //CMD_CHECK_SE_ONE_GUOMI
        Util.print('Guomi------验证SE指令------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'验证SE指令失败','')
        }
        let checkSE1Data = Util.bytes2HexString(data);
        //Util.print('Guomi------CMD_CHECK_SE_ONE_GUOMI------: '+checkSE1Data);
        let cmdResult = checkSE1Data.substring(10, checkSE1Data.length);
        //Util.print('Guomi------pinAuth------: '+cmdResult);
        let top2 = cmdResult.substr(cmdResult.length - 4, 2)
        //Util.print('Guomi------验证SE指令-top2------: '+top2);
        if(cmdResult.substring(cmdResult.length - 4, cmdResult.length).startsWith("61")){
            return this.resData(0,'',[cmd.CMD_CHECK_SE_TWO_GUOMI,cmd.DIRECT_CMD_CARD_PIN_AFTER_SE])
            //CMDHelper.rescheckSE2Guomi(DIRECT_CMD_CARD_PIN_AFTER_SE) //CMD_CHECK_SE_TWO_GUOMI  DIRECT_CMD_CARD_PIN_AFTER_SE
        }else {
            let pin = cmdResult.substring(cmdResult.length - 16, cmdResult.length - 4);
            //Util.print('Guomi------验证SE指令-pinAuth-pin1------: '+pin);
            pin = Util.convertHexToString(pin);
            //Util.print('Guomi------验证SE指令-pinAuth-pin2------: '+pin);
            let param2Data = this.verityPIN(pin);
            let param2Head = [0x02, (param2Data.length / 2 & 0xff)];
            let param1 = "C10700a40000021001";
            let head = [];
            head[0] =  0x80;
            head[1] =  ((param2Data.length / 2 + 11) & 0xff);
            let cmdstr = Util.bytes2HexString(head) + param1 + Util.bytes2HexString(param2Head) + param2Data;
            return this.resData(0,'',[cmd.CMD_CHECK_PIN_GUOMI,cmdstr])
            // CMDHelper.checkPINGuomi(cmdstr) //CMD_CHECK_PIN_GUOMI
        }
    }

    /**再次验证SE指令（国密）*/
    rescheckSE2Guomi(data) { //CMD_CHECK_SE_TWO_GUOMI
        Util.print('Guomi------再次验证SE指令------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'再次验证SE指令失败','')
        }
        let checkSE2Data = Util.bytes2HexString(data);
        //Util.print('Guomi------CMD_CHECK_SE_TWO_GUOMI------: '+checkSE2Data);
        let pin = checkSE2Data.substring(checkSE2Data.length - 16, checkSE2Data.length - 4);
        //Util.print('Guomi------验证SE指令-pinAuth-pin1------: '+pin);
        pin = Util.convertHexToString(pin);
        //Util.print('Guomi------验证SE指令-pinAuth-pin2------: '+pin);
        let param2Data = this.verityPIN(pin);
        let param2Head = [0x02,  (param2Data.length / 2 & 0xff)];
        let param1 = "C10700a40000021001";
        let head = [];
        head[0] =  0x80;
        head[1] = ((param2Data.length / 2 + 11) & 0xff);
        let cmdstr = Util.bytes2HexString(head) + param1 + Util.bytes2HexString(param2Head) + param2Data;
        return this.resData(0,'',[cmd.CMD_CHECK_PIN_GUOMI,cmdstr])
        //CMDHelper.checkPINGuomi(cmdstr) //CMD_CHECK_PIN_GUOMI
    }

    /**验证PIN码（国密）*/
    rescheckPINGuomi(data) { //CMD_CHECK_PIN_GUOMI
        Util.print('Guomi------验证PIN码------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x92){
            return this.resData(-1,'验证PIN码失败','')
        }
        return this.resData(0,'验证PIN码成功','')
        //下一步进行圈存初始化（国密）
    }

    /**获取读卡器的电池电量（国密）*/
    resCmdC2Guomi(data) { //CMD_GET_BATTERY_LEVEL_GUOMI
        Util.print('Guomi------获取读卡器的电池电量------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x91){
            return this.resData(-1,'电池电量失败','')
        }
        let powerSituation = Util.byte2Hex(data, 4, 1);
        if(powerSituation == "00"){
            return this.resData(-1,'电量不足','')
            //HANDLER_NO_POWER //提示或者断电
        }else {
            return this.resData(0,'电量充足','')
            //CMD_AUTHENTICATE_GUOMI // 认证指令1
        }
    }

    /**强制读卡器断电（国密）*/
    resCmdC3Guomi(data) { //CMD_CUT_OFF_ELECTRICITY_GUOMI
        //无返回
    }

    /**认证（国密）*/
    resVerify1C0Guomi(data) { //CMD_AUTHENTICATE_GUOMI
        Util.print('Guomi------认证------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x94){
            return this.resData(-1,'认证失败','',36)
        }
        let deviceno = Util.byte2Hex(data, 5, 8);
        let random1 = Util.byte2Hex(data, 13, 16);
        let timestamp = Util.byte2Hex(data, 30, 4);

        let info ={};
        info.deviceno= deviceno;
        info.random1= random1;
        info.timestamp=timestamp;
        return this.resData(0,'认证成功',info,36)
        // HANDLER_CHECK_STEP_GUOMI
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
    resVerify2Guomi(data) { //CMD_AUTHENTICATE_RESULT_GUOMI
        Util.print('Guomi------认证结果------: '+Util.bytes2HexString(data));
        if(Util.byte2Integer255(data[0]) != 0x94){
            return this.resData(-1,'认证结果失败','',37)
        }
        return this.resData(0,'认证结果成功','',37)
        //CMDHelper.checkPINTypeGuomi()  //CMD_CHECK_PIN_TYPE_GUOMI
    }

    /**圈存初始化（国密）*/
    resdoDepositInitGuomi(data) { //CMD_DEPOSIT_INIT_GUOMI
        Util.print('Guomi------圈存初始化------: '+Util.bytes2HexString(data));
        let resps = this.getInstructionRespGuomi(data);
        return this.resData(0,'',resps)
        // 处理正常流程/写卡失败
        // if (this.depositState == 0 || this.depositState == 2) {
        //     // HANDLER_WRITE_GUOMI resps
        // }else if (this.depositState == 1) { // 处理半条流水/写卡失败
        //     // HANDLER_HALF_VERIFY_SEND_RES_GUOMI resps
        // }
    }

    /**圈存写卡（国密）*///可能会导致半条流水
    resdoDepositWriteGuomi(data) {//CMD_DEPOSIT_WRITE_GUOMI
        Util.print('Guomi------圈存写卡------: '+Util.bytes2HexString(data));
        let resps = this.getInstructionRespGuomi(data);
        return this.resData(0,'',resps)
        //HANDLER_CONFIRM_GUOMI resps
    }
}
export default CMDRes
//export { CMDRes };
