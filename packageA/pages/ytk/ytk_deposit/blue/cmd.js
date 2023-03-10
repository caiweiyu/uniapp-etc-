/**
 * @Description: 蓝牙指令
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
export default {
	/**
	 * 读取卡片余额
	 *
	 * TAG:80
	 * LEN:20
	 * TPDU1 TAG:81
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000023F00(select 3F00 dir)
	 * TPDU2 TAG:82
	 * TPDU2 LEN:05
	 * TPDU2 DATA:00B0950000(read 0015 file)
	 * TPDU3 TAG:83
	 * TPDU3 LEN:07
	 * TPDU3 DATA:00A40000021001(select 1001 dir)
	 * TPDU4 TAG:04
	 * TPDU4 LEN:05
	 * TPDU4 DATA:805C000204(read card balance)
	 */

	DIRECT_CMD_CARD_BALANCE : "8020810700A40000023F00820500B0950000830700A400000210010405805C000204",
	CMD_CARD_BALANCE : 1,

	/**
	 * 读取卡片信息
	 *
	 * TAG:80
	 * LEN:10
	 * TPDU1 TAG:81
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000021001(select 1001 dir)
	 * TPDU2 TAG:02
	 * TPDU2 LEN:05
	 * TPDU2 DATA:00B095002B(read 0015 file)
	 */
	DIRECT_CMD_CARD_NUMBER : "8010810700A40000021001020500B095002B",
	CMD_CARD_NUMBER : 2,

	/**APP和读卡器建立握手*/
	CMD_HANDSHAKE : 3,

	/**获取读卡器的电池电量*/
	CMD_GET_BATTERY_LEVEL : 4,

	/**强制读卡器断电*/
	CMD_CUT_OFF_ELECTRICITY : 5,

	/**认证指令1*/
	CMD_AUTHENTICATE_ONE : 6,

	/**认证指令2*/
	CMD_AUTHENTICATE_TWO : 7,

	/**认证指令3*/
	CMD_AUTHENTICATE_THREE : 8,

	/**圈存 初始化*/
	CMD_DEPOSIT_INIT : 9,

	/**圈存 获取0015上下线*/
	CMD_DEPOSIT_GET_FIFTEEN : 10,

	/**圈存 写卡*/
	CMD_DEPOSIT_WRITE : 11,

	/**圈存 写卡2*/
	CMD_DEPOSIT_WRITE2 : 12,

	/**圈存 半条流水3001*/
	CMD_DEPOSIT_HALF_1 : 13,

	/**卡余额（国密）*/
	CMD_CARD_BALANCE_GUOMI : 21,

	/**卡号（国密）*/
	CMD_CARD_NUMBER_GUOMI : 22,

	/**APP和读卡器建立握手（国密）*/
	CMD_HANDSHAKE_GUOMI : 23,

	/**获取读卡器的电池电量（国密）*/
	CMD_GET_BATTERY_LEVEL_GUOMI : 24,

	/**强制读卡器断电（国密）*/
	CMD_CUT_OFF_ELECTRICITY_GUOMI : 25,

	/**认证指令（国密）*/
	CMD_AUTHENTICATE_GUOMI : 26,

	/**认证结果指令（国密）*/
	CMD_AUTHENTICATE_RESULT_GUOMI : 27,

	/**验证PIN码类型指令（国密）*/
	CMD_CHECK_PIN_TYPE_GUOMI : 28,

	/**验证SE指令（国密）*/
	CMD_CHECK_SE_ONE_GUOMI : 29,

	/**再次验证SE指令（国密）*/
	CMD_CHECK_SE_TWO_GUOMI : 30,

	/**验证PIN码指令（国密）*/
	CMD_CHECK_PIN_GUOMI : 31,

	/**圈存 初始化（国密）*/
	CMD_DEPOSIT_INIT_GUOMI : 32,

	/**圈存 写卡（国密）*/
	CMD_DEPOSIT_WRITE_GUOMI : 33,

	/**
	 * 读取1001目录下0015文件
	 *
	 * TAG:80
	 * LEN:10
	 * TPDU1 TAG:81
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000021001(select 1001 dir)
	 * TPDU2 TAG:02
	 * TPDU2 LEN:05
	 * TPDU2 DATA:00B0950000(read 0015 file)
	 */
	DIRECT_CMD_READ_CARD_0015_FILE : "8010810700A40000021001020500B0950000",
	CMD_READ_0015_GUOMI : 14,

	/**
	 * 读取3F00目录下EF01文件
	 *
	 * TAG:80
	 * LEN:10
	 * TPDU1 TAG:01
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000023F00(select 3F00 dir)
	 * TPDU2 TAG:02
	 * TPDU2 LEN:05
	 * TPDU2 DATA:00B0810063(read EF01 file)
	 */
	DIRECT_CMD_READ_EF01_GUOMI : "8010010700A40000023F00020500B0810063",
	CMD_READ_EF01_GUOMI : 15,

	/**
	 * 读取3F00目录下EF1D文件
	 *
	 * TAG:80
	 * LEN:10
	 * TPDU1 TAG:01
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000023F00(select 3F00 dir)
	 * TPDU2 TAG:02
	 * TPDU2 LEN:05
	 * TPDU2 DATA:00B09D0080(read EF1D file)
	 */
	DIRECT_CMD_READ_EF1D_GUOMI : "8010010700A40000023F00020500B09D0080",
	CMD_READ_EF1D_GUOMI : 16,

	//卡片激活
	CMD_ACTIVATE_CARD_GUOMI : 17,

	//蓝牙obu激活
	CMD_ACTIVATE_OBU_GUOMI : 18,

	//非国密登录
	CMD_AUTH : 19,
	//非国密初始化
	CMD_INIT : 20,

	/**
	 * 卡PIN码类型
	 *
	 * TAG:80
	 * LEN:10
	 * TPDU1 TAG:C1
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000023F00(select 3F00 dir)
	 * TPDU2 TAG:02
	 * TPDU2 LEN:05
	 * TPDU2 DATA:00B0951801(read PIN type)
	 */
	DIRECT_CMD_CARD_PIN_TYPE : "8010C10700A40000023F00020500B0951801",

	/**
	 * 卡版本大于等于64，可直接用该命令
	 * 卡PIN码
	 * TAG:80
	 * LEN:11
	 * TPDU1 TAG:C1
	 * TPDU1 LEN:07
	 * TPDU1 DATA:00A40000021001(select 1001 dir)
	 * TPDU2 TAG:02
	 * TPDU2 LEN:06
	 * TPDU2 DATA:313233343536(PIN, 123456的asc码)
	 */
	DIRECT_CMD_CARD_PIN : "8011C10700A400000210010206313233343536",

	/**
	 * 卡版本小于64，且验证SE指令结果是61开头，可直接用该命令
	 * 卡PIN码
	 * TAG:80
	 * LEN:07
	 * TPDU TAG:01
	 * TPDU LEN:05
	 * TPDU DATA:00C0000006
	 */
	DIRECT_CMD_CARD_PIN_AFTER_SE : "8007010500C0000006",
}
