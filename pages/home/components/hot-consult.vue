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
			<view class="box">热门资讯</view>
			<view class="box" @click="bindMove">更多</view>
		</view>

		<!-- ************************** -->
		<!-- 导航 :scroll-into-view="`u-tab-item-${fm_index}`" -->
		<!-- ************************** -->
		<view class="max">
			<scroll-view scroll-x class="nav" :scroll-with-animation="true" :scroll-left="scrollLeft">
				<view :class="['box', fm_index == index ? 'active' : '']" :id="'u-tab-item-' + index" v-for="(item,index) in message_tab" :key="index" @click="bindNav($event,index,item)">
					<view class="minbox">
						<view class="img" v-if="index == 0">
							<image class="imgmin" src="https://image.etcchebao.com/etc-min/etc-f/icon_34.png" v-if="fm_index == 0"></image>
							<image class="imgmin" src="https://image.etcchebao.com/etc-min/etc-f/icon_33.png" v-else></image>
						</view>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- ************************** -->
		<!-- 资讯 -->
		<!-- ************************** -->
		<swiper class="etc-msg-list" :duration="300" :current="fm_index" @change="bindChange($event,index,item)">
			<swiper-item v-for="(item,index) in message_tab" :key="index">
				<block v-if="message_tab[index].list != undefined">
					<block v-if="message_tab[index].list.length > 0">
						<view class="box" hover-class="hover" v-for="(item,indexmin) in message_tab[index].list" :key="indexmin" @click="$debounce(bindArticle,$event,indexmin,item)">
							<view class="minbox">{{item.title}}</view>
							<view class="minbox">
								<!-- <text v-if="item.totalLike != undefined" v-text="item.totalLike ? `${item.totalLike}人点赞` : '0人点赞'"></text>
								<text v-if="item.likeCount != undefined" v-text="item.likeCount ? `${item.likeCount}人点赞` : '0人点赞'"></text> -->
								<!-- <text v-if="item.publishTime != undefined" v-text="item.publishTime"></text>
								<text v-if="item.createTime != undefined" v-text="item.createTime"></text> -->
								<text>{{item.publishTime || item.createTime}}</text>
							</view>
							<view class="minbox minboxBg">
								<image class="img" v-if="item.frontImgUrl" :src="item.frontImgUrl" mode="aspectFill"></image>
								<image class="img" v-if="item.frontImage" :src="item.frontImage" mode="aspectFill"></image>
								<image class="minboxBg_item" v-if="item.type_id == 2" src="https://image.etcchebao.com/etc-min/info/video_mark.png" mode="" />
							</view>
						</view>
					</block>
					<view class="box-none" v-else>没有更多数据了</view>
				</block>
				<block v-else>
					<view :style="[
							  {margin: '0 auto'},
							  {padding: '300rpx 0 0 0'},
							  {width: '50rpx'}
						  ]"
					>
						<u-loading mode="circle" size="50" color="#FF5C2A"></u-loading>
					</view>
				</block>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
	export default {
		props: {
			message_tab: {
				type: Array,
				default: []
			},
			message_article: {
				type: Object,
				default: {}
			}
		},
		computed: {
			...mapState({
				fm_index: (state) => state.home.fm_index
			})
		},
		watch: {
			message_article: {
				handler(n,o) {
					if (n || o) {
						this.loadSwiperArticle();
					}
				},
				deep: true
			},
			fm_index: {
				handler(n,o) {
					if (n) {
						this.getTabRect(n);
					}
				},
				deep: true
			}
		},
		data() {
			return {
				scrollLeft: 0,//scroll-view横向滑动,scroll-left距离 滑块单位尺寸180rpx
			}
		},
		mounted() {

		},
		methods: {
			/**
			 * 文章swiper 数据处理
			 */
			loadSwiperArticle() {
				this.$nextTick(()=> {
					let obj = this.message_tab[this.fm_index];
					obj.list = this.message_article.list;
					this.$emit("callback_msg", {
						comeForm: 3,
						obj: obj
					})
				})
			},

			/**
			 * 导航
			 */
			bindNav(e,index,item) {
				eventMonitor("SY_Info_FM_Other_391_Tab_click", 2, {
					tab: item.name
				});
				this.$emit("callback_msg", {
					comeForm: 1,
					type: this.message_tab[index].type,
					index: index,
					item: item
				})
				this.$store.commit("home/mt_fm_index", index);
			},

			/**
			 * 文章详情
			 */
			bindArticle(e,index,item) {
				eventMonitor("SY_Info_FM_Other_391_List_click", 2, {
					article_id: item.articleId || item.id
				});
				this.$emit("callback_msg", {
					comeForm: 2,
					id: this.message_article.list[index].articleId,
					item: item
				})
			},

			/**
			 * 更多
			 */
			bindMove() {
				eventMonitor("SY_Info_FM_Other_391_Loadmore_click", 2);
				uni.switchTab({
					url: `/pages/fm/home/main`
				})
			},

			/**
			 * 监听资讯滑动
			 */
			bindChange(e) {
				this.$emit("callback_msg", {
					comeForm: 1,
					type: this.message_tab[e.detail.current].type,
					item: this.message_tab[e.detail.current]
				})
				this.$store.commit("home/mt_fm_index", e.detail.current);
			},

			/**
			 * 查询tab的布局信息
			 */
			getTabRect(n) {
				this.$nextTick(function(){
					// 创建节点查询
					let query = uni.createSelectorQuery().in(this);
					// 历遍所有tab，这里是执行了查询，最终使用exec()会一次性返回查询的数组结果
					for (let i = 0; i < this.message_tab.length; i++) {
						// 只要size和rect两个参数
						query.select(`#u-tab-item-${i}`).fields({
							size: true,
							rect: true
						});
					}
					// 执行查询，一次性获取多个结果
					query.exec(
						function(res) {
							// console.log("query",res)
							let unit = res[1].left - res[0].left;
							if (n) {
								if (n >= 3) {
									this.scrollLeft = (n - 1) * unit;
								} else {
									this.scrollLeft = 0;
								}
							}
						}.bind(this)
					);
				})
			}
		}
	}
