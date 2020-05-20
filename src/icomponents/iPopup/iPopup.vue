<template>
	<section class="container" ref="iPopup">
		<transition name="iPopup">
			<div v-if="isShow" class="iPopupBox" :class="`iPopupBox${_uid}`" :style="{'z-index': zIndex+1, height: `${height}%`}">
				<slot v-if="!isPugin" name="default"></slot>
				<component v-if="isPugin" :is="template"></component>
			</div>
		</transition>
		<div v-if="isShow && modal" :style="{'z-index': zIndex}" class="shade" @click="clickModal"></div>
	</section>
</template>

<script>
	export default {
		model: {
			prop: 'visible',
			event: "visibleListener"
		},
		props: {
			// 开启和关闭
			visible: {
				type: Boolean,
				default: false
			},
			// 是否采用函数方式调用iPopup
			isPugin: {
				type: Boolean,
				default: false
			},
			// 采用函数方式调用时，传入的目标组件(也就是你的业务组件)
			template: {
				type: Function,
				default: new Function
			},
			// 是否可以点击遮罩关闭iPopup
			closeModal: { //是否点击遮罩关闭
				type: Boolean,
				default: true
			},
			// iPopup的高度，单位是百分比
			height: {
				type: [Number, String],
				default: 100
			},
			// iPopup弹出的方位，上下左右都可以
			position: { //弹出位置
				type: String,
				default: "bottom"
			},
			// iPopup是否插入到body
			appendToBody: {
				type: Boolean,
				default: true
			},
			modal: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			visible() {
				this.isShow = this.visible;
			},
			isShow() {
				this.$emit("visibleListener", this.isShow);
				if(this.isShow) {
					this.initData();
				}
				if(!this.isShow) {
					this.$emit("onClose");
					this.zIndex = 2000;
					this.resetCSSRule();
					this.removeNode();
				}
			}
		},
		data() {
			return {
				isShow: false,
				zIndex: 2000
			}
		},
		created() {
			this.isShow = this.visible;
		},
		methods: {
			// 初始化
			initData() {
				if(!this.isPugin) {
					this.$nextTick(() => {
						const iPopupBoxs = document.getElementsByClassName("iPopupBox");
						const getMaxZIndex = function() {
							const allElement = [...iPopupBoxs];
							let zIndexs = allElement.map(__DOM__ => {
								return +window.getComputedStyle(__DOM__).zIndex || 0;
							})
							return Math.max.apply(null, zIndexs);
						}
						this.zIndex = getMaxZIndex() + 1;
						this.appendChildToBody();
					})
				}
				this.setCSSRule();
			},
			// 是否插入到body当中
			// 非函数调用情况下，因为函数调用已经实现了自动插入到body以及删除node节点
			appendChildToBody() {
				if(this.appendToBody) {
					const instance = this.$refs.iPopup;
					document.body.appendChild(instance);
				}
			},
			// 删除节点
			removeNode() {
				// 非函数调用情况下，因为函数调用已经实现了自动插入到body以及删除node节点
				if(!this.isPugin && this.appendToBody) {
					const instance = this.$refs.iPopup;
					setTimeout(() => {
						document.body.removeChild(instance);
					}, 200)
				}
			},
			// plugin方式打开
			show(options) {
				Object.assign(this.$props, options);
				this.isShow = true;
			},
			// 是否点击遮罩关闭
			clickModal() {
				this.closeModal && (this.isShow = false)
			},
			// plugin方式关闭
			close() {
				this.isShow = false;
			},
			// 初始化CSS动画
			setCSSRule() {
				this.$nextTick(() => {
					const popupStyle = document.styleSheets[0];
					const iPopupBox = document.getElementsByClassName(`iPopupBox${this._uid}`)[0];
					popupStyle.insertRule(`.iPopup-enter-active { animation: iPopup${this._uid}-show 0.2s; }`, popupStyle.rules.length);
					popupStyle.insertRule(`.iPopup-leave-active { animation: iPopup${this._uid}-hide 0.2s; }`, popupStyle.rules.length);
					switch(this.position) {
						case "bottom":
							iPopupBox.style.bottom = "0%";
							iPopupBox.style.transform = "translate3d(0%, 0%, 0)";
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-show{ 0%{ transform: translate3d(0%, 100%, 0); } 100%{ transform: translate3d(0%, 0%, 0); } }`, popupStyle.rules.length);
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-hide{ 0%{ transform: translate3d(0%, 0%, 0); } 100%{ transform: translate3d(0%, 100%, 0); } }`, popupStyle.rules.length);
							break;
						case "right":
							iPopupBox.style.top = "0%";
							iPopupBox.style.transform = "translate3d(0%, 0%, 0)";
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-show{ 0%{ transform: translate3d(100%, 0%, 0); } 100%{ transform: translate3d(0%, 0%, 0); } }`, popupStyle.rules.length);
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-hide{ 0%{ transform: translate3d(0%, 0%, 0); } 100%{ transform: translate3d(100%, 0%, 0); } }`, popupStyle.rules.length);
							break;
						case "top":
							iPopupBox.style.top = "0%";
							iPopupBox.style.transform = "translate3d(0%, 0%, 0)";
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-show{ 0%{ transform: translate3d(0%, -100%, 0); } 100%{ transform: translate3d(0%, 0%, 0); } }`, popupStyle.rules.length);
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-hide{ 0%{ transform: translate3d(0%, 0%, 0); } 100%{ transform: translate3d(0%, -100%, 0); } }`, popupStyle.rules.length);
							break;
						case "left":
							iPopupBox.style.top = "0%";
							iPopupBox.style.transform = "translate3d(0%, 0%, 0)";
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-show{ 0%{ transform: translate3d(-100%, 0%, 0); } 100%{ transform: translate3d(0%, 0%, 0); } }`, popupStyle.rules.length);
							popupStyle.insertRule(`@keyframes iPopup${this._uid}-hide{ 0%{ transform: translate3d(0%, 0%, 0); } 100%{ transform: translate3d(-100%, 0%, 0); } }`, popupStyle.rules.length);
							break;
					}
				})
			},
			// 销毁css动画
			resetCSSRule() {
				// 当前的层叠样式表
				const popupStyle = document.styleSheets[0];
				setTimeout(() => {
					for(var i = 1; i < 5; i++) {
						popupStyle.deleteRule(popupStyle.rules.length - 1);
					}
				}, 250)
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.container {
		font-size: 0.14rem;
		.iPopupBox {
			width: 100%;
			box-sizing: border-box;
			background-color: #F2F2F2;
			background-color: white;
			backface-visibility: hidden;
			-webkit-backface-visibility:hidden;
			position: fixed;
			left: 0%;
			transition: 0.2s ease-out;
		}
		.shade {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			background: #000;
			-moz-opacity: 0.5;
			opacity: 0.50;
			filter: alpha(opacity=70);
		}
	}
</style>