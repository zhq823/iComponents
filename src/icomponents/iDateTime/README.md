###Welcome to use MarkDown

# 该组件为选择日期公共组件 需要安装VUX

# 时间格式，不支持特殊字符，只能类似 YYYY-MM-DD HH:mm 这样的格式（不支持秒 ss）, 另外支持 YYYY-MM-DD A 这样的格式(A为上下午)

# 该组件二次封装于VUX datetime组件  详情可以看其官网说明介绍

# https://doc.vux.li/zh-CN/components/datetime.html

########################  组件使用示例  ##################
1、import
		import { iDateTime } from '@/icomponents'; 
		component('i-date-time', iDateTime);
		<i-datetime ref="dtStart" v-model="dtStart"></i-datetime>
2、open
		this.$refs.dtStart.openDateTime();