<template>
	<section>
		<div class="i_field_box" @click="openPicker()">
			<div class="field_label" :class="{field_label_verify: verify}">
				<slot name="field_label">{{ label }}</slot>
			</div>
			<div class="field_value" :class="{ 'color_red': red }">
				<slot name="field_value">{{ _value }}</slot>
			</div>
			<i v-if="hasIcon" class="iconfont icon-right field_icon"></i>
		</div>
		<mt-popup ref="popupBox" v-model="isShowPopup" position="bottom" :modal="!modal" class="popup_box">
			<div v-if="isShowPopup" class="popup_handle_row">
				<span class="popup_cancle" @click="clear()">清 空</span>
				<span class="popup_title">{{ title ? title : `请选择${label}` }}</span>
				<span class="popup_confirm" @click="confirm()">确定</span>
				<div v-if="isShowPopup && list.length == 0" class="slot_list_null">暂无数据</div>
			</div>
			<picker class="picker" v-if="isShowPopup" :data='list' :columns="columns" v-model='pickerVal'></picker>
		</mt-popup>
		<div ref="shade" v-if="isShowPopup && modal" class="shade" @click="isShowPopup = false"></div>
	</section>
</template>

<script>
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
			//################# 公共属性  ################
			_value: { //v-model
				type: String,
				default: ''
			},
			type: { //选择器类型
				type: String,
				default: 'picker' // picker=列选择器  | date=日期选择器
			},
			label: { //label
				type: String,
				default: ''
			},
			verify: { //是否必填样式
				type: Boolean,
				default: false
			},
			hasIcon: { //是否有icon-right
				type: Boolean,
				default: true
			},
			red: { //文本颜色是否标红
				type: Boolean,
				default: false
			},
			//################## 当且仅当 type==picker 有效  #################
			title: { //title
				type: String,
				default: ''
			},
			list: { //选择列表数据
				type: Array,
				default: () => {
					return []
				}
			},
			columns: { //选择的列数
				type: [String, Number],
				default: 1
			},
			modal: { //是否启用其定义遮罩层
				type: Boolean,
				default: true // true == 自定义遮罩层  |  false == 采用mint-popup 自带的modal遮罩
			},
			//################### 当且仅当 type==date 有效  #################
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
			_value() {
				this.syncVal();
			},
			pickerVal() {
				// picker 切换值变化
				if(this.isShowPopup) {
					this.$emit("onChange", this.pickerVal.join('--'));
				}
				this.$emit("valueListener", this.pickerVal.join('--'));
			},
			dateVal() {
				this.$emit("valueListener", this.dateVal)
			},
			isShowPopup() {
				this.isShowPopup && this.appendChildToBody();
			}
		},
		data() {
			return {
				pickerVal: [],
				dateVal: '',
				isShowPopup: false
			}
		},
		created() {
			this.syncVal();
		},
		methods: {
			//响应数据
			syncVal() {
				const actions = new Map([
					['picker', () => {
						// 【--】原因是联级选择，采用-隔断多个值，可能会跟单个值包含-冲突！所以联级采用--隔开
						this.pickerVal = this._value.split('--');
					}],
					['date', () => {
						this.dateVal = this._value;
					}],
					['default', () => {
						this.pickerVal = this._value.split('--');
					}]
				]);
				let action = actions.get(this.type) || actions.get('default');
				action.call(this);
			},
			//打开picker选择器
			openPicker() {
				const actions = new Map([
					['picker', () => {
						this.isShowPopup = true;
					}],
					['date', () => {
						this.showDateTime();
					}],
					['default', () => {
						this.isShowPopup = true;
					}]
				]);
				let action = actions.get(this.type) || actions.get('default');
				action.call(this);
			},
			//确定：需要获取什么参数待续...
			confirm() {
				this.isShowPopup = false;
				this.$emit('confirm', this.pickerVal);
			},
			//取消：需要获取什么参数待续...
			clear() {
				this.isShowPopup = false;
				this.pickerVal = [];
				this.$emit('clear', "clear");
			},
			//日期选择器
			showDateTime() {
				this.setRouteListeners('closeVuxDatetime'); //安卓返回键
				this.$vux.datetime.show({
					value: this.dateVal, // 其他参数同 props
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
						this.dateVal = val;
					}.bind(this),
					onClear: function() {
						this.dateVal = '';
					}.bind(this)
				})
			},
			//将mt-popup和遮罩shade添加至body
			appendChildToBody() {
				this.$nextTick(() => {
					document.body.appendChild(this.$refs.popupBox.$el);
					document.body.appendChild(this.$refs.shade);
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
@import '../../core/scss/mixin.scss';
	.i_field_box {
		font-size: 0.14rem;
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: .48rem;
		line-height: .48rem;
		background-color: white;
		border-top: .01rem solid #EEEEEE;
		padding: 0 0.1rem;
		.field_label {
			min-width: 30%;
			font-size: 0.14rem;
		}
		.field_label_verify::before {
			content: "*";
			color: red;
			vertical-align: middle;
		}
		.field_value {
			position: absolute;
			right: 0.34rem;
			top: 0rem;
			max-width: 70%;
			height: .48rem;
			line-height: .48rem;
			text-align: right;
			color: #333333;
			font-size: 0.14rem;
			font-weight: 400;
		}
		.field_icon {
			position: absolute;
			top: 0;
			right: 0.1rem;
			color: #999999;
		}
		.color_red {
			color: #FF440A;
		}
	}
	
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
				top: 0px;
				left: 0px;
				/*color: #45AFFF;*/
				@include color();
				font-size: .14rem;
				display: inline-block;
				width: 1rem;
				height: 0.42rem;
				line-height: 0.42rem;
				z-index: auto;
			}
			.popup_title {
				position: absolute;
				top: 0px;
				left: 1rem;
				width: calc(100% - 2rem);
				height: 0.42rem;
				line-height: 0.42rem;
				color: #666666;
				font-size: .15rem;
			}
			.popup_confirm {
				position: absolute;
				top: 0px;
				right: 0px;
				@include color();
				font-size: .14rem;
				display: inline-block;
				width: 1rem;
				height: 0.42rem;
				line-height: 0.42rem;
				z-index: auto;
			}
			.slot_list_null {
				position: absolute;
				color: #666666;
				width: 100%;
				text-align: center;
				margin: 0.3rem auto;
				font-size: 0.14rem;
			}
		}
		.picker {
			height: calc(100% - 0.42rem);
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