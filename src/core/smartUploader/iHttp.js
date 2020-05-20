/**
 * @params{}
 *  post(URL, params)
 */

class customXHR extends XMLHttpRequest {
	constructor(...args) {
		super(...args)
	}
}

export default class iHttp {
	constructor() {
		this.post = this.post.bind(this)
	}

	post(...args) {
		const [URL, params] = args;
		return new Promise(function(resolve, reject) {
			var xhr = new customXHR();
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
		var strcookie = document.cookie; //获取cookie字符串
		var arrcookie = strcookie.split("; "); //分割
		for(var i = 0; i < arrcookie.length; i++) {
			var arr = arrcookie[i].split("=");
			if(arr[0] == name) {
				return arr[1];
			}
		}
		return "";
	}
}