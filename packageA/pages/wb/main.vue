<template>
  <view class="box">
    <block v-if="Object.keys(imgs).length > 0 && imgsParams.length > 0" v-for="(item,index) in imgs" :key="index">
        <image :src="imgs[index]" mode="" :style="{width:imgsParams[index].width,height:imgsParams[index].height}" />
    </block>
    <view class="box_bottom">
        <image :src="allImage[2]" class="box_bottom_image" mode="" @click.stop="agreeIdea" />
        <view class="box_bottom_view">
            <image class="box1" :src="isAgree ? allImage[1] : allImage[0]" mode="" @click.stop="isCheck" />
            <text class="box2">我同意授权ETC车宝将我的车辆信息及姓名、身份证号身份信息共享给腾讯微保用于领取救援服务并投保意外险</text>
        </view>
    </view>
  </view>
</template>

<script>
import {
    getwbIndex,
    getwbJump,
} from "@/interfaces/order";
import miniScript from "@/common/miniScript"
const  miniapp = miniScript.getInstance()
import { mapState } from "vuex"
export default {
    data(){
        return{
            allImage:[
                "https://image.etcchebao.com/etc-min/wb/unchecked_icon.png",
                "https://image.etcchebao.com/etc-min/wb/checked_icon.png",
                "https://image.etcchebao.com/etc-min/wb/wb_submit.png"
            ],
            isAgree:false,
            imgs:[],
            imgsParams:[],
            item:{}
        }
    },
    computed:{
        ...mapState({
			token: (state) => state.user.token
        })
    },
    methods: {
        /**
         * 微保首页
         */
        async getwbIndex(){
            let res = await getwbIndex({})
            let {
                code,
                msg,
                data
            } = res;
            if(code == 0){
                let _this = this;
                if(Object.keys(data.img).length > 0){
                    for(let i in data.img){
                        _this.imgs.push(data.img[i]);
                        uni.getImageInfo({
                            src: data.img[i],
                            success: function (image) {
                                _this.imgsParams.push({
                                    width:'750rpx',
                                    height:(image.height * 750)/image.width +'rpx'
                                })
                            }
                        });
                    }
                }
            }
        },
        /**
         * 微保跳转
         */
        async getwbJump(){
            let res = await getwbJump({
                token:this.token
            });
            let {
                code,
                msg,
                data
            } = res;
            if(code == 0){
                this.item = data;
                this.item.jump_type = 2;
                this.jump_url = data.mini_jump_url
            }
        },
        /**
         * 是否勾选
         */
        isCheck(){
            this.isAgree = !this.isAgree;
        },
        /**
         * 点击跳转
         */
        agreeIdea(){
            if(!this.isAgree){
                uni.showToast({
                    title: '请先同意授权',
                    duration: 1500,
                    icon:"none",
                    mask:true
                });
                return;
            }
            if (typeof(this.item.subs_template_id) == "string") {
					// 消息订阅
					let arr = [];
					arr.push(this.item.subs_template_id);
					miniapp.subscribe(arr, (res)=>{
						this.callback(this.item);
					}, (err)=> {
						this.callback(this.item);
					})
            } else {
                // 直接跳转
                this.callback(this.item);
            }
            console.log('正在跳转第三方小程序...')
        },
        callback(item) {
            // 跳转page || miniProgram
            miniapp.miniProgramRouter(item, (res)=>{
                
            }, (err)=> {
                
            })
        },
    },
    mounted() {
        console.log('token=====',this.token)
        this.getwbIndex()
        this.getwbJump()
    },
}
</script>

<style scoped lang="scss">
    .box{
        position: relative;
        width: 100%;
        // height: 2000rpx;
        background-color: #ddd;
        &_bottom{
            position: fixed;
            z-index: 1;
            bottom: 0;
            border: 1rpx solid transparent;
            width: 100%;
            height: 300rpx;
            background-color: #ffffff;
            &_image{
                width: 618rpx;
                height: 134rpx;
                display: block;
                margin: auto;
                margin-top: 21rpx;
            }
            &_view{
                display: flex;
                flex-direction: row;
                margin: auto;
                vertical-align: middle;
                .box1{
                    display: inline-block;
                    width: 32rpx;
                    height: 32rpx;
                    border-radius: 50%;
                    margin: 16rpx 0 0 40rpx;
                }
                .box2{
                    color: #999999;
                    font-size: 24rpx;
                    height: 65rpx;
                    width: 597rpx;
                    display: inline-block;
                    text-align: center;
                    margin: 16rpx 0 0 17rpx;
                }
            }
        }
    }
</style>