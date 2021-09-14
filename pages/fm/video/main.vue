<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: fengzhuojian
 * @Date: 2021-06-22 14:59:31
 * @LastEditors: caiweiyu
 * @LastEditTime: 2021-09-13 16:58:36
-->
<template>
	<view class="content" :style="{width: winW + 'px', height: winH + 'px'}">
		<view :class="['swiper', curTouch.translateTime == true ? 'swiper-animate' : '']" :style="'margin-top:' + (-curTouch.translate) + 'px;'" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
            <view class="swiper-item" v-for="(item,index) in listVideo" :key="index"  @click.stop="videoPlayPuse">
                <!-- 暂停按钮 -->
                <image v-if="showStatus" @click.stop="videoPlayPuse" class='player-image' :src="puaseIcon"></image>
				<!-- 视频组件 -->
				<video class="video"
					   :style="{width: winW + 'px', height: '80%'}" 
					   v-if="index >= curTouch.index - 1 && index <= curTouch.index + 1" 
					   @play="dealPlay(item.id,item.frontImage,item.title)"
                       @pause="dealPause"
                       :id="item.videoId" 
					   :autoplay="false" 
					   :controls="false"
                       :loop="true"
					   :show-center-play-btn="false"
					   :object-fit="'cover'"
					   :src="item.videoUrl"
				>
				</video>
				<!-- 功能组件 -->
				<view class="cover-view">
					<!-- 作者头像昵称 -->
					<view class="author">
						<image class="avatar-url" :src="item.artist.avatar"></image>
						<view class="nick-name">{{item.artist.name}}</view>
					</view>
					<!-- 底部控件 -->
					<view class="base-controls">
						<view class="desc">{{item.title}}</view>
						<view class="btn">
							<view class="comment" @click.stop="commentsList(item)">
                                <image class="comment_image" src="https://image.etcchebao.com/etc-min/info/info.png" mode="" />
								<view class="comment_view">{{item.comentCount}}</view>
							</view>
							<!-- <view class="share hideBtnParent">
								<text>分享</text>
								<button class="hideBtn" open-type="share"></button>
							</view> -->
							<view class="good" @click.stop="clickLike(item,index)">
								<image class="good_image" :src="item.isLike == 1 ? 'https://image.etcchebao.com/etc-min/info/liked.png' : 'https://image.etcchebao.com/etc-min/info/like1.png'" mode="" />
                                <view class="good_view">{{item.likeCount}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    import { videoList,changeVideoLike } from "@/interfaces/info";
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
					numVideo: 10,//每次返回视频数据条数(必须为偶数)
					pageVideo: 1,//视频数据页码
					continiueScroll:true, //处理滑动
                    pageIndex:1,  //当前页下标
                    total:0,    //总条数
                    pageTotal:0,  //页总数
                    pageSize:0,  //页尺
                    total_num:0,

				},
                puaseIcon:"https://image.etcchebao.com/etc-min/info/puase.png",
				winW: 0,
				winH: 0,
				videoContext: "",//视频实例
                listVideo:[], //视频列表
                share:{title:"",imageUrl:"",ID:0}, //分享的参数
                status:true,  //播放开关
                showStatus:false
			}
		},
		mounted() {
            let { ID } = this.$root.$mp.query;
			this.winW = uni.getSystemInfoSync().windowWidth;
			this.winH = uni.getSystemInfoSync().windowHeight;
            this.idValue = ID;
            this.getvideoList(this.idValue);
		},
        /**
         * 分享好友/群
         */
        onShareAppMessage(res) {
            return {
                title: this.share.title,
                imageUrl: this.share.imageUrl,
                path: "/pages/fm/video/main?ID="+this.share.ID
            }
        },
        /**
         * 分享朋友圈
         */
        onShareTimeline(res) {
            return {
                title: this.share.title,
                imageUrl: this.share.imageUrl,
                path: "/pages/fm/video/main?ID="+this.share.ID
            }
        },
		methods: {
            /**
             * 获取视频列表
             */
            getvideoList(data) {
                videoList({
                    videoId: data,  //videoId
                    artistId: 0,
                    source: 0,
                    page: this.curTouch.pageIndex,
                    pageSize:10
                }).then(res=>{
                        let { code, data, msg } = res;
                        if (code == 0 && msg == "success") {
                            this.curTouch.total = data.pager.total;
                            this.curTouch.pageTotal = data.pager.pageTotal;
                            this.curTouch.pageSize = data.pager.pageSize;
                            for(let i=0;i<data.list.length;i++){
                                this.listVideo.push(data.list[i])
                                console.log('data=',data.list[i])
                            }
                            this.curTouch.total_num +=data.list.length;
                            // this.getVideolistbox();
                            this.createVideo(1);
                            console.log("****************************")
                            console.log(this.listVideo)
                            console.log("****************************")
                        }
                });
            },	
            /**
             * 去评论
             */
            commentsList(item){
                uni.navigateTo({
                    url: `/pages/fm/video/main_form?id=${item.id}`
                });
            },
            /**
             * 点赞方法
             */
            clickLike(item,index){
                item.isLike==1 ? this.focusClickfn(item,0,index) : this.focusClickfn(item,1,index);
            },
            /**
             * 点赞
             */
            async focusClickfn(item,param,index){
                let res = await changeVideoLike({
                    videoId:item.id,
                    isLike:param
                })
                let {code,msg,data} = res
                if(code == 0){
                    param ==1 ? this.listVideo[index].isLike = 1 : this.listVideo[index].isLike = 0;
                    param ==1 ? this.listVideo[index].likeCount+=1 : this.listVideo[index].likeCount-=1;
                }
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
             * 播放
             */
            dealPlay(ID,imageurl,title){
                this.share.ID = ID;
                this.share.imageUrl = imageurl;
                this.share.title = title;
                this.showStatus=false;
            },
            /**
             * 暂停
             */
            dealPause(){
                this.showStatus=true;
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
             * 播放/暂停
             */
            videoPlayPuse(){
                let self = this;
                if(self.status){
                    self.videoContext = uni.createVideoContext(self.listVideo[self.curTouch.index].videoId,self);//创建视频组件
                    self.videoContext.pause();
                    self.status = false;
                }else{
                    self.videoContext = uni.createVideoContext(self.listVideo[self.curTouch.index].videoId,self);//创建视频组件
                    self.videoContext.play();
                    self.status = true; 
                }
                
            },
			/**
			 * 视频组件video
			 * 首次create
			 * 多次create
			 */
			createVideo(num) {
                let self = this;
				switch(num) {
					case 1:
						if (self.curTouch.numVideo == self.listVideo.length) {//首次加载成功后播放视频
							self.videoContext = uni.createVideoContext(self.listVideo[self.curTouch.index].videoId,self);//创建视频组件
							self.videoContext.play();
						}
						break;
					case 2:
						console.log('进入1')
						setTimeout(()=>{
							self.videoContext = uni.createVideoContext(self.listVideo[self.curTouch.index].videoId,self);//创建视频组件
                            self.videoContext.stop();
							console.log('进入2')
							setTimeout(()=>{ self.videoContext.play();console.log('进入3') },700)//播放当前视频
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
				//处理滑动太快导致的闪屏
				if (this.curTouch.continiueScroll == false) {
					return
				}
				//处理结束上一个视频音频及播放进度
				this.videoContext = uni.createVideoContext(this.listVideo[this.curTouch.index].videoId,this);//创建视频组件
                this.videoContext.stop();
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
							this.curTouch.pageIndex +=1;
                            this.getvideoList(this.idValue);
                            console.log('加载的视频--',this.curTouch.pageIndex)
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
					this.curTouch.continiueScroll = false;
					setTimeout(()=>{
						this.curTouch.continiueScroll = true;
					},450)
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
								.comment_image{
                                    width: 48rpx;
                                    height: 48rpx;
                                    display: block;
                                }
								.comment_view{
									text-align:center;
								}
							}
							.share {
								margin: 0 0 0 50rpx;
							}
							.good {
                                .good_image{
                                    width: 48rpx;
                                    height: 48rpx;
                                    display: block;
                                }
								.good_view{
									text-align:center;
								}
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
        .player-image{
            z-index:2;
            width: 100rpx;
            height: 100rpx;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
	}
</style>
