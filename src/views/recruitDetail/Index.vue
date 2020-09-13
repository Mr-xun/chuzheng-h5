<template>
	<div class="detail-container theme-color f14">
		<div class="company-info bg-white mb10">
			<h5 class="comp-name theme-color f16">
				{{ detailInfo.companyName }}
				<em :class="`status-dot status__${detailInfo.credibilityId}`"></em>
			</h5>
			<ul class="label-box flex-cross-center">
				<li class="label-item label-red-bg flex-all-center">
					<van-icon class="label-icon" name="passed" />
					<span>已认证</span>
				</li>
				<li class="label-item label-orange-bg flex-all-center">
					<van-icon class="label-icon" name="plus" />
					<span>关注</span>
				</li>
			</ul>
		</div>
		<div class="recruit-subject bg-white mb10 flex-between-center">
			<span class="recruit-title">发单编号</span>
			<span class="recruit-name">{{ detailInfo.publishOrderNumber }}</span>
		</div>
		<div class="recruit-subject bg-white mb10 flex-between-center">
			<span class="recruit-title">招工主体</span>
			<span class="recruit-name">{{ detailInfo.publishName }}</span>
		</div>
		<div class="project-name bg-white mb10 flex-between">
			<h6 class="pro-title">项目名称</h6>
			<p class="pro-name" v-if=" detailInfo.titleName">
				<span class="urgent" v-if="detailInfo.isUrgent">急招</span>
				<span v-else>招</span>
				{{ detailInfo.titleName }}
			</p>
		</div>
		<div class="project-domain bg-white mb10">
			<h6 class="domain-title">项目需求</h6>
			<p class="domain-des">{{ detailInfo.projectRequirement }}</p>
		</div>
		<div class="project-address bg-white mb10">
			<h6 class="adress-title">项目地址</h6>
			<div class="adress-map">
				<el-amap class="amap-box" vid="amap-vue" :center="mapCenter" :zoom="15">
					<el-amap-marker v-for="(marker, index) in markers" :position="marker" :key="index"></el-amap-marker>
				</el-amap>
			</div>
		</div>
		<div class="drawing-box bg-white mb10" v-if="detailInfo.designStatus != 0">
			<h6 class="drawing-title">图纸</h6>
			<p v-if="detailInfo.designStatus == 1">上传的图纸后台待处理，处理后可查看对应图</p>
			<div class="drawing-imgs" v-if="detailInfo.designStatus == 2">
				<img :src="item" alt v-for="(item, index) in detailInfo.designUrls" :key="index" />
			</div>
		</div>
		<div
			class="drawingAndVideo-box bg-white mb10"
			v-if="detailInfo.pictures && detailInfo.pictures.length"
		>
			<h6 class="drawing-title">图片</h6>
			<div class="drawing-imgs">
				<img :src="item" alt v-for="(item, index) in detailInfo.pictures" :key="index" />
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "RecruitDetail",
	data() {
		return {
			detailInfo: {},
			markers: [[116.398055, 39.907046]],
			mapCenter: [116.398055, 39.907046],
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
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
					this.setPosition();
				})
				.catch((err) => {
					console.log(err);
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
					background: rgba(150, 200, 119, 1);
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
				padding: 4px 8px;
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