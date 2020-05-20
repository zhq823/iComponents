import { iHttp } from 'smart-core-util'
import { indicator } from 'smart-indicator'
import iToast from '@/icomponents/iToast/plugin.js';
const request = new iHttp({
    // baseURL: 'https://gateway.smarteventcloud.cn',
    alert: iToast,
    block: indicator.open,  //开启loading
    unblock: indicator.close,  //关闭loading
    handle401:function(){

    }
}).api;



export const service = {
    /**
     * 获取日期配置接口 
     */
    getDateConfig: (params) => {
        return request.post(`/api/tenants/lilly/Check/GetDateConfig`, params);
    }
}