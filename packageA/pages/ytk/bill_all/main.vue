<template>
  <view class="box" :style="{height:winHeight+'px'}">
      <!--下拉滚动头部更换-->
      <selectWeekmonheader :monlist="monthsumBillsList" @changZindex="changZindex"></selectWeekmonheader>  
      <!-- <selectWeekmonbottom class="selectWeekmonbottom" :monlist="monthsumBillsList" :weekmonlist="weeklist" @pickCard="pickCardfn" @changZindex="changZindex"></selectWeekmonbottom>  -->
      <!--下拉刷新区-->
      <scroll-view :refresher-enabled="entrue" :scroll-y="isScroll"
            :refresher-triggered="triggered" :refresher-threshold="80"
			:refresher-background="datacolor" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" @refresherabort="onAbort"
			:scroll-with-animation="true"
            class="scroll-class"
            @scroll="scrollHandler"
            :style="{height:(winHeight*2-tabBoundheight)+'rpx'}">     

            <!--顶部周月选择下拉框区-->
             <selectWeekmon ref="selectWeekmon" :cardList="cardList" :monlist="monthsumBillsList" :weekmonlist="weeklist" @pickCard="pickCardfn" @changZindex="changZindex" @selectMonBill="selectMonBill" @selectWeekBill="selectWeekBill"></selectWeekmon>  
            
            <!--本月消费通行次数-->
            <monfreeTimer ref="monfreeTimer" :getoperalist="operalist"></monfreeTimer>

            <!--账单列表区-->
            <billList ref="billList" :bottombillobj="bottombillobj" :cardList_info="cardList_info" :week_cardList_info="week_cardList_info"></billList>

      </scroll-view>
      <!--底部一键领取-->
      <view class="bottom_class" :style="{top:topValue,zIndex:zindex}" v-if="isweekmon==0">
          <bottomBtn ref="bottomBtn" :bottombillobj="bottombillobj" @selectCoinfunc="selectCoinfunc"></bottomBtn>
      </view>
      <canvas id="canvas" v-if="show_add_coin" type="2d"  style="width: 750rpx; height: 750rpx;" class="canves"></canvas>
  </view>
</template>

