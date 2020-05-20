import Vue from "vue";

var instances = [],
	seed = 1;

const initEle = function(component) {
	const id = `ele${seed++}`;
	const eleConstructor = Vue.extend(component);
	const instance = new eleConstructor({
		el: document.createElement("div")
	});
	instance.id = id;
	return instance;
}

const destroyEle = function(instance) {
	if(!instance) {
		return;
	}
	setTimeout(() => {
		const index = instances.findIndex(inst => Object.is(instance.id, inst.id));
		instances.splice(index, 1);
		instance.$destroy();
		document.body.removeChild(instance.$el);
	}, 200)
}

const showEle = function(options) {
	const {
		onClose,
		onConfirm
	} = options;
	const component = options.el;
	if(!component) {
		throw "iConstructor.show函数中参数el缺少目标组件";
		return;
	}
	const instance = initEle(component);
	document.body.appendChild(instance.$el);
	Vue.nextTick(() => {
		instance.showPopup(options);
	})
	instances.push(instance);
	instance.$on("close", function(res) {
		destroyEle(instance);
		if(typeof onClose === "function") {
			onClose(res || "close");
		}
	})
	instance.$on("confirm", function(res) {
		if(typeof onConfirm === "function") {
			onConfirm(res || "confirm");
		}
	})
}

const iConstructor = function(options) {
	showEle(options);
}

iConstructor.show = function(options) {
	return iConstructor(Object.assign({
		txt: "page constructor"
	}, options))
}

iConstructor.close = function() {
	if(instances.length < 1) {
		return;
	}
	const instance = instances[instances.length - 1];
	instance.isShow = false;
	destroyEle(instance);
}

export default iConstructor;
export {
	iConstructor
}