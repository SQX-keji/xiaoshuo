import configdata from './config'
import cache from './caches'

module.exports = {
	config: function(name) {
		var info = null;
		if (name) {
			var name2 = name.split("."); //字符分割
			if (name2.length > 1) {
				info = configdata[name2[0]][name2[1]] || null;
			} else {
				info = configdata[name] || null;
			}
			if (info == null) {
				let web_config = cache.get("web_config");
				if (web_config) {
					if (name2.length > 1) {
						info = web_config[name2[0]][name2[1]] || null;
					} else {
						info = web_config[name] || null;
					}
				}
			}
		}
		return info;
	},
	logout: function() {
		let that = this;
		uni.removeStorageSync("token");
		uni.removeStorageSync("userId");
		// console.log(uni.getStorageSync("token"),'---token----token')
		// return
		// uni.reLaunch({
		// 	url: '/pages/index/index'
		// })

	},
	post: function(url, data, header) {
		let that = this;
		header = header || "application/x-www-form-urlencoded";
		url = that.config("APIHOST") + url;
		let token = uni.getStorageSync("token");
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: "POST",
				header: {
					"content-type": header,
					"token": token
				},
				success: function(result) {
					if (result.data.code == 401) {
						that.logout();
					}
					succ.call(self, result.data)
				},
				fail: function(e) {
					error.call(self, e)
				}
			})
		})
	},
	postT: function(url, data, header) {
		let that = this;
		header = header || "application/x-www-form-urlencoded";
		url = that.config("APIHOST") + url;
		let token = uni.getStorageSync("token");
		if (token) {
			return new Promise((succ, error) => {
				uni.request({
					url: url,
					data: data,
					method: "POST",
					header: {
						"content-type": header,
						"token": token
					},
					success: function(result) {
						if (result.data.code == 401) {
							that.logout();
						}
						succ.call(self, result.data)
					},
					fail: function(e) {
						error.call(self, e)
					}
				})
			})
		} else {
			return new Promise((succ, error) => {
				uni.request({
					url: url,
					data: data,
					method: "POST",
					header: {
						"content-type": header,
					},
					success: function(result) {
						succ.call(self, result.data)
					},
					fail: function(e) {
						error.call(self, e)
					}
				})
			})
		}
	},
	postJson: function(url, data, header) {
		let that = this;
		header = header || "application/json";
		url = that.config("APIHOST") + url;
		let token = uni.getStorageSync("token");
		if (token) {
			return new Promise((succ, error) => {
				uni.request({
					url: url,
					data: data,
					method: "POST",
					header: {
						"content-type": header,
						"token": token
					},
					success: function(result) {
						if (result.data.code == 401) {
							that.logout();
						}
						succ.call(self, result.data)
					},
					fail: function(e) {
						error.call(self, e)
					}
				})
			})
		} else {
			return new Promise((succ, error) => {
				uni.request({
					url: url,
					data: data,
					method: "POST",
					header: {
						"content-type": header,
					},
					success: function(result) {
						succ.call(self, result.data)
					},
					fail: function(e) {
						error.call(self, e)
					}
				})
			})
		}
	},
	getT: function(url, data, header) {
		let that = this;
		header = header || "application/x-www-form-urlencoded";
		url = that.config("APIHOST") + url;
		let token = uni.getStorageSync("token");
		if (token) {
			return new Promise((succ, error) => {
				uni.request({
					url: url,
					data: data,
					method: "GET",
					header: {
						"content-type": header,
						"token": token
					},
					success: function(result) {
						if (result.data.code == 401) {
							that.logout();
						}
						succ.call(self, result.data)
					},
					fail: function(e) {
						error.call(self, e)
					}
				})
			})
		} else {
			return new Promise((succ, error) => {
				uni.request({
					url: url,
					data: data,
					method: "GET",
					header: {
						"content-type": header
					},
					success: function(result) {
						succ.call(self, result.data)
					},
					fail: function(e) {
						error.call(self, e)
					}
				})
			})
		}
	},
	get: function(url, data, header) {
		let that = this;
		header = header || "application/x-www-form-urlencoded";
		url = that.config("APIHOST") + url;
		let token = uni.getStorageSync("token");
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: "GET",
				header: {
					"content-type": header,
					"token": token
				},
				success: function(result) {
					if (result.data.code == 401) {
						that.logout();
					}
					succ.call(self, result.data)
				},
				fail: function(e) {
					error.call(self, e)
				}
			})
		})
	},
	getMsg: function(url, data, header) {
		let that = this;
		header = header || "application/x-www-form-urlencoded";
		url = that.config("APIHOST2") + url;
		let token = uni.getStorageSync("token");
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: "GET",
				header: {
					"content-type": header,
					"token": token
				},
				success: function(result) {
					// console.log(result)
					if (result.data.code == 401) {
						that.logout();
						uni.removeTabBarBadge({
							index: 2
						})
					}
					succ.call(self, result.data)
				},
				fail: function(e) {
					error.call(self, e)
				}
			})
		})
	}
}