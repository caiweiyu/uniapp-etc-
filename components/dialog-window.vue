<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-06-08 17:06:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-07-06 11:06:47
-->
<template>
	<!--*****
		公共弹窗组件 
		type 弹窗样式 1 全图弹窗 2 图文（单按钮） 3 图文（上下），4 图文：左右
		close_icon 是否显示弹窗关闭图标 0 否 1 是
		close_icon_style 关闭图标样式 1弹窗底部 2弹窗全屏右上角 3弹窗内右上角
		*****-->
	<view :class="['toast', showAnimate == true ? 'toast-enter' : 'toast-outer']" v-if="show" @click="bindClose" @touchmove.stop="bindContent">
		<!--***** 弹窗 *****-->
		<view :class="['content-toast', showAnimate == true ? 'content-enter' : 'content-outer']" @click.stop="bindContent">
			<view class="main">
				<!-- 弹窗图片（全局） -->
				<view class="pic-max" v-if="global_popup.type <= 1" @click="$debounce(bindNav,global_popup)">
					<image class="img" :src="global_popup.img_url" mode="widthFix"></image>
					<button-getPhoneNumber v-if="!global_popup.is_need_login || global_popup.is_need_login == '1'" type="local" :item="global_popup" />
				</view>
				<block v-if="global_popup.type > 1">
					<!-- 弹窗图片（局部） -->
					<view class="pic" @click="$debounce(bindNav,global_popup)">
						<image class="img" :src="global_popup.img_url" mode="aspectFill"></image>
						<button-getPhoneNumber v-if="!global_popup.is_need_login || global_popup.is_need_login == '1'" type="local" :item="global_popup" />
					</view>
					<!-- 弹窗title -->
					<view class="title">
						<text :decode="true">{{global_popup.img_text.title}}</text>
					</view>
					<!-- 弹窗content -->
					<view class="content">
						<text :decode="true">{{global_popup.img_text.content}}</text>
					</view>
					<!-- 按钮 -->
					<view class="button" :style="{display:'flex', flexDirection:direction}">
						<!-- 图文（单按钮） -->
						<view class="one" v-if="global_popup.type == 2">
							<view :class="[`box-${(index + 1)}`]" v-for="(item, index) in global_popup.img_text.button" :key="index" v-if="index == 0">
								<view class="minbox" @click="$debounce(bindNav,item)">{{item.label}}</view>
								<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
							</view>
						</view>
						<!-- 图文（上下） -->
						<view class="two" v-if="global_popup.type == 3">
							<view :class="[`box-${(index + 1)}`]" v-for="(item, index) in global_popup.img_text.button" :key="index" v-if="index <= 1">
								<view class="minbox" @click="$debounce(bindNav,item)">{{item.label}}</view>
								<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
							</view>
						</view>
						<!-- 图文：左右 -->
						<view class="three" v-if="global_popup.type == 4">
							<view :class="[`box-${(index + 1)}`]" v-for="(item, index) in global_popup.img_text.button" :key="index" v-if="index <= 1">
								<view class="minbox" @click="$debounce(bindNav,item)">{{item.label}}</view>
								<button-getPhoneNumber v-if="!item.is_need_login || item.is_need_login == '1'" type="local" :item="item" />
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 关闭按钮 弹窗底部 -->
			<view class="close-1" v-if="global_popup.close_icon == 1 && global_popup.close_icon_style == 1" @click="closeWindow">
				<image class="img" src="https://image.etcchebao.com/etc-min/icon_close.png"></image>
			</view>
			<!-- 关闭按钮 弹窗全屏右上角 -->
			<view class="close-2" v-if="global_popup.close_icon == 1 && global_popup.close_icon_style == 2" @click="closeWindow">
				<image class="img" src="https://image.etcchebao.com/etc-min/icon_close.png"></image>
			</view>
			<!-- 关闭按钮 弹窗内右上角 -->
			<view class="close-3" v-if="global_popup.close_icon == 1 && global_popup.close_icon_style == 3" @click="closeWindow">
				<image class="img" src="https://image.etcchebao.com/etc-min/icon_close.png"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	import { mapState } from "vuex"
	import { eventMonitor } from "@/common/utils"
	import * as API from "@/interfaces/home"
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber"
	export default {
		components: {
			buttonGetPhoneNumber
		},
		props: {
			flag: {
				type: String,
				default: ""
			},//着陆页标识(弹屏触发页标识) 例：1  首页  2  我的
		},
		computed: {
			...mapState({
				token: (state)=> state.user.token
			})
		},
		watch: {
			
		},
		data() {
			return {
				show: false,//弹窗是否打开
				showAnimate: false,//动画
				showTime: 0,//onShow执行间隔时间戳
				global_popup: [],//全局弹窗
				bindContent: () => {},//阻断content触发关闭close
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight * 2,//导航栏适配高度
				direction: 'column',//按钮组的方向  column列排布  start横排布
			}
		},
		mounted() {
			// this.loadPopup();
		},
		methods: {
			/**
			 *  校验弹窗显示
			 * 	trg_flag
			 *  原生页标识 
			 * 	1 首页 
			 *  2 我的 
			 *  3 金币(储钱罐) 
			 *  4 绑卡完成页
			 *  5 粤通卡账单首页 
			 * 	6 订单列表 
			 * 	7 卡券中心
			 *  8 资讯列表页 
			 *  9 粤通卡充值列表
			 *  freq
			 *  弹窗频次 
			 *  1 跳转一次
			 *  2 每天跳转一次 
			 *  3 每次打开跳转(供测试用)
			 */
			async loadPopup() {
				if (new Date().getTime() - this.showTime < 10000) return;
				let res = await API.axios_global_popup({
					flag: this.flag
				});
				if (String(res.data) != 'null') {
					let data = res.data;
					data.dialog = 0;
					this.global_popup = data;
					this.loadPopupShowTime(data);
				}
			},
			
			/**
			 * 校验弹窗触发次数
			 */
			loadPopupShowTime(data) {
				let cacheDialog = uni.getStorageSync("cacheDialog");
				if (!uni.getStorageSync("cacheDialogTime")) { //首次创建全局弹窗缓存
					uni.setStorageSync("cacheDialogTime", miniapp.clock(new Date().getTime()));
					data.dialog++;
					uni.setStorageSync("cacheDialog", [data]);
					this.show = true;
					this.showAnimate = true;
					this.loadDialogWindow();
				} else { //已有签到缓存
					if (uni.getStorageSync("cacheDialogTime") != miniapp.clock(new Date().getTime())) { //第二天重置弹窗
						uni.setStorageSync("cacheDialogTime", miniapp.clock(new Date().getTime()));
						for (let i = 0; i < cacheDialog.length; i++) {
							if (Number(cacheDialog[i].freq) != 1) { //freq为1时，永久只弹一次(不清除弹出记录)
								cacheDialog[i].dialog = 0;
							}
							if (cacheDialog[i].trg_flag == data.trg_flag && cacheDialog[i].id != data.id) { //id驱动改变时，强制初始化弹出值
								cacheDialog[i] = data;
							}
							if (cacheDialog[i].trg_flag == data.trg_flag && cacheDialog[i].freq != data.freq) { //freq驱动改变时，强制初始化弹出值
								cacheDialog[i] = data;
							}
						}
						uni.setStorageSync("cacheDialog", cacheDialog);
						this.callbackPopupShowTime(data, uni.getStorageSync("cacheDialog"));
					} else {
						for (let i = 0; i < cacheDialog.length; i++) {
							if (cacheDialog[i].trg_flag == data.trg_flag && cacheDialog[i].id != data.id) { //id驱动改变时，强制初始化弹出值
								cacheDialog[i] = data;
							}
							if (cacheDialog[i].trg_flag == data.trg_flag && cacheDialog[i].freq != data.freq) { //freq驱动改变时，强制初始化弹出值
								cacheDialog[i] = data;
							}
						}
						uni.setStorageSync("cacheDialog", cacheDialog);
						this.callbackPopupShowTime(data, uni.getStorageSync("cacheDialog"));
					}
				}
			},
			callbackPopupShowTime(data, cacheDialog) {
				let num = 0;
				for (let i = 0; i < cacheDialog.length; i++) {
					if (cacheDialog[i].trg_flag != data.trg_flag) { //落地页当前校验object未有缓存
						num++;
					} else { //落地页已有缓存(有一个即有缓存)
						switch(Number(cacheDialog[i].freq)) {
							// 1 跳转一次 
							case 1:
								if (cacheDialog[i].dialog <= 0) {
									cacheDialog[i].dialog++;
									uni.setStorageSync("cacheDialog", cacheDialog);
									this.show = true;
									this.showAnimate = true;
									this.loadDialogWindow();
								}
								break;
							// 每天跳转一次
							case 2:
								if (cacheDialog[i].dialog <= 0) {
									cacheDialog[i].dialog++;
									uni.setStorageSync("cacheDialog", cacheDialog);
									this.show = true;
									this.showAnimate = true;
									this.loadDialogWindow();
								}
								break;
							// 每次打开跳转(供测试用)
							case 3:
								this.show = true;
								this.showAnimate = true;
								this.loadDialogWindow();
								break;
						}
						return;
					}
				}
				if (num == cacheDialog.length) { //每日首次加载落地页
					data.dialog++;
					cacheDialog.push(data);
					uni.setStorageSync("cacheDialog", cacheDialog);
				}
				this.show = true;
				this.showAnimate = true;
				this.loadDialogWindow();
			},
			
			/**
			 * 跳转
			 */
			bindNav(item) {
				eventMonitor("Whole_Popover_click_505", 2, {
					url: item.jump_url
				});
				if (typeof(item) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(item);
					miniapp.subscribe(arr, (res) => {
						this.callbackNav(item);
					}, (err) => {
						this.callbackNav(item);
					})
				} else {
					// 直接跳转
					this.callbackNav(item);
				}
			},
			callbackNav(item) {
				// 跳转page || miniProgram
				this.closeWindow();
				miniapp.miniProgramRouter(item, (res) => {
					this.closeWindow();
				}, (err) => {
					
				})
			},
			
			/**
			 * 点击阴影部分关闭弹窗
			 */
			bindClose() {
				if (this.global_popup.close_icon == 1 && this.global_popup.close_icon_style > 3) {
					this.closeWindow();
				}
			},
			
			/**
			 * 关闭弹窗
			 */
			closeWindow() {
				// 延迟动画
				this.showAnimate = false;
				setTimeout(()=>{
					this.show = false;
				},300)
				// 关闭后，间隔单位事件内不再出现弹窗
				this.showTime = new Date().getTime();
			},
			
			/**
			 * 中石化弹窗优先级校验
			 */
			loadDialogWindow() {
				uni.$emit("loadDialogWindow", {
					dialog_window: 2
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.toast {
		position: fixed;
		z-index: 99999;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba($color: #000000, $alpha: 0.7);
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		.content-toast {
			width: 630rpx;
			height: auto;
			.main {
				background-color: #FFFFFF;
				border-radius: 30rpx;
				overflow: hidden;
				.pic-max {
					.img {
						display: block;
						width: 100%;
					}
				}
				.pic {
					display: inline-block;
					border-radius: 30rpx 30rpx 0 0;
					.img {
						width: 630rpx;
						height: 250rpx;
					}
				}
				.title {
					padding: 0 28rpx;
					font-size: 36rpx;
					color: #222222;
					text-align: center;
					margin-top: 42rpx;
					font-weight: bold;
				}
				.content {
					padding: 0 28rpx;
					font-size: 28rpx;
					color: #222222;
					text-align: center;
					margin-top: 16rpx;
				}
				.button {
					margin: 63rpx 0 40rpx 0;
					font-size: 32rpx;
					.one {
						margin: auto;
						.box-1 {
							width: 558rpx;
							height: 98rpx;
							line-height: 98rpx;
							text-align: center;
							margin: auto;
							border-radius: 49rpx;
							background-color: #FF6D40;
							color: #FFFFFF;
						}
					}
					.two {
						margin: auto;
						.box-1 {
							width: 558rpx;
							height: 98rpx;
							line-height: 98rpx;
							text-align: center;
							margin: auto;
							border-radius: 49rpx;
							background-color: #FF6D40;
							color: #FFFFFF;
						}
						.box-2 {
							text-align: center;
							margin-top: 26rpx;
							font-size: 32rpx;
							display: block;
							color: #999999;
						}
					}
					.three {
						width: 100%;
						.box-1 {
							width: 260rpx;
							height: 98rpx;
							line-height: 98rpx;
							color: #FF6D40;
							border: 2rpx solid #FF6D40;
							border-radius: 49rpx;
							text-align: center;
							display: inline-block;
							margin-left: 37rpx;
						}
						.box-2 {
							width: 260rpx;
							height: 98rpx;
							line-height: 98rpx;
							color: #FFFFFF;
							background-color: #FF6D40;
							border: 2rpx solid #FF6D40;
							border-radius: 49rpx;
							text-align: center;
							display: inline-block;
							margin-left: 38rpx;
						}
					}
				}
			}
			.close-1 {
				position: absolute;
				z-index: 9999;
				left: 50%;
				bottom: -90rpx;
				transform: translate(-50%,0);
				width: 60rpx;
				height: 60rpx;
				.img {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
			.close-2 {
				position: absolute;
				z-index: 9999;
				right: -8rpx;
				top: -90rpx;
				width: 60rpx;
				height: 60rpx;
				.img {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
			.close-3 {
				position: absolute;
				z-index: 9999;
				right: 20rpx;
				top: 20rpx;
				width: 60rpx;
				height: 60rpx;
				.img {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
		}
		.content-enter {
			animation: animate-content-enter linear 0.3s forwards;
		}
		@keyframes animate-content-enter {
			0% {
				transform: scale(0.5);
			}
			100% {
				transform: scale(1);
			}
		}
		.content-outer {
			animation: animate-content-outer linear 0.3s forwards;
		}
		@keyframes animate-content-outer {
			0% {
				transform: scale(1);
			}
			100% {
				transform: scale(1.2);
			}
		}
	}
	.toast-enter {
		animation: animate-toast-enter linear 0.3s forwards;
	}
	@keyframes animate-toast-enter {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.toast-outer {
		animation: animate-toast-outer linear 0.3s forwards;
	}
	@keyframes animate-toast-outer {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
