<template>
  <view class="box">
      <view class="box_title" v-if="isweekmon==0">
        <block v-if="bottombillobj.billType==2">
            <image class="img" src="https://image.etcchebao.com/etc-min/bill_all/ic_check.png"></image><text class="text">{{bottombillobj.notice}}</text>
        </block>
        <block v-else-if="bottombillobj.billType==1">
            <image class="img" src="https://image.etcchebao.com/etc-min/bill_all/antion.png" @click.stop="showParaList"></image><text class="text" @click.stop="showParaList">{{bottombillobj.notice}}</text>
        </block>
      </view>
      <!--月账单列表-->
      <scroll-view :scroll-y="false" class="scroll-page" v-if="isweekmon==0 && cardList_info.length > 0">
        <view class="box" v-for="(item,index) in cardList_info" :key="index">
            <view class="box1">
              <view class="box1_l">
                <text class="text" v-if="item.name != null">{{item.name}}</text><text v-if="item.province != null">{{item.province}}</text>
              </view>
              <view class="box1_r">
                    <image :class="[item.status==0 ? 'box1_r_img' : 'box1_r_img1']" src="https://image.etcchebao.com/etc-min/bill_all/coin_icon.png" mode="" />
                    <text :class="[item.status==0 ? 'box1_r_text' : 'box1_r_text1']">{{item.integral}}</text>
                    <view :class="[item.status==0 ? 'box1_r_btn' : 'box1_r_btn1']" v-if="item.status==0" @click="getCoin(item,index)">领取</view>
                    <view :class="[item.status==0 ? 'box1_r_btn' : 'box1_r_btn1']" v-else-if="item.status==1">已领取</view>
                    <view :class="[item.status==0 ? 'box1_r_btn' : 'box1_r_btn1']" v-else>已过期</view>
              </view>
            </view>
            <view class="box2">
              <view class="box2_l">
                  <view class="title">
                    <image class="title_image" src="https://image.etcchebao.com/etc-min/bill_all/icon_point.png" mode="" />
                    <text class="title_text">{{item.enStation}}</text>
                  </view>
                  <text class="timer" v-if="item.enTime != null">{{item.enTime}}</text>
                  <view class="title title2" v-if="item.type==1">
                    <image class="title_image" src="https://image.etcchebao.com/etc-min/bill_all/icon_location.png" mode="" />
                    <text class="title_text">{{item.exitStation}}</text>
                  </view>
                  <text class="timer" v-if="item.type==1 && item.exitTime != null">{{item.exitTime}}</text>
              </view>
              <view class="box2_r">
                  ¥<text class="box2_r_text">{{item.amount}}</text>
              </view>
            </view>
        </view>
      </scroll-view>
      <!--周账单列表-->
      <scroll-view :scroll-y="false" class="scroll-page" v-if="isweekmon==1 && week_cardList_info.length > 0">
        <view class="box" v-for="(item,index) in week_cardList_info" :key="index">
            <view class="box1">
              <view class="box1_l">
                <text class="text" v-if="item.name != null">{{item.name}}</text><text v-if="item.province != null">{{item.province}}</text>
              </view>
              <view class="box1_r"></view>
            </view>
            <view class="box2">
              <view class="box2_l">
                  <view class="title">
                    <image class="title_image" src="https://image.etcchebao.com/etc-min/bill_all/icon_point.png" mode="" />
                    <text class="title_text">{{item.enStation}}</text>
                  </view>
                  <text class="timer" v-if="item.enTime != null">{{item.enTime}}</text>
                  <view class="title title2" v-if="item.type==1">
                    <image class="title_image" src="https://image.etcchebao.com/etc-min/bill_all/icon_location.png" mode="" />
                    <text class="title_text">{{item.exitStation}}</text>
                  </view>
                  <text class="timer" v-if="item.type==1 && item.exitTime != null">{{item.exitTime}}</text>
              </view>
              <view class="box2_r">
                  ¥<text class="box2_r_text">{{item.amount}}</text>
              </view>
            </view>
        </view>
      </scroll-view>
  </view>
</template>

