<template>
    <div class="app-container analysis-lamp" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h128">
            <div class="label">灯杆总数:</div>
            <div class="val">{{total}}杆</div>
        </div>
        <div class="list">
            <div class="list-item" v-for="(item, index) in list" :key="index">
                <div class="icon" :style="{background: colors[index % 10]}"></div>
                <div class="content">
                    <div class="name">{{item.road}}</div>
                    <div class="val">{{item.count}}杆</div>
                </div>
            </div>
            
        </div>
        <div class="chart">
            <div class="chart-title">灯杆新增统计</div>
            <div class="chart-tool">
                <el-radio-group v-model="datetype" size="mini">
                    <el-radio-button label="本日"></el-radio-button>
                    <el-radio-button label="本月"></el-radio-button>
                    <el-radio-button label="本年"></el-radio-button>
                </el-radio-group>

                <el-date-picker v-model="queryForm.time" 
                                    type="daterange"
                                    size="mini"
                                    style="margin-left:12px"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
            </div>
            <div class="chart-container">
                <div id="chart1" ref="chart1" style="width:100%;height:100%"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { getPoleMountingInfo } from "@/api/lampPost";

import * as echarts from 'echarts'

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
    data(){
        return {
            datetype:'本日',
            chart:null,
            colors:['#61DEDD','#6395F9','#75CBA9','#F7C32D','#FF9E88','E4A826','#D86262','#52BDDA','#4369F4','#68B67C'],
            list:[],
            xAxis:[],
            yAxis:[],
            queryForm:{
                time:[]
            },
            total:''
        }
    },
    methods:{
        roadFormat(road) {
            return this.selectDictLabel(this.dict.type.sys_road, road);
        },
        initChart(){
            var el = this.$refs['chart1'];
            this.chart = echarts.init(el);
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left: 'center',
                    bottom: 20,
                    itemWidth:14
                },
                xAxis:{
                    data:this.xAxis
                },
                yAxis: {
                    type: 'value'
                },
                grid:{
                    bottom:35,
                },
                series: [
                   {
                    type:'bar',
                    data: this.yAxis,
                    // showBackground: true,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6395F9' },
                            { offset: 1, color: 'rgba(99,149,249,0.05)' }
                        ])
                    },
                   }
                ]
            };

            this.chart.setOption(option)
        },
        getPoleMountingInfo(){
            let params = {
                beginTime:'',
                endTime:'',
                timeType:''
            }

            if (this.datetype == '本日') {
                params.timeType = 1
            }

            if (this.datetype == '本月') {
                params.timeType = 2
            }

            if (this.datetype == '本年') {
                params.timeType = 3
            }

            if (this.queryForm.time.length > 0) {
                params.beginTime = new Date(this.queryForm.time[0]).Format('yyyy-MM-dd')
                params.endTime = new Date(this.queryForm.time[1]).Format('yyyy-MM-dd')
            }
            console.log(params.beginTime)
            getPoleMountingInfo(params).then(res => {
                if (res.code == 200) {
                    if (res.data.slpNewPoleMountingVoList) {
                        var xAxis = [];
                        var yAxis = [];
                        res.data.slpNewPoleMountingVoList.forEach(item => {
                            

                            xAxis.push(item.dateStr)
                            yAxis.push(item.poleCount)
                        })

                        this.$set(this, 'xAxis', xAxis)
                        this.$set(this, 'yAxis', yAxis)

                        this.$nextTick(() => {
                            this.initChart();
                        })
                    }

                    this.total = res.data.totalPoleCount

                    if (res.data.poleMainMap) {
                        let list = []
                        let obj = res.data.poleMainMap

                        for(let road in obj){
                            console.log(road)
                            list.push({
                                road: this.roadFormat(road),
                                road_id:road,
                                count: obj[road].length
                            })
                        }

                        this.$set(this, 'list', list)
                    }
                }
            })
        }
    },
    mounted(){
        let start_date = new Date(new Date().setDate(1))
        let end_date = new Date()
        this.queryForm.time[0] = start_date
        this.queryForm.time[1] = end_date
        this.getPoleMountingInfo();
    }
}
</script>
<style lang="scss">
.analysis-lamp{
    overflow-y: scroll;

    .h128{
        height: 128px;
        width: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 24px;
        margin-bottom: 24px;
        border-radius: 4px;

        .label{
            font-size: 24px;
            font-weight: 400;
            color: rgba(0,0,0,0.9);
            line-height: 24px;
        }

        .val{
            font-size: 32px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            line-height: 32px;
        }
    }

    .list{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        .list-item{
            width: 305px;
            height: 128px;
            background: #fff;
            border-radius: 8px;
            margin-bottom: 24px;
            box-sizing: border-box;
            padding-left: 41px;
            display: flex;
            align-items: center;
            margin-right: 24px;

            &:nth-child(5n){
                margin-right: 0;
            }

            .icon{
                width: 64px;
                height: 64px;
                border-radius: 12px;
                margin-right: 23px;
                opacity: 0.12;
            }

            .name{
                font-size: 18px;
                font-weight: 400;
                color: rgba(0,0,0,0.9);
                line-height: 25px;
            }

            .val{
                display: flex;
                font-size: 26px;
                font-weight: 500;
                color: rgba(0,0,0,0.9);
                line-height: 37px;
                margin-top: 2px;
            }
        }
    }

    .chart{
        width: 100%;
        height: 572px;
        background-color: #fff;
        border-radius: 4px;
        display: flex;
        flex-direction: column;

        .chart-title{
            font-size: 20px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            line-height: 28px;
            margin-top: 24px;
            margin-bottom: 24px;
            padding-left: 24px;
        }

        .chart-tool{
            height: 40px;
            box-sizing: border-box;
            padding-left: 24px;
            display: flex;
            align-items: center;
        }

        .chart-container{
            flex: 1;
            height: 0;
            width: 100%;
            margin-bottom: 24px;
        }
    }
}
</style>