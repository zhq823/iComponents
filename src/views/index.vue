<template>
	<section>
		{{ message }}
	</section>
</template>

<script>
import iToast from '@/icomponents/iToast/plugin.js';
import iMessage from '@/icomponents/iMessage/plugin.js';
	export default {
		data() {
			return {
				message: 'An extended custom component library'
			}
		},
		created() {
			iMessage.show({
				contentTxt: "custom iMessage",
				onConfirm: function() {
					iToast({
						message: "custom iToast",
						type: "success"
					})
				}.bind(this)
			})
		}
	}
</script>

<style scoped="scoped">
</style>