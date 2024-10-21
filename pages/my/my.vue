<template>
	<view>
		<!-- 自定义导航栏 -->
		<u-navbar :placeholder="true" :leftIcon="leftIcon" bgColor="#fef0f2" title="我的" :autoBack="true">
		</u-navbar>
		<view class="info flex align-center justify-center">
			<view class="info-box">
				<!-- 登录信息 -->
				<view @click="token?'':goNav('/pages/login/login')"
					class="info-box-info flex align-center justify-between">
					<view class="info-box-info-l flex align-center">
						<image :src="avatar" mode=""></image>
						<view class="info-box-info-l-b">
							<view class="info-box-info-l-b-name">
								{{userName}}
							</view>
							<view v-if="token" class="info-box-info-l-b-id">
								ID:{{invitationCode}}
							</view>
						</view>
					</view>
					<view class="info-box-info-r">
						<u-icon name="arrow-right" color="#999999" size="20"></u-icon>
					</view>
				</view>
				<!-- 记录 -->
				<view class="info-box-mum flex align-center justify-between">
					<view style="margin-left: 10rpx;" class="info-box-mum-item"
						@click="goSwitchTabbar('/pages/bookshelf/bookshelf')">
						<view class="info-box-mum-item-num">
							{{myLoveNum}}
						</view>
						<view class="info-box-mum-item-title">
							我的书架
						</view>
					</view>
					<view class="info-box-mum-item" @click="goSwitchTabbar('/pages/bookshelf/bookshelf')">
						<view class="info-box-mum-item-num">
							{{myZhui}}
						</view>
						<view class="info-box-mum-item-title">
							我的阅读
						</view>
					</view>
					<view style="margin-right: 10rpx;" class="info-box-mum-item" @click="goNav('/package/jifen/jifen')">
						<view class=" info-box-mum-item-num">
							{{jifen}}
						</view>
						<view class="info-box-mum-item-title">
							我的积分
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- vip -->
		<view v-if="isVips == '是'" @click="goNav('/package/vip/vip')" class="vip flex align-center justify-center">
			<view class="vip-box flex align-center justify-between">
				<view class="vip-box-l flex align-center">
					<view class="vip-box-l-l">
						{{isVIP?'会员用户':'开通会员'}}
					</view>
					<image src="../../static/image/my/Vips.png" mode=""></image>
					<view class="vip-box-l-r">
						{{endTime?endTime+'到期':'升级VIP，省更多钱'}}
					</view>
				</view>
				<view v-if="!isVIP" class="vip-box-r flex align-center justify-center">
					立即开通
				</view>
			</view>
		</view>
		<!-- 钱包 -->
		<view class="money flex align-center justify-center">
			<view class="money-box">
				<view class="money-box-title flex align-center justify-between">
					<view class="money-box-title-l">
						钱包余额
					</view>
					<view @click="isShoMoney = !isShoMoney" class="money-box-title-r">
						<u-icon :name="isShoMoney?'eye':'eye-off'" color="#333333" size="30"></u-icon>
					</view>
				</view>
				<view class="money-box-price">
					<block v-if="isShoMoney">
						<text>¥</text>
						{{formatNumber(moneyNum)}}
					</block>
					<block v-else>
						****
					</block>
				</view>
				<view class="money-box-btn flex align-center justify-between">
					<view class="money-box-btn-l" @click="goNav('/package/invite/invite')">
						<image src="../../static/image/my/qrCode.png" mode=""></image>
					</view>
					<view class="money-box-btn-r flex align-center">
						<view @click="goNav('/package/wallet/wallet')"
							class="money-box-btn-r-t flex align-center justify-center">
							提现
						</view>
						<view @click="goNav('/package/wallet/recharge')"
							class="money-box-btn-r-c flex align-center justify-center">
							充值
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 常用工具 -->
		<view class="tool flex align-center justify-center">
			<view class="tool-box">
				<view class="tool-box-title">
					常用工具
				</view>
				<view class="tool-box-content flex align-center justify-between flex-wrap">
					<view class="tool-box-content-item flex align-center justify-center flex-wrap"
						@click="goSwitchTabbar('/pages/bookshelf/bookshelf')">
						<view class="tool-box-content-item-img">
							<image src="../../static/image/my/icon/vlishi.png" mode=""></image>
						</view>
						<view class="tool-box-content-item-txt">
							观看历史
						</view>
					</view>
					<view class="tool-box-content-item flex align-center justify-center flex-wrap" @click="goMsg()">
						<view class="tool-box-content-item-img">
							<image src="../../static/image/my/icon/vkf.png" mode=""></image>
						</view>
						<view class="tool-box-content-item-txt">
							联系客服
						</view>
					</view>
					<view class="tool-box-content-item flex align-center justify-center flex-wrap" @click="loginOut">
						<view class="tool-box-content-item-img">
							<image src="../../static/image/my/icon/setting.png" mode=""></image>
						</view>
						<view class="tool-box-content-item-txt">
							退出登录
						</view>
					</view>
					<view class="tool-box-content-item flex align-center justify-center flex-wrap" style="height: 0;">

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				leftIcon: '',
				userInfo: {},
				avatar: '', //头像
				userName: '', //用户名
				invitationCode: '', //邀请码
				myLoveNum: 0, //我的书架
				myZhui: 0, //我的阅读
				jifen: 0, //积分
				isVips: '否', //是否显示会员
				isShoMoney: false, //是否显示余额
				isVIP: false,
				endTime: '', //会员到期时间
				token: '', //用户token
			};
		},
		onLoad() {

		},
		onShow() {
			this.isVips = uni.getStorageSync('isVips') ? uni.getStorageSync('isVips') : '否'
			if (uni.getStorageSync('token')) {
				this.getUserInfo()
				this.getJifen()
				this.getMyZhuiNum()
				this.getMyLoveNum()
				this.getMyMoney()
				this.getMyVip()
				this.token = uni.getStorageSync('token')
			} else {
				this.avatar = '../../static/logo.png'
				this.userName = '登录'
				this.invitationCode = ''
				this.myLoveNum = 0
				this.myZhui = 0
				this.jifen = 0
				this.moneyNum = 0
				this.token = ''
			}
		},
		methods: {
			loginOut() {
				uni.showModal({
					title: '退出提醒',
					content: '确定要退出登录么',
					confirmColor: '#FE7085',
					success: e => {
						if (e.confirm) {
							this.avatar = '../../static/images/me/head.png';
							this.userName = '';
							// this.isLogin = false
							// 清除本地数据
							uni.removeStorageSync('token')
							uni.removeStorageSync('userName')
							uni.removeStorageSync('avatar')
							uni.removeStorageSync('phone')
							uni.removeStorageSync('invitationCode')
							uni.removeStorageSync('sex')
							uni.removeStorageSync('userId')
							// uni.removeStorageSync('openId')
							uni.removeStorageSync('zhiFuBao')
							uni.removeStorageSync('zhiFuBaoName')
							uni.removeStorageSync('isVIP')
							uni.showToast({
								icon: 'none',
								title: '退出登录成功'
							})
							setTimeout(function() {
								uni.navigateBack()
							}, 1500)
						}
					}
				});
			},
			//联系客服
			goMsg() {
				let kefu = uni.getStorageSync('kefu'); // 用户端联系方式 1 手机号 2企业微信
				let kefuPhone = uni.getStorageSync('kefuPhone');
				if (kefu == 1) {
					uni.navigateTo({
						url: '/package/setting/kefu'
					})
				} else if (kefu == 3) {
					uni.makePhoneCall({
						phoneNumber: kefuPhone //仅为示例
					});
				} else if (kefu == 2) {
					// #ifdef MP-WEIXIN
					let that = this
					try {
						wx.openCustomerServiceChat({
							extInfo: {
								url: uni.getStorageSync('kefuUrl')
							},
							corpId: uni.getStorageSync('kefuAppId'),
							success(res) {},
							fail(res) {
								console.error(res)
							}
						})
					} catch (error) {
						console.error("catchcatch" + error)
						uni.showToast({
							title: '请更新至微信最新版本'
						});
					}
					// #endif
					// #ifndef MP-WEIXIN
					let url = uni.getStorageSync('kefuUrl');
					if (url.indexOf('/pages/') !== -1 || url.indexOf('/my/') !== -1) {
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
					// #endif
				}
			},
			//switchTab跳转
			goSwitchTabbar(url) {
				uni.setStorageSync('history', true)
				uni.switchTab({
					url: url
				})
			},
			//跳转
			goNav(url) {
				if (uni.getStorageSync('token')) {
					uni.navigateTo({
						url: url
					})
				} else {
					this.goLogin()
				}
			},
			//我的vip
			getMyVip() {
				let data = {
					userId: uni.getStorageSync('userId')
				}
				this.$Request.getT('/app/UserVip/selectUserVip', data).then(res => {
					if (res.code == 0 && res.data && res.data.isVip == 2) {
						this.isVIP = true;
						this.endTime = res.data.endTime
						uni.setStorageSync('isVIP', true)
					} else {
						this.isVIP = false;
						this.endTime = ''
						uni.setStorageSync('isVIP', false)
					}
				})
			},
			/**
			 * @param {Number} num
			 * @param 保留两位小数
			 */
			formatNumber(num) {
				// 判断是否为整数
				if (Number.isInteger(num)) {
					return num.toFixed(2);
				} else {
					return num.toFixed(2).replace(/\.?0+$/, '');
				}
			},
			/**
			 * 获取余额
			 */
			getMyMoney() {
				this.$Request.getT('/app/moneyDetails/selectUserMoney').then(res => {
					if (res.code == 0) {
						this.$Request.getT('/app/invite/selectInviteMoney').then(ret => {
							if (ret.code == 0) {
								this.moneyNum = Number(res.data.money) + Number(ret.data.inviteMoney
									.money)
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//获取我喜欢的数量
			getMyLoveNum() {
				let data = {
					page: 1,
					limit: 1,
					classify: 1
				}
				this.$Request.getT('/app/courseCollect/selectByUserId', data).then(res => {
					if (res.code == 0) {
						this.myLoveNum = res.data.total
					} else {
						this.myLoveNum = 0
					}
				})
			},
			//获取我追剧的数量
			getMyZhuiNum() {
				let data = {
					page: 1,
					limit: 1,
					classify: 3
				}
				this.$Request.getT('/app/courseCollect/selectByUserId', data).then(res => {
					if (res.code == 0) {
						this.myZhui = res.data.total
					} else {
						this.myZhui = 0
					}
				})
			},
			/**
			 * 获取积分
			 */
			getJifen() {
				this.$Request.getT('/app/integral/selectByUserId').then(res => {
					if (res.code == 0) {
						this.jifen = res.data.integralNum
					} else {
						this.jifen = 0
					}
				})
			},
			//获取用户信息
			getUserInfo() {
				this.$Request.getT('/app/user/selectUserById').then(res => {
					if (res.code == 0) {
						this.userName = res.data.userName
						if (res.data.avatar) {
							this.avatar = res.data.avatar
						} else {
							this.avatar = '../../static/logo.png'
						}

						this.invitationCode = res.data.invitationCode
						uni.setStorageSync('userName', res.data.userName)
						uni.setStorageSync('avatar', res.data.avatar)
						uni.setStorageSync('invitationCode', res.data.invitationCode)
					} else {
						this.goLogin()
					}
				})
			},
			//去登录
			goLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
		}
	}
</script>

<style lang="scss">
	.info {
		width: 100%;
		height: auto;
		background: linear-gradient(to bottom, #fef0f2, #f5f5f5);
		padding: 20rpx 0;

		.info-box {
			width: 686rpx;
			height: 100%;

			.info-box-info-l {
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.info-box-info-l-b {
					margin-left: 20rpx;

					.info-box-info-l-b-name {
						color: #333333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.info-box-info-l-b-id {
						color: #999999;
						font-size: 26rpx;

					}
				}
			}

			.info-box-mum {
				margin-top: 80rpx;
				width: 100%;

				.info-box-mum-item-num {
					text-align: center;
					color: #333333;
					font-size: 38rpx;
					font-weight: bold;
				}

				.info-box-mum-item-title {
					text-align: center;
					color: #999999;
					font-size: 26rpx;
					margin-top: 10rpx;
				}
			}
		}
	}

	.vip {
		width: 100%;
		height: 100rpx;
		margin-top: 10rpx;

		.vip-box {
			width: 686rpx;
			height: 100%;
			background-color: #333333;
			border-radius: 16rpx;
			padding: 0 30rpx;
		}

		.vip-box-l {
			image {
				width: 24rpx;
				height: 22rpx;
				margin-left: 6rpx;
			}
		}

		.vip-box-l-l {
			font-size: 32rpx;
			font-weight: bold;
			color: #FFF0E5;
			line-height: 32rpx;
			background: linear-gradient(0deg, #D9C7A7 0%, #F1DEC3 44.921875%, #C8A076 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		.vip-box-l-r {
			color: #FFE38E;
			font-size: 26rpx;
			margin-left: 20rpx;
		}

		.vip-box-r {
			width: 130rpx;
			height: 55rpx;
			background: linear-gradient(0deg, #FBE2B7 0%, #FCC573 100%);
			// box-shadow: 0px -3rpx 9rpx 0rpx rgba(255, 255, 255, 0.46);
			border-radius: 30rpx;
			color: #9B5605;
			font-size: 26rpx;
		}
	}

	.money {
		width: 100%;
		height: auto;
		margin-top: 20rpx;

		.money-box {
			width: 686rpx;
			height: 100%;
			border-radius: 24rpx;
			// background: linear-gradient(-90deg, #91A4FF 0%, #5A77FB 100%);
			background-color: #FFFFFF;
			padding: 30rpx;
		}

		.money-box-title-l {
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}

		.money-box-price {
			color: #333333;
			font-size: 50rpx;
			margin-top: 36rpx;

			text {
				font-size: 30rpx;
			}

		}

		.money-box-btn {
			margin-top: 38rpx;

			.money-box-btn-l {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;

				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;

				}
			}

			.money-box-btn-r-t {
				width: 194rpx;
				height: 64rpx;
				border-radius: 32rpx;
				background-color: #FFFFFF;
				color: #FE7582;
				font-size: 26rpx;
				margin-right: 30rpx;
				border: 1px solid #FE7582;
			}

			.money-box-btn-r-c {
				width: 194rpx;
				height: 64rpx;
				border-radius: 32rpx;
				background: linear-gradient(to right, #FE956D 0%, #FE7085 100%);
				color: #FFFFFF;
				font-size: 26rpx;
			}
		}
	}

	.tool {
		width: 100%;
		height: auto;
		margin-top: 20rpx;

		.tool-box {
			width: 686rpx;
			height: 100%;
			background-color: #FFFFFF;
			border-radius: 24rpx;
		}

		.tool-box-title {
			width: 100%;
			line-height: 96rpx;
			color: #1A1A1A;
			font-size: 32rpx;
			font-weight: bold;
			padding: 0 30rpx;
			// border-bottom: 1px solid #E6E6E6;
		}

		.tool-box-content {
			width: 100%;
			height: auto;
			padding: 30rpx;
		}

		.tool-box-content-item {
			width: 130rpx;
			height: auto;
			margin-bottom: 50rpx;
		}

		.tool-box-content-item-img {
			width: 50rpx;
			height: 50rpx;

			image {
				width: 50rpx;
				height: 50rpx;
			}
		}

		.tool-box-content-item-txt {
			width: 100%;
			text-align: center;
			margin-top: 10rpx;
			color: #333333;
			font-size: 24rpx;
		}
	}
</style>