/**
 * 数值取小数点后n位
 * @param {*number} number 待处理数值
 * @param {*number} init 保留位数
 */
const tofixed = function(number, init = 2) {
	return `${Number(number).toFixed(init)}`
}

export { tofixed as default }