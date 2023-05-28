<template>
    <div class="app-container analysis-device-energy" style="background:#eee;height:calc(100vh - 50px)">
        <div class="page-title">设备能耗统计</div>
        <div class="h104"></div>
        <div class="device-type-wrap">
            <div class="device-type-list">
                <div class="device-type-item">
                    <div class="name">实时能耗</div>
                    <div class="val">8500个</div>
                </div>
                <div class="device-type-item">
                    <div class="name">总电表数</div>
                    <div class="val">8500个</div>
                    <div class="detail" @click="goList">详情</div>
                </div>
                <div class="device-type-item">
                    <div class="name">灯杆倾斜传感器</div>
                    <div class="val">8500个</div>
                </div>
                <div class="device-type-item">
                    <div class="name">边缘计算网关</div>
                    <div class="val">8500个</div>
                </div>
                <div class="device-type-item">
                    <div class="name">气象站</div>
                    <div class="val">8500个</div>
                </div>
                <div class="device-type-item">
                    <div class="name">多功能电能计量表</div>
                    <div class="val">8500个</div>
                </div>
            </div>
        </div>
        <div class="h572">
            <div class="chart-title">每时段总能耗统计</div>
            <div class="chart">
                <div id="chart1" ref="chart1" style="width:100%;height:100%"></div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
    data(){
        return {
            chart:null
        }
    },
    methods:{
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

            this.chart.setOption(option)
        },
        goList(){
            this.$router.push('/lampPost/analysis/device-energy-list')
        }
    },
    mounted(){
        this.initChart()
    }    
}
</script>
<style lang="scss">
.analysis-device-energy{
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
    }

    .device-type-wrap{
        width: 100%;
        height: 100px;
        overflow-x: scroll;
        margin-bottom: 24px;

        .device-type-list{
            display: flex;
            width: max-content;

            .device-type-item{
                position: relative;
                width: 218px;
                height: 100px;
                background: #FFFFFF;
                border-radius: 4px;
                margin-right: 25px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                box-sizing: border-box;
                padding-left: 24px;
                overflow: hidden;

                .detail{
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 36px;
                    height: 100px;
                    background-color: #ebf5fe;
                    font-size: 14px;
                    font-weight: 500;
                    color: #409EFE;
                    line-height: 20px;
                    box-sizing: border-box;
                    padding: 0 11px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }

                &.active{
                    background: linear-gradient(132deg, #FFFFFF 0%, #E5F6FF 35%, #F9FBFF 71%, #FCFDFF 100%);
                    border: 2px solid #409EFE;
                }

                .name{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.6);
                    line-height: 20px;
                }

                .val{
                    font-size: 20px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.9);
                    line-height: 28px;
                }
            }
        }
    }

    .h572{
        height: 572px;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 24px;
        display: flex;
        flex-direction: column;

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

}
</style>