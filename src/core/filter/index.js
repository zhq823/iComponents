// 被用作过滤器的函数在这里引入和导出
// 这里引入的都是独立的函数，因为这些函数当中有些可能不仅仅用于filter，还可以用于逻辑代码中使用，例如formatDate
import formatDate from './formatDate';
import currencyFormatter from './currencyFormatter';
import phoneNumberStar from './phoneNumberStar';
import tofixed from './tofixed';
import formatMoney from  './formatMoney.js';

export {
	formatDate,
	currencyFormatter,
	phoneNumberStar,
	tofixed,
	formatMoney
}