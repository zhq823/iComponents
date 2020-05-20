import Vue from 'vue';

const androidBackBridge = {
	created() {
		if(!window.webkit && window.SMGeneral) {
			window.SMGeneral.setBackPressEnable(true);
			window.SMGeneral.setOnBackBressedListener("callBack");
		}
		window['callBack'] = () => {
			this.nativeBackJsBridge();
		}
	},
	methods: {
		nativeBackJsBridge() {
			let routeListeners = this.iStorage.get('routeListeners');
			if(routeListeners.length > 0) {
				var key = routeListeners.pop();
				switch(key){
					case 'closeMintUIMessageBox':
						this.closeMintUIMessageBox();
						break;
					case 'closeVuxDatetime':
						this.closeVuxDatetime();
						break;
					case 'closeMintUIDatetimePicker':
						this.closeMintUIDatetimePicker();
						break;
					default:
						this.$root.$eventHub.$emit(key);
				}
			}
		},
		//保存当前路由返回事件记录
		setRouteListeners(backMethod) {
			let routeListeners = this.iStorage.get('routeListeners') || [];
			if(routeListeners && routeListeners.indexOf(backMethod) == -1) {
				routeListeners.push(backMethod);
			}
			this.iStorage.set('routeListeners', routeListeners);
		},
		//返回上一页删除当前退回记录
		removeRouteListeners(backMethod) {
			let routeListeners = this.iStorage.get('routeListeners') || [];
			routeListeners = routeListeners.filter((ele) => {
				return ele != backMethod
			});
			this.iStorage.set('routeListeners', routeListeners);
		},
		//安卓返回键，关闭mintUI <MessageBox>
		closeMintUIMessageBox() {
			setTimeout(() => {
				if(document.getElementsByClassName('mint-msgbox-cancel')) {
					document.getElementsByClassName('mint-msgbox-cancel')[0].click();
					this.removeRouteListeners('closeMintUIMessageBox');
				} else {
					this.removeRouteListeners('closeMintUIMessageBox');
				}
			})
		},
		//安卓返回键，关闭mintUI <mt-datetime-picker>
		closeMintUIDatetimePicker() {
			setTimeout(() => {
				if(document.getElementsByClassName('mint-datetime-cancel')) {
					document.getElementsByClassName('mint-datetime-cancel')[0].click();
					this.removeRouteListeners('closeMintUIDatetimePicker');
				} else {
					this.removeRouteListeners('closeMintUIDatetimePicker');
				}
			})
		},
		//安卓返回键，关闭Vux <datePicker>
		closeVuxDatetime() {
			setTimeout(() => {
				if([...document.getElementsByClassName('vux-datetime-cancel')].length > 0) {
					document.getElementsByClassName('vux-datetime-cancel')[0].click();
				}
			})
		}
	}
}

Vue.mixin(androidBackBridge)

export default androidBackBridge;