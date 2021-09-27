<template>
  <view class="box" :style="{height: topHeight.height,background: bannerPic,backgroundSize: '100% 100%'}">
      
      <!--内容区域-->
      <view class="box_content" :style="{top:'26rpx'}" @click.stop="toytkList">
          <view class="card_title"><text class="text">{{ytkCard}}</text><image class="image" src="https://image.etcchebao.com/etc-min/bill_all/change_icon1.png" mode="" /></view>
          <text class="card_num">{{cardusenum}}</text>
      </view>
      
      <!--周时间选择区-->
      <view class="timer_packer" v-if="isweekmon == 1">
          <view :class="['timer_packer_item',selectweekindex == -1 ? 'active_color' : '']" @click="pickerMore(-1)">
              <text class="markMonth">{{selectweekMore.week ? ('第'+selectweekMore.week+'周') : '更多'}}</text>
              <view class="avter_down"></view>
              <view class="markYear" v-if="selectweekMore.nowMonth != null">{{selectweekMore.nowMonth+'月'}}</view>
          </view>
          <view v-for="(item,index) in ((weekmonlist.slice(0,4).reverse()))" :key="index" :class="['timer_packer_item',selectweekindex == index ? 'active_color' : '']" @click="pickerTimer(item,index)">
              <text class="markMonth">{{'第'+item.week+'周'}}</text>
              <view class="markYear" v-if="item.nowMonth != null">{{item.nowMonth+'月'}}</view>
          </view>
      </view>

      <!--六个月选择区-->
      <view class="timer_packer" v-else>
          <view :class="['timer_packer_item',selectmonindex == index ? 'active_color' : '']" v-for="(item,index) in monlist" :key="index" @click="pickerTimermoner(item,index)">
              <text class="markMonth">{{item.markMonth + '月'}}</text>
              <view class="markYear">{{item.markYear}}</view>
          </view>
      </view>
      <!-- <u-select v-model="isOpen" mode='single-column' @confirm="enter" @cancel="cancel" :cancel-color="'#999999'" style="background-color:#ffffff !important;" :confirm-color="'#FF5C2A'" :confirm-text="'确定'" :list="list"></u-select> -->
      
      <!--周选择详情弹出层选项-->
      <u-picker mode="selector" v-model="isOpenWeek" :default-selector="defaultweekvalue" :range="weekmonlist" range-key="describe" @confirm="enterweek" @cancel="(()=>{this.isOpenWeek = false;})" :confirm-color="'#FF5C2A'" :cancel-color="'#999999'" :confirm-text="'确定'"></u-picker>
      
      <!-- <view :class="['select_list',isOpenWeeklist == true ? 'select_list_active' : 'select_list_off']" @touchmove.stop="()=>{return true}">
          <view @click="cancelSelect" :class="['select_list_bg',isOpenWeeklist == true ? 'select_list_bg_active' : 'select_list_bg_off']"></view>
          <view :class="['select_list_picker',isOpenWeeklist == true ? 'select_list_picker_active':'select_list_picker_off']">
              <view class="select_list_picker_header" v-if="isOpenWeeklist">
                  <view class="box1" @click="cancelSelect">取消</view>
                  <view class="box2" @click="enterweek">确定</view>
              </view>
              <scroll-view :scroll-y="true" :class="['scroll_page']" v-if="isOpenWeeklist" :scroll-into-view="scrollRight" :scroll-with-animation="true">
                  <view v-for="(item,index) in weekmonlist" :id="'into_right'+index" :key="index" :class="['scroll_page_list',weekIndex==index?'scroll_page_list_active':'']" @click="handClick(item,index)">{{item.describe}}</view>
              </scroll-view>
          </view>
      </view> -->
  </view>
</template>

