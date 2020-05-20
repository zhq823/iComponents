export default class Iterator {

	constructor(options = {}) {
		const {
			data = [],
			rule = {
				label: "name",
				value: "name",
				children: "children"
			},
			children = "children"
		} = options;
		Object.assign(this, {
			data,
			rule,
			children
		})
	}

	get(data = this.data) {
		return data.map(ele => {
			let item = {}
			for(var key in this.rule) {
				item[key] = ele[this.rule[key]]
			}
			if(item[this.children]) {
				item[this.children] = this.get(item[this.children])
			}
			return item
		});
	}

	get2(data = this.data) {
		return data.map(ele => {
			for(var key in this.rule) {
				ele[key] = ele[this.rule[key]]
			}
			if(ele[this.children]) {
				this.get2(ele[this.children]);
			}
			return ele;
		});
	}
	
	get3(data = this.data) {
		var result = [];
		data.map(ele => {
			let {
				name: label,
				name: value,
				children
			} = ele
			if(children) {
				children = this.get3(children)
			}
			result.push({
				label,
				value,
				children
			})
		})
		return result;
	}

}