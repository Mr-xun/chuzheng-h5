<template>
	<div class="detail-container theme-color f14">
		<div class="company-info bg-white mb10">
			<h5 class="comp-name theme-color f16">
				{{ detailInfo.companyName }}
				<em
					:class="`status-dot status__${detailInfo.credibilityId}`"
				></em>
			</h5>
			<ul class="label-box flex-cross-center">
				<li class="label-item flex-all-center">
					<!-- <van-icon class="label-icon" name="passed" />
                    <span>已认证</span> -->
					<img
						class="verify-label"
						src="../../assets/images/verified.png"
						alt=""
					/>
				</li>
			</ul>
		</div>
		<div class="recruit-subject bg-white mb10 flex-between-center">
			<span class="recruit-title">发单编号</span>
			<span class="recruit-name">{{
				detailInfo.publishOrderNumber
			}}</span>
		</div>
		<div class="recruit-subject bg-white mb10 flex-between-center">
			<span class="recruit-title">招工主体</span>
			<span class="recruit-name">{{ detailInfo.publishName }}</span>
		</div>
		<div class="project-name bg-white mb10 flex-between">
			<h6 class="pro-title flex-between-center">
				项目名称
				<span
					class="excess-time time"
					v-if="
						detailInfo.isUrgent &&
						!detailInfo.isStop &&
						detailInfo.timerDiff > 0
					"
				>
					{{ timeChange(detailInfo.timerDiff) }}
				</span>
			</h6>
			<p class="pro-name" v-if="detailInfo.titleName">
				<span
					class="urgent"
					v-if="detailInfo.isUrgent && detailInfo.timerDiff > 0"
					>急招</span
				>
				<span v-else>招</span>{{ detailInfo.titleName }}
			</p>
		</div>
		<div class="project-domain bg-white mb10">
			<h6 class="domain-title">项目需求</h6>
			<p class="domain-des">{{ detailInfo.projectRequirement }}</p>
		</div>
		<div class="project-address bg-white mb10">
			<h6 class="adress-title">
				项目地址
				<button
					@click="openGD"
					class="op-gd"
					v-if="routeInfo.source == 1"
				>
					高德导航
				</button>
			</h6>
			<div class="adress-map">
				<el-amap
					class="amap-box"
					vid="amap-vue"
					:center="mapCenter"
					:zoom="13"
				>
					<el-amap-marker
						v-for="(marker, index) in markers"
						:position="marker"
						:key="index"
						content="<img src='http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png' style='width:15px;height:25px;'></img>"
						:offset="[0, -8]"
					>
						<div class="marker-content">
							<div
								class="address-name f12"
								v-if="markerObj.addressName"
							>
								{{ markerObj.addressName }}
							</div>
							<img
								class="address-coord"
								src="../../assets/images/marker-coord.png"
								alt=""
							/>
						</div>
					</el-amap-marker>
				</el-amap>
			</div>
		</div>
		<div
			class="drawing-box bg-white mb10"
			v-if="detailInfo.designStatus != 0"
		>
			<h6 class="drawing-title">图纸</h6>
			<p v-if="detailInfo.designStatus == 1">
				上传的图纸后台待处理，处理后可查看对应图
			</p>
			<div class="drawing-imgs" v-if="detailInfo.designStatus == 2">
				<img
					:src="item"
					alt
					v-for="(item, index) in detailInfo.designUrls"
					:key="index"
				/>
			</div>
		</div>
		<div
			class="drawingAndVideo-box bg-white mb10"
			v-if="detailInfo.pictures && detailInfo.pictures.length"
		>
			<h6 class="drawing-title">图片</h6>
			<div class="drawing-imgs">
				<img
					:src="item"
					alt
					v-for="(item, index) in detailInfo.pictures"
					:key="index"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";

