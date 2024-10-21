<template>
	<view style="padding-bottom: 120rpx;">
		<view class="infoTop flex justify-center">
			<view class="infoTop-box flex align-center">
				<view class="infoTop-box-img">
					<image :src="info.titleImg" mode="aspectFill"></image>
				</view>
				<view class="infoTop-box-info">
					<view class="infoTop-box-info-title" v-if="info.title">
						{{info.title}}
					</view>
					<view class="infoTop-box-info-tips">
						{{info.courseClassification?info.courseClassification.classificationName:'默认'}}·{{info.over==1?'完结':'连载中'}}·{{info.fontNum>=10000?mathNum(info.fontNum)+'万':mathNum(info.fontNum)}}字
					</view>
					<view class="infoTop-box-info-write">
						作家：{{info.author?info.author:'匿名作者'}}
					</view>
					<view class="infoTop-box-info-label flex flex-wrap">
						<view class="infoTop-box-info-labels" v-for="(item,index) in info.courseLabel" :key="index">
							{{item}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="introduction flex align-center justify-center">
			<view class="introduction-box">
				<view class="introduction-box-cums flex align-center justify-between">
					<view class="introduction-box-cums-item">
						<view class="introduction-box-cums-itemt">
							<text>{{info.source?info.source:10}}</text>
							分
						</view>
						<view class="introduction-box-cums-itemx">
							作品评分
						</view>
					</view>
					<view class="introduction-box-cums-item">
						<view class="introduction-box-cums-itemt">
							<text>{{mathNum(info.viewCounts)}}</text>
							{{info.viewCounts>=10000?'万人':'人'}}
						</view>
						<view class="introduction-box-cums-itemx">
							正在阅读
						</view>
					</view>
					<view class="introduction-box-cums-item">
						<view class="introduction-box-cums-itemt">
							<text>{{mathNum(info.fontNum)}}</text>
							{{info.fontNum>=10000?'万字':'字'}}
						</view>
						<view class="introduction-box-cums-itemx">
							完结
						</view>
					</view>
				</view>
				<view class="line">

				</view>
				<view class="introduction-box-title">
					简介
				</view>
				<view class="introduction-box-content">
					{{info.details?info.details:'作者很懒，暂无简介'}}
				</view>
				<view class="introduction-box-btn flex align-center justify-between">
					<view @click="shoucang()" v-if="info.isCollect != 1"
						class="introduction-box-btns flex align-center justify-center">
						加入书架
					</view>
					<view v-else class="introduction-box-btns flex align-center justify-center">
						已在书架
					</view>
					<view @click="gotoRead()" class="introduction-box-btns flex align-center justify-center">
						{{info.courseDetailsId?'继续阅读':'开始阅读'}}
					</view>
				</view>

			</view>
		</view>
		<!-- 目录 -->
		<view @click="gotoBookList()" class="mulu flex align-center justify-center">
			<view class="mulu-box flex align-center justify-between">
				<view class="mulu-box-title">
					查看目录
				</view>
				<view class="mulu-box-num flex align-center">
					<text>
						{{info.over==1?'完结':'连载中'}} 共{{num}}章
					</text>
					<u-icon name="arrow-right" color="#999999" size="14"></u-icon>
				</view>
			</view>
		</view>
		<!-- 评论预览 -->
		<view class="pl flex align-center justify-center">
			<view class="pl-box">
				<view class="pl-box-title flex align-center justify-between">
					<view class="pl-box-title-name">
						评价{{plNum!==0?'·'+plNum:''}}
					</view>
					<view @click="goComment()" class="pl-box-title-txt flex align-center">
						全部评价
						<u-icon name="arrow-right" color="#999999" size="14"></u-icon>
					</view>
				</view>
				<view class="pl-box-item" v-for="(item,index) in plList" :key="index">
					<view class="pl-box-item-info flex align-center">
						<image :src="item.avatar?item.avatar:'../../static/logo.png'" mode=""></image>
						<view class="pl-box-item-infos">
							<view class="pl-box-item-infos-name">
								{{item.userName?item.userName:'匿名用户'}}
							</view>
							<view class="pl-box-item-infos-time">
								{{item.createTime}}
							</view>
						</view>
					</view>
					<view class="pl-box-item-content">
						{{item.content}}
					</view>
					<view class="pl-box-item-zan flex align-center">
						<view v-if="item.isGood==0" @click="dianzan(item.courseCommentId)"
							class="pl-box-item-zan-item flex align-center">
							<!-- thumb-up-fill -->
							<u-icon name="thumb-up" color="#A4A4A4" size="16"></u-icon>
							点赞
						</view>
						<view v-else @click="dianzan(item.courseCommentId)"
							class="pl-box-item-zan-item flex align-center">
							<u-icon name="thumb-up-fill" color="#FE956D" size="16"></u-icon>
							{{item.goodsNum}}
						</view>
						<!-- thumb-down-fill -->
						<!-- <view class="pl-box-item-zan-item flex align-center">
							<u-icon name="thumb-down" color="#A4A4A4" size="16"></u-icon>
							反对
						</view> -->
					</view>
				</view>
				<view @click="goComment()" v-if="plList.length>0" class="pl-box-more flex align-center justify-center">
					查看全部评价
					<u-icon name="arrow-right" color="#333333" size="14"></u-icon>
				</view>
				<empty v-if="plList.length==0" txt="暂无评论" style="padding-bottom: 100rpx;" />

			</view>
		</view>
		<!-- 底部评论 -->
		<view class="pjSubmit flex align-center justify-center" :style="{bottom:bottom}">
			<view class="pjSubmit-box flex align-center justify-between">
				<u--input @blur="inputBindBlur" @confirm="startPinglun" prefixIcon="edit-pen-fill"
					:customStyle="customStyles" placeholder="请输入评论内容" shape="circle" border="none"
					v-model="pinglun"></u--input>
				<view @click="startPinglun" class="pjSubmit-box-share flex align-center">
					<!-- <u-icon name="share-square" color="#606266" size="28"></u-icon> -->
					<image style="width: 44rpx;height: 44rpx;margin-right: 10rpx;" src="../../static/image/my/send.png"
						mode=""></image>
					发送
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
				customStyles: {
					background: '#F5F5F5',
					height: '100%',
					padding: '0 20rpx'
				},
				courseId: '', //书籍id
				info: {}, //书籍详情
				num: 0, //总章数
				pinglun: '',
				bottom: '0px', //评论框距离底部的距离
				plList: [], //评论列表
				plNum: 0,
				invitationCode: '',
			};
		},
		onShareAppMessage(res) {
			return {
				path: '/package/bookDetails/bookDetails?invitation=' + this
					.invitationCode + '&courseId=' + this.courseId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.info.title,
				imageUrl: this.info.titleImg
			}
		},
		onShareTimeline(res) {
			return {
				path: '/package/bookDetails/bookDetails?invitation=' + this
					.invitationCode + '&courseId=' + this.courseId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.info.title,
				imageUrl: this.info.titleImg
			}
		},
		onLoad(option) {
			this.courseId = option.courseId
			// #ifdef MP-WEIXIN
			if (option.scene) { //这里为线上操作
				//此处的二维码  page/index/index?brokerId=123
				let scene = decodeURIComponent(option.scene);
				scene = scene.split(',')
				uni.setStorageSync('invitation', scene[0])
				this.courseId = scene[1]
			}
			// #endif
			if (option.invitation) {
				uni.setStorageSync('invitation', option.invitation)
			}

		},
		onShow() {
			this.invitationCode = uni.getStorageSync('invitationCode') ? uni.getStorageSync('invitationCode') : '';
			if (this.courseId) {
				//获取书籍详情
				this.getInfo()
				//获取章节数量
				this.getList()
				//获取评价列表
				this.getCourseComment()
			}

		},
		methods: {
			//加入书架
			shoucang() {
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
			},
			inputBindBlur() {
				this.bottom = '0px'
			},
			//去阅读
			gotoRead() {
				if (this.info.coursePage) {
					uni.navigateTo({
						url: '/package/read/read?courseId=' + this.courseId + '&page=' + this.info
							.coursePage
					})
				} else {
					uni.navigateTo({
						url: '/package/read/read?courseId=' + this.courseId
					})
				}

			},
			//查看目录
			gotoBookList() {
				uni.navigateTo({
					url: '/package/bookDetails/bookList?courseId=' + this.courseId
				})
			},
			//去全部评论页
			goComment() {
				if (uni.getStorageSync('token')) {
					uni.navigateTo({
						url: '/package/bookDetails/comment?courseId=' + this.courseId
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			},
			//点赞
			dianzan(courseCommentId) {
				if (uni.getStorageSync('token')) {
					let data = {
						courseCommentId: courseCommentId,
					}
					this.$Request.getT('/app/courseComment/updateGoodsNum', data).then(res => {
						if (res.code == 0) {
							this.getCourseComment()
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}

			},
			//获取评论列表
			getCourseComment() {
				let data = {
					page: 1,
					limit: 10,
					courseId: this.courseId
				}
				this.$Request.getT('/app/courseComment/selectCourseComment', data).then(res => {
					if (res.code == 0) {
						this.plList = res.data.list
						this.plNum = res.data.totalCount
					}
				})
			},
			//评论
			startPinglun() {
				if (!this.pinglun) {
					return
				}
				if (!uni.getStorageSync('token')) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return
				}
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认发表评论吗？',
					complete(ret) {
						if (ret.confirm) {
							let data = {
								courseId: that.courseId,
								content: that.pinglun
							}
							that.$Request.postJson('/app/courseComment/insertCourseComment', data).then(res => {
								if (res.code == 0) {
									uni.showToast({
										title: '评论成功'
									})
									this.bottom = 0
									that.pinglun = ''
									that.getCourseComment()
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							})
						}
					}
				})
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
			//获取总章数
			getList() {
				let data = {
					id: this.courseId,
					token: uni.getStorageSync('token'),
					page: 1,
					limit: 1
				}
				this.$Request.getT('/app/course/selectCourseDetailsPage', data).then(res => {
					if (res.code == 0) {
						this.num = res.data.pages
					}
				})
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
						if (this.info.courseLabel) {
							this.info.courseLabel = this.info.courseLabel.split(',')
						}


					} else {
						uni.showModal({
							title: '提示',
							content: res.msg,
							complete(ret) {
								uni.navigateBack()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	// fef0f2
	.infoTop {
		width: 100%;
		height: 400rpx;
		background-color: #fef0f2;

		.infoTop-box {
			width: 686rpx;
			height: fit-content;
			margin-top: 40rpx;
		}

		.infoTop-box-img {
			width: 174rpx;
			height: 242rpx;
			border-radius: 10rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.infoTop-box-info {
			margin-left: 26rpx;

			.infoTop-box-info-title {
				color: #3F251F;
				font-size: 36rpx;
				font-weight: bold;
			}

			.infoTop-box-info-tips {
				color: #76625C;
				font-size: 24rpx;
				margin-top: 20rpx;
			}

			.infoTop-box-info-write {
				color: #76625C;
				font-size: 26rpx;
				margin-top: 20rpx;
			}

			.infoTop-box-info-label {
				margin-top: 20rpx;

				.infoTop-box-info-labels {
					color: #76625C;
					font-size: 24rpx;
					border-radius: 24rpx;
					background-color: #FFDBD3;
					margin-right: 24rpx;
					padding: 10rpx 20rpx;
				}
			}
		}
	}

	.introduction {
		width: 100%;
		height: auto;
		background-color: #ffffff;
		border-radius: 40rpx 40rpx 0 0;
		margin-top: -90rpx;

		.introduction-box {
			width: 686rpx;
			height: 100%;
		}

		.introduction-box-cums {
			margin-top: 56rpx;

			.introduction-box-cums-itemt {
				font-size: 28rpx;
				color: #333333;
				text-align: center;

				text {
					font-size: 34rpx;
					font-weight: bold;
				}
			}

			.introduction-box-cums-itemx {
				color: #666666;
				font-size: 26rpx;
				text-align: center;
			}
		}

		.line {
			width: 100%;
			border-bottom: 1px solid #F0F0F0;
			margin: 30rpx 0;
		}

		.introduction-box-title {
			margin-top: 40rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}

		.introduction-box-content {
			margin-top: 24rpx;
			color: #333333;
			font-size: 26rpx;

		}

		.introduction-box-btn {
			width: 100%;
			margin-top: 40rpx;
			margin-bottom: 25rpx;

			.introduction-box-btns {
				width: 328rpx;
				height: 88rpx;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: bold;
			}

			.introduction-box-btns:nth-of-type(1) {
				border: 1px solid #FE7483;
				color: #FE7284;
			}

			.introduction-box-btns:nth-of-type(2) {
				background: linear-gradient(90deg, #FE956D 0%, #FE7085 100%);
				color: #ffffff;
			}
		}
	}

	.mulu {
		width: 100%;
		height: 106rpx;
		margin-top: 12rpx;
		background-color: #ffffff;

		.mulu-box {
			width: 686rpx;
			height: 100%;
		}

		.mulu-box-title {
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}

		.mulu-box-num {
			color: #999999;
			font-size: 26rpx;

			text {}
		}
	}

	.pl {
		width: 100%;
		height: auto;
		background-color: #ffffff;
		margin-top: 12rpx;

		.pl-box {
			width: 686rpx;
			height: 100%;
		}

		.pl-box-title {
			margin: 30rpx 0;

			.pl-box-title-name {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			.pl-box-title-txt {
				color: #999999;
				font-size: 26rpx;
			}
		}

		.pl-box-item {

			width: 100%;
			margin-bottom: 30rpx;

			.pl-box-item-info {
				image {
					width: 66rpx;
					height: 66rpx;
					border-radius: 50%;
				}
			}

			.pl-box-item-infos {
				margin-left: 12rpx;

				.pl-box-item-infos-name {
					color: #333333;
					font-size: 26rpx;

				}

				.pl-box-item-infos-time {
					color: #999999;
					font-size: 20rpx;
				}
			}

			.pl-box-item-content {
				margin-top: 20rpx;
				color: #333333;
				font-size: 26rpx;
			}

			.pl-box-item-zan {
				justify-content: end;
				margin-top: 6rpx;

				.pl-box-item-zan-item {
					color: #A4A4A4;
					font-size: 24rpx;
					margin-left: 36rpx;
				}
			}
		}

		.pl-box-more {
			width: 100%;
			border-top: 1px solid #F0F0F0;
			height: 90rpx;
			color: #333333;
			font-size: 26rpx;

		}


	}

	.pjSubmit {
		width: 100%;
		height: 105rpx;
		background-color: #ffffff;
		position: fixed;

		.pjSubmit-box {
			width: 686rpx;
			height: 67rpx;
		}

		.pjSubmit-box-share {
			margin-left: 20rpx;
			color: #626066;
		}
	}
</style>