<template>
  <view class="box">
      <view class="box1">
        <text>视频教程</text>
        <image :src="list.image_help" mode="" />
      </view>
      <view class="box2">
        <text>省钱教程</text>
        <swiper :autoplay="true"
								:interval="5000"
								:duration="300"
                :circular="true"
                class="swiper">
          <swiper-item class="swiper_item">
              <image :src="list.image_help" mode="" />
          </swiper-item>
          <swiper-item>
              <image :src="list.image_help" mode="" />
          </swiper-item>
        </swiper> 
      </view>
      <view class="box3">
        <text>使用须知</text>
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
export default {
    data(){
      return {
        list:{},
        dots:[
          {index:1,title:"测试测试测试测试测试测试测试1"},
          {index:2,title:"测试测试测试测试测试测试测试2"},
          {index:3,title:"测试测试测试测试测试测试测试3"},
          {index:4,title:"测试测试测试测试测试测试测试4"},
          {index:5,title:"测试测试测试测试测试测试测试5"},
          {index:6,title:"测试测试测试测试测试测试测试6"},
          {index:7,title:"测试测试测试测试测试测试测试7"},
          {index:8,title:"测试测试测试测试测试测试测试8"},
        ]
      }
    },
    methods: {
      async getAxiosUserHelp(){
        let res = await API.axios_user_help({});
        let {code,msg,data} = res;
        if(code == 0){
          this.list = data;
          console.log(this.list)
        }
      }
    },
    onShow(){

    },
    mounted() {
      this.getAxiosUserHelp();
    },
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    background-color: #F4F4F4;
    padding: 10rpx 0;
    position: relative;
    .box1,.box2{
      width: 690rpx;
      height: 500rpx;
      margin: 20rpx auto 0;
      display: block;
      background-color: #ffffff;
      border-radius: 15rpx;
      text{
        margin: 10rpx 0 10rpx 20rpx;
        display: block;
      }
      .swiper{
        width: 650rpx;
        height: 450rpx;
        margin: auto;
        &_item{
            image{
              width: 650rpx;
              height: 450rpx;
              display: block;
              margin: auto;
            }
        }
      }
      image{
        width: 650rpx;
        height: 450rpx;
        display: block;
        margin: auto;
      }
    }
    .box3{
      width: 690rpx;
      margin: 20rpx auto 0;
      background-color: #ffffff;
      border-radius: 15rpx;
      display: flex;
      flex-direction: column;
      padding-bottom: 25rpx;
      text{
        margin: 10rpx 0 10rpx 20rpx;
        display: block;
      }
      &_container{
        width: 100%;
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
          vertical-align: middle;
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
  }
</style>