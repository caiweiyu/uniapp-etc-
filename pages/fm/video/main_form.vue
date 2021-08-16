<template>
    <view class="flex">
        <view class="container" v-if="loading">
            <block v-if="list.length > 0">
                <!--标题-->
                <view class="box">
                    <view class="box_title">
                        <view class="box_title_item" v-for="(item,index) in title" :key="index">{{item.title}}</view>
                    </view>
                </view>
                <!--评论列表-->
                <view class="item" v-for="(item,index) in list" :key="index" >
                    <view class="item_title">
                        <view>
                            <image :src="item.comment.userImg" mode="" />
                            <text>{{item.comment.userName}}</text>
                        </view>
                        <view>
                            <text>{{item.comment.likeNum}}</text>
                            <image class="demo-time-image" src="https://image.etcchebao.com/etc-min/info/touch.png" mode="" />
                        </view>
                    </view>
                    <view class="item_content">
                        <view :class="['item_content_item','u-line-6']">
                            {{item.comment.content}}测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
                        </view>
                    </view>
                    <view class="item_bottom">
                        <view>{{item.comment.createTime}}</view>
                        <view class="item_bottom_tip">回复</view>
                        <view>展开全部</view>
                    </view>
                </view>
            </block>
            <block v-if="list.length==0 && is_show==true">
                <view class="no_card">
                    <image class="no_card_box1" :src="'https://image.etcchebao.com/etc-min/info/no_any.png'" mode="" />
                    <text class="no_card_box2" >暂无评论，老司机快来抢沙发吧</text>
                    <view class="no_card_box3" @click="formComment">马上抢沙发</view>
                </view>
            </block>
            <view class="bottom_tip" v-if="loading">
                <input placeholder="想说点什么吗？" :value="value" @confirm="formCommentAfter" :cursor="15" :selection-start="25" :focus="focus" @blur="blur" placeholder-style="#CCCCCC" class="bottom_tip_input" type="text">
            </view>
        </view>
        <view v-if="!loading"
            :style="[
                {margin: '0 auto'},
                {padding: '300rpx 0 0 0'},
                {width: '50rpx'}
            ]">
            <u-loading mode="circle" size="50" color="#FF5C2A"></u-loading>
        </view>
    </view>
</template>

<script>
import { formGetCommentList,formaddComment,formcommentLike } from "@/interfaces/info";
export default {
    data(){
        return{
            title:[
                {title:"精"},
                {title:"彩"},
                {title:"评"},
                {title:"论"},
            ],
            list:[],
            page:1,
            pageSize:10,
            type:5,
            total:0,
            relateId:null,
            loading: false,//加载中...
            is_show:false,
            id:null,
            focus:false,
            value:"这个视频好看"
        }
    },
    methods:{
        async getformGetCommentList(id){
            let res = await formGetCommentList({
                    type:this.type,
                    page:this.page,
                    pageSize:this.pageSize,
                    relateId:id
                })
            let {code,msg,data} = res
            if(code == 0){
                if(data.newList != null){
                    if(data.newList.length == 0){
                        this.is_show = true
                    }else{
                        for(let i=0;i<data.newList.length;i++){
                            this.list.push(data.newList[i])
                        }
                    };
                    this.total = data.pager.total;
                }else{
                    this.is_show = true,this.list=[];
                }
                this.loading = true;
            } 
        },
        formComment(){
            this.focus = true;
        },
        formCommentAfter(){
           formaddComment({
               type:5,
               relateId:this.id,
               appId:0,
               content:this.value,
               replyCommentId:'0',
               replyUserId:0,
               userIp:'127.0.0.1',
               mac:'e2a134f5'
           }).then(res=>{
               let {code,data,msg} = res;
               if(code == 0){
                   this.list = [];
                   this.getformGetCommentList(this.id);
                   this.value = "";
               }
           })
        },
        /**
         * 失去焦点
         */
        blur(e){
            console.log(e,'失去焦点')
            this.value = e.detail.value;
        }
    },
    mounted() {
        let {
            id
        } = this.$root.$mp.query;
        this.id = id;
        this.getformGetCommentList(id)
    },
    onReachBottom(){
        let len = this.list.length;
        if(len >= this.total){
            return;
        }
        this.page +=1;
        this.getformGetCommentList(this.id)
    }
}
</script>

<style lang="scss" scoped>
    .flex{
        .container{
            position: relative;
            overflow: auto;
            padding-bottom: 92rpx;
            .box{
                position: relative;
                left: 50%;
                transform: translateX(-16%);
                &_title{
                    display: flex;
                    margin:50rpx auto 0;
                    &_item{
                        font-size: 45rpx;
                        font-weight: bold;
                        width: 55rpx;
                        height: 55rpx;
                        border: 2rpx solid #D1A86A;
                        margin: 5rpx;
                        line-height: 50rpx;
                        color:#D1A86A;
                        text-align: center;
                    }
                }
            }
            .item{
                position: relative;
                margin-top: 29rpx;
                &_title{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    >view:nth-child(1){
                        image{
                            width: 50rpx;
                            height: 50rpx;
                            border-radius: 50%;
                            vertical-align: middle;
                            display: inline-block;
                            margin: 0 19rpx 0 31rpx;
                        }
                        text{
                            display: inline-block;
                            font-size: 28rpx;
                            color: #666666;
                        }
                    }
                    >view:nth-child(2){
                        image{
                            width: 29rpx;
                            height: 27rpx;
                            display: inline-block;
                            vertical-align: middle;
                        }
                        text{
                            font-size: 22rpx;
                            color: #222222;
                        }
                    }
                    .demo-time-image{
                        width: 26rpx;
                        height: 26rpx;
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 36rpx 0 17rpx;
                    }
                }
                &_content{
                    display: flex;
                    &_item{
                        width: 606rpx;
                        // height: 241rpx;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        -webkit-box-orient: vertical;
                        word-wrap:break-word;
                        word-break: break-all;
                        -webkit-line-clamp: 6;
                        font-size: 32rpx;
                        color: #222222;
                        margin: 20rpx 0 0 99rpx;
                    }
                }
                &_bottom{
                    display: flex;
                    flex-wrap: nowrap;
                    margin: 0rpx 0 33rpx 100rpx;
                    width: 661rpx;
                    height: 103rpx;
                    line-height: 103rpx;
                    border-bottom: 1rpx solid #EBEBEB;
                    &_tip{
                        margin: 0 293rpx 0 55rpx;
                    }
                }
            }
            .no_card{
                display: block;
                position: fixed;
                left: 50%;
                top: 40%;
                transform: translate(-50%,-50%);
                &_box1{
                    display: block;
                    width: 510rpx;
                    height: 275rpx;
                }
                &_box2{
                    display: block;
                    margin: auto;
                    text-align: center;
                    color: #222222;
                    font-size: 30rpx;
                }
                &_box3{
                    width: 290rpx;
                    height: 99rpx;
                    line-height: 99rpx;
                    text-align: center;
                    color: #222222;
                    font-size: 32rpx;
                    border: 2rpx solid #EBEBEB;
                    border-radius: 120rpx;
                    margin: 30rpx auto 0;
                }
            }
            .bottom_tip{
                width: 100%;
                display: block;
                margin: auto;
                position: fixed;
                bottom: 28rpx;
                &_input{
                    display: block;
                    width: 690rpx;
                    height: 64rpx;
                    line-height: 64rpx;
                    margin: auto;
                    background-color: #F9F9F9;
                    border-radius: 32rpx;
                    padding-left: 25rpx;
                }
            }
        }
    }
</style>