<script>
import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()
const app = getApp()
import { mapState } from "vuex"
import * as API from "@/interfaces/bill"
import selectWeekmonheader from './components/select_weekmon_header'
// import selectWeekmonbottom from './components/select_weekmon_bottom'
import selectWeekmon from './components/select_weekmon'
import monfreeTimer from './components/monfree-timer'
import billList from './components/bill_list'
import bottomBtn from './components/bottom_btn'
import lottie from 'lottie-miniprogram'

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
            week_cardList_info:[],  //周账单列表
            cardList_info:[],  //月账单列表
            weeklist:[],  //周列表
            operalist:[],  //运营位相关信息
            zindex:1,  //浮窗层级
            bottombillobj:{},  //金币相关
            isScrollOver:false,  //是否超过滚动区域
            datacolor:'#28BC93',    //下拉区域的颜色
            show_add_coin:false,   //金币canvas开启与否
            isScroll:true  //是否禁止滚动
        }
    },
    computed: {
        ...mapState({
			isweekmon: (state) => state.home.new_bill_all.isweekmon,
            bgColor:(state) => state.home.new_bill_all.bgColor,
            entrue:(state) => state.home.new_bill_all.entrue,
            selectweek:(state) => state.home.new_bill_all.selectweek,
            selectmon:(state) => state.home.new_bill_all.selectmon,
            cardinfo:(state) => state.home.new_bill_all.cardinfo,
            cardusenum:(state) => state.home.new_bill_all.cardusenum
		}),
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
            return (this.winHeight*2-this.tabBoundheight)+'rpx'
        },
    },
    onShow(){
        this.$store.commit("home/mt_new_bill_all_en", true);
        this.datacolor = this.bgColor;
        setTimeout(()=>{
            wx.createSelectorQuery().select('#canvas').node(res => {
                console.log('res=',res)
                const canvas = res.node
                const context = canvas.getContext('2d')
                canvas.width = 750
                canvas.height = 750
                lottie.setup(canvas)
                lottie.loadAnimation({
                loop: true,
                autoplay: true,
                path: "https://image.etcchebao.com/etc-min/new-bill-all/coin.json", //lottie json包的网络链接，可以防止小程序的体积过大，要注意请求域名要添加到小程序的合法域名中
                // animationData: require('./components/lottie.json'),
                rendererSettings: {
                    context,
                },
                });
                //this.show_add_coin = true;
            }).exec();
        },500) 
        console.log(this.isweekmon,'周月====')
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
        /**
         * 获取周账单
         */
        async getbillInfoByApp(cardNum,startDay,endDay){
            let res = await API.getbillInfoByApp({
                cardNum:cardNum,
                startDay:startDay || '',
                endDay:endDay || '',
                page:1
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('用户卡相关信息=',data)
                this.cardList = data;
                this.week_cardList_info = data.billInfo;
            }
        },
        /**
         * 获取月账单
         */
        async getMonthBill2(cardNo,startDate){
            console.log(cardNo,startDate)
            let res = await API.getMonthBill2({
                cardNo:cardNo,
                startDate:startDate || this.getyymm()
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('获取月账单=',data);
                this.bottombillobj = data;
                this.cardList_info = data.passDetail
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
                    this.$store.commit("home/mt_new_bill_all_monthsumBillsList", this.monthsumBillsList);
                    console.log('获取六个月账单',this.monthsumBillsList)
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
                console.log('卡里',data)
                if(data.info.length > 0){
                    for(let i=0;i<data.info.length;i++){
                        if(data.info[i].comm_card){
                            console.log('常用卡号是=',data.info[i].card_num,data.info[i].plate);
                            this.$store.commit("home/mt_new_bill_all_cardusenum", data.info[i].card_num);
                            this.$store.commit("home/mt_new_bill_all_ytkCard", data.info[i].plate);
                            return data.info[0].card_num;
                        }
                    }
                }else{
                    this.$store.commit("home/mt_new_bill_all_en", false);
                    uni.navigateTo({
                        url: '/packageA/pages/ytk/ytk_list/main?comeForm=2'
                    });
                }
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
         * 获取近半年周列表
         */
        async getstatisWeekData(cardNo){
            let res = await API.getstatisWeekData({
                cardNo:cardNo
            });
            let {code,msg,data} = res;
            if(code == 0){
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
                                preMonth:preMonth,
                                startDay:data[i].weekRanges[j].begin,
                                endDay:data[i].weekRanges[j].end
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
            data == -1 ? this.isScroll = false : this.isScroll = true;
            this.zindex = data;
        },
        /**
         * 选择月份改变数据
         */
        selectMonBill(item){
            console.log('月份改变数据=',item);
            console.log(this.cardinfo)
            this.getMonthBill2(this.cardusenum,item)
        },
        /**
         * 选择周改变数据
         */
        selectWeekBill(item){
            console.log('周份改变数据=',item);
            this.getbillInfoByApp(this.cardusenum,item.startDay,item.endDay)
        },
        /**
         * 选择卡片触发的事件
         */
        pickCardfn(item){
            this.getMonthBill2(item.cardno,this.selectmon.month);
            this.getsumMonthBill(item.cardno);
            this.getbillInfoByApp(item.cardno);
            this.getstatisWeekData(item.cardno);
            let data = this.isweekmon == 1 ? 4 : 3;
            this.getoperaList(data); //1 金币模块 2 账单模块 3 粤通卡月账单模块  4 粤通卡周账单模块
        },
        /**
         * 一键领取/单独领取
         */
        selectCoinfunc(item){
            console.log('名称=',item)
            this.loadallHandler()
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
            //console.log('滚动值=',e)
            e.detail.scrollTop > 224 ? this.isScrollOver = true : this.isScrollOver = false;
        },
        /**
         * 加载所有事件
         */
        loadallHandler(){
            new Promise((resolve,reject)=>{
                resolve( this.getCardList() )
            }).then(res=>{
                if(res){
                    this.getMonthBill2(res,this.selectmon.month);
                    this.getsumMonthBill(res);
                    this.getbillInfoByApp(res);
                    this.getstatisWeekData(res);
                    let data = this.isweekmon == 1 ? 4 : 3;
                    this.getoperaList(data); //1 金币模块 2 账单模块 3 粤通卡月账单模块  4 粤通卡周账单模块
                }
            })
        }
    },
    destroyed() {
        //uni.$off('chooseCard')
    },
    mounted(){
        this.loadallHandler()
    },
    components:{
        selectWeekmonheader,
        // selectWeekmonbottom,
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
        background-color: #F6F6F6;
    }
    .bottom_class{
        position: fixed;
        transform: translateX(-50%);
        left: 50%;
    }
    .selectWeekmonbottom{
        position: absolute;
        top: 130rpx;
    }
    .canves{
        position: absolute;
        left: 50%;
        z-index: 9999;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>