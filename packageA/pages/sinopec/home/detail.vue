<template>
  <view class="box">
      <!-- <selectArea></selectArea> -->
      <view class="box1">
        <text class="boxsize boxitem">视频教程</text>
        <image :src="list.video_icon" mode="" />
      </view>
      <view class="box2">
        <text class="boxsize boxitem">省钱教程</text>
        <swiper :autoplay="true"
								:interval="5000"
								:duration="300"
                :circular="true"
                class="swiper">
          <swiper-item class="swiper_item">
              <image :src="list.image_help" mode="" />
          </swiper-item>
          <swiper-item class="swiper_item">
              <view class="box2_container" :style="index==0?'':'margin-top: 21rpx'" v-for="(item,index) in dots2" :key="index">
                  <view class="icon2">{{item.index}}</view>
                  <text>{{item.title}}</text>
              </view>
          </swiper-item>
        </swiper> 
      </view>
      <view class="box3">
        <text class="boxsize box3-item">使用须知</text>
        <view class="box3_container" v-for="(item,index) in dots" :key="index">
          <view class="icon">{{item.index}}</view>
          <text>{{item.title}}</text>
        </view>
      </view>
      <!--易捷提货券-->
      <view class="box4">
          易捷提货券
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
        dots2:[]
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
             console.log(this.dots2)
          }
        }
      }
    },
    onShow(){

    },
    mounted() {
      let {
				recharge_price
			} = this.$root.$mp.query;
      console.log(recharge_price,'--item')
      this.getAxiosUserHelp();
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
    padding: 10rpx 0;
    position: relative;
    .box1,.box2{
      width: 702rpx;
      height: 366rpx;
      margin:20rpx auto 0;
      display: block;
      background-color: #ffffff;
      border-radius: 14rpx;
      &_container{
        display: flex;
        .icon2{
          display: inline-block;
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          border-radius: 50%;
          text-align: center;
          border-radius: 50%;
          color: #ffffff;
          background-color: #414141;
        }
        text{
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
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          border-radius: 50%;
          text-align: center;
          font: 15rpx;
          color: #ffffff;
          background-color: #000000;
          display: inline-block;
        }
        text{
           display: inline-block;
           vertical-align: middle;
        }
      }
    }
    .box4{
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100rpx;
      height: 300rpx;
      border:1rpx solid #ddd;
    }
    .boxsize{
        color: #222222;
        font-size: 34rpx;
        font-weight: bold;
    }
  }
</style>