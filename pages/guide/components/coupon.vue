<template>
  <div class="footer" :class="{istouch:is_hidden}">
    <div class="coupon" v-if="coupon_info.countDown > 0">
      <div class="coupon-content" :class=" { hidden: is_hidden }">
        <div class="info-inner">
          <div class="info-inner-left">
            <image class="avatar" mode="widthFix" :src="coupon_info.icon" />
            <div class="title-box">
              <div class="title-box-name">
                <span class="invite-name">
                  {{
                  coupon_info.inviterName
                  }}
                </span>
                <span class="invite-text" v-if="coupon_info.entityList.length > 0">
                  送你{{
                  coupon_info.entityList.length
                  }}张现金券
                </span>

              </div>
              <div class="title-box-desc">{{coupon_info.guideContent}}</div>
            </div>
          </div>
          <div class="info-inner-right">
            <div class="countdown-box">
              <span class="countdown-title">剩余时间</span>
              <template v-if="is_day">
                <van-count-down
                  :time="coupon_info.countDown"
                  format="DD 天 HH 时"
                  @change="countdownChange"
                />
              </template>
              <template v-else>
                <van-count-down
                  :time="coupon_info.countDown"
                  format="HH:mm:ss"
                  @change="countdownChange"
                >
                 
                    <div classs="countdown-item">
                      <span class="item">
                        {{
                        formatTime(timeData.hours)
                        }}
                      </span>
                      <span class="colon">:</span>
                      <span class="item">
                        {{
                        formatTime(timeData.minutes)
                        }}
                      </span>
                      <span class="colon">:</span>
                      <span class="item">
                        {{
                        formatTime(timeData.seconds)
                        }}
                      </span>
                    </div>
    
                </van-count-down>
              </template>
            </div>
          </div>
        </div>
        <div class="coupon-inner" v-if="coupon_info.entityList.length > 0">
          <div v-for="(item, index) in coupon_info.entityList" :key="index">
            <div
              class="coupon-inner-item"
              :class="{ 'coupon-inner-item_gray': item.isHave }"
              @click="onTakeCoupon(item.id)"
            >
              <div class="money ellipsis">{{ item.title }}</div>
              <div class="status">{{ item.isHave ? "已领" : "领取" }}</div>
            </div>
          </div>
        </div>
        <div class="icon-close" @click="is_hidden = true"></div>
      </div>
      <div class="icon-open" v-if="is_hidden" @click="is_hidden = false"></div>
    </div>
  </div>
</template>

<script>
	export default {
		components: {
			
		},
		props: {
			coupon_info: {
				type: Object,
				default: () => {
					return {
						entityList: [],
						countDown: 0,
						inviterName: '',
						icon: ''
					};
				}
			}
		},
		data() {
			return {
				time:2000000,
				is_day: true,
				is_hidden: false,
				timeData:{}
			}
		},
		created(){
				//this.time=200000;
				
		},
		methods: {
			onTakeCoupon(id) {
				this.$emit('change', id);
			},
			formatTime(num) {
				return num >= 10 ? num : `0${num}`;
			},
			countdownChange(timeData) {
				this.timeData=timeData;
				if (timeData.days == 0) {
					this.is_day = false;
				} else {
					this.is_day = true;
				}
			},
			onClose() {
				this.is_open = false;
			}
		}
	};
