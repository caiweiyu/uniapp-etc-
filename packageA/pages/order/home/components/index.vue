<template>
	<view>
		<!-- 订单列表 -->
		<view :class="['box',isStopBodyScroll ? 'scroll-lock' : '']">
			<view class="order-list">
				<!-- 头部导航 -->
				<view class="order-header">
					<view class="order-back" @click="goBacknav"></view>
					<view class="order-text" @click="toggle">
						{{menuName}}
						<view class="order-icon-up" v-if="!show"></view>
						<view class="order-icon-down" v-else></view>
					</view>
				</view>
				<!-- 隐藏菜单 -->
				<view :class="['box_content',first_click ? 'show':'hide',state ? 'open':'close' ]">
					<view class="item_list">
						<scroll-view scroll-y="true" class="scroll" >
							<view class="order-content" v-for="(item,index) in button_name_list" :key="index">
								<text class="order-content-text">{{item.label}}</text>
								<view class="order-content-center">
									<view
										:class="['order-content-button',(curIndexI == index && curIndexJ == indexj) ? 'active' : '' ]"
										@click="$debounce(bindNavlist,itemj,index,indexj)" v-for="(itemj,indexj) in item.child"
										:key="indexj">
										{{itemj.label}}
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="item_list_bottom" @click="toggle"></view>
				</view>
				<!-- 导航条 -->
				<view class="bar-meau">
					<changeTabbar @getIndex="getIndex" :listNav="listNav" :name="name" :curIndexref="curIndex" />
				</view>
			</view>
		</view>

		<!-- 订单banner -->
		<view class="banner">
			<view class="order-all" v-if="loading">
					<scroll-view v-if="card_list.length > 0" 
						 :scroll-y="true"
						 :refresher-enabled="true"
						 @scrolltolower="changeRfswaterFall" class="swiper_item_scroll"
						 :refresher-triggered="triggered" :refresher-threshold="50"
						 refresher-background="#F0F0F0" @refresherrefresh="onRefresh"
						 @refresherrestore="onRestore" @refresherabort="onAbort"
						 :style="{top:statusBarHeight}"
						 :scroll-with-animation="true"
						 >
						<view :class="[index==0?'order-card-first':'order-card']" v-for="(item,index) in card_list" :key="index">
							<view class="order-card-header" v-if="['40','11','10','140'].indexOf(item.order_type) != -1" @click.stop="$debounce(toService,item.order_status_id,item.order_type,item.order_id,item.jump_url)">
								<view class="header">
									<view class="header_box_l">
										<image class="header_box_l_img" :src="item.icon"></image>
										<view class="header_box_l_text">{{item.order_type_desc}}</view>
									</view>
									<view class="header_box_r">{{item.order_status}}</view>
								</view>
								<view class="line"></view>
								<!--卡片内容-->
								<view class="order-content-box">
									<view class="order-content-box-l">
										<image :src="item.img" alt=""></image>
									</view>
									<view class="order-content-box-r">
										<text>{{item.label_list[0].title}} : {{item.label_list[0].value}}</text>
										<text>{{item.label_list[1].title}} : {{item.label_list[1].value}}</text>
										<text>{{item.label_list[2].title}} : {{item.label_list[2].value}}</text>
									</view>
								</view>
								<view class="order">
									<!-- <view class="order_time">
										{{item.order_time}}
									</view> -->
									<view class="order-box1"></view>
									<view class="order-box2">
										<view class="order_pay"
											v-if="['10','140'].indexOf(item.order_type) > -1 && item.order_status_id == '6'">
											支付
										</view>
										<view class="order_pay"
											v-if="item.order_type == '40' && item.order_status_id == '0'">
											扫码核销
										</view>
										<view class="order_pay"
											v-if="item.order_type == '40' && item.order_status_id == '6'">
											支付
										</view>
										<view class="order_pay"
											v-if="item.order_type == '11' && item.order_status_id == '0'">
											继续写卡
										</view>
										<view @click.stop="$debounce(toServicedetail,item.order_type,item.order_id)" class="order_pay" v-if="item.sub_order_type=='011000' && (['13','15','19'].indexOf(item.order_status_id) > -1)">
											退款进度
										</view>
									</view>
								</view>
							</view>
							<!--不能点击的卡片-->
							<view class="order-card-header" v-else>
								<view class="header">
									<view class="header_box_l">
										<image class="header_box_l_img" :src="item.icon"></image>
										<view class="header_box_l_text">{{item.order_type_desc}}</view>
									</view>
									<view class="header_box_r">{{item.order_status}}</view>
								</view>
								<view class="line"></view>
								<!--卡片内容-->
								<view class="order-content-box">
									<view class="order-content-box-l">
										<image :src="item.img" alt=""></image>
									</view>
									<view class="order-content-box-r">
										<text>{{item.label_list[0].title}} : {{item.label_list[0].value}}</text>
										<text>{{item.label_list[1].title}} : {{item.label_list[1].value}}</text>
										<text>{{item.label_list[2].title}} : {{item.label_list[2].value}}</text>
									</view>
								</view>
								<view class="order">
									<!-- <view class="order_time">
										{{item.order_time}}
									</view> --> 
									<view class="order-box1"></view>
									<view class="order-box2">
										<view class="order_pay"
											v-if="['10','140'].indexOf(item.order_type) > -1 && item.order_status_id == '6'">
											待支付
										</view>
										<view class="order_pay"
											v-if="item.order_type == '40' && item.order_status_id == '0'">
											扫码核销
										</view>
										<view class="order_pay"
											v-if="item.order_type == '40' && item.order_status_id == '6'">
											支付
										</view>
										<view class="order_pay"
											v-if="item.order_type == '11' && item.order_status_id == '0'">
											继续写卡
										</view>
											<view @click.stop="$debounce(toServicedetail,item.order_type,item.order_id)" class="order_pay" v-if="item.sub_order_type=='011000' && (['13','15','19'].indexOf(item.order_status_id) > -1)">
											退款进度
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="isMore" v-if="isMore" :style="{paddingBottom:statusBarHeight}">
							<u-loadmore :status="status" />
						</view>
					</scroll-view>
					<view class="un-order" v-if="card_list.length == 0 && is_show">
						<view class="un-order-image">
							<image src="https://image.etcchebao.com/etc-min/mine/order/un-order.png"></image>
							<text>你还没有相关的订单</text>
						</view>
					</view>
			</view>
			<view v-if="!loading"
				:style="[
					{margin: '0 auto'},
					{padding: '300rpx 0 0 0'},
					{width: '50rpx'}
				]"
			>
				<u-loading mode="circle" size="50" color="#FF5C2A"></u-loading>
			</view>
			<!-- <van-loading color="#999999" type="spinner" size="18" text-size="12" custom-class="loading">加载中...</van-loading> -->
		</view>

	</view>