export default {
	name: "RecruitDetail",
	data() {
		return {
			detailInfo: {},
			markerObj: {
				addressName: "",
				position: [],
			},
			mapCenter: [116.398055, 39.907046],
			markers: [[116.398055, 39.907046]],
			timer: null,
			linkUrl: "",
			routeInfo: {
				source: "", //1 端内
				publishInfoId: "",
				publishId: "",
			},
		};
	},
	mounted() {
		this.getDetail();
		let { source, publishInfoId, publishId } = this.$route.query;
		this.routeInfo = {
			source,
			publishInfoId,
			publishId,
		};
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.beginTimer();
	},
	destroyed() {
		clearInterval(this.timer);
	},
	methods: {
		beginTimer() {
			//这个计时器是每秒减去数组中指定字段的时间
			this.timer = setInterval(() => {
				if (this.detailInfo.timerDiff > 0) {
					this.$set(
						this.detailInfo,
						"timerDiff",
						this.detailInfo.timerDiff - 1
					);
				}
			}, 1000);
		},
		timeChange(timerDiff) {
			if (timerDiff < 0) {
				return "00:00:00";
			} else {
				//求天时分秒 leftDate是毫秒
				let hour = parseInt(timerDiff / (60 * 60));
				let minu = parseInt((timerDiff / 60) % 60);
				let sec = parseInt(timerDiff % 60);
				let showHour = hour < 10 ? "0" + hour : hour;
				let showMinu = minu < 10 ? "0" + minu : minu;
				let showSec = sec < 10 ? "0" + sec : sec;
				return `${showHour}:${showMinu}:${showSec}`;
			}
		},
		is_weixin() {
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				return true;
			} else {
				return false;
			}
		},
		openGD() {
			window.android.back(`${this.mapCenter[0]},${this.mapCenter[1]}`);
		},
		android(long, lat) {
			var longitude = this.mapCenter[0];
			var latitude = this.mapCenter[1];
			console.log(longitude, latitude);
		},
		toGD() {
			const ua = navigator.userAgent;
			const isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			const isAndroid =
				ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1;
			if (this.is_weixin()) {
				//微信
				window.location.href = this.linkUrl;
				console.log("微信环境");
			} else if (isiOS) {
				//IOS
				let url = `iosamap://navi?sourceApplication=amap&poiname=${this.markerObj.addressName}&poiid=BGVIS&lat=${this.mapCenter[1]}&lon=${this.mapCenter[0]}&dev=1&style=2`;
				window.open(url, "_blank");
				console.log("IOS");
				return;
			} else if (isAndroid) {
				//Android
				let url = `androidamap://navi?sourceApplication=amap&poiname=${this.markerObj.addressName}&lat=${this.mapCenter[1]}&lon=${this.mapCenter[0]}&dev=1&style=2`;
				window.open(url, "_blank");
				console.log("Android");
				return;
			} else {
				this.android(); //原生
				console.log("原生");
				return;
			}
		},
		getDetail() {
			let { publishInfoId, publishId } = this.$route.query;
			let params = {
				publishInfoId,
				publishId,
			};
			this.$api
				.bill_detail(params)
				.then((res) => {
					let { data } = res.data;
					this.detailInfo = data.publish;
					let curTimer = eval("new Date()").getTime();
					let expirationTimer = new Date(
						this.detailInfo.expirationDate.replace(/-/g, "/")
					).getTime();
					let timerDiff = (expirationTimer - curTimer) / 1000;
					this.$set(this.detailInfo, "timerDiff", timerDiff);
					this.setPosition();
				})
				.catch((err) => {
					console.log(err);
				});
		},
		handler(item) {
			console.log(item, "click");
		},
		setPosition() {
			let position =
				this.detailInfo.selectAddress || this.detailInfo.detailAddress;
			axios
				.get(
					`https://restapi.amap.com/v3/geocode/geo?address=${position}&key=d27c8c33e47aea8fa848fb2d2b1d365c`
				)
				.then((res) => {
					let { status } = res.data;
					if (status == 1) {
						let rectangle = res.data.geocodes[0].location;
						let lnglat = rectangle.split(",");
						let lng = lnglat[0];
						let lat = lnglat[1];
						this.mapCenter = [lng, lat];
						this.markerObj.position = [lng, lat];
						this.markers = [[lng, lat]];
						this.markerObj.addressName =
							res.data.geocodes[0].formatted_address;
						// this.marker.template = `<button @click="handler(${res.data.geocodes[0]})">${res.data.geocodes[0].formatted_address}</button>`;
						this.linkUrl = `https://uri.amap.com/marker?position=${res.data.geocodes[0].location}&name=${res.data.geocodes[0].formatted_address}`;
					}
				})
				.catch((error) => {
					this.$message.error(error);
				});
		},
	},
};
</script>
<style lang="scss">
$themeFontColor: rgba(51, 51, 51, 1);
$labelBuleColor: rgba(70, 101, 254, 1);
$labelRedColor: rgba(238, 107, 117, 1);
$labelOrangeColor: rgba(238, 189, 12, 1);

