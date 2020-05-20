###Welcome to use MarkDown

### 在login.js中 模拟了以下过程

### 新版制作物需要在API拦截器请求头加入
1、Version: "eventcool",
2、tenantInfo: window.btoa(JSON.stringify(iStorage.get("tenantInfo")))

### 在core/http.js内，或自动抓取 sessionStorage.getItem("apiVersion") 
1、headers["Version"] = sessionStorage.getItem("apiVersion");
2、headers["tenantInfo"] = getCookie('tenantInfo');
