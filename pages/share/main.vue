<template>
    <view class="content">

		<!-- ****************************************** -->
		<!-- H5分享中转page -->
		<!-- ****************************************** -->
		<view class="share" :style="[{paddingTop: statusBarHeight * 2 + 300 + 'rpx;'}]">
			<view class="tip" v-if="phonesys == 1">
				<image src="https://image.etcchebao.com/etc-min/etc-f/icon_29.png"></image>
			</view>
			<view class="banner">
				<image src="https://image.etcchebao.com/etc-min/etc-f/icon_30.png"></image>
			</view>
			<view class="btn">
				<image class="img" src="https://image.etcchebao.com/etc-min/etc-f/icon_31.png"></image>
				<view class="text">分享给你的好友</view>
				<button class="button" open-type="share"></button>
			</view>
		</view>

    </view>
</template>

<script>
	import miniScript from "@/common/miniScript"
	const miniapp = miniScript.getInstance()
	const app = getApp()

    import { mapState } from "vuex"
    export default {
        data() {
            return {
				phonesys: 2,
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 2,
                app_message : {
                    title: 'ETC车宝欢迎您！',
                    imageUrl: 'https://image.etcchebao.com/etc-min/share_icon.png',
                    path: '/pages/login/main?from_type=2&share_id='+this.share_id
                }
            };
        },
        computed: {
            ...mapState({
                share_id: (state) => state.user.info.userid,
            }),
        },
        onLoad() {
        },
		onShow() {
			this.phonesys = miniapp.loadModel();
		},
		mounted() {
			let {share_data=''} = this.$root.$mp.query;
			if(share_data!==''){
                share_data = JSON.parse(share_data);
                this.app_message.title = decodeURIComponent(share_data.title);
                this.app_message.imageUrl = decodeURIComponent(share_data.img_url);
                this.app_message.path = '/pages/login/main?from_type=2&share_id='+this.share_id+'&h5_url='+share_data.h5_url;
            }
            console.log('share_data',share_data);
		},
        methods: {
            test1() {
            },
        },
        onUnload() {

        },

		/**
		 * 分享好友/群
		 */
		onShareAppMessage(res) {
			return {
				title: this.app_message.title,
				imageUrl: this.app_message.imageUrl,
				path: this.app_message.path
			}
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(res) {
			return {
				title: this.app_message.title,
				imageUrl: this.app_message.imageUrl,
				path: this.app_message.path
			}
		}
    }
</script>

<style lang="scss">
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	.content {
		.share {
			.tip {
				position: fixed;
				top: 0;
				right: 85rpx;
				width: 266rpx;
				height: 110rpx;
			}
			.banner {
				margin: 0 auto;
				width: 400rpx;
				height: 300rpx;
			}
			.btn {
				margin: 64rpx auto 0 auto;
				width: 520rpx;
				height: 100rpx;
				background-color: #60C84C;
				border-radius: 100rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 34rpx;
				color: #FFFFFF;
				position: relative;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				.img {
					margin: 0 15rpx 0 0;
					width: 40rpx;
					height: 40rpx;
				}
				.button {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}
	}
</style>
