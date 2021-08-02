/**
 * @Description: 圈存服务端接口
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import request from "@/common/request";
import { G} from "@/common/constant";
//圈存开始
/**
 *根据MAC地址获取充值设备号
 *
 * @export
 * @param {*} data
 * token
 * mac 多个mac地址用逗号“,”隔开
 * @returns
 * deviceid	string	设备ID
 * senumber	string	充值易设备号 设备表面号
 * qrcode	string	设备二维码地址
 * loadtype	string	圈存类型 2充值易
 * state	string	 状态1有效
 * manufactory	string	设备厂家代码 厂家编号
 * macaddress	string	设备mac地址
 * maxpacklen	string	设备通信最大字节长度 最大分包 92
 */
export function fetchDevicenoByMac(data){
  return request({
    url: `${G}/api-unitoll/device/fetchDevicenoByMac`,
    method: "post",
    data
  });
}

// /**
//  * 我的充值设备
//  * 获取绑定设备信息
//  * /unitoll/card/getDeviceList 旧的
//  * /unitoll/device/fetchDeviceInfoList 1.7.3
//  */
// export function fetchDeviceInfoList(data){
//   return request({
//     url: `${G}/m/unitoll/device/fetchDeviceInfoList`,
//     method: "post",
//     data
//   });
// }
// /**
//  * 我的充值设备
//  * 获取设备类型列表
//  */
// export function fetchDeviceType(data){
//   return request({
//     url: `${G}/m/unitoll/device/fetchDeviceType`,
//     method: "post",
//     data
//   });
// }
/**
 *判断充值易的插入的卡号跟订单的卡号是否相同
 *
 * @export
 * @param {*} data
 * token
 * cardno	string	是	 	粤通卡号
 * order_id string	是	 	订单号
 * @returns
 * res	boolean	true为一致，false为不一致
 * message	string	 false时的提示语
 */
export function checkCardno(data){
  return request({
    url: `${G}/api-unitoll/recharge/checkCardno`,
    method: "post",
    data
  });
}
/**
 *绑定新设备接口(非国密圈存在划账之前调用)
 *
 * @export
 * @param {*} data
 * token
 * cardno	string	是	 	粤通卡号
 * senumber	string	是 设备号
 * device_type	充值设备类型，默认为1
 * option_type 1不需要更换卡，2需要更换卡
 * order_id string	是	 	订单号
 * @returns
 * code	int	0为成功，非0为失败
 * msg	string	成功或失败的提示信息
 * data object 结果集
 * result string success
 * reward
 * tips
 * hanging_url
 */
export function bindDevice(data){
  return request({
    url: `${G}/api-unitoll/device/bindDevice`,
    method: "post",
    data
  });
}
/**
 *是否有空充设备
 *
 * @export
 * @param {*} data
 * token
 * cardno	string	是	 	粤通卡号
 * version string	是	 	版本号
 * @returns
 * code	int	0为成功，非0为失败
 * data	boolean	true为有设备，false为无设备
 * msg	string	成功或失败的提示信息
 */
export function checkUserDevice(data){
  return request({
    url: `${G}/api-unitoll/recharge/checkUserDevice`,
    method: "post",
    data
  });
}
/**
 *圈存划账
 *
 * @export
 * @param {*} data
 * token	string	Y
 * cardno	string	Y	粤通卡号
 * orderId	string	Y	订单号
 * deviceno	string	Y	设备表面号
 * balance	string	Y	卡的余额，分
 * type	int	Y	圈存设备类型	1 充值宝、充值易，2 行车记录仪，3 NFC
 * udid	string	Y	手机设备号
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data	string	订单号
 */
export function loadPayV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/loadPay`,
    method: "post",
    data
  });
}

/**
 *国密认证
 *
 * @export
 * @param {*} data
 * token string Y
 * random1 string Y 终端随机数 F326C2DB012F6B374672022E02054192
 * timestamp  string Y 时间戳，8位
 * deviceno  string Y 设备芯片号，即SE内部编号 4402181910077878
 * @returns
 * code int 0：成功，其他失败
 * msg string 提示信息
 * data object 结果集
 * code string 00：验证通过，其他失败
 * currentTime string 当前时间
 * mackey string 算mac密钥
 * mackeyMac string HMAC
 * random2 string 中心随机数
 * sessionId string 会话id
 * signdata string 签名值
 * validityDate string 会话有效时长
 * workkey string 加解密密钥
 * workkeyMac string HMAC
 */
export function secretConfirmV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/secret-confirm`,
    method: "post",
    data
  });
}

