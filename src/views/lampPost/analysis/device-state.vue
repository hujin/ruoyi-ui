<template>
    <div class="app-container analysis-device-state" style="background:#eee;height:calc(100vh - 50px)">
        <div class="page-title">感知设备状态及占比</div>
        <div class="h104">
            <el-form :model="queryForm" size="small" :inline="true">
                <el-form-item label="时间" prop="time">
                    <el-date-picker v-model="queryForm.time" 
                                    type="daterange"
                                    placeholder="请选择安装时间"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
                <el-form-item prop="date_type">
                    <el-radio-group v-model="queryForm.date_type" >
                        <el-radio-button label="本周"></el-radio-button>
                        <el-radio-button label="本月"></el-radio-button>
                        <el-radio-button label="本年"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="道路" prop="road">
                    <el-select v-model="queryForm.road" placeholder="请选择道路">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="设备分类" prop="type">
                    <el-select v-model="queryForm.type" placeholder="请选择设备分类">
                        <el-option
                            v-for="dict in dict.type.sys_device_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="h602">
            <div class="h-item">
                <div class="chart-title">设备在线率及在线数量</div>
                <div class="chart">
                    <div id="chart1" ref="chart1" style="width:100%;height:100%"></div>
                </div>
            </div>
            <div class="h-item">
                <div class="chart-title">设备在线率趋势图</div>
                <div class="chart">
                    <div id="chart2" ref="chart2" style="width:100%;height:100%"></div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

import { getDeviceEnableList } from "@/api/lampPost";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
    data(){
        return {
            queryForm:{
                time:[],
                road:'',
                type:'',
                date_type:'本月'
            }
        }
    },
    methods:{
        initChart(){
            var el = this.$refs['chart1'];
            this.chart = echarts.init(el);

            let option = {
                xAxis: {
                    max: '100',
                    axisLabel:{
                        formatter:'{value}%'
                    } 
                },
                yAxis: {
                    type: 'category',
                    data: ['气象站', '电表', '边缘计算网关', '灯杆倾斜传感器', '高清摄像头', '单灯控制器'],
                },
                grid:{
                    bottom:35,
                },
                series: [{
                    type: 'bar',
                    data: [50,20,30,40,50,21],
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true,
                        formatter:'{@score}%'
                    },
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                            { offset: 0, color: '#6395F9' },
                            { offset: 1, color: 'rgba(99,149,249,0.05)' }
                        ])
                    },
                }],
                legend: {
                    show: true
                },
            };

            this.chart.setOption(option)

        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart = echarts.init(el);

            let option = {
                    color:['#6596F9'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['2/20', '2/21', '2/22', '2/23', '2/24', '2/25', '2/26']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid:{
                        bottom:35,
                        right:20,
                        left:40,
                        top:40
                    },
                    series: [
                        {
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line',
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: 'rgba(101,150,249,0.4)' },
                                        { offset: 1, color: 'rgba(248,249,251,0.44)' }
                                ])
                            }
                        }
                    ]
            };

            this.chart.setOption(option)

        },
        getDeviceEnableList(){
            getDeviceEnableList().then(res => {

            })
        }
    },
    mounted(){
        this.getDeviceEnableList()
        this.initChart()
        this.initChart2()
    }
}
</script>
<style lang="scss">
.analysis-device-state{
    display: flex;
    flex-direction: column;

    .page-title{
        font-size: 32px;
        font-weight: 500;
        color: rgba(0,0,0,0.9);
        line-height: 32px;
        margin-bottom: 30px;
    }

    .h104{
        height: 104px;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 24px;

        .el-form{
            width: 100%;

            .el-form-item--small.el-form-item{
                margin-bottom: 0;
            }
        }
    }

    .h602{
        height: 602px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .h-item{
            flex: 1;
            height: 100%;
            background-color: #fff;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 24px;

            .chart-title{
                font-size: 20px;
                font-weight: 500;
                color: rgba(0,0,0,0.79);
                line-height: 24px;
                margin-bottom: 24px;
            }

            .chart{
                flex: 1;
                width: 100%;
                height: 0;
            }
        }

        .h-item + .h-item{
            margin-left: 24px;
        }
    }
}
</style>