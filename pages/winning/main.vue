<!--
* @Description:
* @Author: jolin
* @Date: 2020-08-19 15:15:57
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-10 14:48:26
-->

<template>
  <div class="winning_body">
    <div class="body_bg">
      <image
        mode="widthFix"
        src="https://image.etcchebao.com/etc-min/winning-body-bg.jpg"
      />
    </div>

    <div class="winning_duct">
      <div class="winning-tip" @click="toInfo">
        <image src="https://image.etcchebao.com/etc-min/winning-tip.png" />
      </div>
      <div class="c"></div>
      <div class="duct_bg">
        <image src="https://image.etcchebao.com/etc-min/winning-cont-1.png" />
      </div>
      <div class="duct_tips">
        最低得80元红包 最高得<span>iPhone 12手机</span>
      </div>
      <div class="duct_box">
        <div class="warp">
          <image src="https://image.etcchebao.com/etc-min/winning-duct-P40.png" />
          <image
            src="https://image.etcchebao.com/etc-min/winning-duct-2499.png"
          />
          <image src="https://image.etcchebao.com/etc-min/winning-duct-80.png" />
          <image src="https://image.etcchebao.com/etc-min/winning-duct-559.png" />
          <image src="https://image.etcchebao.com/etc-min/winning-duct-99.png" />
          <image src="https://image.etcchebao.com/etc-min/winning-duct-802.png" />
          <image src="https://image.etcchebao.com/etc-min/winning-duct-90.png" />
        </div>
      </div>
    </div>
    <div class="card_box">
      <image
        mode="widthFix"
        src="https://image.etcchebao.com/etc-min/winning-cont-2.png"
      />
    </div>
    <div class="winning_btn">
      <image
        @click="toLottery"
        mode="widthFix"
        src="https://image.etcchebao.com/etc-min/winning-btn.png"
      />
      <!--局部授权-->
	  <button-get-user-info type="global" />
      <button-get-phone-number type="local" />
    </div>

    <div class="barrage">
      <ul class="barrage-list">
        <li
          v-for="(item, index) in barrages"
          :key="index"
          class="barrage-item"
          :class="[item.css]"
        >
          <div class="barrage-main">
            <span>{{ item.str }}</span>
          </div>
        </li>
      </ul>
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
import {
  apiLottery,
  apiLotteryData,
  getChebaoToken,
  wechatAppletBanner,
} from "@/interfaces/index";
import { wap, chewu, store } from "@/common/constant";
import buttonGetUserInfo from "@/components/button-getUserInfo";
import buttonGetPhoneNumber from "@/components/button-getPhoneNumber";
import { mapState } from "vuex";
export default {
  components: {
    buttonGetPhoneNumber,
	buttonGetUserInfo
  },
  data() {
    return {
      barrages_copy: [],
      bsKeys: 0,
      adKeys: 0,
      defBarrages: [],
      barrages: [],
      code: "l4JiP",
      orderSource: "",
      isBarrages: true, //初次加载获奖信息
      dialog: false, //奖品弹框
      smallImage: "", //奖品图片
      isWinning: false, //是否已经抽奖
      level: 0, //用户套餐等级（0非会员；1体验会员；2黄精..）
      lotteryNum: 0, //抽奖剩余次数
      jumpUrl: "",
      img: "",
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.user.token,
      openid: (state) => state.user.info.openid,
    }),
  },
  async mounted() {
    let { orderSource = "" } = this.$root.$mp.query;
    this.orderSource = orderSource;
    this.wechatAppletBanner();
    this.getLotteryData();

    //监听授权后回调
    this.$store.subscribe((mutation, state) => {
      if (mutation.type == "user/setToken") {
        this.getLotteryData();
      }
    });
  },

  onShareAppMessage() {
    let title = "广东车主都在用的ETC会员卡小程序";
    let imageUrl = "http://image.etcchebao.com/member/small.png";
    return {
      title,
      path: "/pages/winning/main?orderSource=" + this.orderSource,
      imageUrl,
    };
  },
  methods: {
    async wechatAppletBanner() {
      let {
        data: { jumpUrl, img },
      } = await wechatAppletBanner();
      this.jumpUrl = jumpUrl;
      this.img = img;
      //this.img = "https://image.etcchebao.com/20210113_Gk24rU.png";
    },

    async getLotteryData() {
      let res = await apiLotteryData({
        code: this.code,
        orderSource: this.orderSource,
        lotteryType: 3,
      });
      if (this.isBarrages) {
        this.defBarrages = [];
        this.barrages = [];
        this.barrages_copy = res.data.winningList;
        this.initBarrage();
        this.isBarrages = false;
      }
      this.level = res.data.level;
      this.isWinning = res.data.isWinning;
      this.lotteryNum = res.data.lotteryNum;
      if (res.data.isWinning) {
        this.dialog = true;
        this.smallImage = res.data.userAwardList[0].smallImage;
        console.log(this.smallImage);
      }
    },
    async toLottery() {
      uni.setStorageSync("lotteryTime", new Date().getTime()); //设置时间,在支付成功后，支付结果页定制的参数
      uni.setStorageSync("lotteryFrom", this.orderSource); //设置渠道id,在支付成功后，支付结果页定制的参数

      if (this.level === 0) {
        let src = encodeURIComponent(
          `${chewu}/vip_shop_guide/dist/confirm?token=${this.token}&openid=${this.openid}&orderSource=${this.orderSource}&packageId=80`
        );
        // https://chewu-test.etcchebao.com/vip_shop_guide/dist/confirm?packageId=29&channelId=68
        uni.navigateTo({
          url: `/pages/webview/main?src=${src}`,
        });
      } else {
        if (!this.isWinning && this.lotteryNum > 0) {
          uni.navigateTo({
            url: `/pages/lottery/main?orderSource=${encodeURIComponent(
              this.orderSource
            )}`,
          });
        } else {
          uni.showToast({
            title: "您已是会员卡用户，立即打开ETC车宝享受车主特权",
            icon: "none",
          });
        }
      }
    },
    toDownLoadApp() {
      uni.navigateTo({
        url: `/pages/webview/main?src=${encodeURIComponent(
          `${wap}/download.html`
        )}`,
      });
    },
    toJumpURL() {
      let jumpURL = this.jumpUrl;
      //let jumpURL="https://store-test.etcchebao.com/#/home"
      if (jumpURL.indexOf("?") > -1) {
        jumpURL = jumpURL + "&token=" + this.token;
      } else {
        jumpURL = jumpURL + "?token=" + this.token;
      }
      uni.navigateTo({
        url: `/pages/webview/main?src=${encodeURIComponent(jumpURL)}`,
      });
    },
    toInfo() {
      uni.navigateTo({
        url: `/pages/winning_info/main`,
      });
    },
    toDialog() {
      this.dialog = false;
    },
    initBarrage() {
      var that = this;
      that.defBarrages = that.barrages_copy;
      const dl = that.defBarrages.length;
      if (dl < 1) {
        return;
      }
      that.addBarrages(dl);
      that.addBarrages(dl);
      that.addBarrages(dl);
      setInterval(() => {
        that.addBarrages(dl);
      }, 2050);
    },
    addBarrages(dl) {
      let bs = this.barrages;
      const keys = (this.bsKeys = this.bsKeys + 1);
      const adKeys = (this.adKeys = this.adKeys > dl - 2 ? 0 : this.adKeys + 1);
      let nbs = this.defBarrages[adKeys];
      bs.push({
        keys: keys,
        str: nbs,
        css: "",
      });
      this.barrages = bs;

      setTimeout(() => {
        if (bs.length > 3) {
          bs[keys - 4].css = "op0 mt";
        }
      }, 50);
    },
  },
};
</script>
<style lang="scss">
page {
  background-color: #16ac73;
}
.c {
  font-size: 0;
}
.c:after {
  content: "";
  display: table;
  clear: both;
}

