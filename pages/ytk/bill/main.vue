<!--
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-04-06 16:23:19
-->
<template>
  <view class="bill">
    <navigator url="/pages/user/mine/main"  class="user-info">
      <image class="avatar" :src="headerUrl"></image>
      <view class="username">{{ nickName }}</view>
    </navigator>
	<notice-channel type="2" styleTop="top: 180rpx" />
    <!--运营位-->
    <swiper class="swiper-wrapper-opera" v-if="operaList.length > 0">
      <swiper-item
        class="swiper-item-opera"
        v-for="(item, index) in operaList"
        :key="index"
      >
        <image :src="item.pic_url" @click="toJump(item.jump_url)" />
      </swiper-item>
    </swiper>
    <swiper
      class="swiper-wrapper"
      next-margin="10px"
      :current="current_swpier"
      @change="onSwiperChange"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in unitollList"
        :key="index"
      >
        <unitoll-card
          :card_name="item.card_name"
          :card_num="item.card_num"
          :plate="item.plate"
          :type="item.type"
          :url="item.url"
          card_type="bill"
        />
      </swiper-item>
      <swiper-item>
        <unitoll-card empty_tip="添加粤通卡" @onAddCard="onAddCard" />
      </swiper-item>
    </swiper>
    <scroll-view scroll-y="true" class="bill-content">
      <view class="header-box">
        <view class="item-inner">
          <view class="value">&yen; {{ passTotalMoney }}</view>
          <view class="title">本月消费</view>
        </view>
        <view class="item-inner">
          <view class="value">{{ passTotalTimes }}</view>
          <view class="title">通行次数</view>
        </view>
      </view>
      <view class="bill-list-box" v-if="billMonthList.length > 0">
        <view
          class="bill-list-item"
          v-for="(item, index) in billMonthList"
          :key="index"
        >
          <block v-if="item.tradeType==3||item.tradeType==9||item.tradeType==99 ">
           <view class="item-header">
              <view class="item-left">{{item.name}} {{item.province}}</view>
              <view class="item-right">
                <view class="coin-wrap">
                  <view class="coin-num"
                    ><image
                      class="icon-coin"
                      src="https://image.etcchebao.com/etc-min/icon-coin.png"
                    />{{item.integral}}</view
                  >
                  <view class="btn-take" v-if="item.status==0" @click="onTakeCoin(item.serialNo)">领取</view>
                  <view class="btn-take disabled" v-else>{{item.status==1?'已领取':'已过期'}}</view>
                </view>
              </view>
            </view>
            <view class="item-content">
              <view class="toll-wrap">
                <view class="entrance">
                  <view class="title">{{ item.enStation }}</view>
                  <view class="time">{{ item.enTime }}</view>
                </view>
                <view class="exit">
                  <view class="title">{{ item.exitStation }}</view>
                  <view class="time">{{ item.exitTime }}</view>
                </view>
              </view>
              <view class="total-money"> &yen; {{item.amount}} </view>
            </view>
          </block>
          <block v-else>
             <view class="item-content">
              <view class="biz-wrap">
                <view class="title">{{item.enStation}}</view>
                <view class="time">{{item.enTime}}</view>
              </view>
              <view class="total-money green-color"> &yen; {{item.amount}} </view>
            </view>
          </block>
        </view>
      </view>
      <!--列表空状态-->
      <view class="bill-empty-box" v-else>
        <image src="https://image.etcchebao.com/etc-min/bill-empty.png" />
        <view class="empty-text">暂无账单信息</view>
      </view>
      <!--列表空状态 end-->
    </scroll-view>
    <!--账单指引-->
    <view class="bill-tip-box" v-if="is_show_guide" @click="onCloseGuide">
      <image src="https://image.etcchebao.com/etc-min/dialog-tip.png" />
      <view class="overlay"></view>
    </view>
    <!--账单指引 end-->
    <!--收藏小程序提示-->
    <image
      v-if="is_show_collection"
      class="collection"
      src="https://image.etcchebao.com/etc-min/icon-collection.png"
      @click="onCloseCollection"
      alt=""
    />
    <!--全局授权-->
	<button-get-user-info type="global" />
    <button-get-phone-number type="global" />
    <!--底部栏-->
    <custom-tabbar />
  </view>
