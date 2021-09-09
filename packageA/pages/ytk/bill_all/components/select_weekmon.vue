<template>
  <view class="box">
      <view class="box_title" @click="openTarget" :style="{top:tabHeight+btnBoundtop+'rpx',height:menu.height*2+'rpx',lineHeight:menu.height*2+'rpx'}">
          {{status == 1 ? title[1].name : title[0].name}}
      </view>
      <view class="box_content" v-show="isOpen" @click="selectTarget" :style="{top:tabHeight+btnBoundtop+50+'rpx'}">
          {{status == 1 ? title[0].name : title[1].name}}
      </view>
  </view>
</template>

<script>
export default {
    data(){
        return{
            title:[
                {
                    id:0,
                    name:'月账单'
                },
                {
                    id:1,
                    name:'周账单'
                }
            ], // 标题
            status:0, //切换状态
            isOpen:false, //开关
            btnBoundtop:uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
        }
    },
    methods: {
        /**
         * 头部下拉开关
         */
        openTarget(){
            this.isOpen = !this.isOpen;
        },

        /**
         * 点击选择周、月账单
         */
        selectTarget(){
            this.isOpen=false;
            this.status == 1 ? this.status=0 : this.status=1;
        }
    },
    created() {
        
    },
    mounted() {
        
    },
}
</script>

<style scoped lang="scss">
    .box{
        position: relative;
        width: 100%;
        z-index: 1;
        &_title{
            position: fixed;
            transform: translateX(-50%);
            left: 50%;
        }
        &_content{
            position: fixed;
            transform: translateX(-50%);
            left: 50%; 
            width: 100rpx;
            height: 50rpx;
            border: 1rpx solid #ddd;
            background-color: #ddd;
            line-height: 50rpx;
        }
    }
</style>