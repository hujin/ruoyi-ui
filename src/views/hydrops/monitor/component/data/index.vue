<template>
    <div class="monitor-data">
        <div class="search-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" >
                <el-form-item label="时间" prop="menuName">
                    <el-date-picker
                        v-model="queryParams.time"
                        value-format="yyyy-MM-dd"
                        type="datetimerange"
                        placeholder="时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="h286">
            <div class="tool">
                <el-radio-group>
                    <el-radio label="1">同比</el-radio>
                    <el-radio label="2">环比</el-radio>
                </el-radio-group>
            </div>
            <div class="info-list">
                <div class="info-item">
                    <div class="label">平均水位高度</div>
                    <div class="val">
                        <div class="num">15</div>
                        <div class="symbol">cm</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">5%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">5%</div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">平均排水速度</div>
                    <div class="val">
                        <div class="num">14</div>
                        <div class="symbol">m³/s</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">5%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">5%</div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">平均积水速度</div>
                    <div class="val">
                        <div class="num">25</div>
                        <div class="symbol">m³/s</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">5%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">5%</div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">累计积水时长</div>
                    <div class="val">
                        <div class="num">152</div>
                        <div class="symbol">h</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">5%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">5%</div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">报警次数</div>
                    <div class="val">
                        <div class="num">32</div>
                        <div class="symbol">次</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">5%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">5%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-item">
                <div class="section-item-wrap">
                    <div class="title">水位变化柱状图</div>
                    <div class="chart">
                        <div id="chart1"  ref="chart1" ></div>
                    </div>
                </div>
            </div>
            <div class="section-item">
                <div class="section-item-wrap">
                    <div class="title">报警统计</div>
                    <div class="chart">
                        <div id="chart2"  ref="chart2" ></div>
                    </div>
                </div>
            </div>
            <div class="section-item">
                <div class="section-item-wrap">
                    <div class="title">积水速度趋势曲线图</div>
                    <div class="chart">
                        <div id="chart3"  ref="chart3" ></div>
                    </div>
                </div>
            </div>
            <div class="section-item">
                <div class="section-item-wrap">
                    <div class="title">排水速度趋势曲线图</div>
                    <div class="chart">
                        <div id="chart4"  ref="chart4" ></div>
                    </div>
                </div>
            </div>
            

        </div>
        <div class="section-title">趋势预测</div>
        <div class="section">
            <div class="section-item" style="margin-bottom:0">
                <div class="section-item-wrap">
                    <div class="title">未来8小时水位预测</div>
                    <div class="chart">
                        <div id="chart5"  ref="chart5" ></div>
                    </div>
                </div>
            </div>
            <div class="section-item" style="margin-bottom:0">
                <div class="section-item-wrap">
                    <div class="title">未来8小时积水时长预测</div>
                    <div class="chart">
                        <div id="chart6"  ref="chart6" ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
    data(){
        return {
           queryParams: {
                pageNum: 1,
                pageSize: 10,
                time: [],
                monitorTimeStart:'',
                monitorTimeEnd:'',
            },
            total:0,
            list:[],

            showSearch: true,
            loading: false,
            chart1:null,
            chart2:null,
            chart3:null,
            chart4:null,
            chart5:null,
            chart6:null
        }
    },
    methods:{
        handleQuery(){},
        resetQuery(){},
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);
            let options = {
                color:['#6395F9','#6ADCAF','#F7C32D'],
                // tooltip: {
                //     trigger: 'axis',
                //     axisPointer: {
                //         type: 'cross',
                //         crossStyle: {
                //             color: '#999'
                //         }
                //     }
                // },
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['最低水位','最高水位','平均水位']
                },

                grid:{
                    bottom:35,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['03-01', '03-02', '03-03', '03-04', '03-05'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} cm'
                        }
                    }
                ],
                series: [{
                    name:'最低水位',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: [22, 33, 25, 37, 29]
                },{
                    name:'最高水位',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: [23, 32, 27, 33, 24]
                },{
                    name:'平均水位',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: [22.5,32.5,26,35,26.5]
                }]
            }

            this.chart1.setOption(options)

        },
        initChart2(){
            var el = this.$refs['chart2']
            this.chart2 = echarts.init(el)
            let options = {
                color:['#EB0E1D','#FAAD14','#FDE181'],
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['一级报警','二级报警','三级报警'],
                },
                grid:{
                    bottom:35,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        
                    }
                ],
                series: [{
                    name:'一级报警',
                    type:'bar',
                    stack:'ad',
                    data:[22, 33, 44, 32, 29, 35, 11]
                },{
                    name:'二级报警',
                    type:'bar',
                    stack:'ad',
                    data:[22, 33, 44, 32, 29, 35, 11]
                },{
                    name:'三级报警',
                    type:'bar',
                    stack:'ad',
                    data:[22, 33, 44, 32, 29, 35, 11]
                }]
            }

            this.chart2.setOption(options)

        },
        initChart3(){
            var el = this.$refs['chart3']
            this.chart3 = echarts.init(el)
            let options = {
                color:['#6395F9'],
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['积水速度'],
                },
                grid:{
                    bottom:35,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        
                    }
                ],
                series: [{
                    data: [22, 33, 44, 934, 1290, 1330, 1320 ],
                    type: 'line',
                    smooth: true,
                    name:'积水速度'
                }]
            }

            this.chart3.setOption(options)
        },
        initChart4(){
            var el = this.$refs['chart4']
            this.chart4 = echarts.init(el)
            let options = {
                color:['#6395F9'],
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['排水速度'],
                },
                grid:{
                    bottom:35,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        
                    }
                ],
                series: [{
                    data: [22, 33, 44, 934, 1290, 1330, 1320 ],
                    type: 'line',
                    smooth: true,
                    name:'排水速度'
                }]
            }

            this.chart4.setOption(options)
        },
        initChart5(){
            var el = this.$refs['chart5']
            this.chart5 = echarts.init(el)
            let options = {
                color:['#F7C32D','#409EFE'],
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['当前水位', '未来水位'],
                },
                grid:{
                    bottom:35,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        
                    }
                ],
                series: [{
                    data: [22, 33, 44, 934, null, null, null ],
                    type: 'line',
                    smooth: true,
                    name:'当前水位'
                },{
                    data: [null, null, null, 934, 1290, 1330, 1320  ],
                    type: 'line',
                    smooth: true,
                    name:'未来水位',
                    lineStyle: {
                        type: 'dashed'
                    },
                }]
            }

            this.chart5.setOption(options)
        },
        initChart6(){
            var el = this.$refs['chart6']
            this.chart6 = echarts.init(el)
            let options = {
                color:['#F7C32D','#409EFE'],
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['当前水位', '未来水位'],

                },
                grid:{
                    bottom:35,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06', '03-07'],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        
                    }
                ],
                series: [{
                    data: [22, 33, 44, 934, null, null, null ],
                    type: 'line',
                    smooth: true,
                    name:'当前水位'
                },{
                    data: [null, null, null, 934, 1290, 1330, 1320  ],
                    type: 'line',
                    smooth: true,
                    name:'未来水位',
                    lineStyle: {
                        type: 'dashed'
                    },
                }]
            }

            this.chart6.setOption(options)
        }
    },
    mounted(){
        
        this.initChart1()
        this.initChart2()
        this.initChart3()
        this.initChart4()
        this.initChart5()
        this.initChart6()
    }
}
</script>
<style lang="scss">
.monitor-data{
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
    // display: flex;
    // flex-direction: column;

    .search-wrap{
        padding: 32px 24px;
        padding-bottom: 14px;
        background-color: #fff;
        margin-bottom: 24px;
    }
    
    .h286{
        height: 286px;
        width: 100%;
        background-color: #fff;
        margin-bottom: 24px;
        box-sizing: border-box;
        padding: 24px;

        .tool{
            text-align: right;
            margin-bottom: 16px;
        }

        .info-list{
            display: flex;

            .info-item{
                flex:1;
                height: 196px;
                background-color: #f8f9fb;
                box-sizing: border-box;
                padding: 32px;

                .label{
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.9);
                    line-height: 16px;
                    margin-bottom: 21px;
                }

                .val{
                    display: flex;
                    align-items: baseline;

                    .num{
                        font-size: 48px;
                        font-weight: 500;
                        color: rgba(0,0,0,0.9);
                        line-height: 48px;
                        margin-right: 4px;
                    }

                    .symbol{
                        font-size: 12px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.9);
                    }
                }

                .percent{
                    margin-top: 16px;
                    .r{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 12px;
                        color: rgba(0,0,0,0.6);
                    }

                    .r + .r {
                        margin-top: 8px;
                    }
                }
            }

            .info-item + .info-item{
                margin-left: 15px;
            }
        }
    }

    .section{
        display: flex;
        flex-wrap: wrap;

        .section-item{
            width: 50%;
            height: 430px;
            margin-bottom: 24px;
            box-sizing: border-box;

            &:nth-child(odd){
                padding-right: 12px;
            }

            &:nth-child(even){
                padding-left: 12px;
            }

            .section-item-wrap {
                height: 100%;
                width: 100%;
                background-color: #fff;
                box-sizing: border-box;
                padding: 31px 24px;
                display: flex;
                flex-direction: column;

                .title{
                    font-size: 20px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.79);
                    line-height: 24px;
                    margin-bottom: 24px;
                }

                .chart{
                    flex: 1;
                    height: 0;
                    width: 100%;

                    div{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }

    .section-title{
        font-size: 24px;
        font-weight: 500;
        color: rgba(0,0,0,0.79);
        line-height: 24px;
        margin-top: 8px;
        margin-bottom: 16px;
    }
}
</style>