</template>
<script>
import * as API from "@/interfaces/ytk";
import { getOperaList } from "@/interfaces/base";
import customTabbar from "@/components/custom-tabbar";
import unitollCard from "@/components/unitoll-card";
import buttonGetUserInfo from "@/components/button-getUserInfo";
import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
import noticeChannel from "@/components/notice-channel";
import { mapState } from "vuex";
export default {
  components: {
    customTabbar,
    unitollCard,
    buttonGetPhoneNumber,
	buttonGetUserInfo,
	noticeChannel
  },
  data() {
    return {
      unitollList: [],
      passTotalTimes: 0,
      passTotalMoney: 0,
      billMonthList: [],
      current_swpier: 0,
      operaList: [],
    };
  },
  computed: {
    ...mapState({
      headerUrl: (state) => state.user.info.headerUrl,
      nickName: (state) => state.user.info.nickName,
      token: (state) => state.user.token,
      is_show_guide: (state) => state.user.is_show_guide,
      is_show_collection: (state) => state.user.is_show_collection,
    }),
  },
  mounted() {
    if (this.token) {
      this.init();
    } else {
      //等待授权后更新接口,订阅接口
      this.$store.subscribe((mutation, state) => {
        if (mutation.type == "user/setToken") {
          this.init();
        }
      });
    }
  },

  methods: {
    init() {
      this.getUserCardList();
      this.getOperaList();
    },
    onCloseGuide() {
      this.$store.commit("user/setIsShowGuide", false);
    },
    onCloseCollection() {
      this.$store.commit("user/setIsShowCollection", false);
    },
    async onTakeCoin(serialNo){
      let date=new Date();
      let month=`${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2,"0")}`//获取当前月份
      let res =await API.sendBillCoins({
          month,//	string	Y	年月份（格式：201003）
          source:"2",	//int	Y	领取来源：1=app ; 2=小程序
          orderId:serialNo,	//string	Y	账单列表的流水号（serialNo）
      })
      if(res.data){
        uni.showToast({
          title: '领取成功',
          icon: 'none'
        })
        this.getUnitollBill();
      }
      
    },
    /**
     * 获取运营位
     */
    async getOperaList() {
      let res = await getOperaList({
        os: 1,
        location: 2, //1=金币模块，2=账单模块
      });
      if(res && res.data){
        this.operaList = res.data;
      }
  
    },
    toJump(url) {
      uni.navigateTo({
        url: `/pages/webview/main?src=${encodeURIComponent(url)}`,
      });
    },
    /**
     * 获取账单卡列表
     */
    async getUserCardList() {
      let res = await API.getUserCardList({
        page: 1,
        page_size: 100,
        type: 2,
      });
      if (res.data.info && res.data.info.length > 0) {
        this.unitollList = res.data.info;
        this.getUnitollBill();
      }
    },
    /**
     * 获取月账单
     */
    async getUnitollBill() {
      let index = this.current_swpier;
      let cardNo = this.unitollList[index].card_num;
      let date=new Date();
      let startDate=`${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2,"0")}/01`//获取当前月份
      let res = await API.getUnitollBill({
        cardNo,
        startDate,
        etcos:"3"//1=android；2=ios；3=微信小程序
      });
      let {  totalMoney=0, passTotalTimes=0,passDetail=[] } = res.data;
      this.billMonthList = passDetail;
      //this.totalMoney =totalMoney// parseFloat(passTotalMoney / 100).toFixed("2");
	  this.passTotalMoney = parseFloat(passTotalMoney / 100).toFixed("2");
      this.passTotalTimes = passTotalTimes;

    },
    async onAddCard() {
      let jump_url = "/pages/ytk/add_ytk/main";
      if (this.unitollList.length > 0) {
        let res = await API.getCardListByUsername();
        let { list = [] } = res.data;
        if (list.length > 0) {
          jump_url = "/pages/ytk/ytk_list/main";
        }
      }
      uni.navigateTo({
        url: jump_url,
      });
    },
    onSwiperChange(e) {
      this.current_swpier = e.mp.detail.current;
      if (this.unitollList.length <= e.mp.detail.current) {
        return;
      }
      this.getUnitollBill();
    },
  },
};
</script>

