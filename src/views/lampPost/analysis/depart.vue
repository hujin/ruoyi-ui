<template>
    <div class="app-container analysis-device-count" style="background:#eee;height:calc(100vh - 50px)">
        <div class="page-title">各单位设备使用情况统计</div>
        <div class="h104">
            <el-form :model="queryForm" size="small" :inline="true">
                <el-form-item label="时间" prop="time">
                    <el-date-picker v-model="queryForm.time" 
                                    type="daterange"
                                    placeholder="请选择安装时间"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
                <el-form-item prop="date_type">
                    <el-radio-group v-model="queryForm.date_type" >
                        <el-radio-button label="本日"></el-radio-button>
                        <el-radio-button label="本月"></el-radio-button>
                        <el-radio-button label="本年"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="道路" prop="road">
                    <el-select v-model="queryForm.road" placeholder="请选择道路">
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="设备分类" prop="type">
                    <el-select v-model="queryForm.type" placeholder="请选择设备分类">
                        <el-option
                            v-for="dict in dict.type.sys_device_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
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
                <div class="left-title">各单位使用率排名</div>
                <div class="chart">
                    <div id="chart1" ref="chart1" style="width:100%;height:100%"></div>
                </div>
            </div>
            
        </div>
        
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { getCompanyUse } from "@/api/lampPost";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
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
            open:false,
            queryForm:{
                time:[],
                road:'',
                type:'',
                date_type:'本月'
            }
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
                    data: ['气象站', '电表', '边缘计算网关', '灯杆倾斜传感器', '高清摄像头', '单灯控制器'],
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
                            { value: 32, name: '灯杆倾斜传感器' },
                            { value: 38, name: '集中控制器' }
                        ]
                    }
                ]
            };

            this.chart.setOption(option)

        },
        getCompanyUse(){
            let params = {
                beginTime:'',
                endTime:'',
                timeType:'',
                road: this.queryForm.road,
                type: this.queryForm.type,
            }

            if (this.queryForm.datetype == '本日') {
                params.timeType = 1
            }

            if (this.queryForm.datetype == '本月') {
                params.timeType = 2
            }

            if (this.queryForm.datetype == '本年') {
                params.timeType = 3
            }

            if (this.queryForm.time.length > 0) {
                params.beginTime = new Date(this.queryForm.time[0]).Format('yyyy-MM-dd')
                params.endTime = new Date(this.queryForm.time[1]).Format('yyyy-MM-dd')
            }
            getCompanyUse(params).then(res => {

            })
        }
    },
    mounted(){
        this.getCompanyUse();
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
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 24px;

        .el-form{
            width: 100%;

            .el-form-item--small.el-form-item{
                margin-bottom: 0;
            }
        }
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