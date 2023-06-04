<template>
    <div class="app-container workflow-analysis-apply" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="row">
                <div class="row-item">
                    <div class="label">今日工单数</div>
                    <div class="val">18件</div>
                </div>
                <div class="row-item">
                    <div class="label">总计工单数</div>
                    <div class="val">18700件</div>
                </div>
                <div class="row-item">
                    <div class="label">完成率</div>
                    <div class="val">99%</div>
                </div>
                <div class="row-item">
                    <div class="label">人均派单数</div>
                    <div class="val">120件/人</div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-title">工单统计柱状图</div>
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
                    <div class="chart-title">派单数排行</div>
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
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left: 'center',
                    bottom: 20,
                    itemWidth:14
                },
                xAxis:{
                    data:['07/01','07/02','07/03','07/04','07/05','07/06','07/07','07/08','07/09','07/10','07/11','07/12','07/13']
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
                    data:[220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210 ],
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
                xAxis: {
                    max: '100',
                    axisLabel:{
                        formatter:'{value}%'
                    } 
                },
                yAxis: {
                    type: 'category',
                    data: ['A单位', 'B单位', 'C单位', 'D单位', 'E单位', 'F单位'],
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
                            { offset: 0, color: '#61DEDD' },
                            { offset: 1, color: 'rgba(97,222,221,0.05)' }
                        ])
                    },
                }],
                legend: {
                    show: true
                },
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
.workflow-analysis-apply{
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