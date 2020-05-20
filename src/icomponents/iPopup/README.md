###Welcome to use MarkDown
	
# 参数说明
	# v-model 控制iPopup弹开和关闭
	# isPugin 是否采用函数方式调用iPopup
	# template 采用函数方式调用时，传入的目标组件(也就是你的业务组件)
	# closeModal 是否可以点击遮罩关闭iPopup
	# height Popup的高度，单位是百分比
	# position iPopup弹出的方位，上下左右都可以
	

# iPopup使用场景
	iPopup类似于mint-UI <mt-popup></mt-popup>, 给页面添加弹出效果
	iPopup弹出共4种动画，上下左右
	
# 使用方法
	# 方法一: 自定义标签
		如在parent.vue页面中想弹出一个sonA.vue页面，以此类推，可以同时打开多个
		<template>
			<section>
				<div @click="isShow = true"> open sonA </div>
				<i-popup v-model="isShow" position="bottom">
					<div> 我是sonA </div>
				</i-popup>
			</section>
		</template>
		<script>
			import { iPopup } from '@/icomponents';
			export default {
				name: "parent",
				components: {
					iPopup
				},
				data() {
					return {
						isShow: false
					}
				}
			}
		</script>
		
	# 方法二: 函数调用
		如在parent.vue页面中想弹出一个sonA.vue、sonB.vue、sonC.vue页面
		☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
			推荐在main.js引入iPopup
			import iPopup from "@/icomponents/iPopup/plugin.js";
			Vue.prototype.$iPopup = iPopup;
		☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
		<template>
			<section>
				xxx...
			</section>
		</template>
		<script>
			import { iPopup } from "@/icomponents/iPopup/plugin.js";
			import sonA from 'sonA.vue';
			import sonB from 'sonB.vue';
			import sonC from 'sonC.vue';
			export default {
				name: "parent",
				methods: {
					openA() {
						this.$iPopup.show({
							template: sonA,
							height: 100,
							position: "right",
							onClose: function(val) {
								//关闭sonA的回调
								console.log(val)
							}.bind(this)
						})
					}
				}
			}
		</script>
		
		
		
		
		
	
	
	
