// import _uris from './uris.json';
// const _uris = require('./uris.json');
import { getAllCookies, getCookie, removeCookie } from 'tiny-cookie'
import qs from 'qs'

/**
 * inject window.idomain
 */
(function () {
    let domain = document.domain;
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式 
    let isIP = re.test(domain);
    let isLocalhost = domain == "localhost";
    console.log('document domain:', domain);
    domain = (isIP || isLocalhost) ? domain : domain.substring(domain.indexOf('.') + 1);
    window.idomain = domain;
})();

class iStorage {
    constructor() {

    }

    /**
     * all url parameter populated to session storage
     * all cookie data populate to session storage
     * if debug mode, load mockdata.json
     * self check
     */
    static async install() {
        // options['round'] = options.round || 1;
        populate(getAllCookies());
        var queryString = location.search;
        console.log('query string', queryString);
        if (queryString) {
            queryString = queryString.substring(1);
            populate(qs.parse(queryString));
        }

        // if (!this.getUrlGateway() && options.round < 3) {
        //     console.log("NO gateway,recursive install 3 times");
        //     await iThread.sleep(200);
        //     ++options.round;
        //     await this.install(options);
        // }
        console.log("install ready:")
        return Promise.resolve(true);
        function populate(data) {
            if (!data)
                return;
            Object.keys(data).forEach(function (key) {
                sessionStorage.removeItem(key);
                sessionStorage.setItem(key, data[key]);
            });
        }
    }
    /**
     * 
     * @param {*} key 
     */
    static getUriSetting(key) {
        try {
            var data = this.get("Uris");// sessionStorage.getItem("Uris");
            if (this.isString(data)) {
                data = JSON.parse(data)
            }
            return data["Uris"][key];
        } catch (e) {
            console.log("getUriSetting Error:" + e.message);
            return undefined;// "https://"
        }

    }
    static getAccessToken() {
        var data = this.get('token');
        // if (!data) {
        //     data = getCookie('token');
        // }
        return data;
    }
    static getUrlGateway() {
        return this.getUriSetting("gateway");
    }

    static getAll() {
        var sessionData = {};
        Object.keys(sessionStorage).forEach((key) => {
            sessionData[key] = sessionStorage[key];
        })
        return sessionData;
    }
    static setAll(data) {
        Object.keys(data).forEach((key) => {
            this.set(key, data[key]);
        })
    }
    static set(key, value) {
        if (value === undefined || value === null) {
            return;
        }
        sessionStorage.removeItem(key);
        var val = value;
        if (["string", "number", "boolean"].indexOf(typeof (value)) < 0) {
            val = JSON.stringify(value);
        }
        sessionStorage.setItem(key, val);
    }
    /**
     * 
     * @param {*} key 
     * read from session first , if undefined , read from cookie
     */
    static get(key) {
        var val = sessionStorage.getItem(key) || getCookie(key);
        if (val === null) {
            return null;
        }
        if (val == "true" || val == "false") {
            return val == "true";
        }
        if (/(^{.*}$)|(^\[.*\]$)/.test(val)) {
            return JSON.parse(val);
        }
        return val;
    }
    static remove(key) {
        sessionStorage.removeItem(key);
    }
    static clear() {
        sessionStorage.clear();
    }

    static removeAllCookies(k) {
        var keys = k || Object.keys(getAllCookies());
        keys.forEach((key) => {
            removeCookie(key);
            removeCookie(key, { domain: window.idomain });
            this.remove(key);
        })
    }

    /**
     * 
     * @param {*} obj 
     *  判断对象是否是字符串
     */
    static isString(obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    }


}

export default iStorage;