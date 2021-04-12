<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-07-16 10:06:49
 * @LastEditors: yongqing
 * @LastEditTime: 2020-07-28 10:27:17
-->
<style lang="scss">
  .container {
    font-size: 26rpx;
  }
</style>
<template>
  <web-view :src="url" @message="(e) => handleMessage(e)"></web-view>
</template>

<script>
  export default {
    data() {
      return {
        url: "",
        src: "",
      };
    },
    computed: {},
    methods: {
      handleMessage(e) {
        console.log(e, this);
        let data = e.mp.detail.data;
        if (Object.keys(data).length <= 0) {
          return;
        }

        let params = data[data.length - 1];
        if (params.event == "tradePay") {
          let {
            money,
            timeStamp,
            signType,
            nonceStr,
            paySign,
            page,
            ...other
          } = params;
          try {
            //发起支付
            uni.requestPayment({
              timeStamp,
              nonceStr,
              package: other.package, //因为package 是javascript 的关键字，所以不能直接写，会报错
              signType,
              paySign,
              success: (res) => {
                uni.redirectTo({
                  url: `/pages/pay_result/main?money=${money}&src=${uni.getStorageSync(
                  "VIPURL"
                )}`,
                });
              },
              fail: (res) => {
                console.log("支付失败", res);
                uni.showToast({
                  title: "支付失败",
                  icon: "none"
                });
                // uni.redirectTo({
                //   url: `/pages/webview/main?src=${page}`,
                // });
              },
            });
          } catch (error) {
            console.log(error);
          }
        }
      },
    },
    mounted() {
      let {
        src
      } = this.$root.$mp.query;
      this.src = src;
      this.url = decodeURIComponent(src);
      if (this.url.indexOf("/vip/dist/#/index") > -1) {
        uni.setStorageSync("VIPURL", src);
      }
    },
  };
</script>
