###Welcome to use MarkDown

# iConstructor用于生成一个扩展实例构造器

# 一般地，我们采用Vue.component('i-xxx', ixxx)来实现组件的注册和使用
  	但是这样有不足之处是: 
  		1、需要在使用该组件的父组件当中引入子组件并写入其自定义标签，以及v-bind，v-on等等自定义属性和方法实现传递信息;
  		2、必须依赖于组件实例注册和使用。一些自定义弹框等组件想要在router、http拦截中打开就麻烦了

# iConstructor可以解决以上问题，引入iConstructor，可以将目标组件开启、关闭等产生的代码完全可以跟父组件实现隔离
	因为所有的v-bind和v-on想实现的数据传递都能在iConstructor.show方法里实现，这样就可以实现公共代码可以抽离出来，
	比如iEvent里面【进程】、【评分】页面，在列表和详情都有该功能，就是通过这种方法实现的，是需要引入调用showTaskLog方法就可以了，很方便。

# 使用方法:
	# parentComponent.vue;
	import { iConstructor } from "@/core";
	import TaskLog from '@/views/components/taskLog/TaskLog.vue'; 
	export default {
		methods: {
			showTaskLog(options) {
				iConstructor.show(Object.assign({
					// 需要打开的目标组件。
					el: TaskLog,
					// 目标组件关闭的监听回调方法，
					// 目标组件关闭时，执行this.$emit("close", message)就可以触发onClose,可以参考TaskLog.vue里面的代码。
					onClose: function(res) { 
						console.log(res); //关闭需要执行的逻辑
					}.bind(this)
				}, options))
			}
		}
	}
	
# 更多：
	目前iConstructor可以实现所有数据交互，但是目前仅支持this.$emit("close", message)，然后父组件onClose来监听关闭方法；
	在iConstructor代码里其实还可以继续优化，可以自定义方法名传入iConstructor.show()，目前还没发现这种场景需要
	
	
