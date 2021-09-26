<template>
  <view class="box">
      <view class="box1">
            <img class="box1_1" src="https://image.etcchebao.com/etc-min/bill_all/coin_icon.png" alt="">
            <text class="box1_2">本月已领: {{bottombillobj.integralDetail.hGetPoint}}</text>
            <text class="box1_3">未领: {{bottombillobj.integralDetail.unGetPoint}}</text>
      </view>
      <view class="box2" v-if="bottombillobj.canSend==1" @click="selectMonCoin(cardusenum,1,selectmon.month)">
          一键领取
      </view>
  </view>
</template>

<script>
import { mapState } from "vuex"
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
        async selectMonCoin(cardNo,source,month){
            if(this.show_add_coin) return;
            console.log('触发====')
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
                if(data != null){
                    this.$emit("selectCoinfunc",msg)
                }
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
            width: 160rpx;
            height: 50rpx;
            line-height: 50rpx;
            border-radius: 120rpx;
            background-color: #FF5C2A;
            color: #FFFFFF;
            text-align: center;
            margin: 20rpx 20rpx 20rpx 0;
        }
    }
</style>