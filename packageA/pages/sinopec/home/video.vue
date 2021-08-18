<template>
  <view class="box">
      <video id="myvideo" ref="myvideo" @click="touchPlay" :src="video_src" :autoplay="autoplay" class="box_item"></video>
  </view>
</template>

<script>
const app = getApp()
export default {
    data(){
        return {
            video_src:null,
            autoplay:true,
            player:false,
        }
    },
    methods: {
      touchPlay(){
        let newVideo = uni.createVideoContext(`myvideo`);
        if(this.player){
           newVideo.play();
           this.player = false;
        }else{
           newVideo.pause();
           this.player = true;
        }
      },
    },
    onShow(){
			this.$store.dispatch("home/ac_share_info",10);//分享配置
    },
    mounted() {
     	let {
			video_src
		} = this.$root.$mp.query;
		this.video_src = video_src
    },
    	/**
		 * 分享好友/群
		 */
		onShareAppMessage(res) {
			return app.shareAppMessage();
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(res) {
			return app.shareTimeline();
		},
}
</script>

<style lang="scss" scoped>
    .box{
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        &_item{
            height: 100vh;
            width: 100vw;
        }
    }
</style>