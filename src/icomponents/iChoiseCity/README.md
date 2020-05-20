# 该组件可以选择城市，历史城市功能

# 一、组件方式引入
<template>
    <section class="yourComponent">
        <i-choise-city ref="iChoiseCity" @address="getAddress" :showHistary='true'></i-choise-city>
    </section> 
</template>

<script>

import { iChoiseCity } from "@/icomponents";
export default {
    components: {
        iChoiseCity
    },
    methods: {
        // 打开选择城市组件
        openCityComponent() {
            this.$refs.iChoiseCity.showPopup("cityList");
        },
        // 选择结果的$on监听方法
        getAddress(data) {
            //data就是你需要的省市，根据需要拿你想要的数据
            console.log(data);
        }
    }
}
</script>

# 二、plugin方式引入
<template>
    <section class="yourComponent"></section> 
</template>

<script>
// 你也可以将iCity在main.js挂载到Vue原型上，Vue.prototype.$iCity = iCity; 这样你的业务组件内无须引入，直接this.$iCity.render()调用即可
import iCity from '@/icomponents/iChoiseCity/plugin.js'
export default {
    methods: {
        openCityComponent() {
            iCity.render({
                showHistary: true, // 非必传
                cityKey: "cityList", // 非必传，但强烈建议你传入属于你的key值，这样跟其他业务互不干涉
                isOnline: true, // 非必传
                tenant: this.$cookie.get("tenant"), //非必传
                curCity: { // 非必传
                    province: "北京市",
					city: "北京市"
                },
                onConfirm: function(data) {
                    console.log(data);
                }.bind(this)
            })
        }
    }
}
</script>

# props参数可以参考组件内说明
    
