<template>
	<section class="iErrorBox" :style="{'z-index': isShow ? zIndex : 0 }">
		<transition name="dialog">
			<div v-if="isShow" class="tipsBox" :style="{'z-index': zIndex + 10, width: `${width}%`}">
				<div class="title">{{ title }}</div>
				<div class="content" :class="{textAlign: isCenter}">
					<template v-for="(item, index) in errorList">
						<div class="itemBox">
							<div @click="showDetail(item, index)" class="item" :key="index" :style="{'border-bottom': index!=errorList.length-1? '1px dashed #EEEEEE':'' }">
								<span class="left"><i class="iconfont icon-cuowu"></i> {{ item.statusText }}</span>
								<span class="right" :class="'self_icon'+index"><i class="iconfont icon-right"></i></span>
							</div>
							<transition name="content">
								<div v-if="item.isActive" class="row_content" :style="{'border-bottom': errorList.length>1 ? '1px dashed #EEEEEE':'','border-top': index == errorList.length-1 ? '1px dashed #EEEEEE':'' }">
									<p><span>地址: </span>{{ item.httpUrl }}</p>
									<p><span>请求耗时：</span>{{ item.loadTime }}毫秒</p>
									<p><span>状态码：</span>{{ item.status }}</p>
									<p><span>状态描述：</span>{{ item.status | formatStatus }}</p>
								</div>
							</transition>
						</div>
					</template>
				</div>
				<div class="btn" v-if="hasLeft || hasRight">
					<p v-if="hasLeft" class="left" @click="confirm()" :style="{ width: !hasRight ? '100%' : '50%'  }">{{ leftBtnTxt }}</p>
					<!--<p v-if="hasRight" class="right" @click="confirm()" :style="{ width: !hasLeft ? '100%' : '50%'  }">{{ rightBtnTxt }}</p>-->
				</div>
			</div>
		</transition>
		<div v-if="isShow" :style="{'z-index': zIndex}" class="shade" @click.stop="closeOnClick()"></div>
	</section>
</template>

