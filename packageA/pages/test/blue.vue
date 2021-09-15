<template>
    <view>

        <view style="width: 100%; margin-top: 10px">
            <button type="primary" v-if="orderId===''" @click="checkRandomOrder">下单</button>
        </view>
        <view style="width: 100%; margin-top: 10px">
            <button type="primary" v-if="orderId!==''" @click="getDev">扫描</button>
        </view>
        <view style="width: 100%; margin-top: 10px">
            <button type="primary">{{connectStatus}}</button>
        </view>
        <view style="width: 100%; margin-top: 10px">
            <button type="primary">{{depositProgress}}%</button>
        </view>
        <view style="width: 100%; margin-top: 10px">
            <view style="width: 200px; margin-top: 10px">订单号：{{orderId}}</view>
            <view style="width: 200px; margin-top: 10px">余额：{{balance}}</view>
            <view style="width: 200px; margin-top: 10px">卡号：{{cardInfo.cardNum || ''}}</view>
            <view style="width: 200px; margin-top: 10px">表面号：{{deviceInfo.senumber || ''}}</view>
            <view style="width: 200px; margin-top: 10px">车牌号：{{cardInfo.plateNum || ''}}</view>
        </view>
        <view style="width: 100%;" v-if="devCheck">
            <view style="margin: 10px" v-for="(item,index) in deviceList">
                <button type="primary" @click="setDev(item)">表面号:{{item.senumber}}-连接设备</button>
            </view>
        </view>
        <view style="width: 100%; margin-top: 10px">
            <button type="primary" @click="test1" style="width: 140px; margin-left: 10px;float: left">测试1</button>
            <button type="primary" @click="test2" style="width: 140px; margin-left: 10px;float: left">测试2</button>
        </view>
    </view>
</template>

