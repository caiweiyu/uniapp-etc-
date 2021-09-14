<template>
  <view class="box">
      <!--下拉刷新区-->
      <scroll-view :refresher-enabled="true" :scroll-y="true"
            :refresher-triggered="triggered" :refresher-threshold="80"
			refresher-background="#dddddd" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" @refresherabort="onAbort"
			:scroll-with-animation="true"
            class="scroll-class"
            :style="{height:winHeight+'px'}"
      >
            <!--顶部周月选择下拉框区-->
            <selectWeekmon ref="selectWeekmon" :monlist="monthsumBillsList" :cardList="cardList" :weekmonlist="weeklist"></selectWeekmon>       

            <!--本月消费通行次数-->
            <monfreeTimer ref="monfreeTimer"></monfreeTimer>

            <!--账单列表区-->
            <billList ref="billList"></billList>

            <!--底部一键领取-->
            <bottomBtn ref="bottomBtn"></bottomBtn>

      </scroll-view>
  </view>
</template>

<script>
import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()
const app = getApp()
import { mapState } from "vuex"
import * as API from "@/interfaces/bill"
import selectWeekmon from './components/select_weekmon'
// import weekmonTab from './components/weekmon-tab'
import monfreeTimer from './components/monfree-timer'
import billList from './components/bill_list'
import bottomBtn from './components/bottom_btn'

export default {
    data(){
        return {
            triggered:false, //下拉控制开关
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height, //胶囊相关信息
            winHeight:uni.getSystemInfoSync().windowHeight, //系统屏幕宽度
            monthsumBillsList:[],  //月总账单列表
            cardList:{},  //卡信息
            weeklist:[]
        }
    },
    computed: {
        /**
         * 计算高度（胶囊顶部距状态栏高度距离*2 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight*2 + this.menuHeight*2)
        },
        /**
         * 计算scroll-view弹性高度
         */
        scrollViewHeight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        }
    },
    methods: {
        /**
         * 获取月账单
         */
        async getMonthBill2(){
            let res = await API.getMonthBill2({
                cardNo:'1913222300077490',
                token:'60d640aa0c8609064a74a48d29420c38',
                startDate:'202109'
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('月账单=',data)
            }
        },
        /**
         * 获取总月账单
         */
        async getsumMonthBill(){
            let res = await API.getsumMonthBill({
                cardNo:'1913222300077490',
                token:'60d640aa0c8609064a74a48d29420c38'
            });
            let {code,msg,data} = res;
            if(code == 0){
                if(data.monthBills.length > 0){
                    for(let i=0;i<data.monthBills.length;i++){
                        if(new Date().getFullYear() > Number(data.monthBills[i].month.slice(0,4))){
                            data.monthBills[i].markYear = data.monthBills[i].month.slice(0,4);
                        }
                        data.monthBills[i].markMonth = Number(data.monthBills[i].month.slice(4,6))
                    }
                    this.monthsumBillsList = (data.monthBills).reverse();
                }
            }
        },
        /**
         * 获取卡片列表
         */
        async getCardList(){
            let res = await API.getCardList({
                type:1,
                page:1,
                page_size:10
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('卡片列表=',data)  
            }

        },
        /**
         * 获取用户卡相关信息
         */
        async getbillInfoByApp(){
            let res = await API.getbillInfoByApp({
                cardNum:'1913222300077490',
                page:1,
                token:'60d640aa0c8609064a74a48d29420c38'

            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('用户卡相关信息=',data)
                this.cardList = data;
            }
        },
        /**
         * 获取近半年周列表
         */
        async getstatisWeekData(){
            let res = await API.getstatisWeekData({
                cardNo:'1913222300077490',
                token:'60d640aa0c8609064a74a48d29420c38'
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('近半年周',data);
                if(data.length > 0){
                    let arr = [];
                    for(let i=0;i<data.length;i++){
                        for(let j=0;j<data[i].weekRanges.length;j++){
                            let begin = data[i].weekRanges[j].begin.slice(5,10).replace('-','.');
                            let end = data[i].weekRanges[j].end.slice(5,10).replace('-','.');
                            let nowMonth = null;
                            if(Number(data[i].weekRanges[j].begin.split('-')[1]) < new Date().getMonth()+1){
                                nowMonth = Number(data[i].weekRanges[j].begin.split('-')[1])
                            }
                            arr.push({
                                week:data[i].weekRanges[j].weekOfMonth,
                                type:data[i].weekRanges[j].statisType[0].type,
                                money:data[i].weekRanges[j].statisType[0].money,
                                times:data[i].weekRanges[j].statisType[0].times,
                                begin:begin,
                                end:end,
                                describe:'第'+data[i].weekRanges[j].weekOfMonth+'周 '+'('+begin+'-'+end+')',
                                nowMonth:nowMonth
                            })
                        }   
                    };
                    console.log('arr=',arr)
                    this.weeklist = arr.reverse();
                }
            }
        },

        /**
         * 下拉事件
         */
        onRefresh() { 
            this.triggered = true;
            let timer = setTimeout(() => {
                this.triggered = false;
                clearTimeout(timer)
            }, 1500)
        },
        /**
         * 下拉被复位
         */
        onRestore() {
            console.log('事件刷新~')
        },
        /**
         * 下拉被中止，没下拉完就松手就会触发
         */
        onAbort() {
            console.log('无效下拉')
        }
    },
    mounted(){
        this.getMonthBill2()
        this.getsumMonthBill()
        this.getCardList()
        this.getbillInfoByApp()
        this.getstatisWeekData()
    },
    components:{
        selectWeekmon,
        monfreeTimer,
        billList,
        bottomBtn
    }
}
</script>

<style scoped lang="scss">
    .box{
        width: 100%;
        height: 100%;
    }
    .scroll-class{
        height:100vh;
    }
</style>