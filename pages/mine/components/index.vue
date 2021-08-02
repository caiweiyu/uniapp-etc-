<template>
	<view class="user-global">
		<view class="user-header">
			<view class="user-logo" v-if="token" @click="$debounce(loginOut)">
				<image :src="auth_info.avatar"></image>
			</view>
			<view class="user-logo" v-else>
				<image :src="auth_info.avatar"></image>
				<button-getPhoneNumber type="local" />
			</view>
			<view class="user-login-text">
				<view class="username" @click="$debounce(login)">
					<block v-if="!token">立即登录</block>
					<block v-else>
						<text>{{auth_info.nickname}}</text>
						<!-- <text v-if="!UserInfo.isVip">{{auth_info.nickname}}</text>
						<text v-else>{{UserInfo.nickname}}</text> -->
					</block>
					<!--局部授权-->
					<block v-if="token">
						<button-get-user-info type="local" />
					</block>
					<block v-else>
						<button-getPhoneNumber type="local" />
					</block>
				</view>
				<!--未登录显示的提示文案-->
				<block v-if="!token">
					<p class="unlogin-tip">登录领取百元现金红包</p>
				</block>
				<block v-else>
					<!--登录成功后未开通的普通用户-->
					<block  v-if="!UserInfo.isVip">
						<view class="login-tip login-tip-free" @click="$debounce(toVipCard,1)">
							<view class="vip-tip-logo">
								<image :src="UserInfo.vipVrButton.vipIcon"></image>
							</view>
							<view class="vip-user vip-user-constom">普通用户</view>
							<view class="vip-open">去开通</view>
						</view>
					</block>
					<!--登录成功后已开通提醒续费的用户-->
					<block v-else-if="UserInfo.isVip">
						<view class="login-tip login-tip-free" @click="$debounce(toVipCard,2)">
							<view class="vip-tip-logo">
								<image :src="UserInfo.vipVrButton.vipIcon"></image>
							</view>
							<view class="vip-user">{{UserInfo.vipLevelName}}{{UserInfo.vipExpireStr}}</view>
							<view class="vip-open">去续费</view>
						</view>
					</block>
				</block>
			</view>
		</view>
		<view class="user-detail">
			<view class="user-detail-free" style="width:25%" @click="$debounce(toVipCard,3)">
				<block v-if="!token">
					<view class="user-detail-free-width">
						<text>--</text>
					</view>
					<text class="user-detail-free-width">累积已省</text>
					<button-getPhoneNumber type="local" :item="allitem[0]" />
				</block>
				<block v-else>
					<view class="user-detail-free-width">
						￥<text>{{integrallData.saveMoney != null ? (integrallData.saveMoney || 0) : (integrallData.saveMoney || 0)}}</text>
					</view>
					<text class="user-detail-free-width">累积已省</text>
				</block>
			</view>
			<view class="bottle-height">
				<view></view>
				<text class="">|</text>
			</view>
			<view class="user-detail-free" @click="$debounce(toCardtick)">
				<block v-if="!token">
					<view>
						<text>--</text>
					</view>
					<text>卡券</text>
					<button-getPhoneNumber type="local" :item="allitem[1]" />
				</block>
				<block v-else>
					<view>
						<text>{{integrallData.couponCount || 0}}</text>
					</view>
					<text>卡券</text>
				</block>
			</view>
			<view class="bottle-height">
				<view></view>
				<text class="">|</text>
			</view>
			<view class="user-detail-free" @click="$debounce(toCoineare)">
				<block v-if="!token">
					<view>
						<text>--</text>
					</view>
					<text>金币</text>
					<button-getPhoneNumber type="local" :item="allitem[2]" />
				</block>
				<block  v-else>
					<view>
						<text>{{coin}}</text>
					</view>
					<text>金币</text>
				</block>
			</view>
		</view>
		<view class="vip-card-bg" v-if="isNotVip && (peosonel != null && peosonel.img_url != '')" @click="$debounce(navGettoServe,peosonel)">
			<image class="vip-card-bg-img box1" v-if="peosonel != null && peosonel.img_url != ''" :src="peosonel.img_url" mode="" />
			<!-- <view class="vip-card"></view>
			<view class="vip-tip">
				开通得69元无门槛券
			</view>
			<view class="vip-button">
				立即开通
			</view> -->
		</view>
		<!-- <button-get-phone-number type="static" /> -->
	</view>

