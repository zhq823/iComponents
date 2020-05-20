<template>
	<section class="container">
		<transition name="dialog">
			<div v-if="isShowPopup" class="dialog_container" ref='Sizer'>
				<p class="title_container">
					<span class="dialog_title">请选择会议状态</span>
					<i class="iconfont icon-close close" @click="close()"></i>
				</p>
				<main class="filter_container">
					<template v-for="(item, index) in filterList">
						<div :key="index" @click="onSearch(item)" class="filter_item" :class="{isActive:item.isActive}">
							<i v-if="item.isActive" class="icon_select_confirm2"></i>
							<p class="filter_item_num">
								<span class="filter_item_num_circle" :style="{background: item.itsExtData && item.itsExtData.color ? item.itsExtData.color : '#CCCCCC'}">{{item.count}}</span>
							</p>
							<p class="filter_txt">{{item.txt}}</p>
						</div>
					</template>
				</main>
			</div>
		</transition>
		<div v-if="isShowPopup" class="shade" @click="close()"></div>
	</section>
</template>

<script>
	export default {
		model: {
			prop: '_filterList',
			event: 'valueListener'
		},
		props: {
			_filterList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		watch: {
			_filterList() {
				this.filterList = this._filterList;
			},
			filterList() {
				this.$emit('valueListener', this.filterList)
			}
		},
		data() {
			return {
				filterList: [],
				isShowPopup: false
			}
		},
		created() {
			this.filterList = this._filterList;
		},
		methods: {
			//是否打开筛选
			showPopup(val) {
				this.isShowPopup = val;
			},
			//选择会议状态
			onSearch(item) {
				this.close();
				this.filterList.map((ele) => {
					ele.isActive = false;
				})
				item.isActive = true;
				this.$emit('onSearch', item);
			},
			//关闭dialog
			close() {
				this.isShowPopup = false;
			}
		}
	}
</script>

<style scoped="scoped">
	.dialog_container {
		width: 100%;
		min-height: 52%;
		height: auto !important;
		z-index: 25000;
		position: fixed;
		top: .44rem;
		left: 0;
		background-color: white;
		padding-bottom: .15rem;
	}
	
	.title_container {
		position: relative;
	}
	
	.dialog_title {
		position: absolute;
		color: #999999;
		top: 0.1rem;
		left: .14rem;
	}
	
	.close {
		position: absolute;
		top: 0.1rem;
		right: .14rem;
	}
	
	.filter_container {
		padding-top: .25rem;
	}
	
	.filter_item {
		position: relative;
		display: inline-block;
		box-sizing: content-box;
		padding-top: 0.1rem;
		width: 33%;
		float: left;
		height: 11vh;
		text-align: center;
		line-height: 11vh;
		margin-top: 0.08rem;
		overflow: hidden;
	}
	
	@media(min-width:768px) {
		.filter_item {
			width: 25%;
			margin-top: 0.15rem;
		}
		.dialog_container {
			padding-bottom: .3rem;
		}
	}
	
	.isActive {
		background-color: #F2F8FF;
	}
	
	.filter_item_num {
		position: absolute;
		width: 100%;
		height: 7vh;
		line-height: 6vh;
		top: 0.1rem;
		left: 0;
	}
	
	.filter_item_num_circle {
		display: inline-block;
		width: 6.3vh;
		height: 6.3vh;
		line-height: 6.3vh;
		border-radius: 50%;
		color: white;
		font-size: .15rem;
	}
	
	.filter_item_num_circle:active {
		width: 6vh;
		height: 6vh;
		font-size: .14rem;
		line-height: 6vh;
	}
	
	.filter_txt {
		font-size: .14rem !important;
		position: absolute;
		width: 100%;
		height: 4vh;
		line-height: 4vh;
		bottom: 0;
		left: 0;
		font-size: .14rem;
	}
	
	.shade {
		position: fixed;
		bottom: 0%;
		left: 0%;
		width: 100%;
		height: calc(100% - .44rem);
		background-color: black;
		z-index: 24500;
		-moz-opacity: 0.5;
		opacity: 0.50;
		filter: alpha(opacity=70);
	}
	/*dialog出现的动画*/
	
	.dialog-enter-active {
		animation: dialog-show 0.25s;
	}
	
	.dialog-leave-active {
		animation: dialog-hide 0.45s;
	}
	
	@keyframes dialog-show {
		from {
			top: -52%;
			opacity: 0.3;
		}
		to {
			top: 0.44rem;
			opacity: 1;
		}
	}
	
	@keyframes dialog-hide {
		from {
			top: 0.44rem;
			opacity: 1;
		}
		to {
			top: -52%;
			opacity: 0;
		}
	}
</style>