<script>

    import * as Events from 'eventemitter2'

    const emitter = new Events.EventEmitter2();
    import * as bleProxy from "@/packageA/pages/ytk/ytk_deposit/blue/bleProxy";
    import {BLE} from "@/packageA/pages/ytk/ytk_deposit/blue/ble";

    const ble = new BLE(emitter, '');
    import {CMDHelper} from "@/packageA/pages/ytk/ytk_deposit/blue/cmdHelper";
    //const cmdHelper = new CMDHelper(emitter,92)
    import {BLEReceive} from "@/packageA/pages/ytk/ytk_deposit/blue/bleReceive";
    //const bleReceive = new BLEReceive(emitter,0)
    import {DepositCard} from "@/packageA/pages/ytk/ytk_deposit/blue/depositCard";
    //const depositCard = new DepositCard(emitter,ble,cmdHelper,deviceInfo)

    import * as Util from "@/packageA/pages/ytk/ytk_deposit/blue/util";
    import {mapState} from "vuex";
    import conf from '@/config/conf.js'
    import * as API from "@/interfaces/base";

    import ytkDataEncode from "@/packageA/pages/test/blueAPIs/ytkDataEncode";
    import ytkAuthAPI from "@/packageA/pages/test/blueAPIs/ytkAuthAPI";


    export default {
        data() {
            return {
                emitter: emitter,
                ble: ble,
                connectStatus: "",
                devType: -1,
                cmdHelper: null,
                bleReceive: null,

                deviceId: '',
                deviceList: [],
                macsar: [],
                devCheck: false,

                deviceInfo: '',
                depositCard: null,
                orderId: '2108191944520010',
                depositState: "",
                depositProgress: '',

                balance: 0,
                cardInfo: null,
                //cardNo:"1913222300077490",
				cardNo:"1812222300175505",
				//cardNo:"1715223209002380"
                intCount: 0,

            };
        },
        onLoad(options) {
            this.initAll()
            this.watchBLE()
            if (options.orderid) {
                this.orderId =options.orderid ;
            }
            if (options.cardNo) {
                this.cardNo =options.cardNo ;
            }
        },
        mounted() {
        },
        computed: {
            ...mapState({
                token: (state) => state.user.token,
                openid: (state) => state.user.info.openid,
            }),
        },
        methods: {
            test1() {
                let aa = ytkDataEncode.initEncode("A2")
                console.log('aa: ',aa)
                aa = ytkDataEncode.initEncode("80")
                console.log('aa: ',aa)
            },
            test2() {

            },
            initAll() {
                //const ble = new BLE(emitter, '');
                //this.ble = ble
                //this.ble.close()
                this.devType = -1
                this.cmdHelper = null
                this.bleReceive = null
                //this.connectStatus = ''
                this.deviceId = ''
                this.deviceList = []
                this.macsar = []
                this.mac2 = []
                this.devCheck = false
                this.deviceInfo = null
                this.depositCard = null
                this.depositState = ''
                this.depositProgress = ''
                this.intCount=0
                this.manufactory=0
                this.maxpacklen=0
            },
            checkRandomOrder(){//检查是否有未支付订单
                bleProxy.checkRandomOrder({
                    cardNo:this.cardNo
                }).then(res => {
                    let {code, data} = res;
                    if (code == 0) {
                        console.log("data : ",data)
                        let trade_id = data.trade_id || ''
                        if(trade_id){
                            this.apiRepaid(data.trade_id)
                        }else {
                            this.ApiPrepaid()
                        }

                    }
                })
            },
            apiRepaid(trade_id){//调起微信小程序支付
                API.apiRepaid({
                    trade_platform:1,
                    trade_mode:3,
                    trade_id:trade_id,
                    //openid:this.openid,
                    //openid:"o1GrO4tlzDxCyV7gZM9Mvog9VnMQ",
                    token:this.token,
                    //source_channel:2,
                    //sourceChannel:2

                }).then(res => {
                    let {code, data} = res;
                    if (code == 0) {
                        this.onTradePay(data)
                    }
                })
            },
            onTradePay(data) {
                let {
                    timeStamp,
                    signType,
                    nonceStr,
                    paySign,
                    package: wxpackage,
                    successUrl,
                    failUrl,
                } = data.prepaid_info;
                try {
                    //发起支付
                    uni.requestPayment({
                        timeStamp,
                        nonceStr,
                        package: wxpackage, //因为package 是javascript 的关键字，所以不能直接写，编译器会报错
                        signType,
                        paySign,
                        success: (res) => {
                            uni.redirectTo({
                                url: "/pages/test/blue?orderid="+data.orderid+"&trade_id="+data.trade_id+"&summary_order_id="+data.summary_order_id
                            });
                        },
                        fail: (res) => {
                            if (failUrl) {
                                uni.redirectTo({
                                    url: "/pages/test/blue",
                                });
                                return;
                            }
                            uni.showToast({
                                title: "支付失败",
                                icon: "none"
                            });

                        },
                    });
                } catch (error) {
                    console.log(error);
                }
            },
            ApiPrepaid() { //下单接口
                let data = []
                data["trade_num"] = "0.1";
                data["card_no"] = this.cardNo;
                data["load_type"] = "0";
                data["order_type"] = "11";
                data["privilege_amount"] = "0";//优惠后的价格

                // //vip
                // data["vip_merge_type"] = "1"; // 1：套餐，2：特权
                // data["vip_merge_id"] = ""; // 套餐ID
                // data["reduction_id"] = "";// 会员卡规则ID
                // data["vip_discount"] = ""; // VIP套餐减免金额

                //data["kcoin"] = "2";//金币抵扣

                //data['token'] = this.token //需要签名必须在这里加上
                data['token'] = "a2afed3a6eef13cea272d8460a9af670"

                data["isWifi"] = conf.isWifi;
                data["distinct_id"] = conf.distinct_id;
                data["appMarketChannel"] = conf.appMarketChannel;
                data["network_type"] = conf.network_type;
                data["version"] = conf.version;
                data["etcos"] = conf.etcos;
                data['time'] = Date.parse(new Date());
                data['sign'] = Util.create_sign(data, "OUVYIBwViFAA6MunV5GMPJ5I4ptCMDqS")
                let dataobj = {}
                for(let item in data){
                    dataobj[item] = data[item]
                }
                bleProxy.prepaidV3(dataobj).then(res => {
                    let {code, data} = res;
                    if (code == 0) {
                        let trade_id = data.trade_id || ''
                        if(trade_id){
                            this.apiRepaid(trade_id)
                        }

                    }
                })
            },


            getDev() {
                this.initAll()
                this.macsar = []
                this.deviceId = ''
                this.ble.getDev().then(res => {
                    console.log('deviceIds', res)
                    //this.deviceId = res[0].deviceId
                    for (let i = 0; i < res.length; i++) {
                        this.macsar.push(res[i].mac)
                        this.mac2[res[i].mac] = res[i].deviceId;
                    }
                    this.macsar = [...new Set(this.macsar)]
                    this.fetchDevicenoByMac()
                })
            },
            setDev(data) {
                console.log('data------', data)
                this.deviceInfo = data
                this.deviceId = this.mac2[this.str2mac(data.macaddress)]
                this.ble.setDev(this.deviceId)
            },
            str2mac(str) {
                let mac = []
                for (let i = 0; i < str.length; i += 2) {
                    mac.push(str.substr(i, 2))
                }
                return mac.join(":")
            },
            //扫描发现设备
            fetchDevicenoByMac() {
                this.deviceList = []
                bleProxy.fetchDevicenoByMac({
                    //version: "4.4.0",
                    mac: this.macsar.join(",").replace(/:/g, ""),
                }).then(res => {
                    let {code, data} = res;
                    if (code == 0) {
                        if (data.info && data.info.length > 0) {
                            this.deviceList = data.info;
                            if (this.deviceList.length === 1) {
                                //this.setDev(this.deviceList[0])
                                this.devCheck = true
                            } else if (this.deviceList.length >= 1) {
                                this.depositState = 0
                                this.depositProgress = "已经发现充值设备，开始连接"
                                this.devCheck = true
                            }
                        }
                    }
                })
            },
            checkCardno() {
                this.connectStatus = "检测卡号是否一致"
                this.depositProgress = 43
                // if (this.devType === 0) {
                //     //直接去划账
                //     this.loadPayV2()
                //     //this.sendBlueOrders(this.cmdHelper.getCmdC2Guomi())
                // } else if (this.devType === 1){
                //     //检测设备绑定
                //     //this.bindDevice()
                //     this.sendBlueOrders(this.cmdHelper.getCmdC2())
                // }
                // return
                bleProxy.checkCardno({
                    cardno: this.cardInfo.cardNum,
                    order_id: this.orderId
                }).then(res => {
                    let {code, data} = res;
                    if (code == 0) {
                        if (data.res) {
                            if (this.devType === 0) {
                                this.sendBlueOrders(this.cmdHelper.getCmdC2Guomi())
                            } else if (this.devType === 1) {
                                //检测设备绑定
                                this.bindDevice()
                            }
                        }
                    }
                })
            },
            bindDevice() {//非国密
                bleProxy.bindDevice({
                    cardno: this.cardInfo.cardNum,
                    senumber: this.deviceInfo.senumber,
                    device_type: 1,
                    option_type: 1,
                    order_id: this.orderId
                }).then(res => {
                    let {code, data} = res;
                    if (code == 0) {
                        if (data.result === "success") {
                            //this.sendBlueOrders(this.cmdHelper.getCmdC2())
                        }
                    }
                })
            },

            // 下发蓝牙指令
            sendBlueOrders(data) {
                //console.log('data : ', data)
                let currCmd = this.cmdHelper.currCmd
                //console.log('currCmd : ', currCmd)
                return new Promise((resolve, reject) => {
                    let flow = this.ble.send(data)//发送数据
                    if (flow) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            },
            watchBLE() {
                let that = this
                if (this.ble) {
                    //console.log('this.ble', this.ble)
                    this.ble.listen(res => {
                        //console.log('watchBLE', res)
                        if (res.type === 'connect') { //连接
                            console.log('connect', res)
                            if (res.code === "-1") {
                                wx.showModal({
                                    title: "提示",
                                    content: res.data,
                                    showCancel: false,
                                    confirmText: "确定",
                                });
                            } else {
                                this.connectStatus = res.data
                                if (res.data === "蓝牙已连接") {
                                    this.depositState = 9
                                    this.depositProgress = "充值设备服务被正常开启"
                                    this.devType = res.devType
                                    if (this.deviceInfo) {
                                        this.bleReceive = new BLEReceive(emitter, this.devType)
                                        this.cmdHelper = new CMDHelper(emitter, Number(this.deviceInfo.maxpacklen))
                                        this.depositState = 18
                                        this.depositProgress = "充值设备响应成功"
                                        if (this.devType === 0) {
                                            that.sendBlueOrders(this.cmdHelper.getHandshakeGuomi())//握手
                                        } else if (this.devType === 1) {
                                            //that.sendBlueOrders(this.cmdHelper.authEncode()) //登录
                                        }
                                        this.depositCard = new DepositCard(this.emitter, this.ble, this.cmdHelper, this.deviceInfo)
                                    }
                                }
                            }
                        } else if (res.type === 'response') { //接收
                            //console.log('response', res)
                            if (res.code === "0") {
                                this.bleReceive.receiveData(res.data)
                            }
                        } else if (res.type === 'depositProgress') { //圈存进度
                            //console.log('depositProgress', res)
                            if (res.code === -1 && res.msg !== '') {
                                wx.showModal({
                                    title: "提示",
                                    content: res.msg,
                                    showCancel: false,
                                    confirmText: "确定",
                                });
                            } else if (res.code === 0 && res.msg !== '' && res.data > 0) {
                                this.connectStatus = res.msg //圈存状态
                                this.depositProgress = res.data //进度值
                            }
                        } else if (res.type === 'authEncode') {
                            //console.log('authEncode', res)
                            if (res.code === "0") {
                                that.sendBlueOrders(this.cmdHelper.authEncode())
                            }
                        } else if (res.type === 'initEncode') {
                            //console.log('initEncode', res)
                            if (res.code === "0") {
                                console.log(' this.intCount', this.intCount)
                                if(this.deviceInfo.manufactory==2){//万集
                                    that.sendBlueOrders(this.cmdHelper.initEncode())
                                }else if (this.deviceInfo.manufactory==4){ //金溢
                                    this.intCount++
                                    if(this.intCount===1){
                                        that.sendBlueOrders(this.cmdHelper.initEncode1())
                                    }
                                    if(this.intCount===2){
                                        that.sendBlueOrders(this.cmdHelper.initEncode2())
                                        this.intCount=0
                                    }
                                }

                            }
                        } else if (res.type === 'encode') {
                            //console.log('encode', res)
                            if (res.code === "0") {
                                that.sendBlueOrders(this.cmdHelper.getCmdA2())
                            }
                        } else if (res.type === 'packageData') {
                            console.log('packageData', res)
                            if (res.code === "0") {
                                this.cmdHelper.receiveDataWrite(res.data)
                            }
                        } else if (res.type === 'frameData') {
                            console.log('frameData', res);
                            if (res.code === "0") {
                                let currCmd = this.cmdHelper.currCmd
                                this.depositCard.setOrderId(this.orderId)
                                this.depositCard.processRecvData(currCmd, res)
                            }
                        } else if (res.type === 'balance') {
                            console.log('balance', res);
                            if (res.code === "0") {
                                this.balance = res.data
                            }
                        } else if (res.type === 'cardInfo') {
                            console.log('cardInfo', res);
                            if (res.code === "0") {
                                this.cardInfo = res.data.cardInfo
                                if (res.data.depositState === 3) {
                                    this.connectStatus = "圈存成功"
                                    this.depositProgress = 100
                                    this.orderId = ''
                                    if (this.devType === 0) {
                                        that.sendBlueOrders(this.cmdHelper.getCmdC3Guomi())//强制断电
                                    } else {
                                        that.sendBlueOrders(this.cmdHelper.getCmdC3()) //强制断电
                                    }
                                    this.ble.close()
                                } else {
                                    this.checkCardno()
                                }
                            }
                        } else if (res.type === 'depositCardData') { //圈存逻辑
                            console.log('depositCardData', res)
                            if (res.code === "-1") {
                                wx.showModal({
                                    title: "提示",
                                    content: res.data,
                                    showCancel: false,
                                    confirmText: "确定",
                                });
                                if (this.devType === 0) {
                                    that.sendBlueOrders(this.cmdHelper.getCmdC3Guomi())//强制断电
                                } else {
                                    that.sendBlueOrders(this.cmdHelper.getCmdC3()) //强制断电
                                }
                                this.ble.close()
                                this.initAll()
                            } else if (res.code === "0") {
                                console.log('depositCardData', res)
                            }
                        }
                    })
                }
            }
        },
        onUnload() {
        }
    }
</script>

<style>
</style>
