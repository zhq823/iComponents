import iHttp from '../http'
import iToast from '../../icomponents/iToast/plugin';
import AnchorFn from './anchorFn';

const request = new iHttp({
    // baseURL: 'https://gateway.smarteventcloud.cn',
    alert: iToast,
    handle401: function () {

    }
}).api;

const SmartInvoker = {
    /**
     * 查询TPM
     * @param params 
     */
    query(params) {
        return request.post("/api/tpm/cfg/getsettings", params);
    },

    /**
     * 
     * @param params 
     */
    exists(params) {
        return request.post("/api/tpm/cfg/exists", params);
    },

    /**
     * 
     * @param anchor 锚点
     * @param allowTenant 允许的租户
     * @param callBack 回调方法
     */
    async call(anchor, allowTenant, callBack) {
        const params = {
            "collection": "cfg-code-anchor",
            "useCaching": false,
            "cachingKey": "",
            "filter": {
                "Anchor": anchor,
                "Tenants": {
                    "$in": [
                        allowTenant
                    ]
                }
            }
        }
        const res = await this.exists(params);
        if (res && res.content) {
            switch (typeof(callBack)) {
                case "string":
                    AnchorFn[callBack]('is string');
                    break;
                case "function":
                    callBack('is function');
                    break;
                default:
                    console.log('default');
                    break;
            }
        }
    }

}
export default SmartInvoker;