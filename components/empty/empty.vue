<template>
	<view class="empty flex align-center justify-center flex-wrap">
		<image src="../../static/image/empty.png" clas mode=""></image>
		<view class="empty-txt">
			{{txt}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "empty",
		props: {
			/**
			 * @txt
			 * 显示文字
			 */
			txt: {
				type: String,
				default: '暂无数据'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.empty {
		width: 100%;
		padding-top: 40rpx;

		image {
			width: 500rpx;
			height: 500rpx;
		}

		.empty-txt {
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			color: #999999;
			font-weight: 700;
		}
	}
</style>