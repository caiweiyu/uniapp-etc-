<template>
    <view class="box" :style="{backgroundColor:bgColor,height:tabBoundheight+'rpx'}">

        <!--顶部周、月账单选项-->
        <view :class="['box_title']" @click="openTarget" :style="{top:tabHeight+btnBoundtop+'rpx',height:menu.height*2+'rpx'}">
            <text class="dirtctionTitle">{{isweekmon == 1 ? list[1].cateName : list[0].cateName}}</text>
            <view :class="[isOpen ? 'dirtctionAvterafter' : 'dirtctionAvter']"></view>
        </view>

        <!--周、月弹出层选项-->
        <u-picker mode="selector" v-model="isOpen" :default-selector="[isweekmon]" :range="list" range-key="cateName" @confirm="enter" @cancel="cancel" :confirm-color="'#FF5C2A'" :cancel-color="'#999999'" :confirm-text="'确定'"></u-picker>
    
    </view>
</template>
<script>
import { mapState } from "vuex"
export default {
    props:{
        /**
         * 周、月选择
         */
        list:{
            type:Array,
            default:[
                {
                    cateName: '月账单',
                    id: 1
                },
                {
                    cateName: '周账单',
                    id: 2
                }
            ]
        },
        /**
         * 月
         */
        monlist:{
            type:Array,
            default:[]
        },
    },
    data(){
        return {
            isOpen:false, //周月开关
            value:-1, //选择值的确定
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
        }
    },
    computed:{
        ...mapState({
			isweekmon: (state) => state.home.new_bill_all.isweekmon,
            bgColor:(state) => state.home.new_bill_all.bgColor
		}),
        /**
         * 计算高度（胶囊顶部距状态栏高度距离 + 状态栏高度 + 胶囊高度）
        */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        },
        /**
         * 是否打开的 Model 层
         */
        isOpenModel(){
            if(this.isOpen){
               return true
            }
        },
    },
    watch:{
        isOpenModel(o,n){
          o==true ? this.$emit("changZindex",-1) : this.$emit("changZindex",1);
          console.log(o,'是头部啊')
        }
    },
    mounted() {
        console.log('btnBoundtop=',this.btnBoundtop)
    },
    methods: {
        /**
         * 确认
         */
        enter(e){
            this.isOpen = false;
            this.$store.commit("home/mt_new_bill_all", e[0]);
            uni.$emit('pickerTimermon',this.monlist[e[0]])
            this.isweekmon == 1 ? this.status = 1 : this.status = 0;
            console.log(this.isweekmon,'周月===')
        },
        /**
         * 取消
         */
        cancel(){
            this.isOpen = false;
        },
        /**
         * 头部下拉开关
         */
        openTarget(){
            this.isOpen = true;
        },
    },
}
</script>
<style lang="scss" scoped>
    .box{
        position: relative;
        width: 750rpx;
        z-index: 1;
        transition: all ease-in 0.5s;
        &_title{
                position: absolute;
                transform: translateX(-50%);
                font-size: 36rpx;
                color: #FFFFFF;
                font-weight: bold;
                left: 50%;
                .dirtctionTitle{
                    vertical-align: middle;
                    display: inline-block;
                }
                .dirtctionAvter{
                    background:url('https://image.etcchebao.com/etc-min/bill_all/select_icon1.png')no-repeat;
                    background-size: 100% 100%;
                    width: 40rpx;
                    height: 40rpx;
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 8rpx;
                    animation: animate-down linear 0.2s forwards;
                }
                .dirtctionAvterafter{
                    background:url('https://image.etcchebao.com/etc-min/bill_all/select_icon1.png')no-repeat;
                    background-size: 100% 100%;
                    width: 40rpx;
                    height: 40rpx;
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 8rpx;
                    transform:rotateY(180deg) !important;
                    animation: animate-up linear 0.2s forwards;
                }
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
</style>