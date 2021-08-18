<!--
 * @Description: 小程序获取地理信息供给H5
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-06-17 11:00:13
 * @LastEditors: caiweiyu
 * @LastEditTime: 2021-06-17 11:00:13
-->
<template>
</template>

<script>
export default {
    data(){
        return {
            isGoback:false,
            info_detail:{},
            isOpenSetting:false
        }
    },
    methods: {
        getLocation(){
                let info_detail = this.info_detail;
                if (info_detail.latitude != '' && info_detail.latitude!=undefined){
                wx.getLocation({//获取当前经纬度
                    type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
                    success: (res)=> {
                        wx.openLocation({//​使用微信内置地图查看位置。
                            latitude: Number(info_detail.latitude),//要去的纬度-地址
                            longitude: Number(info_detail.longitude),//要去的经度-地址
                            address: info_detail.address,
                            name: info_detail.name,
                        })
                    },
                    fail: (err)=>{
                        wx.showToast({
                            title: '手机定位未打开',
                            icon: 'none',
                            duration: 2000 
                        })
                    }
                });
                setTimeout(()=>{
                    this.isGoback=true;//处理返回的参数
                },500)
            }
        },
        /**
         * 获取设置授权
         */
        getRootMap(){
            uni.getSetting({
                success:res=>{
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success:(res)=> {
                            this.getLocation()
                        },
                        fail:(err)=> {
                            wx.showModal({
                                title: '提示',
                                content: '您未开启保定位权限，请点击确定去开启权限！',
                                success:res=> {
                                    if (res.confirm) { 
                                        wx.openSetting();
                                        this.isOpenSetting = true;
                                    }else{
                                        uni.navigateBack();
                                        this.isGoback = false;
                                    }
                                },
                                fail:err=> {
                                    wx.showToast({
                                        title: '未获取定位权限，请重新打开设置',
                                        icon: 'none',
                                        duration: 2000 
                                    })
                                }
                            })
                    }
                    })
                }else {
                        this.getLocation()
                    }
                }
            });
        }
    },
    onLoad(options){
        this.info_detail = options;
        this.getRootMap()
    },
    onShow(){
        //开启的情况下
        if(this.isOpenSetting){
            this.getRootMap();
            this.isOpenSetting = false;
        }
        //处理返回白屏的情况
        if(this.isGoback){
            uni.navigateBack();
            this.isGoback = false;
        }; 
    },
    mounted() {
  
    },
    created() {
 
    },
}
</script>

<style lang='scss'>

</style>