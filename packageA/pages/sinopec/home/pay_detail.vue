<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="content">

		<view class="top">
			<view class="box">实际支付(元)</view>
			<view class="box">{{detail.amount }}</view>
			<view class="box">{{detail.order_status_name}}</view>
		</view>
        
        <view class="main1">
			<view class="box">
				<view class="minbox"></view>
				<view class="minbox minblack minblacks">电子券需在有效期进行使用，逾期则作废</view>
			</view>
		</view>

		<view class="main max max1">
			<view class="box">
				<view class="minbox">兑换项目</view>
				<view class="minbox minblack">
					<view class="minbox minblack">{{detail.title}}</view>
				</view>
			</view>
			<view class="box">
				<view class="minbox">充值账户</view>
				<view class="minbox minblack">{{detail.target_phone}}</view>
			</view>
            <view class="box">
				<view class="minbox">充值金额</view>
				<view class="minbox minblack">{{detail.recharge_price }}</view>
			</view>
            <view class="box">
				<view class="minbox">开始时间</view>
				<view class="minbox minblack">{{detail.gettime || "" }}</view>
			</view>
            <view class="box">
				<view class="minbox">结束时间</view>
				<view class="minbox minblack">{{detail.endtime || "" }}</view>
			</view>
		</view>
        <view class="line"></view>
		<view class="main">
			<view class="box">
				<view class="minbox">订单金额</view>
				<view class="minbox minblack">￥{{Number(detail.amount ).toFixed(2)}}</view>
			</view>
			<view class="box">
				<view class="minbox">优惠减免</view>
				<view class="minbox minblack">-￥{{Number(detail.etc_discount).toFixed(2)}}</view>
			</view>
			<view class="box">
				<view class="minbox">优惠券抵扣</view>
				<view class="minbox minblack">-￥{{Number(detail.coupon_discount ).toFixed(2)}}</view>
			</view>
		</view>

		<view class="main max">
			<view class="box">
				<view class="minbox minblack">实际支付</view>
				<view class="minbox minblack">￥{{Number(detail.amount ).toFixed(2)}}</view>
			</view>
		</view>

		<view class="main none-boder">
			<view class="box">
				<view class="minbox">订单编号</view>
				<view class="minbox">
					<text :user-select="true">{{detail.order_id}}</text>
				</view>
			</view>
			<view class="box">
				<view class="minbox">下单时间</view>
				<view class="minbox">{{detail.create_time}}</view>
			</view>
			<view class="box">
				<view class="minbox">支付方式</view>
				<view class="minbox">{{detail.trade_platform_name}}</view>
			</view>
		</view>
		<view style="background-color:#F4F4F4;height:197rpx;"></view>
        <!-- <view class="line1"></view> -->
        <view class="box_bottom">
            <view class="box_bottom_item">
                <view class="box_bottom_item_left">在“加油广东”APP和“大家来加油”小程序扫码使用优惠券</view>
                <view class="box_bottom_item_right" @click="toProgram">去使用</view>
            </view>
        </view>
        <!--客服-->
        <view class="server" @click="toServe">
            <!-- <image src="https://image.etcchebao.com/etc-min/sinopec/serve_tip.png" mode="" /> -->
        </view>
		<!-- <view class="btn-group" v-if="isBlock && detail.order_status_id == 0">
			<view class="ant-button" @click="$debounce(toRefund)">申请退款</view>
			<view class="ant-button" @click="$debounce(toBule)">继续写卡</view>
		</view>

		<view class="btn-group" v-if="isBlock && (detail.order_status_id==13 || detail.order_status_id==15 || detail.order_status_id == 19)">
			<view class="ant-button" @click="$debounce(toProcess)">退款进度</view>
		</view> -->

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
			}
		},
		onLoad() {

		},
		onShow() {
			this.$store.dispatch("home/ac_share_info",10);//分享配置
			this.$token(()=>{
				let {
					order_id
				} = this.$root.$mp.query;
				this.getaxios_order_detail(order_id)
			})	
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
                    console.log(this.detail)
                }
            },
            toServe(){
                uni.navigateTo({
                    url: `/pages/webview/main?src=${encodeURIComponent(`${user}/qiyu/index.html?isGps=0`)}`,
                });
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
        mounted() {
            let {
				order_id
			} = this.$root.$mp.query;
            this.getaxios_order_detail(order_id)
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
	.content {
		// padding: 0 0 150rpx 0;
		.top {
			width: 100%;
			height: 185rpx;
			background: url('https://image.etcchebao.com/etc-min/sinopec/banner_tip.png') no-repeat;
            background-size: 100% 100%;
			position: relative;
			overflow: hidden;
			.box:nth-child(1) {
				margin: 42rpx 0 0 40rpx;
				font-size: 28rpx;
				color: #666;
			}
			.box:nth-child(2) {
				margin: 0rpx 0rpx 0rpx 42rpx;
				font-size: 60rpx;
				color: #222222;
			}
			.box:nth-child(3) {
				position: absolute;
				right: 40rpx;
				bottom: 42rpx;
				font-size: 30rpx;
				color: #FF5C2A;
                font-weight: bold;
			}
		}
		.main {
			margin: 33rpx 28rpx 0 28rpx;
			padding: 0 0 40rpx 0;
			border-bottom: 1rpx solid #EBEBEB;
			font-size: 28rpx;
			.box {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				margin: 31rpx 0 0 0;
				.minbox {
					color: #999999;
				}
				.minblack {
					color: #222222;
				}
			}
			.box:first-child {
				margin-top: 0;
			}
		}
        .line{
            width: 100%;
            height: 20rpx;
            background-color: #F4F4F4;
        }
        .line1{
            width: 100%;
            height: 32rpx;
            background-color: #F4F4F4;
        }
        .main1{
            margin: 24rpx 28rpx 0 28rpx;
			padding: 0 0 24rpx 0;
			border-bottom: 1rpx solid #EBEBEB;
            .minblacks{
                font-size: 26.02rpx;
                color: #999999;
                text-align: right;
            }
        }
        .box_bottom{
            height: 197rpx;
            width: 100%;
            background-color: #F4F4F4;
			position: fixed;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
            &_item{
                display: flex;
                margin: 32rpx auto;
                width: 702rpx;
                height: 120rpx;
                background-color: #ffffff;
                justify-content: space-between;
                border-radius: 12rpx;
                &_left{
                    color: #229CF4;
                    font-size:28rpx;
                    display: inline-block;
                    margin: 28rpx 28rpx 29rpx 25rpx;
                }
                &_right{
                    width: 240rpx;
                    height: 80rpx;
                    margin: 20rpx 20rpx 0 0;
                    line-height: 80rpx;
                    text-align: center;
                    background-color: #229CF4;
                    color: #ffffff;
                    display: inline-block;
                    border-radius: 120rpx;
                }
            }
        }
		.max {
			font-size: 32rpx;
		}
        .max1{
            border-bottom: none;
        }
		.none-boder {
			border: none;
			position: relative;
            padding-bottom: 32rpx;
		}
		.btn-group {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 130rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			text-align: center;
			background-color: #FFFFFF;
			.ant-button {
				// margin: 0 0 0 25rpx;
				margin:auto;
				background: none;
				border: 2rpx solid#FF5C2A;
				color: #FF5C2A;
				border-radius: 100rpx;
				width: 330rpx;
				height: 100rpx;
				line-height: 100rpx;
				&.ant-button:nth-child(2) {
					margin: 0 25rpx 0 0;
					background-color: #FF5C2A;
					color: #FFFFFF;
				}
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
