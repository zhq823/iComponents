//节流函数(控制输入搜索时间间隔，超过ms毫秒没有输入就进行搜索，否则不搜索)
const iDelay = (function() {
	let timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();

export default iDelay

//原理：利用了闭包结构，内部函数引用作用外的变量不会释放其内存(我的理解就是这个变量一直存在)，这导致每次执行iDelay函数，都会产生一个对timer引用
//setTimeout每次调用都会产生唯一id，在内部函数里面又将setTimeout赋值给了变量timer，
//那么最终每次调用iDelay，都会产生一个不一样的timer变量
//但是callback想要执行必须满足过了ms秒后，否则都会被clearTimeout清除上一个timer