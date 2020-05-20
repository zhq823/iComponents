import Vue from 'vue'

//设置全局指令，监听ios键盘消失事件
// Vue.directive('scroll-top', function (el, binding) {
//     el.addEventListener("blur", () => {
//         console.log('asdd');
//         document.body && (document.body.scrollTop = document.body.scrollTop);
//     })
// })
// 注册一个全局自定义指令 `v-scroll-top` 监听ios键盘消失事件
Vue.directive('scroll-top', {
    inserted: function (el) {
        //console.log('aaa')
        const currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        el.addEventListener("blur", () => {
            window.scrollTo(0, currentPosition);
            console.log(currentPosition);
        })
    }
})