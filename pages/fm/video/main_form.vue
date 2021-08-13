<template>
    <view class="container">
         <!--标题-->
          <view class="box">
            <view class="box_title">
                <view class="box_title_item" v-for="(item,index) in title" :key="index">{{item.title}}</view>
            </view>
          </view>
          <!--评论列表-->
          <view class="item" v-for="(item,index) in list.newList" :key="index" >
              <view class="item_title">
                  <view>
                      <image :src="item.comment.userImg" mode="" />
                      <text>{{item.comment.userName}}</text>
                  </view>
                  <view>
                      <text>{{item.comment.likeNum}}</text>
                      <image src="https://image.etcchebao.com/etc-min/info/like.png" mode="" />
                  </view>
              </view>
              <view class="item_content">
                  {{item.comment.content}}
              </view>
              <view class="item_bottom">
                  <view>{{item.comment.createTime}}</view>
                  <view>回复</view>
                  <view>展开全部</view>
              </view>
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
            list:{},
            page:1,
            pageSize:10,
            type:5,
            relateId:null
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
                this.list = data
            } 
        }
    },
    mounted() {
        let {
            id
        } = this.$root.$mp.query;
        this.getformGetCommentList(id)
    },
}
</script>

<style lang="scss" scoped>
.container{
    position: relative;
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
        }
        &_content{
            width: 606rpx;
            height: 270rpx;
            overflow: hidden;
            word-break: break-all;
            word-wrap: break-word;
            font-size: 32rpx;
            color: #222222;
        }
        &_bottom{
            display: flex;
            flex-wrap: nowrap;
        }
    }
}
</style>