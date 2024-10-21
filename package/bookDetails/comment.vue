<template>
	<view style="padding-bottom: 120rpx;">
		<view class="pl flex align-center justify-center">
			<view class="pl-box">
				<view class="pl-box-item" v-for="(item,index) in list" :key="index">
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
					</view>
				</view>
			</view>
		</view>
		<u-loadmore v-if="list.length>3" :status="status" />
		<empty v-if="list.length==0" txt="暂无评论" style="padding-bottom: 100rpx;" />

		<!-- 底部评论 -->
		<view class="pjSubmit flex align-center justify-center" :style="{bottom:bottom}">
			<view class="pjSubmit-box flex align-center justify-between">
				<u--input @blur="inputBindBlur" @confirm="startPinglun" prefixIcon="edit-pen-fill"
					:customStyle="customStyles" placeholder="请输入评论内容" shape="circle" border="none"
					v-model="pinglun"></u--input>
				<view @click="startPinglun()" class="pjSubmit-box-share flex align-center">
					<image style="width: 44rpx;height: 44rpx;margin-right: 10rpx;" src="../../static/image/my/send.png"
						mode=""></image>
					发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				limit: 10,
				pages: 1,
				list: [],
				courseId: '',
				customStyles: {
					background: '#F5F5F5',
					height: '100%',
					padding: '0 20rpx'
				},
				pinglun: '',
				bottom: '0px', //评论框距离底部的距离
				status: 'loadmore',
			};
		},
		onLoad(option) {
			if (option.courseId) {
				this.courseId = option.courseId
				this.getCourseComment()
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.getCourseComment()
		},
		onReachBottom() {
			if (this.page < this.pages) {
				this.page += 1
				this.status = 'loading'
				this.getCourseComment()
			} else {
				this.status = 'nomore'
			}
		},
		methods: {
			inputBindBlur() {
				this.bottom = '0px'
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
					page: this.page,
					limit: this.limit,
					courseId: this.courseId
				}
				this.$Request.getT('/app/courseComment/selectCourseComment', data).then(res => {
					uni.stopPullDownRefresh()
					if (res.code == 0) {
						this.pages = res.data.totalPage
						if (this.page < this.pages) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
						if (this.page == 1) {
							this.list = res.data.list
						} else {
							this.list = [...this.list, ...res.data.list]
						}
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
		}
	}
</script>

<style lang="scss">
	.pl {
		width: 100%;
		height: auto;
		background-color: #ffffff;
		// margin-top: 12rpx;
		padding: 20rpx 0;

		.pl-box {
			width: 686rpx;
			height: 100%;
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
	}

	.pjSubmit {
		width: 100%;
		height: 105rpx;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;

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