<template>
	<section>
		<div class="search_container">
			<span class="search_btn" @click="search()"><i slot="search" class="iconfont icon-search"></i></span>
			<input v-model="keyword" type="search" class="search_input" :class="{'search_input_more': moreBtn}" :placeholder="placeholder" />
			<transition name="searchicon">
				<span v-if="keyword" class="search_delete_btn" :class="{'search_delete_btn_more': moreBtn}" @click="resetKeyword()">
					<i slot="search" class="iconfont icon-close"></i>
				</span>
			</transition>
			<div class="search_more">
				<p class="search_more_box" @click="selectMore()">
					<span class="search_more_delete_box" v-if="selectInfo" @click.stop="deleteSearchMore($event)">
						<i slot="search" class="iconfont icon-close"></i>
					</span>
					<span class="search_val" v-if="selectInfo">{{ selectInfo }}</span>
					<span class="search_val more_placeholder" v-if="!selectInfo">请选择医院</span>
					<span class="next_small_box">
						<i class="next_small"></i>
					</span>
				</p>
			</div>
		</div>
	</section>
</template>

<script>
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
				default: '请输入'
			},
			moreBtn: {
				type: Boolean,
				default: false
			},
			selectMore: {
				type: Function,
				default: function() { }
			},
			selectInfo: {
				type: String,
				default: ''
			}
		},
		watch: {
			_keyword() {
				this.keyword = this._keyword;
			},
			keyword() {
				this.$emit("keywordListener", this.keyword);
				this.searchIconAnimatin();
			}
		},
		data() {
			return {
				keyword: '',
				rotateZ: 0
			}
		},
		created() {
			if(this.$router.history.current.path == '/AddAttendee' && this.$store.state.hospitalForm.keyword) {
				this.keyword = this.$store.state.hospitalForm.keyword.replace(/\s/g, "");
			}
		},
		methods: {
			searchIconAnimatin() {
				setTimeout(() => {
					this.rotateZ = 180;
					let searchIcon = document.getElementsByClassName('icon-close')[0];
					searchIcon.style.transition = 'transform 0.4s ease-out';
					searchIcon.style.transform = 'rotateZ(' + this.rotateZ + 'deg)';
					this.rotateZ = 0;
				}, 100);
			},
			resetKeyword() {
				this.keyword = '';
				this.$emit('search', '');
			},
			deleteSearchMore() {
				this.selectInfo = '';
				this.$emit('search')
			},
			search() {
				this.$emit("search", this.keyword);
			},
		}
	}
</script>

<style scoped="scoped">
	.search_container {
		width: 100%;
		height: .52rem;
		line-height: .52rem;
		text-align: center;
		background-color: white;
		position: relative;
	}
	
	.search_input {
		position: absolute;
		/*right: 2.8%;*/
		left: 3%;
		top: 0.07rem;
		width: 94%;
		height: .38rem;
		display: inline-block;
		border-radius: 0.07rem;
		border: none;
		background-color: #F4F4F4;
		padding-left: .44rem;
		padding-right: .35rem;
		color: #666666;
		outline: none;
		font-size: 0.14rem;
		z-index: 30;
	}
	
	.search_input_more {
		width: 40%;
	}
	
	.search_input:focus {
		border: .01rem solid #4C9AFF;
	}
	
	.search_btn {
		position: absolute;
		box-sizing: border-box;
		top: 0rem;
		left: 3%;
		width: .4rem;
		height: .52rem;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 50;
	}
	
	.search_delete_btn {
		position: absolute;
		box-sizing: border-box;
		top: 0rem;
		left: calc(97% - 0.35rem);
		width: .35rem;
		height: .52rem;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 50;
	}
	
	.search_delete_btn_more {
		left: calc(43% - 0.35rem);
	}
	/*TODO*/
	
	.search_more {
		position: absolute;
		box-sizing: border-box;
		top: 0rem;
		right: 3%;
		width: 50%;
		height: 0.52rem;
		line-height: 0.52rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.search_more_box {
		width: 100%;
		height: 0.35rem;
		line-height: 0.35rem;
		background-color: #F4F4F4;
		border-radius: 0.03rem;
		position: relative;
	}
	
	.search_val {
		position: absolute;
		width: calc(100% - 0.6rem);
		height: 0.35rem;
		top: 0;
		right: 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}
	
	.more_placeholder {
		color: #B2B2B2;
	}
	
	.search_more_delete_box {
		position: absolute;
		height: 0.35rem;
		width: 0.35rem;
		left: 0rem;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.next_small_box {
		position: absolute;
		top: 0;
		right: 0;
		width: 0.25rem;
		height: 0.35rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.search_input::-webkit-input-placeholder {
		color: #999999;
		font-size: .14rem;
		line-height: 1em;
		padding-left: .1rem;
		text-align: left;
	}
	
	.search_input:-moz-placeholder {
		color: #999999;
		font-size: .14rem;
		line-height: 1em;
		padding-left: .1rem;
		text-align: left;
	}
	
	.search_input::-moz-placeholder {
		color: #999999;
		font-size: .14rem;
		padding-left: .1rem;
		text-align: left;
		line-height: 1em;
	}
	
	.search_input:-ms-input-placeholder {
		color: #999999;
		font-size: .14rem;
		line-height: 1em;
		padding-left: .1rem;
		text-align: left;
	}
	
	.searchicon-enter-active {
		animation: searchicon-show 0.25s;
	}
	
	.searchicon-leave-active {
		animation: searchicon-hide 0.15s;
	}
	
	@keyframes searchicon-show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@keyframes searchicon-hide {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>