<template>
	<view style="padding-bottom: 40rpx;">
		<!-- 签到 -->
		<view class="qd flex align-center justify-center">
			<view class="qd-box flex align-center justify-center">
				<view class="qd-boxs">
					<view class="qd-boxs-title flex align-center justify-between">
						<view class="qd-boxs-title-l">
							<view class="qd-boxs-title-lt flex">
								你已连续签到
								<text>{{day}}</text>
								天
							</view>
							<view class="qd-boxs-title-lb">
								签到领积分,连续签到7天领惊喜礼包
							</view>
						</view>
						<view v-if="isQd" class="qd-boxs-title-r flex align-center justify-center">
							今日已签到
						</view>
						<view v-else @click="signIn()" class="qd-boxs-title-r flex align-center justify-center">
							立即签到
						</view>
					</view>
					<view class="qd-boxs-hb flex align-center justify-between">
						<image :style="Number(day)>=(index+1)?'width:60rpx;height:78rpx':''"
							:src="Number(day)>=(index+1)?'../../static/image/hb_k.png':'../../static/image/hb.png'"
							v-for="(item,index) in hbList" :key="index" mode="aspectFill"></image>
					</view>
					<view class="qd-boxs-line flex align-center">
						<view class="qd-boxs-line-item flex align-center" v-for="(item,index) in hbList" :key="index">
							<view :style="Number(day)>=(index+1)?'width:8rpx;height:8rpx;background:#FF415B':''"
								class="qd-boxs-line-item-dian"></view>
							<view :style="Number(day)>=(index+1)?'border-color:#FF415B':''" v-if="index<6"
								class="qd-boxs-line-item-xian"></view>
						</view>
					</view>
					<view class="qd-boxs-tian flex align-center justify-between">
						<view class="qd-boxs-tian-item" v-for="(item,index) in hbList">
							<view class="qd-boxs-tian-iteml" v-if="Number(day)>=(index+1)">
								已领取
							</view>
							<block v-else>
								{{index+1}}天
							</block>

						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<!-- 书架/历史 -->
		<view class="myBook flex align-center justify-center">
			<view class="myBook-box">
				<!-- #ifdef H5 -->
				<u-sticky bgColor="#ffffff" offsetTop="0px" customNavHeight="0">
				<!-- #endif -->
					<!-- #ifndef H5 -->
					<u-sticky bgColor="#ffffff">
					<!-- #endif -->
						<view class="myBook-box-tabs flex">
							<view @click="selectCurrent(index)" :class="current == index?'active':''"
								class="myBook-box-tabs-i" v-for="(item,index) in tabs" :key="index">
								{{item}}
							</view>
						</view>
					</u-sticky>
					<!-- 书架 -->
					<view v-if="current==0" class="myBook-box-list flex align-center justify-between flex-wrap">
						<view @click="gotoRead(item)" class="myBook-box-list-item" v-for="(item,index) in myBookList"
							:key="index">
							<view class="myBook-box-list-item-img">
								<image :src="item.titleImg" mode="aspectFill"></image>
							</view>
							<view class="myBook-box-list-item-title">
								{{item.title}}
							</view>
							<view class="myBook-box-list-item-jd">
								已读：{{setNUmJd(item.coursePage,item.courseDetailsCount)}}
							</view>
						</view>
						<view class="myBook-box-list-item" style="height: 0;">

						</view>
					</view>
					<!-- 历史记录 -->
					<view v-if="current == 1" class="myBook-box-his">
						<view @click="gotoRead(item)" class="myBook-box-his-item flex justify-between"
							v-for="(item,index) in myBookLists" :key="index">
							<view class="myBook-box-his-item-l flex align-center">
								<image :src="item.titleImg" mode=""></image>
								<view class="myBook-box-his-item-l-info">
									<view class="myBook-box-his-item-l-info-t">
										{{item.title}}
									</view>
									<view class="myBook-box-his-item-l-info-j">
										阅读到：第{{item.coursePage}}章
									</view>
								</view>
							</view>
							<view @click="addMyBook(item.courseId)" v-if="item.isCollect != 1"
								class="myBook-box-his-item-l-r flex align-center justify-center">
								加入书架
							</view>
							<view v-else class="myBook-box-his-item-l-rs flex align-center justify-center">
								已在书架
							</view>
						</view>
					</view>
					<empty v-if="myBookList.length == 0" style="margin-bottom: 100rpx;" />

			</view>
		</view>

		<u-loadmore v-if="myBookList.length>0" :status="status" />
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
				hbList: new Array(7),
				day: 0,
				isErQd: false, //昨天是否签到
				isQd: false, //今日是否已签到
				tabs: ['书架', '历史'],
				current: 0,
				myBookList: [],
				myBookLists: [],
				page: 1,
				pages: 1,
				limit: 10,
				type: 1,
				status: 'loadmore',
			};
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.myQianInfo()
				if (uni.getStorageSync('history')) {
					this.current = 1
					this.type = 3
				} else {
					this.current = 0
					this.type = 1
				}
				this.getMyBookList()
			}
		},
		onHide() {
			uni.removeStorageSync('history')
		},
		onPullDownRefresh() {
			this.page = 1
			if (this.current == 0) { //书架
				this.type = 1
			} else {
				this.type = 3
			}
			this.getMyBookList()
		},
		onReachBottom() {
			if (this.page < this.pages) {
				this.page += 1
				this.status = 'loding'
				if (this.current == 0) { //书架
					this.type = 1
				} else {
					this.type = 3
				}
				this.getMyBookList()
			} else {
				this.status = 'nomore'
			}

		},
		methods: {
			//去阅读
			gotoRead(item) {
				if (item.coursePage) {
					uni.navigateTo({
						url: '/package/read/read?courseId=' + item.courseId + '&page=' + item
							.coursePage
					})
				} else {
					uni.navigateTo({
						url: '/package/read/read?courseId=' + item.courseId
					})
				}

			},
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
						this.getMyBookList()
					}
				})
			},
			//计算进度
			setNUmJd(num1, num2) {
				return (Number(num1) / Number(num2) * 100).toFixed(2) + '%'
			},
			//获取我的书架列表
			getMyBookList() {
				let data = {
					page: this.page,
					limit: this.limit,
					classify: this.type, //1收藏 2点赞 3历史记录
				}
				this.$Request.getT('/app/courseCollect/selectByUserId', data).then(res => {
					uni.stopPullDownRefresh()
					if (res.code == 0) {
						this.pages = res.data.pages
						if (this.page < this.pages) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
						if (this.type == 3) {
							if (this.page == 1) {
								this.myBookLists = res.data.records
							} else {
								this.myBookLists = [...this.myBookLists, ...res.data.records]
							}
						} else {
							if (this.page == 1) {
								this.myBookList = res.data.records
							} else {
								this.myBookList = [...this.myBookList, ...res.data.records]
							}
						}



					}
				})
			},
			//切换分类
			selectCurrent(index) {
				this.current = index
				this.page = 1
				if (index == 0) {
					this.type = 1
				} else {
					this.type = 3
				}
				this.getMyBookList()
			},
			//签到
			signIn() {
				if (uni.getStorageSync('token')) {
					this.$Request.getT('/app/integral/signIn').then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '今日已签到'
							})
							this.myQianInfo()
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}

			},
			//获取签到信息
			myQianInfo() {
				let data = {
					userId: uni.getStorageSync('userId')
				}
				this.$Request.getT('/app/integral/selectIntegralDay', data).then(res => {
					if (res.code == 0) {
						if (res.data.nowIntegral) { //判断今天是否签到
							this.day = res.data.nowIntegral.day
							this.isQd = true
						}
						if (res.data.yesterdayIntegral) { //判断昨天是否签到
							if (!this.day) {
								this.day = res.data.yesterdayIntegral.day
							}
							this.isErQd = true
						}
						if (res.data.nowIntegral == null && res.data.yesterdayIntegral == null) {
							this.day = 0
							this.isQd = false
							this.isErQd = false
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.qd {
		width: 100%;
		height: auto;
		background-color: #ffffff;

		.qd-box {
			width: 686rpx;
			height: 306rpx;
			background: linear-gradient(0deg, #FEF7F1 0%, #FFF1E8 100%);
			border-radius: 24rpx;
			margin: 26rpx 0;

			.qd-boxs {
				width: calc(686rpx - 60rpx);
				height: calc(306rpx - 60rpx);
			}

			.qd-boxs-title {

				.qd-boxs-title-lt {
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;

					text {
						font-size: 36rpx;
						color: #FF6730;
						margin: 0 10rpx;
					}
				}

				.qd-boxs-title-lb {
					color: #999999;
					font-size: 24rpx;
				}

				.qd-boxs-title-r {
					width: 156rpx;
					height: 56rpx;
					border-radius: 44rpx;
					background: linear-gradient(to right, #fe956d, #fe7085);
					color: #ffffff;
					font-size: 26rpx;
				}
			}

			.qd-boxs-hb {
				width: 100%;
				margin-top: 20rpx;

				image {
					width: 50rpx;
					height: 64rpx;
				}
			}

			.qd-boxs-line {
				width: 100%;
				margin-top: 20rpx;

				.qd-boxs-line-item {
					margin-left: 13rpx;
				}

				.qd-boxs-line-item-dian {
					width: 4rpx;
					height: 4rpx;
					border-radius: 50%;
					background-color: #FFAEB7;
					margin-right: 6rpx;
				}

				.qd-boxs-line-item-xian {
					width: 77rpx;
					border-bottom: 4rpx solid;
					border-color: #FFCDD2;
				}

			}

			.qd-boxs-tian {
				margin-top: 20rpx;
				// padding: 0 10rpx;

				.qd-boxs-tian-item {
					color: #B7B0A9;
					font-size: 22rpx;

					.qd-boxs-tian-iteml {
						background-color: #FFDFE2;
						border-radius: 18rpx;
						color: #FF415B;
						padding: 4rpx 10rpx;
					}
				}
			}



		}
	}

	.active {
		font-size: 38rpx !important;
		color: #333333 !important;
	}

	.line {
		width: 100%;
		height: 20rpx;
		background-color: #F5F5F5;
	}

	.myBook {
		width: 100%;
		height: auto;
		background-color: #ffffff;

		.myBook-box {
			width: 686rpx;
			height: 100%;
		}

		.myBook-box-tabs {
			margin-top: 18rpx;
			align-items: flex-end;
			padding: 20rpx 0;
			background-color: #ffffff;

			.myBook-box-tabs-i {
				color: #999999;
				font-size: 32rpx;
				margin-right: 50rpx;
				font-weight: bold;
			}
		}

		.myBook-box-list {
			// margin-top: 40rpx;
			padding-bottom: 40rpx;

			.myBook-box-list-item {
				width: 214rpx;
				margin-bottom: 20rpx;
			}

			.myBook-box-list-item-img {
				width: 100%;
				height: 300rpx;
				border-radius: 14rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 14rpx;
				}
			}

			.myBook-box-list-item-title {
				width: 100%;
				color: #1A1A1A;
				font-size: 30rpx;
				font-weight: bold;
				margin-top: 10rpx;
			}

			.myBook-box-list-item-jd {
				color: #999999;
				font-size: 22rpx;
			}


		}

		.myBook-box-his {
			width: 100%;
			padding-bottom: 40rpx;

			.myBook-box-his-item {
				margin-bottom: 20rpx;
				align-items: flex-end;

				.myBook-box-his-item-l {
					image {
						width: 126rpx;
						height: 176rpx;
						border-radius: 14rpx;
					}
				}

				.myBook-box-his-item-l-info {
					margin-left: 20rpx;
				}

				.myBook-box-his-item-l-info-t {
					color: #1A1A1A;
					font-size: 32rpx;
					font-weight: bold;

				}

				.myBook-box-his-item-l-info-j {
					color: #999999;
					font-size: 26rpx;
					margin-top: 40rpx;
				}

				.myBook-box-his-item-l-r {
					width: 158rpx;
					height: 58rpx;
					background: #FEEFE8;
					border-radius: 29rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #F3765A;
				}

				.myBook-box-his-item-l-rs {
					width: 158rpx;
					height: 58rpx;
					background: #F0F0F0;
					border-radius: 29rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #666666;
				}
			}
		}
	}
</style>