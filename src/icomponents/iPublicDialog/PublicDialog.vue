<template>
	<section class="container">
		<transition name="dialog">
			<div v-if="isShow" class="dialog_container">
				<p class="dialog_title">{{title}}</p>
				<div class="content_txt">
					<slot name="content"></slot>
				</div>
				<footer class="dialog_footer">
					<p class="handle_btn cancle" @click="close()">取消</p>
					<p class="handle_btn confirm" @click="handleConfirm()">确定</p>
				</footer>
			</div>
		</transition>
		<div v-if="isShow" class="shade" @click="close()"></div>
	</section>
</template>

<script>
	export default{
		props:{
			isShow: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '提示'
			}
		},
		data(){
			return{
				
			}
		},
		created(){
			
		},
		methods:{
			//关闭dialog
			close() {
				this.$emit('close', false)
			},
			handleConfirm(){
				this.$emit('handleConfirm', false)
			},
		}
	}
</script>

<style scoped="scoped" lang="scss">
@import '../../core/scss/mixin.scss';
	.dialog_container {
		width: 70%;
		min-height: 1.12rem;
		border: .01rem solid #EEEEEE;
		box-sizing: content-box;
		padding: 0.1rem .14rem;
		border-radius: 0.04rem;
		z-index: 3000;
		position: fixed;
		top: 30%;
		left: calc(15% - .14rem);
		background-color: white;
	}
	.dialog_title{
		@include color();
		height: .2rem;
		line-height: .2rem;
		margin-bottom: 0.08rem;
		text-align: center;
		font-size: .15rem;
	}
	.content_txt{
		width: 100%;
		white-space:normal;
		word-break:break-all;
		height: auto;
		margin-bottom: .28rem;
	}
	.dialog_footer{
		box-sizing: border-box;
		width: 100%;
		height: .42rem;
		line-height: .42rem;
		position: absolute;
		bottom: 0rem;
		left: 0rem;
		border-top: .01rem solid #EEEEEE;
	}
	.handle_btn{
		display: inline-block;
		width: 49%;
		height: .42rem;
		line-height: .42rem;
		text-align: center;
		float: left;
	}
	.confirm{
		@include color();
	}
	.cancle{
		color: #666666;
		border-right: .01rem solid #EEEEEE;
	}
	.shade {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: black;
		z-index: 2900;
		-moz-opacity: 0.5;
		opacity: 0.50;
		filter: alpha(opacity=70);
	}
	/*dialog出现的动画*/
	
	.dialog-enter-active {
		animation: dialog-show 0.4s;
	}
	
	.dialog-leave-active {
		animation: dialog-hide 0.3s;
	}
	
	@keyframes dialog-show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@keyframes dialog-hide {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>