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
                <el-radio-group v-model="type">
                    <el-radio :label="1">同比</el-radio>
                    <el-radio :label="2">环比</el-radio>
                </el-radio-group>
            </div>
            <div class="info-list">
                <div class="info-item">
                    <div class="label">平均水位高度</div>
                    <div class="val">
                        <div class="num">{{info.avgWaterLevel || 0}}</div>
                        <div class="symbol">cm</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">{{type == 1 ? info.waterLevelCompare.yoy : info.waterLevelCompare.qoq}}%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">{{type == 1 ? info.waterLevelCompare.yoyIncr : info.waterLevelCompare.qoqIncr}}%</div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">平均排水速度</div>
                    <div class="val">
                        <div class="num">{{info.avgWaterLevelDown || 0}}</div>
                        <div class="symbol">cm/h</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">{{type == 1 ? info.waterLevelDownCompare.yoy : info.waterLevelDownCompare.qoq}}%</div>
                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">{{type == 1 ? info.waterLevelDownCompare.yoyIncr : info.waterLevelDownCompare.qoqIncr}}%</div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">平均积水速度</div>
                    <div class="val">
                        <div class="num">{{info.avgWaterLevelUp || 0}}</div>
                        <div class="symbol">cm/h</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">{{type == 1 ? info.waterLevelUpCompare.yoy : info.waterLevelUpCompare.qoq}}%</div>

                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">{{type == 1 ? info.waterLevelUpCompare.yoyIncr : info.waterLevelUpCompare.qoqIncr}}%</div>

                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">累计积水时长</div>
                    <div class="val">
                        <div class="num">{{info.totalWarningTime}}</div>
                        <div class="symbol">h</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">{{type == 1 ? info.warningTimeCompare.yoy : info.warningTimeCompare.qoq}}%</div>

                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">{{type == 1 ? info.warningTimeCompare.yoyIncr : info.warningTimeCompare.qoqIncr}}%</div>

                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="label">报警次数</div>
                    <div class="val">
                        <div class="num">{{info.warningTimes}}</div>
                        <div class="symbol">次</div>
                    </div>
                    <div class="percent">
                        <div class="r">
                            <div class="text">同比上升</div>
                            <div class="text">{{type == 1 ? info.warningTimesCompare.yoy : info.warningTimesCompare.qoq}}%</div>

                        </div>
                        <div class="r">
                            <div class="text">同比增幅</div>
                            <div class="text">{{type == 1 ? info.warningTimesCompare.yoyIncr : info.warningTimesCompare.qoqIncr}}%</div>

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
                <div class="section-item-wrap" style="position:relative">
                    <div class="title">报警统计</div>
                    <div class="state-total-wrap">
                        <div class="total-item">
                            <span class="text">共</span>
                            <span class="big">{{chart2_total}}</span>
                            <span class="text">次报警</span>
                        </div>
                        <div class="total-item">
                            <span class="text">同比上升</span>
                            <span class="num">{{chart2_yoy}}%</span>
                        </div>
                    </div>
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
import { getPondingOverviewWithCompare,
         getPondingStat,
         pondingForecastVo,
         getWarningStatYoy } from "@/api/hydrops";


