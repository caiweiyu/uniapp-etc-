<template>
  <view class="box">
      <view class="box_title">!本月账单已核准</view>
      <scroll-view :scroll-y="true" class="scroll-page">
        <view class="box" v-for="(item,index) in list" :key="index"></view>
      </scroll-view>
  </view>
</template>

<script>
export default {
    data(){
      return {
        list:[
          {title:'广东省',time:'2020-10-11',price:'¥19.9'},
          {title:'广东省',time:'2020-10-11',price:'¥19.9'},
          {title:'广东省',time:'2020-10-11',price:'¥19.9'}
        ]
      }
    }
}
</script>

<style scoped lang="scss">
  .box{
      position: relative;
      &_title{
        width: 100%;
        height: 50rpx;
        line-height: 50rpx;
        margin-left: 50rpx;
      }
      .scroll-page{
          width: 100%;
          height: 550rpx;
          display: flex;
          background-color: #ddd;
          flex-direction: column;
          .box{
            background-color: #ffffff;
            margin: 10rpx auto;
            width: 650rpx;
            height: 200rpx;
            display: block;
          }
      }
  }
</style>