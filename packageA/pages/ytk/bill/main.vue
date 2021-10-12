<template>
  <view class="box" :style="{height:winHeight+'px'}">
      <!--没有绑卡的情况-->
      <block v-if="!cardusenum">
            <unbindCard></unbindCard>
      </block>
      <!--有绑卡的情况-->
      <block v-else>
            <!--下拉滚动头部更换-->
            <selectWeekmonheader :monlist="monthsumBillsList" @selectCoinfunc="selectCoinfunc" @changZindex="changZindex"></selectWeekmonheader>  
            <selectWeekmonbottom v-if="isScrollOver" :style="{position:'fixed',top:tabBoundheight+'rpx',zIndex:zindex}"  ref="selectWeekmon" :cardList="cardList" :monlist="monthsumBillsList" @pickCard="pickCardfn" @changZindex="changZindex" @selectMonBill="selectMonBill" @selectWeekBill="selectWeekBill"></selectWeekmonbottom> 
            <!--下拉刷新区-->
            <scroll-view :refresher-enabled="entrue" :scroll-y="isScroll"
                    :refresher-triggered="triggered" :refresher-threshold="80"
                    :refresher-background="datacolor" @refresherrefresh="onRefresh"
                    @refresherrestore="onRestore" @refresherabort="onAbort"
                    :scroll-with-animation="true"
                    class="scroll-class"
                    @scroll="scrollHandler"
                    :style="{height:topValue,top:tabBoundheight+'rpx'}">     

                    <!--顶部周月选择下拉框区-->
                    <selectWeekmon ref="selectWeekmon" :triggered="triggered" :cardList="cardList" :monlist="monthsumBillsList" @pickCard="pickCardfn" @changZindex="changZindex" @selectMonBill="selectMonBill" @selectWeekBill="selectWeekBill"></selectWeekmon>  
                    
                    <!--本月消费通行次数-->
                    <monfreeTimer ref="monfreeTimer" :getoperalist="operalist" :cardList="cardList"></monfreeTimer>

                    <!--账单列表区-->
                    <billList ref="billList" @showToastfn="showToastfn" @selectCoinfunc="selectCoinfunc" :bottombillobj="bottombillobj" :cardList_info="cardList_info" :week_cardList_info="week_cardList_info" @isTouchCoin="isTouchCoin" @cardListInfoIndex="cardListInfoIndex"></billList>

            </scroll-view>
            <!--底部一键领取-->
            <view class="bottom_class" :style="{bottom:'28rpx',zIndex:zindex}" v-if="isweekmon==0">
                <bottomBtn ref="bottomBtn" :bottombillobj="bottombillobj" @selectCoinfunc="selectCoinfunc" @isTouchCoin="isTouchCoin"></bottomBtn>
            </view>
            <canvas v-show="show_add_coin" id="canvas" type="2d"  class="canves"></canvas>
            <canvas v-show="show_add_coin" id="canvas2" type="2d" class="canves"></canvas>
            <!--周选择详情弹出层选项-->
            <u-picker mode="selector" v-model="isOpenWeekVal" :default-selector="defaultweekvalue" :range="weeklist" range-key="describe" @confirm="enterweek" @cancel="cancelWeekPicker" :confirm-color="'#FF5C2A'" :cancel-color="'#999999'" :confirm-text="'确定'"></u-picker>
      </block>
      <!-- 全局提示 -->
      <toast :content="showToast" @showToastfn="showToastfn" v-show="isToast"></toast>
      <!-- 全局弹窗 -->
      <dialog-window ref="dialog" :flag="isweekmon == 1 ? '12' : '11'"></dialog-window>
  </view>
</template>

