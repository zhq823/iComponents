export default {
	methods: {
		//打开其他站点
		openWebapp(item) {
			const uris = JSON.parse(this.$cookies.get('Uris')).Uris;
			this.setCookie();
			const router = item.router || '';
			const webappUrl = uris[item.webApp] + router;
			console.log(webappUrl);
			this.iJsBridge.openWebapp({
				loadUrl: webappUrl,
				callback: this.broadcast,
			});
		},
		setCookie() {
			const eventInfo = this.$store.state.common.eventInfo;
			// console.log(eventInfo);
			const eventData = {
				proposalId: eventInfo.proposalId, //会议ID  获取餐列表
				dtStart: eventInfo.dtStart, //外出用餐时间
				dtEnd: eventInfo.dtEnd, //
				typeDictTxt: eventInfo.typeDictVal,
				cityDictVal: eventInfo.cityDictVal,
				provinceDictVal: eventInfo.provinceDictVal,
				tenant_code: this.$cookies.get('tenant'),
				statusTxt: eventInfo.statusTxt
			}
			if(eventInfo.hasOwnProperty('itsExtData') && eventInfo.itsExtData.hasOwnProperty('hospitalId')) {
				eventData.hospitalId = eventInfo.itsExtData.hospitalId || null;
			}
			if(eventInfo.hasOwnProperty('extData') && JSON.parse(eventInfo.extData).hasOwnProperty('hospitalId')) {
				eventData.hospitalId = JSON.parse(eventInfo.extData).hospitalId || null;
			}
			if(eventInfo.hasOwnProperty("dtTypeTxt")) {
				eventData.dtTypeTxt = eventInfo.dtTypeTxt; // 会议时段
			}
			console.log(eventData);

			this.$cookies.setCookie("eventData", JSON.stringify(eventData), {
				domain: window.idomain
			});
		},
		//关闭站点回调
		broadcast() {
			//采用BUS广播好处，这样全局都能监听，无须在各个组件里面创建私有函数去监听
			this.$root.$eventHub.$emit("webAppBridgeListener"); //返回刷新
		}
	}
}