<style lang="scss" scoped>
.bill {
  position: relative;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-top: 88rpx;
  /deep/ .card {
    width: 670rpx;
  }
  .swiper-wrapper-opera {
    width: 670rpx;
    height: 108rpx;
    margin: 20rpx auto;
    .swiper-item-opera {
      image {
        width: 670rpx;
        height: 108rpx;
      }
    }
  }
  .swiper-wrapper {
    height: 260rpx;
    margin-left: 40rpx;
  }
  .bill-content {
    background: #f9f9f9;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    margin-top: 50rpx;
    height: calc(100vh - 420rpx);
    box-sizing: border-box;
    .header-box {
      display: flex;
      align-items: center;
      .item-inner {
        flex: 1;
        text-align: center;
        .value {
          font-size: 40rpx;
          font-weight: 600;
        }
        .title {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
    .bill-list-box {
      padding-top: 15rpx;
      .bill-list-item {
        background: #fff;
        padding: 0 30rpx;
        border-radius: 20rpx 20rpx 0 0;
        margin-top: 20rpx;
        .item-header {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          padding: 20rpx 0;
          justify-content: space-between;
          border-bottom: 1rpx solid #ebebeb;
          .item-left {
            color: #222;
          }
          .item-right {
            display: flex;
            color: #666;
            align-items: center;
            .coin-wrap {
              display: flex;
              align-items: center;
              .coin-num {
                display: flex;
                align-items: center;
                .icon-coin {
                  width: 30rpx;
                  height: 30rpx;
                  margin-right: 5rpx;
                }
              }
              .btn-take {
                background-color: rgb(255, 92, 42);
                width: 110rpx;
                height: 50rpx;
                line-height: 50rpx;
                text-align: center;
                color: #fff;
                border-radius: 100rpx;
                font-size: 26rpx;
                margin-left: 25rpx;
                &.disabled{
                  background-color: #cccccc;
                }
              }
            }
          }
        }
        .item-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30rpx 0;
          margin-top: 20rpx;
          .title {
            font-size: 30rpx;
            color: #222;
            font-weight: bold;
          }
          .time {
            font-size: 24rpx;
            color: #999;
          }
          .toll-wrap {
            .entrance {
              position: relative;
              padding-left: 30rpx;
              &:after {
                content: "";
                position: absolute;
                top: 12rpx;
                left: 0;
                background: #999999;
                width: 15rpx;
                height: 15rpx;
                border-radius: 100%;
              }
            }
            .exit {
              margin-top: 20rpx;
              position: relative;
              padding-left: 30rpx;
              &:after {
                content: "";
                position: absolute;
                top: 12rpx;
                left: 0;
                display: block;
                background: url("https://image.etcchebao.com/etc-min/icon-loc.png")
                  no-repeat;
                background-size: 100%;
                width: 14rpx;
                height: 20rpx;
              }
            }
          }
          .biz-wrap {
            position: relative;
            padding: 20rpx 0 20rpx 30rpx;
            &:after {
              content: "";
              position: absolute;
              top: 32rpx;
              left: 0;
              background: #cccccc;
              width: 15rpx;
              height: 15rpx;
              border-radius: 100%;
            }
          }
          .total-money {
            font-weight: 600;
            color: #e96600;
            font-size: 44rpx;
            &.green-color {
              color: #20ae48;
            }
          }
        }
      }
    }
  }
  .bill-empty-box {
    text-align: center;
    image {
      width: 300rpx;
      height: 300rpx;
    }
    .empty-text {
      font-size: 26rpx;
      color: #cccccc;
    }
  }
  .bill-tip-box {
    image {
      width: 690rpx;
      height: 633rpx;
      position: absolute;
      z-index: 100;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      bottom: 0;
      margin: 0 auto;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
  .user-info {
    position: relative;
    display: flex;
    align-items: center;
    padding: 40rpx;
    .avatar {
      width: 50rpx;
      height: 50rpx;
      background: #cccccc;
      border-radius: 100px;
    }
    .username {
      font-size: 26rpx;
      color: #222;
      margin-left: 20rpx;
    }
  }
  .collection {
    width: 496rpx;
    height: 120rpx;
    position: absolute;
    top: 170rpx;
    right: 70rpx;
  }
}
</style>
