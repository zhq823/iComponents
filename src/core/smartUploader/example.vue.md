<template>
	<section class="iUploadBox">
		<div class='upload-btn' @click="addFile()">
			<a-icon type="plus" class="icon" />
		</div>
		<viewer :images="fileList">
			<template v-for="(item, i) in fileList">
				<div class="imgBox" :key="item.url" @mouseover="showIcon(i)" @mouseout="hideIcon(i)">
					<img class="img" :src="item.url" :title="item.fileName">
					<a-icon v-if="!readonly" class="remove" :class="`remove${i}`" type="close-circle" @click="remove(item)" />
				</div>
			</template>
		</viewer>
	</section>
</template>

<script>
	import Vue from 'vue';
	import SmartUploader from "@/core/smartUploader";
	const instance = new SmartUploader();
	import Viewer from 'v-viewer';
	import 'viewerjs/dist/viewer.css';
	Vue.use(Viewer);
	export default {
		props: {
			// ### 标识
			bucketAlias: {
				type: String,
				default: 'SmartEvent'
			},
			// 本地文件 == local 拍照 == camera
			capture: {
				type: String,
				default: 'local'
			},
			/*
			 * ### 文件类型
			 * 	 'image/*'
			 *   'application/msword,application/pdf,application/vnd.ms-powerpoint,text/plain,aplication/zip,application/x-zip-compressed'
			 *   'audio/*'
			 *   'video/*'
			 * */
			accept: {
				type: String,
				default: 'image/*'
			},
			// ### 压缩比例
			quality: {
				type: String,
				default: '0.6'
			},
			// ### 是否只读
			readonly: {
				type: Boolean,
				default: false
			},
			// ### 上载、关联入参
			mappingData: {
				type: Object,
				default: () => {}
			},
			// ### 下载入参
			filterData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				fileList: []
			}
		},
		created() {
			this.getFile();
		},
		methods: {
			// 添加文件
			addFile() {
				const _this = this;
				instance.install({
					bucketAlias: this.bucketAlias,
					capture: this.capture,
					accept: this.accept,
					quality: this.quality,
					mappingData: _this.mappingData,
					filterData: _this.filterData,
					onSuccess: function(response) {
						_this.fileList = response.content;
					}
				})
			},
			// 获取文件
			getFile() {
				const _this = this;
				instance.get({
					filterData: _this.filterData,
					onSuccess: function(response) {
						_this.fileList = response.content;
					}
				})
			},
			// 删除文件
			remove(item) {
				const _this = this;
				instance.remove({
					fileKey: item.fileKey,
					filterData: _this.filterData,
					onSuccess: function(response) {
						_this.fileList = response.content;
					}
				})
			},
			// 显示 remove-icon
			showIcon(i) {
				if(this.readonly) {
					return false;
				}
				var icon = document.getElementsByClassName(`remove${i}`)[0];
				icon.style.display = 'inline-block';
			},
			// 隐藏 remove-icon
			hideIcon(i) {
				if(this.readonly) {
					return false;
				}
				var icon = document.getElementsByClassName(`remove${i}`)[0];
				icon.style.display = 'none';
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.iUploadBox {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		.upload-btn {
			border: 1px solid #CCCCCC;
			display: inline-block;
			width: 60px;
			height: 60px;
			border-radius: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			.icon {
				font-size: 30px;
			}
		}
		.imgBox {
			display: inline-block;
			margin-left: 16px;
			margin-bottom: 5px;
			position: relative;
			.img {
				width: 60px;
				height: 60px;
				border-radius: 5px;
				cursor: pointer;
			}
			.remove {
				position: absolute;
				top: -6px;
				right: -6px;
				font-size: 18px;
				cursor: pointer;
				color: #fc3258;
				display: none;
			}
		}
	}
</style>