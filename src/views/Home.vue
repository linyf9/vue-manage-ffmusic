<template>
    <div class="home">
        <img src="../assets/images/可视化背景图.jpg" class="bigImg" alt="">
        <el-row class="top-row" :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <div class="user">
                            <img src="../assets/images/admin.webp" alt="">
                            <div class="user-info">
                                <p class="name">Admin</p>
                                <p class="access">超级管理员</p>
                            </div>
                        </div>
                        <!-- {{ loginTime }} {{ loginAddress }} -->
                        <div class="login-info">
                            <p>登录时间：<span>{{ loginTime }}</span></p>
                            <p>登录地点：<span>{{ loginAddress }}</span></p>
                        </div>
                    </el-card>
                </div>

            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <!-- 柱状图1 -->
                        <div ref="echarts1" style="width: 558px; height:258px;"></div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-row class="bottom-row" :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <!-- 饼状图 -->
                        <div ref="echarts2" style="width: 558px; height:238px;"></div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <!-- 柱状图2 -->
                        <div ref="echarts3" style="width: 558px; height:258px;"></div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import * as echarts from 'echarts'
export default {
    name: 'Home',
    data() {
        return {

        }
    },
    computed: {
        ...mapState('user', ['loginTime', 'loginAddress'])
    },
    methods: {

    },
    async mounted() {
        // 获取柱状图1的数据
        let { barData, pieData, bar2Data } = await this.$api.echarts.reqGetBarData()
        // 柱状图1
        let bar1Chart = echarts.init(this.$refs.echarts1)
        // 指定图标配置项数据
        let bar1Options = {
            legend: {
                // 图例文字颜色
                textStyle: {
                    color: "#333",
                },
            },
            grid: {
                left: "20%",
            },
            // 提示框
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category", // 类目轴
                data: barData.xAxisData,
                axisLine: {
                    lineStyle: {
                        color: "#17b3a3",
                    },
                },
                axisLabel: {
                    interval: 0,
                    color: "#333",
                },
            },
            yAxis: [
                {
                    type: "value",
                    axisLine: {
                        lineStyle: {
                            color: "#17b3a3",
                        },
                    },
                },
            ],
            color: ["#2ec7c9"],
            series: [
                {
                    name: '数量',
                    data: barData.seriesData,
                    type: 'bar'
                }
            ],
        }
        // 调用方法，传入配置好的数据
        bar1Chart.setOption(bar1Options)

        // 饼状图，可以查看歌单中有多少首歌
        let pieChart = echarts.init(this.$refs.echarts2)
        // 指定图标配置项数据
        let pieOptions = {
            tooltip: {
                trigger: "item",
            },
            color: [
                "#0f78f4",
                "#dd536b",
                "#9462e5",
                "#a6a6a6",
                "#e1bb22",
                "#39c362",
                "#3ed1cf",
                "#8a771f",
                "#15518d",
                "#f66a35",
                "#37373d",
                "#688f96",
                "#232a47",
                "#c89ba2",
            ],
            series: [
                {
                    data: pieData,
                    type: 'pie'
                }
            ],
        }
        // 调用方法，传入配置好的数据
        pieChart.setOption(pieOptions)

        // 柱状图2
        let bar2Chart = echarts.init(this.$refs.echarts3)
        // 指定图标配置项数据
        let bar2Options = {
            legend: {
                // 图例文字颜色
                textStyle: {
                    color: "#333",
                },
            },
            grid: {
                left: "20%",
            },
            // 提示框
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category", // 类目轴
                data: bar2Data.xAxisData,
                axisLine: {
                    lineStyle: {
                        color: "#f66a35",
                    },
                },
                axisLabel: {
                    interval: 0,
                    color: "#333",
                },
            },
            yAxis: [
                {
                    type: "value",
                    axisLine: {
                        lineStyle: {
                            color: "#f66a35",
                        },
                    },
                },
            ],
            color: ["#f66a35"],
            series: [
                {
                    name: '歌曲数量',
                    data: bar2Data.seriesData,
                    type: 'bar'
                }
            ],
        }
        // 调用方法，传入配置好的数据
        bar2Chart.setOption(bar2Options)

    }
}
</script>

<style lang="less" scoped>
.bigImg {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.home {
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}

.box-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    // overflow: hidden;
}

/deep/.el-card__body {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: #fff;
    box-sizing: border-box;
}

.user {
    display: flex;
    align-items: center;
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid #ccc;

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin-right: 20px;
    }

    .user-info {
        .name {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .access {
            color: #999999;
            font-size: 16px;
        }

    }
}

.login-info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
        font-size: 16px;
        color: #999999;

        &:first-child {
            padding-top: 10px;
            padding-bottom: 19px;
        }

        span {
            color: #666666;
            margin-left: 10px;
        }
    }
}



.top-row {
    margin-bottom: 20px;
}


.grid-content {
    width: 600px;
    height: 258px;
}
</style>