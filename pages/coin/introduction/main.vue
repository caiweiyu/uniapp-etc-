<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-03-04 14:41:55
 * @LastEditors: yongqing
 * @LastEditTime: 2021-03-11 17:09:42
-->
<template>
	<view class="introduction">
		<image :src="imgUrl" mode="widthFix"  class="img" />
	</view>
</template>

<script>
	import * as API from "@/interfaces/base";

	export default {
		data() {
			return {
				active: 0,
				imgUrl: ''
			};
		},
		async mounted() {
			let res = await API.getStrategy()
			this.imgUrl = res.data.value

		}
	};
</script>

<style lang="scss" scoped>
	.introduction {
		.img {
			width: 100%;
		}
	}
</style>
