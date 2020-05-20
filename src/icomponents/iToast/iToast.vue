<template>
	<section class="tipsBox" :style="toastStyle">
		<transition name="dialog">
			<div v-if="isShow" class="content" :style="{'background-color': theme}">{{ message }}</div>
		</transition>
	</section>
</template>

<script>
	export default {
		props: {
			//内容文本
			message: {
				type: String,
				default: ''
			},
			//显示时长
			time: {
				type: Number,
				default: 2000
			},
			//消息类型
			type: {
				type: String,
				default: 'default'
			},
			//最大屏幕宽度比
			maxWidth: {
				type: Number,
				default: 80
			}
		},
		computed: {
			toastStyle() {
				return {
					'z-index': this.zIndex + 10,
					top: `${this.top}px`,
					'max-width': `${this.maxWidth}%`
				}
			},
			theme() {
				const themeMap = new Map([
					['success', '#67c23a'],
					['info', '#909399'],
					['warning', '#e6a23c'],
					['danger', '#f56c6c'],
					['default', '#000000']
				]);
				//防止传入无效的type
				return themeMap.get(this.type) || themeMap.get('default');
			}
		},
		data() {
			return {
				isShow: false,
				zIndex: 40000,
				top: 200
			}
		},
		methods: {
			//plugin方式打开
			show(options) {
				Object.assign(this.$props, options);
				this.isShow = true;
				setTimeout(() => {
					this.close();
				}, this.time)
			},
			close() {
				this.isShow = false;
				this.$emit('close')
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.tipsBox {
		font-size: 0.14rem;
		box-sizing: border-box;
		width: 100%;
		/*max-width: 80%;*/
		text-align: center;
		border-radius: 4px;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: opacity 0.3s, transfrom 0s, top 0.3s;
		display: flex;
		justify-content: center;
		align-items: center;
		word-break: break-all;
		white-space: normal;
		.content {
			padding: 0.1rem 0.15rem;
			border-radius: 5px;
			color: white;
			background-color: #000000;
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
	}
</style>