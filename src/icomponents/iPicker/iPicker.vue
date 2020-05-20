<template>
	<section>
		<mt-popup v-model="isShowPopup" position="bottom" :modal="!modal" class="popup_box">
			<div v-if="isShowPopup" class="popup_handle_row">
				<span class="popup_cancle" @click="clear()">清 空</span>
				<span class="popup_title">{{ title }}</span>
				<span class="popup_confirm" @click="confirm()">确定</span>
				<div v-if="isShowPopup && dataList.length == 0" class="slot_list_null">暂无数据</div>
			</div>
			<picker v-if="isShowPopup" :data='dataList' :columns="columns" v-model='value'></picker>
		</mt-popup>
		<div v-if="isShowPopup && modal" class="shade" @click="isShowPopup = false"></div>
	</section>
</template>

<script>
	//v-model绑值注意避免在子组件对值直接修改
	//vue2.0不允许对props参数直接修改，应通知父组件进行修改
	/*
		该组件采用mint-popup本身存在modal；
		但是mintui popup多个同时出现时都会只有一个modal层
		所以出现层级错乱问题，这时我们自定义个一个遮罩层
	* */
	import Picker from 'vux/src/components/picker';
	export default {
		components: {
			Picker
		},
		model: {
			prop: '_value',
			event: "valueListener"
		},
		props: {
			_value: { //picker已经选中的值
				type: String,
				default: ''
			},
			dataList: { //picker选择列表
				type: Array,
				default: () => {
					return ['请选择'];
				}
			},
			columns: { //选择项列数，当大于1列时，联级效果请参考vux官方文档picker组件说明
				type: Number,
				default: 1
			},
			title: { //title
				type: String,
				default: '请选择'
			},
			modal: { //是否启用其定义遮罩层
				type: Boolean,
				default: false // true == 自定义遮罩层  |  false == 采用mint-popup 自带的modal遮罩
			}
		},
		watch: {
			_value() {
				this.value = this._value.split('-');
			},
			value() {
				this.$emit("valueListener", this.value.join('-'))
			}
		},
		data() {
			return {
				isShowPopup: false,
				value: []
			}
		},
		created() {
			this.value = this._value.split('-');
		},
		methods: {
			showPicker(val) {
				this.isShowPopup = val;
			},
			//确定：需要获取什么参数待续...
			confirm() {
				this.isShowPopup = false;
				this.$emit('confirm', this.value);
			},
			//取消：需要获取什么参数待续...
			clear() {
				this.isShowPopup = false;
				this.value = [];
				this.$emit('cancel', "清空");
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
@import '../../core/scss/mixin.scss';
	.popup_box {
		width: 100% !important;
		height: 50% !important;
		/*mt-popup zindex逐次增加，这里将它固定值，层级最高*/
		z-index: 5000 !important;
		.popup_handle_row {
			position: relative;
			text-align: center;
			padding-top: .14rem;
			height: .42rem;
			.popup_cancle {
				position: absolute;
				top: 0.1rem;
				left: .28rem;
				/*color: #45AFFF;*/
				@include color();
				font-size: .14rem;
				display: inline-block;
				width: .56rem;
				height: .28rem;
				line-height: .28rem;
				z-index: auto;
			}
			.popup_title {
				color: #666666;
				font-size: .15rem;
			}
			.popup_confirm {
				position: absolute;
				top: .1rem;
				right: .28rem;
				/*color: #45AFFF;*/
				@include color();
				font-size: .14rem;
				display: inline-block;
				width: .56rem;
				height: .28rem;
				line-height: .28rem;
				z-index: auto;
			}
			.slot_list_null {
				position: absolute;
				color: #666666;
				width: 100%;
				text-align: center;
				margin: 0.3rem auto;
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
		z-index: 4800 !important;
		-moz-opacity: 0.5;
		opacity: 0.50;
		filter: alpha(opacity=70);
	}
</style>