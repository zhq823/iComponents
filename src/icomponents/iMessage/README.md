###Welcome to use MarkDown

# 该组件既可以满足二次确认框、又可以满足自定义content内容的弹框，两种场景均可满足
    具体使用方式可以参考组件内部props传值含义即可
    
# 还可以支持以plugin方式使用组件，例如在router.js  http.js等任何非vue组件内部使用，操作回调方法待补充

	使用方法:
		import iMessage from '@/icomponents/iMessage/plugin.js';
		iMessage.show({
			width: 70, //iMessageBox宽度比，默认是70%
			title: '再次确认', //提示语
			cancelTxt: '取消', //取消按钮文本
			confirmTxt: '确定', //确认按钮文本
			contentTxt: '内容', //提示内容
			isCenter: true, //内容文本是否居中显示
			closeModal: true, //是否点击遮罩关闭iMessage
			hasLeft: true, //是否有取消按钮
			hasRight: true, //是否有确认按钮
			hasTemplate: false, //是否使用自定义模板
			hasInput: false, //是否使用带有textArea模板
			value: "", //使用textArea模板时，输入的内容
			
			/###### 定时器属于定制功能，并不常用！可以忽略它  #####/
				hasInterval: false, //是否有定时器功能
				intervalTitle: "后将自动退出", //定时器提示
				timer: 5, //定时器时间
			/#################################################/
			
			onConfirm: function(res) { //点击确认按钮的回调函数
				//console.log(res);
			},
			onCancel: function(res) { //点击取消按钮的回调函数
				//console.log(res);
			}
		})
		
		//暴力关闭，没有回调函数
		iMessage.close();
		
