</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	import {
		memberpersonal,
		userTotalCoin,
		integrallData,
		getUserInfo
	} from "@/interfaces/order";
	import buttonGetUserInfo from "@/components/button-getUserInfo";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import { chewu } from "@/common/constant";
	import {
		eventMonitor
	} from "@/common/utils"
	import {
		mapState
	} from "vuex";
	export default {
		props:{

		},
		components:{
			buttonGetPhoneNumber,
			buttonGetUserInfo
		},
		data(){
			return{
				coin:0,
				integrallData:{}, //卡券积分
				UserInfo:{}, //会员信息
				isNotVip:false,
				peosonel:{
					img_url:'',
					jump_url:''
				},
				item:{
					jump_type:'3',
					jump_url:`${chewu}/vip/dist/#/index`,
					appid:""
				},
				allitem:[
					{
						jump_type:"3",
						jump_url:`${chewu}/vip/dist/#/index`,
						appid:""
					},
					{
						jump_type:"1",
						jump_url:"/packageA/pages/order/card_ticket/main",
						appid:""
					},
					{
						jump_type:"1",
						jump_url:"/pages/coin/detail/main",
						appid:""
					}
				]

			}
		},
		methods:{
			login(){
				if (this.auth_info.openid) {
					uni.navigateTo({
						url: "/pages/mine/user"
					})
				}
			},
			loginOut(){
				if (this.token) {
					uni.navigateTo({
						url: "/pages/mine/user"
					})
				}
			},
			navGettoServe(item){
				eventMonitor("WD_Member_CZK_Purchase_392_Button_click",2)
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
			//去会员卡
			toVipCard(data){
				switch(data){
					case 1:
						eventMonitor("WD_UserInfo_Whole_Other_392_Button_click",2,{
							text:'去开通'
						});
					break;
					case 2:
						eventMonitor("WD_UserInfo_Whole_Other_392_Button_click",2,{
							text:'去续费'
						});
					break;
					case 3:
						eventMonitor("WD_Save_Whole_Other_392_Text_click",2);
					break;
				}
				let src = encodeURIComponent(`${chewu}/vip/dist/#/index`);
				uni.navigateTo({
					url: `/pages/webview/main?src=${src}`,
				});
			},
			//去卡券
			toCardtick(){
				eventMonitor("WD_Coupon_Whole_Other_392_Text_click",2);
				uni.navigateTo({
					url: "/packageA/pages/order/card_ticket/main"
				})
			},
			//金币列表
			toCoineare(){
				eventMonitor("WD_GoldCoin_Whole_Other_392_Text_click",2);
				uni.navigateTo({
					url: `/pages/coin/detail/main`,
				});
			},
			async getuserTotalCoin(){
				let res = await userTotalCoin({})
				let {code,msg,data} = res;
				if(code == 0){
					console.log('data=>',data)
					this.coin = data;
				}
			},
			//获取卡券积分
			async getintegrallData(){
				let res = await integrallData({})
				let {code , msg, data} = res;
				if(code == 0){
					this.integrallData = data;
				}
			},
			//会员信息
			async getUserInfotion(){
				let res = await getUserInfo({})
				let {code , msg, data} = res;
				if(code == 0){
					this.UserInfo = data;
					this.isNotVip = !data.isVip;
				}
			},
			//获取会员专区运营位配置接口
			async getMemberpersonal(){
				let res = await memberpersonal({
					citycode: this.cityCode || 10000
				});
				let {code , msg, data} = res;
				if(code == 0){
					this.peosonel=data;
				}
			},
			init(){
				this.getuserTotalCoin()
				this.getintegrallData()
				this.getMemberpersonal()
				this.getUserInfotion()
			}
		},
		computed:{
			...mapState({
				auth_info: (state) => state.user.auth_info,
				token: (state) => state.user.token,
				cityCode: (state) => state.user.city_code
			}),
		},
		mounted(){
			eventMonitor("WeChat_WD", 1)
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
	.user-global{
			padding-top: 128rpx;
			position: relative;
			width: 100%;
			background: url("https://image.etcchebao.com/etc-min/mine/bg_header.png")no-repeat;
			background-size: 100% 100%;
			// background: linear-gradient(180deg, #E4F5EF 0%, #FFFFFF 100%);
			.user-header{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				margin:0 33rpx 0 41rpx;
				.user-logo{
					width: 120rpx;
					height: 120rpx;
					position: relative;
					image{
						width: 120rpx;
						height: 120rpx;
						display: inline-block;
						border-radius: 50%;
					}
				}
				.user-login-text{
					margin: 7rpx 0 0 33.26rpx;
					position: relative;
					>view{
						font-size: 48rpx;
						color:#222222;
					}
					.unlogin-tip{
						font-size: 22rpx;
						margin-top: 8rpx;
						color: #999999;
					}
					.login-tip{
						position: relative;
						padding: 0 0 0 44rpx;
						font-size: 22rpx !important;
						color: #999999;
						height: 35rpx;
						line-height: 35rpx;
						border: 1rpx solid #D0D0D0;
						box-sizing: border-box;
						display: inline-block;
						border-radius: 17.5rpx;
						vertical-align: middle;
						margin-top: 12rpx;
						.vip-tip-logo{
							position: absolute;
							left: 10rpx;
							top: 50%;
							transform: translate(0,-50%);
							width: 24rpx;
							height: 20.548571428571428rpx;
							>image{
								width: 100%;
								height: 100%;
								display: block;
							}
						}
						.vip-open{
							width:96rpx;
							height:35rpx;
							line-height: 35rpx;
							font-size: 22rpx !important;
							border-radius: 17.5rpx;
							text-align: center;
							position: absolute;
							right: -71rpx;
							top: 50%;
							transform: translate(0,-50%);
							background-color: #464441;
							color: #FFEDC4;
							border: 1rpx solid #464441;
							box-sizing: border-box;
						}
					}
					.login-tip-free{
						color: #222222;
						font-weight: bold;
						.vip-user{
							margin: 0 36rpx 0 0;
						}
						.vip-user-constom{
							color: #999999;
						}
					}
				}
			}
			.user-detail{
				font-size: 24rpx;
				font-family: 'etccb-font';
				padding: 44rpx 77rpx;
				color:#848A8E;
				display: flex;
				justify-content:space-between;
				>view{
					>view{
						font-size: 48rpx;
						color: #222222;
						text-align: center;
					}
					>text{
						text-align: center;
					}
				}
				.bottle-height{
					position: relative;
					>text{
						position: absolute;
						bottom: 0rpx;
					}
				}
				.user-detail-free{
					width: 20%;
					position: relative;
					>view{
						font-size: 26rpx;
						color: #222222;
						display: inherit;
						>text{
							font-size: 48rpx;
							// text-align: center;
						}
					}
					>text{
						display: block;
					}
					.user-detail-free-width{
						text-align: center;
						width:160rpx;
					}
				}
			}
			// vip卡片
			.vip-card-bg{
				width: 694rpx;
				height: 80rpx;
				margin: 0 28rpx;
				// background: url("https://image.etcchebao.com/etc-min/mine/card-bg.png") no-repeat;
				background-size: 100%;
				position: relative;
				.vip-card-bg-img{
					width: 694rpx;
					height: 80rpx;
					border-radius: 16rpx;
				}
				.vip-card{
					width:41.65rpx;
					height: 18rpx;
					left: 21rpx;
					top: 31rpx;
					position: absolute;
					background: url("https://image.etcchebao.com/etc-min/mine/vip-log0.png") no-repeat;
					background-size: 100%;
				}
				.vip-tip{
					color: #F5E6D0;
					font-size: 26rpx;
					left: 70rpx;
					top: 22rpx;
					position: absolute;
				}
				.vip-button{
					width: 140rpx;
					height: 48rpx;
					border-radius: 24rpx;
					position: absolute;
					right: 26rpx;
					top: 16rpx;
					text-align: center;
					line-height: 48rpx;
					color: #161F28;
					font-size: 24rpx;
					background: linear-gradient(180deg, #EEC5AA 0%, #F9ECD7 100%);
				}
			}

	}
</style>
