<template>
	<view class="wrap">
		<view class="wrap_header">
			<u-tabs ref="uTabs" :list="listNav" :barHeight="4" :barWidth="48" :active-color="'#FF5C2A'" :bold="true" :duration="0" :inactive-color="'#222222'" font-size="28" :current="swiperCurrent" @change="tabsChange" :is-scroll="true"
			 swiperWidth="750"></u-tabs>
		</view>
		<swiper class="swiper" :duration="0" :current="swiperCurrent"  @change="handlerSwiper">
			 <swiper-item @touchmove.stop='stopTouchMove' v-show="index==swiperCurrent" class="swiper_item" v-for="(v, index) in flowList" :key="index">
				 <scroll-view
						refresher-enabled="true"
						:scroll-y="true"
						:refresher-triggered="triggered" :refresher-threshold="80" refresher-background="#F0F0F0"
						@refresherrefresh="onRefresh(index)" @refresherrestore="onRestore" @refresherabort="onAbort"
						@scrolltolower="$debounce(changeRfswaterFall,index)"
						:scroll-top="scrollTops"
						:scroll-with-animation="true"
						@scroll="scrollChange"
						class="swiper_item_scroll">
						<view class="container" v-if="index==0 && banner_list.length > 0">
							<swiper class="swiper1"
									v-model="banner_list"
									:previous-margin="previousmargin"
									:next-margin="nextmargin"
									:autoplay="true"
									:interval="3000"
									:duration="300"
									:indicator-dots="indicatorDots"
									:indicator-color="indicatorColor"
									:indicator-active-color="indicatorActiveColor"
									:circular="true"
									@change="bindchange">
									<swiper-item class="swiper1_item" :style="{marginTop:'32rpx'}" v-for="(item,index) in banner_list" :key="index" @click="toUrllinkBanner(item)">
											<image :src="item.imageUrl" class="swiper1_item_img" mode="widthFix"></image>
											<text class="swiper1_item_text">{{item.title}}</text>
											<view class="swiper1_item_view"></view>
									</swiper-item>
							</swiper>
							<view class="dots">
								<view :class="['box', swiper_current == index ? 'active' : '']" v-for="(item, index) in banner_list"
									:key="index"></view>
							</view>
						</view>
						<u-waterfall v-model="flowList[index]" v-if="flowList[index].length > 0" :ref="'uWaterfall'+`${index}`" >
							<template v-slot:left="{leftList}">
								<view :class="['demo-warter',index1==0 ? 'demo-water-right0' : 'demo-water-left']"  @click="toUrllink(item)" v-for="(item, index1) in leftList" :key="index1">
									<block v-if="item.displayType == 2">
										<u-lazy-load :errorImg="item.imgOwn" :loadingImg="item.imgOwn" :threshold="winH" border-radius="12rpx 12rpx 0 0;" :image="item.imageList[0] || item.frontImgUrl || item.frontImg2Url || item.frontImage || item.imgOwn" :index="index1"></u-lazy-load>
									</block>
									<block v-else>
										<u-lazy-load :errorImg="item.imgOwn" :loadingImg="item.imgOwn" :threshold="winH" border-radius="12rpx 12rpx 0 0;" :image="item.frontImgUrl || item.frontImg2Url || item.frontImage || item.imgOwn" :index="index1"></u-lazy-load>
									</block>
									<image v-if="item.type_id == 2" class="isVedio" src="https://image.etcchebao.com/etc-min/info/video_mark.png"></image>
									<view class="avtor">
										<view class="demo-title">
											{{item.title}}
										</view>
										<view class="item">
											<view class="demo-price">
												{{item.publishTime  || item.createTime}}
											</view>
											<view class="demo-time">
												<!-- <image src="https://image.etcchebao.com/etc-min/info/touch_active.png" v-if="item.isLike==1" mode="" class="demo-time-image"></image> -->
												<image src="https://image.etcchebao.com/etc-min/info/touch.png" mode="" class="demo-time-image" ></image>
												<text class="demo-time-text" v-if="item.totalLike == 0 || item.likeCount == 0">???</text>
												<text class="demo-time-text" v-else>{{item.totalLike || item.likeCount}}</text>
											</view>
										</view>
									</view>
								</view>
							</template>
							<template v-slot:right="{rightList}">
								<view :class="['demo-warter',index2==0 ? 'demo-water-right1' : 'demo-water-right']"  @click="toUrllink(item)" v-for="(item, index2) in rightList" :key="index2">
									<block v-if="item.displayType == 2">
										<u-lazy-load :errorImg="item.imgOwn" :loadingImg="item.imgOwn" :threshold="winH" border-radius="12rpx 12rpx 0 0;" :image="item.imageList[0] || item.frontImgUrl || item.frontImg2Url || item.frontImage || item.imgOwn" :index="index2"></u-lazy-load>
									</block>
									<block v-else>
										<u-lazy-load :errorImg="item.imgOwn" :loadingImg="item.imgOwn" :threshold="winH" border-radius="12rpx 12rpx 0 0;" :image="item.frontImgUrl || item.frontImg2Url || item.frontImage || item.imgOwn" :index="index2"></u-lazy-load>
									</block>
										<image v-if="item.type_id == 2" class="isVedio" src="https://image.etcchebao.com/etc-min/info/video_mark.png"></image>
										<view class="avtor">
											<view class="demo-title">
											{{item.title}}
											</view>
											<view class="item">
												<view class="demo-price">
													{{item.publishTime  || item.createTime}}
												</view>
												<view class="demo-time">
													<!-- <image src="https://image.etcchebao.com/etc-min/info/touch_active.png" v-if="item.isLike==1" mode="" class="demo-time-image"></image> -->
													<image src="https://image.etcchebao.com/etc-min/info/touch.png" mode="" class="demo-time-image"></image>
													<text class="demo-time-text" v-if="item.totalLike == 0 || item.likeCount == 0">???</text>
													<text class="demo-time-text" v-else>{{item.totalLike || item.likeCount}}</text>
												</view>
											</view>
										</view>
								</view>
							</template>
						</u-waterfall>
					<u-loadmore v-if="flowList[index].length > 0" bg-color="rgb(240, 240, 240)" :status="loadStatus"  @loadmore="addRandomData"></u-loadmore>
					<!--?????????????????????-->
					<view v-else-if="loadStatus=='nomore' && flowList[index].length==0" class="noCard">
						<image class="noCard_image" src="https://image.etcchebao.com/etc-min/info/noCard.png" mode="" />
						<text class="noCard_text">???????????????????????????????????????????????????</text>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!--????????????-->
		<view class="top" @click="topScroll" v-show="isShow">
			<image class="top_img" src="https://image.etcchebao.com/etc-min/mine/top.png"></image>
		</view>
		<!-- ???????????? -->
		<DialogWindow ref="dialog" flag="8"></DialogWindow>
	</view>
