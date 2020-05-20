import Vue from 'vue';
import iErrorElement from './iError.vue';

const iErrorConstructor = Vue.extend(iErrorElement);
var instances = [],
	seed = 1;

const merge = function(target) {
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

//创建ErrorBox Vue实例
const initError = function() {
	const id = `iError${seed++}`;
	const instance = new iErrorConstructor({
		el: document.createElement('div')
	});
	instance.id = id;
	instance.zIndex += seed;
	return instance;
}

//销毁组件
const destroyError = function(instance) {
	if(!instance) {
		return;
	}
	setTimeout(()=>{
		const index = instances.findIndex(inst => instance.id === inst.id);
		instances.splice(index, 1);
		instance.$destroy();
		document.body.removeChild(instance.$el);
	}, 200)
}

//挂在实例到body，参数传入
const showError = function(options) {
	const {
		onConfirm,
		onCancel
	} = options;
	const instance = initError();
	document.body.appendChild(instance.$el);
	Vue.nextTick(() => {
		instance.show(options);
	});
	instances.push(instance);
	instance.$on("confirm", function(res) {
		destroyError(instance);
		if(typeof onConfirm === 'function') {
			onConfirm(res || '');
		}
	});

	instance.$on("cancel", function(res) {
		destroyError(instance);
		if(typeof onCancel === 'function') {
			onCancel(res || '');
		}
	})
}

const iError = function(options) {
	showError(options);
}

//entry
iError.show = function(options) {
	if(instances.length > 0) {
		instances[0].update(options);
		return false;
	}
	return iError(merge({
		title: '异常提示',
		leftBtnTxt: '发送反馈',
		rightBtnTxt: '详情',
		content: {},
		isCenter: false,
		closeModal: true
	}, options));
}

iError.close = function() {
	if(instances.length < 1) {
		return
	}
	const instance = instances[instances.length - 1];
	instance.isShow = false;
	destroyError(instance);
}

export default iError;
export {
	iError
};