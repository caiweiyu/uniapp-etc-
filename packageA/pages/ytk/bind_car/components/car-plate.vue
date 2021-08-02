<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-25 14:31:04
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-08 17:53:31
-->
<template>
	<view class="plate">
		<view :class="['popule', { active: isOpened }]">
			<view class="popule-container">
				<view class="popule-header">
					<view class="cancel" @click="onCancel">取消</view>
					<view class="confirm" @click="onConfirm">确认</view>
				</view>
				<view class="popule-content">
					<picker-view indicatorStyle="height: 50px;color:#999" class="picker-view" :value="currentIndex"
						@change="onChange" @pickstart="onPickstart" @pickend="onPickend">
						<picker-view-column>
							<view class="picker-view-column-item" v-for="(item, index) in provinces" :key="index">
								{{ item.province }}
							</view>
						</picker-view-column>
						<picker-view-column>
							<view class="picker-view-column-item" v-for="(item, index) in citys" :key="index">
								{{ item.city_code }}
							</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
			<view class="popule-overlay" @click="onClose"></view>
		</view>
	</view>
</template>

<script>
	import * as API from "@/interfaces/ytk";
	export default {
		props: {
			value: {
				type: Boolean,
				default: false,
			},
			defautValue: {
				type: String,
				default: "粤 A",
			},
		},
		watch: {
			value(val) {
				this.isOpened = val;
			},
		},
		data() {
			return {
				currentIndex: [],
				provinces: [],
				citys: [],
				isOpened: false,
				platevalue: "粤 A",
				scroll: false, //是否正在滚动
			};
		},
		created() {
			this.fetchProvince();
		},
		mounted() {},
		methods: {
			onClose() {
				this.$emit("input", false);
			},
			onCancel() {
				this.onClose();
			},
			onConfirm() {
				if (this.scroll == true) {
					return;
				}
				this.$emit("onConfirm", this.platevalue)
				this.onClose();
			},
			onChange(e) {
				let [provinceIndex, cityIndex] = e.mp.detail.value;
				// if (this.currentIndex[0] !== provinceIndex) {
				// 	cityIndex = 0;
				// }
				this.citys = this.provinces[provinceIndex].citys;
				this.currentIndex = [provinceIndex, cityIndex];
				let province = this.provinces[provinceIndex].province;
				let city_code = this.citys[cityIndex].city_code;
				this.platevalue = `${province} ${city_code}`
			},
			onPickstart(e) {
				this.scroll = true;
			},
			onPickend(e) {
				console.log(e)
				this.scroll = false;
			},
			/**
			 * 获取车牌列表
			 */
			async fetchProvince() {
				let res = await API.getProvinces();
				if (res.code === 0) {
					let data = res.data;
					let citys = [];
					let provinceIndex = 0;
					let cityIndex = 0;
					let [province, city] = this.defautValue.split(" ");
					this.provinces = data;
					data.forEach((item, index) => {
						if (item.province === province) {
							citys = item.citys;
							provinceIndex = index;
						}
					});
					this.citys = citys;
					citys.forEach((item, index) => {
						if (item.city_code === city) {
							cityIndex = index;
						}
					});
					this.provinceIndex = provinceIndex;
					
					setTimeout(()=>{
						this.currentIndex = [provinceIndex, cityIndex];
					},1000)
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.popule {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 22;
		visibility: hidden;
		transition: visibility 300ms;

		&-container {
			position: absolute;
			transition: transform 300ms;
			transform: translate3d(0, 100%, 0);
			z-index: 3;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #fff;
		}

		&-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 49px;

			border-bottom: 1rpx solid #efefef;

			>view {
				padding: 0 16px;
			}

			.cancel {
				color: #969799;
			}

			.confirm {
				color: #d1a86a;
			}
		}

		&-content {
			.picker-view {
				position: relative;
				z-index: 2;
				width: 100%;
				height: 300px;
				box-sizing: border-box;

				&-column-item {
					line-height: 50px;
					text-align: center;
				}
			}
		}

		&-overlay {
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba($color: #000000, $alpha: 0.7);
			top: 0;
			display: none;
			z-index: 2;
		}

		&.active {
			visibility: visible;

			.popule-container {
				transform: translate3d(0, 0, 0);
			}

			.popule-overlay {
				display: block;
			}
		}
	}
</style>
