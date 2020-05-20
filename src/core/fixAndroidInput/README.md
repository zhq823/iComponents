###Welcome to use MarkDown

# 作用
	1、解决android系统下，输入框获取焦点后，软键盘弹起，若此时不主动关闭软键盘而直接点击路由跳转等，这时会出现屏幕底部空白，且空白高度正好是软键盘的高度
	原因是：android软键盘弹起，html高度减少了软键盘的高度，上述操作导致软件盘非正常关闭，导致html高度未能还原导致的。
	2、还有种情况是，某个页面内容使用position：fixed固定定位，且滑动高度计算为全屏高度减去导航高度，这时候软键盘弹起，靠近屏幕底部的输入框会被软键盘遮挡住
	看不到输入的内容。
	
# 使用方法
	在main.js引入
	import fixAndroidInput from "@/core";
	Vue.use(fixAndroidInput);

	目标组件中使用
	export default {
		created() {
			this.$fixAndroidInput({
				// info_box 为滑动容器的class名
				wrapper: "info_box"
			})
		}
	}
		