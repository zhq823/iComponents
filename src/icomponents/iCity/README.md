###Welcome to use MarkDown

# 区别于iChoiseCity组件，该组件仅仅支持选择城市，还有便于后期差异化逻辑扩展

# 使用方式
<template>
    <section class="yourComponent" @click="openCityComponent">选择城市</section> 
</template>

<script>
import iCity from '@/icomponents/iCity/plugin.js'
export default {
    methods: {
        openCityComponent() {
            iCity.render({
                showHistory: true, // 非必传
                cityKey: "cityList", // 非必传，但强烈建议你传入属于你的key值，这样跟其他业务互不干涉
                isOnline: true, // 非必传
                tenant: this.$cookie.get("tenant"), //非必传
                city: this.city, //非必传
                onConfirm: function(data) {
                    console.log(data);
                   	// 这里写你的逻辑
                }.bind(this)
            })
        }
    }
}
</script>