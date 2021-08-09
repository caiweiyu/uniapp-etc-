<template>
  <view class="box">
      <selectArea @getDistrict="getDistrict" @getCity="getCity"></selectArea>
      <image class="banner" src="https://image.etcchebao.com/etc-min/sinopec-list/banner.png" mode="" />
      <scroll-view :scroll-y="true" v-if="loading && list.length > 0" class="card-scroll" @scrolltolower="dealScrollBottom">
          <view class="box_container">
              <!--卡片区域-->
              <view :class="['box_container_item']" v-for="(item,index) in list" :key="index">
                  <view class="box_container_item_left">
                      <text>{{item.name}}</text>
                      <view class="view"><image class="image" src="https://image.etcchebao.com/etc-min/sinopec-list/location.png" mode="" />{{item.address}}</view>
                      <view class="fontColor" @click="bindCallPhone(item)">
                          <image class="image" src="https://image.etcchebao.com/etc-min/sinopec-list/phone.png" mode="" />
                          {{item.telephone}}
                      </view>
                  </view>
                  <view class="box_container_item_right">
                      <image  @click="goMapLocation(item)" src="https://image.etcchebao.com/etc-min/sinopec-list/duil.png" mode="" />
                      <text class="text">{{item.juli}}</text>
                  </view>
              </view>
          </view>
      </scroll-view>
      <view v-if="!loading"
				:style="[
					{margin: '0 auto'},
					{padding: '300rpx 0 0 0'},
					{width: '50rpx'}
				]"
			>
			<u-loading mode="circle" size="50" color="#FF5C2A"></u-loading>
	  </view>
  </view>
</template>

<script>
import * as API from "@/interfaces/sinoepc";
import selectArea from "./components/selectArea";
import {mapState} from "vuex"
export default {
    data(){
        return {
            list:[],
            page:1,
            page_size:10,
            loading:false,
            emtry_list:true,
            city:"",
            district:"",
            lat:"",
            lng:""
        }
    },
    components:{
        selectArea
    },
    computed:{
        ...mapState({
            latitude: (state) => state.user.latitude,
            longitude: (state) => state.user.longitude
        })
    },
    methods: {
        async get_axios_station(page,page_size){
            let res = await API.axios_station({
                source_channel:2,
                page:page,
                pageSize:page_size,
                lng:this.lng,
                lat:this.lat,
                city:this.city,
                district:this.district
            });
            let {code,msg,data} = res;
            if(code == 0){
                if(data.length > 0){
                    for(let i=0;i<data.length;i++){
                        this.list.push(data[i]);
                    }
                }else{
                    this.emtry_list = false
                }
                this.loading = true;
            }
        },
        dealScrollBottom(){
          if(!this.emtry_list){
              return;
          }
          this.page+=1;
          this.get_axios_station(this.page,this.page_size)
       },
       getCity(item){
           this.district="";
           this.city = item.city;
           this.list = [];
           this.page = 1;
           this.page_size = 10;
           this.lng = '',this.lat = '';
           this.get_axios_station(this.page,this.page_size)
       },
       getDistrict(item){
           this.district = item.district;
           this.city = item.city;
           this.list = [];
           this.page = 1;
           this.page_size = 10;
           this.lng = '',this.lat = '';
           this.get_axios_station(this.page,this.page_size)
       },
       goMapLocation(item){
           uni.navigateTo({
               url: `/pages/location/main?latitude=${item.lat}&longitude=${item.lng}&address=${item.address}&name=${item.name}`
           })
       },
       /**
         * 拨打电话
         */
        bindCallPhone(item) {
            uni.makePhoneCall({
                phoneNumber: item.telephone
            })
        },
    },
    mounted() {
        this.lng = this.longitude,this.lat = this.latitude;
        this.get_axios_station(this.page,this.page_size)    
    },
}
</script>

<style lang="scss" scoped>
    .box{
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: #F4F4F4;
        .banner{
            width: 702rpx;
            height: 161rpx;
            display: block;
            margin:auto;
            padding: 103rpx 0 24rpx 0;
        }
        .card-scroll{
            position: relative;
			height:100vh;
            background-color: #F4F4F4;
        }
        &_container{
            // height: 218rpx;
            width: 702rpx;
            display: block;
            margin: auto;
            border-radius: 14rpx;
            background-color: #FFFFFF;
            >view:last-child{
                margin-bottom: 336rpx;
            }
            &_item{
                width: 666rpx;
                margin-left: 18rpx;
                // height: 218rpx;
                display: flex;
                border-bottom: 1rpx solid #EBEBEB;
                position: relative;
                justify-content: space-between;
                &_left{
                    width: 80%;
                    text{
                        margin: 30rpx 0 0 8rpx;
                        color: #222222;
                        font-size: 34rpx;
                        font-weight: bold;
                        display: block;
                    }
                    .view{
                        display: inline-block;
                        margin: 14rpx 0 0 8rpx;
                        font-size: 28rpx;
                        color: #999999;
                        .image{
                            width: 24rpx;
                            height: 27rpx;
                            display: inline-block;
                            margin:0 8rpx 0 0;
                            vertical-align: middle;
                        }
                    }
                    .fontColor{
                        margin: 14rpx 0 41rpx 8rpx;
                        color: #229CF4;
                        .image{
                            width: 24rpx;
                            height: 27rpx;
                            display: inline-block;
                            margin:0 8rpx 0 0;
                            vertical-align: middle;
                        }
                    }
                }
                &_right{
                    text-align: center;
                    font-size: 20rpx;
                    color: #222222;
                    position: absolute;
                    right: 14rpx;
                    top: 67rpx;
                    // margin: 67rpx 14rpx 0 0;
                    image{
                        display: block;
                        width: 49rpx;
                        height: 49rpx;
                        margin:auto;
                    }
                    .text{
                        text-align: center;
                        display: block;
                        margin-top: 13rpx;
                    }
                }
            }
        }
    }
</style>