<script>
	import httpStatusCode from './httpStatusCode.js';
	export default {
		model: {
			prop: 'visible',
			event: "dialogListener"
		},
		props: {
			visible: { //控制弹出、关闭
				type: Boolean,
				default: false
			},
			closeModal: { //是否点击遮罩关闭iError
				type: Boolean,
				default: true
			},
			width: {
				default: 80
			},
			title: { //提示
				type: String,
				default: '错误提示'
			},
			content: { //内容文本
				type: Object,
				default: function() {
					return {}
				}
			},
			isCenter: { //内容文本是否居中显示
				type: Boolean,
				default: false
			},
			hasLeft: { //是否有取消按钮
				type: Boolean,
				default: true
			},
			hasRight: { //是否有确认按钮
				type: Boolean,
				default: false
			},
			leftBtnTxt: { //取消按钮文本
				type: String,
				default: "客服中心"
			},
			rightBtnTxt: { //确定按钮文本
				type: String,
				default: "详情"
			}
		},
		watch: {
			visible() {
				this.isShow = this.visible;
			},
			isShow() {
				this.$emit("dialogListener", this.isShow);
			}
		},
		filters: {
			formatStatus(val) {
				return httpStatusCode[val];
			}
		},
		data() {
			return {
				isShow: false,
				errorList: [],
				zIndex: 30000
			}
		},
		created() {

		},
		methods: {
			// 打开组件
			show(options) {
				Object.assign(this.$props, options);
				this.errorList = [options.content];
				this.errorList.map(ele => {
					this.$set(ele, "isActive", false)
				})
				this.isShow = true;
			},
			// 更新组件入口
			update(options) {
				this.errorList = [...this.errorList, options.content];
				this.errorList.map(ele => {
					this.$set(ele, "isActive", false)
				})
			},
			//确定
			confirm() {
				this.$emit("confirm");
				this.isShow = false;
			},
			// 取消
			cancel() {
				this.isShow = false;
				this.$emit("cancel");
			},
			// 是否点击遮罩关闭errorBox
			closeOnClick() {
				this.closeModal && this.cancel();
			},
			showDetail(item, index) {
				this.errorList.map((ele, i) => {
					if(index != i || item.isActive) {
						document.getElementsByClassName('self_icon' + i)[0].style.transition = "transform 0.2s ease-out";
						document.getElementsByClassName('self_icon' + i)[0].style.transform = "rotateZ(" + 0 + "deg)";
						ele.isActive = false;
					} else if(!item.isActive) {
						let _selfIcon = document.getElementsByClassName('self_icon' + index)[0];
						let _rotateZ = item.isActive ? '0' : '90';
						_selfIcon.style.transition = "transform 0.2s ease-out";
						_selfIcon.style.transform = "rotateZ(" + _rotateZ + "deg)";
						item.isActive = true;
					}
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import '../../core/scss/mixin.scss';
	.iErrorBox {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: Microsoft YaHei, simhei, Tahoma, Arial, sans-serif !important;
		.tipsBox {
			width: 70%;
			height: auto;
			min-height: 10%;
			background-color: white;
			font-size: 0.14rem;
			box-sizing: content-box;
			border-radius: .1rem;
			position: relative;
			.title {
				width: 100%;
				height: 0.5rem;
				text-align: center;
				line-height: 0.5rem;
				color: #333333;
				font-size: 0.16rem;
				font-weight: 600;
				border-bottom: 1px solid #EEEEEE;
			}
			.content {
				width: 100%;
				box-sizing: border-box;
				height: auto;
				min-height: 10%;
				max-height: 70vh;
				overflow: scroll;
				-webkit-overflow-scrolling: touch;
				padding: 0.05rem 0.15rem 0.55rem 0.15rem;
				/*line-height: 0.27rem;*/
				white-space: normal;
				word-break: break-all;
				color: #666666;
				text-align: justify;
				text-justify: inter-ideograph;
				.itemBox {
					overflow: hidden;
					.item {
						height: 0.4rem;
						line-height: 0.4rem;
						position: relative;
						/*&:before {
							content: '*', ;
							color: red;
						}*/
						.left {
							color: red;
						}
						.right {
							position: absolute;
							right: 0.1rem;
							@include color();
						}
					}
					.row_content {
						width: 100%;
						box-sizing: border-box;
						padding: 0.1rem;
						p {
							word-break: break-all;
							text-align: justify;
							span {
								font-weight: bold;
							}
						}
					}
				}
			}
			.textAlign {
				text-align: center;
			}
			.btn {
				height: 0.44rem;
				line-height: 0.44rem;
				width: 100%;
				text-align: center;
				border-top: .01rem solid #EEEEEE;
				position: absolute;
				left: 0;
				bottom: 0;
				.left {
					position: absolute;
					left: 0px;
					top: 0px;
					width: 50%;
					height: 100%;
					border-right: 1px solid #EEEEEE;
					@include color();
				}
				.right {
					position: absolute;
					right: 0px;
					top: 0px;
					width: 50%;
					height: 100%;
					@include color();
				}
			}
		}
		.shade {
			position: fixed;
			top: 0%;
			left: 0%;
			width: 100%;
			height: 100%;
			background: radial-gradient(circle, #333, #000, #000);
			-moz-opacity: 0.5;
			opacity: 0.50;
			filter: alpha(opacity=70);
		}
		.dialog-enter-active {
			animation: dialog-show 0.3s;
		}
		.dialog-leave-active {
			animation: dialog-hide 0.2s;
		}
		@keyframes dialog-show {
			from {
				transform: scale(0);
				opacity: 0;
			}
			to {
				transform: scale(1);
				opacity: 1;
			}
		}
		@keyframes dialog-hide {
			from {
				transform: scale(1);
				opacity: 1;
			}
			to {
				transform: scale(0);
				opacity: 0;
			}
		}
		/*内容展开收缩动画*/
		.content-enter-active {
			animation: content-show 0.1s;
		}
		.content-leave-active {
			animation: content-hide 0.1s;
		}
		@keyframes content-show {
			from {
				transform: scaleY(0);
				height: 0px;
				opacity: 0;
			}
			to {
				transform: scaleY(1);
				height: auto;
				opacity: 1;
			}
		}
		@keyframes content-hide {
			from {
				transform: scaleY(1);
				height: auto;
				opacity: 1;
			}
			to {
				transform: scaleY(0);
				height: 0px;
				opacity: 0;
			}
		}
	}
</style>