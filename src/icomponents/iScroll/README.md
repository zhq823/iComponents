# v1.0 author | haiqiang.Zheng | 2018.07.31
# v2.0 author | haiqiang.Zheng | 2018.09.20 
# < v1.0~v2.0改动说明:
	1、v1.0采用margin方式控制scroll容器在屏幕中位置;该方式不便控制滑动容器位置,其他用户第一次使用可能理解起来不方便
		v2.0采用position:fixed;固定定位，使用只需传入scroll容器距离屏幕上下距离即可(考虑到顶、底部导航存在的可能)，然后
		iEvent-scroll 会去计算容器高度并固定其位置。
	2、去除了上一版本依赖rem.js的一些LoadMore.css样式表中一些rem单位,其他webapp项目也可以拿来即用
  >

☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆   iEventScroll参数说明   ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆

☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆    props参数  ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
# allLoaded | 是否启用上拉方法。启用（false）   禁用（true）
# topHeight | 滑动区域距离屏幕头部的距离。通常有导航搜索块需要计算此高度，并将此值传入scroll组件
# bottomHeight | 滑动区域距离屏幕底部的距离。通常有底部导航块需要计算此高度，并将此值传入scroll组件
# pageIndex | 页码。上拉下拉需要重置或者自增此值
# pageSize | 分页请求数量。可以不传入组件，一般scroll组件不需要此值
# dataList | 请求的数组。scroll组件需要此值，并由此判断是否加载完所有数据
# loadData | 请求后台的外层方法。在上下拉时需要调用

☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆    data参数   ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
# wrapperHeight | loadMore最外层标签壳子的高度。此值需要动态计算设备高度，也是滑动区域的高度
# listBoxHeight | loadMore最外层标签壳子的最小高度。当返回值数组不能铺满整个设备屏幕时，需要设定最小高度，使滑动区域铺满屏
# bottomStatus | 下拉的变化状态值。
# topStatus | 上拉的变化状态值。

☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆    methods方法   ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
# <ievent-scroll ref="scrollWrapper"></ievent-scroll> 父组件请求完数据调用 this.$refs.scrollWrapper.scrollListener();重置上下拉状态
# 参考iEventScroll各个方法备注说明。

☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆    其他说明   ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
# iEventScroll组件封装于mintUI的loadMore组件，解决其不友好的问题：
1、滑动区域高度不好控制的问题
2、滑动事件的奇奇怪怪的问题等
3、iEventScroll基本能满足开箱即用。

