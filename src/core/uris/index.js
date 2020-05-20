import iHttp from '../http';
import iToast from '../../icomponents/iToast/plugin.js';
import * as $cookie from 'tiny-cookie';
import iStorage from '../storage';

export default class uris {

	// 开始获取
	static install() {
		const $api = new iHttp({
			baseURL: this.getUrlGateway(),
			alert: iToast
		}).api;
		let params = {
			collection: "cfg-iaccount-uris",
			useCaching: true,
			cachingKey: "",
			filter: {
				platform: "app",
				tenantCode: $cookie.get("tenant")
			}
		}
		$api.post("/api/tpm/cfg/getsettings", params).then(response => {
			if(response && response.success) {
				this.setUris(response);
			}
		})
	}

	// 更新至cookie、sessionStorage
	static setUris(response) {
		$cookie.set("Uris", JSON.stringify({
			Uris: response.content
		}), {
			domain: this.getDomain()
		});
		iStorage.install();
		console.log("uris update successful");
	}

	// 获取网关
	static getUrlGateway() {
		if(document.domain == "localhost") {
			return iStorage.getUriSetting("gateway");
		}
		return {
			"development": "https://gateway-dev-k8s.smarteventcloud.cn",
			"production": "https://gateway.smarteventcloud.cn",
			"staging": "https://gateway-stg.smartmice.cn"
		}[process.env.NODE_ENV];
	}

	// 获取一级域名，保证微站之间可以共享cookie
	static getDomain() {
		let domain = document.domain;
		var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式 
		let isIP = re.test(domain);
		let isLocalhost = domain == "localhost";
		domain = (isIP || isLocalhost) ? domain : domain.substring(domain.indexOf('.') + 1);
		return domain;
	}

}