<template>
    <view class="container">
        <view class="container_title" :style="{height:tabBoundheight+'rpx'}">
            <!-- <image class="back" @click="back" :style="{paddingTop:tabHeight+btnBoundtop+'rpx'}" src="https://image.etcchebao.com/etc-min/etc-f/icon_12.png" /> -->
            <!-- <view class="back" :style="{top:tabHeight+btnBoundtop+'rpx',height:menuHeight+'rpx'}" @click="back">
                <image class="back_box" :style="{paddingTop:(menuHeight/4)+'rpx'}" src="https://image.etcchebao.com/etc-min/bill_all/icon_left2.png" />
            </view> -->
            <text class="dirtctionTitle" :style="{paddingTop:tabHeight+btnBoundtop+'rpx',lineHeight:menuHeight+'rpx'}">添加粤通卡</text>
        </view>
        <view class="list-none" @click="onAdd">
            <view class="box">
                <image class="minbox" src="https://image.etcchebao.com/etc-min/etc-f/icon_19.png"></image>
                <view class="minbox">添加粤通卡</view>
            </view>
            <image class="logo" src="https://image.etcchebao.com/etc-min/etc-f/icon_20.png" mode="widthFix" />
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return {
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight * 2, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height * 2, //胶囊高度
        }
    },
    methods: {
        /**
         * 添加粤通卡
        */
        onAdd() {
            uni.navigateTo({
                url: `/packageA/pages/ytk/add_ytk/main`,
            });
        },
        /**
         * 返回首页
         */
        back(){
            console.log('返回==')
            uni.reLaunch({
                url: "/pages/home/main"
            })
        },
    },
    computed:{
        /**
         * 计算高度（胶囊顶部距状态栏高度距离 + 状态栏高度 + 胶囊高度）
        */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        },
    }
}
</script>

<style lang="scss" scoped>
    .container{
        &_title{ 
            position: relative;
            .dirtctionTitle{
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                display: block;
                text-align: center;
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
            }
            .back{
                width: 64rpx;
                flex-shrink: 0;
                position: absolute;
                left: 26rpx;
                &_box{
                    display: block;
                    margin: auto;
                    width: 16rpx;
                    height: 32rpx;
                }
            }
        }
        .list-none {
            margin: 26rpx auto;
            width: 690rpx;
            height: 260rpx;
            background-color: #FFFFFF;
            border-radius: 8rpx;
            position: relative;
            .box {
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 670rpx;
                height: 100rpx;
                color: #28BC93;
                font-size: 36rpx;
                text-align: center;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                .minbox:nth-child(1) {
                    margin: 4rpx 16rpx 0 0;
                    width: 36rpx;
                    height: 36rpx;
                }
                .minbox:nth-child(2) {

                }
            }
            .logo {
                position: absolute;
                right: 10rpx;
                top: 15rpx;
                width: 325rpx;
            }
        }
    }
</style>