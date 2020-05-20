import { iHttp, iStorage } from '../index'
import iToast from '../../icomponents/iToast/plugin.js';
import { indicator } from 'smart-indicator'

const request = new iHttp({
	// baseURL: 'https://gateway.smarteventcloud.cn',
	alert: iToast,
	block: indicator.open, //开启loading
	unblock: indicator.close, //关闭loading
	handle401: function() {

	}
}).api;

//var tenantCode = iStorage.get('eventData').tenant_code;
//if(tenantCode == "merckweb") {
//	tenantCode = "merck"
//}

export const commonService = {
	/**
	 * 公共post
	 */
	common: (url, params, conf) => {
		return request.post(url, params || {}, conf || {});
	},
	/**
	 * 获取字典
	 */
	getDict: (params) => {
		return request.post("/foundation/dict/api/fndictionary/query", params);
	},
	/**
	 * 
	 */
	querysettings: () => {
		return request.get('/api/tpm/cfg/querysettings');
    },
    /**
	 * 
	 */
	getsettings: () => {
		return request.get('/api/tpm/cfg/getsettings');
	}
}