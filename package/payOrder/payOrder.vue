<template>
	<view style="padding: 20rpx 0;">
		<!-- 视频简介 -->
		<view class="info flex align-center justify-center">
			<view class="info-box flex align-center">
				<view class="info-box-l">
					<image :src="titleImg" mode="aspectFill"></image>
				</view>
				<view class="info-box-r">
					<view class="info-box-r-t">
						{{type==1?name:courseDetailsName}}
					</view>
					<view class="info-box-r-b" v-if="type == 1">
						全书价格：
						<text>
							¥{{parsePrice(zongPrice)}}
						</text>
					</view>
					<view class="info-box-r-b" v-else>
						单章价格：
						<text>
							¥{{parsePrice(price)}}
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 价格提示 -->
		<view class="price flex align-center justify-center">
			<view class="price-box flex align-center justify-between">
				<view class="price-box-title">
					需支付
				</view>
				<view class="price-box-price" v-if="type==1">
					¥{{parsePrice(zongPrice)}}
				</view>
				<view class="price-box-price" v-else>
					¥{{parsePrice(price)}}
				</view>
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="pay flex align-center justify-center">
			<view class="pay-box">
				<view class="pay-box-title">
					支付方式
				</view>
				<u-radio-group activeColor="#FE7284" v-model="payAway" placement="column">
					<view class="pay-box-item flex align-center justify-between" v-for="(item,index) in payList"
						:key="index">
						<view class="pay-box-item-l flex align-center">
							<image :src="item.imgurl" mode=""></image>
							{{item.name}}
						</view>
						<view class="pay-box-item-r">
							<u-radio :name="item.payAway">
							</u-radio>
						</view>
					</view>

				</u-radio-group>
				<!-- <u-radio-group style="width: 100%;" size="44" v-model="payAway">
					<view class="pay-box-item flex align-center justify-between" v-for="(item,index) in payList"
						:key="index">
						<view class="pay-box-item-l flex align-center">
							<image :src="item.imgurl" mode=""></image>
							{{item.name}}
						</view>
						<view class="pay-box-item-r">
							<u-radio active-color="5074FF" :name="item.payAway"></u-radio>
						</view>
					</view>
				</u-radio-group> -->
			</view>
		</view>
		<!-- 支付 -->
		<view class="submit flex align-center justify-center">
			<view class="submit-box flex align-center justify-center" @click="getOrderInfo()">
				支付 ¥{{type==1?parsePrice(zongPrice):parsePrice(price)}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				courseId: '', //整部视频id
				courseDetailsId: '', //单集id
				titleImg: '', //图片
				courseDetailsName: '', //名称
				price: 0, //单价
				zongPrice: 0, //总价
				type: 1, //类型：1:整部 2:单部
				name: '', //全集名称
				payList: [],
				payAway: 1,
			};
		},
		onLoad(option) {
			// #ifdef APP
			this.payList = [{
					imgurl: '/static/image/pay/weixin.png',
					name: '微信支付',
					payAway: 1
				},
				{
					imgurl: '/static/image/pay/zhifubao.png',
					name: '支付宝支付',
					payAway: 2
				},
				{
					imgurl: '/static/image/pay/lingqian.png',
					name: '零钱支付',
					payAway: 3
				}
			]
			this.payAway = 1
			// #endif
			// #ifdef MP-WEIXIN
			this.payList = [{
					imgurl: '/static/image/pay/weixin.png',
					name: '微信支付',
					payAway: 1
				},
				{
					imgurl: '/static/image/pay/lingqian.png',
					name: '零钱支付',
					payAway: 3
				}
			]
			this.payAway = 1
			// #endif
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') !== -1) {
				this.payList = [{
						imgurl: '/static/image/pay/weixin.png',
						name: '微信支付',
						payAway: 1
					},
					{
						imgurl: '/static/image/pay/zhifubao.png',
						name: '支付宝支付',
						payAway: 2
					},
					{
						imgurl: '/static/image/pay/lingqian.png',
						name: '零钱支付',
						payAway: 3
					}
				]
				this.payAway = 1
			} else {
				this.payList = [{
						imgurl: '/static/image/pay/zhifubao.png',
						name: '支付宝支付',
						payAway: 2
					},
					{
						imgurl: '/static/image/pay/lingqian.png',
						name: '零钱支付',
						payAway: 3
					}
				]
				this.payAway = 2
			}
			// #endif

			if (option.info) {
				let info = JSON.parse(option.info)
				this.courseId = info.courseId
				this.courseDetailsId = info.courseDetailsId
				this.titleImg = info.titleImg
				this.courseDetailsName = info.courseDetailsName
				this.price = info.price
				this.zongPrice = info.zongPrice
				this.name = info.name
				this.type = info.type
			}
		},
		methods: {
			/**
			 * @param {Number} price
			 * 价格保留两位小数
			 */
			parsePrice(price) {
				return price.toFixed(2)
			},
			//生成订单
			getOrderInfo() {
				let data = {
					courseId: this.courseId
				}
				if (this.type != 1) { //购买单集
					data.courseDetailsId = this.courseDetailsId
				}
				this.$Request.getT('/app/order/insertCourseOrders', data).then(res => {
					if (res.code == 0) {
						this.payOrder(res.data.orders.ordersId)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})

			},
			/**
			 * @param {Object} orderId 订单id
			 */
			payOrder(orderId) {
				let that = this
				switch (this.payAway) { //1:微信支付,2:支付宝支付 3:零钱支付
					case 1: //微信支付
						// #ifdef MP-WEIXIN
						that.$Request.postT("/app/wxPay/wxPayJsApiOrder", {
							orderId: orderId,
						}).then(red => {
							if (red.code == 0) {
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: red.data.timestamp,
									nonceStr: red.data.noncestr,
									package: red.data.package,
									signType: red.data.signType,
									paySign: red.data.sign,
									success: function(redd) {
										uni.showLoading({
											title: '支付成功'
										});
										uni.hideLoading();
										setTimeout(function() {
											let data = {
												flag: true
											}
											uni.$emit('back', data)
											uni.navigateBack();
										}, 1000)
									},
									fail: function(err) {
										uni.hideLoading();
										that.$queue.showToast(
											'支付失败');
									}
								});
							} else {
								uni.showToast({
									title: red.msg,
									icon: 'none'
								})
							}
						});
						// #endif

						// #ifdef H5
						let ua = navigator.userAgent.toLowerCase();
						console.log(ua)
						if (ua.indexOf('micromessenger') !== -1) {
							that.$Request.postT("/app/wxPay/wxPayMpOrder", {
								orderId: orderId,
							}).then(red => {
								if (red.code == 0) {
									that.callPay(red.data);
								} else {
									that.isPay = true
									uni.showToast({
										title: red.msg,
										icon: 'none'
									})
								}
							});
						}

						// #endif

						// #ifdef APP-PLUS
						that.$Request.postT("/app/wxPay/payAppOrder", {
							orderId: orderId,
						}).then(red => {
							if (red.code == 0) {
								console.log(red, '+++++++++++++++++++++')
								that.setPayment('wxpay', JSON.stringify(red.data));
							} else {
								that.isPay = true
								uni.showToast({
									title: red.msg,
									icon: 'none'
								})
							}
						});
						// #endif
						break;
					case 2: //支付宝
						// #ifdef H5
						that.$Request.postT("/app/aliPay/payOrder", {
							orderId: orderId,
							classify: 2
						}).then(red => {
							if (red.code == 0) {
								const div = document.createElement('div')
								div.innerHTML = red.data //此处form就是后台返回接收到的数据
								document.body.appendChild(div)
								document.forms[0].submit()
							} else {
								uni.showToast({
									title: red.msg,
									icon: 'none'
								})
							}
						});
						// #endif
						// #ifdef APP-PLUS
						that.$Request.postT("/app/aliPay/payOrder", {
							orderId: orderId,
							classify: 1
						}).then(red => {
							if (red.code == 0) {
								that.setPayment('alipay', red.data);
							} else {
								uni.showToast({
									title: red.msg,
									icon: 'none'
								})
							}
						});
						// #endif
						break;
					default: //零钱
						that.$Request.postT("/app/order/payOrders", {
							orderId: orderId,
						}).then(res => {
							if (res.code == 0) {
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(function() {
									let data = {
										flag: true
									}
									uni.$emit('back', data)
									uni.navigateBack();

								}, 1000)
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						});
						break;
				}
			},
			callPay: function(response) {
				if (typeof WeixinJSBridge === "undefined") {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(response), false);
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(response));
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(response));
					}
				} else {
					this.onBridgeReady(response);
				}
			},
			onBridgeReady: function(response) {
				let that = this;
				if (!response.package) {
					return;
				}
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": response.appid, //公众号名称，由商户传入
						"timeStamp": response.timestamp, //时间戳，自1970年以来的秒数
						"nonceStr": response.noncestr, //随机串
						"package": response.package,
						"signType": response.signType, //微信签名方式：
						"paySign": response.sign //微信签名
					},
					function(res) {
						if (res.err_msg === "get_brand_wcpay_request:ok") {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							uni.removeStorageSync('EditAddress')
							uni.showLoading({
								title: '支付成功'
							});
							uni.hideLoading();
							setTimeout(function() {
								let data = {
									flag: true
								}
								uni.$emit('back', data)
								uni.navigateBack();
							}, 1000)
						} else {
							uni.hideLoading();
						}
						WeixinJSBridge.log(response.err_msg);
					}
				);
			},
			setPayment(name, order) {
				let that = this;
				uni.requestPayment({
					provider: name,
					orderInfo: order, //微信、支付宝订单数据
					success: function(res) {
						uni.showLoading({
							title: '支付成功'
						});
						uni.hideLoading();
						setTimeout(function() {
							let data = {
								flag: true
							}
							uni.$emit('back', data)
							uni.navigateBack();
						}, 1000)
					},
					fail: function(err) {
						uni.hideLoading();
						console.log(err, 12)
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	/deep/.u-radio {
		display: block !important;
	}

	.info {
		width: 100%;
		height: auto;

		.info-box {
			width: 686rpx;
			height: 100%;
			border-radius: 24rpx;
			padding: 30rpx;
			background-color: #ffffff;
		}

		.info-box-l {
			width: 200rpx;
			height: 150rpx;
			border-radius: 8rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
			}
		}

		.info-box-r {
			margin-left: 30rpx;

			.info-box-r-t {
				font-weight: bold;
			}

			.info-box-r-b {
				margin-top: 20rpx;
				color: #FE7284;

				text {
					font-size: 32rpx;
					font-weight: bold;
				}
			}
		}
	}

	.price {
		width: 100%;
		height: auto;
		margin-top: 30rpx;

		.price-box {
			width: 686rpx;
			height: 100%;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding: 30rpx;
		}

		.price-box-price {
			color: #FE7284;
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.pay {
		width: 100%;
		height: auto;
		margin-top: 30rpx;

		.pay-box {
			width: 686rpx;
			height: 100%;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding: 30rpx;
		}

		.pay-box-title {
			width: 100%;
			font-size: 32rpx;
			font-weight: bold;

		}

		.pay-box-item {
			width: 100%;
			margin-top: 40rpx;

			.pay-box-item-l {
				font-weight: 500;

				image {
					width: 60rpx;
					height: 60rpx;
					margin-right: 30rpx;
				}
			}
		}
	}

	.submit {
		width: 100%;
		height: auto;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		padding: 20rpx 0;

		.submit-box {
			width: 686rpx;
			height: 88rpx;
			border-radius: 40rpx;
			background: linear-gradient(90deg, #FE956D 0%, #FE7085 100%);
			color: #ffffff;
			font-weight: 500;
		}
	}
</style>