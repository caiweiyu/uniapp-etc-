<!--
 * @Description: 小程序获取地理信息供给H5
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-06-17 11:00:13
 * @LastEditors: caiweiyu
 * @LastEditTime: 2021-06-17 11:00:13
-->
<template>
  <view class="container">
      <view class="pageH5">
          <web-view :src="url">

          </web-view>
      </view>
  </view>
</template>

<script>
export default {
    data(){
        return {
        }
    },
    methods: {
    
    },
    onLoad:function(options){
            console.log(options)
            let info_detail = options;
            if (info_detail.latitude != '' && info_detail.latitude!=undefined){
            wx.getLocation({//获取当前经纬度
                type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
                success: function (res) {
                wx.openLocation({//​使用微信内置地图查看位置。
                    latitude: Number(info_detail.latitude),//要去的纬度-地址
                    longitude: Number(info_detail.longitude),//要去的经度-地址
                    address: info_detail.address,
                    name: info_detail.name,
                })
                }
            })
        } 
    },
    created() {
 
    },
}
</script>

<style lang='scss'>

</style>