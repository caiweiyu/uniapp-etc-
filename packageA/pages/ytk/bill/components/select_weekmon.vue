<template>
  <view class="box" :style="{height: topHeight.height,background: bannerPic,backgroundSize: '100% 100%'}">
      
      <!--内容区域  有卡号的情况下-->
      <view class="box_content" :style="{top:'26rpx'}" @click.stop="toytkList">
          <view class="card_title"><text class="text">{{ytkCard.slice(0,2)}}&nbsp;&nbsp;{{ytkCard.slice(2)}}</text><image class="image" src="https://image.etcchebao.com/etc-min/bill_all/change_icon1.png" mode="" /></view>
          <text class="card_num">{{cardusenum}}</text>
      </view>

      <!--周时间选择区-->
      <view class="timer_packer" v-if="isweekmon == 1">
          <view :class="['timer_packer_item',selectweekindex == -1 ? 'active_color' : '']" @click="pickerMore(-1)">
              <text class="markMonth">{{selectweekMore.week ? ('第'+selectweekMore.week+'周') : '更多'}}</text>
              <view class="avter_down"></view>
              <view class="markYear" v-if="selectweekMore.nowMonth != null">{{selectweekMore.nowMonth+'月'}}</view>
          </view>
          <view v-for="(item,index) in ((weeklist.slice(0,4).reverse()))" :key="index" :class="['timer_packer_item',selectweekindex == index ? 'active_color' : '']" @click="pickerTimer(index)">
              <text class="markMonth">{{'第'+item.week+'周'}}</text>
              <view class="markYear" v-if="item.preMonth != null">{{item.preMonth+'月'}}</view>
          </view>
      </view>

      <!--六个月选择区-->
      <view class="timer_packer" v-else>
          <view :class="['timer_packer_item',selectmonindex == index ? 'active_color' : '']" v-for="(item,index) in monlist" :key="index" @click="pickerTimermoner(index)">
              <text class="markMonth">{{item.markMonth + '月'}}</text>
              <view class="markYear">{{item.markYear}}</view>
          </view>
      </view>
  </view>
</template>

<script>
import { mapState } from "vuex"
import { eventMonitor } from "@/common/utils"
export default {
    props:{
        /**
         * 高度
         */
        topHeight:{
            type:Object,
            default:{
                height:'278rpx'
            }
        },
        /**
         * 月
         */
        monlist:{
            type:Array,
            default:[]
        },
        /**
         * 卡信息
         */
        cardList:{
            type:Object,
            default:{}
        },
        /**
         * 是否开启下拉刷新
         */
        triggered:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
            defaultweekvalue:[0],
            banner:[
                'https://image.etcchebao.com/etc-min/bill_all/banner1_2.png',  //type_card=2
                'https://image.etcchebao.com/etc-min/bill_all/banner2_2.png'  //type_card=1
            ],
        }
    },
    computed: {
        ...mapState({
			isweekmon: (state) => state.home.new_bill_all.isweekmon,
            selectweek: (state) => state.home.new_bill_all.selectweek,
            selectmon: (state) => state.home.new_bill_all.selectmon,
            selectweekindex: (state) => state.home.new_bill_all.selectweekindex,
            selectmonindex: (state) => state.home.new_bill_all.selectmonindex,
            cardinfo:(state) => state.home.new_bill_all.cardinfo,
            cardusenum:(state) => state.home.new_bill_all.cardusenum,
            ytkCard:(state) => state.home.new_bill_all.ytkCard,
            isOpenWeeklist:(state) => state.home.new_bill_all.isOpenWeeklist,
            isOpenWeek:(state) => state.home.new_bill_all.isOpenWeek,
            selectweekMore:(state) => state.home.new_bill_all.selectweekMore,
            weeklist:(state) => state.home.new_bill_all.weeklist,
            bgColor:(state) => state.home.new_bill_all.bgColor
		}),
        /**
         * 计算高度（胶囊顶部距状态栏高度距离 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        },
        /**
         * 判断头部背景色
         */
        bannerPic(){
            if(this.bgColor=='#28BC93'){
                return `url(${this.banner[0]})no-repeat;`
            }else{
                return `url(${this.banner[1]})no-repeat;`
            } 
        }
    },
    methods: {

        /**
         * 周确定选择
         */
        enterweek(e){
            this.selectweekMore = this.weeklist[e[0]],this.defaultweekvalue = e;
            this.$store.commit("home/mt_new_bill_all_selectweek", this.selectweekMore);
            this.$emit("selectWeekBill",this.selectweekMore)
            this.$emit("changZindex",1)
            // this.$store.commit("home/mt_new_bill_all_isOpenWeeklist", false);
        },
        /**
         * 取消周选中
         */
        cancelSelect(){
            this.$store.commit("home/mt_new_bill_all_isOpenWeeklist", false);
            this.$emit("changZindex",1)
        },
        /**
         * 选择月tab
         */
        pickerTimermoner(index){
            console.log('月tab',index)
            let mon_arr = this.monlist;
            console.log(mon_arr[index].month)
            this.$store.commit("home/mt_new_bill_all_selectmonindex", index);
            this.$store.commit("home/mt_new_bill_all_selectmon", mon_arr[index]);
            this.$emit("selectMonBill",mon_arr[index].month)
            if(index == 4){
                eventMonitor('YTKMonthlyBill_List_WeChat_Other_415_Button_select',2)
            }else if(index == 5){
                eventMonitor('YTKMonthlyBill_List_WeChat_Other_415_Button_click',2)
            }
        },
        
        /**
         * 选择周tab
         */
        pickerTimer(index){
            console.log('周tab',index)
            let week_arr = this.weeklist.slice(0,4).reverse();
            this.$store.commit("home/mt_new_bill_all_selectweekindex", index);
            this.$store.commit("home/mt_new_bill_all_selectweek", week_arr[index]);
            this.$emit("selectWeekBill",week_arr[index])
            if(index == 2){
                eventMonitor('YTKWeeklyBill_List_WeChat_Other_416_Button_select',2)
            }else if(index == 3){
                eventMonitor('YTKWeeklyBill_List_WeChat_Other_416_Button_click',2)
            }
        },

        /**
         * 更多
         */
        pickerMore(index){
            eventMonitor('YTKWeeklyBill_List_WeChat_Other_416_Button_pulldown',2);
            this.$store.commit("home/mt_new_bill_all_selectweekindex", index);
            if(this.isOpenWeek){
                this.$store.commit("home/mt_new_bill_all_isOpenWeek", false);
                setTimeout(()=>{
                    this.$store.commit("home/mt_new_bill_all_isOpenWeek", true);
                },50);
            }else{
                this.$store.commit("home/mt_new_bill_all_isOpenWeek", true);
            };
        },

        /**
         * 去粤通卡列表
         */
        toytkList(){
            if(this.triggered) return;
            if(this.isweekmon == 1){
                eventMonitor('YTKWeeklyBill_Card_WeChat_Other_416_Button_select',2)
            }else{
                eventMonitor('YTKBill_Card_WeChat_Other_415_Button_click',2)
            }
            this.$store.commit("home/mt_new_bill_all_en", false);
            uni.navigateTo({
                 url: '/packageA/pages/ytk/ytk_list/main?comeForm=2'
            });
        },

    },
    destroyed() {
        uni.$off("chooseCard")
    },
    mounted() {
        uni.$on("chooseCard",(data)=>{
            let val = data.type_card == 2 ? '#28BC93' : '#F07365'; //判断header颜色
            this.$store.commit("home/mt_new_bill_all_bg", val);
            this.$store.commit("home/mt_new_bill_all_cardinfo", data);
            this.$store.commit("home/mt_new_bill_all_ytkCard", data.plate);
            this.$emit("pickCard",data)
            console.log('data=',data)
        })
    },
}
</script>

