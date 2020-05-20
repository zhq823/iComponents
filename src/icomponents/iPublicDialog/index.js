import PublicDialog from "./PublicDialog.vue";

export default {
	install(Vue) {
		if(typeof window !== 'undefined' && window.Vue) {
			Vue = window.Vue;
		}
		Vue.component('public-dialog', PublicDialog)
	}
}