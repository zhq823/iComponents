/**
 * @params{}
 *  ### capture
 *  	local  本地文件
 * 		camera 拍照
 *  ### accept
 * 		image/* 图片
 * 		application/pdf PDF
 */
export default class iHtml {
	constructor(...args) {
		return this._render(...args);
	}
	
	_render(options = {}) {
		const {
			capture = "local",
			accept = "image/*",
			customChange = function() {}
		} = options;
		const className = `${capture}input-wrapper-box`;
		var fileInputBox = document.getElementsByClassName(className);
		
		if([...fileInputBox].length > 0) {
			fileInputBox = [...fileInputBox][0];
		} else {
			fileInputBox = document.createElement("div");
			fileInputBox.classList.add(className);
		}
		
		const fileMaps = new Map([
			["local", "localFile"],
			["camera", "cameraFile"],
			["default", "localFile"]
		])
		const event = fileMaps.get(capture) || fileMaps.get('default');
		const instance = iHtml[event](accept, customChange)
		fileInputBox.innerHTML = instance;
		document.body.appendChild(fileInputBox);
		return fileInputBox;
	}
	
	static localFile(accept, customChange) {
		window.customChangeEvent = function(event) {
			customChange(event)
		}
		return `<input type="file" id="filegallery" onchange="(function(event) { customChangeEvent(event) })(event)" accept="${accept}" style="display:none">`;
	}
	
	static cameraFile(accept, customChange) {
		window.customChangeEvent = function(event) {
			customChange(event)
		}
		return `<input type="file" id="filecamera" onchange="(function(event) { customChangeEvent(event) })(event)" accept="${accept}" capture="camera" style="display:none">`;
	}
	
	
}