/**
 *获取初始化指令集
 *
 * @export
 * @param {*} data
 * token	string	Y
 * cardArea	string	Y 卡片网络编号 4401
 * orderId	string	Y 订单
 * cardno	string	Y 卡号 1541221510090014
 * balance	string	Y 卡内金额，分 157259
 * deviceno	string	Y	设备表面号
 * billno	string	Y	消费billno，半条流水61情况下要传值，其他情况传空
 * type	int	Y	圈存设备类型	1 充值宝、充值易，2 行车记录仪，3 NFC
 * udid	string	Y	手机设备号
 * @returns
 * code int 0：成功，其他失败
 * msg string 提示信息
 * data object 结果集
 * billno string 消费单号
 * code string 00：表示成功,51：表示存在半条流水，61：表示存在写卡失败记录，73：表示存在已付款未消费订单， 其他：错误提示处理
 * instructions string 指令执行的结果集
 * instructionsMac string 明文指令集对应的mac校验码
 */
export function getinitializeinsV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/getinitializeins`,
    method: "post",
    data
  });
}

/**
 *获取圈存指令集
 *
 * @export
 * @param {*} data
 * token	string	Y
 * instructionResps	string	Y 指令执行的结果集
 * instructionRespsMac	string	Y 响应报文集明文对应的mac校验码
 * @returns
 * code	int	0:成功，其他失败
 * msg	string	提示信息
 * data	object	结果集
 * code string	00：表示成功
 * instructions string 指令集
 * instructionsMac string 明文指令集对应的mac校验码
 */
export function getloadinsV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/getloadins`,
    method: "post",
    data
  });
}

/**
 *圈存确认
 *
 * @export
 * @param {*} data
 * token string Y
 * instructionResps string Y 指令执行的结果集
 * instructionRespsMac string Y 响应报文集明文对应的mac校验码
 * orderId string Y 订单号
 * cardno string Y 粤通卡号
 * deviceno string Y 设备表面号
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data	object	结果集
 * code string 00：表示成功
 * load_moeny	int	圈存金额
 * returnMoney string 优惠赠送（回退金额）
 */
export function loadconfirmV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/loadconfirm`,
    method: "post",
    data
  });
}
/**
 * 国密获取校验指令集（补全半条记录） 貌似没用上
 */
export function getCheckInstructionV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/getCheckInstruction`,
    method: "post",
    data
  });
}

/**
 *上送校验结果（补全半条记录）
 *
 * @export
 * @param {*} data
 * token	string	Y
 * instructionResps	string	Y 指令执行的结果集
 * instructionRespsMac	string	Y 响应报文集明文对应的mac校验码
 * orderId string Y 订单号
 * cardno string Y 粤通卡号
 * deviceno	string	Y	设备表面号
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code string	00：表示成功
 * load_moeny	int	圈存金额
 * returnMoney string 优惠赠送（回退金额）
 * instructions string code为01时返回，执行0元初始化的指令集
 * instructionsMac string code为01时返回，执行0元初始化的明文指令集对应的mac校验码
 */
export function sendsignresultV2(data){
  return request({
    url: `${G}/api-unitoll/v2/load/sendsignresult`,
    method: "post",
    data
  });
}

/**
 * 圈存下单
 */

// export function loadInit(data){
//   return request({
//     url: `${G}/api-unitoll/load/init`,
//     method: "post",
//     data
//   });
// }

/**
 * 新粤通卡圈存下单
 */

export function prepaidV3(data){
  return request({
    url: `${G}/api-unitoll/v3/load/prepaid`,
    method: "post",
    data
  });
}
/**
 * 检测圈存未支付订单
 * 参数cardNo
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * order_id
 * order_status
 * trade_id
 * recharge_money
 * privilege_amount
 * load_money
 */
export function checkRandomOrder(data){
  return request({
    url: `${G}/api-unitoll/order/checkRandomOrder`,
    method: "post",
    data
  });
}
/**
 * 划账
 *token
 * cardno	卡号
 * orderId	订单号
 * deviceno	设备号
 * balance	卡的余额	单位分
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data	string	订单号
 */
