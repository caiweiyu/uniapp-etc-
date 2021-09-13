<template>
  <view class="box">
      <!--顶部周、月账单选项-->
      <view :class="['box_title']" @click="openTarget" :style="{top:tabHeight+btnBoundtop+'rpx',height:menu.height*2+'rpx',lineHeight:menu.height*2+'rpx'}">
          <text class="dirtctionTitle">{{status == 1 ? list[1].label : list[0].label}}</text>
          <view :class="[isOpen ? 'dirtctionAvterafter' : 'dirtctionAvter']"></view>
      </view>
      <!--内容区域-->
      <view class="box_content" :style="{top:(tabBoundheight+40)+'rpx'}">
          <view class="card_title"><text class="text">粤H 86Q90</text><image class="image" src="https://image.etcchebao.com/etc-min/bill_all/change_icon1.png" mode="" /></view>
          <text class="card_num">8768 7764 8997 8997</text>
      </view>
      <!--周、月弹出层选项-->
      <u-select v-model="isOpen" @confirm="enter" @cancel="cancel" :cancel-color="'#999999'" style="background-color:#ffffff !important;" :confirm-color="'#FF5C2A'" :confirm-text="'确定'" :list="list"></u-select>
  </view>
</template>

<script>
export default {
    props:{
        list:{
            type:Array,
            default:[
                {
                    value:0,
                    label:'月账单'
                },
                {
                    value:1,
                    label:'周账单'
                }
            ]
        }
    },
    data(){
        return{
            status:0, //切换状态
            isOpen:false, //开关
            value:-1, //选择值的确定
            btnBoundtop:uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
            menu:uni.getMenuButtonBoundingClientRect(), //胶囊相关信息
        }
    },
    computed: {
        /**
         * 计算高度（胶囊顶部距状态栏高度距离 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
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
        enter(e){
            this.isOpen = false;
            this.value = e[0].value;
            this.value == 1 ? this.status = 1 : this.status = 0;
        },
        /**
         * 取消
         */
        cancel(){
            this.isOpen = false;
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
            font-size: 36rpx;
            color: #FFFFFF;
            font-weight: bold;
            left: 50%;
            .dirtctionTitle{
                vertical-align: middle;
                display: inline-block;
            }
            .dirtctionAvter{
                background:url('https://image.etcchebao.com/etc-min/bill_all/select_icon1.png')no-repeat;
                background-size: 100% 100%;
                width: 40rpx;
                height: 40rpx;
                display: inline-block;
                vertical-align: middle;
                margin-left: 8rpx;
                animation: animate-down linear 0.2s forwards;
            }
            .dirtctionAvterafter{
                background:url('https://image.etcchebao.com/etc-min/bill_all/select_icon1.png')no-repeat;
                background-size: 100% 100%;
                width: 40rpx;
                height: 40rpx;
                display: inline-block;
                vertical-align: middle;
                margin-left: 8rpx;
                transform:rotateY(180deg) !important;
                animation: animate-up linear 0.2s forwards;
            }
        }
        &_content{
            position:absolute;
            left:30rpx;
            .card_title{
                width: 300rpx;
                .text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 40rpx;
                    color: #FEFEFE;
                    font-weight: bold;          
                }
                .image{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 20rpx;
                    height: 36rpx;
                    width: 36rpx;
                    border-radius: 50%;
                }
            }
            .card_num{
                margin-top: 16rpx;
                font-size: 30rpx;
                color: #FFFFFF;
                opacity: .6;
            }
        }
        @keyframes animate-up {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(180deg);
            }
        }
        @keyframes animate-down {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(-180deg);
            }
        }
    }
    /deep/ .u-drawer__scroll-view{
        background-color: #FFFFFF !important;
    }
</style>