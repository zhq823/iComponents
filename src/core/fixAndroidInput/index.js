import Vue from 'vue';

export default {
	install(Vue) {
		Vue.prototype.$fixAndroidInput = function(options) {
			let platForm = navigator.userAgent.toUpperCase();
			let isAndroid = platForm.indexOf('ANDROID') > -1 || platForm.indexOf('LINUX') > -1;
			if(!isAndroid){
				return false;
			}
			let _this = this;
			//屏幕高度
			let _screenHeight = window.document.documentElement.clientHeight || window.innerHeight;
			window.addEventListener('resize', function() {
				let wrapperBox,_body_h,_keybroad_h,_wrapper_h;
				//滑动容器
				wrapperBox = document.getElementsByClassName(options.wrapper);
				//安卓键盘弹出 body实际高度
				_body_h = window.document.documentElement.clientHeight || window.innerHeight;
				//键盘高度
				_keybroad_h = _screenHeight - _body_h;
				//滑动容器高度
				_wrapper_h = wrapperBox[0].style.height;
				_wrapper_h = Number(_wrapper_h.indexOf('px') > -1 ? _wrapper_h.replace('px', '') : _wrapper_h);
				if(_screenHeight - _body_h > 50) {
					sessionStorage.setItem('_keybroad_h', _keybroad_h);
					wrapperBox[0].style.height = _wrapper_h - _keybroad_h + 'px';
					_this.$nextTick(() => {
						document.activeElement.scrollIntoView(true); //置顶
					})
				} else {
					wrapperBox[0].style.height = _wrapper_h + Number(sessionStorage.getItem('_keybroad_h')) + 'px';
				}
			})
		}
	}
}