<script>
import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()
const app = getApp()
import { mapState } from "vuex"
import { eventMonitor } from "@/common/utils"
import * as API from "@/interfaces/bill"
export default {
    props:{
      //月列表
       cardList_info:{
         type:Array,
         default:[]
       },
       //周列表
       week_cardList_info:{
         type:Array,
         default:[]
       },
       //卡信息
       bottombillobj:{
         type:Object,
         default:{}
       }
    },
    watch:{
      // cardList_info(o,n){
      //   console.log('月账单',o,n)
      //   this.list = o;
      // },
      // week_cardList_info(o,n){
      //   console.log('周账单',o,n)
      //   this.weeklist = o;
      // }
    },
    computed: {
          ...mapState({
                isweekmon: (state) => state.home.new_bill_all.isweekmon,
                selectweek: (state) => state.home.new_bill_all.selectweek,
                selectmon: (state) => state.home.new_bill_all.selectmon,
                selectweekindex: (state) => state.home.new_bill_all.selectweekindex,
                selectmonindex: (state) => state.home.new_bill_all.selectmonindex,
                monthsumBillsList: (state) => state.home.new_bill_all.monthsumBillsList,
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
      async getCoin(item,index){
        if(this.show_add_coin) return;
        let res = await API.sendBillCoins({
            month:this.selectmon.month || this.getyymm(),
            source:1,
            orderId:item.serialNo
        });
        let {code,msg,data} = res;
        if(code ==0){
            this.$emit("isTouchCoin",msg)
            eventMonitor('YTKMonthlyBill_Card_WeChat_Other_415_Button_click',2)  
            this.$emit('cardListInfoIndex',index)     
        }else{
            uni.showToast({
              title: msg,
              icon: 'none',
              mask: true,
              duration:2000
            })
        }
      },
      async getparaList(){
        let res = await API.getparaList({
          type:'["bill_notes"]'
        });
        let {
          code,
          msg,
          data
        } = res;
        if(code == 0){
          if(data.bill_notes){
              this.showToast = data.bill_notes.replace(/<br>/g,"\r");
          }
        }
      },
      /**
       * 显示提示文案
       */
      showParaList(){
        eventMonitor('YTKMonthlyBill_Top_WeChat_Other_415_Button_click',2)
        this.$emit('showToastfn',true)
      },
    },
    data(){
      return {
        showToast:""
      }
    },
    mounted() {
      this.getparaList()
    },
}
</script>

<style scoped lang="scss">
  .box{
      &_title{
        height: 53rpx;
        line-height: 73rpx;
        padding-left: 34rpx;
        background-color: #F6F6F6;
        .img{
          display: inline-block;
          vertical-align: middle;
          width: 32rpx;
          height: 32rpx;
          margin-right: 10rpx;
        }
        .text{
          vertical-align: middle;
          color: #999999;
          font-size: 24rpx;
        }
      }
      .scroll-page{
          width: 100%;
          // height: auto !important;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #F6F6F6;
          // padding-bottom: 199rpx;
          padding-bottom: 266rpx;
          .box{
            background-color: #FFFFFF;
            margin: 20rpx auto;
            width: 690rpx;
            height: 300rpx;
            border-radius: 16rpx;
            display: block;
          }
      }
  }
  .box1{
    display: flex;
    justify-content: space-between;
    height: 85rpx;
    align-items: center;
    margin:auto;
    width: 634rpx;
    border-bottom: 1rpx solid #EBEBEB;
    &_l{
      font-size: 26rpx;
      color: #222222;
      .text{
        margin-right: 25rpx;
      }
    }
    &_r{
      &_text1{
         color: #666666;
         font-size: 26rpx;
         opacity: .4;
         margin: 0 24rpx 0 5rpx;
         vertical-align:middle;
      }
      &_text{
        color: #666666;
        font-size: 26rpx;
        margin: 0 24rpx 0 5rpx;
        vertical-align:middle;
      }
      &_img1{
        display: inline-block;
        width: 30rpx;
        height: 30rpx;
        opacity: .4;
        vertical-align:middle;
      }
      &_img{
        display: inline-block;
        width: 30rpx;
        height: 30rpx;
        vertical-align:middle;
      }
      &_btn1{
        padding: 0 19rpx;
        height:50rpx;
        line-height: 46rpx;
        text-align: center;
        display: inline-block;
        border-radius: 120rpx;
        border:1rpx solid #CCCCCC;
        color: #CCCCCC;
        font-size: 24rpx;
        opacity: .4;
        vertical-align:middle;
      }
      &_btn{
        padding: 0 19rpx;
        height:50rpx;
        line-height: 46rpx;
        text-align: center;
        display: inline-block;
        border-radius: 120rpx;
        background-color: #FF5C2A;
        color: #FFFFFF;
        font-size: 24rpx;
        vertical-align:middle;
      }
    }
  }
  .box2{
    display: flex;
    justify-content: space-between;
    height: 214rpx;
    align-items: center;
    margin: 0 30rpx 0 30rpx;
    &_l{
      display: flex;
      flex-direction: column;
      .title{
        color: #222222;
        font-size: 30rpx;
        font-weight: bold;
        &_image{
          width: 18.6rpx;
          height: 26.6rpx;
          display: inline-block;
          vertical-align: middle;
        }
        &_text{
          margin-left: 9rpx;
          vertical-align: middle;
        }
      }
      .title2{
        margin-top: 26rpx;
      }
      .timer{
        color: #666666;
        font-size: 24rpx;
        margin-left: 28.6rpx;
      }
    }
    &_r{
      font-family: 'etccb-font';
      color: #FF5C2A;
      font-size: 44rpx;
      &_text{
        font-weight: bold;
      }
    }
  }
  /deep/ uni-modal .uni-modal__bd{      
      white-space: pre-wrap;      
  }
</style>