</template>

<script>
	const app = getApp()
	import DialogWindow from "@/components/dialog-window"
	import {mapState} from "vuex"
	import {
		 articleList,
         tabList,
         bannerList,
         dataList,
         tabVideoList,
		articleDetail,
		articleClick
	}from "@/interfaces/info"
	import { eventMonitor } from "@/common/utils"
	export default {
		data() {
			return {
				loadStatus: 'loading',
				flowList: [],
				flow_num: [],
				info_list:[],
                /*** tab?????????*********/
                scrollPosition:0,
                listNav:[],
                /**********banner???****** */
                banner_list:[],
                /**********??????????????????***********/
                // list:[],
                /*************??????????????????**********/
                params:[],
                res_params:[],
                /******************??????????????????*********************/
                vertical:false,  //????????????
                duration:200,  //????????????
                circular:false, // ??????????????????
                /************************************************ */
                id:1,  //????????????
                type:0, //tab?????????
				current: 0, // tabs?????????current???????????????????????????tab??????
				swiperCurrent: 0, // swiper?????????current????????????????????????swiper-item????????????

				winH: uni.getSystemInfoSync().windowHeight * 2 - 80,
				/*********??????*********/
				imgOwn:'https://image.etcchebao.com/etc-min/mine/icon-logo.png',
				indicatorDots: false,
				indicatorColor: "rgba(255,255,255,0.5)",
				indicatorActiveColor: "#FF5C2A",
				old: {
					scrollTop: 0
				},
				scrollTop: 0, //????????????
				scrollTops:-1, //??????????????? ???????????????
				isScrollBottom:false,
				animationData:{}, //??????????????????
				off:false, //??????????????????
				transitionData:"",
				isShow:false,
				triggered:false,
				previousmargin:"14rpx",
				nextmargin:"14rpx",
				swiper_current:0
			}
		},
		computed:{

        },
		components:{
			DialogWindow
		},
		onLoad() {

		},
		mounted(){
			eventMonitor("FM_HomePage_34",1)
			this.init()
		},
		onShow(){
			// uni.$on("updateFMPage",(e)=>{
			// 	if(e.videoDestory){
			// 		this.onRefresh(this.swiperCurrent);
			// 		uni.$off("updateFMPage")
			// 	}
			// })
			this.$token(()=>{
				this.init();
			})
			this.$store.dispatch("home/ac_share_info",8);//????????????
			this.$refs.dialog.loadPopup();//????????????
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		//????????????
		// onPullDownRefresh(){
		// 	this.isScrollBottom = true;
		// 	this.$set(this.flowList,this.current,[])
		// 	this.params[this.listNav[this.current].id].pageNumber = 1;
		// 	this.params[this.listNav[this.current].id].page =1;
		// 	this.bindNav(this.current)
		// 	setTimeout(function () {
		// 		uni.stopPullDownRefresh();
		// 	}, 1000);
		// },
		onReachBottom(){
		},
		methods: {
			init(){
				this.getbannerList();
				new Promise((resolve,reject)=>{
					resolve(this.gettabList())
				}).then(res=>{
					if(res){
						this.bindNav(this.swiperCurrent)
					}
				})
			},
			bindchange(e){
				this.swiper_current = e.detail.current;
			},
			onRefresh($event) {
				if($event == this.swiperCurrent){
					this.triggered = true;
					let timer = setTimeout(() => {
						this.triggered = false;
						clearTimeout(timer)
					}, 1500)
				}
			},
			/* ??????????????? */
			onRestore() {
				this.$debounce(()=>{
					console.log('????????????')
					this.isScrollBottom = true;
					this.loadStatus = "loading";
					this.$set(this.flowList,this.current,[])
					this.params[this.current].page =1;
					this.bindNav(this.current)
				})
			},
			/* ??????????????????????????????????????????????????? */
			onAbort() {
				this.$debounce(()=>{
					console.log('????????????')
				})
			},
			stopTouchMove(){
				return true
			},
			tabsChange(index) {
				this.$debounce(()=>{
					eventMonitor("FM_Top_FM_Other_34_Tab_click_145",2,{
						tab_id:this.listNav[index].id
					})
					this.isScrollBottom = false;
					this.swiperCurrent = index;
					this.current = index;
					this.loadStatus = "loading";
					this.scrollTops = 0;
					this.bindNav(index)
				})
			},
			topScroll(){
					this.scrollTops = this.scrollTop
					this.$nextTick(()=>{
						this.scrollTops = 0 //?????????0?????????????????????
					});
			},
			//????????????
			scrollChange(e){
				 this.scrollTop = e.detail.scrollTop;
				if(e.detail.scrollTop >= this.winH){
					this.isShow=true;
				}else{
					this.isShow=false
				}
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
			},
			transition(e){
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// //??????
			handlerSwiper(e){
				let current = e.detail.current;
				this.swiperCurrent = current;
			},
			changeRfswaterFall() {
				if (10*this.res_params[this.current].page >= this.res_params[this.current].total) {
					this.loadStatus = 'nomore';
					return;
				}else{
					this.params[this.current].page++;
					if(this.params[this.current].page > 49){
						this.loadStatus = 'nomore';
						this.params[this.current].page = 50;
						return;
					}else{
							this.loadStatus = 'loading';
							if([4,5,6].indexOf(this.type) == -1){
								this.getarticleList(this.id);
							}else{
								switch(this.type){
									case 4://?????????????????????
										this.gettabVideoList(this.id);
									break;
									case 5:// ???????????? contentfrom=1
										this.getdataList(this.id,1);
									break;
									case 6:// ?????? contentfrom=2
										this.getdataList(this.id,2);
									break;
								}
							}
					}
				}
			},
			addRandomData() {
				 this.loadStatus = 'loading';
			},
			bindNav(index){
				this.type = this.listNav[index].type;
                this.id = this.listNav[index].id;
				this.current=index;
				this.dealStoreVuex(this.current)
				if(this.flow_num[index].num==0 || this.isScrollBottom == true){
					if([4,5,6].indexOf(this.type) == -1){
						this.getarticleList(this.id);
					}else{
						switch(this.type){
							case 4://?????????????????????
								this.gettabVideoList(this.id);
							break;
							case 5:// ???????????? contentfrom=1
								this.getdataList(this.id,1);
							break;
							case 6:// ?????? contentfrom=2
								this.getdataList(this.id,2);
							break;
						}
					}
				}
            },
			//??????????????????
			dealStoreVuex(_index){
				for(let i=0;i<this.listNav.length;i++){
					if(_index != i){
						if(this.params[i].page > 1){
							this.params[i].page=1;
							this.res_params[i].page=1;
							let uWaterfall = `uWaterfall${i}`
							this.$refs[uWaterfall][0].clear();
							this.flow_num[i].num=10;
							this.$nextTick(()=>{
								this.$set(this.flowList,i,JSON.parse(JSON.stringify(this.info_list[i])))
							})
						}
					}
				}
			},
			//??????banner?????????
			async getbannerList() {
				let res = await bannerList({})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					if(data.length > 0){
						for(let i=0;i<data.length;i++){
							if(data[i].contentType != 'voice'){
								if(data[i].bannerId != 219558){
									this.banner_list.push(data[i])
								}
							}
						}
					}
				}
			},
			 //???????????????
            async getarticleList(type_id) {
				let res = await articleList({
					tabId: type_id,
					pageNumber: this.params[this.current].page,
					pageSize: 10,
				})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
				this.res_params[this.current].total = data.pager.total;
				this.res_params[this.current].page = data.pager.page;
				if(data.list.length == 0){
					this.loadStatus = 'nomore';
					return;
				}
				for(let i=0;i<data.list.length;i++){
					data.list[i].imgOwn = this.imgOwn;
					let item = JSON.parse(JSON.stringify(data.list[i]))
					// item.id = this.$u.guid();
					this.flow_num[this.current].num++;
					if(this.params[this.current].page == 1){
						this.info_list[this.current].push(item)
					}
					this.$nextTick(()=>{
						this.$set(this.flowList[this.current],this.flowList[this.current].length,item)
					})
				}
				// if(this.params[this.current].page == 1){
				// 	this.info_list[this.current]= JSON.parse(JSON.stringify(this.flowList[this.current]))
				// }
				// this.$forceUpdate();
			 }
			},
		//???????????????????????? ??????????????? - contentId
		async getdataList(type_id,content_from){
			let res = await dataList({
				pageNumber:this.params[this.current].page,
				contentFrom:content_from,
				pageSize:10
			});
			let {code,msg,data} = res;
			if(code == 0){
				this.res_params[this.current].total = data.pager.total;
				this.res_params[this.current].page = data.pager.page;
				if(data.list.length == 0){
					this.loadStatus = 'nomore';
					return;
				}
				for(let i=0;i<data.list.length;i++){
					data.list[i].imgOwn = this.imgOwn;
					if(data.list[i].contentType==2){
						data.list[i].type_id=2
					}
					let item = JSON.parse(JSON.stringify(data.list[i]))
					// item.id = this.$u.guid();
					//this.flowList[this.current].push(item)
					if(this.params[this.current].page == 1){
						this.info_list[this.current].push(item)
					}
					this.flow_num[this.current].num++;
					this.$nextTick(()=>{
						this.$set(this.flowList[this.current],this.flowList[this.current].length,item)
					})
				}
				// this.$forceUpdate()
				// if(this.params[this.current].page == 1){
				// 	this.info_list[this.current]= JSON.parse(JSON.stringify(this.flowList[this.current]))
				// }
			}
		},
		//????????????????????? ??????????????? - id
		async gettabVideoList(type_id){
			let res = await tabVideoList({
				pageSize:10,
				page:this.params[this.current].page
			})
			let {code,msg,data} = res;
			if(code == 0){
				this.res_params[this.current].total = data.pager.total;
				this.res_params[this.current].page = data.pager.page;
				if(data.list.length == 0){
					this.loadStatus = 'nomore';
					return;
				}
				for(let i=0;i<data.list.length;i++){
					data.list[i].imgOwn = this.imgOwn;
					data.list[i].type_id=2
					let item = JSON.parse(JSON.stringify(data.list[i]))
					// item.id = this.$u.guid();
					//this.flowList[this.current].push(item)
					if(this.params[this.current].page == 1){
						this.info_list[this.current].push(item)
					}
					this.flow_num[this.current].num++;
					this.$nextTick(()=>{
						this.$set(this.flowList[this.current],this.flowList[this.current].length,item)
					})
				}
				// this.$forceUpdate()
				// if(this.params[this.current].page == 1){
				// 	this.info_list[this.current]= JSON.parse(JSON.stringify(this.flowList[this.current]))
				// }
			 }
			},
			async getarticleDetail(articleId,type){
				let res = await articleDetail({
					noContent:1,
					articleId:articleId,
					type:type,
				})
				let {code,msg,data} = res;
				if(code == 0 && msg == 'success'){
					if(data.jumpUrl){
						let h5_url = data.jumpUrl.replace('https','http');
						h5_url = h5_url.replace('http','https');
						uni.navigateTo({
							url: `/pages/webview/main?src=${encodeURIComponent(h5_url)}&isNeedLogin=0&isGps=0`,
						});
					}
				}
			},
			//??????banner?????????
			toUrllinkBanner(item){
				eventMonitor("FM_List_FM_Other_34_List_click_146",2,{
					tab_id:this.listNav[this.current].id,
					article_id:item.bannerId
				})
				this.$debounce(()=>{
					if(item.contentType == 'article'){
						this.getarticleDetail(item.bannerId,1)
					}
				})
			},
			//?????????/????????????
			toUrllink(item) {
				this.$debounce(()=>{
					if([0,1,8,9].indexOf(this.type) != -1){
						eventMonitor("FM_List_FM_Other_34_List_click_146",2,{
							tab_id:this.listNav[this.current].id,
							article_id:item.articleId
						})
						this.getarticleDetail(item.articleId,4)
					}else if([5,6].indexOf(this.type) != -1){
						let param = item.contentId || item.id;
						if(item.contentType == 2){ //??????
							eventMonitor("FM_List_FM_Other_34_List_click_146",2,{
								tab_id:this.listNav[this.current].id,
								video_id:param
							})
							uni.navigateTo({url: '/pages/fm/video/main?ID='+param});
						}else if(item.contentType == 1){ //??????
							eventMonitor("FM_List_FM_Other_34_List_click_146",2,{
								tab_id:this.listNav[this.current].id,
								article_id:param
							})
							this.getarticleDetail(param,4)
						}else{
							eventMonitor("FM_List_FM_Other_34_List_click_146",2,{
								tab_id:this.listNav[this.current].id,
								video_id:param
							})
							uni.navigateTo({url: '/pages/fm/video/main?ID='+param});
						}
					}else if([4].indexOf(this.type) != -1){
						let param = item.id;
						eventMonitor("FM_List_FM_Other_34_List_click_146",2,{
								tab_id:this.listNav[this.current].id,
								video_id:param
						})
						uni.navigateTo({url: '/pages/fm/video/main?ID='+param});
					}
				})
			},
			//??????tab????????????
			async gettabList() {
				let res = await tabList({})
				let {
					code,
					msg,
					data
				} = res;
				if (code == 0) {
					//??????type=2??????type=3
					let arr =[],j=0;
					for(let i=0;i<data.length;i++){
						if(data[i].type!=2 && data[i].type!=3){
							arr.push(data[i]);
							this.flowList.push([])
							this.flow_num.push({num:0})
							this.info_list.push([])
							this.params.push({
								//???????????????????????????
								pageSize:10,
								page:1
							});
							this.res_params.push({
								//????????????????????????
								total:0,
								page:1
							});
							j++
						}
					}
					this.listNav = arr;
					return true;
				}
			}
		},
		/**
		 * ??????tabBar??????
		 */
		onTabItemTap(item) {
			eventMonitor("WeChat_BottomNaviClick", 2, {
				from_tab: item.text,
				to_tab: ""
			});
		},
		/**
		 * ????????????/???
		 */
		onShareAppMessage(res) {
			return app.shareAppMessage();
		},
		/**
		 * ???????????????
		 */
		onShareTimeline(res) {
			return app.shareTimeline();
		},
	}
