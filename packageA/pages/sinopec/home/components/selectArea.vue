<template>
  <view class="box" @touchmove.stop="bindContent">
      <view :class="['box1']" @click="toggleWindows">
          <text :class="['text1',status==true ? 'text1_active' : '']">{{allArea}}</text>
          <image class="up" v-if="status == true" src="https://image.etcchebao.com/etc-min/sinopec-list/up.png" mode="" />
          <image class="down" v-else src="https://image.etcchebao.com/etc-min/sinopec-list/down.png" mode="" />
      </view>
      <view :class="['box2',status == true ? 'box2_active' : 'box2_active_off']">
          <scroll-view :scroll-y="true" v-if="status" :scroll-into-view="scrollLeft" :scroll-with-animation="true">
              <view class="box2_left">
                  <view :class="['box2_left_item', -1 == current ? 'box2_left_item_active' : '']" :id="'into_left'+ -1" @click.stop="$debounce(showAreaAll,-1,'全部地区')">全部地区</view>
                  <view :class="['box2_left_item',index == current ? 'box2_left_item_active' : '']" :id="'into_left'+ index" v-for="(item,index) in list" :key="index" @click.stop="$debounce(showArea,index,item)">
                      {{item.name}}
                  </view>
              </view>
          </scroll-view>
          <scroll-view :scroll-y="true" v-if="status" :scroll-into-view="scrollRight" :scroll-with-animation="true">
              <view class="box2_right">
                  <view :class="['box2_right_item',index == currentdetail ? 'box2_right_item_active' : '']" :id="'into_right'+ index"  v-for="(item,index) in list[current].children" :key="index" @click.stop="$debounce(showAreadetail,index,item)">
                      {{item.name}}
                  </view>
              </view>
          </scroll-view>
      </view>
      <view :class="[status == true ? 'box3' : '']" @click="toggleWindows" @touchmove.stop="bindContent">

      </view>
      <view :class="['box4',status == true ? 'box4_active' : 'box4_active_off']"></view>
  </view>
</template>

<script>
import * as API from "@/interfaces/sinoepc";
import {mapState} from "vuex"
export default {
    props:{
 
    },
    data(){
        return {
            status:false,
            list:[],
            current:-1,
            currentdetail:-1,
            city_code:'440100',
            district_code:'',
            bindContent:()=>{},
            allArea:'全部地区',
            scrollLeft:"",
            scrollRight:""
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
        showArea(index,item){
            this.currentdetail = -1,
            this.current = index;
            this.city_code = item.code;
            this.allArea = item.name;
            this.$nextTick(()=>{
               this.scrollLeft = 'into_left'+ index
            });
            this.scrollLeft = '';
            this.$emit('getCity',{city:this.city_code})
        },
        showAreaAll(index,name){
            this.currentdetail = -1,
            this.current = index;
            this.allArea = name;
            this.$nextTick(()=>{
               this.scrollLeft = 'into_left'+ index
            });
            this.scrollLeft = '';
            this.$emit('getAllCity')
        },
        showAreadetail(index,item){
            this.currentdetail = index;
            this.district_code = item.code;
            this.allArea = item.name;
            this.status = !this.status;
            this.$nextTick(()=>{
               this.scrollRight = 'into_right'+ index
            });
            this.scrollRight = '';
            this.$emit('getDistrict',{city:this.city_code,district:this.district_code})
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
            color: #222222;
            border-bottom: 1rpx solid #F9F9F9;
            background-color: #ffffff;
            position: fixed;
            z-index: 999;
            .text1{
                margin-left: 54rpx;
            }
            .text1_active{
                color: #FF5C2A;
            }
            .up,.down{
                margin-left: 10rpx;
                width: 20rpx;
                height: 12rpx;
                line-height: 79rpx;
                display: inline-block;
                vertical-align: middle;
            }
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
            position: fixed;
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
            top: calc(667rpx);
            z-index: 998;
            background-color: none;
        }
        .box4{
            width: 100%;
            position: absolute;
            top: 0rpx;
            z-index: 997;
            background-color: rgba(0,0,0,0.4);
        }
        .box4_active{
            height: 100vh;
            transition: height linear 0s;
        }   
        .box4_active_off{
            height: 0vh;
            transition: height linear 0s;
        }
    }
</style>