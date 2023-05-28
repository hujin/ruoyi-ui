<template>
    <div class="app-container analysis-device-count" style="background:#eee;height:calc(100vh - 50px)">
        <div class="page-title">感知设备数量及占比</div>
        <div class="h104"></div>
        <div class="section-title">
            <div class="label">总感知设备数量:</div>
            <div class="val">185700个</div>
        </div>
        <div class="device-type-wrap">
            <div class="device-type-list">
                <div class="device-type-item" :class="{active: deviceTypeActive == item.name}" v-for="(item,index) in deviceTypeList" :key="index">
                    <div class="name">{{item.name}}</div>
                    <div class="val">{{item.val}}</div>
                </div>
            </div>
        </div>
        <div class="row-container">
            <div class="left">
                <div class="left-title">感知设备使用率</div>
                <div class="chart">
                    <div id="chart1" ref="chart1" style="width:100%;height:100%"></div>
                </div>
            </div>
            <div class="right">
                <div class="right-header">
                    <div class="text">当月设备新增</div>
                    <div class="val">
                        <div class="num">1182</div>
                        <div class="symbol">个</div>
                    </div>
                    <div class="link" @click="openDetail">详情</div>
                </div>
                <div class="list">
                    <div class="item" v-for="(item,index) in list" :key="index">
                        <div class="item-name">A道路新增设备</div>
                        <div class="item-value">12个</div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="open" width="800px" title="新增设备详情">
            <div class="dialog-section">
                <div class="left">
                    <div class="dialog-title">当月设备新增 （个）</div>
                    <div class="num">184</div>
                    <div class="data-list">
                        <div class="data-item">
                            <div class="circle" style="background:#6395F9"></div>
                            <div class="name">摄像头</div>
                            <div class="val">18个</div>
                            <div class="percent">15%</div>
                        </div>
                        <div class="data-item">
                            <div class="circle" style="background:#6ADCAF"></div>
                            <div class="name">网关</div>
                            <div class="val">18个</div>
                            <div class="percent">15%</div>
                        </div>
                        <div class="data-item">
                            <div class="circle" style="background:#F7C32D"></div>
                            <div class="name">气象站</div>
                            <div class="val">18个</div>
                            <div class="percent">15%</div>
                        </div>
                        <div class="data-item">
                            <div class="circle" style="background:#61DEDD"></div>
                            <div class="name">灯盖倾斜传感器</div>
                            <div class="val">18个</div>
                            <div class="percent">15%</div>
                        </div>
                        <div class="data-item">
                            <div class="circle" style="background:#FF9E88"></div>
                            <div class="name">集中控制器</div>
                            <div class="val">18个</div>
                            <div class="percent">15%</div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div id="chart2" ref="chart2" style="width:100%;height:100%"></div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
    data(){
        return {
            deviceTypeActive:'单灯控制器',
            deviceTypeList:[{
                name:'单灯控制器',
                val:'8500个'
            },{
                name:'路灯集中控制器',
                val:'8500个'
            },{
                name:'灯杆倾斜传感器',
                val:'8500个'
            },{
                name:'边缘计算网关',
                val:'8500个'
            },{
                name:'气象站',
                val:'8500个'
            },{
                name:'多功能电能计量表',
                val:'8500个'
            },{
                name:'高清网络摄像机',
                val:'8500个'
            }],
            list:[],
            open:false
        }
    },
    methods:{
        openDetail(){
            this.open = true;
            this.$nextTick(() => {
                this.initChart2()
            })
        },
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
                    data: ['气象站', '电表', '边缘计算网关', '灯盖倾斜传感器', '高清摄像头', '单灯控制器'],
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
                colors:['#6395F9','#6ADCAF', '#F7C32D', '#61DEDD', '#FF9E88'],    
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
                            { value: 28, name: '摄像头' },
                            { value: 30, name: '网关' },
                            { value: 40, name: '气象站' },
                            { value: 32, name: '灯盖倾斜传感器' },
                            { value: 38, name: '集中控制器' }
                        ]
                    }
                ]
            };

            this.chart.setOption(option)

        },
    },
    mounted(){
        for (let i = 0; i < 20; i++) {
            this.list.push({})
        }
        this.initChart()
    }
}
</script>
<style lang="scss">
.analysis-device-count{
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

    .section-title{
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .label{
            font-size: 14px;
            font-weight: 400;
            color: rgba(0,0,0,0.9);
            line-height: 24px;
        }

        .val{
            font-size: 20px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            line-height: 32px;
        }
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

    .row-container{
        height: 463px;
        width: 100%;
        display: flex;

        .left {
            flex: 1;
            width: 0;
            height: 100%;
            margin-right: 24px;
            background-color: #fff;
            border-radius: 4px;
            box-sizing: border-box;
            padding: 24px;
            display: flex;
            flex-direction: column;

            .left-title{
                font-size: 20px;
                font-weight: 500;
                color: rgba(0,0,0,0.79);
                line-height: 24px;
            }

            .chart{
                flex: 1;
                height: 0;
                width: 100%;
            }
        }

        .right{
            width: 460px;
            height: 100%;
            background-color: #fff;
            border-radius: 4px;
            box-sizing: border-box;
            padding: 24px;
            display: flex;
            flex-direction: column;

            .right-header{
                display: flex;
                align-items: center;

                .text{
                    font-size: 18px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.6);
                    line-height: 25px;
                }

                .val{
                    display: flex;
                    align-items: baseline;
                    font-size: 26px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.9);
                    line-height: 26px;
                    margin-left: 16px;

                    .symbol{
                        font-size: 16px;
                    }
                }

                .link{
                    font-size: 18px;
                    font-weight: 400;
                    color: #409EFE;
                    line-height: 25px;
                    margin-left: auto;
                    cursor: pointer;
                }
            }

            .list{
                flex: 1;
                height: 0;
                width: 100%;
                overflow-y: scroll;
                display: flex;
                flex-wrap: wrap;
                margin-top: 23px;

                .item{
                    width: 126px;
                    height: 97px;
                    background-color: #f8f8f8;
                    border-radius: 4px;
                    margin-right: 17px;
                    margin-bottom: 18px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    &:nth-child(3n){
                        margin-right: 0;
                    }

                    .item-name{
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.6);
                        line-height: 14px;
                        margin-top: 23px;
                    }

                    .item-value{
                        font-size: 20px;
                        font-weight: 500;
                        color: rgba(0,0,0,0.8);
                        line-height: 24px;
                        margin-top: 11px;
                    }
                }
            }
        }
    }

    .dialog-section{
        height: 290px;
        border-radius: 4px;
        background-color: #f8f9fb;
        display: flex;

        .left {
            width: 325px;
            height: 100%;
            box-sizing: border-box;
            padding: 24px;

            .dialog-title{
                font-size: 16px;
                font-weight: 500;
                color: rgba(0,0,0,0.79);
                line-height: 24px;
                margin-bottom: 8px;
            }

            .num{
                font-size: 24px;
                font-weight: 500;
                color: rgba(0,0,0,0.79);
                line-height: 24px;
                margin-bottom: 24px;
            }

            .data-list{
                .data-item{
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;

                    .circle{
                        width: 8px;
                        height: 8px;
                        margin-right: 6px;
                    }

                    .name{
                        width: 98px;
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.6);
                        line-height: 20px;
                        margin-right: 24px;
                    }

                    .val,
                    .percent{
                        flex: 1;
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.9);
                        line-height: 22px;

                    }
                }
            }
        }

        .right{
            flex: 1;
            width: 0;
            height: 100%;
        }
    }
}
</style>