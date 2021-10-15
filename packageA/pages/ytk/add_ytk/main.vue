<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-09 10:44:49
-->
<template>
	<view class="add-ytk">
		<view class="plate-num">
			<view class="plate-num-content">
				<view class="content-left">
					<view class="title">车牌号</view>
					<view class="area" @click="plate_picker_show = true">
						{{ plate_value }} <span class="arrow"></span>
					</view>
				</view>
				<view class="content-right">
					<input class="input-item" :value="plate_detail" @input="plateDetailChange" placeholder="填写车牌号" />
				</view>
				<view :class="['btn-small', { disabled: !plate_detail }]" @click="checkCard">查询关联卡片</view>
			</view>
		</view>
		<view class="plate-color">
			<view class="plate-color-title">车牌颜色</view>
			<view class="plate-color-list">
				<view :class="['plate-color-item', { active: item.id == vehicle_color }]" v-for="item in plateColorList" @click="onSelectColor(item)"
				 :key="item.id">{{ item.text }}</view>
			</view>
		</view>
		<view class="input-group">
			<view class="input-group-item">
				<view class="input-group-item__title">粤通卡号</view>
				<view class="input-group-item__inner">
					<input v-model="card_num" placeholder="请输入粤通卡号" />
				</view>
			</view>
		</view>
		<view class="btn-footer">
			<view class="btn-primary" style="color: #FFFFFF; background-color: #FF5C2A;" @click="onSubmit">添加</view>
		</view>
		<car-plate v-model="plate_picker_show" :defautValue="plate_value" @onConfirm="onConfirm" />
	</view>
</template>

<script>
	const app = getApp()
	import { PLATE_COLOR_LIST } from "@/common/constant"
	import * as API from "@/interfaces/ytk"
	import carPlate from "./components/car-plate"
	import { eventMonitor } from "@/common/utils"
	export default {
		data() {
			return {
				query_car_num: "",
				plate_detail: "",
				plate_value: "粤 A",
				plateColorList: PLATE_COLOR_LIST,
				card_num: "",
				vehicle_color: "02",
				vehicle_color_text: "蓝牌",
				plate_picker_show: false,
			};
		},
		components: {
			carPlate,
		},
		computed: {
			plate_number() {
				return this.plate_value.replace(/\s/g, "") + this.plate_detail;
			},
		},
		created() {},
		onShow() {
			this.$token(() => {
				
			});//检测page是否授权，token是否过期
		},
		mounted() {
			eventMonitor("YTK_AddCard_116", 1)
		},
		methods: {
			plateDetailChange(e) {
				this.plate_detail = e.detail.value.toLocaleUpperCase();
			},
			async checkCard() {
				if (!this.plate_detail || !this.plate_value) {
					uni.showToast({
						title: "请输入车牌号",
						icon: "none",
					});
					return;
				}
				let res = await API.getCardByLicense({
					plate_number: this.plate_number,
					vehicle_color: this.vehicle_color,
				});

				this.card_num = res.data.card_num;
				if (this.card_num == "") {
					uni.showToast({
						title: "暂无关联卡号",
						icon: "none",
					});
				}
			},
			onSelectColor({
				id,
				text
			}) {
				this.vehicle_color = id;
				this.vehicle_color_text = text;
			},
			onConfirm(value) {
				this.plate_value = value;
			},
			async onSubmit() {
				eventMonitor("Card_Bottom_YTK_BindCard_116_Button_click", 2)
				if (this.card_num == "") {
					uni.showToast({
						title: "请输入卡号",
						icon: "none",
					});
					return false;
				}
				let res = await API.isBindCard({
					version: "4.4.0",
					cardNo: this.card_num,
				});
				let {
					type,
					phone
				} = res.data;
				// let { type, phone } = { type: 2, phone: "13719477521" };
				if (type == 1) {
					uni.redirectTo({
						url: `/packageA/pages/ytk/bind_result/main?cardNo=${this.card_num}&plate=${this.plate_number}`,
					});
					this.$store.commit("home/mt_new_bill_all_bindCardSuccess", true);
					console.log('假绑---')
				} else {
					uni.redirectTo({
						url: `/packageA/pages/ytk/bind_ytk/main?card_num=${this.card_num}&color_code=${this.vehicle_color}&color_text=${this.vehicle_color_text}&phone=${phone}&plate_number=${this.plate_number}&type=${type}`,
					});
				}
				uni.$emit("etc",{})
			},
		},
		/**
		 * 分享好友/群
		 */
		onShareAppMessage(res) {
			return app.shareAppMessage();
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(res) {
			return app.shareTimeline();
		},
	};
</script>

<style lang="scss" scoped>
	.add-ytk {
		padding: 10rpx 40rpx;

		.plate-num {
			background: #ffffff;

			&-content {
				display: flex;
				align-items: center;
				padding: 40rpx 0rpx;
				border-bottom: 1rpx solid #ebebeb;

				.content-left {
					width: 250rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;

					.title {
						font-size: 32rpx;
						color: #222;
					}

					.area {
						margin-right: 24rpx;
						color: #FF5C2A;

						.arrow {
							display: inline-block;
							width: 0;
							height: 0;
							border-width: 8rpx;
							border-style: solid;
							border-color: #FF5C2A transparent transparent transparent;
							margin: 5rpx 0 0 4rpx;
							vertical-align: middle;
						}
					}

					&:after {
						content: "";
						width: 1rpx;
						height: 30rpx;
						background: #ebebeb;
						position: absolute;
						top: 50%;
						right: 0;
						margin-top: -15rpx;
					}
				}

				.content-right {
					flex: 1;
				}
			}

			&-detail {
				display: flex;
				align-items: center;
				padding: 40rpx 30rpx;
				color: #222;
				font-size: 32rpx;

				.icon-car {
					width: 60rpx;
					height: 60rpx;
				}

				.car-num {
					padding-left: 20rpx;
					padding-right: 34rpx;
				}
			}
		}

		.plate-color {
			padding: 40rpx 0;
			border-bottom: 1rpx solid #efefef;

			&-title {
				color: #222;
				font-size: 30rpx;
				font-weight: 500;
			}

			&-list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
			}

			&-item {
				color: #222222;
				width: 204rpx;
				height: 76rpx;
				line-height: 76rpx;
				text-align: center;
				border: 2rpx solid #ebebeb;
				border-radius: 38rpx;
				margin-top: 40rpx;

				&.active {
					color: #FF5C2A;
					border: 2rpx solid #FF5C2A;
				}
			}
		}
	}
</style>
