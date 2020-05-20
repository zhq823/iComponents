import Vue from 'vue';
import iToastElement from './iToast.vue';
const iToastConstructor = Vue.extend(iToastElement);
var instances = [],
	seed = 1,
	height = 8;

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
const initToast = function() {
	const id = `iToast${seed++}`;
	const instance = new iToastConstructor({
		el: document.createElement('div')
	});
	instance.id = id;
	instance.zIndex += seed;
	let verticalOffset = 0;
	instances.map(ele => {
		verticalOffset += ele.$el.offsetHeight + height;
	})
	verticalOffset += height;
	instance.top += verticalOffset;
	return instance;
}
const destroyToast = function(instance) {
	if(!instance) {
		return;
	}
	setTimeout(() => {
		const index = instances.findIndex(inst => instance.id === inst.id);
		instances.splice(index, 1);
		const removedHeight = instance.$el.offsetHeight;
		instance.$destroy();
		document.body.removeChild(instance.$el);
		instances.map((ele, i) => {
			//高度依次递减
			if(i >= index) {
				ele.top -= removedHeight + height;
			}
		})
	}, 200)
}
const showToast = function(options) {
	setTimeout(() => {
		const {
			onClose
		} = options;
		const instance = initToast();
		document.body.appendChild(instance.$el);
		Vue.nextTick(() => {
			instance.show(options);
		});
		instances.push(instance);
		instance.$on("close", function(res) {
			destroyToast(instance);
			if(typeof onClose === 'function') {
				onClose(res || 'confirm');
			}
		});
	})
}
//entry
const iToast = function(options) {
	showToast(merge({
		message: '欢迎使用iToast',
		time: 2000,
		type: 'default',
		maxWidth: 80
	}, options));
}

//暴力关闭
iToast.close = function() {
	if(instances.length < 1) {
		return
	}
	const instance = instances[instances.length - 1];
	instance.isShow = false;
	destroyToast(instance);
}

export default iToast;
export {
	iToast
};