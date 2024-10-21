<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			// 激励广告id	252
			this.$Request.get('/app/common/type/252').then(res => {
				if (res.code == 0 && res.data) {
					uni.setStorageSync('adUnitId', res.data.value)
				}
			});
			// 是否开启看广告	251
			this.$Request.get('/app/common/type/251').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						uni.setStorageSync('isGuanggao', res.data.value)
					}
				}
			});
			this.$Request.get('/app/common/type/202').then(res => { //客服配置  1  二维码客服 2 微信公众号客服  3电话客服 
				if (res.code == 0 && res.data) {
					uni.setStorageSync('kefu', res.data.value)
				}
			});
			this.$Request.get('/app/common/type/206').then(res => { //客服电话 
				if (res.code == 0 && res.data) {
					uni.setStorageSync('kefuPhone', res.data.value)
				}
			});
			this.$Request.get('/app/common/type/204').then(res => { //微信客服链接 
				if (res.code == 0 && res.data) {
					uni.setStorageSync('kefuUrl', res.data.value)
				}
			});
			this.$Request.get('/app/common/type/203').then(res => { //微信客服appid   
				if (res.code == 0 && res.data) {
					uni.setStorageSync('kefuAppId', res.data.value)
				}
			});
			//会员开关
			this.$Request.get('/app/common/type/248').then(res => { //微信客服appid
				if (res.code == 0 && res.data) {
					uni.setStorageSync('isVips', res.data.value)
				}
			});
			//热搜词 249
			this.$Request.get('/app/common/type/249').then(res => { //热搜词
				if (res.code == 0 && res.data) {
					uni.setStorageSync('moreSearch', res.data.value)
				}
			});
			//安卓下载地址 49
			this.$Request.get('/app/common/type/49').then(res => { //热搜词
				if (res.code == 0 && res.data) {
					uni.setStorageSync('AppUrl', res.data.value)
				}
			});

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import 'static/css/main.css';

	page {
		background-color: #F5F5F5;
	}
</style>