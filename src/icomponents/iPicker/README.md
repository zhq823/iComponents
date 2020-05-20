###Welcome to use MarkDown

############################ install plugin  ###########################
	需要安装mintUI、vux、node-sass
	联级请参考vux picker联级说明 <通过parent值关联父子关系>


######################### iPicker-V1.0 使用说明  ###################################
	<i-picker v-model="isShowPopup" @confirm="confirm()" @cancel="cancel()"></i-picker>
	参数方法组件iPicker-V1.0有说明
	
	
######################### iPicker 使用说明  ###################################
	<i-picker ref="city" v-model="city" :dataList="cityList" :modal="true" :columns="2" title="请选择城市"></i-picker>
	参数方法组件iPicker有说明


######################### iPicker与iPicker-V1.0 区别  ###################################
	iPicker-V1.0 也可使用
	iPicker与iPicker-V1.0 区别在于v-model model的对象不同前者使用具体值，后者使用控制iPicker开关的Boolean
	使用区别在于：
		多个选择器的时候iPicker使用更清晰
		只有一个选择器的时候二者区别不大
