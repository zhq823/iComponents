import iHttp from '../http';
import api from './api';
import iHtml from './iHtml';
import ImageCompressor from 'image-compressor.js';
const $ajax = new iHttp({}).api;

export default class SmartUploader {
	
	constructor() {
		this.install = this.install.bind(this);
		this.get = this.get.bind(this);
		this.mappingData = {};
		this.filterData = {};
		this.baseURL = JSON.parse(sessionStorage.getItem("Uris")).Uris.gateway;
	}
	
	// 上传入口
	install(options = {}) {
		const {
			quality = 0.6, // 压缩比例
			bucketAlias = "SmartEvent", //标识
			capture = "local", //本地选择【local】，或者拍照【camera】
			accept = "image/*", // 上传的文件类型
			mappingData = {}, // 关联的入参
			filterData = {}, // 上传或者下载的入参
			onChange = function() {}, // 监听选择文件
			onSuccess = function() {}, //上传或者下载的回调函数
			onError = function() {}, //上传失败的回调函数
		} = options;
//		Object.assign(this, options)
		this.quality = quality;
		this.bucketAlias = bucketAlias;
		this.capture = capture;
		this.accept = accept;
		this.mappingData = mappingData;
		this.filterData = filterData;
		this.onChange = onChange;
		this.onSuccess = onSuccess;
		this.onError = onError;
		this.createInstance();
	}
	
	// 创建一个input标签上传文件
	createInstance() {
		this.instance = new iHtml({
			capture: this.capture,
			accept: this.accept
		})
		this.instance.querySelector('input').click();
		this.instance.querySelector('input').onchange = function(event) {
			let files = event.target.files;
			if(!files || files.length == 0) {
				return false;
			}
			if(!this.accept.includes("image/*") && !this.accept.includes(files[0].type.split('/')[1])) {
				this.onError("格式不正确");
				return false;
			}
			this.onChange(files[0])
			this.compress(files[0]).then(res => {
				var formData = new FormData();
				formData.append("file", res);
				formData.append("bucketAlias", this.bucketAlias);
				this.UploadOssFile({
					formData
				})
			});
		}.bind(this)
	}
	
	// 销毁input标签上传文件
	destoryInstance() {
		document.body.removeChild(this.instance);
	}
	
	// 开始上传
	UploadOssFile(options = {}) {
		const {
			formData
		} = options
		$ajax.post(`${this.baseURL}${api.UploadOssFile}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}).then(response => {
			if(response && response.success) {
				this.destoryInstance();
				this.MappingssFile({
					response
				})
			} else {
				this.onError()
			}
		}).catch(() => {
			this.onError()
		})
	}
	
	// 关联
	MappingssFile(options = {}) {
		const {
			response
		} = options;
		let params = {
			fileKeys: [response.content.fileKey],
			mappingData: this.mappingData
		}
		$ajax.post(`${this.baseURL}${api.MappingssFile}`, params).then(response => {
			if(response && response.success) {
				this.QueryOssFile();
			}
		})
	}
	
	// 获取文件
	QueryOssFile() {
		let params = {
			filterData: this.filterData
		}
		$ajax.post(`${this.baseURL}${api.QueryOssFile}`, params).then(response => {
			if(response && response.success) {
				this.onSuccess(response);
			}
		})
	}
	
	// 直接获取
	get(options) {
		const {
			filterData = {},
			onSuccess = function() {}
		} = options;
		this.filterData = filterData;
		this.onSuccess = onSuccess;
		this.QueryOssFile()
	}
	
	// 删除
	remove(options) {
		const {
			fileKey = '',
			bucketAlias = 'SmartEvent',
			filterData = {},
			onSuccess = function() {}
		} = options;
		this.filterData = filterData;
		this.onSuccess = onSuccess;
		let params = {
			bucketAlias,
			fileKey: fileKey
		}
		$ajax.post(`${this.baseURL}${api.DeleteOssFile}`, params).then(response => {
			if(response && response.success) {
				this.QueryOssFile();
			}
		})
		
	}
	

	// 压缩
	compress(file) {
		const maxSize = 4 * 1024 * 1024;
		if(file.size > maxSize) {
			this.quality = Math.round((maxSize / file.size)*100) / 100;
		} else {
			this.quality = 1;
		}
		const quality = this.quality;
		return new Promise(function(resolve, reject) {
			new ImageCompressor(file, {
				quality: quality,
				success(result) {
					resolve(result);
				},
				error(e) {
					resolve(file);
					reject(e || "压缩失败")
				}
			})
		})
	}
	
}