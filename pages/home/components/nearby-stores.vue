<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="zs-content" v-if="km">
		
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
		<view class="nav" v-if="curIndex > 0">
			<view :class="['box', curIndex == index ? 'active' : '']" v-for="(item,index) in nearby_store.lists" :key="index" @click="bindNavWeb($event,index)">
				<view class="minbox">
					<!-- 加油 -->
					<view class="img" v-if="item.tab_flag == 'oil'">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_56.png" v-if="curIndex != index"></image>
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_57.png" v-else></image>
					</view>
					<!-- 洗车 -->
					<!-- <view class="img">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_56.png"></image>
					</view> -->
					<!-- 营业厅 -->
					<!-- <view class="img">
						<image src="https://image.etcchebao.com/etc-min/etc-f/icon_56.png"></image>
					</view> -->
					<view :class="['text', curIndex == index ? 'text-active' : '']">{{item.tab_name}}</view>
				</view>
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 门店列表 -->
		<!-- ************************** -->
		<view class="stores-list">
			<view class="box" @click="bindNav">
				<view class="minbox">
					<view class="min u-line-1">{{nearby_store.lists[curIndex].rows[0].name}}</view>
					<view class="min">{{km}}km</view>
				</view>
				<view class="minbox u-line-1">
					<text>{{nearby_store.lists[curIndex].rows[0].address}}</text>
				</view>
				<view class="minbox">
					<view class="min">{{nearby_store.lists[curIndex].rows[0].price}}</view>
					<view class="min">VIP已省￥{{nearby_store.lists[curIndex].rows[0].price_reduce}}</view>
				</view>
				<view class="minbox">
					<!-- 默认文案 -->
					<block v-if="nearby_store.lists[curIndex].rows[0].user_act_tag.length <= 0">
						<view class="min-1">优惠</view>
						<view class="min-3">
							<text v-if="nearby_store.lists[curIndex].tab_flag == 'oil'">车宝加油优惠多多</text>
						</view>
					</block>
					<!-- 接口文案（只取第一条） -->
					<block v-else>
						<image class="min-2" :src="nearby_store.lists[curIndex].rows[0].user_act_tag[0].img" mode="heightFix"></image>
						<view class="min-3 u-line-1">{{nearby_store.lists[curIndex].rows[0].user_act_tag[0].content}}</view>
					</block>
				</view>
			</view>
		</view>
		
		<!-- ************************** -->
		<!-- 更多门店 -->
		<!-- ************************** -->
		<view class="stores-more" @click="bindMore">{{nearby_store.lists[curIndex].m_title}}</view>
		
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
			}),
			km() {
				if (this.nearby_store.hasOwnProperty("lists") == false) return "";
				return (this.nearby_store.lists[this.curIndex].rows[0].distance * 0.001).toFixed(3)
			}
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
			bindNav() {
				let item = this.nearby_store.lists[this.curIndex].rows[0];
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
					jump_type: this.nearby_store.lists[this.curIndex].m_jump_type,
					jump_url: this.nearby_store.lists[this.curIndex].m_jump_url
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
						color: #222222;
					}
					.text-active {
						color: #FFFFFF;
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
			margin: 20rpx 0 0 0;
			.box {
				background: url("https://image.etcchebao.com/etc-min/etc-f/icon_62.png") no-repeat;
				background-size: 100% 100%;
				height: 280rpx;
				padding: 0 20rpx;
				.minbox:nth-child(1) {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					padding: 30rpx 0 0 0;
					.min:nth-child(1) {
						max-width: 75%;
						font-size: 32rpx;
						font-weight: 700;
					}
					.min:nth-child(2) {
						line-height: 33rpx;
						height: 33rpx;
						background-color: #9C8781;
						border-radius: 100rpx;
						font-size: 24rpx;
						color: #FFFFFF;
						padding: 0 15rpx;
						margin: 0 0 0 15rpx;
					}
				}
				.minbox:nth-child(2) {
					margin: 10rpx 0 0 0;
					font-size: 24rpx;
					color: #999999;
				}
				.minbox:nth-child(3) {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					margin: 15rpx 0 0 0;
					padding: 0 0 55rpx 0;
					position: relative;
					.min:nth-child(1) {
						font-family: "etccb-font";
						font-size: 36rpx;
						color: #F24D20;
					}
					.min:nth-child(1)::before {
						content: "￥";
						display: inline-block;
						vertical-align: middle;
						font-size: 24rpx;
					}
					.min:nth-child(2) {
						font-size: 22rpx;
						color: #F24D20;
						height: 30rpx;
						line-height: 30rpx;
						background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAABEBAMAAAARj7HPAAAAElBMVEX/WCcAAAD/UCH/Tx3/TQD/TB9NrhSSAAAABnRSTlMaABIIBA0iNVF5AAAA8UlEQVRo3tWa2w2DMBAEV4gCQh7/KSElhA7ovxrOnEwNM1PBSiwwPl+25hUsyz5DPsNlnSH/4bLMkN+Q6YzvoOmQn6DhV/IOeQRNhwwbQyU75CNstsEvbAyVDNwuGrpdXBgqGb5dFIZKxlDJ8O2iMFQyeOEd8O2iMFQyeOEd8O2iMFQyeOEd8O2iMFQyfLso+HZRGCoZvl1YQioet+LFUXyCFB9zx29RIRgKVTOUUnJ8UBzEBKWUDAcUYxZBKS2jP75jWMbRfMfQXJHgS6m5tsOX0nOVTHcMz3oDXXxFKzfwUorWwOCOYVpNJDvGqliXPQFXHhijvZhnEwAAAABJRU5ErkJggg==") no-repeat;
						background-size: 100% 100%;
						padding: 0 15rpx;
						margin: 0 0 0 15rpx;
					}
				}
				.minbox:nth-child(3)::after {
					content: "";
					display: block;
					position: absolute;
					left: 0;
					bottom: 30rpx;
					width: 380rpx;
					height: 2rpx;
					background-color: #EBEBEB;
				}
				.minbox:nth-child(4) {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					.min-1 {
						padding: 2rpx 4rpx;
						line-height: 24rpx;
						font-size: 22rpx;
						color: #FFFFFF;
						background-color: #F24D20;
					}
					.min-2 {
						height: 28rpx;
					}
					.min-3 {
						margin: 0 0 0 10rpx;
						font-size: 22rpx;
						line-height: 24rpx;
						max-width: 80%;
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
