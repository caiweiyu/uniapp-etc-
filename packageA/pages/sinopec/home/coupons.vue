<template>
  <view class="box">
      <image class="image" src="https://image.etcchebao.com/etc-min/sinopec/banner.png" mode="" @click="toProgram" />
      <scroll-view :scroll-y="true" v-if="loading && list.length > 0" @scrolltolower="dealScrollBottom" class="card-scroll">
          <view class="title">
                <view :class="['box_container']" v-for="(item,index) in list" :key="index" @click="toDetail(item.order_id)">
                    <image src="https://image.etcchebao.com/etc-min/sinopec/quan_bg1.png" mode="" v-if="nowDate > new Date(item.endtime).getTime()" />
                    <image src="https://image.etcchebao.com/etc-min/sinopec/quan_bg2.png" mode="" v-else />
                    <text class="title">{{item.title}}</text>
                    <view class="view">
                        <view><text>充值面额</text>{{item.recharge_price}}元</view>
                        <view class="view2"><text>开始时间</text><block v-if="item.starttime!=null">{{item.starttime.split(' ')[0]}}</block></view>
                        <view><text>结束时间</text><block v-if="item.endtime!=null">{{item.endtime.split(' ')[0]}}</block></view>
                    </view>
                </view>
          </view>
      </scroll-view>
      <view class="no_card" v-else-if="loading && list.length == 0">
          <image src="https://image.etcchebao.com/etc-min/order/no_card.png"></image>
          <text>暂无可用于加油的优惠券</text>
      </view>
      <view v-if="!loading"
				:style="[
					{margin: '0 auto'},
					{padding: '300rpx 0 0 0'},
					{width: '50rpx'}
				]"
			>
			<u-loading mode="circle" size="50" color="#FF5C2A"></u-loading>
	 </view>
  </view>
</template>

<script>
const app = getApp()
import * as API from "@/interfaces/sinoepc";
import miniScript from "@/common/miniScript"
const  miniapp = miniScript.getInstance()
import { mapState } from "vuex"
export default {
    data(){
        return {
            list:[],
            nowDate:new Date().getTime(),
            page:1,
            page_size:10,
            loading:false,
            page_total:0,
            total:0
        }
    },
    methods: {
       async getAxios_coupon_list(page,page_size){
        let res = await API.axios_coupon_list({
            page:page,
            page_size:page_size,
            source_channel:2
        });
        let {code,msg,data} = res;
        if(code == 0){
          this.page_total = data.page_info.page_total;
          this.total = data.page_info.total;
          this.loading = true;
          if(data.list.length > 0){
              for(let i=0;i<data.list.length;i++){
                  this.list.push(data.list[i]);
              }
          }
        }
      },
      dealScrollBottom(){
          let len = this.list.length;
          if(len >= this.total){
              return;
          }
          this.page+=1;
          this.getAxios_coupon_list(this.page,this.page_size)
      },
      toDetail(item){
          console.log(item,'--item')
          uni.navigateTo({
               url: `/packageA/pages/sinopec/home/pay_detail?order_id=${item}`
          })
      },
      toProgram(){
          let item = {
              jump_type:"2",
              appid:"wx32fe2eb8b2fa221f",
              jump_url:""
          }
        // 消息订阅
        let arr = ['R7O-YtXiergkR4PciV4usdYfal7RDI92_svZWBVFh04',
                    'P0odhvpFTLEgqdCO68vWvJAEI-8vqJsPMCk9v3wUVjc',
                    'Rx38boJIko8vaMnzFygTSQHaJrUhu1NjLFGGlp2FUMM'];
        miniapp.subscribe(arr, (res)=>{
            this.callback(item);
        }, (err)=> {
            this.callback(item);
        })

      },
      callback(item) {
        // 跳转page || miniProgram
        miniapp.miniProgramRouter(item, (res)=>{
            
        }, (err)=> {
            
        })
     },
    },
    onShow(){
		this.$store.dispatch("home/ac_share_info",10);//分享配置
        this.$token(()=>{
            this.getAxios_coupon_list(this.page,this.page_size)
        })
    },
    mounted(){
        this.getAxios_coupon_list(this.page,this.page_size)
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
        height: 100vh;
        width: 100%;
        overflow: hidden;
        background-color: #F4F4F4;
        .card-scroll{
            position: relative;
			height:100vh;
            // padding-top: 140rpx;
			background-color: #F9F9F9; 
            .title{
                width: 100%;
                height: 100%;
                margin-bottom: 140rpx;
                >view:last-child{
                    margin-bottom: 24rpx;
                }
                .box_container{
                    width: 702rpx;
                    height: 298rpx;
                    margin: auto;
                    margin-top: 24rpx;
                    position: relative;
                    .title{
                        position: absolute;
                        top: 18rpx;
                        left: 47rpx;
                        font-size: 30rpx;
                        color: #222222;
                        font-weight: bold;
                    }
                    .view{
                        position: absolute;
                        left: 47rpx;
                        top: 102rpx;
                        display: flex;
                        flex-direction: column;
                        font-size: 30rpx;
                        view{
                            color: #222222;
                        }
                        text{
                            color: #666666;
                            margin-right: 33rpx;
                        }
                        .view2{
                            margin: 26rpx 0 25rpx 0;
                        }
                    }
                    image{
                        width: 702rpx;
                        height: 298rpx;
                        position:absolute;
                    }
                }
            }

        }
        .image{
            width: 750rpx;
            height: 140rpx;
            // position: fixed;
            // z-index: 1;
            // top: 0;
        }     
        .no_card{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            >image{
                width: 400rpx;
                height: 300rpx;
            }
            >text{
                display: block;
                color: #999999;
                text-align: center;
                font-size: 28rpx;
            }
		}
    }
</style>