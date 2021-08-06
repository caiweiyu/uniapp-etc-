<template>
  <view class="box">
      <view class="box1">
        {{countTitle}}{{countTime}}
      </view>
      <view class="box2">
          <view class="box2_item">
             <view class="box2_item_left">
               <text class="max_1">兑换项目</text>
               <text class="max1">充值账户</text>
               <text class="max_2">充值金额</text>
             </view>
             <view class="box2_item_right">
               <text class="max_1">{{detail.title}}</text>
               <text class="max1">{{detail.target_phone}}</text>
               <text class="max_2">{{detail.recharge_price}}</text>
             </view>
          </view>
          <view class="box2_item">
              <view class="box2_item_left">
               <text class="max2_1">订单金额</text>
               <text class="max2">优惠减免</text>
               <text class="max2_2">优惠券抵扣</text>
             </view>
             <view class="box2_item_right">
               <text class="max2_1">{{detail.amount}}</text>
               <text class="max2">{{detail.etc_discount}}</text>
               <text class="max2_2">{{detail.coupon_discount}}</text>
             </view>
          </view>
          <view class="box2_item">
              <view class="box2_item_left">
               <text class="max3">实际支付</text>
             </view>
             <view class="box2_item_right">
               <text class="max3">{{detail.amount}}</text>
             </view>
          </view>
          <view class="box2_item" style=" border-bottom:none">
              <view class="box2_item_left">
               <text class="max4">订单编号</text>
               <text class="max4_1">下单时间</text>
             </view>
             <view class="box2_item_right">
               <text class="max4">{{detail.order_id}}</text>
               <text class="max4_1">{{detail.create_time}}</text>
             </view>
          </view>
      </view>
      <view class="box3" v-if="isShow">
          <veiw class="box3_left">
            <text>共计</text>¥
            <text>{{detail.amount}}</text>
            <text>优惠￥{{detail.etc_discount}}</text>
          </veiw>
          <veiw class="box3_right" @click="$debounce(ApiPrepaid)">确认订单</veiw>
      </view>
        <!--客服-->
        <view class="server" @click="toServe">
            <!-- <image src="https://image.etcchebao.com/etc-min/sinopec/serve_tip.png" mode="" /> -->
        </view>
  </view>
</template>