</template>

<script>
	import {
		getOrderType,
		getOrderStatus,
		// getOrderStatus,
		getTopBanner,
		getOrderList,
		// getOrderInfo,
		integrallData
	} from "@/interfaces/order";
	import {
		mapState
	} from 'vuex';
	import changeTabbar from "@/components/change-tabbar";
	export default {
		props: {
			name: {
				type: Number,
				default: 0
			}
		},
		components: {
			changeTabbar
		},
		data() {
			return {
				curIndex: 0,
				curIndexI: 0, //二级菜单active
				curIndexJ: 0, //二级菜单active
				menuName: "全部订单",
				button_name_list: [],
				show: false,
				first_click: false,
				state: false,
				isStopBodyScroll: false,
				listNav: [],
				order_status: '-1', //tab栏下标 --接口拿取
				sub_order_type: "-1", //上层菜单拿取
				card_list: [],
				banner_list: [],
				is_show: false,
				page: 1,
				page_size: 10,
				page_total: 0,
				current_total:0,
				isMore:false,
				loading: false,//加载中...
				status:'nomore',
				triggered:false,
				scrollTops:-1
			}
		},
		methods: {
			/*菜单切换开关*/
			toggle() {
				let list_state = this.state,
					first_state = this.first_click,
					list_show = this.show;
				first_state ? this.first_click = false : this.first_click = true;
				list_state ? this.state = false : this.state = true;
				list_show ? this.show = false : this.show = true;
				this.isStopBodyScroll = !this.isStopBodyScroll;
			},
			/*切换二级菜单*/
			bindNavlist(item, index, indexj) {
				this.curIndexI = index;
				this.curIndexJ = indexj;
				this.menuName = item.label;
				this.sub_order_type = item.sub_order_type;
				this.isMore=false;
				this.page=1;
				this.is_show =false;
				this.card_list = [];
				this.getOrderListtarget(this.page, this.page_size, this.order_status, this.sub_order_type)
				this.first_click = false, this.state = false, this.show = false;
			},
			//获取订单下标
			getIndex(data) {
				this.order_status = data.order_status;
				this.isMore=false;
				this.page =1;
				this.is_show =false;
				this.card_list = [];
				this.getOrderListtarget(this.page, this.page_size, this.order_status, this.sub_order_type)
			},
			//获取导航栏数据
			getOrderStatusList(order_status, sub_order_type) {
				getOrderStatus({
					order_status: order_status,
					sub_order_type: sub_order_type
				}).then(res => {
					let {
						code,
						msg,
						data
					} = res;
					if (code == 0 && msg == 'success') {
						this.listNav = data;
						uni.hideLoading()
					}
				})
			},
			//获取上层菜单数据
			async getOrderTypeTarget() {
				let res = await getOrderType({
					order_status: -1,
					sub_order_type: -1
				});
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0 && msg == 'success') {
					this.button_name_list = data;
					uni.hideLoading()
				}
			},
			onRefresh() { 
				this.triggered = true;
				let timer = setTimeout(() => {
					this.triggered = false;
					clearTimeout(timer)
				}, 1500)
			},
			/* 下拉被复位 */
			onRestore() {
				this.page = 1, this.page_size = 10,this.card_list = [];
				this.getOrderListtarget(this.page, this.page_size,this.order_status, this.sub_order_type);
			},
			onAbort() {
				this.triggered = false;
			},
			// 返回
			goBacknav() {
				let arr = getCurrentPages();
				if (arr.length <= 1) {
					uni.switchTab({
						url: "/pages/mine/main"
					})
				} else {
					uni.navigateBack({})
				}
			},
			//跳小程序原生
			gotoLocation(){
				uni.navigateTo({
						url: `/packageA/pages/ytk/ytk_list/order_detail?orderId=${order_id}`,
						events:{
							getData:(data)=>{
								this.getOrderListtarget(this.page, this.page_size,this.order_status, this.sub_order_type)
							}
						},
						success:(res)=>{
							res.eventChannel.emit('getData',{ data: 'detail' })
						}
				})
			},
			//跳h5页
			gotoWebView(url){
				let h5_url = url.replace('https','http')
					h5_url = h5_url.replace('http','https')
					uni.navigateTo({
						url: `/pages/webview/main?src=${encodeURIComponent(h5_url)}`
					});
			},
			//跳转详情h5订单
			toService(order_status_id, order_type, order_id,jump_url) {
				switch(Number(order_type)){
					case 11:
						this.gotoLocation();
					break;
					case 140:
						if(order_status_id == '6'){
							//待支付
							uni.navigateTo({
								url: `/packageA/pages/sinopec/home/pay_detail_add?order_id=${order_id}`
							})
						}else{
							//已完成已过期已退款退款中
							uni.navigateTo({
								 url: `/packageA/pages/sinopec/home/pay_detail?order_id=${order_id}`
							});
						}
					break;
					default:
						this.gotoWebView(jump_url);

				}
			},
			//跳转订单详情
			toServicedetail(order_type,order_id){
				let url = `/packageA/pages/ytk/ytk_list/order_process?order_id=${order_id}&order_type=${order_type}`
				uni.navigateTo({
					url: url
				});
			},
			//获取全部菜单数据
			async getOrderListtarget(page, page_size, order_status, sub_order_type) {
				let res = await getOrderList({
					order_status: order_status || -1,
					sub_order_type: sub_order_type || -1,
					page: page,
					page_size: page_size,
				})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					if(data.list.order_list.length == 0){
						this.is_show = true
					}else{
						if(data.list.order_list.length > 0){
							for(let i=0;i<data.list.order_list.length;i++){
								this.card_list.push(data.list.order_list[i])
							}
						}
					}
					this.current_total = data.list.page_total;
					this.page_total = data.list.total;
					this.loading = true;
				}
			},
			changeRfswaterFall() {
				let len = this.card_list.length;
				if (len >= this.page_total) {
					this.page_total >=3 ? this.isMore=true : this.isMore=false;
					return;
				}
				this.isMore=false;
				this.page += 1;
				this.getOrderListtarget(this.page,this.page_size,this.order_status,this.sub_order_type)
			},
			//获取banner图列表
			async getTopBannerList() {
				let res = await getTopBanner({
					order_status: -1,
					sub_order_type: -1,
				})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0 && msg == 'success') {
					this.banner_list = data;
				}
			},
		},
		computed: {
			...mapState({
				auth_info: (state) => state.user.auth_info,
				token: (state) => state.user.token
			}),
			statusBarHeight(){
				if(uni.getSystemInfoSync().statusBarHeight > 20){
					return (uni.getSystemInfoSync().statusBarHeight * 2)+179+'rpx'
				}else{
					return (uni.getSystemInfoSync().statusBarHeight * 2)+199+'rpx'
				}
			}
		},
		mounted() {
			let {
				index
			} = this.$root.$mp.query;
			this.curIndex = index;
			this.getOrderTypeTarget();
			this.getOrderStatusList(-1, -1);
			this.getTopBannerList();
			this.getOrderListtarget(this.page, this.page_size, this.curIndex, this.curIndex);
		},
		onShow(){
			this.$token(()=>{
				let {
					index
				} = this.$root.$mp.query;
				this.curIndex = index;
				this.getOrderTypeTarget();
				this.getOrderStatusList(-1, -1);
				this.getTopBannerList();
				this.getOrderListtarget(this.page, this.page_size, this.curIndex, this.curIndex);
			})
		},
	}
