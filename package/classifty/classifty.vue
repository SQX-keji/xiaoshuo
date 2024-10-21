<template>
	<view>
		<view class="tabs flex align-center justify-center">
			<view class="tabs-box flex">
				<view @click="selectType(item.id)" :class="current == item.id?'active':''"
					class="tabs-box-item flex align-center" v-for="(item,index) in typeList" :key="index">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="content flex">
			<view class="content-left flex align-center justify-center">
				<view class="content-left-box">
					<scroll-view scroll-y="true" class="content-lefts">
						<view @click="selectCLassifty(index)" :class="classiftyCurr == index?'classAcitve':''"
							class="content-lefts-item" v-for="(item,index) in classiftyList" :key="index">
							{{item.classification_name}}
						</view>
					</scroll-view>
				</view>

			</view>
			<view class="content-right flex align-center justify-center">
				<view class="content-rights">
					<scroll-view @scrolltolower="scrolltolowers" scroll-y="true" class="content-rightss">
						<view @click="gotoRead(item)" class="content-rightss-item flex align-center justify-between"
							v-for="(item,index) in bookList" :key="index">
							<view class="content-rightss-item-l">
								<image :src="item.titleImg" mode="aspectFill"></image>
							</view>
							<view class="content-rightss-item-r">
								<view class="content-rightss-item-r-title content-rightss-item-rs">
									{{item.title}}
								</view>
								<view class="content-rightss-item-r-details content-rightss-item-rs">
									{{item.details}}
								</view>
								<view class="content-rightss-item-r-rate flex align-center content-rightss-item-rs">
									{{item.source}}分
									<text>
										{{item.viewCounts}}人在读
									</text>
								</view>
								<view
									class="content-rightss-item-r-btn content-rightss-item-rs flex align-center justify-end">
									<view @click="addMyBook(item.courseId)" v-if="item.isCollect != 1"
										class="content-rightss-item-r-btns flex align-center justify-center">
										加入书架
									</view>
									<view v-else
										class="content-rightss-item-r-btns content-rightss-item-r-btnss flex align-center justify-center">
										已在书架
									</view>
								</view>
							</view>

						</view>
						<u-loadmore v-if="bookList.length > 0" :status="status" />
						<empty v-if="bookList.length == 0" />
					</scroll-view>
				</view>
			</view>
		</view>
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
				status: 'loadmore',
				current: 1,
				typeList: [{
					name: '男生',
					id: 1
				}, {
					name: '女生',
					id: 2
				}],
				classiftyList: [],
				classiftyCurr: 0,
				limit: 10,
				page: 1,
				pages: 1,
				bookList: []
			};
		},
		onShow() {
			this.getClassIftyList()
		},
		methods: {
			//加入书架
			addMyBook(courseId) {
				let data = {
					courseId: courseId,
					courseDetailsId: courseId,
					classify: 1,
					type: 1
				}
				this.$Request.postJson('/app/courseCollect/insertCourseCollect', data).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '已加入书架'
						})
						this.getBookList()
					}
				})
			},
			//去阅读
			gotoRead(item) {
				if (uni.getStorageSync('token')) {
					uni.navigateTo({
						url: '/package/bookDetails/bookDetails?courseId=' + item.courseId
					})
					// if (item.coursePage) {
					// 	uni.navigateTo({
					// 		url: '/package/read/read?courseId=' + item.courseId + '&page=' + item
					// 			.coursePage
					// 	})
					// } else {
					// 	uni.navigateTo({
					// 		url: '/package/read/read?courseId=' + item.courseId
					// 	})
					// }
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}


			},
			//加载更多
			scrolltolowers() {
				if (this.page < this.pages) {
					this.page += 1
					this.status = 'loading'
					this.getBookList()
				}
			},
			//获取书籍
			getBookList() {
				let data = {
					limit: this.limit,
					page: this.page,
					classifyId: this.classiftyList[this.classiftyCurr].classification_id,
				}
				this.$Request.getT('/app/course/selectCourse', data).then(res => {
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
							this.bookList = res.data.list
						} else {
							this.bookList = [...this.bookList, ...res.data.list]
						}
					}
				})
			},
			//根据分类获取书籍
			selectCLassifty(index) {
				if (index !== this.classiftyCurr) {
					this.classiftyCurr = index
					this.page = 1
					this.getBookList()
				}
			},
			//根据type获取分类
			getClassIftyList() {
				let data = {
					classifyType: this.current
				}
				this.$Request.getT('/app/courseClassification/selectClassification', data).then(res => {
					if (res.code == 0) {
						this.classiftyList = res.data
						this.getBookList()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//切换类型
			selectType(id) {
				this.current = id
				this.classiftyCurr = 0
				this.getClassIftyList()
			},
		}
	}
</script>

<style lang="scss">
	.active {
		color: #333333 !important;
		font-size: 32rpx !important;
	}

	.tabs {
		width: 100%;
		height: 94rpx;

		.tabs-box {
			width: 686rpx;
			height: 100%;
			padding-left: 10rpx;
		}

		.tabs-box-item {
			color: #999999;
			font-size: 28rpx;
			font-weight: bold;
			margin-right: 54rpx;
		}
	}

	.classAcitve {
		color: #FE7085 !important;
		font-size: 32rpx !important;
		font-weight: bold;
	}

	.content {
		width: 100%;
		height: calc(100vh - 94rpx);

		.content-left {
			width: calc(100% - 606rpx);
			height: 100%;

		}

		.content-left-box {
			width: 100rpx;
			height: 100%;
		}

		.content-lefts {
			width: 100%;
			height: 100%;

			.content-lefts-item:nth-of-type(1) {
				margin-top: 30rpx;
			}

			.content-lefts-item {
				width: 100%;
				margin-top: 60rpx;
				text-align: center;
				color: #333333;
				font-size: 28rpx;
				font-weight: 500;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

			}
		}

		.content-right {
			width: 606rpx;
			height: 100%;
			background-color: #ffffff;
			border-radius: 24rpx 0rpx 0rpx 0rpx;

			.content-rights {
				width: calc(100% - 60rpx);
				height: calc(100% - 80rpx);
			}

			.content-rightss {
				width: 100%;
				height: 100%;
			}

			.content-rightss-item {
				width: 100%;
				height: 180rpx;
				margin-bottom: 35rpx;
			}

			.content-rightss-item-l {
				width: 130rpx;
				height: 180rpx;

				image {
					width: 100%;
					height: 180rpx;
					border-radius: 18rpx;
				}
			}

			.content-rightss-item-r {
				width: calc(100% - 20rpx - 130rpx);
				height: 100%;
			}

			.content-rightss-item-rs {
				width: 100%;
			}

			.content-rightss-item-r-title {
				color: #1A1A1A;
				font-size: 32rpx;
				font-weight: bold;
			}

			.content-rightss-item-r-details {
				color: #999999;
				font-size: 26rpx;
				font-weight: 500;
				margin-top: 10rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

			}

			.content-rightss-item-r-rate {
				margin-top: 10rpx;
				color: #FF6730;
				font-size: 26rpx;
				font-weight: bold;

				text {
					color: #999999;
					font-size: 24rpx;
					font-weight: 500;
					margin-left: 16rpx;
				}
			}

			.content-rightss-item-r-btns {
				width: 158rpx;
				height: 58rpx;
				background: #FEEFE8;
				border-radius: 29rpx;
				font-size: 26rpx;
				font-weight: bold;
				color: #F3765A;

			}

			.content-rightss-item-r-btnss {
				background-color: #F0F0F0 !important;
				color: #666666 !important;
			}
		}
	}
</style>