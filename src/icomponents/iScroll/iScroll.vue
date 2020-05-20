<template>
	<div
		@scroll="loadmoreScroll($event)"
		class="loadmore_container"
		ref="wrapper"
		:style="scrollStyle"
	>
		<mt-loadmore
			:topDistance="40"
			:bottomDistance="40"
			:top-method="loadTop"
			@top-status-change="handleTopChange"
			:bottom-method="loadBottom"
			@bottom-status-change="handleBottomChange"
			:bottom-all-loaded="allLoaded"
			ref="loadmore"
			:auto-fill="false"
		>
		<ul :style="contentStyle">
			<slot name="content"></slot>
			<div v-if="dataList.length > 0 && allLoaded" class="no_more_data">
				<span class="footer_line_left"></span>
				<span class="no_more_data_span">已显示全部数据</span>
				<span class="footer_line_right"></span>
			</div>
			<i-nodata v-if="hasIcon" :list="dataList"></i-nodata>
			<slot name="bottom"></slot>
		</ul>
		<div slot="top" class="mint-loadmore-top">
			<span
				v-show="topStatus !== 'loading' && topStatus != 'unknown'"
				:class="{ 'is-rotate': topStatus === 'drop' }"
				class="drop_icon"
			>↓</span>
			<span v-if="topStatus === 'loading'">
				<transition name="successTips">
					<span v-if="onSuccess">刷新成功!</span>
				</transition>
				<img v-if="!onSuccess" class="loading_img" src="./loading.gif"/>
				<!--<mt-spinner type="fading-circle"></mt-spinner>-->
			</span>
		</div>
		<div slot="bottom" class="mint-loadmore-bottom">
			<span
				v-show="bottomStatus !== 'loading'"
				:class="{ 'is-rotate': bottomStatus === 'drop' }"
				class="drop_icon"
			>↑</span>
			<span v-show="bottomStatus === 'loading'">
				<img class="loading_img" src="./loading.gif"/>
				<!--<mt-spinner type="fading-circle"></mt-spinner>-->
			</span>
		</div>
		</mt-loadmore>
	</div>
</template>

<script>
import iNodata from '../iNodata';

export default {
	components: {
		iNodata
	},
	props: {
		allLoaded: {
			type: Boolean,
			default: false
		},
		topHeight: {
			type: Number,
			default: 0
		},
		bottomHeight: {
			type: Number,
			default: 0
		},
		pageIndex: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 10
		},
		dataList: {
			type: Array,
			default: () => { return [] }
		},
		loadData: {
			type: Function,
			default: new Function
		},
		hasIcon: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		pageIndex() {
			this.PageIndex = this.pageIndex;
		}
	},
	data() {
		return {
			bottomStatus: "",
			topStatus: "",
			PageIndex: this.pageIndex,
			onSuccess: false
		};
	},
	computed: {
		scrollStyle() {
			return {
				height: `${this.iStorage.get('_screen_height') - this.topHeight - this.bottomHeight}px`,
				top: `${this.topHeight}px`
			}
		},
		contentStyle() {
			return {
				"min-height": `${this.iStorage.get('_screen_height') - this.topHeight - this.bottomHeight}px`
			}
		}
	},
	methods: {
		//父组件通知结束上拉下拉刷新状态
		scrollListener() {
			this.onSuccess = true;
			setTimeout(()=>{
				this.onSuccess = false;
				this.$nextTick(() => {
					if (this.topStatus == "loading") {
						this.$refs.loadmore.onTopLoaded();
						this.topStatus = "unknown";
					}
					if (this.bottomStatus == "loading") {
						this.$refs.loadmore.onBottomLoaded();
						this.bottomStatus = "unknown";
					}
				});
			},500)
		},
		//上拉
		loadBottom() {
			this.PageIndex = this.PageIndex || this.pageIndex;
			this.PageIndex++;
			this.loadData({
				pageIndex: this.PageIndex
			});
		},
		//下拉
		loadTop() {
			this.PageIndex = 1;
			this.loadData({
				pageIndex: this.PageIndex
			});
		},
		//下拉状态变化
		handleTopChange(status) {
			this.topStatus = status;
		},
		//上拉状态变化
		handleBottomChange(status) {
			this.bottomStatus = status;
		},
		//滑动事件
		loadmoreScroll(event) {
			this.$emit("loadmoreScroll", event);
		}
	}
};
</script>

<style scoped="scoped" lang="scss">
	@import "./iScroll.scss";
</style>