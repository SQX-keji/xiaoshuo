<template>
	<view class="container">
		<view class="wrapper">
			<view class="input-content">
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<view class="title">手机号</view>
					<input type="number" :value="mobile" placeholder="请输入手机号" maxlength="11" data-key="mobile"
						@input="inputChange" />
				</view>
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">验证码</text>
					<input type="number" :value="code" placeholder="请输入验证码" maxlength="6" data-key="code"
						@input="inputChange" @confirm="toLogin" />
					<button class="send-msg" @click="sendMsg" :disabled="sending">{{sendTime}}</button>
				</view>
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">设置密码</text>
					<input type="password" :value="password" placeholder="请设置新密码" placeholder-class="input-empty"
						maxlength="20" minlength="6" data-key="password" @input="inputChange" @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin">立即重置</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
				mobile: '',
				password: '',
				sending: false,
				sendTime: '获取验证码',
				count: 60,
				logining: false
			}
		},

		methods: {
			sendMsg() {
				const {
					mobile
				} = this;
				if (!mobile) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 1000
					})
				} else if (mobile.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 1000
					})
				} else {
					uni.showLoading({
						title: '正在发送验证码...'
					})
					this.$Request.get('/app/Login/sendMsg/' + mobile + '/forget').then(res => {
						if (res.code === 0) {
							this.sending = true;
							uni.showToast({
								title: '验证码发送成功请注意查收',
								icon: 'none',
								duration: 1000
							})
							this.countDown();
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								showCancel: false,
								title: '短信发送失败',
								content: res.msg ? res.msg : '请一分钟后再获取验证码'
							});
						}
					});
				}
			},
			countDown() {
				const {
					count
				} = this;
				if (count === 1) {
					this.count = 60;
					this.sending = false;
					this.sendTime = '获取验证码'
				} else {
					this.count = count - 1;
					this.sending = true;
					this.sendTime = count - 1 + '秒后重新获取';
					setTimeout(this.countDown.bind(this), 1000);
				}
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},


			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			toLogin() {
				const {
					mobile,
					password,
					code
				} = this;
				if (!mobile) {
					// this.$queue.showToast("请输入手机号");
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 1000
					})
				} else if (!code) {
					// this.$queue.showToast("密码位数必须大于六位");
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						duration: 1000
					})
				} else if (!password) {
					// this.$queue.showToast("请设置密码");
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
						duration: 1000
					})
				} else {
					this.logining = true;
					// this.$queue.showLoading("正在修改密码中...");
					uni.showLoading({
						title: '正在修改密码中...'
					})
					this.$Request.post('/app/Login/forgetPwd?pwd=' + password + '&phone=' + mobile + '&msg=' + code).then(
						res => {
							// this.$Request.postJson("/appLogin/forgetPwd",{
							//     pwd: password,
							//     phone: mobile,
							//     msg: code
							// }).then(res => {
							uni.hideLoading();
							if (res.code === 0) {
								uni.showToast({
									title: '密码找回成功',
									icon: 'none'
								});
								setTimeout(function() {
									uni.navigateTo({
										url: '/pages/login/login'
									});
								}, 1000)

							} else {

								uni.showModal({
									showCancel: false,
									title: '密码找回失败',
									content: res.msg,
								});
							}
						});
				}
			},
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.send-msg {
		border-radius: 30px;
		color: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
		background: linear-gradient(0deg, #FE956D 0%, #FE7085 100%);
	}

	.container {
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 20px;
	}


	.input-content {
		padding: 0 20px;
	}



	.confirm-btn {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: linear-gradient(0deg, #FE956D 0%, #FE7085 100%);
		/* background: linear-gradient(to left, #3a55b9 0, #5074FF 100%); */
		color: #fff;
		font-size: 32rpx;

		&:after {
			border-radius: 60px;
		}
	}
</style>