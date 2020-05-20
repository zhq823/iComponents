<template>
	<section class="iMessageBox" :style="{'z-index': isShow ? zIndex : 0 }">
		<transition name="dialog">
			<div v-if="isShow" class="tipsBox" :style="{'z-index': zIndex + 10, width: `${width}%`}">
				<div class="title">{{ title }}</div>
				<div class="content" :class="{textAlign: isCenter}">
					<!--默认是提示框-->
					<template v-if="!hasTemplate && !hasInput">{{ contentTxt }}</template>
					<!--自定义模板-->
					<slot v-if="hasTemplate" name="content"></slot>
					<!--textarea模式-->
					<template v-if="hasInput">
						<template v-if="inputType === 'textarea'">
							<textarea class="input-box textarea" v-model="value"></textarea>
						</template>
						<template v-if="inputType === 'input'">
							<div class="label" v-if="label">{{ label }}: <span>FPLN{{ value }}</span></div>
							<input class="input-box input" v-model="value"/>
						</template>
					</template>
				</div>
				<div class="btn" v-if="hasLeft || hasRight">
					<p v-if="hasLeft" class="left" @click="cancel()" :style="{ width: !hasRight ? '100%' : '50%'  }">{{ cancelTxt }}</p>
					<p v-if="hasRight" class="right" @click="confirm()" :style="{ width: !hasLeft ? '100%' : '50%'  }">{{ confirmTxt }}</p>
				</div>
			</div>
		</transition>
		<div v-if="isShow" :style="{'z-index': zIndex}" class="shade" @click.stop="closeOnClick()"></div>
	</section>
</template>

<script>
	/*注意：contentTxt同<slot name="content"></slot>是互斥存在的
			因为该组件既满足于提示文本框，亦可满足带有自定义表单输入等场景形式
		**/
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
			width: {
				default: 70
			},
			title: { //提示
				type: String,
				default: '再次确认'
			},
			contentTxt: { //内容文本
				type: String,
				default: ''
			},
			cancelTxt: { //取消按钮文本
				type: String,
				default: "取消"
			},
			confirmTxt: { //确定按钮文本
				type: String,
				default: "确定"
			},
			isCenter: { //内容文本是否居中显示
				type: Boolean,
				default: true
			},
			closeModal: { //是否点击遮罩关闭iMessage
				type: Boolean,
				default: true
			},
			hasTemplate: { //是否使用自定模板插槽，此功能与contentTxt属性互斥！有他没我，
				type: Boolean,
				default: false
			},
			hasInput: { //是否使用带有textArea模式，此功能与hasTemplate && contentTxt互斥！
				type: Boolean,
				default: false
			},
			inputType: {
				type: String,
				default: "textarea"
			},
			label: {
				type: String,
				default: ""
			},
			value: { //带有输入框模式输入的文本
				default: ""
			},
			hasLeft: { //是否有取消按钮
				type: Boolean,
				default: true
			},
			hasRight: { //是否有确认按钮
				type: Boolean,
				default: true
			},
			hasInterval: { //是否有定时器功能
				type: Boolean,
				default: false
			},
			intervalTitle: { //定时器提示
				type: String,
				default: '后将自动退出'
			},
			timer: {
				type: Number,
				default: 5
			}
		},
		watch: {
			visible() {
				this.isShow = this.visible;
			},
			isShow() {
				this.$emit("dialogListener", this.isShow);
			},
			value() {
				if(this.value.length > 100) {
					this.$iToast("内容过长");
					this.value = this.value.substring(0, 100)
				}
			}
		},
		data() {
			return {
				isShow: false,
				zIndex: 30000
			}
		},
		created() {
			this.isShow = this.visible;
		},
		methods: {
			//plugin方式打开
			show(options) {
				Object.assign(this.$props, options);
				this.isShow = true;
				this.init();
			},
			init() {
				//计时器功能
				if(this.hasInterval) {
					this.title = `${this.timer}s${this.intervalTitle}`;
					var intervalId = setInterval(() => {
						this.timer--;
						this.title = `${this.timer}s${this.intervalTitle}`;
						if(this.timer == 0) {
							window.clearInterval(intervalId);
							this.confirm();
						}
					}, 1000)
				}
			},
			//确定
			confirm() {
				if(this.hasInput && !this.value) {
					this.$emit("confirm", this.value || "verify");
					return false;
				}
				this.$emit("confirm", this.hasInput ? this.value : '');
				this.isShow = false;
			},
			//取消
			cancel() {
				this.isShow = false;
				this.$emit("cancel");
			},
			//是否点击遮罩关闭messageBox
			closeOnClick() {
				this.closeModal && this.cancel();
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import '../../core/scss/mixin.scss';
	.iMessageBox {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
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
				line-height: 0.6rem;
				color: #333333;
				font-size: 0.16rem;
				font-weight: 600;
			}
			.content {
				width: 100%;
				box-sizing: border-box;
				height: auto;
				min-height: 10%;
				padding: 0.05rem 0.2rem 0.65rem 0.2rem;
				/*line-height: 0.27rem;*/
				white-space: normal;
				word-break: break-all;
				color: #666666;
				text-align: justify;
				text-justify: inter-ideograph;
				/*text-indent: 2em;*/
				.input-box {
					color: #666666;
					outline: none;
					border: 1px solid #CCCCCC;
					display: inline-block;
					width: 100%;
					border-radius: 0.05rem;
					padding: 0.05rem;
					font-size: 0.14rem;
					-webkit-appearance: none;
					/*去掉右下角拖动的箭头*/
					resize: none;
					font-family: 'Microsoft YaHei', Tahoma, Arial, sans-serif;
				}
				.input-box:focus {
					@include borderColor();
					border: 1px solid;
				}
				.textarea {
					height: .8rem;
				}
				.input {
					display: block;
				}
				.label {
					text-align: left;
					font-size: 0.16rem;
					margin-bottom: 0.1rem;
					font-weight: 600;
					font-family: Microsoft YaHei;
					span {
						font-size: 0.14rem;
						font-weight: 400;
					}
				}
				.label:before {
					content: '*';
					color: red;
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
					color: #666666;
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
			animation: dialog-show 0.5s;
		}
		.dialog-leave-active {
			animation: dialog-hide 0.3s;
		}
		@keyframes dialog-show {
			from {
				transform: scale(1.5);
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
	}
</style>