<template>
    <div class="now">
        <div class="row">
            <div class="left1">
                <div class="info">
                    <div class="info-item" style="margin-bottom:15px">
                        <label>温度</label>
                        <span>{{info.temp}}°</span>
                    </div>
                    <div class="info-item" style="margin-bottom:15px">
                        <label>风向</label>
                        <span>{{info.windDirection}}</span>
                    </div>
                    <div class="info-item">
                        <label>相对湿度</label>
                        <span>{{info.relativeHumidity}}%</span>
                    </div>
                    <div class="info-item">
                        <label>风速</label>
                        <span>{{info.windSpeedStr}} {{info.windSpeed}}m/s</span>
                    </div>
                </div>
                <div class="box-h36">- 海拔高度 {{info.altitude}}m -</div>
            </div>
            <div class="right">
                <div class="list">
                    <div class="list-item" v-for="(item,index) in list" :key="index">
                        <img :src="item.icon" alt="" class="icon">
                        <div class="text">{{item.label}}</div>
                        <div class="text">{{info[item.key] + item.unit}}</div>

                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <el-tabs v-model="active" @tab-click="handleClick">
                <el-tab-pane label="24小时实况数据" name="first">
                    <el-table ref="tables" :data="tableData" style="width:100%;height:100%">
                        <el-table-column type="index" width="50" align="center" />
                        <el-table-column label="时间" width="220" align="center" >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.monitorTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="温度°C" width="120" prop="temp" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.temp + '°C'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="相对湿度%" width="120" prop="relativeHumidity" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.relativeHumidity + '%'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="气压hpa" width="120" prop="airPressure" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.airPressure + 'hpa'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="降雨量mm" width="120" prop="rainfall" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.rainfall + 'mm'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="辐射μT" width="120" prop="radiation" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.radiation + 'μT'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="紫外线W/㎡" width="120" prop="uv" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.uv + 'W/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="PM2.5ug/㎡" width="120" prop="pm" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.pm + 'ug/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="PM10ug/㎡" width="120" prop="pmTen" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.pmTen + 'ug/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风向" width="120" prop="windDirection" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.windDirection}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风速m/s" width="120" prop="windSpeed" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.windSpeed + '%' + ' ' + scope.row.windSpeedStr}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="海拔高度m" width="120" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.altitude }}</div>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="24小时实况曲线" name="second">
                    <div class="chart" ref="chart" id="chart" style="width:100%;height:100%"></div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import resize from '@/views/dashboard/mixins/resize'
import { getMonitorList,getHourData } from "@/api/environment";

