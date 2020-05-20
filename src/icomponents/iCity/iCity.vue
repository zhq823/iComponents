<template>
	<mt-popup v-model="isShowPopup" position="bottom" class="popup_box">
		<iHeader ref="iHeader" title="选择城市" leftTxt="返回" :hasRight="false" :smHleftEvent="iCityGoBack"></iHeader>
		<div class="iCityContentBox" @scroll="onScroll($event)">
			<div id="historyBox" class="historyBox" v-if="historyList.length > 0 && showHistory">
				<p class="title">历史选择</p>
				<div class="historyCity">
					<template v-for="item in historyList">
						<span @click="selectHistoryCity(item)">{{ item.txt }}</span>
					</template>
				</div>
			</div>
			<template v-for="(item, index) in dataList">
				<div :key="index+'py0'" class="pyBox" :id="item.py" v-if="index == 0">{{ item.py }}</div>
				<div :key="index+'py'" class="pyBox" :id="item.py" v-if="index != 0 && dataList[index-1].py!=dataList[index].py">{{ item.py }}</div>
				<div :key="index+'city'" class="city" @click="onConfirm(item)">
					{{ item.txt }}
					<i :class="item.select?'weui-icon-success-no-circle':''"></i>
				</div>
			</template>
		</div>
		<div class="alphabetBox" @click.stop>
			<template v-for="(item, index) in alphabet">
				<a @click="toTegional(item)" :key="index">
					<span :class="{ isActive: mark == item }">{{ item }}</span>
				</a>
			</template>
		</div>
	</mt-popup>
</template>