<script>
import miniScript from "@/common/miniScript"
const miniapp = miniScript.getInstance()
const app = getApp()
import { mapState } from "vuex"
import { eventMonitor } from "@/common/utils"
import * as API from "@/interfaces/bill"
import selectWeekmonheader from './components/select_weekmon_header'
import selectWeekmonbottom from './components/select_weekmon_bottom'
import selectWeekmon from './components/select_weekmon'
import monfreeTimer from './components/monfree-timer'
import billList from './components/bill_list'
import bottomBtn from './components/bottom_btn'
import unbindCard from './components/unbindCard'
import toast from './components/toast'
import DialogWindow from "@/components/dialog-window"
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
            operalist:{},  //运营位相关信息
            zindex:1,  //浮窗层级
            bottombillobj:{},  //金币相关
            isScrollOver:false,  //是否超过滚动区域
            datacolor:'#28BC93',    //下拉区域的颜色
            isScroll:true,  //是否禁止滚动
            isOpenWeekVal:false,  //周开关
            showToast:'',  //提示文字
            isToast:false  //显示关闭弹窗
        }
    },
    computed: {
        ...mapState({
            token: (state) => state.user.token,
			isweekmon: (state) => state.home.new_bill_all.isweekmon,
            bgColor:(state) => state.home.new_bill_all.bgColor,
            entrue:(state) => state.home.new_bill_all.entrue,
            selectweek:(state) => state.home.new_bill_all.selectweek,
            selectmon:(state) => state.home.new_bill_all.selectmon,
            cardinfo:(state) => state.home.new_bill_all.cardinfo,
            cardusenum:(state) => state.home.new_bill_all.cardusenum,
            show_add_coin:(state) => state.home.new_bill_all.show_add_coin,
            isNeeddisCount:(state) => state.home.new_bill_all.isNeeddisCount,
            isOpenWeek:(state) => state.home.new_bill_all.isOpenWeek,
            defaultweekvalue:(state) => state.home.new_bill_all.defaultweekvalue,
            selectweekMore:(state) => state.home.new_bill_all.selectweekMore,
            weeklist:(state) => state.home.new_bill_all.weeklist
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
    watch:{
        isOpenWeek(o,n){
            this.isOpenWeekVal = o
        },
        isweekmon(o,n){
            console.log('旧-新',o,n)
            o==1 ? eventMonitor('WeChat_YTK_WeeklyBill_1',1) : eventMonitor('WeChat_YTK_MonthlyBill_1',1);
        }
    },
    onShow(){
        this.$store.commit("home/mt_new_bill_all_en", true);
        this.datacolor = this.bgColor;
        this.$token(()=>{
            this.loadallHandlerhasCard();
            this.$refs.dialog.loadPopup();
        });
        if(this.token && this.cardusenum){
            this.isweekmon == 1 ? eventMonitor('WeChat_YTK_WeeklyBill_1',1) : eventMonitor('WeChat_YTK_MonthlyBill_1',1);
        }
        console.log('onShow')
        this.$store.dispatch("home/ac_share_info",this.isweekmon == 1 ? '12' : '11');//分享配置
        this.$refs.dialog.loadPopup();
    },
    onLoad(options){
        /**
         * 加载信息提示
        */ 
        this.getparaList()
        new Promise((resolve,reject)=>{
            resolve( this.getCardList() )
        }).then(res=>{
            if(res){
                this.getstatisWeekData(res);
                this.getsumMonthBill(res);
                setTimeout(()=>{
                    /**
                     * 初始化参数 type 1本周 2上周 3本月 4上月
                     */
                    console.log('options.type=',options.type)
                    if(options.type == 1){
                        this.$store.commit("home/mt_new_bill_all", 1);
                        this.$refs.selectWeekmon.pickerTimer(3)
                    }else if(options.type == 2){
                        this.$store.commit("home/mt_new_bill_all", 1);
                        this.$refs.selectWeekmon.pickerTimer(2)
                    }else if(options.type == 3){
                        this.$store.commit("home/mt_new_bill_all", 0);
                        this.$refs.selectWeekmon.pickerTimermoner(5)
                    }else if(options.type == 4){
                        this.$store.commit("home/mt_new_bill_all", 0);
                        this.$refs.selectWeekmon.pickerTimermoner(4)
                    }else{
                        this.$store.commit("home/mt_new_bill_all", 0);
                        this.$refs.selectWeekmon.pickerTimermoner(5)
                    }
                },300)
            }
        })
        
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
                console.log('获取周账单=',data)
                this.cardList = data;
                this.week_cardList_info = data.billInfo;
            }
        },
        /**
         * 获取月账单
         */
        async getMonthBill2(cardNo,startDate){
            let res = await API.getMonthBill2({
                cardNo:cardNo,
                startDate:startDate || this.getyymm()
            });
            let {code,msg,data} = res;
            if(code == 0){
                console.log('获取月账单=',data);
                this.bottombillobj = data;
                this.cardList_info = data.passDetail;
                if(this.isNeeddisCount){
                    this.getUserLevel(cardNo,data.passTotalMoney)
                }
            }
        },
        /**
         * 单个领取改变领取状态
         */
        cardListInfoIndex(index){
            this.cardList_info[index].status = 1;
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
                if(data.info.length > 0){
                    for(let i=0;i<data.info.length;i++){
                        if(data.info[i].comm_card){
                            console.log('常用粤通卡卡号/车牌号是=',data.info[i].card_num,data.info[i].plate);
                            this.$store.commit("home/mt_new_bill_all_cardusenum", data.info[i].card_num);
                            this.$store.commit("home/mt_new_bill_all_ytkCard", data.info[i].plate);
                            return data.info[0].card_num;
                        }
                    }
                }
            }

        },
        /**
         * 触发领取金币
         */
        isTouchCoin(data){
            this.$store.commit("home/mt_new_bill_all_show_add_coin", true);
            wx.createSelectorQuery().select('#canvas').node(res => {
                const canvas = res.node
                const context = canvas.getContext('2d')
                canvas.width = 750
                canvas.height = 750
                lottie.setup(canvas)
                let anim  = lottie.loadAnimation({
                    loop: false,
                    autoplay: true,
                    path: "https://image.etcchebao.com/etc-min/new-bill-all/coin.json", //lottie json包的网络链接，可以防止小程序的体积过大，要注意请求域名要添加到小程序的合法域名中
                    //animationData:require("./components/data.js"),
                    rendererSettings: {
                        context,
                    },
                });
            }).exec();    
            wx.createSelectorQuery().select('#canvas2').node(res => {
                const canvas = res.node
                const context = canvas.getContext('2d')
                canvas.width = 750
                canvas.height = 750
                context.font = '28px 微软雅黑'
                context.fillStyle="#FFFFFF"
                context.textAlign = 'center'
                context.fillText(data, 375, 425)
                setTimeout(()=>{
                     context.clearRect(0,0,750,750)
                },3000)
            }).exec();
            setTimeout(()=>{
                this.$store.commit("home/mt_new_bill_all_show_add_coin", false);
            },3500)
                    
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
                 this.operalist = data;
                 if(this.operalist.type_2){
                     this.$store.commit("home/mt_new_bill_all_isNeeddisCount", true);
                 }
                 this.operalist.location = location;
            }
        },
        /**
         * 获取用户vip等级信息
         */
        async getUserLevel(cardNo,amount){
            let res = await API.getUserLevel({
                cardNo:cardNo,
                amount:amount
            });
            let {code,msg,data} = res;
            if(code == 0){
                if(Number(data.discount_amount) > 0){
                    this.$store.commit("home/mt_new_bill_all_discount_amount", data.discount_amount);
                }
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
                            if(Number(data[i].weekRanges[j].end.split('-')[1]) < new Date().getMonth()+1){
                                nowMonth = Number(data[i].weekRanges[j].end.split('-')[1])
                            }else{
                                preMonth = Number(data[i].weekRanges[j].end.split('-')[1])
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
                    this.$store.commit("home/mt_new_bill_all_weeklist", arr.reverse());
                }
            }
        },
        /**
         * 获取后台提示信息
         */
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
                this.showToast = data.bill_notes;
                }
            }
        },
        /**
         * 关闭全局弹窗提示
         */
        showToastfn(data){
            console.log('是否关闭',data)
            this.isToast = data;
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
            console.log('选择卡片相关的信息=',item)
            let data = this.isweekmon == 1 ? 4 : 3;
            this.getoperaList(data); //1 金币模块 2 账单模块 3 粤通卡月账单模块  4 粤通卡周账单模块
            this.getsumMonthBill(item.cardno);
            this.getMonthBill2(item.cardno,this.selectmon.month);
            this.getbillInfoByApp(item.cardno,this.selectweek.startDay,this.selectweek.endDay);
        },
        /**
         * 一键领取/单独领取
         */
        selectCoinfunc(item){
            console.log(item)
            this.loadallHandlerhasCard()
        },
        /**
         * 选择周确定
         */
        enterweek(e){
            this.$store.commit("home/mt_new_bill_all_selectweekMore", this.weeklist[e[0]]);
            this.$store.commit("home/mt_new_bill_all_defaultweekvalue", e);
            this.$store.commit("home/mt_new_bill_all_selectweek", this.selectweekMore);
            this.$store.commit("home/mt_new_bill_all_isOpenWeek", false);
            this.selectWeekBill(this.selectweekMore)
        },
        /**
         * 取消周选择
         */
        cancelWeekPicker(){
            this.$store.commit("home/mt_new_bill_all_isOpenWeek", false);
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
            console.log('事件刷新~');
            this.loadallHandlerhasCard()
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
            e.detail.scrollTop > 153 ? this.isScrollOver = true : this.isScrollOver = false;
        },
        /**
         * 加载所有事件，卡号有的情况
         */
        loadallHandlerhasCard(){
            let data = this.isweekmon == 1 ? 4 : 3;
            this.getoperaList(data); //1 金币模块 2 账单模块 3 粤通卡月账单模块  4 粤通卡周账单模块
            if(this.cardusenum){
                this.getMonthBill2(this.cardusenum,this.selectmon.month);
                this.getbillInfoByApp(this.cardusenum,this.selectweek.startDay,this.selectweek.endDay); 
            }   
        },
    },
    mounted(){
        console.log('mounted')
        this.loadallHandlerhasCard()
    },
    /**
     * 分享好友/群
     */
    onShareAppMessage(res) {
        return app.shareAppMessage();
    },
    /**
     * 分享朋友圈
     */
    onShareTimeline(res) {
        return app.shareTimeline();
    },
    components:{
        selectWeekmonheader,
        selectWeekmonbottom,
        selectWeekmon,
        monfreeTimer,
        billList,
        bottomBtn,
        DialogWindow,
        unbindCard,
        toast
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
    .canves{
        position: absolute;
        left: 50%;
        z-index: 9999;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 750rpx;
        height: 750rpx;
    }
    .scroll-class{
        position: fixed;
    }
    .select_list{
        width:750rpx;
        background-color: #000000;
        z-index: 999;
            &_bg{
                height: calc(100vh - 600rpx);
                opacity: .7;
            }
            &_picker{
                border-radius: 12rpx 12rpx 0 0;
                background-color: #FFFFFF;
                height: 600rpx;
            }
    }
</style>