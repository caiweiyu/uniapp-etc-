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
		<view class="content" :style="{ backgroundColor: etc.bground.btype == '1' ? `${etc.bground.color};` : 'rgba(0,0,0,0)'}">

			<!-- ************************** -->
			<!-- 未登录 -->
			<!-- ************************** -->
			<view class="empty-box" v-if="!token">
				<view class="title">粤通卡请登录</view>
				<view class="desc" @click="$debounce$bindNav,debounce(bindNav,carc.gtext)" v-text="etc.gtext.title ? etc.gtext.title : '--'"></view>
				<view class="btn">
					<image class="img" :src="item.tag_url" mode="aspectFit" v-for="(item,index) in etc.gbutton" :key="index" @click="$debounce(bindNav,item)"></image>
				</view>
				<image class="bg" v-if="etc.bground.btype == '2'" :src="etc.bground.img ? etc.bground.img : 'https://image.etcchebao.com/etc-min/etc-f/icon_13.png'"></image>
				<view class="swiper-shadow" v-if="etc"></view>
				<button-getPhoneNumber type="local" />
			</view>

			<!-- ************************** -->
			<!-- 未绑定 -->
			<!-- ************************** -->
			<view class="empty-box" v-if="token && etc.status == 2">
				<view class="title">粤通卡请绑卡</view>
				<view class="desc" @click="$debounce(bindNav,carc.gtext)" v-text="etc.gtext.title ? etc.gtext.title : '--'"></view>
				<view class="btn">
					<image class="img" :src="item.tag_url" mode="aspectFit" v-for="(item,index) in etc.gbutton" :key="index" @click="$debounce(bindNav,item)"></image>
				</view>
				<image class="bg" v-if="etc.bground.btype == '2'" :src="etc.bground.img ? etc.bground.img : 'https://image.etcchebao.com/etc-min/etc-f/icon_13.png'"></image>
				<view class="swiper-shadow" v-if="etc"></view>
			</view>

			<!-- ************************** -->
			<!-- 已绑定 -->
			<!-- ************************** -->
			<view class="card-box" v-if="token && etc.status == 3">
				<!-- 名字，卡号，简介 -->
				<view class="info-wrap">
					<view class="inner-box">
						<image class="unitoll-logo" :src="etc.top.tag"></image>
						<view class="num-inner">
							<view class="plate-num" v-text="etc.top.car ? etc.top.car : '--'"></view>
							<view class="card-num" v-text="etc.top.num ? etc.top.num : '--'"></view>
						</view>
					</view>
					<view class="btn-setting" @click="$debounce(bindSetConfig)">设置</view>
				</view>
				<!-- 左右模块 -->
				<view class="bill-wrap">
					<!-- 左 -->
					<view class="left-inner">
						<view class="inner-item" v-for="(item,index) in etc.subject" :key="index" @click="$debounce(bindNav,item)">
							<!-- 本月通行次数 -->
							<block v-if="item.flag == 'tmt'">
								<view class="name">本月通行</view>
								<view class="value">
									<text :class="['text', `text-len-${String(item.desc).length + 1}`]" v-text="item.desc ? item.desc : '0'"></text>次
								</view>
							</block>
							<!-- 本月消费金额 -->
							<block v-else-if="item.flag == 'tmm'">
								<view class="name">本月消费</view>
								<view class="value">
									<text :class="['text', `text-len-${String(item.desc).length}`]" v-text="item.desc ? item.desc : '0'"></text>元
								</view>
							</block>
							<!-- 其他 -->
							<block v-else>
								<view class="name" v-text="item.name ? item.name : '--'"></view>
								<view class="value">
									<text :class="['text', `text-len-${String(item.desc).length}`]" v-text="item.desc ? item.desc : '0'"></text>元
								</view>
							</block>
						</view>
					</view>
					<!-- 右 -->
					<view class="right-inner">
						<view class="inner-item" v-for="(item,index) in etc.gbutton" :key="index" @click="$debounce(bindNav,item)">
							<image class="img" :src="item.tag_url" mode="aspectFit"></image>
							<view class="title">{{item.name}}</view>
						</view>
					</view>
				</view>
				<!-- 背景图片 -->
				<image class="bg" v-if="etc.bground.btype == '2'" :src="etc.bground.img ? etc.bground.img : 'https://image.etcchebao.com/etc-min/etc-f/icon_13.png'"></image>
				<view class="swiper-shadow" v-if="etc"></view>
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
				etc: (state) => state.home.etc
			}),
		},
		data() {
			return {

			}
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 跳转
			 */
			bindNav(item) {
				if (item.jump_url.indexOf("packageA/pages/ytk/add_ytk/main") > -1) {
					eventMonitor("SY_Card_Whole_BindCard_391_Button_click", 2);
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
					url: `/packageA/pages/ytk/ytk_list/main?comeForm=${1}`,
					events: {
						getData: (data)=> {
							this.$emit("callback_cardIndex", data)
						}
					},
					success: (res)=> {
						res.eventChannel.emit("getData", {
							comeForm: "home"
						});
					}
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
			background-image: url("https://image.etcchebao.com/etc-min/etc-f/icon_13.png") no-repeat;
		}
		.content {
			border-radius: 20rpx;
			width: 694rpx;
			height: 280rpx;
			margin: 0 auto;
			padding: 30rpx 44rpx;
			box-sizing: border-box;
			background-size: 100% 100%;
			.card-box {
				.info-wrap {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.inner-box {
						display: flex;
						align-items: center;
						.unitoll-logo {
							z-index: 10;
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
