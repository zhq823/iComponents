import Vue from 'vue';

export default {
	install(Vue) {
		Vue.prototype.$fixIOSInput = (function() {
			var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //是否IOS系统
			if(!isiOS) {
				return false;
			}
			window.addEventListener('scroll', function() {
				document.activeElement.addEventListener('blur', function() {
					window.scrollTo(0, 0);
				})
			})
		})()
	}
}