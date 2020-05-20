<template>
	<section>
		<header class="container">
			<div v-if="hasLeft" @click="clickLeft()" class="iHeader_left">
				<slot name="left"></slot>
			</div>
			<div class="header_search" :style="style">
				<div class="event_header_container_left_div">
					<span class="search_btn" @click="search()">
                        <i slot="search" class="iconfont icon-search"></i>
                   	</span>
					<input type="search" class="search_input" :placeholder="placeholder" v-model="keyword">
					<span v-if="keyword">
                        <span class="search_delete_btn" @click="resetSearch()">
                            <i slot="search" class="iconfont icon-close"></i>
                        </span>
					</span>
				</div>
			</div>
			<div v-if="hasRight" @click="clickRight()" class="iHeader_right">
				<slot name="right"></slot>
			</div>
		</header>
	</section>
</template>

<script>
	/*
	 带有搜索框的头部
	 * */
	export default {
		model: {
			prop: '_keyword',
			event: "keywordListener"
		},
		props: {
			_keyword: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: "请输入关键词搜索"
			},
			hasLeft: {
				type: Boolean,
				default: false
			},
			hasRight: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			style() {
				let count = 0;
				this.hasLeft ? count : count++;
				this.hasRight ? count : count++;
				//${0.44*count}rem
				return {
					width: `calc(100% - ${this.leftBtnWidth + this.rightBtnWidth}px)`,
					'padding-left': this.hasLeft ? '0rem' : '0.15rem',
					'padding-right': this.hasRight ? '0rem' : '0.2rem',
					left: `${this.leftBtnWidth}px`
				}
			}
		},
		watch: {
			_keyword() {
				this.keyword = this._keyword;
			},
			keyword() {
				this.$emit("keywordListener", this.keyword);
			}
		},
		data() {
			return {
				keyword: "",
				leftBtnWidth: 0,
				rightBtnWidth: 0
			}
		},
		created() {
			this.getBtnOffsetWidth();
		},
		methods: {
			getBtnOffsetWidth(){
				this.$nextTick(() => {
					setTimeout(() => {
						const leftBtn = document.getElementsByClassName("iHeader_left")[0];
						const rightBtn =  document.getElementsByClassName("iHeader_right")[0];
						if(leftBtn) {
							this.leftBtnWidth = leftBtn.clientWidth;
						}
						if(rightBtn) {
							this.rightBtnWidth = rightBtn.offsetWidth;
						}
					},5)
				})
			},
			clickLeft(){
				this.$emit('clickLeft')
			},
			clickRight() {
				this.$emit('clickRight')
			},
			search() {
				this.$emit("search", this.keyword);
			},
			resetSearch(){
				this.keyword = "";
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	@import '../../core/scss/mixin.scss';
	.container {
		height: .44rem;
		width: 100%;
		position: relative;
		@include backgroundColor();
		.iHeader_left {
			position: absolute;
			top: 0px;
			left: 0px;
			height: 0.44rem;
			padding: 0px 0.1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			.iconfont {
				color: white;
			}
		}
		.header_search {
			position: absolute;
			top: 0px;
			left: 0px;
			width: calc(100% - 0.88rem);
			height: .44rem;
			line-height: .44rem;
			text-align: center;
			.event_header_container_left_div {
				position: relative;
				height: .44rem;
				line-height: .44rem;
				input[type="search"] {
					-webkit-appearance: none;
				}
				input::-webkit-search-cancel-button {
					display: none;
				}
				.search_input::-webkit-input-placeholder {
					color: rgba($color: white, $alpha: .6);
					text-align: left !important;
				}
				.search_input:-moz-placeholder {
					color: rgba($color: white, $alpha: .6);
					text-align: left !important;
				}
				.search_input::-moz-placeholder {
					color: rgba($color: white, $alpha: .6);
					text-align: left !important;
				}
				.search_input:-ms-input-placeholder {
					color: rgba($color: white, $alpha: .6);
					text-align: left !important;
				}
				.search_btn {
					position: absolute;
					box-sizing: border-box;
					top: 0rem;
					left: 0rem;
					width: .4rem;
					height: .44rem;
					display: flex;
					justify-content: center;
					align-items: center;
					.iconfont {
						color: white;
						font-size: .2rem;
					}
				}
				.search_input {
					display: inline-block;
					width: 100%;
					height: .3rem;
					border-radius: .08rem;
					border: none;
					background-color: rgba($color: white, $alpha: .2);
					padding-left: 0.4rem;
					padding-right: 0.35rem;
					color: white;
					outline: none;
					font-size: 0.14rem;
					&::-webkit-input-placeholder {
						padding-left: 0.05rem !important;
					}
					&:-moz-placeholder {
						padding-left: 0.05rem !important;
					}
					&::-moz-placeholder {
						padding-left: 0.05rem !important;
					}
					&:-ms-input-placeholder {
						padding-left: 0.05rem !important;
					}
				}
				.search_delete_btn {
					position: absolute;
					box-sizing: border-box;
					top: 0rem;
					right: 0rem;
					width: .42rem;
					height: .42rem;
					display: flex;
					justify-content: center;
					align-items: center;
					.iconfont {
						color: white;
					}
				}
			}
		}
		.iHeader_right {
			color: white;
			position: absolute;
			top: 0px;
			right: 0px;
			box-sizing: border-box;
			padding: 0px 0.1rem;
			height: 0.44rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>

<style>
	.iHeader_right .iconfont {
		color: white;
		font-size: .24rem;
	}
</style>