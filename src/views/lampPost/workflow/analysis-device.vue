<template>
    <div class="app-container conserve-analysis-time" style="background:#eee;height:calc(100vh - 50px)">
        <div class="row">
            <div class="row-item">
                <div class="label">设备数量</div>
                <div class="val">112000个</div>
            </div>
            <div class="row-item">
                <div class="label">总使用时长</div>
                <div class="val">18500小时</div>
            </div>
            <div class="row-item">
                <div class="label">总使用次数</div>
                <div class="val">12000次</div>
            </div>
        </div>
        <div class="c-content">
            <div class="left">
                <div class="chart-wrap">
                    <div class="chart-title">各单位对设备使用占比</div>
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

            this.chart1.setOption(option)

        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

            let option = {
                    color:['#F7C32D','#6ADCAF','#6395F9','#FF9E88'],
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
                            data: [820, 902, 911, 954, 1210, 1310, 900],
                            type: 'line',
                            
                        },
                        {
                            data: [880, 612, 721, 364, 820, 920, 910],
                            type: 'line',
                            
                        },
                        {
                            data: [510, 722, 831, 1074, 1130, 1530, 920],
                            type: 'line',
                            
                        },
                        {
                            data: [826, 932, 941, 984, 1240, 1330, 930],
                            type: 'line',
                            
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