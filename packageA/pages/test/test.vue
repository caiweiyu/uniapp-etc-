<template>
    <view>
        <view style="width: 100%; margin-top: 10px">
            <button @click="share(1)">分享电商</button>
			<button @click="share(2)">分享加油</button>
			<button @click="share(3)">分享会员卡</button>
			<button @click="nfc()">nfc测试</button>
            <button @click="getOpenid()">getOpenid</button>
            <button @click="getInfo()">getInfo</button>
            <button @click="getQRCode()">getQRCode</button>
            <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号码</button>
        </view>
    </view>
</template>

<script>
    import { mapState } from "vuex"
    export default {
        data() {
			return {
			};
        },
        computed: {
            ...mapState({
                share_id: (state) => state.user.info.userid,
            }),
        },
        onLoad() {
        },
		mounted() {
		},
        methods: {
            getPhoneNumber(e) {
                console.log('getPhoneNumber-e',e)
                wx.cloud.callFunction({
                    name: 'getPhoneByCloundID', // 对应云函数名
                    data: {
                        phoneData: wx.cloud.CloudID(e.detail.cloudID),
                    },
                    complete: (res) => {
                        console.log('getPhoneByCloundID',res)
                        const phoneNumber = res.result.phoneNumber;
                        console.log(phoneNumber)
                    }
                })
            },
            getOpenid() {
                wx.cloud.callFunction({
                    name: "getOpenid",
                    complete: (res) => {
                        console.log('getOpenid',res)
                        let openid = res.result.openId;
                    },
                });
            },
            getInfo() {
                wx.cloud.callFunction({
                    name: "getInfo",
                    complete: (res) => {
                        console.log('getInfo',res)
                    },
                });
            },
            getQRCode() {
                wx.cloud.callFunction({
                    name: "getQRCode",
                    data:{
                        scene:'from_type=1&share_id=0',
                        page:''
                    },
                    complete: (res) => {
                        console.log('getQRCode',res)
                    },
                });
            },
            share(type) {
				let title,h5_url =""
				let img_url ="https://image.etcchebao.com/etc-min/share_icon.png"
				if(type===1){
					h5_url ="https://store-test.etcchebao.com/#/home"
					title = "分享电商"
				}else if(type===2){
					h5_url ="https://user-test.etcchebao.com/lbsoil/refuel-list.html?isGps=1"
					title = "分享加油"
				}else if(type===3){
					h5_url ="https://chewu-test.etcchebao.com/vip/dist/#/index"
					title = "分享会员卡"
				}
				let share_data = {
				    'title': title,
				    'img_url': img_url,
				    'h5_url': encodeURIComponent(h5_url),
				}
				uni.navigateTo({url: "/pages/share/main?share_data="+JSON.stringify(share_data)})
				//wx.redirectTo({url: "/pages/share/main?share_data="+JSON.stringify(share_data)})
            },
			nfc(){
			    uni.navigateTo({
			        url: `/pages/test/nfc`,
			    });
			},
			test() {
				let jump_url ="https://passport-dev.etcchebao.com/test/a2.html"
				uni.navigateTo({
				    url: `/pages/webview/main?src=${encodeURIComponent(jump_url)}`,
				});
			},
        },
        onUnload() {
        }
    }
</script>

<style>
</style>
