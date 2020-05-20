<template>
	<mt-popup v-model="isShowPopup" position="bottom" class="popup_box">
		<div class="listBox">
			<iHeader ref="iHeader" title="城市选择" leftTxt="返回" rightTxt="保存" :smHrightEvent="saveCity" :smHleftEvent="choisecityGoBack">
			</iHeader>
			<div class="choiceAdress" @scroll="onScroll($event)">
				<div class="citybox" v-if="isshowcity">
					<div class="weui-cells">
						<i-field label="国家" data="中国" :hasIcon="false" class="margin-top"></i-field>
						<i-field label="省份" :data="address.province.val" @click.native="choseAdress('province')"></i-field>
						<i-field label="会议城市" :data="address.city.val" @click.native="choseAdress('city')"></i-field>
					</div>
					<div class="histaryList" v-if="historyList.length>0 && showHistary">
						<P>历史选择</P>
						<span :key="index" v-for="(city, index) in historyList" @click="choseHistoryAdress(city)">{{ city.city.val }}</span>
					</div>
				</div>
				<transition name="slide-fade">
					<div v-if="!isshowcity" class="povinceListcontent">
						<div class="weui-cells">
							<div v-for="(items,index) in dataList" :key="index">
								<div class="pyMain" :id="items.py" v-if="index!=0 && dataList[index-1].py!=dataList[index].py">{{ items.py }}</div>
								<div class="pyMain" :id="items.py" v-if="index==0">{{ items.py }}</div>
								<div class="weui-cell weui-check__label" @click="choseAdressBtn($event, index, items)">
									<div class="weui-cell__bd">
										<p>{{ items.txt }}</p>
									</div>
									<span>
                    					<i :class="items.select?'weui-icon-success-no-circle':''"></i>
                  					</span>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
		<div class="navList" @click.stop v-if="!isshowcity">
			<ul>
				<template v-for="(item, index) in alphabet">
					<li :key="index">
						<!--:href="`#${item}`" -->
						<a @click="toTegional(item)">
							<span :class="{ isActive: mark == item }">{{ item }}</span>
						</a>
					</li>
				</template>
			</ul>
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
			showHistary: {
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
			curCity: {
				type: Object,
				default: () => {
					return {
						province: "",
						city: ""
					}
				}
			}
		},
		data() {
			return {
				isShowPopup: false, // 组件的开启和关闭
				alphabet: getAlphabet(), // 锚点的生成
				mark: 'A',
				dataList: [], // 省市列表
				address: { // 当前省市对象
					province: {},
					city: {}
				},
				selectType: "province", //当前选择的省市类型
				isshowcity: true, // 切换显示界面，表单页面 or 列表页面
				keyword: "", // 搜索，此功能暂未开启
				historyList: [], // 历史城市集合
				storageType: "cityList" // 存储你的历史城市key值
			};
		},
		watch: {
			isShowPopup() {
				if(this.isShowPopup) {
					this.setRouteListeners("choisecityGoBack"); //保存当前路由返回事件记录
					this.$root.$eventHub.$on("choisecityGoBack", data => {
						this.choisecityGoBack();
						this.$root.$eventHub.$off("choisecityGoBack");
					});
				} else {
					this.$emit('close'); //销毁组件
					this.removeRouteListeners("choisecityGoBack"); //返回删除记录
				}
			}
		},
		methods: {
			// 滚动监听
			onScroll(event) {
				var allEle;
				for(var i = 0; i < this.alphabet.length; i++) {
					allEle = document.querySelectorAll(`.weui-cells #${this.alphabet[i]}`)[0];
					if(allEle && event.target.scrollTop >= allEle.offsetTop - this.$refs.iHeader.$el.clientHeight - 2) {
						this.mark = this.alphabet[i];
					}
				}
			},
			// 选择历史城市
			choseHistoryAdress(data) {
				this.address = data;
				this.saveCity();
			},
			// 锚点定位
			toTegional(index) {
				this.mark = index;
				let id = "#" + index;
				document.querySelector(id) && document.querySelector(id).scrollIntoView(true);
				if("vibrate" in window.navigator) {
					window.navigator.vibrate(20);
				}
			},
			keywordfocus() {
				let _this = this;
				let NewItems = [];
				this.addressList.map(function(item) {
					if(item.value.indexOf(_this.keyword) > -1) {
						NewItems.push(item);
					}
				});
				this.$forceUpdate();
				this.addressListS = NewItems;
				this.$forceUpdate();
			},
			// 保存地址信息
			saveCity() {
				if(this.address.city.val) {
					this.historyList.forEach((element, index) => {
						if(element.city.val == this.address.city.val) {
							this.historyList.splice(index, 1);
						}
					});
					let jsons = {
						city: this.address.city,
						province: this.address.province
					};
					this.historyList.unshift(jsons);
					this.historyList = this.historyList.slice(0, 5);
					this.setAppStorage(JSON.stringify(this.historyList.slice(0, 5)));
					this.$emit("address", this.address);
					this.choisecityGoBack();
				} else {
					iToast("请选择完整地址");
				}
			},
			// 获取地址
			async getCities(params) {
				this.alphabet = [];
				this.getDict({
					onSuccess: function(res) {
						if(res.success) {
							this.dataList = res.content;
							//是否对上线城市进行过滤【例如辉瑞上线城市条件：在城市的json里存在: itsExtData.tenants == ['pfizer']】
							if(this.isOnline) {
								this.dataList = this.dataList.filter(ele => {
									return ele.itsExtData.hasOwnProperty('tenants') && ele.itsExtData.tenants.includes(this.tenant);
								})
							}
							this.dataList.forEach((element, index) => {
								element.select = false;
								element.py = element.pyVal.substr(0, 1);
								if(this.address[this.selectType].val == element.txt) {
									element.select = true;
								}
							});
							var allCityPy = this.dataList.map(ele => {
								return ele.py;
							})
							this.alphabet = getAlphabet().filter(ele => {
								return allCityPy.includes(ele) ;
							})
							this.mark = this.alphabet[0];
						} else {
							iToast("请求失败");
						}
					}.bind(this),
					params: params
				})
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
			// 历史城市存入
			setAppStorage(dataList) {
				let _this = this;
				let ss = _this.storageType;
				this.iJsBridge.call({
					method: "SMDataStorage.setItem",
					postData: {
						[_this.storageType]: dataList
					}
				});
			},
			// 历史城市取出
			getAppStorage(stringVals) {
				let _this = this;
				this.iJsBridge.call({
					method: "SMDataStorage.getItem",
					postData: {
						key: [_this.storageType]
					},
					callback: function(data) {
						_this.historyList = JSON.parse(data[_this.storageType]);
					}
				});
			},
			// plugin引用方式入口
			render(options) {
				Object.assign(this.$props, options);
				this.isShowPopup = true;
				this.keyword = "";
				this.isshowcity = true;
				this.storageType = this.cityKey;
				this.getAppStorage();
				this.reloadCity();
			},
			// 组件引用方式入口
			showPopup(type) {
				this.isShowPopup = true;
				this.keyword = "";
				this.isshowcity = true;
				this.storageType = type;
				this.getAppStorage();
				this.reloadCity();
			},
			// 获取当前选择的城市源数据
			reloadCity() {
				if(this.curCity.province && this.curCity.city) {
					//获取省份源数据
					var paramsP = {
						keyword: "",
						keyCode: "CPC-Province",
						lnkVal: "中国"
					}
					var paramsC = {
						keyword: "",
						keyCode: "CPC-City",
						lnkVal: this.curCity.province
					}
					this.getDict({
						onSuccess: function(res) {
							this.address.province = res.content.filter(ele => {
								return Object.is(ele.txt, this.curCity.province)
							})[0]
						}.bind(this),
						params: paramsP
					});
					//获取城市源数据
					this.getDict({
						onSuccess: function(res) {
							this.address.city = res.content.filter(ele => {
								return Object.is(ele.txt, this.curCity.city)
							})[0]
						}.bind(this),
						params: paramsC
					});
				}
			},
			choisecityGoBack() {
				if(!this.isshowcity) {
					this.isshowcity = true;
				} else {
					this.isShowPopup = false;
				}
			},
			// 打开选择地址的窗口
			// 0代表打开省份
			// 1代表打开城市
			choseAdress(type) {
				if(type == 'city' && !this.address.province.val) {
					iToast("请先选择省份");
					return false;
				}
				var params = {
					keyword: this.keyword,
					keyCode: type == "province" ? "CPC-Province" : "CPC-City",
					lnkVal: type == "province" ? "中国" : this.address.province.val
				}
				this.selectType = type;
				this.dataList = [];
				this.getCities(params);
				this.isshowcity = false;
			},
			// 选择地址
			choseAdressBtn(e, index, item) {
				if(this.selectType == "province") {
					this.address.province = item;
					this.address.city = {};
				} else {
					this.address.city = item;
				}
				this.dataList = [];
				item.select = true;
				this.keyword = "";
				this.isshowcity = true;
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	// @import "../../core/scss/variable.scss";
	@import "../../core/scss/mixin.scss";
	.header {
		height: 0.48rem;
	}
	
	.histaryList {
		padding: 0.1rem;
		color: #a4a4a4;
		span {
			background: #e2e2e2;
			padding: 0.05rem;
			color: #666;
			margin-top: 0.1rem;
			display: inline-block;
			margin-right: 0.1rem;
		}
	}
	
	.pyMain {
		background: #f5f5f5;
		padding: 0.1rem;
	}
	
	.navList {
		position: fixed;
		color: #666;
		right: 0;
		/*top: 1rem;*/
		font-size: 0.12rem;
		right: 0;
		top: 50%;
		transform: translate3d(0%, -50%, 0);
		a {
			color: #666;
			padding: .01rem;
			display: inline-block;
			padding-left: 0.5rem;
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
	
	.listBox {
		position: relative;
		height: 100%;
	}
	
	.choiceAdress {
		// margin-top: 0.48rem;
		overflow-y: auto;
		height: 100%;
		padding-bottom: 0.5rem;
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
		.weui-cell {
			padding: 0.15rem;
			font-size: 0.14rem;
			border-bottom: 1px solid #eee;
			background: #fff;
			overflow: hidden;
			.weui-cell__bd {
				width: 80%;
				float: left;
			}
		}
		.margin-top {
			margin-top: 0.2rem;
		}
	}
	
	.povinceListcontent {
		span {
			display: block;
			width: 20%;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			text-align: left;
			float: right;
		}
	}
	
	.popup_box {
		font-size: 0.14rem;
		width: 100% !important;
		height: 100% !important;
		box-sizing: border-box !important;
		background-color: #f2f2f2 !important;
		.search_module {
			margin-top: 0.44rem;
		}
		.content {
			padding-top: 0.1rem;
			.content_item {
				background-color: white;
				box-sizing: content-box;
				padding: 0.15rem 0.1rem;
				position: relative;
				.position_confirm {
					position: absolute;
					top: 0.1rem;
					right: 0.2rem;
				}
			}
			.border_bottom {
				border-bottom: 1px solid #eeeeee;
			}
		}
	}
	
	.povinceListcontent {
		overflow-y: auto;
		.orderListContent {
			position: fixed;
			background: #eee;
			width: 100%;
			top: 0.48rem;
			height: calc(100% - 0.48rem);
			// margin-top: 0.48rem;
		}
		.weui-cells {
			width: 100%;
			margin-top: 0;
		}
	}
	
	.serchmain {
		height: 0.3rem;
		width: 100%;
		background-color: #eee;
		margin: 0.04rem 0;
		border-radius: 5px;
		float: left;
		overflow: hidden;
		background: #fff;
		input {
			color: #666;
			font-size: 0.14rem;
			width: 80%;
			height: 0.3rem;
			border: none;
			padding-left: 0.1rem;
		}
		.serchIcon {
			float: right;
			font-size: 0.2rem;
			margin-right: 0.1rem;
			margin-top: 0.06rem;
		}
	}
</style>