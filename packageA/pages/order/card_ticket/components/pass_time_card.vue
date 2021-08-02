<template>
	<view class="card-box">
		<scroll-view v-if="loading" :scroll-y="true" @scrolltolower="dealScrollBottom" class="card-scroll">
			<block v-if="list.length > 0">
					<view class="card" v-for="(item,index) in list" :key="index">
					<view class="card_tick">
						<view class="card_tick_left">
							<view>
								<text class="yuan">￥</text><text class="yuan_cash">{{item.discount_quota}}</text><view>{{item.limit_msg}}</view>
							</view>
						</view>
						<view class="card_tick_right">
							<view>
								<view>{{item.coupon_type}}</view>
								<view>{{item.coupon_title}}</view>
								<view>{{"有效期至"+item.coupon_expire_time}}</view>
							</view>
						</view>
					</view>
					<view v-if="item.description != ''" :class="['card_bottom',!item.show ?'card_bottom_bottom':'']" @click="toggle(item)">
						<view class="card_bottom_left">
							<text>查看详情</text>
						</view>
						<view class="card_bottom_right">
							<view :class="['icon','right_content_down']"  v-if = "item.show"></view>
							<view :class="['icon','right_content_up']" v-if = "!item.show"></view>
						</view>
					</view>
					<view v-if="item.description != ''" class="bottom_position" :style="{display:(item.show==true) ? 'block' : 'none'}">
						<text>{{item.description}}</text>
					</view>
				</view>
				<view class="isMore" v-if="isMore">
					<u-loadmore :status="status" />
				</view>
			</block>
			<block v-if="list.length == 0">
				<view class="no_card">
					<image src="https://image.etcchebao.com/etc-min/order/no_card.png"></image>
					<text>暂无卡券</text>
				</view>
			</block>
		</scroll-view>
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
	import {
		getCouponList
	} from "@/interfaces/order";
	export default {
		data(){
			return {
				list:[],
				page:1,
                size:10,
                total:0,
                defaultSize:[],
                page_total:0,
				isMore:false,
				loading: false,//加载中...
				status:'nomore'
			}
		},
		mounted(){
			this.getCouponListtarget(1)
		},
		methods:{
			toggle(item){
				item.show = !item.show
			},
			//有效券
			getCouponListtarget(data){
				getCouponList({
					get_type:1,
                    page:data
				}).then(res=>{
					let {code,msg,data} = res;
					if(code == 0){
						if(data.coupon_list.length > 0){
							for(let i=0;i<data.coupon_list.length;i++){
								data.coupon_list[i].show = false;
								this.list.push(data.coupon_list[i])
							}
						}
                        this.total = data.total;
						this.loading = true;
                        this.page_total = data.page_total;
					}
				})
			},
			//去失效
			tolinkPassTime(){
				uni.navigateTo({
					url:`/packageA/pages/order/card_ticket/components/pass_time_card`
				})
			},
			//处理滚动滑动处理
			dealScrollBottom(){
				let len = this.list.length;
                if(len >= this.total){
                    len >= 5 ? this.isMore=true : this.isMore = false;
                    return;
                }
				this.isMore=false;
                this.page +=1;
                this.getCouponListtarget(this.page)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-box{
		// width: 710rpx;
		width: 100%;
		height: 100%;
		.card-scroll{
			position: relative;
			height: 100vh;
			.isMore{
				width: 100%;
				display: block;
				text-align: center;
				color:#999999;
				font-size: 30rpx;
				height: 60rpx;
				line-height: 60rpx;
			}
			.card{
				transform: translateX(20rpx);
				margin-top:21rpx;
				.card_tick{
					width: 710rpx;
					height: 210rpx;
					border: 1rpx solid #EBEBEB;
					border-radius: 8rpx;
					position: relative;
					display: flex;
					justify-content: space-between;
					&_left{
						width: 217rpx;
						height: 210rpx;
						background-color: #EBEBEB;
						position: relative;
						>view{
							font-size: 36rpx;
							text-align: center;
							margin-top: 35rpx;
							.yuan_cash{
								font-size: 72rpx;
								font-family: 'etccb-font';
                                color: #CCCCCC;
							}
							>view{
								font-size: 24rpx;
								color: #CCCCCC;
							}
                            .yuan{
                                color: #CCCCCC;
								font-weight: bold;
                            }
						}


					}
					&_right{
						width: 492rpx;
						background-color: #FFFFFF;
						position: relative;
						>view{
							// display: flex;
							// flex-direction: column;
							>view:first-child{
								border:1rpx solid #CCCCCC;
								display: inline-block;
								// width: 86rpx;
								padding:3rpx 7rpx;
								height: 38rpx;
								line-height: 30rpx;
								text-align: center;
								font-size: 24rpx;
								border-radius: 4rpx;
								margin:34rpx 0 0 40rpx;
								color: #CCCCCC;
							}
							>view:nth-child(2){
								font-size: 32rpx;
								margin:22rpx 0 0 40rpx;
								color: #CCCCCC;
								font-weight: bold;
							}
							>view:nth-child(3){
								margin:4rpx 0 0 40rpx;
								font-size: 24rpx;
								color: #CCCCCC;
							}
						}
					}
				}
				&_bottom{
					display: flex;
					width: 710rpx;
					height: 80rpx;
					justify-content: space-between;
					border-left: 1rpx solid #EBEBEB;
                    border-right: 1rpx solid #EBEBEB;
					&_bottom{
						border-bottom: 1rpx solid #EBEBEB;
					}
					&_left{
						color: #D2D2D2;
						font-size: 24rpx;
						line-height: 80rpx;
						margin-left:20rpx;
					}
					&_right{
						position: relative;
						.icon{
							margin-right: 22rpx;
							line-height: 80rpx;
							width: 0rpx;
							height: 0rpx;
							border: 13rpx solid;
							border-color: transparent;
						}
						.right_content_up{
							border-top-color: #CCCCCC;
							position: absolute;
							right:15rpx;
							top:30rpx;
						}
						.right_content_down{
							border-bottom-color: #CCCCCC;
							position: absolute;
							right:15rpx;
							top:18rpx;
						}
					}
				}
				.bottom_position{
					width:710rpx;
					// height:114rpx;
					font-size: 24rpx;
					display: block;
					color: #CCCCCC;
					border-bottom: 1rpx solid #EBEBEB;
					border-left: 1rpx solid #EBEBEB;
					border-right: 1rpx solid #EBEBEB;
					>text{
						margin:0 15rpx 15rpx 15rpx;
						display: inline-block;
					}
				}
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
			.card_detail_bottom{
				>text{
					font-size: 24rpx;
					color: #999999;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: 40rpx;
				}
			}
		}
	}
</style>
