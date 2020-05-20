<template>
	<section>
		<div class="tipBox">
			<p class="tipTxt">{{ msg }}</p>
		</div>
	</section>
</template>

<script>
	// 在父标签引用该组件，通过 v-model绑定内容文本
	export default {
		model: {
			prop: '_msg',
			event: "msgListener"
		},
		props: {
			_msg: {
				type: String,
				default: "新版本预计2019-09-01更新，请及时更新至新版本。"
			}
		},
		watch: {
			_msg() {
				this.msg = this._msg;
			},
			msg() {
				this.$emit("msgListener", this.msg);
			}
		},
		data() {
			return {
				msg: ""
			}
		},
		mounted() {
			this.msg = this._msg;
			this.setTipAnimation();
		},
		methods: {
			//设置滚动条动画时间
			setTipAnimation() {
				this.$nextTick(()=>{
					const screenWidth = document.documentElement.clientWidth; //设备宽度
					const tipStyle = document.styleSheets[0]; //当前层叠样式表
					const tipTxt = document.getElementsByClassName("tipTxt")[0]; //滚动内容标签
					const tipWidth = tipTxt.clientWidth; //滚动内容宽度
					const speed = 71; //滚动每秒的速度 px
					const time = `${(tipWidth+screenWidth)/speed}s`; //滚动时间
					tipTxt.style.animationDuration = `${time}`; //设置内容滚动时间
					tipStyle.deleteRule(6); //清除之前写入的动画样式
					tipStyle.insertRule(`@keyframes tipRot{ 0%{ transform: translateX(100vw);} 100%{transform: translateX(${-tipWidth}px);} }`, 6); //写入样式
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
@import '../../core/scss/mixin.scss';
	.tipBox {
		border-top: 1px solid #EEEEEE;
		width: 100%;
		height: 0.3rem;
		line-height: 0.3rem;
		background-color: #FFF1F2;
		overflow: hidden;
		position: relative;
		.tipTxt {
			position: absolute;
			@include color();
			white-space: nowrap;
			animation: tipRot linear infinite;
		}
		/*X运动的距离应该根据内容宽度来实现，并且动画时间也需要*/
		/*@keyframes tipRot {
                0% {
                    transform: translateX(100vw);
                }
                100% {
                    transform: translateX(-100vw);
                }
            }*/
	}
</style>