<template>
    <view class="box" :style="{backgroundColor:bgColor,height:tabBoundheight+'rpx'}">
        <!--顶部周、月账单选项-->
            <view :class="['box_title']"  @click="openTarget" :style="{top:tabHeight+btnBoundtop+'rpx',height:menu.height*2+'rpx'}">
                <text class="dirtctionTitle">{{isweekmon == 1 ? list[isweekmon].cateName : list[isweekmon].cateName}}</text>
                <view :class="[isOpen ? 'dirtctionAvterafter' : 'dirtctionAvter']"></view>
            </view>
        <!--周、月弹出层选项-->
        <u-picker mode="selector" v-model="isOpen" :default-selector="[isweekmon]" :range="list" range-key="cateName" @confirm="enter" @cancel="cancel" :confirm-color="'#FF5C2A'" :confirm-text="'确定'"></u-picker>
         <!-- <u-select v-model="isOpen" mode="single-column" :default-value="[isweekmon]" :cancel-color="'#999999'" :confirm-color="'#FF5C2A'" z-index="999"  :title="''" :list="list" @confirm="enter"></u-select> -->
         <!-- <view :class="['select_list',isOpenWeekorMoon == true ? 'select_list_active' : 'select_list_off']" @touchmove.stop="()=>{return true}">
          <view @click="cancelSelect" :class="['select_list_bg',isOpenWeekorMoon == true ? 'select_list_bg_active' : 'select_list_bg_off']"></view>
          <view :class="['select_list_picker',isOpenWeekorMoon == true ? 'select_list_picker_active':'select_list_picker_off']">
              <scroll-view :scroll-y="true" :class="['scroll_page']" v-if="isOpenWeekorMoon" :scroll-into-view="scrollRight" :scroll-with-animation="true">
                  <view v-for="(item,index) in list" :id="'into_right'+index" :key="index" :class="['scroll_page_list',isweekmon==index?'scroll_page_list_active':'']" @click="handClick(item,index)">{{item.cateName}}</view>
              </scroll-view>
          </view> 
        </view>-->
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
            scrollRight:"",
            weekIndex:-1,
            visible:false,  //周月弹层开关
            index:0
        }
    },
    computed:{
        ...mapState({
			isweekmon: (state) => state.home.new_bill_all.isweekmon,
            bgColor:(state) => state.home.new_bill_all.bgColor,
            isOpenWeekorMoon:(state) => state.home.new_bill_all.isOpenWeekorMoon
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
         * 取消事件
         */
        cancelfn(e){
            console.log('e=',e)
        },
        /**
         * 选择事件
         */
        change(e){
            console.log('e====',e)
        },
        /**
         * 确认
         */
        enter(e){
            this.isOpen = false;
            this.$store.commit("home/mt_new_bill_all", e[0]);
            uni.$emit('pickerTimermon',this.monlist[e[0]])
            // this.isweekmon == 1 ? this.status = 1 : this.status = 0;
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
            // this.visible = !this.visible;
            this.isOpen = true;
            // this.$store.commit("home/mt_new_bill_all_en", true);
            // this.$store.commit("home/mt_new_bill_all_isOpenWeeklist", false);
            // this.$store.commit("home/mt_new_bill_all_isOpenWeekorMoon", true);
            this.$emit("changZindex",-1)
        },
                /**
         * 关闭周月
         */
        cancelSelect(){
            this.$store.commit("home/mt_new_bill_all_isOpenWeekorMoon", false);
            this.$emit("changZindex",1)
        },
        /**
         * 选择周月切换
         */
        handClick(item,index){
            // this.$store.commit("home/mt_new_bill_all", index);
            this.$store.commit("home/mt_new_bill_all", index);
            this.$emit("changZindex",1);
            setTimeout(()=>{
                this.$store.commit("home/mt_new_bill_all_isOpenWeekorMoon", false);
            },1000)
            this.$nextTick(()=>{
               this.scrollRight = 'into_right'+ index
            });
            this.scrollRight = '';
        }
    },
}
</script>
<style lang="scss" scoped>
    .box{
        position: fixed;
        width: 750rpx;
        z-index: 1;
        top: 0;
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
    .select_list{
        width:750rpx;
        position: fixed;
        top: 0;
        z-index: 999;
        &_bg{
            
            opacity: .7;
            background-color: #000000;
        }
        &_bg_active{
            height: calc(100vh - 600rpx);
            transition: height linear 0.2s;
        }
        &_bg_off{
            height: 0;
            transition: height linear 0.2s;
        }
        &_picker{
            border-radius: 12rpx 12rpx 0 0;
            background-color: #FFFFFF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            &_header{
                display: flex;
                justify-content: space-between;
                font-size: 28rpx;
                .box1{
                    margin: 39rpx 0 0 32rpx;
                    color: #999999;
                }
                .box2{
                    margin: 39rpx 32rpx 0 0;
                    color: #FF5C2A;
                }
            }
            .scroll_page{
                height: 300rpx;
                &_list{
                    width: 100%;
                    text-align: center;
                    color: #CCCCCC;
                    font-size: 28rpx;
                    margin: 40rpx 0;
                    &_active{
                        height: 112rpx;
                        line-height: 112rpx;
                        border-top: 1rpx solid #EBEBEB;
                        border-bottom:1rpx solid #EBEBEB;
                        color: #222222;
                        font-size: 36rpx;
                    }
                }
            }
        }
        &_picker_active{
            height: 600rpx;
            transition: height linear 0.2s;
        }
        &_picker_off{
            height: 0;
            transition: height linear 0.2s;
            }
    }
    .select_list_active{
        height: 100vh;
        transition: height linear 0.2s;
    }
    .select_list_off{
        height: 0;
        transition: height linear 0.2s;
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