'use strict'

import iStorage from '../storage/index'
import axios from 'axios'
import qs from 'qs'
import { getCookie } from 'tiny-cookie';

// const CancelToken = axios.CancelToken;

class iHttp {
    constructor(options) {
        this.api = axios.create({
            baseURL: (options && options.baseURL ? options.baseURL : undefined) || iStorage.getUrlGateway()
        });
        this.options = options;
        this.autoExtractData = options.autoExtractData || true;
        this.autoExtractResponseError = options.autoExtractResponseError || true;
        this.alert = options.alert || window.alert;
        this.block = options.block || function () { };
        this.unblock = options.unblock || function () { };
        this.only401 = true;
        this.handle401 = options.handle401 || function () {
            
        };
        this.injectRequest();
        this.injectResponse();
        this.monitorStorage = [];

        // 修改是否需要 抛错时的alert true/false
        let that = this;
        this.api.changeAutoExtractResponseError = function(isShow){
            that.autoExtractResponseError = isShow;
        }
    }
    injectRequest() {
        this.api.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        this.api.interceptors.request.use(null, (error) => {
            this.alert(error.message);
        });
        this.api.interceptors.request.use((config) => {
            if (!config.noblock) {
                this.block();
            }
            config.cancelToken = new axios.CancelToken((c) => {
                this.preventDuplicateRequest(config, c);
            })
            if (config.data && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                config.data = qs.stringify(config.data);
            }
            this.appendHeader(config);
            return config;
        });
    }
    injectResponse() {
        this.api.interceptors.response.use(undefined, (error) => {
            var config = error.config;
            this.monitor(config, -1);
            if (!config.noblock) {
                this.unblock();
            }

            if(error.response.status == 400 && error.response.data.error == 'invalid_grant' && error.response.data.LockMinute){
                let msg = '';
                if(error.response.data.LimitFailedCount - error.response.data.AccessFailedCount > 0){
                    msg = "密码不正确，密码已输入错误" + error.response.data.AccessFailedCount + "次，输错" + error.response.data.LimitFailedCount + "次账号将被锁定" + error.response.data.LockMinute + "分钟"
                }
                if(error.response.data.LimitFailedCount - error.response.data.AccessFailedCount <= 0){
                    msg = "密码已被锁，请" + error.response.data.LockMinute + "分钟后再试"
                }
                this.alert(msg);
                return;
            }else if(error.response.status == 400 && error.response.data.error == 'invalid_grant'){
                this.alert(error.response.data.error_description);
                return;
            }

            if (error.response.status == 401) {
                // 接口错误状态码
                switch (error.response.status) {
                    case 401:
                        if(this.only401){
                            this.only401 = false;
                            this.handle401();
                        }
                        break;
                }
                return;
            }

            var message = error.message;
            if (error.response && error.response.data) {
                message = error.response.data.error_description || message;
            }
            this.alert(message);
        });
        this.api.interceptors.response.use(response => {
            if (!response) {
                return;
            }
            var config = response.config;
            this.monitor(response.config, -1);
            if (!config.noblock) {
                this.unblock();
            }
            var filterResponse = response;
            if (this.autoExtractData) {
                filterResponse = (response && response.data) ? response.data : null;
            }
            if (this.autoExtractResponseError) {
                var responseData = filterResponse;
                if (responseData && responseData.success != undefined && responseData.success == false) {
                    this.alert(responseData.msg || responseData.error || '未知错误')
                }
            }
            return filterResponse;
        });
    }
    appendHeader(config) {
        var token = iStorage.getAccessToken()
        if (token && token != null) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        
        var Version = iStorage.get("apiVersion");
        if(Version){
            config.headers["Version"] = Version;
        }

        var tenantInfo = getCookie('tenantInfo');
        if(tenantInfo){
            config.headers["tenantInfo"] = tenantInfo;
        }

        var organization_type = iStorage.get("organization_type");
        if (organization_type == "Tenant") {
            config.headers["tenant_code"] = iStorage.get("tenant_code")
        }
    }
    /**
     * same url, same data, must wait response 
     * @param {*} request 
     * @param {*} cancel 
     */
    preventDuplicateRequest(config, c) {
        // console.log('config', config);
        var duplicated = this.monitorStorage.findIndex(item => item.url == config.url && item.data == config.data);
        // var duplicated = this.monitorStorage.findIndex(item => item.url == config.url);
        // console.log('duplicated', duplicated);
        if (duplicated > -1) {
            console.log('config', config);
            console.log('duplicated', duplicated);
            c('当前请求进行中,请稍等');
            return;
        }
        this.monitor(config, 1);
    }

    monitor(config, action) {
        // console.log('monitor', config, action);
        if (!config)
            return;
        // console.log('config data tostring', config.data.toString());
        var url = config.url;
        var data = config.data;
        switch (action) {
            case 1:
                this.monitorStorage.push({ url: url, data: data });
                break;
            case -1:
                this.monitorStorage.splice(this.monitorStorage.findIndex(item => item.url == url && item.data == data), 1)
                break;
        }
        // console.log('this.monitorStorage',JSON.stringify(this.monitorStorage));
    }
}
export default iHttp;