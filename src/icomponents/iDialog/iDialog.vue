<template>
	<section class="container" :style="{'z-index': isShow ? zIndex : 0 }">
		<transition name="iDialog">
			<div v-if="isShow" class="iDialogBox" :style="{'z-index': zIndex + 10, width: `${width}%`}">
				<div class="ievent_popup_btn btn_top">
					<slot name="title">{{ title }}</slot>
				</div>
				<div class="ievent_content">
					<slot name="content"></slot>
				</div>
				<div class="ievent_popup_btn btn_bottom">
					<div class="cancel_btn handle_btn" @click="cancel()">
						<slot name="cancel">{{ cancelTxt }}</slot>
					</div>
					<div class="confirm_btn handle_btn" @click="confirm()">
						<slot name="confirm">{{ confirmTxt }}</slot>
					</div>
				</div>
			</div>
		</transition>
		<div v-if="isShow" :style="{'z-index': zIndex}" class="shade" @click="closeOnClick()"></div>
	</section>
</template>

<script>
	export default {
		model: {
			prop: "_isShow",
			event: "isShowListener"
		},
		props: {
			_isShow: {
				type: Boolean,
				default: false
			},
			width: {
				type: Number,
				default: 70
			},
			title: {
				type: String,
				default: "提示"
			},
			confirmTxt: {
				type: String,
				default: "确认"
			},
			cancelTxt: {
				type: String,
				default: "取消"
			},
			closeModal: { //是否点击遮罩关闭iDialog
				type: Boolean,
				default: true
			}
		},
		watch: {
			_isShow() {
				this.isShow = this._isShow;
			},
			isShow() {
				this.$emit("isShowListener", this.isShow)
			}
		},
		data() {
			return {
				isShow: false,
				zIndex: 24000
			}
		},
		created() {
			this.isShow = this._isShow;
		},
		methods: {
			//关闭dialog
			close() {
				this.isShow = false;
			},
			//确认
			confirm() {
				this.$emit("onConfirm");
			},
			//取消
			cancel() {
				this.$emit("onCancel");
				this.close()
			},
			//是否点击遮罩关闭messageBox
			closeOnClick() {
				this.closeModal && this.close();
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import '../../core/scss/mixin.scss';
	.container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.iDialogBox {
			width: 70%;
			height: auto;
			min-height: 10%;
			background-color: white;
			font-size: 0.14rem;
			box-sizing: content-box;
			border-radius: .1rem;
			position: relative;
			.ievent_popup_btn {
				height: .44rem;
				width: 100%;
				line-height: .44rem;
				text-align: center;
			}
			.ievent_content {
				box-sizing: border-box;
				white-space: normal;
				word-break: break-all;
				/*min-height: 1.6rem;*/
				height: auto;
				width: 100%;
				color: #333333;
				font-size: .14rem;
				color: #666666;
				font-size: .14rem !important;
				padding-bottom: 0.44rem;
				padding: 0.1rem 0.05rem 0.54rem 0.05rem;
			}
			.btn_top {
				color: #333333;
				font-size: 0.16rem;
				font-weight: 600;
				border-bottom: .01rem solid #EEEEEE;
			}
			.btn_bottom {
				border-top: .01rem solid #EEEEEE;
				position: absolute;
				bottom: 0;
				left: 0;
			}
			.handle_btn {
				display: inline-block;
				width: 49%;
				height: .44rem;
				line-height: .44rem;
				float: left;
			}
			.cancel_btn {
				border-right: .01rem solid #EEEEEE;
				color: #666666;
			}
			.confirm_btn {
				@include color();
			}
		}
		.shade {
			position: fixed;
			top: 0%;
			left: 0%;
			width: 100%;
			height: 100%;
			background-color: black;
			-moz-opacity: 0.5;
			opacity: 0.50;
			filter: alpha(opacity=70);
		}
	}
	/*dialog出现的动画*/
	
	.popup-enter-active {
		animation: popup-show 0.3s;
	}
	
	.popup-leave-active {
		animation: popup-hide 0.2s;
	}
	
	@keyframes popup-show {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	@keyframes popup-hide {
		from {
			transform: scale(0.5);
			opacity: 1;
		}
		to {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>