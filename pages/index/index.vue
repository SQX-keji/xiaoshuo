<template>
	<view style="padding-bottom: 40rpx;">
		<!-- 自定义导航栏 -->
		<u-navbar :placeholder="true" bgColor="#fef0f2" leftText="返回" title="个人中心" :safeAreaInsetTop="true">
			<view class="u-nav-slot flex align-center" slot="left">
				<text class="title">
					首页
				</text>
				<!-- #ifdef MP-WEIXIN -->
				<view class="search flex align-center" @click="gotoNav('/pages/moreBook/moreBook')"
					style="width: 440rpx;">
				<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<view class="search flex align-center" @click="gotoNav('/pages/moreBook/moreBook')"
						style="width: 600rpx;">
					<!-- #endif -->
						<u-icon name="search" color="#999999" size="30"></u-icon>
						<text>
							请输入书名
						</text>
					</view>
				</view>
				<view class="u-nav-slot" slot="center"></view>
		</u-navbar>
		<!-- 轮播图 -->
		<view class="bg flex align-center justify-center">
			<view class="bg-box">
				<swiper class="bg-box-item" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="500">
					<swiper-item @tap="goPage(item.url)" class="bg-box-item" v-for="(item,index) in swiperList"
						:key="index">
						<image class="bg-box-item" :src="item.imageUrl" mode="aspectFill"></image>
					</swiper-item>

				</swiper>
			</view>
		</view>
		<!-- 金刚区 -->
		<view class="typeList flex align-center justify-center" v-if="gridList.length >0">
			<view class="typeList-box">
				<swiper :indicator-dots="false" class="centers-cistrict-boxs" :autoplay="false" :interval="3000"
					:duration="300">
					<swiper-item v-for="(item,index) in gridList" :key="index">
						<view class="swiper-item flex align-center justify-between">
							<view class="swiper-item-s" @click="goGridList(ite)" v-for="(ite,ind) in item.child"
								:key="ind">
								<view class="swiper-item-s-img">
									<image :src="ite.imageUrl" mode="aspectFill"></image>
								</view>
								<view class="swiper-item-s-txt">
									{{ite.name}}
								</view>
							</view>
							<block v-if="item.child.length == 2">
								<view class="swiper-item-s" style="height: 0;"></view>
								<view class="swiper-item-s" style="height: 0;"></view>
							</block>
							<block v-if="item.child.length == 3">
								<view class="swiper-item-s" style="height: 0;"></view>
							</block>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 热门推荐 -->
		<view class="bookList flex align-center justify-center" v-if="popularList.length>0">
			<view class="bookList-box">
				<!-- 标题 -->
				<view class="bookList-box-title flex align-center justify-between">
					<view class="bookList-box-title-l">
						热门推荐
					</view>
					<view @click="gotoNav('/pages/moreBook/moreBook?sort=1')"
						class="bookList-box-title-r flex align-center">
						更多
						<u-icon name="arrow-right" color="#999999" size="14"></u-icon>
					</view>
				</view>
				<!-- 书籍内容 -->
				<view class="bookList-box-content flex justify-between flex-wrap">
					<view class="bookList-box-content-item"
						@click="gotoNav('/package/bookDetails/bookDetails?courseId='+item.courseId)"
						v-for="(item,index) in popularList" :key="index">
						<view class="bookList-box-content-item-img">
							<image lazy-load :src="item.titleImg" mode="aspectFill"></image>
						</view>
						<view class="bookList-box-content-item-title">
							{{item.title}}
						</view>
						<view class="bookList-box-content-item-tips flex align-center justify-between">
							<text>
								{{item.source?item.source:10}}分
							</text>
							<text>
								{{item.viewCounts}}人在读
							</text>
						</view>
					</view>
					<view class="bookList-box-content-item" style="height: 0;"></view>
				</view>
			</view>
		</view>
		<!-- 最新推荐 -->
		<view class="bookList flex align-center justify-center" v-if="newList.length>0">
			<view class="bookList-box">
				<!-- 标题 -->
				<view class="bookList-box-title flex align-center justify-between">
					<view class="bookList-box-title-l">
						最新推荐
					</view>
					<view @click="gotoNav('/pages/moreBook/moreBook?sort=2')"
						class="bookList-box-title-r flex align-center">
						更多
						<u-icon name="arrow-right" color="#999999" size="14"></u-icon>
					</view>
				</view>
				<!-- 书籍内容 -->
				<view class="bookList-box-content flex justify-between flex-wrap">
					<view class="bookList-box-content-item"
						@click="gotoNav('/package/bookDetails/bookDetails?courseId='+item.courseId)"
						v-for="(item,index) in newList" :key="index">
						<view class="bookList-box-content-item-img">
							<image lazy-load :src="item.titleImg" mode="aspectFill"></image>
						</view>
						<view class="bookList-box-content-item-title">
							{{item.title}}
						</view>
						<view class="bookList-box-content-item-tips flex align-center justify-between">
							<text>
								{{item.source?item.source:10}}分
							</text>
							<text>
								{{item.viewCounts}}人在读
							</text>
						</view>
					</view>
					<view class="bookList-box-content-item" style="height: 0;"></view>
				</view>
			</view>
		</view>
		<!-- 完结榜单 -->
		<view class="bookList flex align-center justify-center" v-if="finishList.length>0">
			<view class="bookList-box">
				<!-- 标题 -->
				<view class="bookList-box-title flex align-center justify-between">
					<view class="bookList-box-title-l">
						完结榜单
					</view>
					<view @click="gotoNav('/pages/moreBook/moreBook?sort=3')"
						class="bookList-box-title-r flex align-center">
						更多
						<u-icon name="arrow-right" color="#999999" size="14"></u-icon>
					</view>
				</view>
				<!-- 书籍内容 -->
				<view class="bookList-box-content flex justify-between flex-wrap">
					<view class="bookList-box-content-item"
						@click="gotoNav('/package/bookDetails/bookDetails?courseId='+item.courseId)"
						v-for="(item,index) in finishList" :key="index">
						<view class="bookList-box-content-item-img">
							<image lazy-load :src="item.titleImg" mode="aspectFill"></image>
						</view>
						<view class="bookList-box-content-item-title">
							{{item.title}}
						</view>
						<view class="bookList-box-content-item-tips flex align-center justify-between">
							<text>
								{{item.source?item.source:10}}分
							</text>
							<text>
								{{item.viewCounts}}人在读
							</text>
						</view>
					</view>
					<view class="bookList-box-content-item" style="height: 0;"></view>
				</view>
			</view>
		</view>

		<empty v-if="popularList.length===0 && newList.length===0 && finishList.length===0" txt="暂无书籍" />



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
				swiperList: [], //轮播图
				gridList: [], //获取金刚区类表
				popularList: [], //热门书籍
				newList: [], //最新书籍
				finishList: [], //完结书籍
				page: 1, //当前页数
				invitationCode: '',
				tuiguang: '',
				bgImg: '',
			}
		},
		onShareAppMessage(res) {
			return {
				path: '/package/index/index?invitation=' + this
					.invitationCode, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		onShareTimeline(res) {
			return {
				path: '/pages/index/index?invitation=' + this
					.invitationCode, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		onLoad(option) {
			// #ifdef MP-WEIXIN
			if (option.scene) { //这里为线上操作
				//此处的二维码  page/index/index?brokerId=123
				let scene = decodeURIComponent(option.scene);
				scene = scene.split(',')
				uni.setStorageSync('invitation', scene[0])
			}
			// #endif
			if (option.invitation) {
				uni.setStorageSync('invitation', option.invitation)
			}
			this.getBgImg()
			// 获取轮播图列表
			this.getBannerList()
			// 获取金刚区列表
			this.getGardList()
			//获取数据
			this.getPopularList(1, 6)
			this.getPopularList(2, 3)
			this.getPopularList(3, 3)
		},
		onShow() {
			this.invitationCode = uni.getStorageSync('invitationCode') ? uni.getStorageSync('invitationCode') : '';
		},
		methods: {
			//获取背景图
			getBgImg() {
				this.$Request.getT('/app/banner/selectBannerList?classify=5').then(res => {
					if (res.code == 0) {
						this.bgImg = res.data[0].imageUrl
						this.tuiguang = res.data[0].describes
						console.log(this.bgImg)
					} else {
						uni.showToast({
							title: res.msg,
							duration: 1000,
							icon: 'none'
						});
					}
				});
			},
			//跳转
			gotoNav(url) {
				if (uni.getStorageSync('token')) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}

			},
			// 获取书籍
			getPopularList(sort, limit) {
				let data = {
					limit: limit,
					page: this.page,
					sort: sort,
				}
				this.$Request.getT('/app/course/selectCourse', data).then(res => {
					if (res.code == 0) {
						res.data.list.map(item => {
							if (item.viewCounts >= 10000) {
								item.viewCounts = ((item.viewCounts / 10000).toFixed(2)) + 'w'
							}
						})
						if (sort == 1) { //热门书籍
							this.popularList = res.data.list
						} else if (sort == 2) { //最新书籍
							this.newList = res.data.list
						} else { //完结书籍
							this.finishList = res.data.list
						}
					}
				})
			},
			//处理分割金刚区
			processArray(arr) {
				let arr2 = [];
				let child = [];
				for (let i = 0; i < arr.length; i++) {
					child.push(arr[i]);

					if (child.length === 4) {
						arr2.push({
							child: child
						});
						child = [];
					}
				}
				// 如果arr数组的长度不是5的倍数，将剩余的元素添加到arr2数组的最后一个child中
				if (child.length > 0) {
					arr2.push({
						child: child
					});
				}

				return arr2;
			},
			// 获取金刚区列表
			getGardList() {
				let data = {
					classify: 2
				}
				this.$Request.get('/banner/selectBannerList', data).then(res => {
					if (res.code == 0) {
						let arr = []
						res.data.forEach(ret => {
							if (ret.state == 1) {
								arr.push(ret)
							}
						})
						this.gridList = this.processArray(arr)
					}
				})
			},
			// 跳转资源列表
			goGridList(e) {
				if (uni.getStorageSync('token')) {
					uni.navigateTo({
						url: e.url
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			},
			//轮播图跳转
			goPage(url) {
				let token = uni.getStorageSync('token')
				if (token) {
					if (url) {
						if (url.indexOf('/pages/') !== -1 || url.indexOf('/package/') !== -1) {
							uni.navigateTo({
								url
							});
						} else {
							//#ifndef H5
							uni.navigateTo({
								url: '/pages/my/webView?url=' + url
							});
							//#endif
							//#ifdef H5
							window.location.href = url;
							//#endif	
						}
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			// 获取轮播图列表
			getBannerList() {
				let data = {
					classify: 1
				}
				this.$Request.get('/banner/selectBannerList', data).then(res => {
					if (res.code == 0) {
						this.swiperList = res.data
					}
				})

			},
		}
	}
</script>

<style lang="scss">
	.title {
		color: #1A1A1A;
		font-size: 32rpx;
		font-weight: bold;
	}

	.search {
		// width: 392rpx;
		height: 66rpx;
		background-color: #ffffff;
		border-radius: 38rpx;
		margin-left: 30rpx;
		padding: 0 26rpx;

		text {
			margin-left: 10rpx;
			font-size: 28rpx;
			color: #999999;
		}
	}

	.bg {
		width: 100%;
		padding-top: 24rpx;
		background: linear-gradient(to bottom, #fef0f2, #f5f5f5);

		.bg-box {
			width: 686rpx;

			.bg-box-item {
				width: 100%;
				height: 276rpx;
				border-radius: 24rpx;
			}
		}
	}

	.typeList {
		width: 100%;
		height: 184rpx;
		margin-top: 20rpx;

		.typeList-box {
			width: 686rpx;
			height: 100%;
			background-color: #ffffff;
			border-radius: 24rpx;
		}

		.centers-cistrict-boxs {
			width: 100%;
			height: 100%;

			border-radius: 24rpx;
		}

		.swiper-item {
			width: 100%;
			height: 125rpx;
			margin-top: 30rpx;
			padding: 0 50rpx;
		}

		.swiper-item-s {
			width: calc(100% / 5 - 30rpx);
			height: 100%;
		}

		.swiper-item-s-img {
			width: 76rpx;
			height: 76rpx;
			margin: 0 auto;

			image {
				width: 100%;
				height: 76rpx;
			}
		}

		.swiper-item-s-txt {
			width: 100%;
			text-align: center;
			color: #333333;
			font-size: 26rpx;
			margin-top: 10rpx;
		}
	}

	.bookList {
		width: 100%;
		height: auto;
		margin-top: 20rpx;

		.bookList-box {
			width: 686rpx;
			height: 100%;
			border-radius: 24rpx;
			background-color: #ffffff;
		}

		.bookList-box-title {
			width: 100%;
			margin-top: 30rpx;
			padding: 0 20rpx;

			.bookList-box-title-l {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			.bookList-box-title-r {
				color: #999999;
				font-size: 26rpx;
			}
		}

		.bookList-box-content {
			width: 100%;
			padding: 0 20rpx;
			margin-top: 20rpx;

			.bookList-box-content-item {
				width: 192rpx;
				margin-bottom: 20rpx;
			}

			.bookList-box-content-item-img {
				width: 100%;
				height: 270rpx;
				border-radius: 10rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}

			.bookList-box-content-item-title {
				color: #1A1A1A;
				font-size: 30rpx;
				width: 100%;
				font-weight: bold;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-top: 10rpx;
			}

			.bookList-box-content-item-tips {
				margin-top: 6rpx;

				text:nth-of-type(1) {
					color: #FF6730;
					font-size: 26rpx;
				}

				text:nth-of-type(2) {
					color: #999999;
					font-size: 22rpx;
				}
			}
		}
	}
</style>