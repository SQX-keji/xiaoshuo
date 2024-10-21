<template>
	<view>

		<u-sticky :customNavHeight="0">
			<view class="search flex align-center justify-center">
				<view class="search-box">
					<u-search :focus="focuss" placeholder="请输入书籍名称" @clear="getList()" @custom="getList()"
						@search="getList()" v-model="title"></u-search>
				</view>
			</view>
		</u-sticky>
		<view @click="gotoNav('/package/bookDetails/bookDetails?courseId='+item.courseId)"
			class="list flex align-center justify-center" v-for="(item,index) in list" :key="index">
			<view class="list-box flex align-center justify-between">
				<view class="list-box-left">
					<image :src="item.titleImg" mode=""></image>
				</view>
				<view class="list-box-right">
					<view class="list-box-right-title flex align-center justify-between">
						<view class="list-box-right-title-title">
							{{item.title}}
						</view>
						<view class="list-box-right-title-score">
							{{item.source?item.source:10}}分
						</view>
					</view>
					<view class="list-box-right-js">
						{{item.details}}
					</view>
					<view class="list-box-right-js">
						{{item.author}} ·
						{{item.courseClassification?item.courseClassification.classificationName:'默认'}} ·
						{{mathNum(item.fontNum)}}{{item.fontNum>=10000?'万字':'字'}}
					</view>
				</view>
			</view>
		</view>
		<empty v-if="list.length == 0" />
		<u-loadmore v-if="list.length > 0" :status="status" />
	</view>
</template>

<script>
	import empty from '../../components/empty/empty.vue'
	export default {
		components: {
			empty
		},
		data() {
			return {
				sort: 1,
				page: 1,
				limit: 10,
				pages: 1,
				list: [],
				status: 'loadmore',
				title: '',
				focuss: false, //是否自动获取焦点
			};
		},
		onLoad(option) {
			if (option.sort) {
				this.sort = option.sort
				this.setTitle(Number(option.sort))
			} else {
				uni.setNavigationBarTitle({
					title: '搜索'
				})
				this.focuss = true
			}


			this.getList()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getList()
		},
		onReachBottom() {
			if (this.page < this.pages) {
				this.page += 1
				this.status = 'loading'
				this.getList()
			} else {
				this.status = 'nomore'
			}
		},
		methods: {
			gotoNav(url) {
				if (uni.getStorageSync('token')) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			//计算
			mathNum(num) {
				let mathNUms = 0
				if (num) {
					if (Number(num) >= 10000) {
						mathNUms = (Number(num) / 10000).toFixed(2)
					} else {
						mathNUms = num
					}
				}
				return mathNUms
			},
			//设置页面标题
			setTitle(sort) {
				switch (sort) {
					case 1:
						uni.setNavigationBarTitle({
							title: '热门推荐'
						})
						break;
					case 2:
						uni.setNavigationBarTitle({
							title: '最新推荐'
						})
						break;
					case 2:
						uni.setNavigationBarTitle({
							title: '完结榜单'
						})
						break;
					default:
						break;
				}
			},
			getList() {
				let data = {
					limit: this.limit,
					page: this.page,
					sort: this.sort,
					title: this.title
				}
				this.$Request.getT('/app/course/selectCourse', data).then(res => {
					uni.stopPullDownRefresh()
					if (res.code == 0) {
						this.pages = res.data.totalPage
						if (this.page < this.pages) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
						res.data.list.map(item => {
							if (item.viewCounts >= 10000) {
								item.viewCounts = ((item.viewCounts / 10000).toFixed(2)) + 'w'
							}
						})
						if (this.page == 1) {
							this.list = res.data.list
						} else {
							this.list = [...this.list, ...res.data.list]
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.search {
		width: 100%;
		height: auto;
		background-color: #ffffff;
		padding: 20rpx 0;

		.search-box {
			width: 686rpx;
			height: 100%;

		}
	}

	.list {
		width: 100%;
		height: auto;
		margin-top: 20rpx;

		.list-box {
			width: 686rpx;
			height: 100%;
			border-radius: 28rpx;
			background-color: #ffffff;
			padding: 30rpx;
		}

		.list-box-left {
			width: 170rpx;
			height: 250rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 14rpx;
			}
		}

		.list-box-right {
			width: calc(100% - 20rpx - 170rpx);
			height: 100%;

			.list-box-right-title-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}

			.list-box-right-title-score {
				color: #FF6730;
			}

			.list-box-right-js {
				margin-top: 20rpx;
				width: 100%;
				color: #999999;
				font-size: 26rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 3;
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}
		}
	}
</style>