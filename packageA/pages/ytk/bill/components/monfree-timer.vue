<template>
    <view>
        <!--本月消费、同行次数-->
        <view class="container">
            <view class="box">
              <block v-if="isweekmon==1">
                  <view class="box1">
                      ¥<text class="box1_text min1">{{cardList.consumeAmount}}</text>
                      <view class="box1_view">本周消费{{weekselectdetail}}</view>
                    </view>
                    <view class="box1">
                      <text class="box1_text">{{cardList.consumeTimes}}</text>
                      <view class="box1_view">通行次数</view>
                  </view>
              </block>
              <block v-else>
                  <view class="box1">
                    ¥<text class="box1_text min1">{{monsum}}</text>
                    <view class="box1_view">本月消费</view>
                  </view>
                  <view class="box1">
                    <text class="box1_text">{{monthsumBillsList[selectmonindex].num}}</text>
                    <view class="box1_view">通行次数</view>
                  </view>
              </block>
            </view>
        </view>
        <!--可滑动 自动滚区-->
        <block v-if="getoperalist.location==4 && isweekmon==1">
          <view class="boxContainer" v-if="getoperalist.type_1.length > 0">
              <swiper class="swiper" :previous-margin="previousmargin" :next-margin="nextmargin" :indicator-dots="false" :autoplay="true" :interval="4000" :duration="500" :circular="true" @change="bindchange">
                  <swiper-item class="swiper-item" v-for="(item,index) in getoperalist.type_1" :key="index" @click.stop="openArea(item)">
                      <image :src="item.pic_url" class="swiper-item-view" mode="" />
                  </swiper-item>
              </swiper>
              <view class="dots">
                  <view :class="['box', swiper_current == index ? 'active' : '']" v-for="(item, index) in getoperalist.type_1"
                    :key="index"></view>
              </view>
          </view>
        </block>
        <block v-if="getoperalist.location==3 && isweekmon==0">
            <view class="boxContainer" v-if="getoperalist.type_3.length > 0">
              <swiper class="swiper" :previous-margin="previousmargin" :next-margin="nextmargin" :indicator-dots="false" :autoplay="true" :interval="4000" :duration="500" :circular="true" @change="bindchange">
                  <swiper-item class="swiper-item" v-for="(item,index) in getoperalist.type_3" :key="index" @click.stop="openArea(item)">
                      <image :src="item.pic_url" class="swiper-item-view" mode="" />
                  </swiper-item>
              </swiper>
              <view class="dots">
                  <view :class="['box', swiper_current == index ? 'active' : '']" v-for="(item, index) in getoperalist.type_3"
                    :key="index"></view>
              </view>
            </view>
            <view class="swiper" v-else-if="getoperalist.type_2.length > 0">
              <view class="swiper-item swiper-ac">
                  <view class="box2">
                      <block>¥
                        <text class="box2_1">{{amountDeal}}</text>
                      </block>
                      <text class="box2_2">{{getoperalist.type_2[0].extend.explain_tips}}</text>
                      <view class="box2_3">{{getoperalist.type_2[0].title}}</view>
                  </view>
                  <view class="box3" @click.stop="openArea2(getoperalist.type_2[0].extend)">{{getoperalist.type_2[0].extend.jump_tips}}</view>
              </view>
            </view>
        </block>
    </view>
</template>