<script>
import { mapState } from "vuex"
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
         * 周
         */
        weekmonlist:{
            type:Array,
            default:[]
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
        }
    },
    data(){
        return{
            status:0, //切换状态
            isOpen:false, //周月开关
            isOpenWeek:false,
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
            defaultweekvalue:[0],
            selectweekMore:{},
            type_card:2,
            banner:[
                'https://image.etcchebao.com/etc-min/bill_all/banner1_2.png',  //type_card=2
                'https://image.etcchebao.com/etc-min/bill_all/banner2_2.png'  //type_card=1
            ],
            weekIndex:-1,
            scrollRight:""
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
            isOpenWeeklist:(state) => state.home.new_bill_all.isOpenWeeklist
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
            if(this.isOpenWeek){
               return true
            }
        },
        /**
         * 判断头部背景色
         */
        bannerPic(){
            return `url(${this.type_card==2 ? this.banner[0] : this.banner[1]})no-repeat;`
        }
    },
    watch:{
        isOpenModel(o,n){
          o==true ? this.$emit("changZindex",-1) : this.$emit("changZindex",1)
        }
    },
    methods: {

        /**
         * 周确定选择
         */
        enterweek(e){
            // this.$store.commit("home/mt_new_bill_all_en", true);
            this.selectweekMore = this.weekmonlist[e[0]],this.defaultweekvalue = e;
            this.$store.commit("home/mt_new_bill_all_selectweek", this.selectweekMore);
            this.$emit("selectWeekBill",this.selectweekMore)
            this.$emit("changZindex",1)
            console.log('this.selectweekMore',this.selectweekMore,2222,e)
            // this.$store.commit("home/mt_new_bill_all_isOpenWeeklist", false);
        },
        /**
         * 取消周选中
         */
        cancelSelect(){
            this.$store.commit("home/mt_new_bill_all_en", true);
            this.$store.commit("home/mt_new_bill_all_isOpenWeeklist", false);
            this.$emit("changZindex",1)
        },
        /**
         * 选择月tab
         */
        pickerTimermoner(item,index){
            this.$store.commit("home/mt_new_bill_all_selectmonindex", index);
            this.$store.commit("home/mt_new_bill_all_selectmon", item);
            this.$emit("selectMonBill",item.month)
            console.log('月',item);
        },
        
        /**
         * 选择周tab
         */
        pickerTimer(item,index){
            this.$store.commit("home/mt_new_bill_all_selectweekindex", index);
            this.$store.commit("home/mt_new_bill_all_selectweek", item);
            this.$emit("selectWeekBill",item)
            console.log('周',item,index)
        },

        /**
         * 更多
         */
        pickerMore(index){
            // this.$store.commit("home/mt_new_bill_all_en", false);
            this.$store.commit("home/mt_new_bill_all_selectweekindex", index);
            this.isOpenWeek = !this.isOpenWeek;
            // this.$store.commit("home/mt_new_bill_all_isOpenWeeklist", true);
            this.$emit("changZindex",-1)
        },

        /**
         * 去粤通卡列表
         */
        toytkList(){
            this.$store.commit("home/mt_new_bill_all_en", false);
            uni.navigateTo({
                 url: '/packageA/pages/ytk/ytk_list/main?comeForm=2'
            });
        },
        /***
         * 点击周
         */
        handClick(item,index){
            this.weekIndex = index;
            this.selectweekMore = item;
            this.$nextTick(()=>{
               this.scrollRight = 'into_right'+ index
            });
            this.scrollRight = '';
            console.log(item)
        }

    },
    destroyed() {
        uni.$off("chooseCard")
    },
    mounted() {
        uni.$on("chooseCard",(data)=>{
            this.type_card = data.type_card; //判断卡类型
            let val = this.type_card == 2 ? '#28BC93' : '#F07365'; //判断header颜色
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
                    font-weight: bold;          
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
        // .select_list{
        //     width:750rpx;
        //     position: fixed;
        //     top: 0;
        //     z-index: 999;
        //     &_bg{
                
        //         opacity: .7;
        //         background-color: #000000;
        //     }
        //     &_bg_active{
        //         height: calc(100vh - 600rpx);
        //         transition: height linear 0.2s;
        //     }
        //     &_bg_off{
        //         height: 0;
        //         transition: height linear 0.2s;
        //     }
        //     &_picker{
        //         border-radius: 12rpx 12rpx 0 0;
        //         background-color: #FFFFFF;
        //         &_header{
        //             display: flex;
        //             justify-content: space-between;
        //             font-size: 28rpx;
        //             .box1{
        //                 margin: 39rpx 0 0 32rpx;
        //                 color: #999999;
        //             }
        //             .box2{
        //                 margin: 39rpx 32rpx 0 0;
        //                 color: #FF5C2A;
        //             }
        //         }
        //         .scroll_page{
        //             height: 480rpx;
        //             margin-top: 50rpx;
        //             &_list{
        //                 width: 100%;
        //                 text-align: center;
        //                 color: #CCCCCC;
        //                 font-size: 28rpx;
        //                 margin: 40rpx 0;
        //                 &_active{
        //                     height: 112rpx;
        //                     line-height: 112rpx;
        //                     border-top: 1rpx solid #EBEBEB;
        //                     border-bottom:1rpx solid #EBEBEB;
        //                     color: #222222;
        //                     font-size: 36rpx;
        //                 }
        //             }
        //         }
        //     }
        //     &_picker_active{
        //         height: 600rpx;
        //         transition: height linear 0.2s;
        //     }
        //     &_picker_off{
        //         height: 0;
        //         transition: height linear 0.2s;
        //      }
        // }
        // .select_list_active{
        //     height: 100vh;
        //     transition: height linear 0.2s;
        // }
        // .select_list_off{
        //     height: 0;
        //     transition: height linear 0.2s;
        // }
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