view {
  position: relative;
  z-index: 2;
}

.winning_body {
  position: relative;
  font-size: 0;
  .body_bg {
    position: absolute;
    // top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    font-size: 0;
    image {
      width: 100%;
    }
  }
  .banner_img {
    > image {
      width: 100%;
      height: 150rpx;
    }
  }
  .winning-tip {
    position: absolute;
    top: 0;
    right: 15px;
    z-index: 9;
    font-size: 0;
    image {
      width: 36px;
      height: 48px;
    }
  }
  .winning_duct {
    position: relative;
    z-index: 2;
    overflow: hidden;
    .duct_bg {
      margin: 240px auto 0;
      text-align: center;
      font-size: 0;
      image {
        width: 364px;
        height: 298px;
      }
    }
    .duct_tips {
      font-size: 14px;
      text-align: center;
      margin-top: -390rpx;
      overflow: scroll;
      position: absolute;
      left: 15px;
      right: 15px;
      span {
        color: #fb8800;
      }
    }
    .duct_box {
      margin-top: -340rpx;
      overflow: scroll;
      position: absolute;
      left: 15px;
      right: 15px;
      .warp {
        width: 130 * 7px;
        display: flex;
        font-size: 0;
        image {
          width: 130px;
          height: 152px;
        }
      }
    }
  }
  .card_box {
    font-size: 0;
    image {
      width: 100%;
    }
  }
  .winning_btn {
    text-align: center;
    /*margin-top: -74px;*/
    z-index: 5;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 0;
    image {
      width: 100%;
    }
  }
  .auth-top {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0;
    z-index: 9999;
    opacity: 0;
    width: 100%;
    height: 150rpx;
  }
  .auth-btn-fixed {
    position: fixed;
    left: 0;
    right: 0;
    height: 165px;
    bottom: 0;
    font-size: 0;
    z-index: 9999;
    opacity: 0;
  }
  .barrage {
    position: absolute;
    transform: translate3d(0, 0, 0);
    top: 150px;
    left: 0px;
    z-index: 2;
    .barrage-list {
      height: 106px;
      > li {
        position: relative;
        color: #fff;
        font-size: 0;
        width: 100%;
        height: 24px;
        margin-top: 2px;
        transition: opacity linear 2.05s, margin-top linear 2.05s;

        &.mt {
          margin-top: -24px;
        }
        &.no {
          display: none;
        }
        &.bl {
          display: block;
        }
        &.op0 {
          opacity: 0;
        }
        &.op1 {
          opacity: 1;
        }
        > .barrage-main {
          white-space: nowrap;
          position: absolute;
          top: 0;
          left: 0;
          font-size: 12px;
          line-height: 2;
          padding: 0 16px 0 8px;
          background-color: rgba(34, 34, 34, 0.5);
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        }
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
