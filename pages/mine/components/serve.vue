<template>
	<view class="my-order-body" v-if="list.length">
		<view class="my-order">
			<view class="my-order-header">
				<view class="my-order-list">我的服务</view>
			</view>
			<view class="my-order-show">
				<block v-if="list.length">
					<view  class="my-order-show-item" v-for="(item,index) in list" :key="index" @click="$debounce(bindNav,item)">
						<image class="img" :src="item.i_url"></image>
						<text class="text">{{item.i_title}}</text>
						<button-getPhoneNumber type="local" :item="item" />
					</view>
				</block>
				<block v-else>
					<view class="my-order-show-item">
						<view class="evaluated-logo" @click="$debounce(toEtcTicket)"></view>
						<text class="text">前往ETC发票</text>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const  miniapp = miniScript.getInstance()
	import buttonGetUserInfo from "@/components/button-getUserInfo";
	import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
	import {user} from "@/common/constant"
	import {
		myservice
	} from "@/interfaces/order";
	import {
		mapState
	} from 'vuex';
	import {
		eventMonitor
	} from "@/common/utils"
	export default {
		data(){
			return {
				list:[]
			}
		},
		computed:{
			...mapState({
				token: (state) => state.user.token,
			}),
		},
		components:{
			buttonGetPhoneNumber,
			buttonGetUserInfo
		},
		methods:{
			//跳转客服资讯
			toService(){
				uni.navigateTo({
					url: `/pages/webview/main?src=${encodeURIComponent(`${user}/qiyu/index.html?isGps=0`)}`,
				});
			},
			jumpPage(url){
				uni.navigateTo({
					url:'/'+url
				})
			},
			//跳etc发票
			toEtcTicket(){
				uni.navigateTo({
					// url: `/pages/webview/main?src=${encodeURIComponent(`${user}/etcparking/index.html?token=${this.token}`)}`,
					url: `/pages/webview/main?src=${encodeURIComponent(`localhost:8083`)}`,
				});
			},
			async getmyservice(){
				let res = await myservice({
					citycode:10000
				});
				let {code,msg,data} = res;
				if(code == 0){
					this.list = data;
					console.log(data)
				}
			},
			
			/**
			 * 跳转
			 */
			bindNav(item) {
				eventMonitor("WD_Service_Whole_Other_392_Icon_click",2,{
					icon:item.i_title
				})
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
			init(){
				this.getmyservice()
			}
		},
		mounted() {
			this.init()
		},
	}

</script>
<style lang="scss" scoped>
	.my-order-body{
		background-color: #F4F4F4;
		padding:0rpx 28rpx 20rpx 28rpx;
		// height:320rpx;
		.my-order{
			// height: 363rpx;
			width: 694rpx;
			// margin: 0rpx 28rpx 0rpx 28rpx;
			border-radius: 25rpx;
			background-color: #FFFFFF;
			.my-order-header{
				display: flex;
				justify-content:flex-start;
				.my-order-list{
					margin: 19rpx 0 30rpx 27rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #222222;
				}	
			}
			.my-order-show{
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				// margin-bottom: 30rpx;	
				.my-order-show-item{
					width: 25%;
					margin: 0 0 38rpx 0;
					position: relative;
					.evaluated-logo{
						width: 72rpx;
						height: 72rpx;
						text-align: center;
						vertical-align: middle;
						margin: 0 auto;
						background:url('https://image.etcchebao.com/etc-min/mine/unreceiv-logo.png')no-repeat;
						background-size: 100%;
					}
					.img{
						width: 72rpx;
						height: 72rpx;
						text-align: center;
						vertical-align: middle;
						display: block;
						margin: 0 auto;
					}
					.text{
						text-align: center;
						vertical-align: center;
						margin-top: 11rpx;
						margin: 0 auto;
						display: block;
						font-size: 22rpx;
						color: #666666;
					}
				}
			}
		}
	}
</style>