export default {
    mixins: [resize],
    props:{
        info:{
            type:Object,
            default:{}
        },
        id:{
            type:String | Number,
            default:''
        }
    },
    data(){
        return {
            list:[{
                icon:require('@/assets/images/environ/icon-1.png'),
                label:'气压',
                value:'',
                unit:'hPa',
                key:'airPressure',
            },{
                icon:require('@/assets/images/environ/icon-2.png'),
                label:'降雨量',
                value:'',
                unit:'mm',
                key:'rainfall',
            },{
                icon:require('@/assets/images/environ/icon-4.png'),
                label:'辐射',
                value:'',
                unit:'μT',
                key:'radiation',
            },{
                icon:require('@/assets/images/environ/icon-5.png'),
                label:'紫外线',
                value:'',
                unit:'W/㎡',
                key:'uv',
            },{
                icon:require('@/assets/images/environ/icon-6.png'),
                label:'PM10',
                value:'',
                unit:'ug/㎡',
                key:'pmTen',
            },{
                icon:require('@/assets/images/environ/icon-7.png'),
                label:'PM2.5',
                value:'',
                unit:'ug/㎡',
                key:'pm',
            }],
            active:'first',
            tableData:[],
            chart:null,
            xAxisData:[],
            temps:[],
            rainfalls:[],
            relativeHumidites:[],
            airPressures:[]
        }
    },
    watch:{
        active(val){
            if (val == 'second') {
                this.$nextTick(() => {
                    this.initChart()
                })
            }
        },
        id(val){
            if (val) {
                // this.getList()
                this.getChartData();
            }
        }
    },
    methods:{
        handleClick(tab, event){

        },
        getChartData(){
            console.log(this.id)
            getHourData({
                stationId:this.id
            }).then(res => {
                let rainfalls = [];
                let temps = [];
                let relativeHumidites = [];
                let airPressures = []
                let xAxisData = []

                res.data.forEach(item => {
                    rainfalls.push(item.rainfall)
                    temps.push(item.temp)
                    relativeHumidites.push(item.relativeHumidity)
                    airPressures.push(item.airPressure)
                    xAxisData.push(item.monitorHour)
                })
                this.$set(this, 'xAxisData', xAxisData)
                this.$set(this, 'rainfalls', rainfalls)
                this.$set(this, 'temps', temps)
                this.$set(this, 'relativeHumidites', relativeHumidites)
                this.$set(this, 'airPressures', airPressures)
                this.$set(this, 'tableData', res.data)

            })
        },
        getList(){
            getMonitorList({
                stationId:this.id
            }).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'tableData', res.data.rows)
                }
            })
        },
        initChart(){
            var el = this.$refs['chart'];
            this.chart = echarts.init(el)
            const colors = ['#05A75E', '#F78724', '#409EFE', '#536DE6'];
            this.chart.setOption({
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    grid:{
                        bottom:35,
                    },
                   
                    legend: {
                        data: ['降水', '温度', '相对湿度', '气压']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            // prettier-ignore
                            data: this.xAxisData,
                            axisLabel: {
                                formatter: '{value} 时'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '降水',
                            position: 'right',
                            alignTicks: true,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} mm'
                            }
                        },
                        {
                            type: 'value',
                            name: '相对湿度',
                            position: 'right',
                            alignTicks: true,
                            offset: 80,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[2]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                        {
                            type: 'value',
                            name: '温度',
                            position: 'left',
                            alignTicks: true,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[1]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} °C'
                            }
                        },
                         {
                            type: 'value',
                            name: '气压',
                            position: 'left',
                            alignTicks: true,
                            offset: 80,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[3]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} hpa'
                            }
                        },
                    ],
                    series: [
                        {
                            name: '降水',
                            type: 'bar',
                            data: this.rainfalls
                        },
                        {
                            name: '温度',
                            type: 'line',
                            yAxisIndex: 1,
                            data: this.temps
                        },
                        {
                            name: '相对湿度',
                            type: 'line',
                            yAxisIndex: 2,
                            data: this.relativeHumidites
                        },
                        {
                            name: '气压',
                            type: 'line',
                            yAxisIndex: 3,
                            data: this.airPressures
                        }
                    ]
                })
        }
    },
    created(){
       if (this.id) {
            this.getChartData();
       }
    }
}
</script>
<style lang="scss">
.now{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .row{
        display: flex;
        background-color: #F8F9FB;
        box-sizing: border-box;
        padding: 26px 25px 16px 25px;
    }

    .left1{
        position: relative;
        width: 359px;
        margin-right: 61px;
        padding-right: 50px;
        box-sizing: border-box;

        &::after{
            content:' ';
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            height: 78px;
            width: 1px;
            background-color: #DCDCDC;
        }
    }

    .info{
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;

        .info-item{
            width: 50%;
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 4px;
            display: flex;

            label{
                width: 64px;
                margin-right: 10px;
                color: rgba(0,0,0,0.6);

            }

            span{
                color: rgba(0,0,0,0.9);

            }
        }
    }

    .box-h36{
        width: 100%;
        height: 24px;
        margin-top: 8px;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .right{
        flex: 1;
        width: 0;

        .list{
            display: flex;
            margin-top: 6px;

            .list-item{
                margin-right: 32px;

                .icon{
                    width: 24px;
                    height: 24px;
                    margin-bottom: 8px;
                }

                .text{
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.9);
                    line-height: 24px;
                }

                &:last-child{
                    margin-right: 0;
                }
            }
        }
    }

    .content{
        margin-top: 25px;
        height: 0;
        flex: 1;
    }

    .el-tabs{
        height: 100%;
        display: flex;
        flex-direction: column;

        
    }

    .el-tabs__content{
        flex: 1;
        height: 0;

        .el-tab-pane{
            width: 100%;
            height: 100%;
        }
    }
}
</style>