</script>

<style>
	/* page????????????scope???style???????????????????????? */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss" scoped>
	.nav{
		position:fixed;
		width:100%;
		z-index: 998;
		background-color:#ffffff;
            &_block{
                width: auto;
                white-space: nowrap;
                .order-list-content{
                    display: inline-block;
                    color: #222222;
                    margin:0 25rpx 0 25rpx;
                    font-size: 30rpx;
                }
                .order-header-list{
                    margin-left: 50rpx;
                }
                .active{
                    color: #FF5C2A;
                    padding-bottom: 26rpx;
                    border-bottom: 4rpx solid #FF5C2A;
                }
            }
        }
	.swiper{
		position: relative;
		height: 100vh;
		.swiper_item_scroll{
			padding: 80rpx 0 0 0;
			transition: all 0.5s ease;
			width:100%;
			height:100vh;
		}
		.noCard{
			position: absolute;
			left: 50%;
			top: calc(50% - 36rpx);
			z-index: 999;
			width: 100%;
			transform: translate(-50%,-50%);
			.noCard_image{
				display: block;
				width: 294rpx;
				height: 294rpx;
				margin: auto;
			}
			.noCard_text{
				margin-top: 36rpx;
				color: #999999;
				font-size: 26rpx;
				text-align: center;
				width: 100%;
				display: block;
			}
		}
    	// 	height:100vh !important;
    	// 	overflow: auto;
    	// 	&_item{
    	// 		height: 100vh !important;
    	// 		overflow: auto;
    	// 		&_scroll{
    	// 			height: 100vh !important;
					// // height: calc(100vh-86px) !important;
    	// 		}
    	// 	}
    }
	.top{
		position: fixed;
		width: 88rpx;
		height: 88rpx;
		bottom: 100rpx;
		right: 28rpx;
		background-color: #ffffff;
		border-radius: 50%;
		z-index: 888;
		box-shadow: 0 10rpx 20rpx 5rpx rgba($color: #000000, $alpha: 0.1);
		&_img{
			width: 32rpx;
			height: 32rpx;
			display: block;
			margin: auto;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
	}
	.container{
		position: relative;
		width: 100%;
		height: 342rpx;
		.dots {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			position: absolute;
			left: 50%;
			bottom: 10rpx;
			transform: translateX(-50%);
			.box {
				margin: 0 0 0 8rpx;
				width: 8rpx;
				height: 8rpx;
				background-color: rgba(255,255,255,0.5);
				border-radius: 12rpx;
				&.box:first-child {
					margin: 0;
				}
				&.active {
					background-color: #FF5C2A !important;
					width: 16rpx !important;
					transition: width linear 0.2s;
				}
			}
		}
		.swiper1 {
			width: 100%;
			height: 346rpx;
			&_item {
				position: relative;
				height: 314rpx !important;
				width: 694rpx;
				&_img {
					width: 694rpx;
					height: 314rpx !important;
					margin: auto;
					border-radius: 12rpx;
					display: block;
				}
				&_text{
					color: #FFFFFF;
					font-size: 28rpx;
					position:absolute;
					bottom: 28rpx;
					width: 656rpx;
					left: 44rpx;
					line-height: 33rpx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
					z-index: 2;
				}
				&_view{
					width: 694rpx;
					height: 100rpx;
					left: 50%;
					bottom:-16%;
					transform: translate(-50%,-50%);
					position: absolute;
					border-radius: 0 0 12rpx 12rpx;
					background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.0) 100%);

				}
			}
		}
	}

	.wrap{
		&_header{
			position: fixed;
			top: 0;
			width: 100vw;
			background-color: #FFFFFF;
			z-index: 9999;
		}
	}
	.u-lazy{
		width: 320rpx;
		overflow: hidden;
	}
	.demo-warter {
		border-radius: 8px;
		// margin: 5px;
		background-color: #ffffff;
		// padding: 8px;
		position: relative;
	}
	.demo-image {
		width: 100%;
		border-radius: 4px;
	}

	.avtor{
		padding-bottom: 19rpx;
	}
	.demo-title {
		width: 304rpx;
		height: 80rpx;
		margin: auto;
		margin-top: 19rpx;
		margin-bottom: 13rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
		// color: #222222;
		font-weight: bold;
	}

	.demo-tag {
		display: flex;
		margin-top: 5px;
	}
	.demo-water-left{
		margin:8rpx 7rpx 8rpx 27rpx;
	}
	.demo-water-right{
		margin:8rpx 27rpx 16rpx 14rpx;
	}
	.demo-water-right0{
		margin:28rpx 7rpx 8rpx 27rpx;
	}
	.demo-water-right1{
		margin:28rpx 27rpx 16rpx 14rpx;
	}
	/deep/ .u-lazy-item{
		background-color: #ffffff !important;
		z-index:999;
		height: auto;
	}
	/deep/ .u-load-more-wrap{
		padding-bottom: 108rpx !important;
	}
	/deep/ .u-load-more-inner{
		padding-top: 16rpx;
	}
	.demo-tag-owner {
		background-color: $u-type-error;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}
	.isVedio{
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	.demo-tag-text {
		border: 1px solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

		.item{
        display: flex;
		justify-content: space-between;
        width:100%;
        .demo-price {
            overflow: hidden;
            display: inline-block;
            text-overflow: ellipsis;
            line-clamp: 1;
            -webkit-box-orient: vertical;
            color: #666666;
            font-size: 24rpx;
            vertical-align: middle;
            margin-left: 19rpx;
        }
        .demo-time{
            display: inline-block;
            vertical-align: middle;
            color: #666666;
            font-size: 24rpx;
            margin-right: 17rpx;
            .demo-time-image {
                width: 26rpx;
                height: 26rpx;
                display: inline-block;
                vertical-align: bottom;
                margin: 0 8rpx 0 7rpx;
            }
			.demo-time-text{
				vertical-align: bottom;
			}
        }
    }
</style>
