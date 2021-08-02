// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 参数在event中
  console.info('event',event);
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene:event.scene,
      page:event.page
    })
    return result
  } catch (err) {
    return err
  }
}