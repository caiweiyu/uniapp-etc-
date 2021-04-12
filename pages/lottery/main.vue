<!--
* @Description:
* @Author: jolin
* @Date: 2020-08-19 15:15:57
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 14:53:49
-->

<template>
  <div class="lottery_body">
    <div class="body_bg">
      <image
        mode="widthFix"
        src="https://image.etcchebao.com/etc-min/lottery-body-bg-2.png"
      />
    </div>
    <div class="lottery_turntable">
      <image
        class="main_bg"
        src="https://image.etcchebao.com/etc-min/lottery-mian.png"
        :style="{ transform: rotate_deg, transition: rotate_transition }"
      />
      <div class="btn_box">
        <image
          class="pointer"
          src="https://image.etcchebao.com/etc-min/lottery-btn-1.png"
          v-if="lotteryNum > 0"
          @click="start"
        />
        <image
          class="pointer"
          src="https://image.etcchebao.com/etc-min/lottery-btn-2.png"
          v-else
        />
        <image
          class="turntable"
          src="https://image.etcchebao.com/etc-min/lottery-btn-2.png"
        />
      </div>
    </div>
    <div class="lottery_product">
      <p>【超级巅峰大礼包】价值7599元iPhone12 256GB手机</p>
      <p>
        【2499元豪华礼包】400元现金红包+100元免费洗车券+价值1999的全年别墅任性住年卡
      </p>
      <p>
        【559元品质礼包】559元品质大礼包：69元现金红包+20元洗车券+价值470元体检套餐
      </p>
      <p>【99元免单礼包】 99元现金券</p>
      <p>【90元惊喜礼包】 40元话费充值券+50元免费洗车券</p>
      <p>【80元出行礼包】 60元现金红包+20元洗车券</p>
      <p>【80元畅行礼包】 30元中石化油卡+50元免费洗车券</p>
    </div>
    <div class="lottery_dialog" v-if="dialog" @click.stop="toDialog">
      <div class="lottery_msg">
        <div class="bg" @click.stop="toDownLoadApp">
          <image src="https://image.etcchebao.com/etc-min/lottery-box-bg.png" />
        </div>
        <div class="box" @click.stop="toDownLoadApp">
          <image mode="widthFix" :src="smallImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiLottery, apiLotteryData } from "@/interfaces/index";
