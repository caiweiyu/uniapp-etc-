/**
 * @Description: 工具集
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-05-18 10:21:15
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-06-08 10:21:15
 */
import md5 from "@/packageA/pages/ytk/ytk_deposit/blue/md5Util";
let PRINT_SHOW = true
export function print(str,data) {
    if(PRINT_SHOW){
        console.log(str)
        if(data!==undefined){
            console.log(data)
        }
    }
}
export function getUnsignedShort(data) {
    return data & 0x0FFFF;
}

export function byte2Integer127(data) {
    return data & 0x7F;
}

export function byte2Integer255(data) {
    let s = (data & 0xFF) + ""
    return parseInt(s, 10)
}

export function byte2Integer32767(data) {
    return data & 0x7FFF;
}

export function byte2Integerffff(data) {
    let s = (data & 0xFFFF) + ""
    return parseInt(s, 10)
}

export function GetBcc(data, len) {
    let uCRC = 0x0;
    for (let i = 0; i < len; i++) {
        uCRC ^= data[i];
    }
    return uCRC;
}

export function convertStringToHex(paramString) {
    return strToHexCharCode(paramString)
}

export function convertHexToString(paramString) {
    return hexCharCodeToStr(paramString)
}


export function byte2Hex(bin,index,len) {
    let b;
    let hex_str = new Array(len * 2);
    let index_str = 0;
    let bin2hex = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];
    let str = "";
    if (len <= 0){
        return null;
    }
    for (let i = 0; i < len; i++) {
        if (index < 0 || index >= bin.length){
            continue;
        }
        if (bin[index] >= 0){
            b = bin[index];
        }else{
            b = 256 + bin[index];
        }
        index++;
        hex_str[index_str++] = bin2hex[b >> 4];
        hex_str[index_str++] = bin2hex[b & 0xf];
    }
    //str = new String(hex_str, "GBK"); //java中的函数
    str = hex_str.join("").toString();
    //console.log('Guomi-----------str: ',str) // java 正确结果：81080406000D26EA9000
    return str
}


export function hexString2Bytes(hexString) {
    //print('hexString: '+hexString)
    hexString = hexString.toLowerCase();
    let byteArray = new Array(hexString.length / 2);
    let k = 0;
    for (let i = 0; i < byteArray.length; i++) {
        let high = (parseInt(hexString.charAt(k),16) & 0xff);
        let low = (parseInt(hexString.charAt(k+1),16) & 0xff);
        byteArray[i] =  (high << 4 | low);
        k += 2;
    }
    //print('byteArray: '+ byteArray)
    //print('hexString: '+ bytes2HexString(byteArray))
    return byteArray;
}

export function bytes2HexString(arr) { //ArrayTohexString
    let buffer = new Uint8Array(arr).buffer;
    return ab2hex(buffer)
}
// //16进制字符串转ArrayBufer
// export function hexString2ArrayBuffer(hex) {
// 	if (!hex) return new ArrayBuffer(0);
// 	var s = hex + ''
// 	//转16进制
// 	var buffer = new ArrayBuffer(s.length/2);
// 	let dataView = new DataView(buffer)
// 	let ind = 0;
// 	for (var i = 0, len = s.length; i < len; i += 2) {
// 		let code = parseInt(s.substr(i, 2), 16)
// 		dataView.setUint8(ind, code)
// 		ind++
// 	}
// 	return buffer;
// }
//
// // 16进制字符串转ArrayBufer
// export function hexString2ArrayBuffer1(hex) {
// 	if (!hex) return new ArrayBuffer(0);
// 	let length = hex.length;
// 	let index = 0;
// 	let array = []
// 	while (index < length) {
// 		array.push(hex.substring(index, index + 2));
// 		index = index + 2;
// 	}
// 	let val = array.join(",");
// 	// 将16进制转化为ArrayBuffer
// 	return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function(h) {
// 		return parseInt(h, 16)
// 	})).buffer
// }

export function byteArray2hexStr(C){
    return Array.prototype.map.call(new Uint8Array(C), function(C) {
        return ("00" + C.toString(16)).slice(-2);
    }).join("");
}
export function hexStr2byteArray(C){
    return C && C.match(/[\da-f]{2}/gi) ? new Uint8Array(C.match(/[\da-f]{2}/gi).map(function(C) {
        return parseInt(C, 16);
    })) : new Uint8Array(0);
}
//16进制字符串转ArrayBufer
export function hex2ab(hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
        return parseInt(h, 16)
    })).buffer
}

