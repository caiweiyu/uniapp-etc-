<template>
  <view class="box">
      <view :class="['box1']" @click="toggleWindows">
          全部地区 <view :class="['dots',status==true ? 'dots_up' : 'dots_down']"></view>
      </view>
      <view :class="['box2',status == true ? 'box2_active' : 'box2_active_off']">
          <scroll-view scroll-y="true" v-if="status">
              <view class="box2_left">
                  <view :class="['box2_left_item',index == current ? 'box2_left_item_active' : '']" v-for="(item,index) in list" :key="index" @click="showArea(index)">
                      {{item.name}}
                  </view>
              </view>
          </scroll-view>
          <scroll-view scroll-y="true" v-if="status">
              <view class="box2_right">
                  <view :class="['box2_right_item',index == currentdetail ? 'box2_right_item_active' : '']"  v-for="(item,index) in list[current].children" :key="index" @click="showAreadetail(index)">
                      {{item.name}}
                  </view>
              </view>
          </scroll-view>
      </view>
      <view :class="[status == true ? 'box3' : '']" @click="toggleWindows">

      </view>
  </view>
</template>

<script>
import * as API from "@/interfaces/sinoepc";
export default {
    props:{
 
    },
    data(){
        return {
            status:false,
            list:[],
            current:0,
            currentdetail:-1
        }
    },
    methods:{
        async getAxios_station_area(){
            let res = await API.axios_station_area({});
            let {code,msg,data} = res;
            if(code == 0){
                this.list = data;
            }
        },
        toggleWindows(){
            this.status = !this.status;
        },
        showArea(index){
            this.current = index;
        },
        showAreadetail(index){
            this.currentdetail = index;
        }
    },
    mounted() {
        this.getAxios_station_area()
    },
}
</script>

<style lang="scss" scoped>
    .box{
        position: relative;
        .box1{
            width: 100%;
            height: 79rpx;
            line-height: 79rpx;
            font-size: 30rpx;
            margin-left: 54rpx;
            color: #FF5C2A;
            border-bottom: 1rpx solid #F9F9F9;
            background-color: #ffffff;
            z-index: 997;
            .dots{
                margin-left: 11rpx;
                line-height: 79rpx;
                width: 0rpx;
                height: 0rpx;
                border: 13rpx solid;
                border-color: transparent;
            }
            .dots_up{
                border-top-color: #FF5C2A;
                position: absolute;
                right:15rpx;
                top:30rpx;
            }
            .dots_down{
                border-bottom-color: #FF5C2A;
                position: absolute;
                right:15rpx;
                top:18rpx;
            }
        }
        .box2{
            position: absolute;
            top: 79rpx;
            width: 100%;
            z-index: 999;
            background-color: #ffffff;    
            height: 0;  
            display: flex;
        }
        .box2_active{
            height: 588rpx;
            transition: height linear 0.2s;
        }
        .box2_active_off{
            height: 0;
            transition: height linear 0.2s;
        }
        .box2_left{
            display: flex;
            flex-direction: column;
            width: 190rpx;
            height: 100rpx;
            line-height: 100rpx;
            text-align: center;
            font-size: 28rpx;
            .box2_left_item{
                color: #222222;
                background-color: #F9F9F9;
            }
            .box2_left_item_active{
                border-left: 4rpx solid #FF5C2A;
                color:#FF5C2A;
                background-color: #ffffff;
            }
        }
        .box2_right{
            display: flex;
            flex-direction: column;
            width: 560rpx;
            height: 100rpx;
            line-height: 100rpx;
            margin-left: 40rpx;
            font-size: 28rpx;
            .box2_right_item{
                color: #222222;
                border-bottom: 1rpx solid #F9F9F9;
            }
            .box2_right_item_active{
               color:#FF5C2A;
            }
        }
        .box3{
            width: 100%;
            height: 100vh;
            position: absolute;
            top: 60vh;
            z-index: 998;
            background-color: rgba(0,0,0,0.4);

        }
    }
</style>