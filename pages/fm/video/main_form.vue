<template>
    <view class="flex" :style="{ overflowX:'hidden',overflowY:show==true ? 'hidden':'auto' }">
        <view class="container" v-if="loading">
            <block v-if="list.length > 0">
                <!--标题-->
                <view class="box">
                    <view class="box_title">
                        <image class="box_title_item" src="https://image.etcchebao.com/etc-min/info/great_active.png" mode="" />
                        <!-- <view class="box_title_item" v-for="(item,index) in title" :key="index">{{item.title}}</view> -->
                    </view>
                </view>
                <view class="item" v-for="(item,index) in hotList" v-if="hotList.length > 0" :key="index" >
                    <view class="item_title">
                        <view>
                            <image :src="item.comment.userImg || user_img" mode="" />
                            <text>{{item.comment.userName}}</text>
                        </view>
                        <view>
                            <text>{{item.comment.likeNum}}</text>
                            <image class="demo-time-image" @click.stop="touchClick(item.comment.id,index,'hotList')" :src="item.isLiked==true ? isclicked[1] : isclicked[0]" mode="" />
                        </view>
                    </view>
                    <view class="item_content">
                        <view :class="['item_content_item']" :style="{display: item.flexBox}">
                            <text :user-select="true">{{item.comment.content}}</text>  
                        </view>
                    </view>
                    <view class="item_bottom">
                        <view>
                            <view class="createTimeColor" v-if="item.comment.createTime != null">{{item.comment.createTime}}</view>
                            <view class="item_bottom_tip" @click="submitComment(item.comment.id,item.comment.userId,item.comment.userName)">回复</view>
                        </view> 
                        <view class="item_bottom_all" v-if="item.comment.content.length > 150"  @click="allExpand(index)">{{item.expandName}}</view>
                    </view>
                </view>
                <view class="noHotList" v-if="hotList.length == 0">
                    暂无热门，等你一顶
                </view>
                <view class="box">
                    <view class="box_title">
                        <image class="box_title_item" src="https://image.etcchebao.com/etc-min/info/new_active.png" mode="" />
                        <!-- <view class="box_title_item" v-for="(item,index) in title" :key="index">{{item.title}}</view> -->
                    </view>
                </view>
                <!--评论列表-->
                <view class="item" v-for="(item,index) in list" :key="index" >
                    <block v-if="item.replyList.length == 0">
                        <view class="item_title">
                            <view>
                                <image :src="item.comment.userImg || user_img" mode="" />
                                <text>{{item.comment.userName}}</text>
                            </view>
                            <view>
                                <text>{{item.comment.likeNum}}</text>
                                <image @click.stop="touchClick(item.comment.id,index)" class="demo-time-image" :src="item.isLiked==true ? isclicked[1] : isclicked[0]" mode="" />
                            </view>
                        </view>
                        <view class="item_content">
                            <view :class="['item_content_item']" :style="{display: item.flexBox}">
                                <text :user-select="true">{{item.comment.content}}</text>
                            </view>
                        </view>
                        <view class="item_bottom">
                            <view>
                                <view class="createTimeColor" v-if="item.comment.createTime != null"> {{item.comment.createTime}}</view>                           
                                <view class="item_bottom_tip" @click="submitComment(item.comment.id,item.comment.userId,item.comment.userName)">回复</view>
                            </view> 
                            <view class="item_bottom_all" v-if="item.comment.content.length > 150" @click="allExpand(index)">{{item.expandName}}</view>
                        </view>
                    </block>
                    <block v-else>
                        <view class="item_title">
                            <view>
                                <image :src="item.comment.userImg || user_img" mode="" />
                                <text>{{item.comment.userName}}</text>
                            </view>
                            <view>
                                <text>{{item.comment.likeNum}}</text>
                                <image @click.stop="touchClick(item.comment.id,index)" class="demo-time-image" :src="item.isLiked==true ? isclicked[1] : isclicked[0]" mode="" />
                            </view>
                        </view>
                        <view class="item_headerlf">
                            <view :class="['item_headerlf_header']"  v-for="(item,indexi) in item.replyList" :key="indexi">
                                <view class="item_headerlf_header_box1">
                                    <view>{{item.userName}}</view>
                                    <view>
                                        {{item.likeNum}}
                                        <image @click.stop="touchClick(item.id,index,indexi)" :src="item.isLiked==true ? isclicked[1] : isclicked[0]" mode="" />
                                    </view>
                                </view>
                                <view class="item_headerlf_header_box2 createTimeColor" v-if="item.createTime != null">
                                    {{item.createTime}}
                                </view>
                                <view :class="['item_headerlf_header_box3']" :style="{display: item.flexBox}">
                                    <text :user-select="true">{{item.content}}</text>  
                                </view>
                                <view @click="allExpandi(index,indexi)" v-if="item.content.length > 150" class="item_headerlf_header_box4">{{ item.expandName }}</view>
                            </view>
                        </view>
                        <view class="item_content">
                            <view :class="['item_content_item']" :style="{display: item.flexBox}">
                                <text :user-select="true">{{item.comment.content}}</text>
                            </view>
                        </view>
                        <view class="item_bottom">
                            <view>
                                <view class="createTimeColor" v-if="item.comment.createTime != null">{{item.comment.createTime}}</view>
                                <view class="item_bottom_tip" @click="submitComment(item.comment.id,item.comment.userId,item.comment.userName)">回复</view>
                            </view> 
                            <view class="item_bottom_all" v-if="item.comment.content.length > 150"  @click="allExpand(index)">{{item.expandName}}</view>
                        </view>
                    </block>
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
                <button @click.stop="bindText" class="bottom_tip_input" :plain="true" type="default">想说点什么吗？</button>
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
        <!--评论弹层-->
        <!-- <u-popup v-model="show" mode="bottom" @close="closepopup" height="300rpx" :custom-style="{color:cancelColor}" width="100%" closeable="true" close-icon-pos="top-left" close-icon="取消" close-icon-size="24"> -->
        <view @click.stop="(()=>{return})" :class="['popup',show==true ? 'popup_active' : '']">
            <view class="popup_header">
                <view @click.stop="canCel">取消</view>
                <view @click.stop="$debounce(formCommentAfter)" :style="{color:sumbitColor}">发布</view>
            </view>
            <view class="popup_content">
                <textarea :cursor-spacing ="keysheight" :show-confirm-bar="isEnter" :value="value" :focus="show"  @blur="bindBlur" @focus="bindFocus"  :placeholder="placeholder"  @input="bindInput" placeholder-class="textarea-placeholder" placeholder-style="color:#CCCCCC;font-size:28rpx" maxlength="150" @confirm="formCommentAfter"></textarea>
            </view>
        </view>
        <view @click.stop="canCel" :class="['box4',show==true ? 'box4_active':'box4_active_off']"></view>
        <!-- <view :class="[show==true ? 'box3':'']" :style="{bottom:'300px'}"></view> -->
		<!-- </u-popup> -->
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
            hotList:[],
            list:[],
            page:1,
            pageSize:10,
            type:5,
            total:0,
            relateId:null,
            loading: false,//加载中...
            is_show:false,
            id:null,
            value:"",
            replyCommentId:'1',
            replyUserId:1,
            isclicked:[
                'https://image.etcchebao.com/etc-min/info/touch.png',
                'https://image.etcchebao.com/etc-min/info/touch_active.png'
            ],
            show:false,
            sumbitColor:'#CCCCCC',
            cancelColor:"#CCCCCC",
            keysheight:120,
            isEnter:true,
            placeholder:"评论将审核筛选后显示",
            user_img:"https://image.etcchebao.com/etc-min/info/undefineuser.png"   
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
                if(data != null && data.newList != null){
                    if(data.newList.length == 0){
                        this.is_show = true
                    }else{
                        /**
                         * 热门评论
                         */
                        for(let i=0;i<data.hotList.length;i++){
                            data.hotList[i].flexBox='-webkit-box';
                            data.hotList[i].expandName='展开全部';
                            data.hotList[i].isLiked=false;
                            data.hotList[i].clickStatus = true;
                            for(let j=0;j<data.hotList[i].replyList.length;j++){
                                data.hotList[i].replyList[j].flexBox='-webkit-box';
                                data.hotList[i].replyList[j].expandName='展开全部';
                                data.hotList[i].replyList[j].isLiked=false;
                                data.hotList[i].replyList[j].clickStatus = true;
                            }
                            this.hotList.push(data.hotList[i]);
                        }
                        
                        /**
                         * 最新评论
                         */
                        for(let i=0;i<data.newList.length;i++){
                            data.newList[i].flexBox='-webkit-box';
                            data.newList[i].expandName='展开全部';
                            data.newList[i].isLiked=false;
                            data.newList[i].clickStatus = true;
                            for(let j=0;j<data.newList[i].replyList.length;j++){
                                data.newList[i].replyList[j].flexBox='-webkit-box';
                                data.newList[i].replyList[j].expandName='展开全部';
                                data.newList[i].replyList[j].isLiked=false;
                                data.newList[i].replyList[j].clickStatus = true;
                            }
                            this.list.push(data.newList[i])
                        }
                        /**
                         * 被回复
                         */

                    };
                    this.total = data.pager.total;
                }else{
                    this.is_show = true,this.list=[],this.hotList=[];
                }
                this.loading = true;
            } 
        },
        formComment(){
            this.value="";
            this.show = true;
            this.placeholder = "评论将审核筛选后显示";
            this.replyCommentId = '1';
            this.replyUserId = 1;  
        },
        /**
         * 提交评论
         */
        formCommentAfter(){
            if((this.value.replace(/\s+/g,"")) == ''){
                uni.showToast({
                    title: '评论内容不能为空',
                    duration: 1500,
                    mask:true,
                    icon:'none'
                });
                return;
            }
           formaddComment({
               type:5,
               relateId:this.id,
               appId:0,
               content: this.value,
               replyCommentId: this.replyCommentId,
               replyUserId: this.replyUserId,
               userIp:'',
               mac:''
           }).then(res=>{
               let {code,data,msg} = res;
               if(res && code == 0){
                    this.$nextTick(()=>{
                        this.loadgetCommentList();
                    }) 
                }else{
                    uni.showToast({
                        title: msg,
                        duration: 1500,
                        mask:true,
                        icon:'none'
                    });
                }
           });
           this.show=false;
        },
        /**
         * 回复评论
         */
        submitComment(id,user_id,name){
            this.formComment();
            this.replyCommentId = id;
            this.replyUserId = user_id;
            this.placeholder = "回复:"+name;
        },
        /**
         * 点击评论
         */
        bindText(){
            this.value="";
            this.show = true;
            this.placeholder = "评论将审核筛选后显示"; 
            this.replyCommentId = '1';
            this.replyUserId = 1; 
        },
        /**
         * 关闭弹层
         */
        canCel(){
            this.show = false;
        },
        /**
         * 失去焦点
         */
        bindBlur(e){
            this.value = e.detail.value;
            this.value != "" ? this.sumbitColor = "#FF5C2A" : this.sumbitColor = "#CCCCCC";
            this.value != "" ? this.cancelColor = "#222222" : this.cancelColor = "#CCCCCC";
        },
        /**
         * 聚集焦点
         */
        bindFocus(e){
            this.show = true; 
        },
        /**
         * 监听输入
         */
        bindInput(e){
            this.value = e.detail.value;
            this.value != "" ? this.sumbitColor = "#FF5C2A" : this.sumbitColor = "#CCCCCC";
            this.value != "" ? this.cancelColor = "#222222" : this.cancelColor = "#CCCCCC";
        },
        /**
         * 处理键盘
         */
        keyboardheightchange(e){
            // this.keysheight = e.detail.height-120;
            console.log(this.keysheight,'键盘')
        },
        /**
         * 展开全部主
         */
        allExpand(index){
            this.list[index].expandName == '展开全部' ? this.list[index].expandName='收起全部' : this.list[index].expandName='展开全部';
            this.list[index].flexBox == '-webkit-box' ? this.list[index].flexBox = 'block' : this.list[index].flexBox = '-webkit-box';
        },
        /**
         * 展开全部副
         */
        allExpandi(index,indexi){
            this.list[index].replyList[indexi].expandName == '展开全部' ? this.list[index].replyList[indexi].expandName='收起全部' : this.list[index].replyList[indexi].expandName='展开全部';
            this.list[index].replyList[indexi].flexBox == '-webkit-box' ? this.list[index].replyList[indexi].flexBox = 'block' : this.list[index].replyList[indexi].flexBox = '-webkit-box';
        },
        /**
         * 点赞评论
         */
        async toformcommentLike(commentId,index,indexj){
            let res = await formcommentLike({
                deviceId:'ea1e3f5d',
                commentId:commentId
            });
            let {code,msg,data} = res;
            if(res && code == 0){
                if(indexj != undefined){
                    this.list[index].replyList[indexj].likeNum=data.totalLike;
                    this.list[index].replyList[indexj].isLiked = true;
                    this.list[index].replyList[indexj].clickStatus = false;
                }else{
                    this.list[index].comment.likeNum=data.totalLike;
                    this.list[index].isLiked = true;
                    this.list[index].clickStatus = false;
                }
            }else{
                if(indexj == 'hotList'){
                    if(this.hotList[index].clickStatus){
                        this.hotList[index].comment.likeNum += 1;
                        this.hotList[index].isLiked = true;
                        this.hotList[index].clickStatus = false;
                    }
                }else if(indexj != undefined){
                    if(this.list[index].replyList[indexj].clickStatus){
                        this.list[index].replyList[indexj].likeNum += 1;                     
                        this.list[index].replyList[indexj].isLiked = true;
                        this.list[index].replyList[indexj].clickStatus = false;                
                    };
                }else{
                    if(this.list[index].clickStatus){
                        this.list[index].comment.likeNum += 1;
                        this.list[index].isLiked = true;
                        this.list[index].clickStatus = false;   
                    };
                    
                }       
            }
        },
        touchClick(id,index,indexj){
            this.toformcommentLike(id,index,indexj);
        },
        //元素:elem 返回的true or false
        isOverHeight(elem){
            setTimeout(()=>{
                let elems = elem.toString()
                let info = uni.createSelectorQuery().in(this).select(elems);
                info.boundingClientRect((data)=>{ 
                    if(data.height >= 126){
                        return true
                    }else{
                        return false
                    }
                }).exec()
            },500)
        },
        /**
         * 刷新列表的方法
         */
        loadgetCommentList(){
            this.list = [], this.hotList=[],this.loading=false,this.value = "",this.page=1,this.sumbitColor = "#CCCCCC";this.show = false; 
            this.getformGetCommentList(this.id);
        }
    },
    mounted() {
        let {
            id
        } = this.$root.$mp.query;  
        this.id = id;
        this.getformGetCommentList(id)
    },
    onPullDownRefresh() {
        let timer = setTimeout( ()=> {
            uni.stopPullDownRefresh();
            clearTimeout(timer)
            this.loadgetCommentList()
        }, 1000);
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
        position: relative;
        height: 100vh;
        .container{
            position: relative;
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
                        width: 247rpx;
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
                    margin-bottom: 38rpx;
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
                .item_headerlf{
                    >view:not(:last-child){
                        border-bottom: 1rpx solid #EBEBEB;
                    }
                    &_header{
                        width: 619rpx;
                        background-color: #F9F9F9;
                        border-radius: 4rpx;
                        display: block;
                        margin-left: 90rpx;
                        &_box1{
                            display: flex;
                            justify-content: space-between;
                            >view:nth-child(1){
                                color: #666666;
                                font-size: 28rpx;
                                margin-left: 31rpx;
                                margin-top: 32rpx;
                            }
                            >view:nth-child(2){
                                font-size: 22rpx;
                                color: #222222;
                                margin-top: 31rpx;
                                image{
                                    width: 26rpx;
                                    height: 26rpx;
                                    display: inline-block;
                                    vertical-align: middle;
                                    margin: 0 28rpx 0 16rpx;
                                }
                            }
                        }
                        &_box2{
                            margin: 19rpx 0 0 32rpx;
                            color: #CCCCCC;
                            font-size: 24rpx;
                        }
                        &_box3{
                            padding: 0 0 31rpx 0;
                            margin: 19rpx 0 0 32rpx;
                            color: #222222;
                            font-size: 32rpx;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            -webkit-box-orient: vertical;
                            word-wrap:break-word;
                            word-break: break-all;
                            -webkit-line-clamp: 6;
                            width: 548rpx;
                        }
                        &_box4{
                            margin: 31rpx 0 0 483rpx;
                            padding-bottom: 29rpx;
                            color: #44A0FF;
                            font-size: 24rpx;
                        }
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
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    margin: 0rpx 0 33rpx 100rpx;
                    width: 661rpx;
                    height: 103rpx;
                    line-height: 103rpx;
                    border-bottom: 1rpx solid #EBEBEB;
                    &_tip{
                        display: inline-block;
                        margin: 0 0 0 55rpx;
                    }
                    &_all{
                        margin-right:40rpx;
                        color: #44A0FF;
                        font-size: 24rpx;
                    }
                }
            }
            .noHotList{
                text-align: center;
                font-size: 29.59rpx;
                color: #999999;
                margin: 49rpx auto 97rpx;
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
                height: 92rpx;
                background-color: #ffffff;
                display: block;
                margin: auto;
                position: fixed;
                bottom: 0;
                &_input{
                    display: block;
                    width: 690rpx;
                    height: 64rpx;
                    line-height: 64rpx;
                    font-size: 28rpx;
                    margin: auto;
                    background-color:#F9F9F9;
                    color:#CCCCCC;
                    text-align:left;
                    border:none;
                    border-radius: 32rpx;
                    padding-left: 25rpx;
                }
            }
        }
        .box3{
            width: 100%;
            height: calc(100vh - 300rpx);
            position: fixed;
            // top: calc(667rpx);
            z-index: 10088;
            background-color: none;
        }
        .box4{
            width: 100%;
            position: fixed;
            top: 0rpx;
            z-index: 10087;
            background-color: rgba(0,0,0,0.4);
        }
        .box4_active{
            height: calc(100vh - 300rpx) !important;
            transition: height linear 0s;
        }   
        .box4_active_off{
            height: 0vh !important;
            transition: height linear 0s;
        }
        .popup_active{
            height: 300rpx !important;
            transition: height linear 0.2s;
        }
        .popup{
            border-top: 1rpx solid #EBEBEB;
            background-color: #ffffff;
            z-index: 10089;
            width: 100%;
            position: fixed;
            bottom: 0rpx;
            height: 0rpx;
            &_header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 90rpx;
                font-size: 24rpx;
                >view:nth-child(1){
                    color: #999999;
                    padding: 0 30rpx;
                }
                >view:nth-child(2){
                    padding: 0 30rpx;
                }
            }
            &_content{
                display: block;
                margin: 0 auto 20rpx;
                width: 690rpx;
                height: 187rpx;
                background-color: #FFFFFF;
                textarea{
                    width: 650rpx;
                    height: 153rpx;
                    padding:17rpx 20rpx;
                    background-color: #F5F5F5;
                }
            }
        }
    }
    .createTimeColor{
        color: #CCCCCC;
        font-size: 24rpx;
        display: inline-block;
    }
    /deep/.textarea-placeholder{
        color: #CCCCCC !important;
    }
</style>