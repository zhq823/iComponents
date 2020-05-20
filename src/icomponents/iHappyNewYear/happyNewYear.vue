<template>
	<section>
		<transition name="dialog">
			<div v-if="isShow" class="container">
				<div class="tipsBox">
					<div class="content">为了更好的提供春节期(2月4日-2月10日)的咨询和支持服务，请办会人在2月3日前在A1系统内完成春节期间会议的创建、需求提交和审批，中智会基于已备案的会议日期安排客服人员提供相应咨询和支持服务。另，春节期间无法提供远程紧急支付服务，如涉及现场用餐无法在线完成买单，需办会人自行刷卡报销，请知晓。</div>
					<p class="btn" @click="close()">我知道了</p>
				</div>
			</div>
		</transition>
		<div v-if="isShow" class="shade"></div>
	</section>
</template>

<script>
	export default {
		model: {
			prop: 'visible',
			event: "dialogListener"
		},
		props: {
			visible: {
				type: Boolean,
				default: false
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
		data() {
			return {
				isShow: false
			}
		},
		methods: {
			//关闭
			close() {
				this.isShow = false;
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import '../../core/scss/mixin.scss';
	.container {
		/*屏幕上下左右居中*/
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 31000;
		.tipsBox {
			width: 70%;
			height: auto;
			min-height: 10%;
			z-index: 31000 !important;
			background-color: white;
			font-size: 0.16rem;
			box-sizing: content-box;
			border-radius: .04rem;
			position: relative;
			.content {
				width: 100%;
				box-sizing: border-box;
				height: auto;
				min-height: 10%;
				padding: 0.15rem 0.15rem 0.55rem 0.15rem;
				line-height: 0.27rem;
				white-space: normal;
				word-break: break-all;
				text-indent: 2em;
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
				@include color();
				background-color: #EEEEEE;
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
		z-index: 30000 !important;
		-moz-opacity: 0.5;
		opacity: 0.50;
		filter: alpha(opacity=70);
	}
	
	.dialog-enter-active {
		animation: dialog-show 0.35s;
	}
	
	.dialog-leave-active {
		animation: dialog-hide 0.3s;
	}
	
	@keyframes dialog-show {
		from {
			transform: scale(0.3);
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
			transform: scale(0.3);
			opacity: 0;
		}
	}
</style>