export default {
    props:{
        id:{
            type: String ,
            default:''
        }
    },
    watch:{
       
        id:{
            handler(val){
                if (val) {
                    let now = new Date()
                    let before = new Date().setMonth(new Date().getMonth() - 1)
                    this.queryParams.time[0] = new Date(before);
                    this.queryParams.time[1] =  now
                    this.getPondingOverviewWithCompare();
                    this.getPondingStat()
                    this.pondingForecastVo()
                    this.getWarningStatYoy()
                }
            },
            immediate:true
        }
    },
    data(){
        return {
            type:1,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                time: [],
                monitorTimeStart:'',
                monitorTimeEnd:'',
            },
            info:{
                avgWaterLevel:0,
                avgWaterLevelDown:0,
                avgWaterLevelUp:0,
                totalWarningTime:0,
                warningTimes:0,
                warningTimeCompare:{
                    qoq:0,
                    qoqIncr:0,
                    yoy:0,
                    yoyIncr:0
                },
                warningTimesCompare:{
                    qoq:0,
                    qoqIncr:0,
                    yoy:0,
                    yoyIncr:0
                },
                waterLevelCompare:{
                    qoq:0,
                    qoqIncr:0,
                    yoy:0,
                    yoyIncr:0
                },
                waterLevelDownCompare:{
                    qoq:0,
                    qoqIncr:0,
                    yoy:0,
                    yoyIncr:0
                },
                waterLevelUpCompare:{
                    qoq:0,
                    qoqIncr:0,
                    yoy:0,
                    yoyIncr:0
                }
            },
            showSearch: true,
            loading: false,
            chart1:null,
            chart1_xAxis:[],
            chart1_yAxis:[],
            chart2:null,
            chart2_xAxis:[],
            chart2_yAxis:[],
            chart2_total:'',
            chart2_yoy:'',
            chart3:null,
            chart3_xAxis:[],
            chart3_yAxis:[],
            chart4:null,
            chart4_xAxis:[],
            chart4_yAxis:[],
            chart5:null,
            chart5_xAxis:[],
            chart5_yAxis:[],
            chart6:null,
            chart6_xAxis:[],
            chart6_yAxis:[],
        }
    },
    methods:{
        handleQuery(){},
        resetQuery(){
            let now = new Date()
            let before = new Date().setMonth(new Date().getMonth() - 1)
            this.queryParams.time[0] = new Date(before);
            this.queryParams.time[1] =  now
        },
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);
            let options = {
                color:['#6395F9','#6ADCAF','#F7C32D'],
                tooltip: {
                    show:true,
                    trigger:'axis',
                    renderMode:'richText'                
                },
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['最低水位','最高水位','平均水位']
                },

                grid:{
                    bottom:20,
                    right:10,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.chart1_xAxis,
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
                    data: this.chart1_yAxis[0]
                },{
                    name:'最高水位',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: this.chart1_yAxis[1]
                },{
                    name:'平均水位',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: this.chart1_yAxis[2]
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
                        data: this.chart2_xAxis,
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
                    data:this.chart2_yAxis[2]
                },{
                    name:'二级报警',
                    type:'bar',
                    stack:'ad',
                    data:this.chart2_yAxis[1]
                },{
                    name:'三级报警',
                    type:'bar',
                    stack:'ad',
                    data:this.chart2_yAxis[0]
                }]
            }

            this.chart2.setOption(options)

        },
        initChart3(){
            var el = this.$refs['chart3']
            this.chart3 = echarts.init(el)
            let options = {
                color:['#6395F9'],
                tooltip: {
                    trigger:'axis',
                    renderMode:'richText'                
                },
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
                        data: this.chart3_xAxis,
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
                    data: this.chart3_yAxis,
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
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
                tooltip: {
                    trigger:'axis',
                    renderMode:'richText'                
                },
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
                        data: this.chart4_xAxis,
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
                    data: this.chart4_yAxis,
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
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
                tooltip: {
                    renderMode:'richText'                
                },
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
                        data: this.chart5_xAxis,
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
                    data: this.chart5_yAxis[0],
                    type: 'line',
                    smooth: true,
                    tooltip: {
                        valueFormatter: function (value) {
                            return (value || 0) + ' cm';
                        }
                    },
                    name:'当前水位'
                },{
                    data: this.chart5_yAxis[1],
                    type: 'line',
                    smooth: true,
                    name:'未来水位',
                    tooltip: {
                        valueFormatter: function (value) {
                            return (value || 0) + ' cm';
                        }
                    },
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
                tooltip: {
                    renderMode:'richText'                
                },
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
                        data: this.chart6_xAxis,
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
                    data: this.chart6_yAxis[0],
                    type: 'line',
                    smooth: true,
                    name:'当前水位',
                    tooltip: {
                        valueFormatter: function (value) {
                            return (value || 0) + ' cm';
                        }
                    },
                },{
                    data: this.chart6_yAxis[1],
                    type: 'line',
                    smooth: true,
                    name:'未来水位',
                    lineStyle: {
                        type: 'dashed'
                    },
                    tooltip: {
                        valueFormatter: function (value) {
                            return (value || 0) + ' cm';
                        }
                    },
                }]
            }

            this.chart6.setOption(options)
        },
        getPondingOverviewWithCompare(){
            let params = {
                deviceUid:this.id,
                startTime:'',
                endTime:''
            }

            if (this.queryParams.time[0]) {
                params.startTime = new Date(this.queryParams.time[0]).getTime()
                params.endTime = new Date(this.queryParams.time[1]).getTime()
            }
            getPondingOverviewWithCompare(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.$set(this, 'info', res.data)
                    }
                }

            })
        },
        getPondingStat(){
            let params = {
                deviceUid:this.id,
                startTime:'',
                endTime:''
            }

            if (this.queryParams.time[0]) {
                params.startTime = new Date(this.queryParams.time[0]).getTime()
                params.endTime = new Date(this.queryParams.time[1]).getTime()
            }
            getPondingStat(params).then(res => {
                if (res.code == 200){
                    if (res.data) {
                        if (res.data.waterLevelStatVoList) {
                            let chart1_xAxis = []
                            let chart1_yAxis = [[],[],[]]
                            res.data.waterLevelStatVoList.forEach(item => {
                                chart1_xAxis.push(item.timeStr)
                                chart1_yAxis[0].push(item.lowest)
                                chart1_yAxis[1].push(item.highest)
                                chart1_yAxis[2].push(item.avg)

                            })

                            this.$set(this, 'chart1_xAxis', chart1_xAxis)
                            this.$set(this, 'chart1_yAxis', chart1_yAxis)

                            this.$nextTick(() => {
                                this.initChart1()
                            })
                        }

                        if (res.data.waterUpStatVoList) {
                            let chart3_xAxis = []
                            let chart3_yAxis = []

                            res.data.waterUpStatVoList.forEach(item => {
                                chart3_xAxis.push(item.timeStr)
                                chart3_yAxis.push(item.changeValue)
                            })


                            this.$set(this, 'chart3_xAxis', chart3_xAxis)
                            this.$set(this, 'chart3_yAxis', chart3_yAxis)

                            this.$nextTick(() => {
                                this.initChart3()
                            })
                        }

                        if (res.data.waterDownStatVoList) {
                            let chart4_xAxis = []
                            let chart4_yAxis = []

                            res.data.waterDownStatVoList.forEach(item => {
                                chart4_xAxis.push(item.timeStr)
                                chart4_yAxis.push(item.changeValue)
                            })


                            this.$set(this, 'chart4_xAxis', chart4_xAxis)
                            this.$set(this, 'chart4_yAxis', chart4_yAxis)

                            this.$nextTick(() => {
                                this.initChart4()
                            })
                        }
                    }
                }
            })
        },
        pondingForecastVo(){
            let params = {
                deviceUid:this.id,
                startTime:'',
                endTime:''
            }

            if (this.queryParams.time[0]) {
                params.startTime = new Date(this.queryParams.time[0]).getTime()
                params.endTime = new Date(this.queryParams.time[1]).getTime()
            }

            pondingForecastVo(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        if (res.data.waterLevelForecastList) {
                            let chart5_xAxis = [];
                            let chart5_yAxis = [[],[]];

                            res.data.waterLevelForecastList.forEach((item,index) => {
                                chart5_xAxis.push(item.timeStr)
                                if (item.current) {
                                    chart5_yAxis[0].push(item.waterLevel)
                                    chart5_yAxis[1].push(null)
                                } else {
                                    chart5_yAxis[1].push(item.waterLevel)
                                    if (index > 0) {
                                        if (res.data.waterLevelForecastList[index - 1].current) {
                                            chart5_yAxis[0].push(item.waterLevel)
                                        } else {
                                            chart5_yAxis[0].push(null)

                                        }
                                    } else {
                                        chart5_yAxis[0].push(null)
                                    }
                                }
                            })

                            this.$set(this, 'chart5_xAxis', chart5_xAxis)
                            this.$set(this, 'chart5_yAxis', chart5_yAxis)

                            this.$nextTick(() => {
                                this.initChart5()
                            })
                        }

                        if (res.data.pondingTimeForecastList) {
                            let chart6_xAxis = [];
                            let chart6_yAxis = [[],[]];

                            res.data.pondingTimeForecastList.forEach((item,index) => {
                                chart6_xAxis.push(item.timeStr)
                                if (item.current) {
                                    chart6_yAxis[0].push(item.waterLevel)
                                    chart6_yAxis[1].push(null)
                                } else {
                                    chart6_yAxis[1].push(item.waterLevel)
                                    if (index > 0) {
                                        if (res.data.pondingTimeForecastList[index - 1].current) {
                                            chart6_yAxis[0].push(item.waterLevel)
                                        } else {
                                            chart6_yAxis[0].push(null)

                                        }
                                    } else {
                                        chart6_yAxis[0].push(null)
                                    }
                                }
                            })

                            this.$set(this, 'chart6_xAxis', chart6_xAxis)
                            this.$set(this, 'chart6_yAxis', chart6_yAxis)

                            this.$nextTick(() => {
                                this.initChart6()
                            })
                        }
                    }
                }
            })
        },
        getWarningStatYoy(){
            let params = {
                deviceUid:this.id,
                startTime:'',
                endTime:''
            }

            if (this.queryParams.time[0]) {
                params.startTime = new Date(this.queryParams.time[0]).getTime()
                params.endTime = new Date(this.queryParams.time[1]).getTime()
            }
            getWarningStatYoy(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        let total = 0;
                        if (res.data.warningStatList) {
                             let chart2_xAxis = [];
                            let chart2_yAxis = [[],[],[]];
                            res.data.warningStatList.forEach(item => {
                                chart2_xAxis.push(item.timeStr)
                                total += (parseInt(item.mild) + parseInt(item.medium) + parseInt(item.serious))
                                chart2_yAxis[0].push(item.serious)
                                chart2_yAxis[1].push(item.medium)
                                chart2_yAxis[2].push(item.mild)

                            })

                            this.$set(this, 'chart2_xAxis', chart2_xAxis)
                            this.$set(this, 'chart2_yAxis', chart2_yAxis)
                            this.chart2_total = total;
                            this.chart2_yoy = res.data.yoy
                            this.$nextTick(() => {
                                this.initChart2()
                            })
                        }
                    }
                }
            })
        }
        
    },
    mounted(){
        
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

    .state-total-wrap{
        position: absolute;
        height: 32px;
        padding: 0 16px;
        border-radius: 16px;
        background-color: #f1f8ff;
        display: flex;
        align-items: center;
        right: 24px;

        .total-item{
            font-size: 14px;
            display: flex;
            align-items: center;

            .big{
                font-size: 20px;
                margin: 0 4px;
            }

            .num{
                font-weight: 500;
                margin-left: 4px;
            }
        }

        .total-item + .total-item{
            margin-left: 16px;
        }
    }

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