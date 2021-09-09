<template>
  <view>
      <!--顶部周月选择下拉框区-->
      <selectWeekmon></selectWeekmon>

      <!--绑卡banner区-->
      <bannerbindCard></bannerbindCard>

      <!--周月tab选项区-->
      <weekmonTab></weekmonTab>

      <!--本月消费通行次数-->
      <monfreeTimer></monfreeTimer>

      <!--账单列表区-->
      <billList></billList>

      <!--底部一键领取-->
      <bottomBtn></bottomBtn>
  </view>
</template>

<script>
import selectWeekmon from './components/select_weekmon'
import bannerbindCard from './components/banner_bindCard'
import weekmonTab from './components/weekmon-tab'
import monfreeTimer from './components/monfree-timer'
import billList from './components/bill_list'
import bottomBtn from './components/bottom_btn'

export default {
    data(){
        return {

        }
    },
    components:{
        selectWeekmon,
        bannerbindCard,
        weekmonTab,
        monfreeTimer,
        billList,
        bottomBtn
    }
}
</script>

<style scoped lang="scss">

</style>