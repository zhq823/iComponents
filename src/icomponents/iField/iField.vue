<template>
	<div class="ievent_field_box">
		<div class="field_label" :class="{field_label_verify: verify}">
			<slot name="field_label">{{label}}</slot>
		</div>
		<div class="field_value" :class="{ 'color_red': red }">
			<slot name="field_value">{{data}}</slot>
		</div>
		<i v-if="hasIcon" class="iconfont icon-right field_icon"></i>
	</div>
</template>

<script>
	export default {
		name: 'ifield',
		props: {
			label: {
				type: String,
				default: ''
			},
			data: {
				type: String | Number,
				default: null
			},
			verify: {
				type: Boolean,
				default: false
			},
			hasIcon: {
				type: Boolean,
				default: true
			},
			red: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			}
		},
		created() {

		},
		methods: {

		}
	}
</script>

<style scoped="scoped">
	.ievent_field_box {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: .48rem;
		line-height: .48rem;
		background-color: white;
		border-top: .01rem solid #EEEEEE;
		padding: 0 0.1rem;
	}
	
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
		font-weight: 400;
		font-size: 0.14rem;
		white-space: nowrap; 
		overflow: hidden; 
		text-overflow: ellipsis;
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
</style>