<script>
import miniScript from "@/common/miniScript"
const  miniapp = miniScript.getInstance()
import { mapState } from "vuex"
import { eventMonitor } from "@/common/utils"
export default {
    props:{
        getoperalist:{
          type:Object,
          default:{}
        },
        cardList:{
          type:Object,
          default:{}
        }
    },
    data(){
      return {
        details:{
          num:0,
          sum:0
        },
        swiper_current:0,
        previousmargin:"14rpx",
				nextmargin:"14rpx",
      }
    },
    watch:{
      cardList(o,n){
        console.log(o,666)
      }
    },
    computed: {
          ...mapState({
                isweekmon: (state) => state.home.new_bill_all.isweekmon,
                selectweek: (state) => state.home.new_bill_all.selectweek,
                selectmon: (state) => state.home.new_bill_all.selectmon,
                selectweekindex: (state) => state.home.new_bill_all.selectweekindex,
                selectmonindex: (state) => state.home.new_bill_all.selectmonindex,
                monthsumBillsList: (state) => state.home.new_bill_all.monthsumBillsList,
                discount_amount: (state) => state.home.new_bill_all.discount_amount,
                weeklist:(state) => state.home.new_bill_all.weeklist
          }),
          /**
           * 计算月消费额
           */
          monsum(){
            if(this.monthsumBillsList.length > 0){
                return Number(this.monthsumBillsList[this.selectmonindex].sum/100).toFixed(2)
            }else{
                return 0
            }
          },
          /**
           * 计算周详细时间
           */
          weekselectdetail(){
            if(this.weeklist.length > 0 && this.selectweekindex > -1){
                let week_arr = this.weeklist.slice(0,4).reverse();
                return '('+week_arr[this.selectweekindex].begin+"-"+week_arr[this.selectweekindex].end+')'
            }else{
                return ''
            }
          },
          /**
           * 格式化路费返还 0.00
           */
          amountDeal(){
            if(this.discount_amount > 0){
              return Number(this.discount_amount).toFixed(2)
            }else{
              return '0.00'
            }
          }
    },
    methods: {
      /**
       * 监听轮播点
       */
      bindchange(e){
				this.swiper_current = e.detail.current;
			},
      openArea(item){ 
        this.isweekmon == 1 ? eventMonitor('YTKWeeklyBill_Operation_WeChat_Other_416_Button_click',2) : eventMonitor('YTKMonthlyBill_List_WeChat_Other_415_Check_click',2)
        if (typeof(item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item.subs_template_id);
					miniapp.subscribe(arr, (res)=>{
						this.callback(item);
					}, (err)=> {
						this.callback(item);
					})
				} else {
					// 直接跳转
					this.callback(item);
				}
        console.log(item)
      },
      callback(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(item, (res)=>{
					
				}, (err)=> {
					
				})
			},
      openArea2(item){
        if(this.isweekmon == 0){
            eventMonitor('YTKMonthlyBill_List_WeChat_Other_415_Link_click',2)
        };
        if (typeof(item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item.subs_template_id);
					miniapp.subscribe(arr, (res)=>{
						this.callback(item);
					}, (err)=> {
						this.callback(item);
					})
				} else {
					// 直接跳转
					this.callback(item);
				}
      }
    },
}
</script>

<style scoped lang="scss">
  .container{
      width: 750rpx;
      // height: 207rpx;
      height: 181rpx;
      padding-top: 30rpx;
      background-color: #F6F6F6;
      .box{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin:auto;
        width: 690rpx;
        height: 150rpx;
        //@errorpadding: 30rpx 30rpx 20rpx 30rpx;
        border-radius: 16rpx;
        background-color: #FFFFFF;
        .box1{
            width: 345rpx;
            text-align: center;
            &_text{
              color: #222222;
              font-size: 48rpx;
              font-family: 'etccb-font';
            }
            .min1{
              margin-left: 5rpx;
            }
            &_view{
              color: #999999;
              font-size: 24rpx;
            }
        }
      }
  }
  .boxContainer{
    position: relative;
    .dots {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			position: absolute;
			left: 50%;
			bottom: 10rpx;
			transform: translateX(-50%);
			.box {
				margin: 0 0 0 8rpx;
				width: 8rpx;
				height: 8rpx;
				background-color: rgba(255,255,255,0.5);
				border-radius: 12rpx;
				&.box:first-child {
					margin: 0;
				}
				&.active {
					background-color: #FF5C2A !important;
					width: 16rpx !important;
					transition: width linear 0.2s;
				}
			}
		}
  }
  .swiper{
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 108rpx;
    margin-top: 20rpx;
    background-color: #F6F6F6;
    .swiper-item{
      width: 750rpx;
      .swiper-item-view{
          position: absolute;
          left: 50%;
          transform: translateX(-50%) !important;
          width: 690rpx !important;
          height: 108rpx !important;
          border-radius: 16rpx;
      }
    }
    .swiper-ac{
      height: 108rpx;
      margin: auto;
      align-items: center;
      width: 690rpx;
      position: relative;
      background:url("https://image.etcchebao.com/etc-min/bill_all/yunying.png")no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      .box2{
        color: #8E523F;
        font-size: 24rpx;
        margin: 0 0 10rpx 29rpx;
        .box2_1{
            font-weight: bold;
            font-size: 40rpx;
            margin: 0 12rpx 0 5rpx;
            font-family: 'etccb-font';
        }
        .box2_2{
            font-size: 26rpx;
            font-weight: bold;
        }
        .box2_3{
          font-size: 24rpx;
          font-weight: bold;
          opacity: .6;
        }
      }
      .box3{
        margin-right: 20rpx;
        width: 144rpx;
        height: 50rpx;
        line-height: 48rpx;
        text-align: center;
        border-radius: 120rpx;
        border: 2rpx solid #8E523F;
        font-weight: bold;
        font-size: 24rpx;
        color: #8E523F;
      }
    }
  }
</style>