<template>
	<section v-if="false"></section>
</template>

<script>
	export default {
		model: {
			prop: '_value',
			event: "valueListener"
		},
		props: {
			_value: { //v-model
				type: String,
				default: ''
			},
			startDate: null, //任何类型
			cancelText: { //取消文本
				type: String,
				default: '取消'
			},
			confirmText: { //确定文本
				type: String,
				default: '确定'
			},
			clearText: { //清除文本  默认为空=没有清除功能
				type: String,
				default: ''
			},
			format: { //日期格式
				type: String,
				default: 'YYYY-MM-DD' //YYYY-MM-DD HH:mm  or  YYYY-MM-DD A
			}
		},
		watch: {
			_value(){
				this.value = this._value;
			},
			value(){
				this.$emit("valueListener", this.value)
			}
		},
		data() {
			return {
				value: ''
			}
		},
		created() {
			this.value = this._value;
		},
		methods: {
			openDateTime() {
				this.setRouteListeners('closeVuxDatetime'); //安卓返回键
				this.$vux.datetime.show({
					value: this.value, // 其他参数同 props
					format: this.format,
					yearRow: "{value}年",
					monthRow: "{value}月",
					dayRow: "{value}日",
					startDate: this.startDate,
					cancelText: this.cancelText,
					confirmText: this.confirmText,
					clearText: this.clearText,
					onHide: function() {
						this.removeRouteListeners('closeVuxDatetime'); //安卓返回键
					}.bind(this),
					onConfirm: function(val) {
						this.value = val;
					}.bind(this),
					onClear: function() {
						this.value = '';
					}.bind(this)
				})
			}
		}
	}
</script>