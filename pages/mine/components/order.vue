<template>
	<!-- 我的订单 -->
	<view class="my-order-body">
		<view class="my-order">
			<view class="my-order-header">
				<view class="my-order-list">我的订单</view>
				<view class="order-list-all" @click="$debounce(navGetto,-1,menu.i_title)">{{menu.i_title}}
					<image :src="menu.i_url"></image>
					<button-getPhoneNumber type="local" :item="menu" />
				</view>
			</view>
			<view class="my-order-show">
				<view class="box1" v-for="(item,index) in list" :key="index" @click="$debounce(navGetto,index+1,item.i_title)">
						<view class="unpaid-logo">
							<image class="unpaid-logo-img" :src="item.i_url" mode="" />
						</view>
						<text class="box2">{{item.i_title}}</text>
						<button-getPhoneNumber type="local" :item="item" />
				</view>
				<!-- <view class="line-logo">
				</view> -->
				<!-- <view class="" @click="navGetto(5)">
					<view class="cart-logo"></view>
					<text>购物车</text>
				</view> -->
			</view>
			<!--收件人-->
			<!-- <view class="receiver">
				<view class="receiver-img"></view>
				<view class="receiver-info">
					<view class="">
						<view>已收件</view> <span>|</span>2019/12/31
					</view>
					<view class="receiver-info-detail">
						商品已揽件，取件人：车宝蓝(15900121401)
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>
<script>
	import buttonGetUserInfo from "@/components/button-getUserInfo";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import { chewu } from "@/common/constant";
	import {
		mapState
	} from "vuex";
	import {
		eventMonitor
	} from "@/common/utils"
	export default {
		data(){
			return{
				  active: 0,
				  icon: {
				      normal: 'https://img.yzcdn.cn/vant/user-inactive.png',
				      active: 'https://img.yzcdn.cn/vant/user-active.png',
				   },
				  menu:{ 
					    appid: "",
					    i_title: "全部订单",
						i_url: "https://image.etcchebao.com/etc-min/ytk-qc-file/icon-right.png",
						jump_type: "1",
						jump_url: "/packageA/pages/order/home/main?index=-1",
						subs_pop: "0",
						subs_template_id: ""
				  },
				  list:[
					  	{appid: "",
						i_title: "待支付",
						i_url: "https://image.etcchebao.com/etc-min/mine/1.png",
						jump_type: "1",
						jump_url: "/packageA/pages/order/home/main?index=1",
						subs_pop: "0",
						subs_template_id: ""},
						{appid: "",
						i_title: "已支付",
						i_url: "https://image.etcchebao.com/etc-min/mine/2.png",
						jump_type: "1",
						jump_url: "/packageA/pages/order/home/main?index=2",
						subs_pop: "0",
						subs_template_id: ""},
						{appid: "",
						i_title: "待评价",
						i_url: "https://image.etcchebao.com/etc-min/mine/3.png",
						jump_type: "1",
						jump_url: "/packageA/pages/order/home/main?index=3",
						subs_pop: "0",
						subs_template_id: ""},
						{appid: "",
						i_title: "待退款",
						i_url: "https://image.etcchebao.com/etc-min/mine/4.png",
						jump_type: "1",
						jump_url: "/packageA/pages/order/home/main?index=4",
						subs_pop: "0",
						subs_template_id: ""}
				  ],

			}
		},
		computed:{
			...mapState({
				token: (state) => state.user.token,
			}),
		},
		components:{
			buttonGetPhoneNumber,
			buttonGetUserInfo
		},
		methods:{
			navGetto(index,name){
				if(index == -1){
					eventMonitor("WD_Order_Whole_Other_392_Loadmore_click",2)
				}else{
					eventMonitor("WD_Order_Whole_Other_392_Icon_click",2,{
						icon:name
					})
				}
				uni.navigateTo({
					url: `/packageA/pages/order/home/main?index=${index}`,
				});
			},
			onChange(event) {
				console.log(event)
			},
		},
		mounted() {
		},
	}
</script>
<style lang="scss" scoped>
	.my-order-body{
		background-color: #F4F4F4;
		padding:0 0;
		.my-order{
			margin: 20rpx 28rpx 20rpx 28rpx;
			border-radius: 25rpx;
			padding-bottom: 30rpx;
			background-color: #FFFFFF;
			.my-order-header{
				display: flex;
				justify-content: space-between;
				.my-order-list{
					margin: 19rpx 0 0 27rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #222222;
				}
				.order-list-all{
					margin: 25rpx 0 0 0;
					color: #666666;
					font-size: 24rpx;
					display: inline-block;
					vertical-align: middle;
					position: relative;
					>image{
						width: 12rpx;
						height: 20rpx;
						display: inline-block;
						vertical-align: middle;
						margin: -4rpx 27rpx 0 11rpx;
					}
				}
				// .order-list-all::after {
				// 	content: "";
				// 	display: block;
				// 	display: inline-block;
				// 	vertical-align: middle;
				// 	margin: -7rpx 0 0 4rpx;
				// 	width: 12rpx;
				// 	height: 12rpx;
				// 	border-top: 2rpx solid #999999;
				// 	border-right: 2rpx solid #999999;
				// 	transform: rotate(45deg);
				// }
			}
			.my-order-show{
				display: flex;
				justify-content: space-between;
				margin:35rpx 37rpx 0 33rpx;
				.line-logo{
					height: 105rpx;
					width: 9rpx;
					text-align: center;
					vertical-align: middle;
					background:url('https://image.etcchebao.com/etc-min/mine/line.png')no-repeat;
					background-size: 100%;
				}
				.box1{
					position: relative;
				 }
				 .unpaid-logo{
						width: 72rpx;
						height: 72rpx;
						text-align: center;
						vertical-align: middle;
						margin: 0 auto;
						.unpaid-logo-img{
							width: 72rpx;
							height: 72rpx;
						}
					}
					.cart-logo{
						width: 72rpx;
						height: 72rpx;
						text-align: center;
						vertical-align: center;
						vertical-align: middle;
						margin: 0 auto;
						background:url('https://image.etcchebao.com/etc-min/mine/cart-logo.png')no-repeat;
						background-size: 100%;
					}
					.box2{
						text-align: center;
						margin-top: 11rpx;
						font-size: 22rpx;
						color: #666666;
						display: block;
					}
			}
			.receiver{
				width: 638rpx;
				height: 100rpx;
				background-color: #FAFAFA;
				display: flex;
				justify-content: flex-start;
				margin:20rpx 28rpx;
				border-radius: 10rpx;
				border: 1rpx solid #ddd;
				.receiver-img{
					width:100rpx;
					height:100rpx;
					background:url('https://image.etcchebao.com/etc-min/mine/undifine-user-logo.png')no-repeat;
					background-size: 100%;
				}
				.receiver-info{
					display: flex;
					flex-direction: column;
					>view{
						font-size: 24rpx;
						color:#999999;
						>view{
							color:#222222 !important;
							font-size: 26rpx;
							font-weight: bold;
							margin:12rpx 0 0 13rpx;
							display: inline-block;
						}
						>span{
							margin:0 19rpx;
						}
					}
					.receiver-info-detail{
						margin:9rpx 0 0 13rpx;
					}
				}
			}
		}
	}
</style>
