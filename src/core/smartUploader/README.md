###Welcome to use MarkDown

### samrtUploader内部逻辑同smart-filer上传文件组件

### 区别于smart-filer
1、samrtUploader 只关注文件上传、下载、删除JS逻辑，不关心视图，不会处理文件展示。
2、samrtUploader 体积更小
3、samrtUploader 目前是初版，smart-filer部分功能还未纳入进来。

### 注意事项
因为samrtUploader初衷是只关注于【上传 install】、【下载 get】、【删除 remove】事件，而并不会帮你渲染视图。并且三个方法都有onSuccess回调，
所以你在展示你的文件时，还需要你额外创建属于你的公共组件去展示你的视图，下面的使用方法推荐你写在公共组件里面，
这样你可以按照设计稿做出更个性化的文件列表视图。具体使用方法可以参考本目录的./example.vue.md文件

### 使用方法
<template>
    <div @click="addFile()">点我上传</script>
</template>

<script>
    import SmartUploader from "@/core/smartUploader";
    const instance = new SmartUploader();
    export default {
        methods: {
            // 添加文件
			addFile() {
				const _this = this;
				instance.install({
					bucketAlias: this.bucketAlias, // 用于标识
					capture: this.capture, // 本地文件 == local 拍照 == camera
					accept: this.accept, // 文件类型
					quality: this.quality, // 压缩比例
					mappingData: _this.mappingData, // 上载、关联入参
					filterData: _this.filterData, // 下载入参
					onSuccess: function(response) { // 上载成功的回调，里面就是你需要展示的文件集合
						_this.fileList = response.content;
					}
				})
			},
			// 获取文件
			getFile() {
				const _this = this;
				instance.get({
					filterData: _this.filterData, // 下载入参
					onSuccess: function(response) { // 获取文件成功的回调，里面就是你需要展示的文件集合
						_this.fileList = response.content;
					}
				})
			},
			// 删除文件
			remove(item) {
				const _this = this;
				instance.remove({
					fileKey: item.fileKey, // 被删除文件的标识fileKey
					filterData: _this.filterData, // 下载入参
					onSuccess: function(response) { // 删除文件成功的回调，里面就是你需要展示的文件集合
						_this.fileList = response.content;
					}
				})
			},
        }
    }
</script>