// 同标名称
@mixin title-name {
	font-weight: 500;
	line-height: 16px;
	margin-bottom: 7px;
}
.marker-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	.address-name {
		text-align: center;
		width: 180px;
		padding: 10px 20px 20px;
		line-height: 18px;
		background: url("../../assets/images/marker-adress.png");
		background-size: 100% 100%;
	}
	b {
		color: red;
	}
}
.label-blue-bg {
	background: rgba(225, 238, 254, 1);
	border: 1px solid $labelBuleColor;
	color: $labelBuleColor;
}
.label-red-bg {
	background: rgba(252, 239, 240, 1);
	border: 1px solid $labelRedColor;
	color: $labelRedColor;
}
.label-orange-bg {
	background: rgba(255, 251, 236, 1);
	border: 1px solid $labelOrangeColor;
	color: $labelOrangeColor;
}
.theme-color {
	color: $themeFontColor;
}
.detail-container {
	height: 100%;
	width: 100%;
	overflow: auto;
	padding-bottom: 0px;
	.company-info {
		height: 76px;
		padding: 15px 16px 0;
		.comp-name {
			font-weight: 500;
			line-height: 16px;
			margin-bottom: 10px;

			.status {
				&-dot {
					display: inline-block;
					width: 10px;
					height: 10px;
					border-radius: 5px;
					margin-left: 3px;
				}
				&__0 {
					background: rgba(66, 225, 145, 1);
				}
				&__1 {
					background: #ffd222;
				}
				&__2 {
					background: #e44a4a;
				}
			}
		}
		.label-box {
			.label-item {
				height: 20px;
				border-radius: 10px;
				margin-right: 10px;
				text-align: center;
				justify-content: space-around;
				padding: 4px 0;
				.verify-label {
					width: 60px;
					height: 20px;
				}
				.label-icon {
					font-size: 14px;
				}
				span {
					font-size: 10px;
					margin-left: 4px;
					line-height: 14px;
				}
			}
		}
	}
	.recruit-subject {
		height: 40px;
		line-height: 40px;
		padding: 0 16px;
		.recruit-title {
			font-weight: 500;
		}
		.recruit-name {
			color: rgba(132, 132, 136, 1);
		}
	}
	.project-name {
		padding: 13px 16px 15px;
		height: 70px;
		flex-direction: column;
		.pro-title {
			@include title-name;
			.excess-time {
				color: rgba(132, 132, 136, 1);
			}
		}
		.pro-name {
			line-height: 16px;
			.urgent {
				color: #c90000;
			}
		}
	}
	.project-domain {
		padding: 13px 16px 10px;
		.domain-title {
			@include title-name;
		}
		.domain-des {
			line-height: 22px;
			height: 44px;
			text-overflow: ellipsis;
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-moz-line-clamp: 2;
			-webkit-box-orient: vertical;
			-moz-box-orient: vertical;
			word-wrap: normal;
			word-break: break-all;
		}
	}
	.project-address {
		padding: 13px 16px 10px;
		.adress-title {
			@include title-name;
		}
		.adress-map {
			width: 343px;
			height: 160px;
			border-radius: 5px;
			overflow: hidden;
		}
		.op-gd {
			float: right;
			color: #848488;
		}
	}
	.drawing-box,
	.drawingAndVideo-box {
		padding: 13px 16px 10px;
		.drawing-title {
			@include title-name;
		}
		.drawing-imgs {
			text-align: center;
			img {
				width: 320px;
				height: 180px;
				margin: auto;
				border-radius: 8px;
			}
		}
	}
	.contact-btn {
		width: 300px;
		height: 40px;
		background: rgba(248, 198, 78, 1);
		border-radius: 16px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 5px;
		margin: auto;
		text-align: center;
		span {
			font-size: 16px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 40px;
		}
	}
}
</style>