<style scoped lang="scss">
    .box{
        position: relative;
        width: 750rpx;
        z-index: 1;
        transition: all ease-in 0.5s;
        &_content{
            position:absolute;
            left:30rpx;
            .card_title{
                width: 300rpx;
                .text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 40rpx;
                    color: #FEFEFE;
                    font-weight: 400;          
                }
                .image{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 20rpx;
                    height: 36rpx;
                    width: 36rpx;
                    border-radius: 50%;
                }
            }
            .card_num{
                display: block;
                margin-top: 16rpx;
                font-size: 30rpx;
                color: #FFFFFF;
                opacity: .6;
            }
        }
        .timer_packer{
            position: absolute;
            bottom: 0;
            width: 750rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            height: 84rpx;
            line-height: 39rpx;
            &_item{
                position: relative;
                font-size: 28rpx;
                opacity: .4;
                color: #FFFFFF;
                width: 125rpx;
                text-align: center;
            }
            .markMonth,.markYear{
                text-align: center;
            }
            .markYear{
                font-size: 20rpx;
                font-weight: bold;
            }
            .active_color{
                font-size: 32rpx;
                font-weight:bold;
                opacity: 1 !important;
                color: #FFFFFF;
            }
            .active_color::after{
                content:"";
                background:url('https://image.etcchebao.com/etc-min/bill_all/foucs.png')no-repeat;
                opacity: 1 !important;
                background-size: 100% 100%;
                width: 24rpx;
                height: 12rpx;
                position:absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
            .avter_down{
                background:url('https://image.etcchebao.com/etc-min/bill_all/foucs.png')no-repeat;
                background-size: 100% 100%;
                width: 18rpx;
                height: 9rpx;
                margin-left: 15rpx;
                display: inline-block;
                vertical-align: middle;
                transform: rotate(180deg);
            }
        }
        @keyframes animate-up {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(180deg);
            }
        }
        @keyframes animate-down {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(-180deg);
            }
        }
    }
    /deep/ .u-drawer__scroll-view{
        background-color: #FFFFFF !important;
    }
    /deep/.u-select{
        background-color: #FFFFFF !important;
    }
</style>