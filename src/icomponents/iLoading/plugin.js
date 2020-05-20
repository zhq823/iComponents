import Vue from 'vue';
import iLoadingElement from './iLoading.vue';
const iLoadingConstructor = Vue.extend(iLoadingElement);
var instances = [],
	seed = 1;
export default class iLoading {

	constructor() {}

	static render(options) {
		return this.createCustomElement(Object.assign({
			title: "loading",
		}, options));
	}

	static createCustomElement(options) {
		const {
			onHandle = () => {}
		} = options;
		const instance = this.initLoading();
		document.body.appendChild(instance.$el);
		Vue.nextTick(() => {
			instance.render(options);
		});
		instances.push(instance);
		instance.$on("onHandle", res => {
			this.destroyLoading(instance);
			if(typeof onHandle === 'function') {
				onHandle(res || '');
			}
		});
	}

	static initLoading() {
		const id = `iLoading${seed++}`;
		const instance = new iLoadingConstructor({
			el: document.createElement('div')
		});
		instance.id = id;
		instance.zIndex += seed;
		return instance;
	}

	static destroyLoading(instance) {
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

	static close() {
		if(instances.length < 1) {
			return
		}
		const instance = instances[instances.length - 1];
		instance.isShow = false;
		this.destroyLoading(instance);
	}

}