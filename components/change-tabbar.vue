<!--
 * @Description:
 * @Version: 1.0
 * @Autor: caiweiyu
 * @Date: 2021-06-08 19:28:47
 * @LastEditors: caiweiyu
 * @LastEditTime: 2021-06-08 19:28:47
-->
<!--选择栏组件-->
<template>
	<view class="nav">
		<scroll-view scroll-x class="nav_block" :scroll-left="scrollPositionnum">
				<view :style="[{margin:`0 ${widthValue} 0 ${widthValue}`}]" :class="['order-list-content', curIndex == index ? 'active':'']" v-for="(item,index) in listNav" :key="index" @click="$debounce(bindNav,index)">
					{{item.name}}
				</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		props:{
			listNav:{
				type:Array,
				default:[{
					name:'全部',
					type:0,
				},
				{
					name:'待付款',
					type:1,
				},
				{
					name:'已付款',
					type:2,
				},
				{
					name:'待退款',
					type:3,
				},
				{
					name:'评论',
					type:4,
				}]  //默认
			},
			//滚动的距离位置
			scrollPosition:{
				type:Number,
				default:0
			},
			//下标
			curIndexref:{
				type:Number,
				default:0
			},
			//使用组件名
			name:{
				type:Number,
				default:0 // 0：订单导航栏 1：资讯栏目导航栏 2： 3：
			}

		},
		computed:{
			...mapState({
				fm_index: (state)=>state.home.fm_index,
				isclick_touch: (state)=>state.home.isclick_touch
			})
		},
		data(){
			return {
				curIndex:0,
				scrollPositionnum:0,
				list:[],
				widthValue:'25rpx'
			}
		},
		methods:{
			bindNav(index) {
				this.curIndex = index;
				let data = this.name;
				console.log(index,'--index--')
				switch(data){
					case 0:
						this.$emit('getIndex',{
							order_status:this.list[index].order_status,
							index:index
						});
					break;
					case 1:
						//禁用滑动操作
						this.$store.commit("home/mt_info_item",{
							id:this.list[index].id,
							type:this.list[index].type,
							index:index
						})
						this.$emit('getIndex',{
							id:this.list[index].id,
							type:this.list[index].type,
							index:index
						});
					break;
				}
			},
			test(){
				console.log('0000000')
			}
		},
		mounted(){
			console.log('进入')
			// this.curIndex = this.fm_index;
		},
		watch:{
			//tab栏目列表数据
			listNav:{
				handler(newValue,oldValue){
					this.list = newValue;
					switch(this.list.length){
						case 5:
							this.widthValue = '35rpx';
						break;
						case 6:
							this.widthValue = '30rpx';
						break;
						default:
							this.widthValue = '25rpx'
					}
				},
				immediate:true,
				deep:true
			},
			//滑动下标时触发的  第一次加载不触发
			curIndexref:{
				handler(newValue,oldValue){
					this.curIndex = newValue;
					if(newValue == -1){ this.curIndex=0 }
				},
				immediate:true,
				deep:true
			},
			// fm_index:{
			// 	handler(n,o){
			// 		this.curIndex = n;
			// 	},
			// 	immediate:true,
			// 	deep:true
			// },
			//tab栏目的左右偏距
			scrollPosition:{
				handler(newValue,oldValue){
					this.scrollPositionnum = newValue
				},
				immediate:true,
				deep:true
			},
		}
	}

</script>

<style lang="scss" scoped>
	.nav{
		position:fixed;
		width:100%;
		z-index: 998;
		background-color:#ffffff;
		&_block{
			width: auto;
			white-space: nowrap;
			.order-list-content{
				display: inline-block;
				color: #222222;
				// margin:0 25rpx 0 25rpx;
				padding-bottom: 26rpx;
				font-size: 30rpx;
			}
			.order-header-list{
				margin-left: 50rpx;
			}
			.active{
				color: #FF5C2A;
				border-bottom: 4rpx solid #FF5C2A;
			}
		}
	}
</style>
