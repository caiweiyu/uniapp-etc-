<!--
 * @Description:
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-03 14:53:47
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-16 18:37:57
-->
<template>
	<div class="bind-car-container">

		<div id="main">
			<!-- <div class="car-info" v-if="card_info.card_no">
                <div
                    class="car-info-content"
                    :style="{
                        'background-image': `url(${card_info.base_img_url})`,
                        'background-size': '100%'
                    }"
                >
                    <div class="car-info-content__header">
                        <img class="icon-yuetongka" :src="card_info.url" />
                        <div class="yuetongka">
                            <div class="yuetongka-name">
                                {{ card_info.card_name }}
                            </div>
                            <div class="yuetongka-num">
                                {{ format_card_no }}
                                <div class="yuetongka-car_num">
                                    {{ options.car_num }}
                                </div>
                            </div>
							<div
                                class="yuetongka-money"
                                v-if="card_info.card_type == 1"
                                @click="toSelectCardBalance"
                            >
                                查看余额
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
			<div class="plate-num">
				<div class="plate-num-content">
					<div class="content-left">
						<div class="title">车牌号</div>
						<div class="area" @click="plate_picker_show = true">
							{{ plate_value }} <span class="arrow"></span>
						</div>
					</div>
					<div class="content-right">
						<input class="input-item" v-model="plate_detail" placeholder="填写车牌号" @input="plateDetailChange"
							maxlength="6" />
					</div>
				</div>
			</div>
			<div class="panel">
				<div class="panel-content">
					<div class="input-group">
						<div class="input-group-item input-group-item-one link" @click.stop="color_picker_show = true">
							<div :class="[{ foucs_active: form['vehicle_color_text'] }]">
								车牌颜色
							</div>
							<div class="input-group-item__inner">
								<input v-model="form['vehicle_color_text']" disabled readonly />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="panel">
				<div class="panel-header">
					<div class="panel-header__title">基本信息(选填)</div>
					<div class="panel-header__value">用于违章查询</div>
				</div>
				<div class="panel-content">
					<div class="input-group">
						<!-- <div class="input-group-item link" @click.stop="color_picker_show = true">
							<div :class="[{ foucs_active: form['vehicle_color_text'] }]">
								车牌颜色
							</div>
							<div class="input-group-item__inner">
								<input v-model="form['vehicle_color_text']" disabled readonly />
							</div>
						</div> -->
						<div class="input-group-item" v-if="vinLength != 0">
							<div :class="[
                                    { foucs_active: form['vin'] }
                                ]">
								{{ vin_tip_text }}
							</div>
							<div class="input-group-item__inner">
								<input v-model="form['vin']" :disabled="!!vin" />
								<i class="icon-tip" @click.stop="driving_license_show = true"></i>
							</div>
						</div>
						<div class="input-group-item " v-if="fdjhLength != 0">
							<div :class="[
                                    { foucs_active: form['engine'] }
                                ]">
								{{ fdjh_tip_text }}
							</div>
							<div class="input-group-item__inner">
								<input v-model="form['engine']" :disabled="!!engine" />
								<i class="icon-tip" @click="driving_license_show = true"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="panel">
				<div class="panel-header">
					<div class="panel-header__title">其他信息(选填)</div>
					<div class="panel-header__value">用来监控保养到期</div>
				</div>
				<div class="panel-content">
					<div class="input-group">
						<div class="input-group-item link" @click="selectBrand">
							<div :class="[
						            { foucs_active: form['model_cn'] }
						        ]">
								选择车型
							</div>
							<div class="input-group-item__inner">
								<input v-model="form['model_cn']" disabled readonly />
							</div>
						</div>
						<div class="input-group-item link" @click.stop="date_picker_show = true">
							<div :class="[
                                    { foucs_active: form['init_login_date'] }
                                ]">
								落地时间
							</div>
							<div class="input-group-item__inner">
								<input disabled readonly v-model="form['init_login_date']" />
							</div>
						</div>
						<div class="input-group-item ">
							<div :class="[
                                    { foucs_active: form['car_km'] }
                                ]">
								行驶公里数
							</div>
							<div class="input-group-item__inner">
								<input v-model="form['car_km']" type="number" />
								<span class="dot">KM</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="tip">
				<p>1.车宝不会通过任何渠道泄漏您的个人信息，请放心填写；</p>
				<p>2.查询违章，请完善车辆车架号码，发动机号认证</p>
			</div>
		</div>
		<view class="btn">
			<view class="del" v-if="query_car_id" @click="delCar">删除</view>
			<view :class="query_car_id ? 'boxmin' : 'boxmax'" @click.native="onSubmit">确认保存</view>
		</view>

		<!-- ************************** -->
		<!-- 请选择落地时间 -->
		<!-- ************************** -->
		<u-picker v-model="date_picker_show" mode="time" :default-time="defaultTime" title="请选择落地时间" :params="params" :start-year="startYear" :end-year="endYear" confirm-color="#FF5C2A"
			@confirm="onDatetimeConfirm" @cancel="date_picker_show = false" />

		<!-- ************************** -->
		<!-- 选择车辆颜色 -->
		<!-- ************************** -->
		<u-picker v-model="color_picker_show" mode="selector" :default-selector="defaultSelectorColor ? [defaultSelectorColor] : [0]" :range="color_columns" title="选择车辆颜色"
			@confirm="onColorConfirm" @cancel="color_picker_show = false" range-key="text" confirm-color="#FF5C2A" />

		<!-- ************************** -->
		<!-- 驾驶证照片弹窗 -->
		<!-- ************************** -->
		<u-popup v-model="driving_license_show" mode="center" height="auto">
			<img src="https://image.etcchebao.com/etc-min/etc-f/icon_11.png" class="driving_license" />
			<div class="driving-close">
				<u-icon name="close" size="28" color="#f4f4f4" @click="driving_license_show = false" />
			</div>
		</u-popup>

		<!-- ************************** -->
		<!-- 车牌号picker组件 -->
		<!-- ************************** -->
		<car-plate v-model="plate_picker_show" :defautValue="plate_value" @onConfirm="onPlateConfirm" />
		<!-- <u-picker
			mode="multiSelector"
			v-model="plate_picker_show"
			:range="plate_multiSelector"
			title="选择车牌号"
			@confirm="onPlateConfirm"
			@cancel="plate_picker_show = false"
			@columnchange="columnchange"
			:default-selector='[0, 0]'
			confirm-color="#FF5C2A"
		/> -->

	</div>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()
	
	import * as API from "@/interfaces/car"
	// import etccb from "etccb-utils";
	import carPlate from "./components/car-plate"
	import {
		formatCardNum
	} from "@/common/utils"

	export default {
		components: {
			carPlate
		},
		data() {
			return {
				date_picker_show: false,
				color_picker_show: false,
				plate_picker_show: false,
				driving_license_show: false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				startYear: "",//开始落地时间
				endYear: "",//结束落地时间
				defaultTime: "",//默认落地时间
				defaultSelectorColor: "",//默认车牌颜色index
				//02=蓝牌，01=黄牌，06=黑牌，98=白色，97=蓝白渐变色，4=渐变绿色，5=黄绿双拼色
				plate_detail: "",
				form: {
					engine: "",
					plate_num: "",
					vin: "",
					vehicle_color: "",
					vehicle_color_text: "",
					model_cn: "",
					model_id: "",
					init_login_date: "",
					car_km: "",
					// version: etccb.cookie.getCookie("clientVersion") || "",
					query_from: 2,
					source: "" // 渠道来源 http://wiki.etcchebao.cn/pages/viewpage.action?pageId=3244174
				},
				color_columns: [{
						id: "02",
						text: "蓝牌"
					},
					{
						id: "01",
						text: "黄牌"
					},
					{
						id: "06",
						text: "黑牌"
					},
					{
						id: "98",
						text: "白色"
					},
					{
						id: "97",
						text: "蓝白渐变色"
					},
					{
						id: "4",
						text: "渐变绿色"
					},
					{
						id: "5",
						text: "黄绿双拼色"
					}
				],
				provincesList: [],
				vinLength: 99,
				fdjhLength: 99,
				car_info: {},
				card_info: {},
				query_car_num: "",
				query_card_no: "",
				query_car_color: "",
				query_car_id: "",
				engine: "", //用于判断是否可以修改发动机号，如果值存在则不允许修改
				vin: "", //同上

				plate_detail: "",
				plate_value: "粤 A",
				options: "", //page参数
			};
		},
		computed: {
			// format_card_no() {
			//     return formatCardNum(this.card_info.card_no);
			// },
			vin_tip_text() {
				return this.vinLength == 99 ?
					"车架号" :
					`车架号后${this.vinLength}位`;
			},
			fdjh_tip_text() {
				return this.fdjhLength == 99 ?
					"发动机号" :
					`发动机号后${this.fdjhLength}位`;
			},
			whole_plate_number() {
				return `${this.plate_value}${this.plate_detail}`.replace(/\s/g, "");
			}
		},
		watch: {

		},
		onLoad(options) {
			this.options = options;
			this.form.source = options.source;
			let {
				car_num = "",
					card_no = "",
					car_color = "",
					car_id = ""
			} = options;
			this.query_car_num = car_num || "";
			this.query_card_no = card_no || "";
			this.query_car_color = car_color || "";
			this.query_car_id = car_id || "";
			this.form.source = options.source || "";
			this.init();
		},
		onShow() {
			this.$token(() => {
				this.options = this.$root.$mp.query;
				this.form.source = this.options.source;
				let {
					car_num = "",
						card_no = "",
						car_color = "",
						car_id = ""
				} = options;
				this.query_car_num = car_num || "";
				this.query_card_no = card_no || "";
				this.query_car_color = car_color || "";
				this.query_car_id = car_id || "";
				this.form.source = options.source || "";
				this.init();
			}); //检测page是否授权，token是否过期
		},
		onReady() {
			this.defaultTime = miniapp.clockwise().year + '-' + miniapp.clockwise().month + "-" + miniapp.clockwise().date;
			this.startYear = miniapp.clockwise().year - 20;
			this.endYear = miniapp.clockwise().year;
		},
		mounted() {

		},
		methods: {
			/**
			 * 初始化
			 */
			init() {
				this.getProviceList();
				this.getCarRule();
				//如果链接参数有车牌号，则查询有无相关粤通卡信息和车辆信息
				if (this.query_car_num) {
					this.getCardInfo(); //获取卡信息和车辆详情
					// this.getCarInfo(); //获取位置车辆详情
				}
				//如果链接参数有车牌颜色，则通过key 去查找对应的中文键值
				if (this.query_car_color) {
					let color_text = this.color_columns.find(item => {
						return item.id == this.query_car_color;
					}).text;
					this.form["vehicle_color_text"] = color_text;
				}
			},

			/**
			 * 转换字母大写格式
			 */
			plateDetailChange(e) {
				this.plate_detail = e.detail.value.toLocaleUpperCase();
			},

			/**
			 * cjCode：车架号码 fdjCode：发动机号
			 */
			setCarInfo(cjCode, fdjCode) {
				if (this.vinLength != 0 && this.vinLength != 99) {
					let cj_code = cjCode.match(`.*(.{${this.vinLength}})`);
					if (cj_code) {
						this.form["vin"] = cj_code[1];
					}
				}
				if (this.fdjhLength != 0 || this.fdjhLength != 99) {
					let fdj_code = fdjCode.match(`.*(.{${this.fdjhLength}})`);
					if (fdj_code) {
						this.form["engine"] = fdj_code[1];
					}
				}
			},

			/**
			 * 删除车辆
			 */
			delCar() {
				uni.showModal({
					title: "删除车辆",
					content: "删除后无法使用违章、限行提醒等平台服务，确定删除？",
					confirmColor: "#FF5C2A",
					confirmText: "确认",
					success: (res) => {
						if (res.confirm) {
							this.callbackDelCar();
						}
					}
				})
			},
			async callbackDelCar() {
				try {
					let res = await API.axios_delcar({
						plate_number: this.query_car_num,
						card_no: this.query_card_no,
						id: this.query_car_id
					});
					if (res.code == 0) {
						uni.navigateBack({})
					}
				} catch (error) {}
			},

			/**
			 * 车架号发动机号信息匹配
			 */
			async carPlateInfo(car_type) {
				let res = await API.axios_carplateinfo({
					plate_num: this.whole_plate_number,
					car_type
				});
				if (res.data.length == 0) {
					return;
				}
				this.setCarInfo(res.car_carr, res.car_eng);
			},

			/**
			 * 获取车辆信息
			 */
			async getCardInfo() {
				let {
					car_num,
					card_no
				} = this.options;
				let res = await API.axios_getcarinfo({
					plate_number: this.query_car_num,
					card_no: this.query_card_no
				});
				let {
					car_info,
					card_info
				} = res.data;

				//为空返回空数组[]，不为空返回对象{}
				if (Object.keys(card_info).length > 0) {
					this.card_info = card_info;
				}
				//为空返回空数组[]，不为空返回对象{}
				if (Object.keys(car_info).length > 0) {
					this.car_info = car_info;
					let {
						carriage_num,
						engine_num,
						car_time,
						car_km,
						model_cn,
						brand_cn,
						color_words,
						car_color,
						model_id,
						province,
						city_code,
						plate_num,
						init_login_date
					} = car_info;
					this.form["engine"] = engine_num;
					this.form["vin"] = carriage_num;
					this.form["vehicle_color"] = car_color;
					this.form["vehicle_color_text"] = color_words;
					this.form["model_cn"] = model_cn;
					this.form["model_id"] = model_id;
					this.form["init_login_date"] = init_login_date;
					this.form["car_km"] = car_km;
					this.plate_detail = plate_num.substring(2);
					this.engine = engine_num;
					this.vin = carriage_num;
				} else {
					this.plate_detail = this.query_car_num.substring(2);
					this.form["vehicle_color"] = this.query_car_color;
				}
			},

			/**
			 * 获取车牌信息列表
			 */
			async getProviceList() {
				let res = await API.axios_getprovicelist({

				})
				this.provincesList = res;
				let plate_provice = [];
				let plate_num = [];
			},

			/**
			 * 车牌号picker组件
			 * 回调函数
			 */
			onPlateConfirm(value) {
				this.plate_value = value;
			},

			/**
			 * 车牌校验规格
			 */
			async getCarRule() {
				let {
					car_num
				} = this.options;
				let plate_num_prefix = "";
				//如果有传来车牌号则用传来的车牌
				if (car_num) {
					car_num = car_num.trim(); //去除前后空格
					plate_num_prefix = car_num.substring(0, 1);
				} else {
					//反之取选择的的车牌号
					// plate_num_prefix = this.plate_value.substr(1);
				}

				let res = await API.axios_getcarrule({
					query_type: 1,
					plate_num_prefix
				});
				if (res.length > 0) {
					let {
						fdjhLength,
						vinLength
					} = data[0];
					this.vinLength = vinLength; //车架长度后几位     0 不需要  99 是全部   其余代表后几位
					this.fdjhLength = fdjhLength; //发动机好后几位   0 不需要  99 是全部   其余代表后几位
				}
			},

			/**
			 * 确认提交（校验）
			 */
			onSubmit() {
				this.form[
					"plate_num"
				] = `${this.plate_value}${this.plate_detail}`.replace(/\s/g, "");
				let {
					vin,
					engine,
					vehicle_color
				} = this.form;
				if (!this.plate_detail || !this.plate_value) {
					uni.showToast({
						title: "请输入车牌号",
						mask: true,
						duration: 1500,
						icon: "none"
					})
					return;
				}
				if (this.plate_detail.length < 5 || this.plate_detail.length > 6) {
					uni.showToast({
						title: "请输入正确的车牌号码",
						mask: true,
						duration: 1500,
						icon: "none"
					})
					return
				}
				if (!vehicle_color) {
					uni.showToast({
						title: "请选择车牌颜色",
						mask: true,
						duration: 1500,
						icon: "none"
					})
					return;
				}
				// if (this.vinLength != 0 && !vin) {
				// 	uni.showToast({
				// 		title: "请输入" + this.vin_tip_text,
				// 		mask: true,
				// 		duration: 1500,
				// 		icon: "none"
				// 	})
				// 	return;
				// }
				// if (this.fdjhLength != 0 && !engine) {
				// 	uni.showToast({
				// 		title: "请输入" + this.fdjh_tip_text,
				// 		mask: true,
				// 		duration: 1500,
				// 		icon: "none"
				// 	})
				// 	return;
				// }
				this.saveCar();
			},

			/**
			 * 确认提交
			 */
			async saveCar() {
				let res = await API.axios_savecar(
					this.form
				);
				let {
					car_id = ""
				} = this.options;
				if (res.code == 0) {

				} else { //未通过校验
					uni.showToast({
						title: res.msg,
						mask: true,
						duration: 1500,
						icon: "none"
					})
					return;
				}
				//如果有车辆id 则默认编辑状态，保存返回上一层,反之到跳到绑定成功页面
				if (car_id) { // 编辑车辆
					uni.navigateBack({

					})
				} else { // 新增车辆
					uni.redirectTo({
						url: "/packageA/pages/ytk/bind_car/success?source=" + this.form["source"]
					})
				}
				uni.$emit("carc",{})
			},

			/**
			 * 车辆颜色确认button
			 */
			onColorConfirm(e) {
				let id = this.color_columns[e[0]].id;
				let text = this.color_columns[e[0]].text;
				this.form["vehicle_color"] = id;
				this.form["vehicle_color_text"] = text;
				this.color_picker_show = false;
				this.defaultSelectorColor = e[0];
				this.carPlateInfo(id);
			},

			/**
			 * 选择车型
			 */
			selectBrand() {
				uni.navigateTo({
					url: "/packageA/pages/ytk/bind_car/vehicle_type",
					events: {
						vehicle: function(data) {
							this.model_cn = data.model_cn;
							this.model_id = data.model_id;
						}
					},
					success: (res) => {
						res.eventChannel.emit("vehicle", this.form)
					}
				})
			},

			/**
			 * 落地时间确认按钮
			 */
			onDatetimeConfirm(date) {
				console.log(date)
				this.form["init_login_date"] = date.year + '-' + date.month;
				this.defaultTime = date.year + '-' + date.month + "-01" ;
				this.date_picker_show = false;
			}
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
	.popup-background {
		background: none;
	}

	.van-picker__cancel {
		color: #999999;
	}

	.van-picker__confirm {
		color: #FF5C2A;
	}

	.driving_license {
		display: block;
		width: 650rpx;
		height: 438rpx;
		max-width: 650rpx;
	}

	.driving-close {
		text-align: center;
		margin: 40rpx auto 0 auto;
	}

	.bind-car-container {
		padding: 0 0 130rpx 0;
		color: #222222;

		.car-info {
			&-content {
				position: relative;
				width: 690rpx;
				height: 340rpx;
				display: block;
				margin: 20rpx auto;
				box-sizing: border-box;
				padding: 40rpx;

				&__header {
					display: flex;

					.icon-yuetongka {
						width: 72rpx;
						height: 72rpx;
					}

					.yuetongka {
						margin-left: 20rpx;
						font-size: 30rpx;

						&-name {
							color: #fff;
						}

						&-num {
							color: rgba($color: #ffffff, $alpha: 0.6);
							padding-top: 10rpx;
						}

						&-car_num {
							margin-top: 48rpx;
							color: #fff;
							font-size: 46rpx;
						}

						&-money {
							position: absolute;
							color: #ffffff;
							font-size: 28rpx;
							display: flex;
							align-items: center;
							bottom: 40rpx;
							right: 40rpx;

							&::after {
								content: "";
								display: inline-block;
								width: 0;
								height: 0;
								border-width: 14rpx;
								border-style: solid;
								border-color: transparent transparent transparent #ffffff;
								margin-left: 12rpx;
							}
						}
					}
				}
			}
		}

		.plate-num {
			background: #ffffff;

			&-content {
				display: flex;
				align-items: center;
				padding: 40rpx 30rpx;

				.content-left {
					width: 240rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;

					.title {
						font-size: 32rpx;
						font-weight: 500;
						color: #222;
					}

					.area {
						color: #FF5C2A;
						font-weight: 500;
						margin-right: 24rpx;

						.arrow {
							display: inline-block;
							width: 0;
							height: 0;
							border-width: 8rpx;
							border-style: solid;
							border-color: #FF5C2A transparent transparent transparent;
							margin-top: 10rpx;
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
					margin-left: 24rpx;
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

		.input-item {
			font-size: 32rpx;
		}

		.panel {
			background: #fff;

			&-header {
				height: 70rpx;
				padding: 0 30rpx;
				background: #f9f9f9;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;

				&__title {
					color: #666;
				}

				&__value {
					color: #FF5C2A;
				}
			}

			&-content {
				padding-left: 30rpx;

				.input-group {
					&-item-one {
						font-size: 32rpx;
						border-top: 1rpx solid #efefef;
					}

					&-item {
						position: relative;
						padding: 50rpx 30rpx 23rpx 0;

						&__title {
							position: absolute;
							transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
							font-size: 32rpx;
							color: #cccccc;
							top: 68rpx;
							left: 0;
							pointer-events: none;

							&.foucs_active {
								top: 24rpx;
								font-size: 24rpx;
								color: #666666;
							}
						}

						&__inner {
							// margin-top: 20rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.icon-tip {
								background: url("https://image.etcchebao.com/etc-min/etc-f/icon_10.png");
								background-size: 100%;
								width: 31rpx;
								height: 31rpx;
							}

							.dot {
								font-size: 32rpx;
								color: #222;
							}

							input {
								background: none;
								width: 90%;
							}

							input[disabled] {
								color: #222;
								opacity: 1;
							}
						}

						&:not(:last-child) {
							&:after {
								content: "";
								position: absolute;
								bottom: 0;
								left: 0;
								height: 1rpx;
								width: 100%;
								background: #ebebeb;
								transform: scaleY(0.5);
							}
						}

						&.link {
							&:before {
								content: "";
								display: block;
								width: 12rpx;
								height: 12rpx;
								border-width: 1rpx;
								border-style: solid;
								border-color: #666 #666 transparent transparent;
								position: absolute;
								right: 30rpx;
								top: 50%;
								transform: rotate(45deg) translateY(-50%);
							}
						}
					}
				}
			}
		}

		.tip {
			color: #999;
			padding: 30rpx;
			font-size: 24rpx;
		}

		.btn {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 140rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;

			.del {
				margin-right: 20rpx;
				width: 230rpx;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 36rpx;
				color: #999999;
				border: 1rpx solid #CCCCCC;
				box-sizing: border-box;
				border-radius: 100rpx;
			}

			.boxmin {
				width: 420rpx;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 36rpx;
				background-color: #FF5C2A;
				color: #FFFFFF;
				border-radius: 100rpx;
			}

			.boxmax {
				width: 670rpx;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 36rpx;
				background-color: #FF5C2A;
				color: #FFFFFF;
				border-radius: 100rpx;
			}
		}
	}
</style>
