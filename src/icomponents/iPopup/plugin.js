import Vue from 'vue';
import iPopupElement from './iPopup.vue';
const iPopupConstructor = Vue.extend(iPopupElement);
var instances = [],
	seed = 1;

const merge = function(target) {
	if(Object.prototype.toString.call(arguments[1]) === '[object String]') {
		return Object.assign(target, {
			message: arguments[1]
		})
	}
	for(var i = 1, j = arguments.length; i < j; i++) {
		var source = arguments[i];
		for(var prop in source) {
			if(source.hasOwnProperty(prop)) {
				var value = source[prop];
				if(value !== undefined) {
					target[prop] = value;
				}
			}
		}
	}
	return target;
};
const initPopup = function() {
	const id = `iPopup${seed++}`;
	const instance = new iPopupConstructor({
		el: document.createElement('div')
	});
	instance.id = id;
	instance.zIndex += seed;
	return instance;
}
const destroyPopup = function(instance) {
	if(!instance) {
		return;
	}
	setTimeout(() => {
		const index = instances.findIndex(inst => instance.id === inst.id);
		instances.splice(index, 1);
		instance.$destroy();
		document.body.removeChild(instance.$el);
	}, 200)
}
const showPopup = function(options) {
	setTimeout(() => {
		const {
			onClose
		} = options;
		const instance = initPopup();
		document.body.appendChild(instance.$el);
		Vue.nextTick(() => {
			instance.show(options);
		});
		instances.push(instance);
		instance.$on("onClose", function(res) {
			destroyPopup(instance);
			if(typeof onClose === 'function') {
				onClose(res || 'close');
			}
		});
	})
}
//entry
const iPopup = function(options) {
	showPopup(options);
}

//entry
iPopup.show = function(options) {
	return iPopup(merge({
		isPugin: true,
		height: 100,
		position: "bottom",
		closeModal: true
	}, options));
}

//暴力关闭
iPopup.close = function() {
	if(instances.length < 1) {
		return
	}
	const instance = instances[instances.length - 1];
	instance.isShow = false;
	destroyPopup(instance);
}

export default iPopup;
export {
	iPopup
};