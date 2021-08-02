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
		<u-index-list :scrollTop="scrollTop" :active-color="'#d1a86a'" :index-list="vehicleTitle">
			<view v-for="(item,index) in vehicleList" :key="index">
				<u-index-anchor :index="item.brand_type"></u-index-anchor>
				<u-cell-item :title="itemmin.brand_name" :icon="itemmin.brand_icon" :icon-size="48" :arrow="false" v-for="(itemmin,indexmin) in item.brand_list" :key="indexmin" @click.stop="bindCell($event,index,indexmin)"></u-cell-item>
			</view>
		</u-index-list>
		
		<u-popup
			v-model="scroll_view_show"
			mode="right"
			:height="winH"
			@close="popup_close"
		>
			<scroll-view scroll-y="true" class="popule-scroll" :style="'height:' + winH + 'px'">
				<u-cell-item :title="item.model_name" :icon="item.model_icon" :icon-size="100" :arrow="false" v-for="(item,index) in vehicleListDetail" :key="index" @click.stop="bindCellPopup($event,index)" />
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import * as API from "@/interfaces/car"
	import { mapState } from "vuex"
	
	export default {
		computed: {
			...mapState({
				vehicle_type: (state) => state.home.vehicle_type
			})
		},
		data() {
			return {
				vehicleTitle: "",//车辆类型列表title
				vehicleList: "",//车辆类型列表
				vehicleListDetail: "",//车辆管理三级列表
				scrollTop: 0,
				scroll_view_show: false,
				winH: 0,
			}
		},
		onLoad(options) {
			this.loadInit();
		},
		onShow() {
			this.winH = uni.getSystemInfoSync().windowHeight;
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化
			 */
			loadInit() {
				this.loadVehicleType();
			},
			
			/**
			 *	车辆类型列表
			 */
			async loadVehicleType() {
				uni.showLoading({
					title: "加载中...",
				})
				let data = "";
				let res = "";
				if (typeof this.vehicle_type == "object") {
					data = this.vehicle_type;
					this.callbackVehicleType({data});
					setTimeout(()=>{
						uni.hideLoading({});
					},1500)
				} else {
					res = await API.axios_vehicle_type({
						
					})
					data = res.data.car.list;
					this.callbackVehicleType({data});
					this.$store.commit("home/mt_vehicle_type",data);
					uni.hideLoading({});
				}
			},
			callbackVehicleType({
				data
			}) {
				let arr = [];
				for(let i = 0; i < data.length; i++) {
					arr.push(data[i].brand_type);
				}
				this.vehicleTitle = arr;
				this.vehicleList = data;
			},
			
			/**
			 * 选项
			 */
			onSelect(e) {
				console.log(e)
			},
			
			/**
			 * 二级菜单click
			 */
			bindCell(e,index,indexmin) {
				this.scroll_view_show = true;
				this.vehicleListDetail = this.vehicleList[index].brand_list[indexmin].model_list;
			},
			
			/**
			 * 关闭弹窗
			 */
			popup_close(e) {
				this.scroll_view_show = false;
			},
			
			/**
			 * 三级菜单click
			 */
			bindCellPopup(e,index) {
				this.scroll_view_show = false;
				let eventChannel = this.getOpenerEventChannel();
				let obj = this.vehicleListDetail[index];
				eventChannel.on('vehicle', function(data) {
					data.model_cn = obj.model_name;
					data.model_id = obj.model_id;
					eventChannel.emit("vehicle", data);
				})
				uni.navigateBack({});
			}
		},
		onPageScroll(event) {
		    this.scrollTop = event.scrollTop;
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		.popule-scroll {
			width: 520rpx;
			background-color: #FFFFFF;
		}
	}
</style>