export function loadPay(data){
  return request({
    url: `${G}/api-unitoll/load/loadPay`,
    method: "post",
    data
  });
}

/**
 * 粤通卡圈存第一步握手认证
 * token
 * random1 终端随机数
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code
 * random2
 * serverCertificate
 */
export function firstconfirm(data){
  return request({
    url: `${G}/api-unitoll/load/firstconfirm`,
    method: "post",
    data
  });
}

/**
 * 粤通卡圈存第二步握手认证
 * token
 * clientCertificate 终端证书 填写设备编号(充值设备的终端编号sn) 4402154910000026
 * masterkey 共享主密钥 用渠道证书公钥加密（16进制字符串）(加密终端编号，算法是：RSA/ECB/PKCS1Padding)
 * signRandom 随机数签名值  对random1、random2进行连接，进行哈希签名（16进制字符串）(用设备内私钥签名)
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code
 * serverHMAC
 */
export function secondconfirm(data){
  return request({
    url: `${G}/api-unitoll/load/secondconfirm`,
    method: "post",
    data
  });
}
/**
 * 粤通卡圈存第三步握手认证
 * token
 * clientHMAC
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 */
export function thirdconfirm(data){
  return request({
    url: `${G}/api-unitoll/load/thirdconfirm`,
    method: "post",
    data
  });
}
/**
 * 获取粤通卡圈存初始化指令（三合一接口） 圈存上下限，消费单据号和0015指令集合并在同一个接口处理
 * token
 * cardArea 卡片网络编号 0015文件中第11和12字节的16进制字符串  440
 * cardno 卡号 1501220000000490
 * balance 卡内金额 卡的余额，10进制数，单位分
 * deviceno 设备编号 4402154910000026
 * orderId 订单号
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 * amount
 * rechargeDownLimit
 * rechargeUpperLimit
 * billno
 * instructions
 */
export function getIns(data){
  return request({
    url: `${G}/api-unitoll/load/getIns`,
    method: "post",
    data
  });
}
/**
 * 请求初始化指令集（1005）
 * token
 * instructionResps
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 * instructions
 */

export function getinitializeins(data){
  return request({
    url: `${G}/api-unitoll/load/getinitializeins`,
    method: "post",
    data
  });
}

/**
 * 获取圈存指令集（1006）
 * token
 * instructionResps
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 * instructions
 */

export function getloadins(data){
  return request({
    url: `${G}/api-unitoll/load/getloadins`,
    method: "post",
    data
  });
}
/**
 * 圈存结果确认（1007）
 * token
 * instructionResps 指令执行的结果集
 * deviceno 设备号
 * cardno 卡号
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 * load_moeny
 */

export function loadconfirm(data){
  return request({
    url: `${G}/api-unitoll/load/loadconfirm`,
    method: "post",
    data
  });
}

//补全半条记录
/**
 * 获取校验指令集
 * token
 * instructionResps 指令执行的结果集
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 * instructions
 */

export function getinstructions(data){
  return request({
    url: `${G}/api-unitoll/load/getinstructions`,
    method: "post",
    data
  });
}

/**
 * 上传校验结果(3002)
 * token
 * instructionResps 指令执行的结果集
 * deviceno 设备号
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 */

export function sendsignresult(data){
  return request({
    url: `${G}/api-unitoll/load/sendsignresult`,
    method: "post",
    data
  });
}

/**
 * 获取0015文件指令集(1004)
 * token
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 * instructions
 */

export function getfifteenins(data){
  return request({
    url: `${G}/api-unitoll/load/getfifteenins`,
    method: "post",
    data
  });
}

/**
 * 获取充值上下限
 * token
 * cardArea 卡片网络编号 0015文件中第11和12字节的16进制字符串 440
 * cardno 卡号 1501220000000490
 * balance 卡内金额 10进制数，单位分
 * @returns
 * code	int	0：成功，其他失败
 * msg	string	提示信息
 * data object	结果集
 * code 00
 */

export function getrechargelimit(data){
  return request({
    url: `${G}/api-unitoll/load/getrechargelimit`,
    method: "post",
    data
  });
}
