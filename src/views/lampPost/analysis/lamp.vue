<template>
    <div class="app-container analysis-lamp" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h128">
            <div class="label">灯杆总数:</div>
            <div class="val">182973杆</div>
        </div>
        <div class="list">
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
            <div class="list-item">
                <div class="icon"></div>
                <div class="content">
                    <div class="name">A道路</div>
                    <div class="val">1900杆</div>
                </div>
            </div>
        </div>
        <div class="chart">
            <div class="chart-title">灯杆新增统计</div>
            <div class="chart-tool">
                <el-radio-group v-model="date" size="mini">
                    <el-radio-button label="本周"></el-radio-button>
                    <el-radio-button label="本月"></el-radio-button>
                    <el-radio-button label="本年"></el-radio-button>
                </el-radio-group>
            </div>
            <div class="chart-container">
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
            date:'本周',
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

            this.chart.setOption(option)
        },
    },
    mounted(){
        this.initChart()
    }
}
</script>
<style lang="scss">
.analysis-lamp{
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
        justify-content: space-between;
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

            .icon{
                width: 64px;
                height: 64px;
                margin-right: 23px;
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