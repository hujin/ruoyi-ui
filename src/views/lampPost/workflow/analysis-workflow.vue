<template>
    <div class="app-container conserve-analysis-person" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="row">
                <div class="row-item">
                    <div class="label">当月新增单位</div>
                    <div class="val">18个</div>
                </div>
                <div class="row-item">
                    <div class="label">申报单位总计</div>
                    <div class="val">68个</div>
                </div>
                <div class="row-item">
                    <div class="label">总申报次数</div>
                    <div class="val">68个</div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-title">新增单位趋势图</div>
                <div class="chart-container">
                    <div class="chart" id="chart1" ref="chart1"></div>
                </div> 
            </div>
        </div>
        <div class="right">
            <div class="right-col">
                <div class="chart-wrap" style="width:100%;height:100%">
                    <div class="chart-title">单位申报次数占比</div>
                    <div class="chart-container">
                        <div class="chart" id="chart2" ref="chart2"></div>

                    </div>
                </div>
            </div>
           <div class="right-col">
                <div class="chart-wrap" style="width:100%;height:100%">
                    <div class="chart-title">申报类别占比</div>
                    <div class="chart-container">
                        <div class="chart" id="chart3" ref="chart3"></div>

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
            chart1:null,
            chart2:null,
            chart3:null
        }
    },
    methods:{
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);

            let option = {
                    color:['#6596F9'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
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

            this.chart1.setOption(option)

        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

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
                        radius: [50, 120],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 0
                        },
                        data: [
                            { value: 40, name: 'A单位' },
                            { value: 38, name: 'B单位' },
                            { value: 32, name: 'C单位' },
                            { value: 30, name: 'D单位' },
                            { value: 28, name: 'E单位' },
                        ]
                    }
                ]
            };

            this.chart2.setOption(option)

        },
        initChart3(){
            var el = this.$refs['chart3'];
            this.chart3 = echarts.init(el);

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
                        radius: [50, 120],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 0
                        },
                        data: [
                            { value: 40, name: 'A类' },
                            { value: 38, name: 'B类' },
                            { value: 32, name: 'C类' },
                            { value: 30, name: 'D类' },
                        ]
                    }
                ]
            };

            this.chart3.setOption(option)

        },
    },
    mounted(){
        this.initChart1()
        this.initChart2()
        this.initChart3()
    }
}
</script>
<style lang="scss">
.conserve-analysis-person{
    display: flex;
    
    .chart{
        width: 100%;
        height: 100%;
    }

    .left {
        flex: 1;
        width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;

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

        
    }

    .right{
        width: 460px;
        height: 100%;
        
        margin-left: 24px;
        display: flex;
        flex-direction: column;

        .right-col{
            flex: 1;
            height: 0;
            width: 100%;
            border-radius: 4px;
            background-color: #fff;
        }

        .right-col + .right-col{
            margin-top: 24px;
        }
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