<script>
	import iToast from "../iToast/plugin.js";
	import iHeader from "../iHeader";
	import iField from '../iField';
	import { commonService } from "../../core/service/service.js";
	const getAlphabet = function() {
		var arr = [];
		for(var i = 65; i < 91; i++) {
			arr.push(String.fromCharCode(i));
		}
		return arr;
	}
	export default {
		components: {
			iHeader,
			iField
		},
		props: {
			// 是否显示历史城市
			showHistory: {
				type: Boolean,
				default: true
			},
			// 存储历史城市数组的key值，不同场景建议使用不同key，这样互不干涉
			cityKey: {
				type: String,
				default: "cityList"
			},
			// 是否对上线城市进行过滤【例如辉瑞上线城市条件：在城市的json里存在: itsExtData.tenants == ['pfizer']】
			isOnline: {
				type: Boolean,
				default: false
			},
			// 针对上线城市过滤，需要被过滤的租户个体，考虑到不同站点tenant取值方式不一样，所以你可以传入你的tenant值，不必在此纠结tenant等于谁
			tenant: {
				type: String,
				default: "pfizer"
			},
			// 当你编辑你的历史数据若已经存在城市，那么可以将省市传入，只需txt值，组件就会查询对应省市完整的对象，这样避免一些重要的数据丢失情况发生
			city: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				isShowPopup: false, // 组件的开启和关闭
				alphabet: getAlphabet(), // 锚点的生成
				mark: 'A',
				dataList: [], // 省市列表
				historyList: [], //历史城市
				address: {}
			}
		},
		watch: {
			isShowPopup() {
				if(this.isShowPopup) {
					this.setRouteListeners("iCityGoBack");
					this.$root.$eventHub.$on("iCityGoBack", data => {
						this.iCityGoBack();
						this.$root.$eventHub.$off("iCityGoBack");
					});
				} else {
					this.$emit('close'); //销毁组件
					this.removeRouteListeners("iCityGoBack");
				}
			}
		},
		methods: {
			render(options) {
				Object.assign(this.$props, options);
				this.isShowPopup = true;
				this.loadData();
				this.getAppStorage();
			},
			showPopup() {
				this.isShowPopup = true;
				this.loadData();
				this.getAppStorage();
			},
			onConfirm(item) {
				this.address = item;
				this.$emit('confirm', item);
				this.historyList.forEach((ele, index) => {
					if(ele.txt == this.address.txt) {
						this.historyList.splice(index, 1);
					}
				});
				this.historyList.unshift(this.address);
				this.historyList = this.historyList.slice(0, 5);
				this.setAppStorage(JSON.stringify(this.historyList.slice(0, 5)));
				this.iCityGoBack();
			},
			selectHistoryCity(item) {
				this.onConfirm(item)
			},
			// 历史城市存入
			setAppStorage(dataList) {
				let _this = this;
				this.iJsBridge.call({
					method: "SMDataStorage.setItem",
					postData: {
						[_this.cityKey]: dataList
					}
				});
			},
			// 历史城市取出
			getAppStorage() {
				let _this = this;
				this.iJsBridge.call({
					method: "SMDataStorage.getItem",
					postData: {
						key: [_this.cityKey]
					},
					callback: function(data) {
						_this.historyList = JSON.parse(data[_this.cityKey]);
						_this.addHistoryIcon();
					}
				});
			},
			// 滚动监听
			onScroll(event) {
				var allEle;
				for(var i = 0; i < this.alphabet.length; i++) {
					if(this.alphabet[i] == "#") {
						allEle = document.querySelectorAll(".iCityContentBox #historyBox")[0];
					} else {
						allEle = document.querySelectorAll(`.iCityContentBox #${this.alphabet[i]}`)[0];
					}
					if(allEle && event.target.scrollTop >= allEle.offsetTop) {
						this.mark = this.alphabet[i];
					}
				}
			},
			// 锚点定位
			toTegional(index) {
				this.mark = index;
				let id = index == "#" ? "#historyBox" : "#" + index;
				document.querySelector(id) && document.querySelector(id).scrollIntoView(true);
				if("vibrate" in window.navigator) {
					window.navigator.vibrate(20);
				}
			},
			loadData() {
				this.alphabet = [];
				let params = {
					keyword: "",
					keyCode: "CPC-City",
					lnkVal: ""
				}
				this.getDict({
					params: params,
					onSuccess: function(res) {
						this.dataList = res.content;
						//是否对上线城市进行过滤【例如辉瑞上线城市条件：在城市的json里存在: itsExtData.tenants == ['pfizer']】
						if(this.isOnline) {
							this.dataList = this.dataList.filter(ele => {
								return ele.itsExtData.hasOwnProperty('tenants') && ele.itsExtData.tenants.includes(this.tenant);
							})
						}
						this.dataList.forEach((ele, index) => {
							ele.select = false;
							ele.py = ele.pyVal.substr(0, 1);
							if(this.city == ele.txt) {
								ele.select = true;
							}
						});
						var allCityPy = this.dataList.map(ele => {
							return ele.py;
						})
						this.alphabet = getAlphabet().filter(ele => {
							return allCityPy.includes(ele);
						})
						this.addHistoryIcon();
						this.mark = this.alphabet[0];
					}.bind(this)
				})
			},
			addHistoryIcon() {
				if(this.historyList.length > 0 && this.showHistory) {
					this.alphabet.unshift("#");
				}
			},
			// 搜索城市
			getDict({
				onSuccess,
				params
			}) {
				commonService.getDict(params).then(res => {
					onSuccess(res);
				})
			},
			iCityGoBack() {
				this.isShowPopup = false;
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import "../../core/scss/mixin.scss";
	.popup_box {
		font-size: 0.14rem;
		width: 100% !important;
		height: 100% !important;
		box-sizing: border-box !important;
		background-color: #F2F2F2 !important;
		.iCityContentBox {
			width: 100%;
			height: calc(100% - 0.4rem);
			position: fixed;
			left: 0px;
			bottom: 0px;
			overflow: scroll;
			color: #333333;
			padding-bottom: 0.2rem;
			-webkit-overflow-scrolling: touch;
			.historyBox {
				border-bottom: 1px solid #CCCCCC;
				.title {
					padding: 0.1rem 0.1rem 0.05rem 0.1rem;
				}
				.historyCity {
					padding: 0.1rem 0.1rem 0.2rem 0.1rem;
					span {
						display: inline-block;
						background-color: #E2E2E2;
						padding: 0.03rem 0.08rem;
						margin-right: 0.1rem;
						margin-bottom: 0.1rem;
					}
				}
			}
			.pyBox {
				padding: 0.1rem;
			}
			.city {
				padding: 0.15rem;
				background-color: white;
				border-bottom: 1px solid #EEEEEE;
				position: relative;
				i {
					position: absolute;
					top: 0.13rem;
					right: 0.5rem;
				}
			}
		}
		.alphabetBox {
			position: fixed;
			width: 0.64rem;
			color: #666;
			right: 0;
			font-size: 0.12rem;
			right: 0;
			top: 50%;
			transform: translate3d(0%, -50%, 0);
			text-align: right;
			a {
				color: #666;
				padding: .01rem;
				display: inline-block;
				padding-right: 0.2rem;
				span {
					display: inline-block;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 0.18rem;
					height: 0.18rem;
					border-radius: 50%;
				}
				.isActive {
					@include backgroundColor();
					color: white;
				}
			}
		}
	}
</style>