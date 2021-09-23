<template>
  <view class="box" :style="{height:winHeight+'px'}">
      <!--下拉滚动头部更换-->
      <selectWeekmon ref="selectWeekmon" 
            :style="{position:scroll_val}" 
            :monlist="monthsumBillsList" 
            :cardList="cardList" 
            :weekmonlist="weeklist" v-if="isScrollOver" @pickCard="pickCardfn" @changZindex="changZindex">
      </selectWeekmon>   
      <!--下拉刷新区-->
      <scroll-view :refresher-enabled="true" :scroll-y="true"
            :refresher-triggered="triggered" :refresher-threshold="80"
			:refresher-background="type_card" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" @refresherabort="onAbort"
			:scroll-with-animation="true"
            class="scroll-class"
            @scroll="scrollHandler"
            :style="{height:winHeight+'px'}">
            <!--顶部周月选择下拉框区-->
            <selectWeekmon ref="selectWeekmon" v-if="!isScrollOver" :style="{position:scroll_val}" :monlist="monthsumBillsList" :cardList="cardList" :weekmonlist="weeklist" @pickCard="pickCardfn" @changZindex="changZindex"></selectWeekmon>       

            <!--本月消费通行次数-->
            <monfreeTimer ref="monfreeTimer" :getoperalist="operalist"></monfreeTimer>

            <!--账单列表区-->
            <billList ref="billList" :cardList_info="cardList_info"></billList>

      </scroll-view>
      <!--底部一键领取-->
        <view class="bottom_class" :style="{top:topValue,zIndex:zindex}">
            <bottomBtn ref="bottomBtn"></bottomBtn>
        </view>
  </view>
</template>

<script>
import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()
const app = getApp()
import { mapState } from "vuex"
import * as API from "@/interfaces/bill"
import selectWeekmon from './components/select_weekmon'
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
            cardList_info:[],
            weeklist:[],  //周列表
            operalist:[],  //运营位相关信息
            zindex:1,  //浮窗层级
            type_card:"#28BC93",
            scroll_val:'relative',
            isScrollOver:false
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
        },
        /**
         * top值
         */
        topValue(){
            return (this.winHeight*2-208)+'rpx'
        }
    },
    created() {
        console.log('winHeight',this.winHeight)
    },
    methods: {
        /**
         * 获取月账单
         */
        async getMonthBill2(cardNo,startDate){
            let res = await API.getMonthBill2({
                cardNo:cardNo,
                startDate:startDate || '202109'
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('月账单=',data)
            }
        },
        /**
         * 获取总月账单
         */
        async getsumMonthBill(cardNo){
            let res = await API.getsumMonthBill({
                cardNo:cardNo,
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
                console.log('卡片列表=',data);
                return data.info[0].card_num;
            }

        },
        /**
         * 获取运营位
         */
        async getoperaList(location){
            let res = await API.getOperaList({
                location:location
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('运营位=',data)
                 this.operalist = data.type_1;
            }
        },
        /**
         * 获取用户卡相关信息
         */
        async getbillInfoByApp(cardNum){
            let res = await API.getbillInfoByApp({
                cardNum:cardNum,
                page:1
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('用户卡相关信息=',data)
                this.cardList = data;
                this.cardList_info = data.billInfo;
            }
        },
        /**
         * 获取近半年周列表
         */
        async getstatisWeekData(cardNo){
            let res = await API.getstatisWeekData({
                cardNo:cardNo
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
                            let preMonth = null;
                            if(Number(data[i].weekRanges[j].begin.split('-')[1]) < new Date().getMonth()+1){
                                nowMonth = Number(data[i].weekRanges[j].begin.split('-')[1])
                            }else{
                                preMonth = Number(data[i].weekRanges[j].begin.split('-')[1])
                            }
                            arr.push({
                                week:data[i].weekRanges[j].weekOfMonth,
                                type:data[i].weekRanges[j].statisType[0].type,
                                sum:data[i].weekRanges[j].statisType[0].money,
                                num:data[i].weekRanges[j].statisType[0].times,
                                begin:begin,
                                end:end,
                                describe:'第'+data[i].weekRanges[j].weekOfMonth+'周 '+'('+begin+'-'+end+')',
                                nowMonth:nowMonth,
                                preMonth:preMonth
                            })
                        }   
                    };
                    console.log('arr=',arr)
                    this.weeklist = arr.reverse();
                }
            }
        },
        /**
         * 改变浮窗的层级
         */
        changZindex(data){
            this.zindex = data;
        },
        /**
         * 选择卡片触发的事件
         */
        pickCardfn(item){
            console.log('选择卡片触发的事件',item.cardno);
            this.getMonthBill2(item.cardno,null);
            this.getsumMonthBill(item.cardno);
            this.getbillInfoByApp(item.cardno);
            this.getstatisWeekData(item.cardno);
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
        },
        /**
         * scrollview滚动事件
         */
        scrollHandler(e){
            //e.detail.scrollTop > 206 ? this.scroll_val='fixed' : this.scroll_val='relative';
            console.log('滚动值=',e)
            e.detail.scrollTop > 224 ? this.isScrollOver = true : this.isScrollOver = false;
        },
    },
    destroyed() {
        uni.$off('chooseCard')
    },
    mounted(){
        uni.$on('chooseCard',(data)=>{
            data.type_card == 2 ? this.type_card = "#28BC93" : this.type_card = "#F07365";
        })
        new Promise((resolve,reject)=>{
            resolve( this.getCardList() )
        }).then(res=>{
            if(res){
                this.getMonthBill2(res,null);
                this.getsumMonthBill(res);
                this.getbillInfoByApp(res);
                this.getstatisWeekData(res);
                this.getoperaList(2); //1 金币模块 2 账单模块 3 粤通卡月账单模块  4 粤通卡周账单模块
            }
        })
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
        height: 100vh;
        background-color: #F6F6F6;
    }
    .scroll-class{
        height:100%;
    }
    .bottom_class{
        position: fixed;
        transform: translateX(-50%);
        left: 50%;
    }
</style>