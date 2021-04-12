<!--
 * @Description: APP 调起支付
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: yongqing
 * @LastEditTime: 2021-02-23 13:58:45
-->
<template>
  <view class="payment-page">正在发起支付... </view>
</template>
<script>
import { apiRepaid } from "@/interfaces/base";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getOpenid();
  },
  methods: {
    getOpenid() {
      wx.cloud.callFunction({
        name: "getOpenid",
        complete: (res) => {
          let openid = res.result.openId;
          if (openid) {
            this.rePayment(openid); //微信支付
          } else {
            uni.showToast({
              title: "前端获取openid异常",
              icon: "none",
            });
          }
        },
      });
    },
    async rePayment(openid) {
      let { trade_id, pmchan_code } = this.$root.$mp.query;
      let res = await apiRepaid({
        trade_id,
        pmchan_code,
        openid,
        trade_platform: 1, //交易方式 1微信
        trade_mode: 3, // 交易模式  1小程序
      });
      let { prepaid_info } = res.data;
      uni.requestPayment({
        timeStamp: prepaid_info.timeStamp,
        nonceStr: prepaid_info.nonceStr,
        package: prepaid_info.package,
        signType: prepaid_info.signType,
        paySign: prepaid_info.paySign,
        success: function (res) {
          wx.redirectTo({
            url: "/pages/payment_result/main?payState=1",
          });
        },
        fail: function () {
          wx.redirectTo({
            url: "/pages/payment_result/main?payState=0",
          });
        },
      });
    },
  },
};
</script>
<style lang="scss">
.payment-page {
}
</style>
