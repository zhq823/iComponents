import Vue from 'vue';
import iCityElement from './iCity.vue';

const iCityConstructor = Vue.extend(iCityElement);
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

const initCity = function() {
	const id = `iCity{seed++}`;
	const instance = new iCityConstructor({
		el: document.createElement('div')
	});
	instance.id = id;
	return instance;
}

const destroyCity = function(instance) {
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

const showCity = function(options) {
	const {
		onClose,
		onConfirm
	} = options;
	const instance = initCity();
	document.body.appendChild(instance.$el);
	Vue.nextTick(() => {
		instance.render(options);
	});
	instances.push(instance);
	instance.$on("close", function(res) {
		destroyCity(instance);
		if(typeof onClose === 'function') {
			onClose(res || 'close');
		}
	})
	instance.$on("confirm", function(res) {
		if(typeof onConfirm === 'function') {
			onConfirm(res || 'confirm');
		}
	})
}

const iCity = function(options) {
	showCity(options);
}

iCity.render = function(options) {
	return iCity(merge({
		showHistory: true, //是否显示历史记录
		cityKey: "cityList", //历史记录的key值
		isOnline: false, //是否对上线城市进行过滤【例如辉瑞上线城市条件：在城市的json里存在: itsExtData.tenants == ['pfizer']】
		tenant: "pfizer", //上线城市对当前租户进行过滤
		city: "" //编辑城市，将当前城市传入，进行reload
	}, options));
}

iCity.close = function() {
	if(instances.length < 1) {
		return
	}
	const instance = instances[instances.length - 1];
	instance.isShow = false;
	destroyCity(instance);
}

export default iCity;
export {
	iCity
};