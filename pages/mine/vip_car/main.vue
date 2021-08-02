<template>
	<view class="img_content">
		<view class="img_position" v-for="(item,index) in img_list" :key="index">
			<image :src="item.img_src" mode="" @click="toVipRoute"></image>
			<view class="button_src">
				<view>
					<view>{{item.yuan}}</view>
					<view>{{item.price}}</view>
					<view>{{item.status}}</view>
					<text>{{item.old_price}}</text>
				</view>		
			</view>
			<text class="button_tip">
				{{item.content}}
			</text>
			<button class="set_button">
				设置
			</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data(){
			return {
				img_list:[
					{
						url:'xxxx',
						img_src:"https://image.etcchebao.com/etc-min/etc-vip_car/niello.png",
						yuan:"￥",
						price:999,
						status:"开通",
						old_price:"￥200",
						content:"预计一年为您省3182元"
					},
					{
						url:'xxxx',
						img_src:"https://image.etcchebao.com/etc-min/etc-vip_car/glory.png",
						yuan:"￥",
						price:888,
						status:"开通",
						old_price:"￥200",
						content:"预计一年为您省3182元"
					},
					{
						url:'xxxx',
						img_src:"https://image.etcchebao.com/etc-min/etc-vip_car/anvil.png",
						yuan:"￥",
						price:888,
						status:"开通",
						old_price:"￥200",
						content:"预计一年为您省3182元"
					},
				]
			}
		},
		computed:{

		},
		methods:{
			toVipRoute(){
				uni.navigateTo({
					url: `/pages/winning/main`,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img_content{
		overflow-x: hidden;
		width: 100%;
		font-family: 'etccb-font';
		.img_position:first-child{
			position: relative;
			text-align: center;
			>image{
				width: 694rpx;
				height: 280rpx;
			}
			>text{
				color: #FFD8A1;
				font-size: 20rpx;
				opacity: 0.5;
			}
			>view{
				background-color: #FFD8A1;
				border-radius: 30rpx;
				>view{
					color: #373737;
					>view:first-child{
						font-size: 20rpx;
						display: inline-block;
					}
					>view:nth-child(2){
						font-size: 28rpx;
						display: inline-block;
						font-weight: bold;
					}
					>view:nth-child(3){
						font-size: 24rpx;
						display: inline-block;
						font-weight: bold;
					}
					>text{
						font-size: 18rpx;
						display: inline-block;
						text-decoration:line-through;
						opacity: 0.8;
					}
				}
				.button_tip{
					color:#FFD8A1;
					font-size: 20rpx;
					position: absolute;
					top:101rpx;
					left:45rpx;
				}
			}
			.set_button{
				color: #FFD8A1;
				border: 1rpx solid #FFD8A1;
			}
		}
		
		.img_position:nth-child(2){
			position: relative;
			text-align: center;
			margin-top:96rpx;
			>image{
				width: 694rpx;
				height: 280rpx;
			}
			>text{
				color: #9F3300;
				font-size: 20rpx;
				opacity: 0.5;
			}
			>view{
			background-color: #FFFFFF;
			border-radius: 30rpx;
			>view{
				color: #9F3300;
				>view:first-child{
					font-size: 20rpx;
					display: inline-block;
				}
				>view:nth-child(2){
					font-size: 28rpx;
					display: inline-block;
					font-weight: bold;
				}
				>view:nth-child(3){
					font-size: 24rpx;
					display: inline-block;
					font-weight: bold;
				}
				>text{
					font-size: 18rpx;
					display: inline-block;
					text-decoration:line-through;
					opacity: 0.8;
				}

			}
			.button_tip{
				color:#FFD8A1;
				font-size: 20rpx;
				position: absolute;
				top:101rpx;
				left:45rpx;
			}
			}
			.set_button{
				color: #9F3300;
				border: 1rpx solid #9F3300;
			}
		}	
		.img_position:nth-child(3){
			position: relative;
			text-align: center;
			margin-top: 135rpx;
			>image{
				width: 694rpx;
				height: 280rpx;
			}
			>text{
				color: #3F3C5D;
				font-size: 20rpx;
				opacity: 0.5;
			}
			>view{
			background-color: #FFFFFF;
			border-radius: 30rpx;
			>view{
					color: #3F3C5D;
					>view:first-child{
						font-size: 20rpx;
						display: inline-block;
					}
					>view:nth-child(2){
						font-size: 28rpx;
						display: inline-block;
						font-weight: bold;
					}
					>view:nth-child(3){
						font-size: 24rpx;
						display: inline-block;
						font-weight: bold;
					}
					>text{
						font-size: 18rpx;
						display: inline-block;
						text-decoration:line-through;
						opacity: 0.8;
					}
				}
			}
			.set_button{
				color: #3F3C5D;
				border: 1rpx solid #3F3C5D;
			}
		}
		>view{
			.button_src{
				width: 200rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				border-radius: 30rpx;
				bottom: 40rpx;
				left: 43rpx;
				position: absolute;
			}
			.button_tip{
				color:#FFD8A1;
				font-size: 20rpx;
				position: absolute;
				top:101rpx;
				left:71rpx;
			}
			.set_button{
				position: absolute;
				top:47rpx;
				right: 37rpx;
				width: 100rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				font-size: 20rpx;
				// border: 1rpx solid #FFD8A1;
				background: none;
				border-radius: 20%;
			}
		}
		
	}
</style>
