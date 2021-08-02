<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-22 14:59:31
 * @LastEditors: fengzhuojian
 * @LastEditTime: 2021-06-23 15:58:36
-->
<template>
	<view class="content" :style="{width: winW + 'px', height: winH + 'px'}">
		<view :class="['swiper', curTouch.translateTime == true ? 'swiper-animate' : '']" :style="'margin-top:' + (-curTouch.translate) + 'px;'" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
			<view class="swiper-item" v-for="(item,index) in listVideo" :key="index">
				<!-- 视频组件 -->
				<video class="video"
					   :style="{width: winW + 'px', height: winH + 'px'}" 
					   v-if="index >= curTouch.index - 1 && index <= curTouch.index + 1" 
					   :id="item.video_id" 
					   :autoplay="false" 
					   :controls="false"
					   :show-center-play-btn="false"
					   object-fit="contain"
					   :poster="'https://image.etcchebao.com/etc-min/share_icon.png'"
					   :src="'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4'"
				>
				</video>
				<!-- 功能组件 -->
				<view class="cover-view">
					<!-- 作者头像昵称 -->
					<view class="author">
						<image class="avatar-url" src="https://image.etcchebao.com/etc-min/share_icon.png"></image>
						<view class="nick-name">etc车宝</view>
					</view>
					<!-- 底部控件 -->
					<view class="base-controls">
						<view class="desc">编译成功。前端运行日志，请另行在小程序开发工具的控制台查看请另行在小程序开发工具的控制台查看</view>
						<view class="btn">
							<view class="comment">
								<text>评论</text>
							</view>
							<view class="share hideBtnParent">
								<text>分享</text>
								<button class="hideBtn" open-type="share"></button>
							</view>
							<view class="good">
								<text>点赞</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/* 可由调用出传入 */ 
				curTouch: {
					startX: 0,
					startY: 0,
					moveX: 0,
					moveY: 0,
					endX: 0,
					endY: 0,
					ratioY: 0,//Y轴滑动距离
					timeSatrt: 0,//初始touchStart时间
					timeEnd: 0,//结束touchEnd时间
					timeFast: 500,//快速翻页时间临界值
					unitFast: 30,//快速翻页临界值
					unit: uni.getSystemInfoSync().windowHeight * 0.3,//临界值
					lock: true,//禁止move超出区间计算
					translate: 0,//当前平移距离
					translateHistory: 0,//历史平移距离
					translateTime: false,//是否开启transition过渡
					index: 0,//当前视频index
					isVodeo: true,//是否还有视频返回
					numVideo: 4,//每次返回视频数据条数(必须为偶数)
					pageVideo: 1,//视频数据页码
				},
				winW: 0,
				winH: 0,
				listVideo: [],//视频列表
				videoContext: "",//视频实例
			}
		},
		mounted() {
			this.winW = uni.getSystemInfoSync().windowWidth;
			this.winH = uni.getSystemInfoSync().windowHeight;
			this.loadVideo();
		},
		methods: {
			/**
			 * 随机数
			 */
			myRotate(max, min) {
				return Math.floor(Math.random() * (max - min) + min);
			},
			
			/**
			 * 加载listVideo
			 */
			loadVideo(e) {
				let arr = [];
				for(let i = 0; i < this.curTouch.numVideo; i++) {
					arr.push({
						name: "abc",
						video_id: "video_" + this.myRotate(1000,0)
					});
				}
				this.listVideo = [...this.listVideo, ...arr];
				this.createVideo(1);
				console.log("****************************")
				console.log(this.listVideo)
				console.log("****************************")
			},
			
			/**
			 * 滑动置顶
			 */
			swiperTop(e) {
				uni.showToast({
					title: "已经是第一个视频",
					icon: "none",
					mask: true,
					duration: 1500
				})
			},
			/**
			 * 上一个
			 */
			swiperPre(e) {
				this.createVideo(2);
			},
			
			/**
			 * 下一个
			 */
			swiperNext(e) {
				this.createVideo(2);
			},
			/**
			 * 滑动置底
			 * 没有更多视频
			 */
			swiperNone(e) {
				uni.showToast({
					title: "没有更多视频了",
					icon: "none",
					mask: true,
					duration: 1500
				})
			},
			
			/**
			 * 视频组件video
			 * 首次create
			 * 多次create
			 */
			createVideo(num) {
				switch(num) {
					case 1:
						if (this.curTouch.numVideo == this.listVideo.length) {//首次加载成功后播放视频
							this.videoContext = uni.createVideoContext(this.listVideo[this.curTouch.index].video_id,this);//创建视频组件
							this.videoContext.play();
						}
						break;
					case 2:
						setTimeout(()=>{
							this.videoContext.stop();
							this.videoContext = uni.createVideoContext(this.listVideo[this.curTouch.index].video_id,this);//创建视频组件
							setTimeout(()=>{ this.videoContext.play(); },700)//播放当前视频
						},10)//关闭上次视频
						break;
				} 
			},
			
			/**
			 * touch事件回调
			 * 1 next
			 * 2 pre
			 */
			callBackTouch(num) {
				switch(num) {
					case 1:
						if ((this.curTouch.index + 1) == this.listVideo.length && !this.curTouch.isVodeo) {//视频库没有资源返回,最后一个视频
							this.curTouch.translate = this.curTouch.translateHistory;
							this.curTouch.translateHistory = this.curTouch.translate;
							this.swiperNone();
						} else {//下一个视频
							this.curTouch.translate = this.curTouch.translateHistory + this.winH;
							this.curTouch.translateHistory = this.curTouch.translate;
							this.curTouch.index += 1;
							this.swiperNext();
						}
						// 预加载视频数据
						// 加载数据index为每轮数据1/2(待预览数据在当前加载index，永远多1又1/2条，单位是numVideo)
						// 满足isVodeo为true
						if ((this.curTouch.index + 1) == this.listVideo.length - (this.curTouch.numVideo / 2) && this.curTouch.isVodeo) {
							this.loadVideo();
						}
						this.curTouch.translateTime = true;
						break;
					case 2:
						if (this.curTouch.translateHistory == 0) {//已经是第一个视频
							this.curTouch.translate = 0;
							this.curTouch.translateHistory = 0;
							this.curTouch.index = 0;
							this.swiperTop();
						} else {//上一个视频
							this.curTouch.translate = this.curTouch.translateHistory - this.winH;
							this.curTouch.translateHistory = this.curTouch.translate;
							this.curTouch.index -= 1;
							this.swiperPre();
						}
						this.curTouch.translateTime = true;
						break;
				}
			},
			
			/**
			 * 触屏开始
			 */
			touchstart(e) {
				this.curTouch.startX = e.changedTouches[0].clientX;
				this.curTouch.startY = e.changedTouches[0].clientY;
				this.curTouch.timeSatrt = new Date().getTime();
				this.curTouch.lock = true;
				this.curTouch.translateTime = false;
			},
			
			/**
			 * 触屏中
			 */
			touchmove(e) {
				this.curTouch.moveX = e.changedTouches[0].clientX;
				this.curTouch.moveY = e.changedTouches[0].clientY;
				this.ratioY = this.curTouch.startY - this.curTouch.moveY;
				let ratioY = this.ratioY;
				if (this.curTouch.lock == true) {
					this.curTouch.translate = ratioY + this.curTouch.translateHistory;
				}
				if (Math.abs(ratioY) >= this.curTouch.unit && ratioY > 0 && this.curTouch.lock == true) {//满足临界值,next操作
					this.callBackTouch(1);
					this.curTouch.lock = false;
					// console.log("触屏中","next",ratioY,this.curTouch.translate,this.curTouch.translateHistory)
				} 
				if (Math.abs(ratioY) >= this.curTouch.unit && ratioY < 0 && this.curTouch.lock == true) {//满足临界值,pre操作
					this.callBackTouch(2);
					this.curTouch.lock = false;
					// console.log("触屏中","pre",ratioY,this.curTouch.translate,this.curTouch.translateHistory)
				}
			},
			
			/**
			 * 触屏结束
			 */
			touchend(e) {
				this.curTouch.endX = e.changedTouches[0].clientX;
				this.curTouch.endY = e.changedTouches[0].clientY;
				this.curTouch.timeEnd = new Date().getTime();
				let fastY = this.curTouch.startY - this.curTouch.endY;
				let fastT = this.curTouch.timeEnd - this.curTouch.timeSatrt;
				if (fastT <= this.curTouch.timeFast && Math.abs(fastY) >= this.curTouch.unitFast && this.curTouch.lock == true) {//满足快速翻页
					if (fastY > 0) {//next操作
						this.callBackTouch(1);
					} else {//pre操作
						this.callBackTouch(2);
					}
				} else {//未满足快速翻页
					if (Math.abs(this.ratioY) < this.curTouch.unit) {//未满足切换临界值(恢复位置)
						this.curTouch.translate = this.curTouch.translateHistory;
					}
				}
				this.curTouch.lock = true;
				this.curTouch.translateTime = true;
			}
		}
	}
