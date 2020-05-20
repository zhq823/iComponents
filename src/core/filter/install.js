//被用作过滤器的函数集合在这里引入和注册
import Vue from 'vue';
import {
	formatDate,
	currencyFormatter,
	phoneNumberStar,
	tofixed,
	formatMoney
} from './index.js';

Vue.filter("formatDate", formatDate);
Vue.filter("currencyFormatter", currencyFormatter);
Vue.filter("phoneNumberStar", phoneNumberStar);
Vue.filter("tofixed", tofixed);
Vue.filter("formatMoney", formatMoney);