<script>
const app = getApp()
	import * as API from "@/interfaces/sinoepc"
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	import conf from '@/config/conf.js'
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
  import {user} from "@/common/constant"
	export default {
		computed: {
			...mapState({
				token: (state)=> state.user.token
			})
		},
		components:{
			// tolinkServe
		},
		data() {
			return {
				detail: {
					title: "",
					target_phone: "",
					recharge_price: "",
					coupon_discount: "",
					amount : "",
					gettime : "",
					endtime : "",
					order_status : "",
					status : "",
					order_id: "",
					cerate_time : "",
					trade_platform_name: "",
					order_status_name : "",
					trade_id: "",
					sub_order_type:"",
          etc_discount:"",
          order_type:"",
          count_down:""
				},
				order_id: null,
        countTime:'',
        countTitle:"剩余支付时间:",
        timer:null,
        isShow:true,
        curLock: true,//禁止多次支付
			}
		},
		onLoad() {

		},
		onShow() {
	
		},
		methods: {
			/**
			 * 订单详情
			 */
      async getaxios_order_detail(order_id){
          let res = await API.axios_order_detail({
              source_channel:2,
              order_id:order_id
          });
          let {code,msg,data} = res;
          if(code == 0){
              this.detail = data;
              this.countTime =  Math.floor(data.count_down / 60) + "分" + Math.floor(data.count_down % 60) + "秒";
              return this.countTime;
          }
      },
      /**
       * 处理倒计时
       */
      timeCount(){
        let maxtime = this.detail.count_down; 
        let minutes = Math.floor(maxtime / 60);
        let seconds = Math.floor(maxtime % 60);
        if(maxtime >= 0) {
            if(minutes > 0 && seconds > 0){
              seconds -= 1;
              this.detail.count_down -= 1;
               this.countTime =  minutes + "分" + seconds + "秒";
            }else if(seconds == 0 && minutes > 0){
              seconds = 59;
              minutes -= 1;
              this.detail.count_down -= 1;
              this.countTime =  minutes + "分" + seconds + "秒";
            }else if(minutes == 0 && seconds == 0){
              this.countTime =  minutes + "分" + seconds + "秒";
              this.isShow = false; // 关闭确认订单
              clearInterval(this.timer);
            }   
        } 
      },
      /**
       * 去客服
       */
      toServe(){
          uni.navigateTo({
              url: `/pages/webview/main?src=${encodeURIComponent(`${user}/qiyu/index.html?isGps=0`)}`,
          });
      },
      /**
       * 去第三方小程序
       */
			toProgram(){
				let item = {
					jump_type:"2",
					appid:"wx32fe2eb8b2fa221f",
					jump_url:""
				}
				console.log(item)
				this.callback(item)
			},
			callback(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(item, (res)=>{
					
				}, (err)=> {
					
				})
			},
      /**
			 * 调起微信小程序支付
			 */
			onTradePay(data) {
			    let {
			        timeStamp,
			        signType,
			        nonceStr,
			        paySign,
			        package: wxpackage,
			        sucessUrl,
			        failUrl,
			    } = data.prepaid_info;
			    try {
			        //发起支付
			        uni.requestPayment({
			            timeStamp,
			            nonceStr,
			            package: wxpackage, //因为package 是javascript 的关键字，所以不能直接写，编译器会报错
			            signType,
			            paySign,
			            success: (res) => {
			                uni.redirectTo({
			                    url: "/packageA/pages/ytk/ytk_deposit/main?orderid="+data.orderid+"&trade_id="+data.trade_id+"&summary_order_id="+data.summary_order_id
			                });
			            },
			            fail: (res) => {
			                // if (failUrl) {
			                //     uni.redirectTo({
			                //         url: "/pages/test/blue",
			                //     });
			                //     return;
			                // }
			                uni.showToast({
			                    title: "支付失败",
			                    icon: "none"
			                });
			            },
						complete: (res) => {
							this.curLock = true;
						}
			        });
			    } catch (error) {
			        console.log(error);
			    }
			},
      	/**
			 * 下单接口
			 */
			ApiPrepaid() {
				if (!this.curLock) return;
				this.curLock = false;
			    
			},
      /**
			 * 获取微信小程序支付参数
			 */
			apiRepaid(trade_id){
			    API.axios_coupon_order({
			        source_channel:2,
			        trade_mode:3,
			        trade_id:trade_id,
			        openid:this.openid,
			        //token:this.token,
			        //source_channel:2,
			        //sourceChannel:2
			    }).then(res => {
			        let {code, data} = res;
			        if (code == 0) {
			            this.onTradePay(data)
			        }
			    })
			},
		},
    mounted() {
        let {
				  order_id
			  } = this.$root.$mp.query;
        new Promise((resolve,reject)=>{
          resolve(this.getaxios_order_detail(order_id))
        }).then(res=>{
          if(res){
            this.timer = setInterval(this.timeCount.bind(this), 1000);
          }
        })    
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
	}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100vh;
    background-color: #F9F9F9;
    position: relative;
    .box1{
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #FF5C2A;
      font-size: 26rpx;
    }
    .box2{
      // height: 778rpx;
      width: 100%;
      background-color: #ffffff;
      &_item{
        border-bottom: 1rpx solid #E4E4E4;
        width: 710rpx;
        display: flex;
        justify-content: space-between;
        margin-left: 40rpx;
        &_left{
          color: #999999;
          font-size: 32rpx;
          text-align: left;
          width: 40%;
          >text{ display: block; }
          .max_1{ margin: 34rpx 0 0 0; }
          .max_2{ margin: 0 0 49rpx 0; }
          .max1{ margin: 49rpx 0; }
          .max2{ margin: 30rpx 0 37rpx 0;font-size: 28rpx;color: #999999;}
          .max2_1{ margin: 38rpx 0 0 0;font-size: 28rpx;color: #999999;}
          .max2_2{ margin: 0 0 38rpx 0;font-size: 28rpx;color: #999999;}
          .max3{ margin: 39rpx 0 37rpx 0;}
          .max4{ margin: 40rpx 0 30rpx 0;font-size: 28rpx;color: #999999;}
          .max4_1{ margin: 0 0 50rpx 0;font-size: 28rpx;color: #999999;}
        }
        &_right{
          font-size: 32rpx;
          color: #222222;
          text-align: right;
          margin-right: 41rpx;
          width: 60%;
          >text{ display: block; }
          .max_1{ margin: 34rpx 0 0 0; }
          .max_2{ margin: 0 0 49rpx 0; }
          .max1{ margin: 49rpx 0; }
          .max2{ margin: 30rpx 0 37rpx 0;font-size: 28rpx;}
          .max2_1{ margin: 38rpx 0 0 0;font-size: 28rpx;}
          .max2_2{ margin: 0 0 38rpx 0;font-size: 28rpx;}
          .max3{ margin: 39rpx 0 37rpx 0;}
          .max4{ margin: 40rpx 0 30rpx 0;font-size: 28rpx;color: #999999;}
          .max4_1{ margin: 0 0 50rpx 0;font-size: 28rpx;color: #999999;}
        }
      }
    }
    .box3{
      width: 100%;
      height: 152rpx;
      background-color: #ffffff;
      position: fixed;
      display: flex;
      justify-content: space-between;
      z-index: 1;
      bottom: 0;
      &_left{
        display: inline-block;
        color: #FF5C2A;
        font-size: 24rpx;
        margin: 31rpx 0 0 44rpx;
        >text:nth-child(1){
          font-size: 28rpx;
          color: #333333;
          font-weight: bold;
          margin-right: 7rpx;
        }
        >text:nth-child(2){
          font-size: 44rpx;
          font-weight: bold;
        }
        >text:nth-child(3){
          margin-left: 11rpx;
          color: #666666;
          font-size: 24rpx;
        }
      }
      &_right{
        display: inline-block;
        background-color: #FF5C2A;
        width: 220rpx;
        height: 78rpx;
        line-height: 78rpx;
        border-radius: 120rpx;
        text-align: center;
        color: #ffffff;
        font-size: 32rpx;
        margin: 20rpx 20rpx 0 0;
      }
    }
      .server{
          width: 120rpx;
          height: 120rpx;
          // background-color: #ffffff;
          // z-index: 9999;
          position: fixed;
          right: 13rpx;
          bottom: 371rpx;
          background:url('https://image.etcchebao.com/etc-min/sinopec/serve_tip.png') no-repeat;
          background-size: 100% 100%;
          border-radius: 50%;
          box-shadow: rgba($color: #000000, $alpha: 0.1);
        }
  }
</style>