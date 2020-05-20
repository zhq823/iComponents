//import Vue from 'vue';
//export default {
//	install(Vue) {
//		Vue.prototype.$guid = (ele) => {
//			function S4() {
//				return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//			}
//
//			function myId() {
//				return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
//			}
//			return myId();
//		}
//	}
//}

export const guid = function() {
	function S4() {
		return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	function myId() {
		return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
	return myId();
}