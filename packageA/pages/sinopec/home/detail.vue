<template>
  <view class="box">
      <!-- <selectArea></selectArea> -->
      <view class="box1" v-if="list.video_icon != ''">
        <text class="boxsize boxitem">视频教程</text>
        <image :src="list.video_icon" mode="" @click="$debounce(beginVideo,list.video_help)" />
      </view>
      <view class="box2" v-if="list.image_help != '' || dots2.length > 0">
        <text class="boxsize boxitem">省钱教程</text>
        <swiper :autoplay="true"
								:interval="5000"
								:duration="300"
                :circular="true"
                @change="changeCurrent"
                :current="current"
                class="swiper">
          <swiper-item class="swiper_item" v-if="list.image_help != ''">
              <image :src="list.image_help" mode="" />
          </swiper-item>
          <swiper-item class="swiper_item" v-if="dots2.length > 0">
              <scroll-view :scroll-y="true" style="width:100%;height:100%;">
                  <view class="box2_container" :style="index==0?'':'margin-top: 21rpx'" v-for="(item,index) in dots2" :key="index">
                      <view class="icon2">{{item.index}}</view>
                      <view class="icon2_text">{{item.title}}</view>
                  </view>
              </scroll-view>
          </swiper-item>
        </swiper> 
        <!--易捷提货券-->
        <view class="box4" @click="changeCurrentRight" v-if="list.image_help != '' || dots2.length > 0">
            <image :src="current == 1 ? pic_src[0] : pic_src[1]" mode="" />
        </view>
      </view>
      <view class="box3">
        <text class="boxsize box3-item">使用须知</text>
        <scroll-view :scroll-y="true" style="width:100%;height:100%;">
            <view class="box3_container" v-for="(item,index) in dots" :key="index">
              <view class="icon">{{item.index}}</view>
              <view class="icon_text">{{item.title}}</view>
            </view>
        </scroll-view>
      </view>
  </view>
</template>

<script>
const app = getApp()
import * as API from "@/interfaces/sinoepc";
import { mapState } from "vuex"
import selectArea from "./components/selectArea";
export default {
    data(){
      return {
        list:{},
        dots:[],
        dots2:[],
        show:false,
        autoplay:true,
        current:0,
        pic_src:[
          'https://image.etcchebao.com/etc-min/sinopec/change.png',
          'https://image.etcchebao.com/etc-min/sinopec/change2.png'
        ]
      }
    },
    methods: {
      async getAxiosUserHelp(){
        let res = await API.axios_user_help({});
        let {code,msg,data} = res;
        if(code == 0){
          this.list = data;
          if(data.use_help != ""){
             let arr = [];
             arr = data.use_help.split(/[\n]/g);
             for(let i=0;i<arr.length;i++){
               this.dots.push({
                 index:i+1,
                 title:arr[i]
               })
             }
          };
          if(data.content_help != ""){
             let arr2 = [];
             arr2 = data.content_help.split(/[\n]/g);
             for(let i=0;i<arr2.length;i++){
               this.dots2.push({
                 index:i+1,
                 title:arr2[i]
               })
             };
          }
        }
      },
      changeCurrent(e){
        this.current = e.detail.current;
      },
      changeCurrentRight(){
        this.current==1?this.current=0:this.current=1
      },
      /**
       * 播放视频
       */
      beginVideo(item){
        uni.navigateTo({
           url: `/packageA/pages/sinopec/home/video?video_src=${item}`
        });
      }
    },
    onShow(){
      this.$store.dispatch("home/ac_share_info",10);//分享配置
    },
    mounted() {
      let {
				recharge_price
			} = this.$root.$mp.query;
      this.getAxiosUserHelp();
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
    components:{
      selectArea
    }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100vh;
    background-color: #F4F4F4;
    padding: 1rpx 0rpx;
    position: relative;
    .box1,.box2{
      width: 702rpx;
      height: 366rpx;
      margin:20rpx auto 0;
      display: block;
      background-color: #ffffff;
      border-radius: 14rpx;
      position: relative;
      &_container{
        align-items: center;
        display: flex;
        .icon2{
          display: inline-block;
          vertical-align: middle;
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          border-radius: 50%;
          text-align: center;
          color: #ffffff;
          background-color: #414141;
        }
        .icon2_text{
          color: #666666;
          display: inline-block;
          font-size: 28rpx;
          margin-left: 16rpx;
          vertical-align: middle;
        }
      }
      .boxitem{
        margin: 10rpx 0 10rpx 20rpx;
        display: block;
        padding: 19rpx 0;
      }
      .swiper{
        width: 654rpx;
        height: 250rpx;
        overflow: hidden;
        margin: auto;
        &_item{
            image{
              width: 654rpx;
              height: 250rpx;
              display: block;
              margin: auto;
            }
        }
      }
      image{
        width: 654rpx;
        height: 250rpx;
        display: block;
        margin: auto;
      }
      .box4{
        position: absolute;
        right: -33rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 100rpx;
        height: 221rpx;
        z-index: 9999;
        image{
          width: 100rpx;
          height: 222rpx;
        }
      }
    }
    .box3{
      width: 702rpx;
      // height: 580rpx;
      margin: 20rpx auto 0;
      background-color: #ffffff;
      border-radius: 14rpx;
      display: flex;
      flex-direction: column;
      padding-bottom: 25rpx;
      text{
        margin: 0 0 10rpx 20rpx;
        display: block;
      }
      .box3-item{
        padding: 19rpx 0 0 0;
      }
      &_container{
        width: 100%;
        margin: 21rpx 0 0 24rpx;
        .icon{
          display: inline-block;
          vertical-align: middle;
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          border-radius: 50%;
          text-align: center;
          color: #ffffff;
          background-color: #414141;
        }
        .icon_text{
          color: #666666;
          display: inline-block;
          font-size: 28rpx;
          margin-left: 16rpx;
          vertical-align: middle;
        }
      }
    }
    .box5{
      z-index:9999;
      &_item{
        width: 100vw;
        height: 100vh;
      }
    }
    .boxsize{
        color: #222222;
        font-size: 34rpx;
        font-weight: bold;
    }
  }
</style>