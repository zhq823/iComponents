###Welcome to use MarkDown

# 监听ajax请求

# 实现原理：
    1、创建一个继承于XMLHttpRequest的基类oldXHR；
    2、创建一个项目里实际使用的newXHR类，该类的constructor方法中返回的是一个oldXHR实例，方法里实现了对oldXHR实例的监听"loadstart"、"loadend"；
    3、基于"loadstart"、"loadend"两个监听方法，同步利用 "CustomEvent" 构造函数分别创建自定义事件 "ajaxLoadStart"、"ajaxLoadEnd"；
    4、修改window.XMLHttpRequest,将上述的newXHR类赋值给window.XMLHttpRequest，这样一来，项目里使用的window.XMLHttpRequest就是newXHR类，而newXHR类里面我们做了"loadstart"、"loadend"监听，这两个监听又能触发自定义监听"ajaxLoadStart"、"ajaxLoadEnd"，而且自定义监听针对的是window对象，而不是项目里的XHR对象，为什么这样做，是因为无法在插件里面得到你的XHR实例(除非在你的ajax调用处手动传入到插件，但这样做法太繁琐)，而且XHR实例也可以存在多个，所以在插件里无法做到对你的XHR实例进行监听，但是window对象只有一个，所以对window监听是最好的方法。

# 使用方法：
    main.js引入install即可
    import { iRecordHttpLog } from './core';
    iRecordHttpLog.install();
    
# 参数：
	origin: "IE" // 异常标识的组成部分，一般一个项目一个，例如ievent==IE、iCar==IC、iMeal==IM....以此类推
	num: 10

# 注意事项：
    1、必须保证iRecordHttpLog.install();在你的项目任何ajax请求之前被执行，否则ajax请求无法被监听到。
    2、保证你的项目支持ES6 class语法。
    3、不限于Vue之类的框架，都能使用。