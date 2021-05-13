<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-02-03 14:53:47
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 15:20:39
-->
<template>
  <view class="act">
    <view class="act-box">
      <image
        src="https://image.etcchebao.com/etc-min/coin-bg.png"
        class="bg-image"
      />
      <image
        src="https://image.etcchebao.com/etc-min/icon-fish.png"
        class="icon-fish"
      />
      <image
        src="https://image.etcchebao.com/etc-min/icon-bubble-left.png"
        class="icon-bubble-left"
      />
      <image
        src="https://image.etcchebao.com/etc-min/icon-bubble-right-1.png"
        class="icon-bubble-right-1"
      />
      <image
        src="https://image.etcchebao.com/etc-min/icon-bubble-right-2.png"
        class="icon-bubble-right-2"
      />
      <canvas id="canvas" type="2d"></canvas>
      <view
        v-if="show_add_coin"
        :class="['coin-add-num', { anmation: show_add_coin_anmation }]"
      >
        <image src="https://image.etcchebao.com/etc-min/icon-coin-big-1.png" /> +9
      </view>
      <image
        src="https://image.etcchebao.com/etc-min/icon-bottle.png"
        class="icon-bottle"
      />
      <!-- <image src="https://image.etcchebao.com/etc-min/coin100-later.png" class="bottle-coin"> -->
      <image
        src="https://image.etcchebao.com/etc-min/coin100.png"
        class="bottle-coin"
      />
      <!-- <image src="https://image.etcchebao.com/etc-min/coin10.png" class="bottle-coin"> -->
      <view class="act-content">
        <image
          src="https://image.etcchebao.com/etc-min/icon-gl.png"
          class="icon-gl"
        />
        <view class="user-box">
          <view class="user-info">
            <image
              class="avatar"
              src="https://image.etcchebao.com/etc-min/icon-default-avatar.png"
            />
            <view class="username">ETC车宝君</view>
          </view>
          <view class="coin-total">
            <image
              class="icon-coin"
              src="https://image.etcchebao.com/etc-min/icon-coin.png"
            />
            <AnimatedNumber :value="coinNum" />
            <image
              class="icon-arrow"
              src="https://image.etcchebao.com/etc-min/icon-arrow.png"
            />
          </view>
        </view>
        <!-- <view class="notice-box">
              <image src="https://image.etcchebao.com/etc-min/notice-bar.png" class="icon-notice" />
              <view>尊敬的粤通卡用户，ETC车宝&粤通卡欢迎您~</view>
          </view> -->
        <view class="coin-box">
          <view
            class="coin-item"
            :style="{ 'animation-delay': random['r_' + index] + 's' }"
            v-for="(n, index) in taskList"
          >
            <block v-if="n == 3">
              <view class="coin-num">+999</view>
              <view class="coin-title">绑定粤通卡可领</view>
            </block>
            <block v-else>
              <view
                :class="['coin-take-num', { active: index == current }]"
                @click="onTakeCoin(index)"
              >
                <image
                  src="https://image.etcchebao.com/etc-min/coin-take-num.png"
                />
                <view>+{{ n }}</view>
              </view>
              <view class="coin-title">绑定粤通卡可领</view>
            </block>
          </view>
        </view>
      </view>
    </view>
    <view class="exchange-box">
      <image class="launchApp"  src="https://image.etcchebao.com/etc-min/launchApp.png"/>
      <!-- <view class="gift-icon-box">
        <image src="https://image.etcchebao.com/etc-min/gift_bg.png" />
        <view>有新礼包到啦，快来瞅瞅~</view>
      </view> -->
      <swiper indicator-dots autoplay class="swiper">
        <block>
          <swiper-item v-for="(item,index) in operaList">
            <view class="swiper-item">
             <image :src="item.pic_url" @click="toJump(item.jump_url)" />
            </view>
          </swiper-item>
          <swiper-item>
            <view class="swiper-item"></view>
          </swiper-item>
        </block>
      </swiper>
      <view class="panel-wrap">
        <view class="panel-header">
          <view class="left"> 每日精选 </view>
          <view class="right">
            <image />
            <text>恭喜某…获得加油优惠券</text>
          </view>
        </view>
        <view class="panel-content">
          <view class="goods-list-block">
            <view class="goods-grid" v-for="n in 9" @click="toDetail">
              <view class="goods-list-item">
                <view class="img-box">
                  <image class="goods-img" />
                  <image class="good-tag" />
                </view>
                <view class="info-box">
                  <view class="title">商品最长七个字商品最长七个字</view>
                  <view class="cost-coin">
                    <image
                      src="https://image.etcchebao.com/etc-min/icon-coin.png"
                    />
                    <text>450</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="space-white-60"></view>
    <!--兑换详情-->
    <van-popup
      :show="show_detail"
      position="bottom"
      closeable
      @close="onDetailClose"
    >
      <view class="detail-content">
        <image class="img" />
        <view class="info-box">
          <view class="title">加油优惠券</view>
          <view class="desc">加油满200-20元加油满20-20</view>
        </view>
        <view class="service-box">
          <view class="title">权益介绍</view>
          <p>
            1.发酵的放假撒积分加速发酵的放假撒积分 2.分加速发酵的放假撒积分加速
            3.分加速发酵的放假撒积分加速发酵的放假撒积分加速
            4.发酵的放假撒积分加速发酵的放假撒积分 5.分加速发酵的放假撒积分加速
            3.分加速发酵的放假撒积分加速发酵的放假撒积分加速
          </p>
        </view>
        <view class="btn-footer">
          <view class="tip-status">不满足兑换条件</view>
          <van-button color="#FF5C2A" block round disabled>
            <image
              class="btn-img"
              src="https://image.etcchebao.com/etc-min/icon-coin.png"
            />
            <text class="btn-text">6金币兑换</text>
          </van-button>
        </view>
      </view>
    </van-popup>
    <!--兑换详情 end-->
    <!--兑换确认弹窗-->
    <van-popup
      :show="show_confirm"
      position="bottom"
      closeable
      @close="onConfirmClose"
    >
      <view class="confirm-content">
        <view class="goods-item">
          <view class="left">
            <image src="" />
          </view>
          <view class="right">
            <view class="title">加油优惠券加油优惠券加油优惠加油优惠券券</view>
            <view class="goods-num">x1</view>
          </view>
        </view>
        <view class="cell-item">
          <view class="title">积分抵扣</view>
          <view class="value">6积分</view>
        </view>
        <view class="sumbit-bar">
          <view class="total"><text>合计</text> 6积分</view>
          <view class="btn-confirm"> 确认兑换 </view>
        </view>
      </view>
    </van-popup>
    <!--兑换确认弹窗 end-->
    <!--兑换成功弹窗-->
    <van-popup
      :show="show_success"
      position="bottom"
      closeable
      @close="onSuccessClose"
    >
      <view class="success-content">
        <view class="box">
          <image
            src="https://image.etcchebao.com/etc-min/icon_success.png"
            class="icon-success"
          />
          <view class="name">兑换成功</view>
          <view class="desc"
            >加油满200-20元加油满20-20加油满200-20 加油满200-20元加油满20元加油
          </view>
        </view>
        <view class="btn-footer">
          <van-button color="#FF5C2A" block round plain>好的</van-button>
        </view>
      </view>
    </van-popup>
    <!--兑换成功弹窗 end-->
    <custom-tabbar />
  </view>
