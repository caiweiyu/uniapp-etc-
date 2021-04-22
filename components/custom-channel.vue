<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: 杜兴旺
 * @Date: 2021-04-22 17:16:48
 * @LastEditors: 杜兴旺
 * @LastEditTime: 2021-04-22 20:31:54
-->
<template>
  <view class="costom-channel">
    <view class="channel-list">
      <view
        v-for="(item, index) in channelData"
        :key="index"
        @click="toJumpUrl(item.jump_url)"
      >
        <image :src="item.pic_url"/>
      </view>
    </view>
  </view>
</template>

<script>
import * as API from "@/interfaces/base";
export default {
	props: {
	  type: {
	    type: String,
	    default: "1",
	  },
	},
  data() {
    return {
      channelData: [],
    };
  },
  mounted() {
	let { from_type } = this.$root.$mp.query;
    this.currentPath = "/" + this.$root.$mp.page.route;
	this.getChannelList(from_type);
  },
  methods: {
    async getChannelList(from_type) {
      let res = await API.getChannelList({
        os: 1,
		location: this.type,
		fromType: from_type,
      });
      if (res.data.length > 0) {
        this.channelData = res.data;
      }
    },
    toJumpUrl(url) {
      if (url === this.currentPath) {
        return;
      }
      wx.redirectTo({
        url: url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.costom-channel {
  position: fixed;
  z-index: 9999;
  top: 170rpx;
  width: 100%;
  height: 80rpx;
  text-align: center;
  .channel-list {
    width: 100%;
    height: 80rpx;
  }
  .channel-list image {
    width: 100%;
    height: 80rpx;
  }
}
</style>
