import Vue from 'vue';
import iMessageElement from './iMessage.vue';

//生成一个扩展实例构造器
const iMessageConstructor = Vue.extend(iMessageElement);
//接受实例的集合
var instances = [],
	seed = 1;

//合并对象 extend、merge、assgin
//忽略原型链上的属性
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

//const getMaxZIndex = function() {
//	const allElement = [...document.all];
//	let zIndexs = allElement.map(__DOM__ => {
//		return +window.getComputedStyle(__DOM__).zIndex || 0;
//	})
//	return Math.max.apply(null, zIndexs);
//}

//创建MessageBox Vue实例
const initMessage = function() {
	const id = `iMessage${seed++}`;
	const instance = new iMessageConstructor({
		el: document.createElement('div')
	});
	instance.id = id;
	instance.zIndex += seed;
	return instance;
}

//销毁组件
const destroyMessage = function(instance) {
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
const showMessage = function(options) {
	const {
		onConfirm,
		onCancel
	} = options;
	const instance = initMessage();
	document.body.appendChild(instance.$el);
	Vue.nextTick(() => {
		instance.show(options);
	});
	instances.push(instance);
	instance.$on("confirm", function(res) {
		if(res === "verify") {
			onConfirm('');
			return false;
		}
		destroyMessage(instance);
		if(typeof onConfirm === 'function') {
			onConfirm(res || '');
		}
	});

	instance.$on("cancel", function(res) {
		destroyMessage(instance);
		if(typeof onCancel === 'function') {
			onCancel(res || '');
		}
	})
}

const iMessage = function(options) {
	showMessage(options);
}

//entry
iMessage.show = function(options) {
	return iMessage(merge({
		title: '再次确认',
		cancelTxt: '取消',
		confirmTxt: '确定',
		contentTxt: '内容',
		isCenter: true,
		closeModal: true
	}, options));
}

//暴力关闭
iMessage.close = function() {
	if(instances.length < 1) {
		return
	}
	const instance = instances[instances.length - 1];
	instance.isShow = false;
	destroyMessage(instance);
}

export default iMessage;
export {
	iMessage
};