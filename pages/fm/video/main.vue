<template>
    <view>
        <!--视频播放页-->
        <view class="box">
                <view class="box_containter">
                    <swiper class="swiper"
                        :current="current"
						:indicator-dots="indicatorDots"
						:circular="circular"
						:duration="duration"
						:vertical="vertical"
                        :touchable="touchable"
                        :disable-touch="true"
                        @transition="handlerposition"
                        @animationfinish="animationfinishhandler"
						style="height: 100%;"
						@change="swiperChange"
                        v-if="lists && lists.length > 0"
                        >
                        <block  v-for="(item,index) in lists" :key="index">
                            <swiper-item  style="position: relative;">
                                <block v-if="index == currentValue">
                                        <view class="uni_vdplayer">
                                        <!-- controls:是否显示默认播放控件（播放/暂停按钮、播放进度、时间）,loop:是否循环播放，show-center-play-btn：是否显示视频中间的播放按钮，object-fit：当视频大小与 video 容器大小不一致时，视频的表现形式。contain：包含，fill：填充，cover：覆盖 -->
                                            <video :id="'myVideo' + index"
                                                :ref="'myVideo' + index"
                                                @play="dealPlay(item.id,item.frontImage,item.title)"
                                                @pause="dealPause"
                                                @fullscreenclick="fullscreenclick"
                                                class="player-video"
                                                :src="item.videoUrl"
                                                :controls="false"
                                                :loop="true"
                                                :show-center-play-btn="false"
                                                @click.stop="videoPlayPuse"
                                                objectFit="contain">
                                            </video>
                                            <image v-if="showStatus" @click.stop="videoPlayPuse" class='player-image' :src="puaseIcon"></image>
                                        </view>
                                        <view class="box_title">
                                            <image :src="item.artist.avatar"></image>
                                            <text>{{item.artist.name}}</text>
                                        </view>
                                        <view class="box_intro">
                                            <text>{{item.title}}</text>
                                        </view>
                                        <view class="box_layout">
                                            <view class="box_layout_info" @click="commentsList(item)">
                                                <image src="https://image.etcchebao.com/etc-min/info/info.png"></image>
                                                <text>{{item.comentCount}}</text>
                                            </view>
                                            <view class="box_layout_share" style="opacity:0">
                                                <image src="https://image.etcchebao.com/etc-min/info/share.png"></image>
                                                <text>{{item.shareCount}}</text>
                                            </view>
                                            <view class="box_layout_like" @click.stop="clickLike(item,index)">
                                                <image :src="item.isLike == 1 ? 'https://image.etcchebao.com/etc-min/info/liked.png' : 'https://image.etcchebao.com/etc-min/info/like.png'"></image>
                                                <text>{{item.likeCount}}</text>
                                            </view>
                                        </view>
                                </block>
                            </swiper-item>
                        </block>
                    </swiper>
                </view>

        </view>
    </view>
</template>

