<template>
  <view class="box">
            
      <!--周时间选择区-->
      <view class="timer_packer" v-if="value == 1">
          <view :class="['timer_packer_item',current == -1 ? 'active_color' : '']" @click="pickerMore('more',-1)">
              <text class="markMonth">{{selectweekMore.week ? ('第'+selectweekMore.week+'周') : '更多'}}</text>
              <view class="avter_down"></view>
              <view class="markYear" v-if="selectweekMore.nowMonth != null">{{selectweekMore.nowMonth+'月'}}</view>
          </view>
          <view v-for="(item,index) in (weekmonlist.slice(0,4))" :key="index" :class="['timer_packer_item',current == index ? 'active_color' : '']" @click="pickerTimer(item,index)">
              <text class="markMonth">{{'第'+item.week+'周'}}</text>
              <view class="markYear" v-if="item.nowMonth != null">{{item.nowMonth+'月'}}</view>
          </view>
      </view>

      <!--六个月选择区-->
      <view class="timer_packer" v-else>
          <view :class="['timer_packer_item',currentmon == index ? 'active_color' : '']" v-for="(item,index) in monlist" :key="index" @click="pickerTimermon(item,index)">
              <text class="markMonth">{{item.markMonth + '月'}}</text>
              <view class="markYear">{{item.markYear}}</view>
          </view>
      </view>
      <!-- <u-select v-model="isOpen" mode='single-column' @confirm="enter" @cancel="cancel" :cancel-color="'#999999'" style="background-color:#ffffff !important;" :confirm-color="'#FF5C2A'" :confirm-text="'确定'" :list="list"></u-select> -->
      
      <!--周选择详情弹出层选项-->
      <u-picker mode="selector" v-model="isOpenWeek" :default-selector="defaultweekvalue" :range="weekmonlist" range-key="describe" @confirm="enterweek" @cancel="(()=>{this.isOpenWeek = false;})" :confirm-color="'#FF5C2A'" :cancel-color="'#999999'" :confirm-text="'确定'"></u-picker>
  
  </view>
</template>

<script>
export default {
    props:{
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
    },
    data(){
        return {
            status:0, //切换状态
            isOpen:false, //周月开关
            isOpenWeek:false,
            value:-1, //选择值的确定
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
            defaultweekvalue:[0],
            current:-1,
            currentmon:5,
            selectweekMore:{},

        }
    },
    computed: {
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
            this.selectweekMore = this.weekmonlist[e[0]],this.defaultweekvalue = e;
            uni.$emit('pickerTimermon',this.selectweekMore)
            console.log('this.selectweekMore',this.selectweekMore,2222,e)
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
            this.current = index;
            this.isOpenWeek = !this.isOpenWeek;
        },
    },
}
</script>

<style lang='scss' scoped>
    .box{
        position: relative;
        width:750rpx;
        z-index: 1;
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
    }
</style>