</script>

<style lang="scss">
	.hideBtn {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	.hideBtnParent {
		position: relative;
	}
	.content {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99999;
		background-color: rgba(0,0,0,1);
		overflow: hidden;
		.swiper {
			width: 100%;
			height: 100%;
			.swiper-item {
				position: relative;
				width: 100%;
				height: 100%;
				color: #FFFFFF;
				.video {
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
				}
				.cover-view {
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					.author {
						margin: 40rpx 40rpx 0 40rpx;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						align-items: center;
						.avatar-url {
							width: 68rpx;
							height: 68rpx;
							border-radius: 100%;
						}
						.nick-name {
							margin: 20rpx;
							font-size: 32rpx;
						}
					}
					.base-controls {
						position: absolute;
						left: 40rpx;
						bottom: 40rpx;
						width: 670rpx;
						.desc {
							width: 100%;
							font-size: 32rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						.btn {
							position: relative;
							margin: 20rpx 0 0 0;
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							align-items: center;
							font-size: 24rpx;
							.comment {
								
							}
							.share {
								margin: 0 0 0 50rpx;
							}
							.good {
								position: absolute;
								right: 0;
								top: 50%;
								transform: translate(0,-50%);
							}
						}
					}
				}
			}
		}
		.swiper-animate {
			transition: margin-top linear 0.45s;
		}
	}
</style>
