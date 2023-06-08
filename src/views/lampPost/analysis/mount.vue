<template>
    <div class="app-container analysis-mount" style="background:#eee;height:calc(100vh - 50px)">
        <div class="page-title">挂载统计</div>
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
                    <el-select v-model="queryForm.road" placeholder="请选择道路" clearable>
                        <el-option
                            v-for="dict in dict.type.sys_road"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="设备分类" prop="type">
                    <el-select v-model="queryForm.type" placeholder="请选择设备分类" clearable>
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
        <div class="content">
            <div class="left">
                <div class="map" id="map"></div>
            </div>
            <div class="right">
                <div class="h310">
                    <div class="row">
                        <div class="label">总挂载率:</div>
                        <div class="val">{{totalMountingPercent}}%</div>
                    </div>
                    <div class="list">
                        <div class="item" v-for="(item, index) in list" :key="index">
                            <div class="item-name">{{item.road}}设备挂载率</div>
                            <div class="item-value">{{item.mountingPercent || 0}}%</div>
                        </div>
                        
                    </div>
                </div>
                <div class="h399">
                    <div class="title">各类设备挂载量</div>
                    <div class="chart">
                        <div id="chart1" ref="chart1" style="width:100%;height:100%"></div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}

import { getDeviceMounting } from "@/api/lampPost";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
    data(){
        return {
            chart:null,
            list:[],
            map : null,
            mouseTool : null,
            overlays : [],
            auto : null,
            placeSearch : null, 
            AMap:null,
            queryForm:{
                time:[],
                road:'',
                type:'',
                date_type:'本日'
            },
            list:[],
            totalMountingPercent:'',
            heatmap:null
        }
    },
    watch:{
        queryForm:{
            handler(){
                this.getDeviceMounting()
            },
            deep:true,
            immediate:false
        }
    },
    methods:{
        roadFormat(road) {
            return this.selectDictLabel(this.dict.type.sys_road, road);
        },
        initChart(){
            var el = this.$refs['chart1'];
            this.chart = echarts.init(el);

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

            this.chart.setOption(option)

        },
        initMap() {
            AMapLoader.load({
                "key": "df32d1c57071a49dc07d45dbaad7cdbd", 
                "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.Icon','AMap.Marker', 'AMap.Heatmap'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                // 初始化地图
                this.AMap = AMap;
                this.map = new AMap.Map('map',{
                    viewMode : "2D",  //  是否为3D地图模式
                    zoom : 13,   // 初始化地图级别
                    center : [120.252635, 30.236056], //中心点坐标  
                    resizeEnable: true
                });

                this.getDeviceMounting();
            }).catch(e => {
                console.log(e);
            });
        },
        getDeviceMounting(){
            let params = {
                beginTime:'',
                endTime:'',
                timeType:'',
                road: this.queryForm.road,
                type: this.queryForm.type,
            }

            if (this.datetype == '本日') {
                params.timeType = 1
            }

            if (this.datetype == '本月') {
                params.timeType = 2
            }

            if (this.datetype == '本年') {
                params.timeType = 3
            }

            if (this.queryForm.time.length > 0) {
                params.beginTime = new Date(this.queryForm.time[0]).Format('yyyy-MM-dd')
                params.endTime = new Date(this.queryForm.time[1]).Format('yyyy-MM-dd')
            }


            getDeviceMounting(params).then(res => {
                if (res.code == 200) {
                    if (this.heatmap) {
                        this.heatmap.setMap(null)
                    }

                    if (res.data.slpPoleComprehensiveInfoVo) {
                        this.heatmap = new this.AMap.Heatmap(this.map, {
                            radius:25,
                            opacity: [0, 0.8],
                            
                        })

                        this.heatmap.setDataSet({
                            data:res.data.slpPoleComprehensiveInfoVo.slpHeatMapList
                        })
                    }

                    if (res.data.slpMountingPercentVoList) {
                        res.data.slpMountingPercentVoList.forEach(item => {
                            item['road_id'] = item.road

                            item.road = this.roadFormat(item.road)
                        })

                        this.$set(this, 'list', res.data.slpMountingPercentVoList)
                    }

                    this.totalMountingPercent = res.data.totalMountingPercent
                    
                }
            })
        }
    },
    mounted(){
        // for (let i = 0; i < 20; i++) {
        //     this.list.push({})
        // }

        this.initChart()
        this.initMap()
    }
}
</script>
<style lang="scss">
.analysis-mount{
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

    .content{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;

        .left{
            flex: 1;
            width: 0;
            height: 100%;

            .map{
                width: 100%;
                height: 100%;
                background-color: #fff;
            }
        }

        .right{
            width: 460px;
            height: 100%;
            margin-left: 24px;

            .h310{
                height: 310px;
                width: 100%;
                background-color: #fff;
                margin-bottom: 24px;
                box-sizing: border-box;
                padding: 24px;
                display: flex;
                flex-direction: column;
                border-radius: 4px;

                .row{
                    display: flex;
                    align-items: center;

                    .label{
                        font-size: 18px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.6);
                        line-height: 25px;
                    }

                    .val{
                        font-size: 26px;
                        font-weight: 500;
                        color: rgba(0,0,0,0.9);
                        line-height: 26px;
                        margin-left: 24px;
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

            .h399{
                height: 399px;
                width: 100%;
                background-color: #fff;
                box-sizing: border-box;
                padding: 24px;
                padding-bottom: 0;
                display: flex;
                flex-direction: column;
                border-radius: 4px;

                .title{
                    font-size: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: rgba(0,0,0,0.9);
                    line-height: 28px;
                }

                .chart{
                    flex: 1;
                    width: 100%;
                    height: 0;
                    margin-bottom: 8px;
                }
            }
        }
    }
}
</style>