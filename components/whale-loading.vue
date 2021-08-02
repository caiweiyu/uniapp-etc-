<template>
	<view class="whale-loading" v-if="loadModal">
		<view class="spinner-loader">Loading&#8230;</view>
	</view>
</template>

<script>
	export default {
		props: {
			loadModal: {
				type:Boolean,
				default:true
			}
		},
		data() {
			return {};
		},
		methods: {
			LoadModal(e) {
				console.log('进入')
				this.loadModal = true;
				setTimeout(() => {
					this.loadModal = false;
				}, 2000);
			}
		}
	};
</script>

<style>
	.whale-loading {
		/* background: white; */
		display: table-cell;
		text-align: center;
		vertical-align: middle;
		width: 100%;
		height: 100%;
		display: block;
		overflow: hidden;
		z-index: 10000;
		position: fixed; /**定位采用此种方式**/
		left: 50%; /**左边50%**/
		top: 20%; /**顶部50%**/
		margin-top: -100px; /**上移-50%**/
		margin-left: -150px; /**左移-50%**/
	}

	@-moz-keyframes spinner-loader {
		0% {
			-moz-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-moz-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@-webkit-keyframes spinner-loader {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@keyframes spinner-loader {
		0% {
			-moz-transform: rotate(0deg);
			-ms-transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-moz-transform: rotate(360deg);
			-ms-transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	/* :not(:required) hides this rule from IE9 and below */
	.spinner-loader:not(:required) {
		-moz-animation: spinner-loader 1500ms infinite linear;
		-webkit-animation: spinner-loader 1500ms infinite linear;
		animation: spinner-loader 1500ms infinite linear;
		-moz-border-radius: 0.5em;
		-webkit-border-radius: 0.5em;
		border-radius: 0.5em;
		-moz-box-shadow: rgba(0, 0, 51, 0.1) 1.5em 0 0 0, rgba(0, 0, 51, 0.1) 1.1em 1.1em 0 0, rgba(0, 0, 51, 0.1) 0 1.5em 0 0, rgba(0, 0, 51, 0.1) -1.1em 1.1em 0 0, rgba(0, 0, 51, 0.1) -1.5em 0 0 0, rgba(0, 0, 51, 0.1) -1.1em -1.1em 0 0, rgba(0, 0, 51, 0.1) 0 -1.5em 0 0, rgba(0, 0, 51, 0.1) 1.1em -1.1em 0 0;
		-webkit-box-shadow: rgba(0, 0, 51, 0.1) 1.5em 0 0 0, rgba(0, 0, 51, 0.1) 1.1em 1.1em 0 0, rgba(0, 0, 51, 0.1) 0 1.5em 0 0, rgba(0, 0, 51, 0.1) -1.1em 1.1em 0 0, rgba(0, 0, 51, 0.1) -1.5em 0 0 0, rgba(0, 0, 51, 0.1) -1.1em -1.1em 0 0, rgba(0, 0, 51, 0.1) 0 -1.5em 0 0, rgba(0, 0, 51, 0.1) 1.1em -1.1em 0 0;
		box-shadow: rgba(0, 0, 51, 0.1) 1.5em 0 0 0, rgba(0, 0, 51, 0.1) 1.1em 1.1em 0 0, rgba(0, 0, 51, 0.1) 0 1.5em 0 0, rgba(0, 0, 51, 0.1) -1.1em 1.1em 0 0, rgba(0, 0, 51, 0.1) -1.5em 0 0 0, rgba(0, 0, 51, 0.1) -1.1em -1.1em 0 0, rgba(0, 0, 51, 0.1) 0 -1.5em 0 0, rgba(0, 0, 51, 0.1) 1.1em -1.1em 0 0;
		display: inline-block;
		font-size: 10px;
		width: 20rpx;
		height: 20rpx;
		margin: 20rpx;
		;
		overflow: hidden;
		text-indent: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -10rpx;
		margin-left: -10rpx;
	}
</style>
