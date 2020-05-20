import iError from '../../icomponents/iError/plugin.js';
import iToast from '../../icomponents/iToast/plugin.js';
import iHttp from '../http';
import iStorage from '../storage';
/**
 * 页面接口请求监控
 */
var timeRecordArray = []; // 记录的集合
var UPLOAD_HTTP_LOG_API = 'api/save/httpLog'; //保存日志的ajax请求应该不被监听TODO
const $api = new iHttp({
	// baseURL: 'https://gateway.smarteventcloud.cn', //TODO
	alert: iToast,
}).api;

/**
 * 修改之前的XHR基类
 */
class oldXHR extends XMLHttpRequest {
	constructor() {
		super()
	}
}

/**
 * 修改之后的XHR类
 */
class newXHR {
	constructor() {
		this._realXHR = this._realXHR.bind(this)
		return this._realXHR();
	}

	// 修改XHR基类，利用XHR对象两个监听事件，CustomEvent构造函数创建一个ajaxEvent自定义事件，并将该事件嫁接到window对象中去
	// 然后，就可以对window进行监听ajaxLoadStart、ajaxLoadEnd自定义事件
	_realXHR() {
		var realXHR = new oldXHR();
		realXHR.addEventListener('loadstart', function() {
			newXHR.ajaxEventTrigger.call(this, 'ajaxLoadStart');
		}, false);
		realXHR.addEventListener('loadend', function() {
			newXHR.ajaxEventTrigger.call(this, 'ajaxLoadEnd');
		}, false);
		return realXHR;
	}

	// 创建自定义事件
	static ajaxEventTrigger(event) {
		var ajaxEvent = new CustomEvent(event, {
			detail: this
		});
		window.dispatchEvent(ajaxEvent);
	}

}

/**
 * 设置日志对象类的通用属性
 */
class BaseInfo {
	constructor(options) {
		return {
			createOn: new Date().getTime(), //日志发生时间
			hash: window.location.hash, //返回URL中的hash（#号后跟零或多个字符），如果URL中不包含散列，则返回空字符串
			hostname: window.location.hostname, //不带端口号的服务器名称
			pathname: window.location.pathname, //返回URL中的目录和（或）文件名
			port: window.location.port, //返回URL中指定的端口号。如果URL中不包含端口号，则这个属性返回空字符串
			protocol: window.location.protocol, //返回页面使用的协议。通常是http: 或https:
			search: window.location.search //返回URL的查询字符串。这个字符串以问号开头
		}
	}
}

/**
 * 接口请求日志
 */
class HttpLogInfo extends BaseInfo {
	constructor(options) {
		super(options)
		return Object.assign(this, options);
	}
}

/**
 *  输出iRecordHttpLog类
 */
export default class iRecordHttpLog {
	constructor() {
		this.install = this.install.bind(this);
	}

	// 执行方法
	static install(options = {}) {
		const {
			num: num = 10,
			origin: origin = ""
		} = options;
		this.num = num; // 满足保存成功状态下请求日志个数
		this.origin = origin; //错误标识前缀
		this.logList = []; // 保存日志的集合，注意区别于timeRecordArray
		const _this = this;
		//修改全局XMLHttpRequest类，必须保证这句代码在项目里任何ajax请求之前执行；否则请求不会被监听到。TODO
		window.XMLHttpRequest = newXHR;
		// 监听开始
		window.addEventListener('ajaxLoadStart', function(e) {
			var tempObj = {
				dtStart: new Date().getTime(), //请求开始时间
				event: e, //监听事件
				loaded: false, //请求是否结束
			}
			timeRecordArray.push(tempObj)
		});
		// 监听结束
		window.addEventListener('ajaxLoadEnd', function() {
			for(var i = 0; i < timeRecordArray.length; i++) {
				if(timeRecordArray[i].loaded === true) {
					continue;;
				}
				if(timeRecordArray[i].event.detail.status > 0) {
					var rType = (timeRecordArray[i].event.detail.responseType + "").toLowerCase()
					if(rType === "blob") { // 图片等文件类型
						(function(index) {
							var reader = new FileReader();
							reader.onload = function() {
								var responseText = reader.result; //内容就在这里
								_this.handleHttpResult(index, responseText);
							}
							try {
								reader.readAsText(timeRecordArray[i].event.detail.response, 'utf-8');
							} catch(e) {
								_this.handleHttpResult(index, timeRecordArray[i].event.detail.response + "");
							}
						})(i);
					} else { //普通JSON
						var responseText = timeRecordArray[i].event.detail.responseText;
						_this.handleHttpResult(i, responseText);
					}
				}
			}
		});
	}

	// 处理监听结果
	static handleHttpResult(i, tempResponseText) {
		if(!timeRecordArray[i] || timeRecordArray[i].loaded === true) {
			return;
		}
		var response = null;
		try {
			response = tempResponseText ? JSON.parse(tempResponseText) : "";
		} catch(e) {
			response = null;
		}
		const {
			responseURL,
			status,
			statusText
		} = timeRecordArray[i].event.detail;
		var dtEnd = new Date().getTime(); //请求结束时间
		if(!responseURL || responseURL.indexOf(UPLOAD_HTTP_LOG_API) != -1) {
			return false;
		}

		var httpLogInfoStart = new HttpLogInfo({
			id: `${this.origin}${dtEnd}`,
			httpUrl: responseURL, //请求地址
			status, //http状态码
			statusText, //http状态描述
			response, //返回结果
			dtStart: timeRecordArray[i].dtStart, //请求开始时间
			dtEnd, //请求结束时间
			loadTime: dtEnd - timeRecordArray[i].dtStart //接口请求耗时
		});
		this.outputHttpLog(i, httpLogInfoStart);
	}
	
	// 控制保存日志，错误判断等
	static outputHttpLog(i, httpLogInfoStart) {
		console.log(httpLogInfoStart);
		this.logList.push(httpLogInfoStart);
		if(httpLogInfoStart.status == 200) { // 成功状态
			if(this.logList.length >= this.num) { // 成功状态集满
				//this.sendHttpLog();
			}
		} else { //非成功状态
			iError.show({
				content: httpLogInfoStart,
				closeModal: false,
				onConfirm: function(message) {
					iToast("反馈成功");
					console.log(iStorage.get("Uris"))
					///this.sendHttpLog();
				}.bind(this)
			})
		}
		timeRecordArray[i].loaded = true;
	}
	
	// 发送日志
	static sendHttpLog() {
		let params = {
			logList: this.logList, //日志
			userId: iStorage.get("userId"),
			tenantId: iStorage.get("tenant_id")
		}
		$api.post(UPLOAD_HTTP_LOG_API, params).then(res => {
			this.logList = []; //清空已保存的日志
			iToast("此错误已推送至运维平台，可直接拨打客服中心获取帮助");
		})
	}

}