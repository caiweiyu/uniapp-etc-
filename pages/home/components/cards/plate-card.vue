<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<view class="unitoll-card-container">
		<view class="content" :style="{ backgroundColor: carc.bground.btype == '1' ? `${carc.bground.color};` : 'rgba(0,0,0,0)'}">

			<!-- ************************** -->
			<!-- 未登录 -->
			<!-- ************************** -->
			<view class="empty-box" v-if="!token">
				<view class="title">车辆详情</view>
				<view class="desc" @click="$debounce(bindNav,carc.gtext)" v-text="carc.gtext.title ? carc.gtext.title : '--'"></view>
				<view class="btn">
					<image class="img" :src="item.tag_url" mode="aspectFit" v-for="(item,index) in carc.gbutton" :key="index" @click="$debounce(bindNav,item)"></image>
				</view>
				<image class="bg" v-if="carc.bground.btype == '2'" :src="carc.bground.img ? carc.bground.img : 'https://image.etcchebao.com/etc-min/etc-f/icon_14.png'"></image>
				<view class="swiper-shadow" v-if="carc"></view>
				<button-getPhoneNumber type="local" />
			</view>

			<!-- ************************** -->
			<!-- 未绑定 -->
			<!-- ************************** -->
			<view class="empty-box" v-if="token && carc.status == 2">
				<view class="title">车辆详情</view>
				<view class="desc" @click="$debounce(bindNav,carc.gtext)" v-text="carc.gtext.title ? carc.gtext.title : '--'"></view>
				<view class="btn">
					<image class="img" :src="item.tag_url" mode="aspectFit" v-for="(item,index) in carc.gbutton" :key="index" @click="$debounce(bindNav,item)"></image>
				</view>
				<image class="bg" v-if="carc.bground.btype == '2'" :src="carc.bground.img ? carc.bground.img : 'https://image.etcchebao.com/etc-min/etc-f/icon_14.png'"></image>
				<view class="swiper-shadow" v-if="carc"></view>
			</view>

			<!-- ************************** -->
			<!-- 已绑定 -->
			<!-- ************************** -->
			<view class="card-box" v-if="token && carc.status == 3">
				<!-- 名字，卡号，简介 -->
				<view class="info-wrap">
					<view class="inner-box">
						<image class="unitoll-logo" :src="carc.top.tag ? carc.top.tag : 'https://image.etcchebao.com/etc-min/etc-f/logo_car.png'"></image>
						<view class="num-inner">
							<view class="plate-num" v-text="carc.top.car ? carc.top.car : '--'"></view>
							<view class="card-num" v-text="carc.top.desc ? carc.top.desc : '请添加车型'"></view>
						</view>
					</view>
					<view class="btn-setting" @click="$debounce(bindSetConfig)">设置</view>
				</view>
				<!-- 左右模块 -->
				<view class="bill-wrap">
					<!-- 左 -->
					<view class="left-inner">
						<block v-for="(item,index) in carc.subject" :key="index">
							<!-- 首项为天气weather -->
							<view class="inner-item" v-if="item.flag == 'twt'" @click="$debounce(bindNav,item)">
								<view class="name">{{weather.city}}</view>
								<view class="weather">
									<image class="img" :src="weather.whiteIcon" mode=""></image>
									<view class="box-1">{{weather.condition}}</view>
									<view class="box-2">{{weather.temp}}°</view>
								</view>
							</view>
							<!-- 其他数据 -->
							<view class="inner-item" v-else @click="$debounce(bindNav,item)">
								<view class="name" v-text="item.name ? item.name : '--'"></view>
								<view class="value">
									<text :class="['text', `text-len-${String(item.desc).length}`]" v-text="item.desc ? item.desc : '0'"></text>元
								</view>
							</view>
						</block>
					</view>
					<!-- 右 -->
					<view class="right-inner">
						<view class="inner-item" v-for="(item,index) in carc.gbutton" :key="index" @click="$debounce(bindNav,item)">
							<image class="img" :src="item.tag_url" mode="aspectFit"></image>
							<view class="title">{{item.name}}</view>
						</view>
					</view>
				</view>
				<!-- 背景图片 -->
				<image class="bg" v-if="carc.bground.btype == '2'" :src="carc.bground.img ? carc.bground.img : 'https://image.etcchebao.com/etc-min/etc-f/icon_14.png'"></image>
				<view class="swiper-shadow" v-if="carc"></view>
			</view>

		</view>
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		computed: {
			...mapState({
				token: (state) => state.user.token,
				carc: (state) => state.home.carc,
				weather: (state) => state.home.weather
			}),
		},
		data() {
			return {
				curCard: true,//是否绑卡
			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 跳转
			 */
			bindNav(item) {
				if (item.jump_url.indexOf("packageA/pages/ytk/bind_car/main") > -1) {
					eventMonitor("SY_Card_Whole_BindCar_391_Button_click", 2);
				}
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
			},
			callback(item) {
				// 跳转page || miniProgram
				miniapp.miniProgramRouter(item, (res)=>{

				}, (err)=> {

				})
			},

			/**
			 * 设置
			 */
			bindSetConfig() {
				uni.navigateTo({
					url: "/packageA/pages/ytk/car_list/main"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.unitoll-card-container {
		position: relative;
		height: 280rpx !important;
		.contentBG {
			background-image: url("https://image.etcchebao.com/etc-min/etc-f/icon_14.png") no-repeat;
		}
		.content {
			border-radius: 20rpx;
			background-size: 100%;
			width: 694rpx;
			height: 280rpx;
			margin: 0 auto;
			padding: 30rpx 44rpx;
			box-sizing: border-box;
			.card-box {
				.info-wrap {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.inner-box {
						display: flex;
						align-items: center;
						.unitoll-logo {
							width: 60rpx;
							height: 60rpx;
							border-radius: 100%;
						}
						.num-inner {
							margin-left: 22rpx;

							.plate-num {
								font-size: 36rpx;
								color: #fff;
								height: 48rpx;
							}
							.card-num {
								font-size: 24rpx;
								color: rgba($color: #FFFFFF, $alpha: 0.5);
								height: 32rpx;
							}
						}
					}
					.btn-setting {
						width: 100rpx;
						height: 46rpx;
						border: 2rpx solid #FFFFFF;
						box-sizing: border-box;
						border-radius: 100rpx;
						font-size: 24rpx;
						line-height: 44rpx;
						text-align: center;
						color: #FFFFFF;
					}
				}
				.bill-wrap {
					border-top: 1rpx solid rgba($color: #FFFFFF, $alpha: 0.3);
					padding-top: 28rpx;
					margin-top: 30rpx;
					.left-inner {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						min-height: 90rpx;
						.inner-item {
							margin-left: 30rpx;
							font-size: 22rpx;
							text-align: left;
							display: flex;
							flex-direction: column;
							flex-wrap: wrap;
							justify-content: space-between;
							.name {
								color: rgba($color: #FFFFFF, $alpha: 0.8);
							}
							.value {
								color: #FFFFFF;
								margin-top: 8rpx;
								.text {
									margin: 0 8rpx 0 0;
									font-size: 40rpx;
									font-weight: bold;
									font-family: 'etccb-font' !important;
								}
								.text-len-0,
								.text-len-1,
								.text-len-2,
								.text-len-3,
								.text-len-4,
								.text-len-5 {
									font-size: 40rpx;
								}
								.text-len-6 {
									font-size: 36rpx;
								}
								.text-len-7 {
									font-size: 32rpx;
								}
								.text-len-8 {
									font-size: 30rpx;
								}
								.text-len-9,
								.text-len-10,
								.text-len-11,
								.text-len-12,
								.text-len-13 {
									font-size: 28rpx;
								}
							}
							.weather {
								position: relative;
								margin: 5rpx 0 0 0;
								padding: 0 0 0 60rpx;
								color: #FFFFFF;
								font-size: 20rpx;
								.img {
									position: absolute;
									left: 0;
									top: 50%;
									transform: translate(0,-50%);
									display: block;
									margin: 0 auto;
									width: 50rpx;
									height: 50rpx;
								}
							}
						}
						.inner-item:first-child {
							margin-left: 0;
						}
					}
					.right-inner {
						position: absolute;
						right: 65rpx;
						bottom: 24rpx;
						display: flex;
						align-items: center;
						.inner-item {
							position: relative;
							text-align: center;
							margin-left: 40rpx;
							.img {
								margin: 0 auto;
								width: 48rpx;
								height: 48rpx;
							}
							.title {
								font-size: 22rpx;
								color: #FFFFFF;
								margin-top: 8rpx;
							}
						}
						.inner-item::before {
							content: "";
							display: block;
							width: 1rpx;
							height: 20rpx;
							background-color: rgba($color: #ffffff, $alpha: 1);
							position: absolute;
							left: -20rpx;
							bottom: 2rpx;
						}
						.inner-item:nth-child(1)::before {
							display: none;
							background-color: rgba($color: #ffffff, $alpha: 0);
						}
					}
				}
				.bg {
					position: absolute;
					z-index: -1;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					width: 694rpx;
					height: 100%;
				}
			}
			.empty-box {
				.bg {
					position: absolute;
					z-index: -1;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					width: 694rpx;
					height: 100%;
				}
				.title {
					padding: 8rpx 0 0 0;
					font-size: 36rpx;
					line-height: 50rpx;
					color: #FFFFFF;
				}
				.desc {
					font-size: 24rpx;
					color: rgba($color: #ffffff, $alpha: 0.7);
					padding-top: 8rpx;
					line-height: 33rpx;
				}
				.btn {
					position: absolute;
					left: 55rpx;
					bottom: 45rpx;
					width: 90%;
					height: 60rpx;
					// background: #FFFFFF;
					// border-radius: 30rpx;
					// color: #2FC99A;
					// text-align: center;
					// line-height: 60rpx;
					// font-size: 24rpx;
					.img {
						display: inline-block;
						vertical-align: middle;
						margin: 0 30rpx 0 0;
						max-width: 200rpx;
						height: 100%;
					}
				}
			}
		}
	}
	.swiper-shadow {
		position: absolute;
		z-index: -2;
		left: 50%;
		top: 260rpx;
		transform: translate(-50%,0);
		width: 710rpx;
		height: 60rpx;
		background: url("https://image.etcchebao.com/etc-min/etc-f/icon_32.png") no-repeat;
		background-size: 100% 100%;
	}
</style>
