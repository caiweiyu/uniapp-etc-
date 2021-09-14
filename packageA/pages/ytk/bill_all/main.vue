<template>
  <view class="box">
      <!--下拉刷新区-->
      <scroll-view :refresher-enabled="true" :scroll-y="true"
            :refresher-triggered="triggered" :refresher-threshold="80"
			refresher-background="#dddddd" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" @refresherabort="onAbort"
			:scroll-with-animation="true"
            class="scroll-class"
            :style="{height:winHeight+'px'}"
      >
            <!--顶部周月选择下拉框区-->
            <selectWeekmon ref="selectWeekmon"></selectWeekmon>       

            <!--本月消费通行次数-->
            <monfreeTimer ref="monfreeTimer"></monfreeTimer>

            <!--账单列表区-->
            <billList ref="billList"></billList>

            <!--底部一键领取-->
            <bottomBtn ref="bottomBtn"></bottomBtn>
      </scroll-view>
  </view>
</template>

<script>
import selectWeekmon from './components/select_weekmon'
// import weekmonTab from './components/weekmon-tab'
import monfreeTimer from './components/monfree-timer'
import billList from './components/bill_list'
import bottomBtn from './components/bottom_btn'

export default {
    data(){
        return {
            triggered:false,
            btnBoundtop:(uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight)*2, //胶囊顶部距状态栏高度距离
            tabHeight:uni.getSystemInfoSync().statusBarHeight, //状态栏高度
            menuHeight:uni.getMenuButtonBoundingClientRect().height, //胶囊相关信息
            winHeight:uni.getSystemInfoSync().windowHeight, //系统屏幕宽度
        }
    },
    computed: {
        /**
         * 计算高度（胶囊顶部距状态栏高度距离*2 + 状态栏高度 + 胶囊高度）
         */
        tabBoundheight(){
            return (this.btnBoundtop + this.tabHeight*2 + this.menuHeight*2)
        },
        /**
         * 计算scroll-view弹性高度
         */
        scrollViewHeight(){
            return (this.btnBoundtop + this.tabHeight + this.menuHeight)
        }
    },
    methods: {
        /**
         * 下拉事件
         */
        onRefresh() { 
            this.triggered = true;
            let timer = setTimeout(() => {
                this.triggered = false;
                clearTimeout(timer)
            }, 1500)
        },
        /**
         * 下拉被复位
         */
        onRestore() {
            console.log('事件刷新~')
        },
        /**
         * 下拉被中止，没下拉完就松手就会触发
         */
        onAbort() {
            console.log('无效下拉')
        }
    },
    mounted(){
        console.log(this.winHeight,this.tabBoundheight)
    },
    components:{
        selectWeekmon,
        monfreeTimer,
        billList,
        bottomBtn
    }
}
</script>

<style scoped lang="scss">
    .box{
        width: 100%;
        height: 100%;
    }
    .scroll-class{
        height:100vh;
    }
</style>