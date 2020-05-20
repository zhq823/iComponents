<template>
	<section class="iLoadingBox" :style="{'z-index': isShow ? zIndex : 0 }">
		<transition name="loading">
			<div class="imgBox" v-if="isShow">
				<img src="./loading.gif" />
			</div>
		</transition>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				zIndex: 30000
			}
		},
		methods: {
			// open loading
			render(options) {
				Object.assign(this.$data, options);
				this.isShow = true;
			},
			// 暂时没用到，预留，比如需要手动点击叉号关闭，一般不需要这样
			close() {
				this.isShow = false;
				this.$emit("onHandle", {
					message: "close loading"
				});
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.iLoadingBox {
		position: fixed;
		z-index: 30000;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.imgBox {
			background: radial-gradient(circle, #333, #000, #000);
			/*background: #000000;*/
			-moz-opacity: 0.5;
			opacity: 0.50;
			filter: alpha(opacity=70);
			width: 1rem;
			height: 1rem;
			border-radius: 0.2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: all 0.3s ease-in-out;
			img {
				width: 0.4rem;
				height: 0.4rem;
			}
		}
		.loading-enter-active {
			animation: loading-show 0.5s;
		}
		.loading-leave-active {
			animation: loading-hide 0.3s;
		}
		@keyframes loading-show {
			from {
				transform: scale(1.5);
				opacity: 0;
			}
			to {
				transform: scale(1);
				opacity: 0.5;
			}
		}
		@keyframes loading-hide {
			from {
				transform: scale(1);
				opacity: 0.5;
			}
			to {
				transform: scale(0);
				opacity: 0;
			}
		}
	}
</style>