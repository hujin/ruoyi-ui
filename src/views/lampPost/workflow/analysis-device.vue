<template>
    <div class="app-container conserve-analysis-time" style="background:#eee;height:calc(100vh - 50px)">
        <div class="row">
            <div class="row-item">
                <div class="label">设备数量</div>
                <div class="val">{{info.totalDeviceNum || 0}}个</div>
            </div>
            <div class="row-item">
                <div class="label">总使用时长</div>
                <div class="val">{{info.totalUseTime || 0}}小时</div>
            </div>
            <div class="row-item">
                <div class="label">总使用次数</div>
                <div class="val">{{info.useTimes || 0}}次</div>
            </div>
        </div>
        <div class="c-content">
            <div class="left">
                <div class="chart-wrap">
                    <div class="chart-title">各单位对设备使用占比</div>
                    <div class="type-list">
                        <div class="type-item" @click="handleTypeItemClick(index)" :class="{active: typeActive == index}" v-for="(item, index) in typeList" :key="index">{{item.text}}</div>
                    </div>
                    <div class="chart-container">
                        <div class="chart" id="chart1" ref="chart1"></div>
                    </div> 
                </div>
            </div>
            <div class="left">
                <div class="chart-wrap">
                    <div class="chart-title">各类设备使用时长占比</div>
                    <div class="chart-container">
                        <div class="chart" id="chart2" ref="chart2"></div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import { getDeviceUseStatOverview } from "@/api/lampPost";

import * as echarts from 'echarts'

export default {
    dicts: ['sys_road', 'sys_audit_status', 'sys_device_type'],
    data(){
        return {
            info:{
                totalDeviceNum:'',
                totalUseTime:'',
                useTimes:''
            },
            chart1:null,
            typeActive:0,
            typeList:[],
            xAxis1:[],
            yAxis1:[],
            chart2:null,
            xAxis2:[],
            yAxis2:[],
        }
    },
    methods:{
        handleTypeItemClick(index){
            this.typeActive = index;

            this.initChart1()
        },
        typeFormat(type){
            return this.selectDictLabel(this.dict.type.sys_device_type, type);

        },
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);

            let option = {
                colors:['#F7C32D','#F1866D', '#61DEDD', '#6ADCAF', '#6395F9'],
                
                legend: {
                    top: 'bottom',
                    itemWidth:14,
                },
                
                series: [
                    {
                        name: 'Nightingale Chart',
                        type: 'pie',
                        radius: ['10%', '60%'],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 0
                        },
                        data: this.typeList[this.typeActive].yAxis
                    }
                ]
            };

            this.chart1.setOption(option)

        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

            let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    color:['#F7C32D','#6ADCAF','#6395F9','#FF9E88'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxis2
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
                    series: this.yAxis2
            };

            this.chart2.setOption(option)

        },
        getDeviceUseStatOverview(){
            getDeviceUseStatOverview().then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.info.totalDeviceNum = res.data.totalDeviceNum
                        this.info.totalUseTime = res.data.totalUseTime
                        this.info.useTimes = res.data.useTimes

                        if (res.data.deptUseStat) {
                            let typeList = []
                            let deptUseStat = res.data.deptUseStat
                            for (let key in deptUseStat) {
                                deptUseStat[key].forEach(item => {
                                    item['value'] = item.times
                                })

                                typeList.push({
                                    value:key,
                                    text: this.typeFormat(key),
                                    yAxis: deptUseStat[key]
                                })
                            }
                            this.$set(this, 'typeList', typeList)
                            this.typeActive = 0
                            this.$nextTick(() => {
                                this.initChart1()
                            })
                            console.log(typeList)
                        }

                        if (res.data.deviceUseStat) {
                            let xAxis2 = [];
                            let yAxis2 = [];
                            let typeKindList = []
                            let deviceUseStat = res.data.deviceUseStat

                            for (let key in deviceUseStat) {
                                typeKindList.push(key)
                                xAxis2 = []
                                let data = []
                                deviceUseStat[key].forEach(item => {
                                    xAxis2.push(item.timeStr)
                                    data.push(item.value)
                                })
                                yAxis2.push({
                                    data:data,
                                    type:'line',
                                    name: key
                                })
                            }

                            this.$set(this, 'xAxis2', xAxis2)
                            this.$set(this, 'yAxis2', yAxis2)

                            this.$nextTick(() => {
                                this.initChart2()

                            })
                        }
                    }
                }
            })
        }
    },
     mounted(){
        this.getDeviceUseStatOverview();
    }
}
</script>
<style lang="scss">
.conserve-analysis-time{
    display: flex;
    flex-direction: column;

    .type-list{
        width: 100%;
        height: 56px;
        background: #F8F9FB;
        border-radius: 28px;
        margin-top: 32px;
        display: flex;

        .type-item{
            height: 56px;
            box-sizing: border-box;
            padding: 0 24px;
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: 400;
            color: #A2A9BC;
            border-radius: 28px;
            cursor: pointer;

            &.active{
                background: #4E86FF;
                color: #fff;
            }
        }
    }
    
    .chart{
        width: 100%;
        height: 100%;
    }

    .row{
            width: 100%;
            height: 100px;
            display: flex;
            margin-bottom: 24px;

            .row-item{
                flex: 1;
                height: 100%;
                border-radius: 5px;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding: 0 24px;

                .label{
                    font-size: 18px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.9);
                }

                .val{
                    font-size: 26px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.9);
                }
            }

            .row-item + .row-item{
                margin-left: 16px;
            }
        }

    .c-content{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;
    
    }

    .left {
        flex: 1;
        width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;

    }

    .left + .left{
        margin-left: 24px;
    }

   

    .chart-wrap{
        flex: 1;
        height: 0;
        width: 100%;
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 24px;
        display: flex;
        flex-direction: column;

        .chart-title{
            font-size: 20px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            line-height: 28px;
        }

        .chart-container{
            flex: 1;
            height: 0;
            width: 100%;
        }
    }
}
</style>