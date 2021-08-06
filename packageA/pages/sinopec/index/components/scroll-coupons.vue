<template>
	<view class="content">
		
		<!-- 卡券列表 -->
		<view class="scroll-coupon" v-if="sinoepc_init.new_coupon_list.length > 0">
			<image src="https://image.etcchebao.com/etc-min/etc-f/icon_38.png"></image>
			<scroll-view scroll-x class="scroll">
				<view :class="['box', item.status != 1 ? 'box-active' : '']" hover-class="hover" v-for="(item,index) in sinoepc_init.new_coupon_list" :key="index" @click="$debounce(getCoupon, item)">
					<view :class="['minbox', item.status != 1 ? 'text-color' : '']">
						￥<text class="text">{{item.get_money}}</text>
					</view>
					<view :class="['minbox', item.status != 1 ? 'text-color' : '']">{{item.title}}</view>
					<view :class="['minbox', item.status != 1 ? 'text-color' : '']">{{item.expire_time}}</view>
					<view :class="['minbox', item.status != 1 ? 'text-color' : '']">
						<text :decode="true">立即\n领取</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import { mapState } from "vuex"
	export default {
		computed: {
			...mapState({
				sinoepc_init: (state) => state.sinoepc.sinoepc_init
			})
		},
		data() {
			return {
				
			}
		},
		mounted() {
			uni.$on("changeCoupon", (e)=> {
				let sinoepc_init = this.sinoepc_init;
				for (let i = 0; i < sinoepc_init.new_coupon_list.length; i++) {
					if (e.id == sinoepc_init.new_coupon_list[i].id) {
						sinoepc_init.new_coupon_list[i].status = 0;
						break;
					} 
				}
				this.$store.commit("sinoepc/mt_sinoepc_init", sinoepc_init);
			})
		},
		methods: {
			/**
			 * 领取电子卡券
			 */
			getCoupon(item) {
				if (item.status != 1) {
					uni.showToast({
						title: "请不要重复领取",
						icon: "none",
						mask: true,
						duration: 1500
					})
				} else {
					uni.$emit("getCoupon", {
						id: item.id
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.hover {
		opacity: 0.7;
	}
	.content {
		margin: 24rpx 0 0 0;
		position: relative;
		color: #222222;
		.scroll-coupon {
			width: 100%;
			height: 260rpx;
			.scroll {
				position: absolute;
				left: 0;
				top: 84rpx;
				width: 100%;
				height: 160rpx;
				white-space: nowrap;
				.box {
					display: inline-block;
					vertical-align: top;
					margin: 0 0 0 20rpx;
					padding: 0 148rpx 0 140rpx;
					width: 570rpx;
					height: 150rpx;
					background: url("https://image.etcchebao.com/etc-min/etc-f/icon_39.png") no-repeat;
					background-size: 100% 100%;
					position: relative;
					.minbox:nth-child(1) {
						position: absolute;
						left: 0;
						top: 50%;
						transform: translate(0,-50%);
						width: 140rpx;
						text-align: center;
						font-size: 34rpx;
						font-weight: 700;
						color: #FF401E;
						font-family: "etccb-font";
						.text {
							font-size: 62rpx;
						}
					}
					.minbox:nth-child(2) {
						padding: 36rpx 0 0 0;
						font-size: 34rpx;
						font-weight: 700;
					}
					.minbox:nth-child(3) {
						padding: 4rpx 0 0 0;
						font-size: 26rpx;
						color: #666666;
					}
					.minbox:nth-child(4) {
						position: absolute;
						right: 32rpx;
						top: 50%;
						transform: translate(0,-50%);
						color: #FF401E;
						font-size: 32rpx;
						font-weight: 700;
					}
					.text-color {
						color: #CCCCCC !important;
					}
				}
				.box-active {
					background: url("https://image.etcchebao.com/etc-min/etc-f/icon_40.png") no-repeat;
					background-size: 100% 100%;
				}
				.box:last-child {
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
