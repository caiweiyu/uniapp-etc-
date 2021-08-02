<template>
	<view class="wing-blank" :style="{paddingLeft:size,paddingRight:size}">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			size: {
				default: "28rpx",
				type: String
			}
		}
	}
</script>

<style lang="scss">

</style>
