<template>
	<div :style="{'width':'100%','height':statusBarHeight+'px'}"></div>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 22
			}
		},
		mounted() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		}
	}
</script>

<style>
</style>
