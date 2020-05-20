###Welcome to use MarkDown

# 使用方法
	main.js:
	import { iDelay } = "@/core";
	Vue.prototype.$iDelay = iDelay;
	
	实例中:
	this.$iDelay(() => {
		this.search();
	}, 200);
		