</script>

<style lang="scss" scoped>
	.order-content {
		margin-top: 43rpx;
		.order-content-text {
			color: #999999;
			font-size: 30rpx;
			margin: 43rpx 0 0 28rpx;
			display: block;
		}
		.order-content-center {
			display: flex;
			flex-wrap: wrap;
			margin: 16rpx 0 0 0;
			.order-content-button {
				width: 216rpx;
				height: 70rpx;
				line-height: 70rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				border-radius: 35rpx;
				background-color: #F2F2F2;
				color: #222222;
				text-align: center;
				font-size: 26rpx;
				// font-weight: bold;
				margin: 20rpx 0 0 21rpx;
				display: inline-block;
			}
			.active {
				color: #FF5C2A !important;
				font-weight: bold;
			}
		}
	}
	#item_list view {
		text-align: right;
		overflow: auto;
		white-space: nowrap;
	}
	.hide {
		display: none;
	}
	.show {
		display: block;
	}
	// .open{
	// 	transform: translateY(100%) !important;
	// 	transition: all 0.3s ease;
	// }
	// .close{
	// 	transform: translateY(0%) !important;
	// 	transition: all 0.3s ease;
	// }
	.scroll-lock {
		height: 100%;
		overflow-y: hidden;
	}
	.box {
		@media screen and (min-height: 812px) {
			.order-list {
				// height: 210rpx !important;
			}
		}
		.order-list {
			// height: 165rpx;
			position: fixed;
			width: 100%;
			height: 166rpx;
			z-index: 999;
			background-color: #ffffff;
			top: 0;
			left: 0;
			// 动画效果
			.box_content {
				width: 100%;
				overflow: hidden;
				animation-fill-mode: forwards;
				z-index: 999;
				position: fixed;
				background-color: rgba($color: #000000, $alpha: 0.7);
				height: 100%;
			}
			.item_list {
				background-color: white;
				position: absolute;
				width: 100%;
				z-index: 1000;
				height: 60%;
				overflow: auto;
				padding-bottom: 20rpx;
				border-radius: 0 0 20rpx 20rpx;
				.scroll {
					width: 100%;
					height: 100%;
				}
			}
			.item_list_bottom {
				position: absolute;
				bottom: 0;
				width: 100%;
				z-index: 1;
				height: 38%;
			}
			@media screen and (min-height: 812px) {
				.order-header {
					// margin-top: 105rpx !important;
				}
			}
			.order-header {
				display: flex;
				flex-direction: flex-start;
				align-items: center;
				margin-top: 60rpx;
				margin-bottom: 47rpx;
				text-align: center;
				position: relative;
				.order-back {
					width: 48rpx;
					height: 48rpx;
					background: url("https://image.etcchebao.com/etc-min/mine/order/goback.png")no-repeat;
					background-size: 100%;
					margin-left: 20rpx;
				}
				.order-text {
					left: 50%;
					transform: translateX(-50%);
					position: absolute;
					width: 300rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
					font-size: 36rpx;
					font-weight: bold;
					color: #222222;
					.order-icon-up {
						width: 40rpx;
						height: 40rpx;
						background: url("https://image.etcchebao.com/etc-min/mine/order/avter-down.png")no-repeat;
						background-size: 100%;
						display: inline-block;
						vertical-align: middle;
						margin-left: 8rpx;
						margin-top: -4rpx;
						animation: animate-up linear 0.2s forwards;
					}

					.order-icon-down {
						width: 40rpx;
						height: 40rpx;
						background: url("https://image.etcchebao.com/etc-min/mine/order/avter-up.png")no-repeat;
						background-size: 100%;
						display: inline-block;
						vertical-align: middle;
						margin-left: 8rpx;
						margin-top: -4rpx;
						animation: animate-down linear 0.2s forwards;
					}

					@keyframes animate-up {
						0% {
							transform: rotate(0);
						}
						100% {
							transform: rotate(180deg);
						}
					}
					@keyframes animate-down {
						0% {
							transform: rotate(0);
						}
						100% {
							transform: rotate(-180deg);
						}
					}
				}
			}
			.bar-meau {
				position: absolute;
				left: 0;
				bottom: 0;
			}
		}
	}

	@media screen and (min-height: 812px) {
		.banner {
			// top: 216rpx !important;
		}
	}
	.banner {
		overflow: hidden;
		width: 100%;
		height: 100vh;
		z-index: 1;
		.order-all {
			background: #F6F6F6;
			.swiper_item_scroll {
				position: fixed;
				// top: 236rpx;
				height: 100%;
				background-color: #F6F6F6;
				.order-card-first {
					padding: 16rpx 0 16rpx 0;
				}
				.order-card {
					padding: 0 0 16rpx 0 !important;
				}
				.isMore{
					width: 100%;
					display: block;
    				text-align: center;
					color:#999999;
					font-size: 30rpx;
				}
				.order-card-header {
						width: 690rpx;
						border-radius: 14rpx;
						margin: 0 auto;
						text-align: center;
						background: #FFFFFF;
						position: relative;
						.header {
							display: flex;
							justify-content: space-between;
							.header_box_l {
								color: #222222;
								font-size: 30rpx;
								font-weight: bold;
								margin: 25rpx 0 0 30rpx;
								.header_box_l_img {
									width: 40rpx;
									height: 40rpx;
									display: inline-block;
									vertical-align: middle;
								}
								.header_box_l_text {
									vertical-align: middle;
									margin-left: 18rpx;
									width: 335rpx;
									text-align: left;
									height: 45rpx;
									line-height: 45rpx;
									font-size: 30rpx;
									color:#222222;
									font-weight: bold;
									display: inline-block;
									white-space: nowrap;/*设置不换行*/
									overflow: hidden; /*设置隐藏*/
									text-overflow: ellipsis; /*设置隐藏部分为省略号*/
								}
							}
							.header_box_r {
								color: #FF5C2A;
								font-size: 26rpx;
								margin: 30rpx 29rpx 0 0;
							}
						}
						.line {
							width: 630rpx;
							height: 1rpx;
							background-color: #F1F1F1;
							margin: 24rpx auto;
						}
						.line:after {
							transform: scaleY(0.5);
						}
						.order-content-box {
							display: flex;

							.order-content-box-l {
								margin-left: 30rpx;
								image {
									width: 100rpx;
									height: 100rpx;
									border-radius: 10rpx;
									display: inline-block;
								}
							}
							.order-content-box-r {
								font-size: 26rpx;
								color: #666666;
								display: flex;
								flex-direction: column;
								margin-left: 19rpx;
								text-align: left;
								text:not(:first-child) {
									margin: 14rpx 0 0 0;
								}
							}
						}
						.order {
							display: flex;
							justify-content: space-between;
							padding-bottom: 20rpx;
							.order-box2{
								margin: 0 20rpx;
								.order_pay {
									margin: 44rpx 10rpx 0rpx 0rpx;
									width: 150rpx;
									height: 54rpx;
									line-height: 54rpx;
									text-align: center;
									color: #FF5C2A;
									font-size: 26rpx;
									border-radius: 27rpx;
									border: 1rpx solid #FF5C2A;
								}
							}
							.order_time {
								margin-top: 44rpx;
								// width: 150rpx;
								height: 54rpx;
								line-height: 54rpx;
								text-align: center;
								position: absolute;
								left: 30rpx;
								bottom: 20rpx;
							}
						}
					}
			}

			.un-order {
				position: relative;
				display: flex;
				text-align: center;
				width: 100%;
				height: calc(100vh-35rpx);
				.un-order-image {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					image {
						width: 400rpx;
						height: 300rpx;
						display: block;
					}
					text {
						text-align: center;
						color: #999999;
						font-size: 28rpx;
						display: block;
					}
				}
			}
		}
	}
</style>
