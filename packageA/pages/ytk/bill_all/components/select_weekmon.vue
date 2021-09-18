<template>
  <view class="box">

      <!--顶部周、月账单选项-->
      <view :class="['box_title']" @click="openTarget" :style="{top:tabHeight+btnBoundtop+'rpx',height:menu.height*2+'rpx',lineHeight:menu.height*2+'rpx'}">
          <text class="dirtctionTitle">{{status == 1 ? list[1].cateName : list[0].cateName}}</text>
          <view :class="[isOpen ? 'dirtctionAvterafter' : 'dirtctionAvter']"></view>
      </view>

      <!--内容区域-->
      <view class="box_content" :style="{top:(tabBoundheight+40)+'rpx'}">
          <view class="card_title"><text class="text">{{cardList.plateNum}}</text><image class="image" src="https://image.etcchebao.com/etc-min/bill_all/change_icon1.png" mode="" /></view>
          <text class="card_num">{{cardList.shareCardNum}}</text>
      </view>

      <!--周时间选择区-->
      <view class="timer_packer" v-if="value == 1">
          <view :class="['timer_packer_item',current == -1 ? 'active_color' : '']" @click="pickerMore('more',-1)">
              <text class="markMonth">{{selectweekMore.week ? ('第'+selectweekMore.week+'周') : '更多'}}</text>
              <view class="markYear" v-if="selectweekMore.nowMonth != null">{{selectweekMore.nowMonth+'月'}}</view>
              <view class="avter_down"></view>
          </view>
          <view v-for="(item,index) in (weekmonlist.slice(0,4))" :key="index" :class="['timer_packer_item',current == index ? 'active_color' : '']" @click="pickerTimer(item,index)">
              <text class="markMonth">{{'第'+item.week+'周'}}</text>
              <view class="markYear" v-if="item.nowMonth != null">{{item.nowMonth+'月'}}</view>
          </view>
      </view>

      <!--6个月选择区-->
      <view class="timer_packer" v-else>
          <view :class="['timer_packer_item',currentmon == index ? 'active_color' : '']" v-for="(item,index) in monlist" :key="index" @click="pickerTimermon(item,index)">
              <text class="markMonth">{{item.markMonth + '月'}}</text>
              <view class="markYear">{{item.markYear}}</view>
          </view>
      </view>

      <!--周、月弹出层选项-->
      <u-picker mode="selector" v-model="isOpen" :default-selector="defaultvalue" :range="list" range-key="cateName" @confirm="enter" @cancel="cancel" :confirm-color="'#FF5C2A'" :cancel-color="'#999999'" :confirm-text="'确定'"></u-picker>
      <!-- <u-select v-model="isOpen" mode='single-column' @confirm="enter" @cancel="cancel" :cancel-color="'#999999'" style="background-color:#ffffff !important;" :confirm-color="'#FF5C2A'" :confirm-text="'确定'" :list="list"></u-select> -->
      
      <!--周选择详情弹出层选项-->
      <u-picker mode="selector" v-model="isOpenWeek" :default-selector="defaultweekvalue" :range="weekmonlist" range-key="describe" @confirm="enterweek" @cancel="(()=>{this.isOpenWeek = false;})" :confirm-color="'#FF5C2A'" :cancel-color="'#999999'" :confirm-text="'确定'"></u-picker>
  
  </view>
</template>

<script>
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
            default:[
                {
                    cateName: '12月',
                    id: 1
                },
                {
                    cateName: '1月',
                    id: 2
                },
                {
                    cateName: '2月',
                    id: 3
                },
                {
                    cateName: '3月',
                    id: 4
                },
                 {
                    cateName: '4月',
                    id: 5
                },
                {
                    cateName: '5月',
                    id: 6
                }
            ]
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
            value:-1, //选择值的确定
            btnBoundtop:uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
            defaultvalue:[0],
            defaultweekvalue:[0],
            current:-1,
            currentmon:5,
            selectweekMore:{}
        }
    },
    computed: {
        /**
         * 计算高度（胶囊顶部距状态栏高度距离 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        },
    },
    methods: {

        /**
         * 头部下拉开关
         */
        openTarget(){
            this.isOpen = !this.isOpen;
        },

        /**
         * 确认
         */
        enter(e){
            this.isOpen = false;
            this.value = e[0],this.defaultvalue = e;
            this.value == 1 ? this.status = 1 : this.status = 0;
        },

        /**
         * 周确定选择
         */
        enterweek(e){
            this.selectweekMore = this.weekmonlist[e[0]];
            console.log('this.selectweekMore',this.selectweekMore)
        },

        /**
         * 取消
         */
        cancel(){
            this.isOpen = false;
        },

        /**
         * 选择周tab
         */
        pickerTimer(item,index){
            this.current = index;
            uni.$emit('pickerTimermon',item)
        },

        /**
         * 选择月tab
         */
        pickerTimermon(item,index){
            this.currentmon = index;
            uni.$emit('pickerTimermon',item)
        },

        /**
         * 更多
         */
        pickerMore(item,index){
            this.isOpenWeek = !this.isOpenWeek;
            this.current = index;
        }

    },
    created() {
        
    },
    mounted() {
        
    },
}
</script>

<style scoped lang="scss">
    .box{
        position: relative;
        background: url("https://image.etcchebao.com/etc-min/bill_all/banner1.png")no-repeat;
        background-size: 100% 100%;
        height: 406rpx;
        width: 750rpx;
        z-index: 1;
        &_title{
            position: fixed;
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
                width: 12rpx;
                height: 6rpx;
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
</style>