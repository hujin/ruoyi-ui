<template>
    <div class="app-container conserve-analysis-time" style="background:#eee;height:calc(100vh - 50px)">
        <div class="row">
            <div class="row-item">
                <div class="label">总巡查时间</div>
                <div class="val">1121.4小时</div>
            </div>
            <div class="row-item">
                <div class="label">总巡查次数</div>
                <div class="val">1582次</div>
            </div>
            <div class="row-item">
                <div class="label">高频巡查时间段</div>
                <div class="val">14:00</div>
            </div>
        </div>
        <div class="c-content">
            <div class="left">
                <div class="chart-wrap">
                    <div class="chart-title">新增人员趋势图</div>
                    <div class="chart-container">
                        <div class="chart" id="chart1" ref="chart1"></div>
                    </div> 
                </div>
            </div>
            <div class="left">
                <div class="chart-wrap">
                    <div class="chart-title">来源单位占比</div>
                    <div class="chart-container">
                        <div class="chart" id="chart2" ref="chart2"></div>
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
            chart2:null
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
                    left: 60,
                    right: 60,
                    bottom:35,
                },
                series: [
                   {
                    type:'bar',
                    data:[220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210 ],
                    label: {
                        show: true,
                        position: 'top',
                        valueAnimation: true,
                        formatter:'{@score}'
                    },
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
                            { value: 40, name: '气象站' },
                            { value: 38, name: '集中控制器' },
                            { value: 32, name: '单灯控制器' },
                            { value: 30, name: '网关' },
                            { value: 28, name: '摄像头' },
                        ]
                    }
                ]
            };

            this.chart2.setOption(option)

        },
    },
     mounted(){
        this.initChart1()
        this.initChart2()
    }
}
</script>
<style lang="scss">
.conserve-analysis-time{
    display: flex;
    flex-direction: column;
    
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