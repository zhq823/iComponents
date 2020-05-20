###Welcome to use MarkDown

# 全局吐司组件

# 可以在子子孙孙vue实例引入，形成私有化属性
# 推荐在main.js引入，挂载到Vue构造函数的原型上，这样其他所有实例都会继承并共享这个属性，此时它只占用一个内存空间

# 例如 main.js:
	import iToast from '@/icomponents/iToast/plugin.js';
	Vue.prototype.$iToast = iToast;
	
# 使用:
	//传字符串
		this.$iToast('欢迎使用iToast');
		
	//或者传对象
		this.$iToast({
			message: '欢迎使用iToast',
			time: 2000,
			type: 'default',
			maxWidth: 80
		})
		
# 参数说明:
	---key-------|---value-----------|---type---|-----default----
	# message:   |  消息内容                   |  String  |  欢迎使用iToast
	# time:      |  消息停滞时间            |  Number  |  2000毫秒
	# type:      |  消息类型                   |  String  |  default {success、info、warning、danger、default}
	# maxWidth:  |  消息框最大宽度比     |  Number  |  设备屏幕的80%
