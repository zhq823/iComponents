<template>
    <div v-if="list.length == 0" class="noData">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-no-data"></use>
        </svg>
    </div>
</template>

<script>
	export default {
        props: {
            list: {
                type: Array,
                default: function() { return [] }
            }
        },
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped="scoped" lang="scss">
.noData {
    text-align: center;
    padding-top: .5rem;
    .icon {
        font-size: 1rem;
    }
}
</style>