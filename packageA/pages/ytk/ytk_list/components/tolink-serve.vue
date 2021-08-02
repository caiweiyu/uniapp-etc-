<template>
  <view class="box">
      <text class="box_content" @click="$debounce(tolinkServe)">充值未到账？</text>
  </view>
</template>

<script>
import {user} from "@/common/constant"
export default {
    props:{
        data:{
            type:String,
            default:''
        }
    },
    data(){
        return {

        }
    },
    methods: {
        tolinkServe(){
            uni.showModal({
                title:"充值未到账?",
                icon:'none',
                mask:true,
                content:"若确认粤通卡内有该笔充值金额，请联系客服核查",
                cancelText:"点错了",
                showCancel:true,
                cancelColor:"#000000",
                confirmText:"联系客服",
                confirmColor:"#FFCA81",
                success:res=>{
                    if(res.confirm){
                        uni.showToast({
                            title: '您已成功复制订单号',
                            icon:'none',
                            duration: 2000,
                            success:res=>{
                                setTimeout(()=>{
                                    this.successPage()
                                },2000)
                            }
                        });
                    }else if(res.cancel){}       
                }

            })
        },
        successPage(){
            uni.setClipboardData({
                data: this.data,
                success: function () {
                     uni.navigateTo({
                            url: `/pages/webview/main?src=${encodeURIComponent(`${user}/qiyu/index.html?isGps=0`)}`,
                    });
                }
            });
        }
    },
}
</script>
<style lang="scss" scoped>
    .box{
        border: 1rpx solid #ddd;
        border-radius: 120rpx;
        width: 220rpx;
        height: 50rpx;
        line-height: 50rpx;
        // text-align: center;
        &_content{
            color: #000;
            font-size: 30rpx;
            text-align: center;
            // margin: auto;
            margin-left: 28rpx;
        }

    }
</style>