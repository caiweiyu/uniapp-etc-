/**
 * @Description: 微信BLE蓝牙错误码
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
export default function (err) {
    if (err && err.errCode) {
        switch (err.errCode) {
            case 10001:
                return err.errCode + "：当前蓝牙适配器不可用"
            case 10002:
                return err.errCode + "：没有找到指定设备"
            case 10003:
                return err.errCode + "：连接失败"
            case 10004:
                return err.errCode + "：没有找到指定服务"
            case 10005:
                return err.errCode + "：没有找到指定特征值"
            case 10006:
                return err.errCode + "：当前连接已断开"
            case 10007:
                return err.errCode + "：当前特征值不支持此操作"
            case 10008:
                return err.errCode + "：其余所有系统上报的异常"
            case 10009:
                return err.errCode + "：Android 系统特有，系统版本低于 4.3 不支持 BLE"
            case 10012:
                return err.errCode + "：连接超时"
            case 10013:
                return err.errCode + "：连接 deviceId 为空或者是格式不正确"
            default:
                return "蓝牙功能暂不支持"
        }
    } else {
        // 自定义错误码
        if (typeof err === 'string') {
            switch (err) {
                case 'device not found':
                    return "找不到该设备"
                default:
                    break;
            }
        } else {
            return "蓝牙功能暂不支持"
        }
    }

}
