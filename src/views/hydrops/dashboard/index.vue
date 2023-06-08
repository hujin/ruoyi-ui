<template>
    <div class="hydrops-dashboard">
        <div class="map-wrap">
            <div id="map"></div>
        </div>
        <el-tooltip placement="bottom">
            <div slot="content" class="mapMore-hover">
                <div class="mapMore_li" @click="handleDistance">
                    <img style="width:20px; margin-right:8px" src="@/assets/images/i-distance.png" alt="">
                    测距
                </div>
                <div class="mapMore_li">
                    <img style="width:20px;  margin-right:8px" src="@/assets/images/i-rect.png" alt="">
                    框选
                </div>
            </div>
            <div class="mapMore">
                <i class="el-icon-more"></i>
            </div>
        </el-tooltip>
        <div class="left-wrap">
            <div class="data-wrap" :class="{open:isOpen}">
                <div class="data-header">
                    <span>实时上报数据：2023-01-12  16:00:00</span>
                    <img @click="isOpen = !isOpen" class="icon" src="@/assets/images/hydrops/icon-arrow.png" alt="">
                </div>
                <div class="data-body" v-if="isOpen">
                    <div class="table-wrap">
                        <el-table :data="dataList" style="width:100%;" height="300">
                            <el-table-column label="站点名称" align="left" width="140" >
                                <template slot-scope="scope">
                                    <div style="font-size:12px;color:rgba">{{roadFormat(scope.row) + '-水位-' + scope.row.deviceName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="实时水位cm" align="center" width="100">
                                <template slot-scope="scope">
                                    <div>{{scope.row.realWater}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" align="center" >
                                <template slot-scope="scope">
                                    <div>{{scope.row.statusDesc}}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="page-wrap">
                        <el-pagination :total="dataParams.total" @current-change="handleCurrentChange" layout="prev,pager, next"></el-pagination>
                    </div>
                </div>
            </div>
            <div class="pie-wrap">
                <div class="pie-header">
                    <div class="pie-title">
                        <span class="label">报警总数</span>
                        <span class="num">{{chart3_obj.totalWarning}}</span>
                    </div>
                    <div class="pie-legend">
                        <div class="pie-legend-item">
                            <div class="circle" style="background-color:#EB0E1D"></div>
                            <div class="label">严重积水:</div>
                            <div class="num">{{chart3_obj.serious}}</div>
                        </div>
                        <div class="pie-legend-item">
                            <div class="circle" style="background-color:#FF8300"></div>
                            <div class="label">中度积水:</div>
                            <div class="num">{{chart3_obj.medium}}</div>
                        </div>
                        <div class="pie-legend-item">
                            <div class="circle" style="background-color:#FAAC13"></div>
                            <div class="label">轻度积水:</div>
                            <div class="num">{{chart3_obj.mild}}</div>
                        </div>
                    </div>
                </div>
                <div class="pie-body">
                    <div id="chart3"  ref="chart3" style="width:100%;height:100%"></div>

                </div>
            </div>
        </div>
        <div class="info-wrap">
            <div class="row" style="justify-content:start">
                <div class="label" style="width:70px">道路:</div>
                <div class="val">
                    <el-select v-model="road" @change="roadChange">
                        <el-option
                        v-for="dict in dict.type.sys_road"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                    </el-select>
                </div>
            </div>
           
            <div class="box-h100 gray">
                <div class="label">水位监测站点数</div>
                <div class="number">
                    <span class="strong">{{info.totalPondinCount}}</span>
                    <span>个</span>
                </div>
            </div>
            <div class="row" style="margin-bottom:0">
                <div class="box-h100 gray white">
                    <div class="flex">
                        <div class="circle"></div>
                        <div class="label">报警</div>
                    </div>
                    <div class="number">
                        <span class="strong">{{info.deviceWarningCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray white">
                    <div class="flex">
                        <div class="circle"></div>
                        <div class="label">在线</div>
                    </div>
                    <div class="number">
                        <span class="strong">{{info.deviceOnlineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray white">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">离线</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.deviceOfflineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="box-h100 gray" style="width:206px">
                    <div class="label">最大积水深度</div>
                    <div class="number">
                        <span class="strong">{{info.currentMaxWaterLevel}}</span>
                        <span>cm</span>
                    </div>
                </div>
                <div class="box-h100 gray"  style="width:206px">
                    <div class="label">影响通行</div>
                    <div class="number">
                        <span class="strong">{{info.warningCount}}</span>
                        <span>处</span>
                    </div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-header">
                    <div class="title">本周积水统计</div>
                    <div class="sub-title">单位：次</div>
                </div>
                <div class="chart-body">
                    <div id="chart1"  ref="chart1" style="width:100%;height:100%"></div>
                </div>
            </div>
            <div class="chart-wrap" style="margin-top:24px">
                <div class="chart-header">
                    <div class="title">周报警处理统计</div>
                    <div class="sub-title">单位：次</div>
                </div>
                <div class="chart-body">
                    <div id="chart2"  ref="chart2" style="width:100%;height:100%"></div>
                </div>
            </div>
        </div>
        <div class="zoom">
            <div class="item" @click="zoomIn">
                <i class="el-icon-plus"></i>
            </div>
            <div class="item" @click="zoomOut">
                <i class="el-icon-minus"></i>
            </div>
        </div>
        <div class="search">
            <el-input v-model="keyword" placeholder="请输入搜索内容" clearable>
                <div slot="append" @click="search" class="search-btn" type="primary" icon="el-icon-search">
                    <i class="el-icon-search" style="font-size:20px"></i>
                </div>
            </el-input>
        </div>
        
        <el-dialog :visible.sync="visible" width="800px" custom-class="customDialog" destroy-on-close @close="handleCustomClose">
            <template slot="title">
                <div>
                    {{dialogDetail.title}}
                    <span :class="statusMap[dialogDetail.status] && statusMap[dialogDetail.status].type">{{statusMap[dialogDetail.status] && statusMap[dialogDetail.status].name}}</span>
                </div>
            </template>
            <div class="detail-info">
                <div class="desc-card">
                    <div class="desc-card-left">
                        <div class="desc-card-left-title">
                            {{dialogDetail.realWater}}cm
                        </div>
                        <div class="desc-card-left-desc">
                            实时水位
                        </div>
                    </div>
                    <div class="desc-card-right">
                        <div style="margin-bottom:16px">
                            <span>
                                站点地址：
                            </span>
                            {{dialogDetail.address}}
                        </div>
                        <div>
                            <span>
                                站点坐标：
                            </span>
                            {{dialogDetail.longitude}}，{{dialogDetail.latitude}}
                        </div>        
                    </div>
                </div>
                <div class="desc-info">
                    <el-row style="margin-bottom:16px">
                        <el-col :span="14">
                            <div class="desc-info-col">
                                <span>今日最大水位：</span>
                                {{dialogDetail.currentMaxWaterLevel}}cm
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="desc-info-col">
                                <span>积水速度：</span>
                                {{dialogDetail.waterLevelUpSpeed}}cm/h
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="14">
                            <div class="desc-info-col">
                                <span>排水速度：</span>
                                {{dialogDetail.waterLevelDownSpeed}}cm
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="desc-info-col">
                                <span>积水时长：</span>
                                {{dialogDetail.warningContinueTime}}cm/h
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="dialogVideo">
                    <video id="dialogVideo" class="video-js" controls autoplay style="width:100%;height:100%" ></video>
                </div>
                <div class="btn-wrap" style="text-align:right">
                    <div class="btn">
                        数据分析
                    </div>  
                    <div class="btn">
                        历史数据
                    </div>  
                    <div class="btn">
                        报警处理
                    </div>  
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts'


import { getPondingWarningWeekStat,
         getOverviewInfo,
         getSlpPondingReportedDataBase,
         getWarningProportionVo,
         getDeviceInfoById,
        } from "@/api/hydrops";

import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}
export default {
    dicts: ['sys_road'],
    data(){
        return {
            isOpen:true,
            dataList:[],
            dataParams:{
                pageNum:1,
                total:0
            },
            road:'',
            keyword:'',
            markerList:[],
            current:'',
            map : null,
            mouseTool : null,
            overlays : [],
            auto : null,
            placeSearch : null, 
            AMap:null,
            info:{
                currentMaxWaterLevel:0,
                deviceOfflineCount:0,
                deviceOnlineCount:0,
                deviceWarningCount:0,
                slpPondingMonitorList:[],
                totalPondinCount:0,
                warningCount: 0,
            },
            visible:false,
            chart1:null,
            chart1_xAxis:[],
            chart1_yAxis:[],
            chart2:null,
            chart2_xAxis:[],
            chart2_yAxis:[],
            detail:{
                
            },
            chart3_obj:{
                medium: 0,
                mild: 0,
                normal: 0,
                serious: 0,
                totalWarning: 0
            },
            chart3:null,
            chart3_xAxis:[],
            chart3_yAxis:[],

            distanceStatus:false,

            dialogDetail:{

            },
            statusMap:{
                0:{
                    name:'离线',
                    type:'runState-info'
                },
                1:{
                    name:'正常运行',
                    type:'runState-success'
                },
                2:{
                    name:'报警',
                    type:'runState-error'
                },
            }
        }
    },
    methods:{
        handleCurrentChange(val){
            this.dataParams.pageNum = val
            this.getSlpPondingReportedDataBase()
        },
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
        roadChange(){
            this.map.clearMap();

            this.getInfo()
        },
        initChart1(){
            var el = this.$refs['chart1'];
            this.chart1 = echarts.init(el);
            let options = {
                color:['#6ADCAF','#6395F9','#F7C32D'],
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
                    name:'轻度积水',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: this.chart1_yAxis[0]
                },{
                    name:'中度积水',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' cm';
                        }
                    },
                    data: this.chart1_yAxis[1]
                },{
                    name:'中度积水',
                    type: 'bar',
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
                color:['#6395F9','#6ADCAF'],
                legend: {
                    left: 'right',
                    top: 0,
                    itemWidth:14,
                    data:['全部','已处理'],
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
                    name:'全部',
                    type:'bar',
                    stack:'ad',
                    data:this.chart2_yAxis[0]
                },{
                    name:'已处理',
                    type:'bar',
                    stack:'ad',
                    data:this.chart2_yAxis[1]
                }]
            }

            this.chart2.setOption(options)

        },
        initChart3(){
            var el = this.$refs['chart3'];
            this.chart3 = echarts.init(el);
            let options = {
                tooltip: {
                    show:true
                },
                color:['#4E86FF','#FAAC13','#FF8300','#EB0E1D'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '30',
                    right: '50',
                    itemWidth:14,
                    orient:'vertical'
                },
                series: [
                    {
                        name: '报警总数',
                        type: 'pie',
                        center: [100,80],
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.chart3_yAxis
                    }
                ]
            }

            this.chart3.setOption(options)

        },
        search(){
            let keyword = this.keyword;
            let list = JSON.parse(JSON.stringify(this.markerList))
            this.map.clearMap();
            let result;
            if (keyword) {
                result = list.filter(item => {
                    return item.name.indexOf(keyword) > -1
                })
            } else {
                result = list
            }
           
            result.forEach(item => {
                if (item.latitude) {
                    this.addMarker(item)
                }
            })
        },
        addMarker(item){
             new this.AMap.Marker({
                position:[item.longitude, item.latitude],
                map:this.map
            }).on('click', (event) => {
                this.getDeviceInfoById(item.id)
                                            // console.log(event, 'marker click', item.id)
            })
        },
        zoomIn(){
            this.map.zoomIn()
        },
        zoomOut(){
            this.map.zoomOut()
        },
        goDetail(){
            this.visible = false;
            this.$router.push({
                path:'/hydropsonment/weather-data?id=' + this.detail.id
            })
        },
        getDeviceInfoById(id){
            getDeviceInfoById(id).then(res => {
                if (res.code == 200) {
                    this.dialogDetail = res.data
                    this.visible = true
                    this.$nextTick(()=>{
                        this.player = videojs(`dialogVideo`, {})
                        this.player.src([{
                            type:'application/x-mpegURL',
                            src: res.data.realVideoUrl
                        }]);
                        this.player.play()
                    })
                }
            })
        }, 
        handleCustomClose(){
            this.player.dispose()
            this.player = null
        },
        initMap() {
            AMapLoader.load({
                "key": "df32d1c57071a49dc07d45dbaad7cdbd", 
                "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.Icon','AMap.Marker', 'AMap.RangingTool'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                // 初始化地图
                this.AMap = AMap;
                this.map = new AMap.Map('map',{
                    viewMode : "2D",  //  是否为3D地图模式
                    zoom : 13,   // 初始化地图级别
                    center : [120.252635, 30.236056], //中心点坐标  郑州
                    resizeEnable: true
                });
                this.getInfo();

                this.distance = new this.AMap.RangingTool(this.map)

            }).catch(e => {
                console.log(e);
            });
        },
        getInfo(){
            let params = {
                road:this.road
            }
            getOverviewInfo(params).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.$set(this, 'info', res.data);
                        let list = res.data.slpPondingMonitorList;
                        this.$nextTick(() => {
                            if (this.AMap && list) {
                                list.forEach(item => {
                                    if (item.latitude) {
                                       this.addMarker(item)
                                    }
                            
                                });
                            }
                        })
                        
                    } else {
                        this.$set(this, 'info', {
                            currentMaxWaterLevel:0,
                            deviceOfflineCount:1,
                            deviceOnlineCount:0,
                            deviceWarningCount:0,
                            slpPondingMonitorList:[],
                            totalPondinCount:0,
                            warningCount:0,
                        });

                    }
                    
                }
            })
        },
        getPondingWarningWeekStat(){
            getPondingWarningWeekStat({}).then(res => {
                if(res.code == 200) {
                    if (res.data) {
                        if (res.data.warningStatVo) {
                            let chart1_xAxis = [];
                            let chart1_yAxis = [[],[],[]];

                            res.data.warningStatVo.forEach(item => {
                                chart1_xAxis.push(item.timeStr)

                                chart1_yAxis[0].push(item.mild)
                                chart1_yAxis[1].push(item.medium)
                                chart1_yAxis[2].push(item.serious)
                            })

                            this.$set(this, 'chart1_xAxis', chart1_xAxis)
                            this.$set(this, 'chart1_yAxis', chart1_yAxis)

                            this.$nextTick(() => {
                                this.initChart1()
                            })
                        }

                        if (res.data.warningHandleStatVo) {
                            let chart2_xAxis = [];
                            let chart2_yAxis = [[],[]];

                            res.data.warningHandleStatVo.forEach(item => {
                                chart2_xAxis.push(item.timeStr)

                                chart2_yAxis[0].push(item.handleTimes)
                                chart2_yAxis[1].push(item.warningTimes)
                            })

                            this.$set(this, 'chart2_xAxis', chart2_xAxis)
                            this.$set(this, 'chart2_yAxis', chart2_yAxis)

                            this.$nextTick(() => {
                                this.initChart2()
                            })
                        }
                    }
                }
            })
        },
        getSlpPondingReportedDataBase(){
            getSlpPondingReportedDataBase(this.dataParams).then(res => {
                if (res.code == 200) {
                    if (res.rows) {
                        this.dataList = res.rows
                        this.dataParams.total = res.total
                    }
                }
            })
        },
        getWarningProportionVo(){
            getWarningProportionVo().then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.$set(this, 'chart3_obj', res.data)
                        let data = [
                            { value: res.data.normal, name: '未积水' },
                            { value: res.data.mild, name: '轻度积水' },
                            { value: res.data.medium, name: '中度积水' },
                            { value: res.data.serious, name: '严重积水' }
                        ]
                        this.$set(this, 'chart3_yAxis', data)
                        this.$nextTick(() => {
                            this.initChart3()

                        })
                    }
                }
            })
        },
        handleDistance(){
            if(this.distanceStatus){
                this.distance.turnOff()
                this.distanceStatus = false
            }else{
                this.distance.turnOn()
                this.distanceStatus = true
            }
        },

    },
    mounted(){
        this.initMap();

        this.getPondingWarningWeekStat();
        this.getWarningProportionVo();
        this.getSlpPondingReportedDataBase();
    },
    beforeDestroy(){
       this.player && this.player.dispose()
    }
}
</script>
<style lang="scss">
.hydrops-dashboard{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;

    .left-wrap{
        position: absolute;
        width: 340px;
        left: 24px;
        top: 85px;

        .data-wrap{
            width: 100%;
            height: 48px;
            background: #FFFFFF;
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            &.open{
                height: 422px;

                .data-header{
                    .icon{
                        transform: rotate(0deg) translateY(-50%);
                    }
                }
                
            }

            .data-header{
                position: relative;
                height: 48px;
                width: 100%;
                background: rgba(64,158,254,0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 400;
                color: rgba(0,0,0,0.6);

                .icon{
                    position: absolute;
                    top: 50%;
                    right: 35px;
                    transform: rotate(-180deg) translateY(50%);
                    width: 10px;
                    height: 10px;
                    cursor: pointer;
                }
            }

            .data-body{
                flex: 1;
                height: 0;
                width: 100%;
                box-sizing: border-box;
                padding: 16px;
                display: flex;
                flex-direction: column;
            }

            .table-wrap{
                flex: 1;
                height: 0;
            }

            .page-wrap{
                text-align: center;
            }            
        }

        .pie-wrap{
            margin-top: 16px;
            width: 340px;
            height: 268px;
            background: #FFFFFF;
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
            border-radius: 4px;
            display: flex;
            flex-direction: column;

            .pie-header{
                height: 100px;
                width: 100%;
                box-sizing: border-box;
                border-bottom:1px solid #e8e8e8;

                .pie-title{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 16px;
                    color: rgba(0,0,0,0.9);

                    .label{
                        font-size: 16px;
                        font-weight: 500;
                    }

                    .num{
                        font-size: 24px;
                        margin-left: 8px;
                    }
                    
                }

                .pie-legend{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                    box-sizing: border-box;
                    padding: 0 16px;

                    .pie-legend-item{
                        display: flex;
                        align-items: center;

                        .circle{
                            height: 8px;
                            width: 8px;
                            border-radius: 50%;
                        }

                        .label{
                            font-size: 14px;
                            color: rgba(0,0,0,0.4);
                            margin-left: 4px;
                            font-weight: 500;
                        }

                        .num{
                            margin-left: 3px;
                            font-size: 14px;
                            font-weight: 500;
                            color: rgba(0,0,0,0.9);
                        }
                    }
                }
            }

            .pie-body{
                flex: 1;
                height: 0;
                width: 100%;
            }
        }
    }

    .chart-wrap{
        .title{
            font-size: 16px;
            font-weight: 500;
            color: rgba(0,0,0,0.6);
            line-height: 24px;
        }

        .sub-title{
            margin-top: 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0,0,0,0.6);
            line-height: 20px;
        }

        .chart-body{
            height: 300px;
            width: 100%;

            #chart1{
                width: 100%;
                height: 100%;
            }
        }
    }

    .map-wrap{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        #map{
            width: 100%;
            height: 100%;
        }
    }

    .search{
        position: absolute;
        left: 24px;
        top: 24px;
        width: 286px;

        .el-input-group__append{
            position: relative;
            padding: 0;
            width: 52px;
            height: 36px;
        }

        .search-btn{
            cursor: pointer;
            background:#4E86FF;
            color:#fff;
            width:100%;
            height:100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .zoom{
        position: absolute;
        right: 500px;
        bottom: 24px;
        width: 42px;
        height: 82px;
        background-color: #fff;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
        border-radius: 4px;
        display: flex;
        flex-direction: column;

        .item{
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
        }
    }

    .info-wrap{
        position: absolute;
        right: 24px;
        top: 24px;
        bottom: 24px;
        width: 460px;
        min-height: 976px;
        box-sizing: border-box;
        overflow-y: scroll;
        padding: 16px;
        background-color: #fff;
        display: flex;
        flex-direction: column;

        &::-webkit-scrollbar{
            width:0px;
            -webkit-appearance: none;
            display: none;
            height:0px
        }

        .row{
            display: flex;
            align-items: center;
            margin-bottom: 16px;

            .label{
                font-size: 16px;
                font-weight: 400;
                color: rgba(0,0,0,0.9);
                margin-right: 10px;
                text-align: right;
            }
        }

        .box-h100{
            margin-bottom: 16px;
            width: 100%;
            height: 100px;
            box-sizing: border-box;
            background: rgba(241,159,48,0.35);
            border-radius: 4px;
            border: 1px solid #F19F30;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon{
                width: 80px;
                height: 80px;
                margin-right: 24px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }

            .text{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #F19F30;
                
            }

            .label{
                text-align: center;
                margin-top: 8px;
                font-size: 16px;
                font-weight: 400;
                line-height: 28px;
            }

        

            &.gray{
                background: #F8F9FB;
                border-radius: 8px;
                border: 1px solid #F8F9FB;
                color: rgba(0,0,0,0.8);;
                margin-bottom: 16px;
                flex-direction: column;

                &.white{
                    background-color: #fff;
                    border-color: #E7E7E7;
                }

                &.active{
                    background: linear-gradient(132deg, #FFFFFF 0%, #E5F6FF 27%, #F9FBFF 57%, #FCFDFF 100%);
                    border-radius: 8px;
                    border: 2px solid #409EFE;
                }

                .number{
                    text-align: center;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .strong{
                        font-size: 24px;
                    }
                }

                .flex{
                    display: flex;
                    align-items: center;

                    .circle{
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background-color: #05A75E;
                        margin-right: 8px;
                    }

                    .label{
                        font-size: 16px;
                        font-weight: 400;
                        color: #05A75E;
                        margin-top: 0;
                    }

                    &.gray{
                        .circle{
                            background-color: rgba(0,0,0,0.4);
                        }

                        .label{
                            color: rgba(0,0,0,0.7);;
                        }
                    }
                }
            }

           
        }

        .row{
            display: flex;
            justify-content: space-between;

            .box-h100{
                width: 132px;
            }


        }

        .state{
            height: 80px;
            width: 100%;
            display: flex;
            background: #E8FFF4;
            border-radius: 8px;
            margin-top: 16px;
            display: flex;
            align-items: center;
            justify-content: center;

            img{
                width: 40px;
                height: 41px;
            }

            .num{
                width: 81px;
                font-size: 36px;
                color: rgba(0,0,0,0.9);
                line-height: 32px;
                margin: 0 10px;
            }

            .text{
                width: 96px;
                font-size: 24px;
                font-weight: 400;
                color: rgba(0,0,0,0.6);
            }

            &.red{
                margin-top: auto;
                background: #FFF3F3;
            }
        }
        
    }

    .detail-info{
        
        .video-wrap{
            position: relative;
            height: 423px;

            video{
                width: 100%;
                height: 100%;
            }
        }

        .row{
            display: flex;
        }
    }
}
.mapMore{
    width: 52px;
    height: 45px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 19px;
    left: 346px;
    z-index: 100;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
   
}
 .mapMore-hover{
    width: 234px;
    color: #fff;
    font-size: 14px;
    line-height: 28px;
    padding: 0 10px;
}
.mapMore_li{
    cursor: pointer;
    display: flex;
    align-items: center;
}
.customDialog{
    .el-dialog__header{
        padding: 14px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.23);
    }

    .runState-success{
        color: #05A75E;
        position: relative;
        padding-left: 15px;
        margin-left: 20px;
        &::before{
            position: absolute;
            content: "";
            width: 10px;
            height: 10px;
            background: #05A75E;
            border-radius: 100%;
            top: 50%;
            margin-top: -5px;
            left: 0;
        }
    }
    .runState-info{
        color: #ccc;
        position: relative;
        padding-left: 15px;
        margin-left: 20px;
        &::before{
            position: absolute;
            content: "";
            width: 10px;
            height: 10px;
            background: #ccc;
            border-radius: 100%;
            top: 50%;
            margin-top: -5px;
            left: 0;
        }
    }
    .runState-error{
        color: red;
        position: relative;
        padding-left: 15px;
        margin-left: 20px;
        &::before{
            position: absolute;
            content: "";
            width: 10px;
            height: 10px;
            background: red;
            border-radius: 100%;
            top: 50%;
            margin-top: -5px;
            left: 0;
        }
    }
    .desc-card{
        height: 120px;
        background: #F8F9FB;
        border-radius: 4px;
        display: flex;
        .desc-card-left{
            background: rgba(64, 158, 254, 0.10);
            width: 206px;
            text-align: center;
        }
        .desc-card-left-title{
            color: rgba(0, 0, 0, 0.90);
            font-size: 48px;
            font-weight: bold;
            margin-top: 18px;
        }
        .desc-card-left-desc{
            color: rgba(0, 0, 0, 0.60);
            font-size: 16px;
        }
        .desc-card-right{
            font-size: 16px;
            padding: 28px 24px;
            color: rgba(0, 0, 0, 0.90);
            span{
                color: rgba(0, 0, 0, 0.60);
            }
        }
    }
    .desc-info{
        padding: 24px;
    }
    .desc-info-col{
        font-size: 16px;
        color: rgba(0, 0, 0, 0.90);
        span{
            color: rgba(0, 0, 0, 0.60);
        }
    }
    .dialogVideo{
        height: 375px;
    }
    .btn-wrap{
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;

      .btn{
        height: 40px;
        line-height: 40px;
        padding: 0 32px;
        box-sizing: border-box;
        border:1px solid #409EFE;
        color: #409EFE;
        font-size: 16px;
        border-radius: 3px;
        cursor: pointer;

        &.active{
          background-color: #409EFE;
          color: #fff;
        }
      }

      .btn + .btn {
        margin-left: 24px;
      }
    }
}
</style>