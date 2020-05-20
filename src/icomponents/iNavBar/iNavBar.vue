<template>
	<section class="container">
		<div class="ievent_nav_bar_left">
			<slot name="left"></slot>
		</div>
		<div class="ievent_nav_bar_right">
			<slot name="right"></slot>
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped="scoped">
	.container {
		width: 100%;
		position: relative;
	}
	
	.ievent_nav_bar_left {
		position: absolute;
		top: 0;
		left: 0;
		width: 90%;
		height: .42rem;
		line-height: .42rem;
		background-color: white;
		overflow: hidden;
	}
	
	.ievent_nav_bar_right {
		position: absolute;
		top: 0;
		right: 0;
		width: 10%;
		height: .42rem;
		line-height: .42rem;
		background-color: lightgray;
	}
</style>