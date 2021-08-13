<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	
	<view class="content">
		<swiper :class="['swiper']"
				:indicator-dots="indicatorDots"
				:indicator-color="indicatorColor"
				:indicator-active-color="indicatorActiveColor"
				:autoplay="autoplay"
				:interval="interval"
				:duration="duration"
				:circular="circular"
				:previous-margin="'20rpx'"
				:next-margin="'20rpx'"
				@change="bindchange"
		>
			<swiper-item v-for="(item, index) in listWeight" :key="index">
				<!--粤通卡模块-->
				<UnitollCard v-if="item.name == 1" @callback_cardIndex="callback_cardIndex" />
				<!--车卡绑定模块-->
				<PlateCard v-if="item.name == 2" />
				<!--会员卡模块-->
				<VipCard v-if="item.name == 3" />
			</swiper-item>
		</swiper>
		<view class="dots">
			<block v-if="listWeight.length > 1">
				<view :class="['box', current == index ? 'active' : '']" v-for="(item, index) in listWeight" :key="index"></view>
			</block>
		</view>
	</view>
	
</template>

<script>
	import { mapState } from "vuex"
	import UnitollCard from "./unitoll-card"
	import PlateCard from "./plate-card"
	import VipCard from "./vip-card"
	export default {
		data() {
			return {
				indicatorDots: false,
				indicatorColor: "#ffffff",
				indicatorActiveColor: "#FF5C2A",
				autoplay: false,
				interval: 5000,
				duration: 300,
				circular: true,
				current: 0
			}
		},
		computed: {
			...mapState({
				etc: (state)=> state.home.etc,
				carc: (state)=> state.home.carc,
				memberc: (state)=> state.home.memberc
			}),
			listWeight() {
				let list = [];
				if (this.etc && this.etc.hasOwnProperty("bground") == true) {
					list.push({ weight: this.etc.weight || 0, name: 1 });
				}
				if (this.carc && this.carc.hasOwnProperty("bground") == true) {
					list.push({ weight: this.carc.weight || 0, name: 2 });
				}
				// if (this.memberc && this.memberc.hasOwnProperty("bground") == true) {
				// 	list.push({ weight: this.memberc.weight || 0, name: 3 });
				// }
				list.sort(this.comparMax('weight'));
				return list;
			}
		},
		components: {
			UnitollCard,
			PlateCard,
			VipCard
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 卡片区域回调
			 */
			callback_cardIndex(e) {
				this.$emit("callback_card", e);
			},
			
			/**
			 * 对象key值排序
			 */
			comparMax(key) {
				return function(a,b) {
					let value1 = a[key];
					let value2 = b[key];
					return value2 -value1;
				}
			},
			
			/**
			 * 监听swiper
			 */
			bindchange(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>
<style lang="scss">
	.content {
		position: relative;
		.swiper {
			margin: 25rpx 0 0 0;
			height: 340rpx;
			position: relative;
		}
		.dots {
			position: relative;
			z-index: 2;
			margin: -40rpx 0 0 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			min-height: 8rpx;
			.box {
				margin: 0 0 0 8rpx;
				width: 8rpx;
				height: 8rpx;
				background-color: rgba($color: #AAAAAA, $alpha: 0.5);
				border-radius: 100rpx;
				&.box:first-child {
					margin: 0;
				}
				&.active {
					background-color: #FF5C2A !important;
					width: 16rpx !important;
					transition: width ease-in 0.5s; 
				}
			}
		}
	}
</style>