</script>

<style lang="scss">
	.hover {
		opacity: 0.8;
	}
	.zs-content {
		margin: 30rpx 28rpx 0 28rpx;
		padding: 20rpx 0 0 0;
		background-color: rgba(255,255,255,1);
		color: #222222;
		border-radius: 20rpx;
		.title {
			padding: 0 20rpx;
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
			}
		}
		.max {
			margin: 20rpx 20rpx 0 20rpx;
			.nav {
				width: 100%;
				height: 55rpx;
				white-space: nowrap;
				.box {
					display: inline-block;
					vertical-align: middle;
					margin: 0 0 0 20rpx;
					width: 160rpx;
					height: 48rpx;
					background-color: #F4F5F8;
					border-radius: 100rpx;
					overflow: hidden;
					text-align: center;
					.minbox {
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
						align-items: center;
						width: 100%;
						height: 100%;
						.img {
							width: 16rpx;
							height: 48rpx;
							margin: 0 10rpx 0 0;
							.imgmin {
								margin: 12rpx 0 0 0;
								width: 16rpx;
								height: 24rpx;
							}
						}
						.text {
							height: 48rpx;
							line-height: 48rpx;
							font-size: 24rpx;
						}
					}
				}
				.box:first-child {
					margin: 0;
				}
				.box:last-child {
					// margin-right: 20rpx;
				}
				.active {
					color: #FFFFFF;
					background-color: #FF5C2A;
				}
			}
		}
		.minboxBg{
			position: relative;
			.minboxBg_item{
				width: 48rpx;
				height: 48rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			}
		}
		.etc-msg-list {
			// margin: 20rpx 0 0 0;
			// padding: 0 20rpx;
			min-height: 672rpx;
			.box {
				padding: 35rpx 268rpx 35rpx 20rpx;
				width: auto;
				height: 224rpx;
				position: relative;
				.minbox:nth-child(1) {
					padding: 8rpx 0 0 0;
					font-size: 28rpx;
					font-weight: 700;
					line-height: 40rpx;
					color: #303030;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.minbox:nth-child(2) {
					position: absolute;
					left: 20rpx;
					bottom: 40rpx;
					font-size: 22rpx;
					font-weight: 500;
					line-height: 30rpx;
					color: #C1C1C1;
				}
				.minbox:nth-child(3) {
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translate(0,-50%);
					width: 208rpx;
					height: 144rpx;
					border-radius: 8rpx;
					overflow: hidden;
					// background-color: #cccccc;
				}
			}
			.box::after {
				content: '';
				display: block;
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				margin: auto auto 0 auto;
				width: 654rpx;
				height: 1rpx;
				background-color: #EBEBEB;
			}
			.box:last-child::after {
				background-color: rgba(0,0,0,0);
			}
			.box:first-child {
				// padding-top: 20rpx !important;
			}
			.box-none {
				padding: 200rpx 0 0 0;
				text-align: center;
			}
		}
	}
</style>
