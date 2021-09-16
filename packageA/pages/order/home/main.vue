<template>
	<view>
		<Index @opSelectOptions="updateStatus" :name="name" ref="index"></Index>
		<dialog-window ref="dialog" flag="6"></dialog-window>
	</view>
</template>
<script>
	const app = getApp()
	import Index from "./components/index";
	import DialogWindow from "@/components/dialog-window"
	import {

	} from "@/interfaces/order";
	
	export default {
		props:{
			name:{
				type:Number,
				default:0
			}
		},
		components:{
			Index,
			DialogWindow
		},
		data(){
			return{
				show:false,//切换上下弹框18520575938
			}
		},
		methods:{
			updateStatus(data){
				this.show = data
			},
		},
		onShow() {
			this.$store.dispatch("home/ac_share_info",6);//分享配置
			this.$refs.dialog.loadPopup();//全局弹窗配置
			uni.$on('loadListfn',(data)=>{
				if(data){
					this.$refs.index.onRestore();
					uni.$off('loadListfn')
				}
			});
			this.$token(()=>{
				this.$refs.index.loadAllfn();
			})
		},
		onHide() {
			this.$store.commit("home/mt_share_info", "");
		},
		mounted(){
			
		},
		/**
		 * 分享好友/群
		 */
		onShareAppMessage(res) {
			return app.shareAppMessage();
		},
		/**
		 * 分享朋友圈
		 */
		onShareTimeline(res) {
			return app.shareTimeline();
		},
	}
</script>

<style lang="scss" scoped>
	.order-list{
		height: 165rpx;
		.order-header{
			display: flex;
			flex-direction: flex-start;
			margin-top: 59rpx;
			text-align: center;
			position: relative;
			.order-back{
				width: 48rpx;
				height: 48rpx;
				background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAADTUlEQVR4Xu2dS47TQBBAq/tGbe+HcCMEQggRNgQQQnxOlo+i7AgDguEAYUViyUYWiWRGGbsiTbk+Xdmmpyt+r6rtcsadAP5iJRBYo3twcAHMSeACXAAzAebwXgEugJkAc3ivABfATIA5vFeAC2AmwBzeK8AFMBNgDu8V4ALoCZRlOWua5s9isXhDH+2yCOYrIKX0Msb4qsXSNM1UmgTTAoqieBFCeN3NSWkSzAo4B/8kQpIEkwJSStMY46xnNb7e7XZpu93+vmzFvv/R5gT0Zf4R3/V+v59sNpuf94/z8hlNCdAGv9VlRsAQ/KZpvh8OhyspmX+qFRMChuADwI+qqibr9frb5YsE7V+oF6AZvvolqCzL5wDwtidHxWa++iUopfQsxvhOM3y1FWAFvkoBluCrE2ANvioBFuGrEWAVvgoBCPg3VVVdSWyyMC2c6EYMAx8AJvP5/CvmYCWOESsgB/hil6CiKJ6GEN73ZOyN9swX2wmnlJ7EGD/kAF9cBeQGX5SAHOGLEZArfBECcobPLiB3+KwChuA3TfMrhPBAc5OFafxYGjEM/LquH65Wqy+Yg9A8ZnQBDv//dBlVQFEUj0IIn+/K2HbZySXzR++EW/gA8CmEcFZ6jvBHOwk7/LvPUuRLkMPvv0RwAcyXUOQC2uPzKmBcgk6hXcJ5CaNUgEsQUAEuQUAFnD5CSulxjPGjN2SMD2j4LYl/6TfqOeB2xmMkWL8jyiqgFTIkAQDM/AfEuSWXXUDuEkQIyFmCGAG5ShAlIEcJ4gTkJkGkgKOEoYfwTFwdiRWQiwTRApASxD8L3PeVg3gB1iWoEGBZghoBViWoEmBRgjoB1iSoFNBKsLBTCvv3AX2XZ5j3tO8VpF5AewBDEqRuVXZKMLVLULdChiQAgKidEruf3YQATCVIlWBGgFYJpgRolGBOwLFP8K2LMZeRlGO629bfjuObd1OS78zd/nADAEy74STBN9EHDLnsSpAGPwsBx9sWs7quD8vlsm9L+yGXJO+bPAmTkCKa1AUQgcVO6wKwpIjGuQAisNhpXQCWFNE4F0AEFjutC8CSIhrnAojAYqd1AVhSRONcABFY7LQuAEuKaJwLIAKLndYFYEkRjXMBRGCx0/4FyTJWf/7FzJkAAAAASUVORK5CYII=")no-repeat;
				background-size: 100%;
				margin-left: 20rpx;
			}
			.order-text{
				left: 50%;
				transform: translateX(-50%);
				position: absolute;
				font-size: 36rpx;
				font-weight: bold;
				color: #222222;
				.order-icon{
					width: 40rpx;
					height: 40rpx;
					background: url("data:image/png;base64,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")no-repeat;
					background-size: 100%;
					display: inline-block;	
					vertical-align:middle;
					margin-left:8rpx;
				}
			}
		}
	}
</style>