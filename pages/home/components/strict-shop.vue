<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="zs-content">

		<!-- ************************** -->
		<!-- 标题 -->
		<!-- ************************** -->
		<view class="title">
			<view class="box">{{strict_shop.lists[curIndex].tab_name}}</view>
			<view class="box" @click="bindMore">
				<text>{{strict_shop.lists[curIndex].m_title}}</text>
				<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="mores" />
			</view>
		</view>

		<!-- ************************** -->
		<!-- 严选商城 -->
		<!-- ************************** -->
		<view class="stores-list">
			<view class="box" v-for="(item,index) in strict_shop.lists[curIndex].rows" :key="index" @click="bindNav(item)">
				<view class="minbox">
					<image class="img" :src="item.img_url" mode="aspectFill"></image>
				</view>
				<view class="minbox">{{item.name}}</view>
				<view class="minbox">
					<view class="text">{{item.price}}</view>
					<view class="text">销量 {{item.gid}}</view>
				</view>
				<view class="minbox">
					<view class="text">{{item.vprice}}</view>
					<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_4.png" mode=""></image>
				</view>
				<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 到底了 -->
		<!-- ************************** -->
		<view class="last">到底了...</view>

	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	
	import { user, chewu } from "@/common/constant"
	import { mapState } from "vuex";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		props: {
			
		},
		data() {
			return {
				curIndex: 0,//商品分类index
			}
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				strict_shop: (state) => state.home.strict_shop,
			}),
			mores() {
				if (this.strict_shop.hasOwnProperty("lists") == false) return {};
				return {
					jump_type: this.strict_shop.lists[this.curIndex].m_jump_type,
					jump_url: this.strict_shop.lists[this.curIndex].m_jump_url
				}
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化 
			 */
			loadInit() {
				
			},
			
			/**
			 * 详情
			 */
			bindNav(item) {
				let items = {
					jump_type: 3,
					jump_url: item.target_url
				}
				miniapp.miniProgramRouter(items, (res)=>{
					
				}, (err)=> {
					
				})
			},
			
			/**
			 * 更多
			 */
			bindMore() {
				let item = {
					jump_type: this.strict_shop.lists[this.curIndex].m_jump_type,
					jump_url: this.strict_shop.lists[this.curIndex].m_jump_url
				}
				miniapp.miniProgramRouter(item, (res)=>{
					
				}, (err)=> {
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 清浮动  */
	.clearfix {
	  zoom:1;
	}
	.clearfix:after {
	  display:block;
	  overflow:hidden; 
	  clear:both; height:0;
	  visibility:hidden;
	  content:".";
	}
	.zs-content {
		position: relative;
		margin: 30rpx 28rpx 0 28rpx;
		padding: 0 0 30rpx 0;
		color: #222222;
		border-radius: 20rpx;

		.title {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;

			.box:nth-child(1) {
				font-size: 32rpx;
				font-weight: 700;
			}

			.box:nth-child(2) {
				font-size: 24rpx;
				color: #999999;
				margin: 0 0 0 10rpx;
				position: relative;
			}
		}

		.stores-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 20rpx 0 0 0;
			position: relative;
			
			.box {
				margin: 24rpx 0 0 0;
				padding: 0 0 10rpx 0;
				width: 334rpx;
				border-radius: 20rpx;
				overflow: hidden;
				background-color: #FFFFFF;

				.minbox {
					width: auto;
				}

				.minbox:nth-child(1) {
					width: 334rpx;
					height: 334rpx;
					border-radius: 20rpx 20rpx 0 0;
					overflow: hidden;
					position: relative;
				}

				.minbox:nth-child(2) {
					margin: 20rpx 0 0 0;
					padding: 0 20rpx;
					font-size: 28rpx;
					font-weight: 700;
					line-height: 40rpx;
					height: 80rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.minbox:nth-child(3) {
					margin: 5rpx 0 0 0;
					padding: 0 20rpx;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: bottom;

					.text:nth-child(1) {
						color: #FF5C2A;
						font-size: 36rpx;
						font-weight: 700;
						font-family: "etccb-font";
					}

					.text:nth-child(1)::before {
						content: '￥';
						display: inline-block;
						font-size: 24rpx;
						font-weight: lighter;
					}

					.text:nth-child(2) {
						color: #999999;
						font-size: 24rpx;
						line-height: 40rpx;
					}
				}

				.minbox:nth-child(4) {
					margin: -2rpx 0 0 0;
					padding: 0 20rpx;

					.text {
						display: inline-block;
						vertical-align: middle;
						font-size: 30rpx;
						font-weight: 700;
						font-family: "etccb-font";
					}

					.text::before {
						content: '￥';
						display: inline-block;
						font-size: 24rpx;
						font-weight: lighter;
					}

					.img {
						display: inline-block;
						vertical-align: middle;
						margin: 3rpx 0 0 10rpx;
						width: 42rpx;
						height: 20rpx;
					}
				}
			}

			.box:nth-child(1),
			.box:nth-child(2){
				margin: 0;
			}
		}
		
		.last {
			margin: 30rpx 0 0 0;
			text-align: center;
			color: #999999;
			font-size: 24rpx;
		}
	}
</style>