<script>
import { videoList,changeVideoLike } from "@/interfaces/info";
let list= [
    [], //旧
    []  //新
]; //总视频数量列表
export default {
  data() {
    return {
      num:1,     //基数
      total:0,    //总条数
      total_num:0,
      pageTotal:0,  //页总数
      videoBox:[], //存放视频盒子
      current:0,   //当前下标
      videoBoxIndex:0, //总下标
      circular:false, //是否衔接滑动
      pageIndex:1, //当前页下标
      player:null,  //视频对象
      indicatorDots:false,  //显示面板指示点
      duration:200,  //滑动动画时长
      vertical:true,//是否纵向
      touchable:true, //监听用户触摸事件
      status:false, //播放状态
      pageSize:0,  //页尺
      showStatus:false,
      lists:[],
      currentValue:0,
      idValue:null, //播放视频的id值
      share:{title:"",imageUrl:"",ID:0},
      puaseIcon:"https://image.etcchebao.com/etc-min/info/puase.png",
    };
  },
  watch:{
        lists: {
            handler(newName, oldName) {},
            immediate: true,
            deep: true
        },
         currentValue: {
            handler(newName, oldName) {},
            immediate: true,
            deep: true
        },
  },
  components:{},
  methods: {
      getvideoList(data) {
        videoList({
            videoId: data,  //videoId
            artistId: 0,
            source: 0,
            page: this.pageIndex,
            pageSize:10
      }).then(res=>{
            let { code, data, msg } = res;
            if (code == 0 && msg == "success") {
                this.total = data.pager.total;
                this.pageTotal = data.pager.pageTotal;
                this.pageSize = data.pager.pageSize;
                for(let i=0;i<data.list.length;i++){
                    this.lists.push(data.list[i])
                }
                this.total_num +=data.list.length;

                this.getVideolistbox();
            }
      });
    },
    dealPlay(ID,imageurl,title){
        this.share.ID = ID;
        this.share.imageUrl = imageurl;
        this.share.title = title;
        this.showStatus=false;
    },
    dealPause(){
        this.showStatus=true;
    },
    //点赞方法
    clickLike(item,index){
        item.isLike==1 ? this.focusClickfn(item,0,index) : this.focusClickfn(item,1,index);
    },
    //点赞
    async focusClickfn(item,param,index){
        let res = await changeVideoLike({
            videoId:item.id,
            isLike:param
        })
        let {code,msg,data} = res
        if(code == 0){
            param ==1 ? this.lists[index].isLike = 1 : this.lists[index].isLike = 0;
            param ==1 ? this.lists[index].likeCount+=1 : this.lists[index].likeCount-=1;
        }
    },
    commentsList(item){
        uni.navigateTo({
             url: `/pages/fm/video/main_form?id=${item.id}`
        });
    },
    //获取播放列
    getVideolistbox(){
        if(!this.player){
            this.player = uni.createVideoContext(`myVideo${this.current}`);
            this.player.play();
            this.status = true;
        }
    },
    //滑动视频操作
    swiperChange(current){
        this.currentValue = this.current = current.target.current;
        let newVideo = uni.createVideoContext(`myVideo${this.current}`);
        this.share.ID = this.$refs.index
        this.player = newVideo;
        this.status = true;
        this.showStatus = false;
        this.player.play();
        //预加载视频处理
        if(this.current+1 >= this.total){
            uni.showToast({
                title:'无更多视频',
                icon:'none'
            });
            return;
        }else{
            if(this.current+1 == this.total_num){
                this.pageIndex++;
                this.num++;
                this.getvideoList(this.idValue)
            }
        }
        return;
    },
    fullscreenclick(){
        this.videoPlayPuse()
    },
    //视频播放及暂停
    videoPlayPuse(){
        let newVideo = uni.createVideoContext('myVideo'+this.current,this);
        this.player = newVideo;
         if(this.status){
             this.player.pause();
             this.status = false;
         }else{
             this.player.play();
             this.status = true;
         }
    },
    handlerposition(e){},
    animationfinishhandler(current){},
    contain(){}
  },
    /**
     * 分享好友/群
     */
    onShareAppMessage(res) {
        return {
            title: this.share.title,
            imageUrl: this.share.imageUrl,
            path: "/pages/fm/video/main?ID="+this.share.ID
        }
    },
    /**
     * 分享朋友圈
     */
    onShareTimeline(res) {
        return {
            title: this.share.title,
            imageUrl: this.share.imageUrl,
            path: "/pages/fm/video/main?ID="+this.share.ID
        }
    },
  destroyed(){
      console.log('销毁了---');
  },
  mounted() {
        let { ID } = this.$root.$mp.query;
        console.log(ID,'---99--')
        this.idValue = ID;
        this.getvideoList(ID);
  },
  onShow(){
      this.$token(()=>{
        let { ID } = this.$root.$mp.query;
        console.log(ID,'---99--')
        this.idValue = ID;
        this.getvideoList(ID);
      })
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
    &_containter {
        background-color: #000;
        height: 100vh;
        width: 100vw;
        .box_title {
            position: absolute;
            top: 42rpx;
            left: 42rpx;
            z-index:999;
            image {
                width: 67.22rpx;
                height: 67.22rpx;
                border-radius: 50%;
                display: inline-block;
                vertical-align: middle;
            }
            text {
                margin-left: 20rpx;
                color: #ffffff;
                font-size: 32rpx;
                display: inline-block;
                vertical-align: middle;
            }
        }
        .uni_vdplayer{
            height: 100%;
            >video{
                width: 100%;
                height: 100%;
            }
           .player-video{
               z-index:1;
           }
           .player-image{
               display: inline-block;
               width: 100rpx;
               height: 100rpx;
               position: absolute;
               left: 50%;
               top: 50%;
               transform: translate(-50%,-50%);
           }
        }
        .box_intro {
            z-index: 998;
            position: absolute;
            width: 659rpx;
            height: 83rpx;
            bottom: 129rpx;
            color: #ffffff;
            font-size: 32rpx;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            left:50%;
            transform: translateX(-50%);
            -webkit-box-orient: vertical;
        }
        .box_layout {
            position: fixed;
            display: flex;
            bottom: 28rpx;
            z-index: 999;
            &_info {
            margin-left:54rpx;
            >image{
                width: 48rpx;
                height: 48rpx;
                display: block;
                z-index: 888;
            }
            > text {
                text-align: center;
                display: block;
                font-size: 24rpx;
                color: #ffffff;
            }
        }
        &_share {
            margin-left:66rpx;
            >image{
                width: 48rpx;
                height: 48rpx;
                display: block;
                z-index: 888;
            }
            > text {
                text-align: center;
                display: block;
                font-size: 24rpx;
                color: #ffffff;
            }
        }
        &_like {
            margin-left:432rpx;
            >image{
                width: 48rpx;
                height: 48rpx;
                display: block;
                z-index: 888;
            }
            > text {
                text-align: center;
                display: block;
                font-size: 24rpx;
                color: #ffffff;
            }
        }
      }
    }
}
</style>