import { wap } from "@/common/constant";
import { mapState } from "vuex";
export default {
  data() {
    return {
      lotteryNum: 0, //抽奖剩余次数
      cat: 51, //总共8个扇形区域，每个区域约45度
      isAllowClick: true, //是否能够点击
      rotate_deg: 0, //指针旋转的角度
      rotate_transition: "transform 3s ease-in-out", //初始化选中的过度属性控制
      award_list: [
        {
          id: 1,
          name: "90元惊喜礼包",
        },
        {
          id: 2,
          name: "99元现金红包券",
        },
        {
          id: 3,
          name: "80元出行礼包",
        },
        {
          id: 4,
          name: "559元品质大礼包",
        },
        {
          id: 5,
          name: "2499元豪华大礼包",
        },
        {
          id: 6,
          name: "超级巅峰大奖",
        },
        {
          id: 7,
          name: "80元畅想礼包",
        },
      ],
      points: 0,
      dialog: false,
      code: "l4JiP",
      orderSource: "",
      smallImage: "",
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.user.token,
    }),
  },
  async mounted() {
    let { orderSource = "" } = this.$root.$mp.query;
    this.orderSource = orderSource;

    if (this.token) {
      this.getLotteryData();
    } else {
      uni.navigateTo({
        url: `/pages/winning/main?orderSource=${encodeURIComponent(
          orderSource
        )}`,
      });
    }
  },
  methods: {
    async getLotteryData() {
      let res = await apiLotteryData({
        code: this.code,
        orderSource: this.orderSource,
        lotteryType: 3,
      });
      if (res.data.isWinning) {
        this.dialog = true;
        this.smallImage = res.data.userAwardList[0].smallImage;
      }
      this.lotteryNum = res.data.lotteryNum;
      this.award_list = res.data.awardModelList;
    },
    async toLottery() {
      let res = await apiLottery({
        code: this.code,
        orderSource: this.orderSource,
        lotteryType: 3,
      });
      if (res.code === 0) {
        for (var i = 0; i < this.award_list.length; i++) {
          if (this.award_list[i].id === res.data.id) {
            this.points = i;
          }
        }
        this.smallImage = res.data.smallImage;
        this.rotating();
      } else {
        this.lotteryNum--;
        if (res.code === 600) {
          console.log("时间未到", res.msg);
          uni.showLoading({
            title: "时间未到",
          });
          return;
        }
        uni.showLoading({
          title: res.msg,
        });
        console.log("抽奖失败", res.msg);
      }
    },
    toDownLoadApp() {
      uni.navigateTo({
        url: `/pages/webview/main?src=${encodeURIComponent(
          `${wap}/download.html`
        )}`,
      });
    },
    toDialog() {
      this.dialog = false;
    },
    start() {
      if (this.lotteryNum == 0) {
        uni.showToast({
          title: "机会已经用完了",
          icon: "none",
          duration: 2000,
          mask: true,
          success: (res) => {},
        });
        return;
      }
      this.toLottery();
    },
    //转盘的动作
    rotating() {
      if (!this.isAllowClick) return;
      this.isAllowClick = false;
      this.rotate_transition = "transform 3s ease-in-out";
      this.lotteryNum--;
      var rand_circle = 5; //默认多旋转5圈
      //   var winningIndex = Math.floor(Math.random() * 8); //获奖的下标   0-7   没有概率每个平均
      // var winningIndex = this.set(); //设置了概率的
      var winningIndex = this.points;
      var randomDeg = 360 - winningIndex * 51; //当前下标对应的角度    45是总共8个扇形区域，每个区域约45度

      var deg = rand_circle * 360 + randomDeg; //将要旋转的度数  由于是顺时针的转动方向需要用360度来减
      this.rotate_deg = "rotate(" + deg + "deg)";

      var that = this;
      setTimeout(() => {
        that.dialog = true;
      }, 3000);
      setTimeout(function () {
        that.isAllowClick = true;
        that.rotate_deg = "rotate(" + 0 + "deg)"; //定时器关闭的时候重置角度
        that.rotate_transition = "";
      }, 5000);
    },
  },
};
</script>
<style lang="scss">
page {
  background-color: #39866f;
}

.lottery_body {
  position: relative;
  .body_bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    image {
      width: 100%;
    }
  }
  .lottery_turntable {
    text-align: center;
    position: relative;
    z-index: 2;
    width: 338px;
    height: 338px;
    padding-top: 180px;
    margin: 0 auto;
    .main_bg {
      margin: 0 auto;
      width: 338px;
      height: 338px;
      position: relative;
      z-index: 2;
    }
    .btn_box {
      position: absolute;
      z-index: 2;
      width: 338px;
      height: 338px;
      margin: 0 auto;
      top: 180px;
      .turntable {
        position: absolute;
        z-index: 3;
        left: 50%;
        top: 50%;
        width: 120px;
        height: 120px;
        overflow: hidden;
        margin-top: -60px;
        margin-left: -60px;
      }
      .pointer {
        position: absolute;
        z-index: 4;
        left: 50%;
        top: 50%;
        width: 120px;
        height: 120px;
        overflow: hidden;
        margin-top: -60px;
        margin-left: -60px;
      }
    }
  }
  .lottery_product {
    width: 355px;
    margin: 80px auto 0;
    position: relative;
    z-index: 2;
    view {
      padding: 0 15px 0 30px;
      font-size: 15px;
      color: #fcfcfc;
      line-height: 1.5;
      margin-bottom: 18px;
      position: relative;
      &::before {
        content: "";
        width: 8px;
        height: 8px;
        display: inline-block;
        background-color: #fff;
        position: absolute;
        z-index: 2;
        left: 15px;
        top: 0.5em;
      }
    }
  }
  .lottery_dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(000, 000, 000, 0.5);
    z-index: 10000;
    .lottery_msg {
      position: absolute;
      z-index: 4;
      width: 316px;
      height: 419px;
      left: 50%;
      top: 10%;
      transform: translateX(-50%);
      text-align: center;
      .bg {
        position: relative;
        z-index: 5;
        width: 316px;
        height: 419px;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .box {
        background-color: #fff;
        width: 230px;
        height: 100px;
        position: absolute;
        z-index: 6;
        top: 220px;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        image {
          width: 100%;
        }
      }
    }
  }
}
</style>
