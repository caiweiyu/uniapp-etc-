<template>
  <view class="box">
      <view>
        <view class="box_item" @click="expandMore">更多</view>
        <view class="box_more" v-if="isShow">
            <view class="box_more_item" v-for="(item,index) in all" :key="index">{{item}}</view>
        </view>
      </view>
      <scroll-view scroll-x="true" class="box_scroll">
          <view :class="['box_scroll_item', current==index ? 'active' : '']" @click="change(index)" v-for="(item,index) in list" :key="index">{{item.name}}</view>
      </scroll-view>
  </view>
</template>

<script>
export default {
    data(){
        return {
            current:-1,
            isShow:false,
            list:[  
                {id:0,name:'1月'},
                {id:1,name:'2月'},
                {id:2,name:'3月'},
                {id:3,name:'4月'},
                {id:4,name:'5月'},
                {id:5,name:'6月'},
                {id:6,name:'7月'},
                {id:7,name:'8月'},
                {id:8,name:'9月'},
                {id:9,name:'10月'},
                {id:10,name:'11月'},
                {id:11,name:'12月'},
            ],
            all:[
                '1周','2周','3周'
            ]
        }
    },
    methods: {
        change(index){
            this.current = index;
        },
        expandMore(){
            this.isShow = !this.isShow
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{
        width: 100%;
        z-index: 1;
        background-color: #ddd;
        color: #000000;
        font-size: 28rpx;
        display: flex;
        flex-direction: row;
        &_item{
            width: 60rpx;
            height: 80rpx;
            line-height: 80rpx;
            margin: 0 10rpx;
            text-align: center;
            // display: inline-block;
        }
        &_more{
            height: auto;
            width: 60rpx;
            text-align: center;
            display: flex;
            position: absolute;
            flex-direction: column;
            background-color: #ddd;
            &_item{
                width: 100%;
                height: 40rpx;
                line-height: 40rpx;
            }
        }
        &_scroll{
            display: inline-block;
            position: relative;
            width: auto;
            white-space: nowrap;
            &_item{
                width: 50rpx;
                height: 80rpx;
                line-height: 80rpx;
                margin: 0 10rpx;
                display: inline-block;
            }
            .active{
                color: blue !important;
                text-decoration: blue;
            }
        }
    }
</style>