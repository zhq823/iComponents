const timeRecordArray = [];
const UPLOAD_HTTP_LOG_API = '/api/administrator/collector/log'; //TODO

class oldXHR extends XMLHttpRequest {
	constructor(...args) {
		super(...args)
	}
}

class newXHR {
	constructor() {
		return this._realXHR();
	}
	_realXHR() {
		const realXHR = new oldXHR();
		realXHR.addEventListener('loadstart', function() {
			newXHR.ajaxEventTrigger.call(this, 'ajaxLoadStart');
		}, false);
		realXHR.addEventListener('loadend', function() {
			newXHR.ajaxEventTrigger.call(this, 'ajaxLoadEnd');
		}, false);
		return realXHR;
	}
	static ajaxEventTrigger(event) {
		const ajaxEvent = new CustomEvent(event, {
			detail: this
		});
		window.dispatchEvent(ajaxEvent);
	}
}

class iHttp {
	constructor() {
		this.post = this.post.bind(this)
	}
	// there is no get method...
	post(...args) {
		const [URL, params] = args;
		return new Promise(function(resolve, reject) {
			var xhr = new oldXHR();
			xhr.open('POST', URL);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			xhr.setRequestHeader('Authorization', 'Bearer ' + iHttp.getCookie('token'));
			xhr.send(JSON.stringify(params));
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						resolve(JSON.parse(xhr.responseText));
					} else {
						reject(xhr.statusText);
					}
				}
			}
		})
	}
	static getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	}
}

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

class HttpLogInfo extends BaseInfo {
	constructor(options) {
		super(options)
		return Object.assign(this, options);
	}
}

class iError {
	static render(options) {
		const {
			id = "",
				onConfirm = function() {}
		} = options
		var iErrorBox = document.getElementsByClassName("iError-wrapper-box");
		if([...iErrorBox].length > 0) {
			iErrorBox = [...iErrorBox][0];
		} else {
			iErrorBox = document.createElement("div");
			iErrorBox.classList.add("iError-wrapper-box");
		}
		iErrorBox.innerHTML = `<div style='z-index:30000;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items: center;font-family: Microsoft YaHei, simhei, Tahoma, Arial, sans-serif !important;font-size: 14px'>
			<div class="content" style='z-index:30010;width:70%;height:auto;min-height:10%;background-color:white;font-size:0.14rem;box-sizing:content-box;border-radius:0.1rem;position:relative;'>
				<div style="border-bottom:1px solid #EEEEEE;height:40px;line-height:40px;text-align:center;font-size:15px;font-weight: bold;">异常提示</div>
				<div style="box-sizing:border-box;padding:10px;color:red;">${id}</div>
				<div id="sendHttpErrorLog" style="border-top:1px solid #EEEEEE;height:40px;line-height:40px;text-align:center;font-size:14px;color:#2D82F0;">发送反馈</div>
			</div>
			<div class="shade" style="z-index:30000;position: fixed;top:0%;left:0%;width:100%;height:100%;background:radial-gradient(circle, #333, #000, #000);-moz-opacity:0.5;opacity:0.50;filter:alpha(opacity=70);"></div>
		</ div>`;
		document.body.appendChild(iErrorBox)
		document.getElementById("sendHttpErrorLog").onclick = function() {
			document.body.removeChild(iErrorBox);
			onConfirm();
		}
	}
}

class iToast {
	static render(message) {
		var iToastBox = document.getElementsByClassName("iToast-wrapper-box");
		if([...iToastBox].length > 0) {
			iToastBox = [...iToastBox][0];
		} else {
			iToastBox = document.createElement("div");
			iToastBox.classList.add("iToast-wrapper-box");
		}
		iToastBox.innerHTML = `<div style='z-index:45000;font-size:0.14rem;box-sizing:border-box;width:100%;max-width:80%;text-align:center;border-radius:4px;position:fixed;left:50%;top:35%;transform:translate(-50%, -50%);transition:opacity 0.3s, transfrom 0s, top 0.3s;display:flex;justify-content:center;align-items:center;word-break:break-all;white-space:normal;'>
			<div class="content" style='padding: 0.1rem 0.15rem;border-radius: 5px;color: white;background-color: #000000;'>${message}</div>
		</ div>`;
		document.body.appendChild(iToastBox)
		setTimeout(() => {
			document.body.removeChild(iToastBox);
		}, 2000)
	}
}

class iRecordHttpLog {
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
		//console.log(httpLogInfoStart);
		this.logList.push(httpLogInfoStart);
		if(httpLogInfoStart.status == 200) { // 成功状态
			if(this.logList.length >= this.num) { // 成功状态集满
				//this.sendHttpLog();
			}
		} else { //非成功状态
			iError.render({
				id: httpLogInfoStart.id,
				onConfirm: function() {
					iToast.render("反馈成功");
					//this.sendHttpLog();
				}.bind(this)
			})
		}
		timeRecordArray[i].loaded = true;
	}
	// 发送日志
	static sendHttpLog() {
		let params = {
			logList: this.logList, //日志
			userId: sessionStorage.getItem("userId"),
			tenantId: sessionStorage.getItem("tenant_id")
		}
		var baseURL = JSON.parse(sessionStorage.getItem("Uris")).Uris.gateway;
		const $api = new iHttp();
		$api.post(`${baseURL}${UPLOAD_HTTP_LOG_API}`, params).then(res => {
			if(res && res.success) {
				this.logList = []; //清空已保存的日志
				iToast.render("此错误已推送至运维平台，可直接拨打客服中心获取帮助");
			}
		})
	}
}

export default iRecordHttpLog;
export {
	iRecordHttpLog
}