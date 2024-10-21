<template>
	<view class="read" :style="{background:bgColor}" @click.stop="contentClick">
		<u-navbar :leftIconColor="bgColor==='#333333'?'#999999':'#000'" :placeholder="true" :bgColor="bgColor"
			:leftIcon="leftIcon" :leftText="'第'+page+'章 '+title" :title="titles" :autoBack="true">
		</u-navbar>
		<view :style="{background:bgColor}" class="content flex align-center justify-center">
			<view class="content-box">
				<text
					:style="{fontSize:fontSize+'rpx',lineHeight:lineHeight+'rpx',color:bgColor==='#333333'?'#999999':'#000'}">
					{{content?content:''}}
				</text>
				<view class="pay flex align-center justify-center" v-if="!content">
					<view class="pay-box">
						<view @click.stop="payBook(1)" class="pay-box-item flex align-center justify-center">
							整部购买
						</view>
						<view @click.stop="payBook(2)" class="pay-box-item flex align-center justify-center">
							购买本章
						</view>
						<view v-if="isVips == '是'" @click.stop="goNav('/package/vip/vip')"
							class="pay-box-item flex align-center justify-center">
							开通会员
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<view v-if="isGuanggao == '是'" @click.stop="openAd()"
							class="pay-box-item flex align-center justify-center">
							免费解锁本章
						</view>
						<!-- #endif -->

					</view>
				</view>
				<view class="content-cz flex align-center justify-between">
					<view @click="topList(false)" class="content-cz-item flex align-center justify-center">
						上一章
					</view>
					<view @click="openMl()" class="content-cz-item flex align-center justify-center">
						目录
					</view>
					<view @click="topList(true)" class="content-cz-item flex align-center justify-center">
						下一章
					</view>
				</view>
			</view>
		</view>
		<!-- 顶部弹出 -->
		<u-popup :safeAreaInsetTop="true" :overlay="false" :bgColor="bgColor" :show="show" @close="close" mode="top">
			<view class="tops flex align-center justify-center">
				<view class="tops-box flex align-center" @click="goBack()">
					<u-icon name="arrow-left" color="#999999" size="20"></u-icon>
					<text>
						第{{page}}章 {{title}}
					</text>
				</view>

			</view>
		</u-popup>
		<!-- 底部弹出 -->
		<u-popup :overlay="false" :bgColor="bgColor" :show="show" @close="close" mode="bottom">
			<view class="bottoms flex align-center justify-center">
				<view class="bottoms-box">
					<view class="bottoms-box-next flex align-center justify-between">
						<view class="bottoms-box-next-top" @click="topList(false)">
							上一章
						</view>
						<view class="bottoms-box-next-bto" @click="topList(true)">
							下一章
						</view>
					</view>
					<!-- 背景选择 -->
					<view class="bottoms-box-bgColor flex align-center">
						<view class="bottoms-box-bgColor-txt">
							背景
						</view>
						<view class="bottoms-box-bgColor-list flex align-center justify-between">
							<view @click="selectBgColor(item)" :class="item===bgColor?'active':''"
								:style="{background:item}" class="bottoms-box-bgColor-item"
								v-for="(item,index) in bgList" :key="index">

							</view>
							<view :style="bgColor==='#333333'?'border:1px solid #ffffff':''"
								@click="selectBgColor('#333333')"
								class="bottoms-box-bgColor-item yejian flex align-center justify-center">
								夜间
							</view>
						</view>
					</view>
					<!-- 字号选择 -->
					<view class="bottoms-box-bgColor flex align-center">
						<view class="bottoms-box-bgColor-txt">
							背景
						</view>
						<view class="bottoms-box-bgColor-list flex align-center justify-between">
							<view @click="setFontSize(false)"
								class="bottoms-box-bgColor-list-min flex align-center justify-center">
								A-
							</view>
							<view @click="setFontSize(true)"
								class="bottoms-box-bgColor-list-max flex align-center justify-center">
								A+
							</view>
						</view>
					</view>
					<!-- 字间距选择 -->
					<view class="bottoms-box-bgColor flex align-center">
						<view class="bottoms-box-bgColor-txt">
							间距
						</view>
						<view class="bottoms-box-bgColor-list flex align-center justify-between">
							<view @click="setLineHeight(item)" :class="item === lineHeight?'active':''"
								class="bottoms-box-bgColor-list-fonts flex align-center justify-center"
								v-for="(item,index) in lineHeightList" :key="index">
								<view v-if="index == 0">
									<view class="bottoms-box-bgColor-list-fontsL"></view>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
								</view>
								<view v-else-if="index == 1">
									<view class="bottoms-box-bgColor-list-fontsL"></view>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
								</view>
								<view v-else>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
									<view class="bottoms-box-bgColor-list-fontsL"></view>
								</view>

							</view>
						</view>
					</view>
					<!-- 操作 -->
					<view class="bottoms-box-cz flex align-center justify-between">
						<view @click="openMl()" class="bottoms-box-cz-item">
							<view class="bottoms-box-cz-item-icon flex align-center justify-center">
								<u-icon name="list" color="#999999" size="30"></u-icon>
							</view>
							<view class="bottoms-box-cz-item-txt">
								目录
							</view>
						</view>
						<view @click="gotoInfo()" class="bottoms-box-cz-item">
							<view class="bottoms-box-cz-item-icon flex align-center justify-center">
								<u-icon name="order" color="#999999" size="30"></u-icon>
							</view>
							<view class="bottoms-box-cz-item-txt">
								详情
							</view>
						</view>
						<view @click="addMyBook()" class="bottoms-box-cz-item">
							<view class="bottoms-box-cz-item-icon flex align-center justify-center">
								<!-- <u-icon name="grid" color="#333333" size="28"></u-icon> -->
								<image src="../../static/image/addBook.png" mode=""></image>
							</view>
							<view class="bottoms-box-cz-item-txt">
								加入书架
							</view>
						</view>
					</view>
				</view>

			</view>
		</u-popup>
		<!-- 目录弹窗 -->
		<u-popup :safeAreaInsetTop="true" :safeAreaInsetBottom="true" :overlay="true" :bgColor="bgColor" :show="muShow"
			@close="closemu" mode="left">
			<view class="left flex align-center justify-center flex-wrap">
				<view class="leftInfo flex align-center">
					<image :src="info.titleImg" mode="aspectFill"></image>
					<view class="leftInfo-info">
						<view class="leftInfo-info-title" :style="bgColor==='#333333'?'color:#ffffff':''">
							{{info.title}}
						</view>
						<view class="leftInfo-info-athur" :style="bgColor==='#333333'?'color:#ffffff':''">
							{{info.author}}
						</view>
					</view>
				</view>
				<scroll-view @scrolltolower="scrolltolower" scroll-y="true" :scroll-into-view="scrollIntoView"
					class="leftList">
					<view :id="'mybook'+(index+1)" class="leftList-item flex align-center flex-wrap"
						@click="selectZj(index +1)" v-for="(item,index) in mulIst" :key="index"
						:style="bgColor==='#333333'?'color:#999999':''">
						第{{index+1}}章 {{item.courseDetailsName}}
						<view class="" style="width: 100%;">
							{{item.createTime}}
						</view>
					</view>
				</scroll-view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	var videoAd = null;
	// #endif
	export default {
		data() {
			return {
				scrollIntoView: 'mybook1',
				muShow: false,
				leftIcon: '',
				titles: '',
				show: false, //是否显示控制中心
				courseId: '',
				page: 1,
				limit: 1,
				pages: 1,
				content: '', //小说内容
				title: '', //小说标题
				bgList: ['#F7F6F1', '#E6E1D0', '#F4E7BD'], //背景色列表
				bgColor: '#F7F6F1', //当前背景色
				fontSize: 28, //字体大小
				screenWidth: 0, //屏幕宽度
				screenHeight: 0, //屏幕高度
				lineHeightList: [80, 120, 160],
				lineHeight: 80, //文字杭高
				color: '#000', //字体颜色
				titleStyle: {
					color: '#ffffff'
				},
				mulIst: [],
				pagemu: 1,
				limitmu: 10,
				pagesmu: 1,
				info: {},
				myInfoBook: {}, //本章书信息
				isVips: '否', //是否显示会员
				adUnitId: '', //广告id
				isGuanggao: '否',
				invitationCode: '',

			};
		},
		onShareAppMessage(res) {
			return {
				path: '/package/bookDetails/bookDetails?invitation=' + this
					.invitationCode + '&courseId=' + this.myInfoBook.courseId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.myInfoBook.title,
				imageUrl: this.myInfoBook.titleImg
			}
		},
		onShareTimeline(res) {
			return {
				path: '/package/bookDetails/bookDetails?invitation=' + this
					.invitationCode + '&courseId=' + this.myInfoBook.courseId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.myInfoBook.title,
				imageUrl: this.myInfoBook.titleImg
			}
		},
		onLoad(option) {
			this.getSysInfo()
			// #ifdef MP-WEIXIN
			if (option.scene) { //这里为线上操作
				//此处的二维码  page/index/index?brokerId=123
				let scene = decodeURIComponent(option.scene);
				scene = scene.split(',')
				uni.setStorageSync('invitation', scene[0])
				this.courseId = scene[1]
			}
			this.isGuanggao = uni.getStorageSync('isGuanggao')
			this.adUnitId = uni.getStorageSync('adUnitId')
			if (this.isGuanggao == '是' && this.adUnitId) {
				this.adLoad()
			}
			// #endif
			if (option.invitation) {
				uni.setStorageSync('invitation', option.invitation)
			}
			if (option.courseId) {
				if (option.page) {
					this.page = Number(option.page)
				}
				this.courseId = option.courseId
			}

		},
		onShow() {
			this.invitationCode = uni.getStorageSync('invitationCode') ? uni.getStorageSync('invitationCode') : '';
			this.isVips = uni.getStorageSync('isVips') ? uni.getStorageSync('isVips') : '否'
			//背景色
			if (uni.getStorageSync('bgColor')) {
				this.bgColor = uni.getStorageSync('bgColor')
			} else {
				this.bgColor = this.bgList[0]
			}
			// 字体大小
			if (uni.getStorageSync('fontSize')) {
				this.fontSize = uni.getStorageSync('fontSize')
			} else {
				this.fontSize = 28
			}
			if (this.courseId) {
				this.getBookInfo()
				this.getMuList()
				this.getInfo()
			}
		},
		methods: {
			//去支付
			payBook(type) {
				let courseId = this.myInfoBook.courseId
				let courseDetailsId = this.myInfoBook.courseDetailsId
				let titleImg = this.myInfoBook.titleImg
				let courseDetailsName = this.myInfoBook.courseDetailsName
				let name = this.info.title
				let zongPrice = this.info.price
				let price = this.myInfoBook.price
				let data = {
					courseId,
					courseDetailsId,
					titleImg,
					courseDetailsName,
					price,
					zongPrice,
					type,
					name
				}
				uni.navigateTo({
					url: '/package/payOrder/payOrder?info=' + JSON.stringify(data)
				})
			},
			//去开会员
			goNav(e) {
				uni.navigateTo({
					url: e
				})
			},
			//拉起广告
			openAd() {
				let that = this
				console.log(videoAd, 222222222)
				if (videoAd) {
					videoAd.show().catch(err => {
						console.log(' 广告拉取失败，重试')
						// 广告拉取失败，重试
						videoAd.load().then(() => {
							videoAd.show();
						});
					})
				}
			},
			//获取
			adLoad() {
				let that = this
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: that.adUnitId //你的广告key,从微信小程序后台>流量主>广告管理获取
					});
					videoAd.onError(err => {
						console.log(err);
					});
					videoAd.onClose((status) => {
						if (status && status.isEnded || status === undefined) {
							//广告播放完成后的的业务逻辑
							console.log('播放成功')
							uni.showToast({
								title: '加载中'
							})
							let data = {
								courseId: that.myInfoBook.courseId,
								courseDetailsId: that.myInfoBook.courseDetailsId
							}
							that.$Request.postT("/app/course/courseNotify", data).then(res => {
								uni.hideLoading();
								if (res.code == 0) {
									uni.showToast({
										title: '解锁成功',
										icon: 'none',
										duration: 2000
									})
									that.getBookInfo();
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none',
										duration: 2000
									})
								}
							});
						} else {
							//广告播放失败或者未播放完成
							console.log('播放失败或者未播放完成')
							wx.showToast({
								title: '未完整观看视频不能获取奖励哦',
								icon: 'none'
							})
						}
					});
				}
			},
			//加入书架
			addMyBook() {
				if (this.info.isCollect === 1) {
					uni.showToast({
						title: '已在书架',
						icon: 'none'
					})
					return
				} else {
					let data = {
						courseId: this.courseId,
						courseDetailsId: this.courseId,
						classify: 1,
						type: 1
					}
					this.$Request.postJson('/app/courseCollect/insertCourseCollect', data).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '已加入书架'
							})
							this.getInfo()
						}
					})
				}
			},
			//更多目录
			scrolltolower() {
				if (this.pagemu < this.pagesmu) {
					this.pagemu += 1
					this.getMuList()
				}
			},
			//选择章节
			selectZj(index) {
				this.page = index
				this.getBookInfo()
			},
			//获取详情
			gotoInfo() {
				uni.navigateTo({
					url: '/package/bookDetails/bookDetails?courseId=' + this.courseId
				})
			},
			openMl() {
				this.show = false
				this.muShow = true
			},
			//关闭目录
			closemu() {
				this.muShow = false
			},
			//获取书籍详情
			getInfo() {
				let data = {
					id: this.courseId,
					token: uni.getStorageSync('token')
				}
				this.$Request.getT('/app/course/selectCourseDetailsById', data).then(res => {
					if (res.code == 0) {
						this.info = res.data
					}
				})
			},
			// 获取章节目录
			getMuList() {
				let data = {
					id: this.courseId,
					token: uni.getStorageSync('token'),
					page: this.pagemu,
					limit: this.limitmu
				}
				this.$Request.getT('/app/course/selectCourseDetailsPage', data).then(res => {
					if (res.code == 0) {
						this.pagesmu = res.data.pages
						if (this.pagemu == 1) {
							this.mulIst = res.data.records
						} else {
							this.mulIst = [...this.mulIst, ...res.data.records]
						}
					}
				})
			},
			//设置字体间距
			setLineHeight(item) {
				if (item === this.lineHeight) {
					return
				}
				this.lineHeight = item
			},
			//设置字体大小
			setFontSize(type) {
				if (type == false) { //缩小
					if (this.fontSize == 28) {
						return
					} else {
						this.fontSize -= 2
						uni.setStorageSync('fontSize', this.fontSize)
					}
				} else { //放大
					if (this.fontSize == 48) {
						return
					} else {
						this.fontSize += 2
						uni.setStorageSync('fontSize', this.fontSize)
					}
				}
			},
			//上一章
			topList(type) {
				//上一章
				if (type == false) {
					if (this.page == 1) {
						uni.showToast({
							title: '已经是第一章了',
							icon: 'none'
						})
						return
					} else {
						this.page -= 1
						this.getBookInfo()
					}
				} else { //下一章
					console.log(this.page, '111111')
					console.log(this.pages, '111111')
					if (this.page == this.pages) {
						uni.showToast({
							title: '已经是最新章节了',
							icon: 'none'
						})
						return
					} else {
						this.page += 1
						this.getBookInfo()
					}
				}

			},
			//切换背景颜色
			selectBgColor(item) {
				if (this.bgColor == item) {
					return
				} else {
					this.bgColor = item
					uni.setStorageSync('bgColor', item)
				}

			},
			//获取系统消息
			getSysInfo() {
				let that = this
				uni.getSystemInfo({
					success(res) {
						console.log(res, '11111111')
						that.screenWidth = res.windowWidth
						that.screenHeight = res.windowHeight
					}
				})
			},
			//屏幕点击事件
			contentClick(event) {
				// 获取点击位置坐标
				const x = event.touches[0].clientX;
				const y = event.touches[0].clientY;
				// 计算屏幕中心坐标
				const screenWidth = uni.upx2px(this.screenWidth); // 根据实际屏幕宽度进行适配
				const screenHeight = this.screenHeight; // 根据实际屏幕高度进行适配
				const centerX = screenWidth / 2;
				const centerY = screenHeight / 2;
				// 判断点击位置是否在屏幕中心区域，如果是则呼出菜单
				if (
					Math.abs(x - centerX) <= this.screenWidth && // 左右容忍度为screenWidth
					Math.abs(y - centerY) <= 100 // 上下容忍度为100px
				) {
					//点击了中心区域
					if (this.show == false) {
						this.show = true
					} else {
						this.close()
					}
				} else {
					// 没有点击中心区域
					this.close()
				}
			},
			//返回
			goBack() {
				uni.navigateBack()
			},
			//关闭阅读设置
			close() {
				this.show = false
			},
			//插入观看记录
			setHistore(courseDetailsId) {
				let data = {
					courseId: this.courseId,
					courseDetailsId: courseDetailsId,
					classify: 3,
					type: 1,
					coursePage: this.page
				}
				this.$Request.postJson('/app/courseCollect/insertCourseCollect', data).then(res => {})
			},
			//获取小说内容
			getBookInfo() {
				let data = {
					id: this.courseId,
					token: uni.getStorageSync('token'),
					page: this.page,
					limit: this.limit
				}
				this.$Request.getT('/app/course/selectCourseDetailsPage', data).then(res => {
					if (res.code == 0) {
						this.myInfoBook = res.data.records[0]
						this.scrollIntoView = 'mybook' + this.page
						this.pages = res.data.pages
						this.content = res.data.records[0].videoUrl
						this.title = res.data.records[0].courseDetailsName
						this.setHistore(res.data.records[0].courseDetailsId)
						//切换章节后让页面滑动到最底部
						uni.pageScrollTo({
							duration: 0,
							scrollTop: 0
						})
						if (this.show) {
							this.show = false
						}
						if (this.muShow) {
							this.muShow = false
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.left {
		width: 70vw;
		height: 100vh;
		padding-bottom: 40rpx;

		.leftInfo {
			width: 88%;
			height: 200rpx;

			image {
				width: 140rpx;
				height: 190rpx;
				border-radius: 10rpx;
			}
		}

		.leftInfo-info {
			margin-left: 20rpx;
			color: #000;
		}

		.leftInfo-info-title {
			font-size: 38rpx;
			font-weight: bold;
			margin-bottom: 20rpx;

		}

		.leftList {
			width: 88%;
			height: calc(100vh - 200rpx);
			/* #ifdef MP-WEIXIN */
			padding-bottom: 100rpx;
			/* #endif */


			.leftList-item {
				width: 100%;
				height: 110rpx;
				align-content: center;
				border-bottom: 1px solid #d6d1bc;
				color: #000;
			}

		}
	}

	.content {
		width: 100%;

		.content-box {
			width: 686rpx;
			padding-bottom: 40rpx;
		}

		.pay {
			width: 100%;
			height: 80vh;

			.pay-box {
				width: 100%;
			}

			.pay-box-item {
				width: 100%;
				height: 88rpx;
				border-radius: 44rpx;
				background-color: #ffffff;
				color: #999999;
				margin-top: 20rpx;
			}
		}

		.content-cz {
			margin-top: 40rpx;
		}

		.content-cz-item {
			width: 200rpx;
			height: 80rpx;
			border-radius: 44rpx;
			background-color: #ffffff;
			color: #999999;
		}
	}

	.active {
		border: 1px solid #666666;
	}

	.read {
		width: 100%;
		min-height: 100vh;
	}

	.tops {
		width: 100%;
		height: 100rpx;
		box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.1);

		.tops-box {
			width: 686rpx;
			height: 100%;

			text {
				color: #999999;
				font-size: 32rpx;
				margin-left: 10rpx;
			}
		}
	}

	.bottoms {
		width: 100%;
		// height: 560rpx;
		box-shadow: 0rpx -2rpx 4rpx rgba(0, 0, 0, 0.1);

		.bottoms-box {
			width: 686rpx;
			height: 100%;
		}

		.bottoms-box-next {
			margin-top: 20rpx;
			color: #999999;
		}

		.bottoms-box-bgColor {
			margin-top: 50rpx;
			width: 100%;

			.bottoms-box-bgColor-txt {
				width: 80rpx;
				color: #999999;
			}

			.bottoms-box-bgColor-list {
				width: calc(100% - 80rpx);


				.yejian {
					background-color: #333333 !important;
					color: #FFFFFF !important;
				}

				.bottoms-box-bgColor-item {
					width: 130rpx;
					height: 66rpx;
					border-radius: 33rpx;
				}

				.bottoms-box-bgColor-list-min {
					width: 294rpx;
					height: 66rpx;
					background-color: #ffffff;
					border-radius: 33rpx;
					color: #1A1A1A;
					font-size: 28rpx;
				}

				.bottoms-box-bgColor-list-max {
					width: 294rpx;
					height: 66rpx;
					background-color: #ffffff;
					border-radius: 33rpx;
					color: #1A1A1A;
					font-size: 38rpx;
					font-weight: bold;
				}

				.bottoms-box-bgColor-list-fonts {
					width: 194rpx;
					height: 66rpx;
					border-radius: 33rpx;
					background-color: #ffffff;

					.bottoms-box-bgColor-list-fontsL {
						width: 28rpx;
						height: 4rpx;
						background-color: #000;
						margin: 6rpx 0;
					}

				}
			}
		}

		.bottoms-box-cz {
			margin-top: 60rpx;

			.bottoms-box-cz-item {
				width: fit-content;
			}

			.bottoms-box-cz-item-icon {
				width: 100%;

				image {
					width: 44rpx;
					height: 50rpx;
				}
			}

			.bottoms-box-cz-item-txt {
				width: 100%;
				text-align: center;
				color: #999999;
				margin-top: 10rpx;
			}
		}
	}
</style>