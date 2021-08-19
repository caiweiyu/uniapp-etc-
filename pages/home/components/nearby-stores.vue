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
			<view class="box">附近门店</view>
			<view class="box">广东省2万家线下合作门店</view>
		</view>
		
		<!-- ************************** -->
		<!-- 导航 -->
		<!-- ************************** -->
		<view class="nav">
			<view :class="['box', curIndex == index ? 'active' : '']" v-for="(item,index) in nearby_store.lists" :key="index" @click="bindNavWeb($event,index)">
				<view class="minbox">
					<view class="img">
						<image src=""></image>
					</view>
					<view class="text">{{item.tab_name}}</view>
				</view>
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 门店列表 -->
		<!-- ************************** -->
		<view class="stores-list">
			<view class="box" v-for="(item,index) in nearby_store.lists[0].rows" :key="index" @click="bindNav(item)">
				<view class="minbox">
					<image class="img" src="item.img" mode="aspectFill"></image>
					<view class="text">{{item.distance}}</view>
				</view>
				<view class="minbox">{{item.name}}</view>
				<view class="minbox">
					<view class="text ">{{item.price}}</view>
					<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_4.png"></image>
				</view>
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 更多门店 -->
		<!-- ************************** -->
		<view class="stores-more" @click="bindMore">更多门店</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	
	import { mapState } from "vuex"
	export default {
		props: {

		},
		computed: {
			...mapState({
				nearby_store: (state) => state.home.nearby_store,
			})
		},
		data() {
			return {
				curIndex: 0, //导航index
			}
		},
		mounted() {

		},
		methods: {
			/**
			 * 导航
			 */
			bindNavWeb(e, index) {
				this.curIndex = index;
				console.log(index)
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
					jump_type: 3,
					jump_url: this.nearby_store.lists[0].mores
				}
				miniapp.miniProgramRouter(item, (res)=>{
					
				}, (err)=> {
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.zs-content {
		margin: 30rpx 28rpx 0 28rpx;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 1);
		color: #222222;
		border-radius: 20rpx;

		.title {
			.box {
				display: inline-block;
				vertical-align: bottom;
			}

			.box:nth-child(1) {
				font-size: 32rpx;
				font-weight: 700;
			}

			.box:nth-child(2) {
				font-size: 20rpx;
				color: #CCCCCC;
				margin: 0 0 0 10rpx;
			}
		}

		.nav {
			margin: 20rpx 0 0 0;

			.box {
				display: inline-block;
				vertical-align: middle;
				margin: 0 0 0 20rpx;
				width: 160rpx;
				height: 48rpx;
				background-color: #F4F5F8;
				border-radius: 100rpx;
				overflow: hidden;

				.minbox {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: center;
					align-items: center;

					.img {
						width: 36rpx;
						height: 36rpx;
					}

					.text {
						font-size: 24rpx;
						margin: 0 0 0 10rpx;
					}
				}
			}

			.box:first-child {
				margin: 0;
			}

			.active {
				color: #FFFFFF;
				background-color: #FF5C2A;
			}
		}

		.stores-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 20rpx 0 0 0;

			.box {
				width: 208rpx;

				.minbox {
					width: 100%;
				}

				.minbox:nth-child(1) {
					height: 208rpx;
					background-color: #ccc;
					border-radius: 8rpx;
					overflow: hidden;
					position: relative;

					.text {
						position: absolute;
						right: 0;
						top: 0;
						padding: 0 10rpx;
						background-color: rgba(0, 0, 0, 0.3);
						border-radius: 0 8rpx 0 8rpx;
						font-size: 20rpx;
						line-height: 24rpx;
						color: #FFFFFF;
					}
				}

				.minbox:nth-child(2) {
					margin: 5rpx 0 0 0;
					font-size: 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.minbox:nth-child(3) {
					margin: 5rpx 0 0 0;

					.text {
						display: inline-block;
						vertical-align: middle;
						font-size: 36rpx;
						font-weight: 700;
						font-family: 'etccb-font';
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
						margin: 6rpx 0 0 10rpx;
						width: 42rpx;
						height: 20rpx;
					}
				}
			}
		}

		.stores-more {
			margin: 20rpx auto 0 auto;
			width: 100%;
			height: 68rpx;
			background: #F4F5F8;
			opacity: 1;
			border-radius: 8px;
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			line-height: 68rpx;
		}
	}
</style>