//ArrayBuffer转16进制字符串
export function ab2hex(buf) { // 模拟的byte数组也可以
    return Array.prototype.map.call(new Uint8Array(buf), function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
    }).join('');
}
//拼接数组 totalmsg = concatenate(Uint8Array,totalmsg, submsg)
export function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
//是否在数组
export function inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            return i;
        }
    }
    return -1;
}
// CRC16 校验算法
function modBusCRC16(data, startIdx, endIdx) {
    var crc = 0xffff;
    do {
        if (endIdx <= startIdx) {
            break;
        }
        if (data.length <= endIdx) {
            break;
        }
        for (var i = startIdx; i <= endIdx; i++) {
            var byte = data[i] & 0xffff;
            for (var j = 0; j < 8; j++) {
                crc = (byte ^ crc) & 0x01 ? (crc >> 1) ^ 0xa001 : crc >> 1;
                byte >>= 1;
            }
        }
    } while (0);
    return ((crc << 8) | (crc >> 8)) & 0xffff;
}
export function strToHexCharCode(C) {
    if ("" === C) return "";
    var D = [];
    D.push("");
    for (var B = 0; B < C.length; B++) D.push(C.charCodeAt(B).toString(16));
    return D.join("");
}
export function hexCharCodeToStr(C) {
    var D = C.trim(),
        B = "0x" === D.substr(0, 2).toLowerCase() ? D.substr(2) : D,
        E = B.length;
    if (E % 2 != 0) return ""; // Illegal Format ASCII Code!
    for (var F, A = [], r = 0; r < E; r += 2) F = parseInt(B.substr(r, 2), 16), A.push(String.fromCharCode(F));
    return A.join("");
}
export function decodeFromGb2312(C) {
    for (var D = "", B = 0; B < C.length; B++) {
        var E = C.charAt(B);
        if ("+" == E) D += " ";
        else if ("%" != E) D += E;
        else {
            B++;
            var F = C.charAt(B);
            if (isNaN(parseInt(F))) {
                new String();
                try {
                    var A = C.substr(B, 2) + C.substr(B + 3, 2);
                    B += 4;
                    for (var r = -1; - 1 != (r = i.indexOf(A, r + 1));)
                        if (r % 4 == 0) {
                            D += String.fromCharCode(r / 4 + 19968);
                            break;
                        }
                } catch (C) {}
            } else B++, D += decodeURIComponent(E + F + C.charAt(B));
        }
    }
    return D;
}

//用于验签排序
//字母排序：不区分大小写
function sortCharter(a, b) {
    if (a.toString().toUpperCase() > b.toString().toUpperCase()) {
        return 1;
    } else if (a.toString().toUpperCase() == b.toString().toUpperCase()) {
        return 0;
    } else {
        return -1;
    }
}

function objKeySort(obj) {//排序的函数
    let newkey = Object.keys(obj).sort(sortCharter);
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    let newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;//返回排好序的新对象
}

String.prototype.PadLeft = function (len, charStr) {
    let s = this + '';
    return new Array(len - s.length + 1).join(charStr, '') + s;
}
//创建sign
export function create_sign(data,appsecret) {
    //console.log("1、排序前create_sign0");
    //console.log(data);
    //1、排序
    data = objKeySort(data);
    //console.log("1、排序后create_sign111");
    //console.log(data);
    //2.拼接
    let txt="";
    let newkey = Object.keys(data);
    for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
        // txt = txt + newkey[i].length.toString().PadLeft(2, '0');
        // txt=txt+"-";
        // txt = txt + newkey[i];
        // txt = txt + ":";
        //  console.log("for内部===k-v");
        // console.log(newkey[i]);
        // console.log(data[newkey[i]]);
        // txt = txt + data[newkey[i]].toString().length.toString().PadLeft(4,'0');
        // txt = txt + "-";
        txt = txt + data[newkey[i]];
        // if (i < (newkey.length-1)) {
        //     txt = txt + ";";
        // }
    }
    //console.log("for内部===3.追加私钥appsecret");
    //3.追加私钥appsecret
    console.log(txt);
    // console.log("appsecret=" + appsecret);
    txt = txt + appsecret;
    console.log(txt);
    //4.md5加密
    txt = md5.hex_md5(txt);
    console.log(txt);
    return txt;
}
