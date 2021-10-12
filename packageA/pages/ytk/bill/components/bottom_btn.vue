<template>
  <view class="box">
      <view class="box1">
            <img class="box1_1" src="https://image.etcchebao.com/etc-min/bill_all/coin_icon.png" alt="">
            <text class="box1_2">本月已领: {{bottombillobj.integralDetail.hGetPoint || 0}}</text>
            <text class="box1_3">未领: {{bottombillobj.integralDetail.unGetPoint || 0}}</text>
      </view>
      <view v-if="bottombillobj.oneKeyGetConfig.jumpType==2" @click="selectMonCoin(cardusenum,1,selectmon.month,bottombillobj.oneKeyGetConfig.jumpType)">
         {{bottombillobj.oneKeyGetConfig.btnTxt || '一键领取'}}
      </view>
      <block v-else>
            <view class="box2" v-if="bottombillobj.canSend==1 && bottombillobj.integralDetail.unGetPoint > 0" @click="selectMonCoin(cardusenum,1,selectmon.month,bottombillobj.oneKeyGetConfig.jumpType)">
                {{bottombillobj.oneKeyGetConfig.btnTxt || '一键领取'}}
            </view>
            <view class="off" v-if="bottombillobj.integralDetail.unGetPoint <= 0">
                {{bottombillobj.oneKeyGetConfig.btnTxt || '一键领取'}}
            </view>
      </block>

  </view>
</template>

<script>
import { mapState } from "vuex"
import { eventMonitor } from "@/common/utils"
import * as API from "@/interfaces/bill"
export default {
    props:{
        bottombillobj:{
            type:Object,
            default:{}
        }
    },
    data(){
        return {}
    },
    computed: {
        ...mapState({
			isweekmon: (state) => state.home.new_bill_all.isweekmon,
            bgColor:(state) => state.home.new_bill_all.bgColor,
            entrue:(state) => state.home.new_bill_all.entrue,
            selectweek:(state) => state.home.new_bill_all.selectweek,
            selectmon:(state) => state.home.new_bill_all.selectmon,
            cardinfo:(state) => state.home.new_bill_all.cardinfo,
            cardusenum:(state) => state.home.new_bill_all.cardusenum,
            show_add_coin:(state) => state.home.new_bill_all.show_add_coin
		}),
    },
    mounted() {
        console.log('bottombillobj',this.bottombillobj)   
    },
    methods: {
        /**
         * 获取格式  202009
        */
        getyymm(){
            let date=new Date();
            let yy=date.getFullYear();
            let mm=date.getMonth()+1;
            mm=(mm<10 ? "0"+mm:mm);
            return (yy.toString()+mm.toString());
        },
        async selectMonCoin(cardNo,source,month,type){
            if(this.show_add_coin) return;
            try {
                if(type == 2){
                    uni.navigateTo({
                        url:`/pages/webview/main?src=${encodeURIComponent(this.bottombillobj.oneKeyGetConfig.jumpUrl)}`
                    })
                }
            } catch (error) {}
            let res = await API.sendMonthBillCoins({
                cardNo:cardNo,
                source:source,
                month:month || this.getyymm()
            });
            let {
                code,
                msg,
                data
            } = res;
            if(code == 0){
                this.$emit("isTouchCoin",msg)
                eventMonitor('YTKMonthlyBill_Point_WeChat_Other_415_Button_click',2)
                this.$emit("selectCoinfunc",msg)
            }
        }
    },
}
</script>

<style scoped lang='scss'>
    .box{
        width: 690rpx;
        height: 90rpx;
        line-height: 90rpx;
        background-color: #FFEAE4;
        border-radius: 16rpx;
        display: flex;
        font-size: 26rpx;
        justify-content: space-between;
        box-shadow: 0 10rpx 20rpx 5rpx rgba($color: #000000, $alpha: 0.05);
        .box1{
            display: flex;
            &_1{
                display: inline-block;
                vertical-align: middle;
                margin: 30rpx 0 30rpx 33rpx;
                width: 30rpx;
                height: 30rpx;
            }
            &_2{
               margin: 0 20rpx 0 10rpx;
            }
            &_3{
                color: #FF5C2A;
            }
        }
        .box2{
            padding: 0 28rpx;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 120rpx;
            background-color: #FF5C2A;
            color: #FFFFFF;
            text-align: center;
            margin: 20rpx 20rpx 20rpx 0;
        }
        .off{
            padding: 0 28rpx;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 120rpx;
            border:1rpx solid #CCCCCC;
            color: #CCCCCC;
            text-align: center;
            margin: 20rpx 20rpx 20rpx 0;
        }
    }
</style>