</script>
<style lang="scss">
	.footer {
		position: fixed;
		width: 100%;
		bottom: 20rpx;
		left: 0;
		right: 0;
		z-index: 9;
		&.istouch {
			pointer-events: none;
		}
	}

	.coupon {
		position: relative;
		width: 710rpx;
		margin: 0 auto;

		&-content {
			position: relative;

			// height: 187px;

			background: #fff;
			padding: 24rpx 20rpx;
			transition: all 0.4s;
			transform-origin: right top;
			border-radius: 10rpx;

			&.hidden {
				transform: scale(0);
			}

			.info-inner {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;

				&-left {
					display: flex;
					align-items: center;
					flex: 1;

					.avatar {
						width: 52rpx;
						height: 52rpx;
						background: #ccc;
						border-radius: 100%;
					}

					.title-box {
						margin-left: 15rpx;

						&-name {
							color: #222;

							.invite-text {
								color: #ff5c2a;
							}

							.invite-name {
								display: inline-block;
								max-width: 180rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								vertical-align: middle;
							}
						}

						&-desc {
							color: #999;
						}
					}
				}

				&-right {
					.countdown-box {
						display: flex;
						align-items: center;

						.countdown-title {
							color: #666;
							margin-right: 10rpx;
						}

						.item {
							display: inline-block;
							width: 36rpx;
							height: 36rpx;
							line-height: 36rpx;
							text-align: center;
							background: #222222;
							color: #fff;
							font-size: 24rpx;
							border-radius: 4rpx;
						}

						.colon {
							display: inline-block;
							margin: 0 5rpx;
						}
					}
				}
			}

			.coupon-inner {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;

				&-item {
					background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAuCAYAAABOHgfUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDNEQkQ5M0U5Q0I3MTFFQTlBN0RBMUJCOTlBN0U0M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDNEQkQ5M0Y5Q0I3MTFFQTlBN0RBMUJCOTlBN0U0M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0M0RCRDkzQzlDQjcxMUVBOUE3REExQkI5OUE3RTQzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0M0RCRDkzRDlDQjcxMUVBOUE3REExQkI5OUE3RTQzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpDjPV0AAAHcSURBVHja7Nm/alNRHMDxk1Jj06RpzQO4SV9BtyJt14JLH6Cjm5PoHpzc3PRFbKCjvoK4Oeiil6bmT5MI19+RIEUQYhpBvJ8P/Hp7Mh7ON7fl1IrjoxTuxDyL2Y9pJ1jOQUzvynov5qyie3Ex34vHMe/X48duzNtGe3vnZrOZarWa48Ifm12O06AoXsWvJzFvYu7FvGze6qR6o1G5/SjLsj0ZDh+ML/r3Y3k3h9bd3M6RtZwWlnZjo5Fanc7tOFyn36bTtF6vp/zFnT+vovzC2mi14pl2Rv1+N4e2X99sOimsJLaqhvU7ua0I7XAt/0/mz0X4e2+20FqzFazc8xf24BdCA6GB0AChgdD4nz16aA+EBkIDocFC3KMJDYQGQgOEBkKjUtyjCQ2EBkKDBblHExoIDYQGCA2ERqW4RxMaCA2EBgtyjyY0EBoIDRAaCI1KcY8mNBAaCA0W5B5NaCA0EBogNPjHQ7soy9JOsDru0X6atzXIofWmo6Ed4dpml+M0+PI5nX/6+OOZ11U3b+t1Du3pqN8/nwwHyZuNa0VWFB9mk8lhnKOt/Mzr6biaseWWclO5rdxYrTg+yp/vxnRjDmK2HBuWlM9P78p6L+asonvxNeY05knMu+8CDAAOrYS7e2qN3AAAAABJRU5ErkJggg==');
					background-repeat: no-repeat;
					background-size: 100%;
					width: 218rpx;
					height: 46rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #fff;
					font-size: 24rpx;
					text-align: center;

					.money {
						flex: 1;
					}

					.status {
						width: 68rpx;
					}

					&_gray {
						background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAuCAYAAABOHgfUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDNEQkQ5NDI5Q0I3MTFFQTlBN0RBMUJCOTlBN0U0M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDNEQkQ5NDM5Q0I3MTFFQTlBN0RBMUJCOTlBN0U0M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0M0RCRDk0MDlDQjcxMUVBOUE3REExQkI5OUE3RTQzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0M0RCRDk0MTlDQjcxMUVBOUE3REExQkI5OUE3RTQzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pnixr40AAAGbSURBVHja7Nk7ThtRFIDh8atLovQuUiG2EDoKYAHZQjYRJX2URbAFWECw5DJsAaFpkNwjksaah3JO5AKZxjITCXG/TzqauZRX97eN7qiu6yocxPyIOYl5V8F+TmMWj9bHMctC9+JhsxdfYm5HEdphvFxPp9P3k8nEUWEvfd9XTdPcxevnmF8xRzHns9nsw3g8LnJPuq6r2ra9j9ePGdpFRPZJZAwRWx6ufGZceaZKjWwrtstp/lwUGUPIqEoPa1u2FaGdjf1PBv/dGx8/DG4+n9uE7W97WwBCA6EBQgOh8XqtViubIDQQGggNduEeTWggNBAaIDQQGkVxjyY0EBoIDXbkHk1oIDQQGiA0EBpFcY8mNBAaCA125B5NaCA0EBogNBAaRXGPJjQQGggNduQeTWggNBAaIDR46aE92AaG5B7tiT8Z2qLrOlvBs/V9XzVNU63X63/PXJdu09bPDO1b27b3YmOAyO7ieRbLt/ncrIuOLNvKxkZ1XeffDmO+x5zmJjk27CnPz+LR+jhmWehe/I65ivkac/NXgAEA8XWGH1sWKDUAAAAASUVORK5CYII=');
						background-repeat: no-repeat;
						background-size: 100%;
					}
				}
			}

			.icon-close {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZFNDVBRkQ5Qzk5MTFFQTlBN0RBMUJCOTlBN0U0M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZFNDVBRkU5Qzk5MTFFQTlBN0RBMUJCOTlBN0U0M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRkU0NUFGQjlDOTkxMUVBOUE3REExQkI5OUE3RTQzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRkU0NUFGQzlDOTkxMUVBOUE3REExQkI5OUE3RTQzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkX1ZqcAAAX3SURBVHjaxJldSBxXFIDvzs66rnFXgzUpisZESY0+qGiplK02FoxSAlJIJRHsQ17y0ICIJUQJCG0KSaiIllKoFN986Is0WH/QlFYfKggaxJYWcf2nbRDJmu6qdWd6zvbOcryZdWZ/c+Cw7OzMvd+cPffcc861lJSUsCjFovMpXlPJp6pzLWKRY4BElQTVrlFROJwiqBoNvBwFKAJZicpcrQI4E0ADoEdcA0QVMo8aEfDS0tJLN5SWlloEUA0whauNqDUMMIL9S/SQK30BhTOoOgzmLMxhNatRyFRNr1+/fuHKlSvu3NzccqfTWeBwOM5IkpQW9AVF8fn9/r/39vZWt7a2FsbHx2eGhoZW4Kd9ohRegTkVPejQX00XHbUwgbVy69lBHaBpAOZ88ODB1fLy8msZGRklxKJGoj5//vzXhYWF7+7cufMYXmQPrvlA/aAH3PpBa1NoamFdYAIrE4ueAk2/f//+5fr6+k/S0tLyWAzi8/k2JiYmHnV1df0IX1+A/kMsfkShKbB0ghtosPj3us6dO3d2dHT086ampr5YYVFwDBwLx8SxcQ4+VwqfW+Is4V1CWFx2PoCzrq6uACz7pcvleoMlQLxe7+9g6Y+fPHmyCl81NzkgizHkHtbs7GwmxFYrf0sHhz3/8OHDb9PT0y+wBIndbn/tMsjy8vJPHo/HR0AVMdSJwNoCQ591Xrx48fX+/v6vAbaQJVhsNluG2+1+c3p6empnZ0e0rir6sJ510/v6+rrADS6xJAnOhXPi3JwhhTOFtn266I4tNIwGeXl577MkC86Jc4sLUM/C2i6WCuKE0NXBXpFg2MRYz11TJlYObaPUHVJ7enquQtjJNxoYdrGIYcw8gyEPNyYOfMwtJGLpEHBZWdk1o0FhYbCbN28y2G5Nw25sbASfmZmZMbwXd1EBWGJCSoimt2FukJmZaZgkZ2VlsYaGBtbb22sKGmFhO2YFBQWssrLS8H7c8m/cuFHIo5bmxxYMaxYSyk51dHR8AInM22YsBv8EJjhsYGCAYXgsKioyhL137x6DBMlUSgv3bQ0PD8/z7TqYZ8jC7mYD2LJIfLK1tTX4iZZGgcwtHrBB4SzH0lZZqB6ssDjPR7qQwkHHAouC6aqQY1tksuiCCoNmRxOKRGjMUWKBRYFnzgolGJPF8kdLvmOFPn36dEyw7H8Yh1DBWKR4B/3q6urg5+7uLqutrY0a9qSajlauCpY18GauaAZDn+3u7mYVFRWsuLg47EI0K8DiFzI2VRarW9iJnoGzu6KB1fPZWKCxHhTTTFksxbFgBODCeMAahTwjARaPmBvLYimO1W1OTs57scKajdMnCbA8pYUpsmo7XWjjgMTjsKamptlMJWw2zprdEcUKe3Bw8NHi4uI2r6pxt1O0ikODtsEN+y0tLbWQYp4xSn7a29tNhy4Kjc/k55+cDGI7oK2t7RteTfu5pRXNwjRjk6uqqqww6LsGKSCzWCzB7Mts6EJofA7+QSyJTrx3dnb2q5GRkXkOfMBLf1WrmiWSALlg0WVDBTscj3I+2p4FFL9NsOieYVHN+xVBC0skrGnNun3syGCT41VVHDD3F7wrtE96b6pY0yn8R3RuH3ZkNjc3R5MNC3P+AHNP8d5EqAsk1nQqsfIhd/IXt2/f/tTr9f6WLFicC+b8jLeutMgQoKW+2JcQI8GRx+P5BZsc2DdIJCzsaht37969NTc3t8WBQ34brpHCdBrLKgD7V1ZWfna73W/Z7fasRMCCu/7R2dl5a2pqalWwbthGCiPNZIW4BvrR3uTk5ArUVx+tr68/jjcsjtnc3NyKc5C+2qFe21W3e0mgjwi0F6z8Z2NjYyfUWG0QdjbjELo2cSwcc21t7S8evnx67dZ4NrQ/hOr2UgQNbUYa2t/HraEd6ZEBlPvvQMJUAe+Rj0cGVqs1WLUEAgHtyGB9e3t7fmxsbNroyEDPsqaBYziUkUhspydIhwaHMqrRoYzF5MFioo+9TJ/XmT2nowMFyKKUmP7hoviswpJ8sPhSfOZgCkvy0e1/AgwAq+AS0PU5m44AAAAASUVORK5CYII=');
				background-repeat: no-repeat;
				background-size: 100%;
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				right: -10rpx;
				top: -20rpx;
			}
		}

		.icon-open {
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAByCAYAAACP3YV9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzYzMEExMEQ5Q0M3MTFFQTlBN0RBMUJCOTlBN0U0M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzYzMEExMEU5Q0M3MTFFQTlBN0RBMUJCOTlBN0U0M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NjMwQTEwQjlDQzcxMUVBOUE3REExQkI5OUE3RTQzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NjMwQTEwQzlDQzcxMUVBOUE3REExQkI5OUE3RTQzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps1iMo0AAA2XSURBVHja7J19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');
			background-repeat: no-repeat;
			background-size: 100%;
			width: 114rpx;
			height: 114rpx;
			position: absolute;
			right: -10rpx;
			top: -45rpx;
			pointer-events: all;
		}

		.van-count-down {
			font-size: inherit;
			color: #666;
		}
	}
</style>
