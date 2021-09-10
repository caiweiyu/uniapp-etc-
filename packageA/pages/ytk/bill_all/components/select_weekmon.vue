<template>
  <view class="box">
      <!--顶部周、月账单选项-->
      <view class="box_title" @click="openTarget" :style="{top:tabHeight+btnBoundtop+'rpx',height:menu.height*2+'rpx',lineHeight:menu.height*2+'rpx'}">
          {{status == 1 ? list[1].name : list[0].name}}
      </view>
      <!--弹出层选项-->
      <u-popup v-model="isOpen" mode="bottom" border-radius="12" height="600rpx">
          <view class="picker">
                <view class="header">
                    <view class="cancel" @click="cancel">取消</view>
                    <view class="enter" @click="enter">确定</view>
                </view>
                <!--选项区-->
                <picker-view v-if="visible" :indicator-style="indicatorStyle" :indicator-class="'indicatorClass'" :value="value" @change="bindChange" class="picker-view">
                    <picker-view-column>
                        <view class="item"  v-for="(item,index) in list" :key="index">{{item.name}}</view>
                    </picker-view-column>
                </picker-view>
          </view>
      </u-popup>
  </view>
</template>

<script>
export default {
    data(){
        return{
            list:[
                {
                    id:0,
                    name:'月账单'
                },
                {
                    id:1,
                    name:'周账单'
                }
            ], // 列表展示
            visible:true, //是否可见
            indicatorStyle: `height: 50px;font-size:36rpx;`,//设置选择样式
            status:0, //切换状态
            isOpen:false, //开关
            btnBoundtop:uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
            value:-1, //选择值的确定
        }
    },
    computed: {
        /**
         * 计算高度（胶囊顶部距状态栏高度距离*2 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop*2 + this.tabHeight + this.menuHeight)
        },
    },
    methods: {
        /**
         * 头部下拉开关
         */
        openTarget(){
            this.isOpen = !this.isOpen;
        },
        /**
         * 确认
         */
        enter(){
            this.isOpen = false;
            this.value == 1 ? this.status = 1 : this.status = 0;
        },
        /**
         * 取消
         */
        cancel(){
            this.isOpen = false;
        },
        /**
         * 选择事件
         */
        bindChange(e){
            console.log(e.detail.value[0])
            this.value = e.detail.value[0]
        },
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
        background: url("https://image.etcchebao.com/etc-min/bill_all/banner1.png")no-repeat;
        background-size: 100% 100%;
        height: 406rpx;
        width: 750rpx;
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
        .picker{
            height: 600rpx;
            background-color: #FFFFFF;
            .header{
                display: flex;
                justify-content: space-between;
                font-size: 28rpx;
                width: 100%;
                .cancel{
                    color: #999999;
                    margin: 39rpx 0 0 32rpx;
                }
                .enter{
                    color:#FF5C2A;
                    margin: 39rpx 32rpx 0 0;
                }
            }
            .picker-view {
                width: 750rpx;
                height: 500rpx;
                margin-top: 20rpx;
            }
            .item {
                // height: 50rpx;
                line-height:50px;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
        }
    }
 .indicatorClass{
    font-size: 36rpx;
    color: #222222;
    font-weight: bold;
}
</style>