</template>

<script>
import customTabbar from "@/components/custom-tabbar";
import lottie from "lottie-miniprogram";
import AnimatedNumber from "@/components/uni-animated-number/index";
import * as API from "@/interfaces/coin";
import { getOperaList } from "@/interfaces/base";
export default {
  data() {
    function getRandom() {
      return (Math.random() * 4).toFixed(2);
    }
    return {
      random: {
        r_0: getRandom(),
        r_1: getRandom(),
        r_2: getRandom(),
        r_3: getRandom(),
        r_5: getRandom(),
        r_5: getRandom(),
      },
      taskList: [1, 2, 3, 4, 5],
      is_recevice_coin: false,
      current: -1,
      show_add_coin: false,
      show_add_coin_anmation: false,
      coinNum: 1000,
      show_detail: false,
      show_success: false,
      show_confirm: false,
      operaList:[]
    };
  },
  components: {
    customTabbar,
    AnimatedNumber,
  },
  mounted() {
     this.getOperaList();
    if (this.token) {
      
    } else {
      //等待授权后更新接口,订阅接口
      this.$store.subscribe((mutation, state) => {
        if (mutation.type == "user/setToken") {
        
        }
      });
    }
  },
  methods: {
    /**
     * 获取运营位
     */
    async getOperaList() {
      let res = await getOperaList({
        os: 1,
        location: 1, //1=金币模块，2=账单模块
      });
      this.operaList = res.data;
    },
    toDetail() {
      this.show_detail = true;
    },
    onDetailClose() {
      this.show_detail = false;
    },
    onSuccessClose() {
      this.show_success = false;
    },
    onConfirmClose() {
      this.show_confirm = false;
    },
    delay(timeout) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, timeout);
      });
    },
    onTakeCoin(index) {
      this.current = index;
      setTimeout(() => {
        this.taskList.splice(index, 1);
        this.current = -1;
        wx.createSelectorQuery()
          .select("#canvas")
          .node(async (res) => {
            const canvas = res.node;
            const context = canvas.getContext("2d");
            canvas.width = 400 * 2;
            canvas.height = 760 * 2;
            lottie.setup(canvas); //要执行动画，必须调用setup,传入canvas对象
            lottie.loadAnimation({
              //微信小程序给的接口，调用就完事了，原理不太懂
              loop: false, //是否循环播放（选填）
              autoplay: true, //是否自动播放（选填）
              path: "https://image.etcchebao.com/etc-min/coin.json", //lottie json包的网络链接，可以防止小程序的体积过大，要注意请求域名要添加到小程序的合法域名中
              rendererSettings: {
                context, //es6语法：等同于context:context（必填）
              },
            });
            await this.delay(1500);
            this.show_add_coin = true;
            await this.delay(100);
            this.show_add_coin_anmation = true;
            await this.delay(800);
            this.show_add_coin = false;
            this.show_add_coin_anmation = false;
            console.log("===========");
            this.coinNum = 1005;
          })
          .exec();
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes updown {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes fish {
  0% {
    opacity: 0;
    transform: translateX(200px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(-300px);
  }
}
@keyframes bubbleAnimat {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.1;
    transform: translateY(-150px);
  }
}
.act {
  position: relative;
  #canvas {
    position: absolute;
    width: 400px;
    height: 760px;
    z-index: 5;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
  .act-box {
    width: 750rpx;
    height: 1080rpx;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    padding-top: 88rpx;
    position: relative;
    .bg-image {
      width: 750rpx;
      height: 1156rpx;
      position: absolute;
      top: 0;
    }
    .icon-fish {
      width: 292rpx;
      height: 59rpx;
      z-index: 4;
      position: absolute;
      top: 250rpx;
      right: 0;
      transform: translateX(60px);
      animation: fish 10s infinite;
    }
    .icon-bubble-left {
      width: 60rpx;
      height: 60rpx;
      z-index: 4;
      position: absolute;
      left: 100rpx;
      bottom: 180rpx;
      animation: bubbleAnimat 8s infinite;
      transform: translateY(0);
    }
    .icon-bubble-right-1 {
      width: 60rpx;
      height: 60rpx;
      z-index: 4;
      position: absolute;
      right: 100rpx;
      bottom: 200rpx;
      opacity: 0;
      animation: bubbleAnimat 10s infinite;
      animation-delay: 5s;
    }
    .icon-bubble-right-2 {
      width: 30rpx;
      height: 30rpx;
      z-index: 4;
      position: absolute;
      right: 100rpx;
      bottom: 130rpx;
      opacity: 0;
      animation: bubbleAnimat 10s infinite;
      animation-delay: 5s;
    }
    .icon-bottle {
      z-index: 4;
      position: absolute;
      width: 486rpx;
      height: 623rpx;
      bottom: 40rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .bottle-coin {
      width: 344rpx;
      height: 242rpx;
      bottom: 120rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
      z-index: 5;
      position: absolute;
    }
    .coin-add-num {
      font-size: 60rpx;
      font-weight: 600;
      color: #ffa402;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 150rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
      z-index: 6;
      position: absolute;
      transition: all 0.8s linear;
      &.anmation {
        transform: translateY(-100px);
        opacity: 0;
      }
      image {
        width: 65rpx;
        height: 65rpx;
        margin-right: 20rpx;
      }
    }
    .act-content {
      position: relative;
      z-index: 6;
      .icon-gl {
        position: absolute;
        width: 78rpx;
        height: 86rpx;
        right: 20rpx;
        top: 120rpx;
      }
      .notice-box {
        display: block;
        margin: 0 auto;
        position: absolute;
        z-index: 2;
        top: 120rpx;
        .icon-notice {
          width: 712rpx;
          height: 96rpx;
        }
        > view {
          position: absolute;
          top: 30rpx;
          font-size: 26rpx;
          color: #fff;
          left: 100rpx;
          width: 520rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .user-box {
        display: flex;
        align-items: center;
        .user-info {
          display: flex;
          align-items: center;
          padding: 20rpx 40rpx;
          .avatar {
            width: 50rpx;
            height: 50rpx;
            background: #cccccc;
            border-radius: 100px;
          }
          .username {
            font-size: 26rpx;
            color: #fff;
            margin-left: 10rpx;
          }
        }
        .coin-total {
          display: flex;
          align-items: center;
          height: 48rpx;
          background: linear-gradient(90deg, #349dee, #1b6fe5);
          border-radius: 24px;
          font-size: 30rpx;
          font-weight: 500;
          color: #fff;
          padding: 0 20rpx;
          .icon-coin {
            width: 44rpx;
            height: 44rpx;
            margin-right: 10rpx;
          }
          .icon-arrow {
            width: 24rpx;
            height: 24rpx;
            margin-left: 30rpx;
          }
        }
      }
      .coin-box {
        display: flex;
        justify-content: space-around;
        margin-top: 140rpx;
        .coin-item {
          width: 110rpx;
          text-align: center;
          color: #fffae2;
          animation: updown 6s infinite;
          .coin-num {
            width: 110rpx;
            height: 110rpx;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 100%;
            border: 1px dashed #caf9ff;
          }
          .coin-take-num {
            position: relative;
            width: 116rpx;
            height: 122rpx;
            transition: all 0.5s linear;
            &.active {
              transform: scale(1.2);
              opacity: 0;
              & + .coin-title {
                opacity: 0;
              }
            }
            > image {
              position: absolute;
              width: 116rpx;
              height: 122rpx;
              margin: 0 auto;
              left: 0;
              right: 0;
            }
            > view {
              position: absolute;
              bottom: 10rpx;
              left: 0;
              right: 0;
              margin: 0 auto;
            }
          }
          .coin-title {
            font-size: 22rpx;
            margin-top: 5rpx;
            transition: all 0.5s linear;
          }
        }
      }
    }
  } // 兑换
  .exchange-box {
    position: relative;
    top: -25rpx;
    border-radius: 20rpx 20rpx 0 0;
    background: #f9f9f9;
    padding: 30rpx;
    .launchApp {
      width: 260rpx;
      height: 72rpx;
      position: absolute;
      top: -42rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .gift-icon-box {
      width: 640rpx;
      height: 134rpx;
      position: absolute;
      top: -70rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
      text-align: center;
      z-index: 2;
      image {
        position: absolute;
        width: 640rpx;
        height: 134rpx;
        left: 0;
      }
      > view {
        position: absolute;
        color: #ed5117;
        font-size: 30rpx;
        z-index: 2;
        top: 50rpx;
        left: 160rpx;
        width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .swiper {
      .swiper-item {
        height: 220px;
        background: #5e5e5e;
        image {
          width: 100%;
          height: 220px;
          border-radius: 10rpx;
        }
      }
    }
    .panel-wrap {
      .panel-header {
        padding: 40rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          font-size: 34rpx;
          font-weight: bold;
          color: #222222;
        }
        .right {
          display: flex;
          align-items: center;
          image {
            width: 32rpx;
            height: 32rpx;
            border-radius: 100px;
          }
          text {
            font-size: 24rpx;
            color: #999;
            margin-left: 10rpx;
          }
        }
      }
      .panel-content {
        .goods-list-block {
          display: flex;
          flex-wrap: wrap;
          margin-top: -15rpx;
          .goods-grid {
            width: 33.333%;
            margin-top: 15rpx;
          }
          .goods-list-item {
            width: 220rpx;
            height: 328rpx;
            background: #fff;
            border-radius: 8rpx;
            margin: 0 auto;
            .img-box {
              position: relative;
              width: 220rpx;
              height: 223rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              .goods-img {
                width: 155rpx;
                height: 102rpx;
                background: #999;
              }
              .good-tag {
                width: 100rpx;
                height: 32rpx;
                position: absolute;
                top: 0;
                right: 0;
                background: #666;
              }
            }
            .info-box {
              padding: 10rpx 15rpx;
              .title {
                font-size: 26rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #222;
                font-weight: 500;
              }
              .cost-coin {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10rpx;
                image {
                  width: 30rpx;
                  height: 30rpx;
                }
                text {
                  font-size: 26rpx;
                  color: #ff5c2a;
                  margin-left: 10rpx;
                }
              }
            }
          }
        }
      }
    }
  }
  .detail-content {
    padding: 30rpx;
    .btn-footer {
      padding: 30rpx 20rpx;
      .tip-status {
        color: #ff5c2a;
        font-size: 24rpx;
        text-align: center;
        margin-bottom: 10rpx;
      }
      .btn-img {
        vertical-align: middle;
        width: 42rpx;
        height: 42rpx;
        margin-right: 10rpx;
      }
      .btn-text {
        vertical-align: middle;
      }
    }
    .img {
      width: 251rpx;
      height: 166rpx;
      display: block;
      margin: 80rpx auto;
      background: #ffa402;
    }
    .info-box {
      padding: 40rpx 0;
      border-bottom: 1rpx solid #ebebeb;
      .title {
        font-size: 36rpx;
        font-weight: bold;
        color: #222222;
      }
      .desc {
        font-size: 24rpx;
        color: #999999;
        margin-top: 10rpx;
      }
    }
    .service-box {
      margin-top: 42rpx;
      .title {
        font-size: 30rpx;
        color: #222;
        font-weight: bold;
      }
      p {
        font-size: 24rpx;
        color: #999;
        line-height: 40rpx;
      }
    }
  }
  .confirm-content {
    height: 1034rpx;
    padding: 30rpx;
    box-sizing: border-box;
    .goods-item {
      display: flex;
      align-items: center;
      padding: 40rpx 0;
      border-bottom: 1rpx solid #ebebeb;
      .left {
        width: 140rpx;
        height: 140rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ebebeb;
        flex-shrink: 0;
        image {
          width: 100%;
        }
      }
      .right {
        margin-left: 40rpx;
        .title {
          font-size: 30rpx;
          font-weight: bold;
          color: #222222;
        }
        .goods-num {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
    .cell-item {
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      margin-top: 37rpx;
      .title {
        color: #999;
      }
      .value {
        color: #222;
      }
    }
    .sumbit-bar {
      position: absolute;
      bottom: 80rpx;
      left: 0;
      right: 0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 690rpx;
      box-sizing: border-box;
      padding: 40rpx 0rpx;
      border-top: 1rpx solid #ebebeb;
      .total {
        font-size: 30rpx;
        color: #222;
        text {
          color: #999;
        }
      }
      .btn-confirm {
        width: 265rpx;
        height: 100rpx;
        line-height: 100rpx;
        background: #ff5c2a;
        border-radius: 50rpx;
        color: #fff;
        text-align: center;
      }
    }
  }
  .success-content {
    padding: 0rpx 30rpx;
    text-align: center;
    .box {
      width: 564rpx;
      margin: 0 auto;
      padding: 200rpx 0;
    }
    .icon-success {
      width: 105rpx;
      height: 105rpx;
    }
    .name {
      color: #28bc93;
      font-size: 34rpx;
    }
    .desc {
      margin-top: 60rpx;
      font-size: 28rpx;
      color: #999999;
    }
  }
}
</style>
