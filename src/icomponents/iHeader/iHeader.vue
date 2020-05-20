<template>
	<section>
		<mt-header :title="title" class="header_position iHeader">
			<mt-button v-if="hasLeft" icon="back" slot="left" @click.native="smHleftEvent">{{ leftTxt }}</mt-button>
			<mt-button v-if="hasRight" slot="right" @click.native="smHrightEvent">{{ rightTxt }}</mt-button>
		</mt-header>
	</section>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "请选择"
			},
			hasLeft: {
				type: Boolean,
				default: true
			},
			hasRight: {
				type: Boolean,
				default: true
			},
			leftTxt: {
				type: String,
				default: "返回"
			},
			rightTxt: {
				type: String,
				default: "确定"
			},
			smHleftEvent: {
				type: Function,
				default: new Function
			},
			smHrightEvent: {
				type: Function,
				default: new Function
			}
		},
		data() {
			return {
				
			}
		},
		created() {
			
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import '../../core/scss/mixin.scss';
	.iHeader {
		@include backgroundColor();
	}
</style>