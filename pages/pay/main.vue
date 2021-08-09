<template>
    <view class="payment-page">正在发起支付...</view>
</template>
<script>
    import {mapState} from "vuex"
    import {apiRepaid} from "@/interfaces/base";

    export default {
        data() {
            return {};
        },
        computed: {
            ...mapState({
                token: (state) => state.user.token,
                openid: (state) => state.user.info.openid
            }),
        },
        mounted() {
            //wx.miniProgram.navigateTo({url: "/pages/pay/main?trade_id=''&trade_platform=1&trade_mode=3&pay_amount=1&back_url=''&detail_url=''"})
            if(!this.openid){
                uni.showToast({
                    title: "支付失败,openid获取失败",
                    icon: "none"
                });
                return
            }
            this.rePayment();
        },
        methods: {
            async rePayment() {
                console.log('this.$root.$mp.query',this.$root.$mp.query)
                let {trade_id,trade_platform=1,trade_mode=3,pay_amount,back_url,detail_url} = this.$root.$mp.query;
				
				if (Number(pay_amount) <= 0) {
					trade_platform = 6;
				}

                let res = await apiRepaid({
                    trade_id,
                    trade_platform, //交易方式 1微信
                    trade_mode, // 交易模式  3小程序
                    openid:this.openid,
                    token:this.token,
                });
                let {prepaid_info} = res.data;
                try {
                    //发起支付
					if (prepaid_info.hasOwnProperty("trade_status") == true && Number(prepaid_info.trade_status) == 3 && trade_platform == 6) {
						wx.redirectTo({
						    url: `/pages/pay_result/main?money=${pay_amount}&backUrl=${back_url}&detailUrl=${detail_url}`,
						});
						return;
					}
                    uni.requestPayment({
                        timeStamp: prepaid_info.timeStamp,
                        nonceStr: prepaid_info.nonceStr,
                        package: prepaid_info.package,
                        signType: prepaid_info.signType,
                        paySign: prepaid_info.paySign,
                        success: function (res) {
                            wx.redirectTo({
                                url: `/pages/pay_result/main?money=${pay_amount}&backUrl=${back_url}&detailUrl=${detail_url}`,
                            });
                        },
                        fail: function () {
                            uni.showToast({
                                title: "支付失败",
                                icon: "none"
                            });
                            uni.navigateBack({
                                delta: 1
                            })

                        },
                    });
                } catch (error) {
                    console.log(error);
                }
            },
        },
    };
</script>
<style lang="scss">
    .payment-page {
        text-align: center;
    }
</style>
