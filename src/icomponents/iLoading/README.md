###Welcome to use MarkDown

全局加载遮罩

### 使用方法
import iLoading from '@/icomponents/iLoading/plugin.js';

# 打开
iLoading.render()

# 关闭
iLoading.close()

### 如果使用的地方多，可以挂载到Vue.prototype原型上，这样可以方便全局使用
Vue.prototype.$iLoading = iLoading;
this.$iLoading.render();
this.$iLoading.close();


### 依赖
# 使用了scss，其他不需要
