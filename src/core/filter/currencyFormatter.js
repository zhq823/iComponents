/**
 * 格式化金额
 * @param {number} amount 金额
 * @param {string} [symbol] 货币符号
 * @param {number} [digits] 小数位数
 * @returns {string} 格式化后的数字，默认两位小数
 */
const currencyFormatter = function(amount, symbol = '元', digits = 2) {
	return `${Number(amount).toFixed(digits)}${symbol}`
}

export { currencyFormatter as default }