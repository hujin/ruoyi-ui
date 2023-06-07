<template>
    <div class="app-container conserve-analysis-address" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="map" style="width:100%;height:100%" id="map"></div>
        </div>
        <div class="right">
            <div class="row">
                <div class="row-item">
                    <div class="label">巡查地点数量</div>
                    <div class="val">{{inspectionAddressCount || 0}}个</div>
                </div>
            </div>
            <div class="chart-wrap">
                <div class="chart-title">各地巡查次数</div>
                <div class="chart-container">
                    <div class="chart" id="chart2" ref="chart2"></div>

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

import { getMountingAnalysis } from "@/api/lampPost";

export default {
    dicts: ['sys_road'],
    data(){
        return {
            chart2:null,
            yAxis2:[],
            map : null,
            mouseTool : null,
            overlays : [],
            auto : null,
            placeSearch : null, 
            AMap:null,
            inspectionAddressCount:''
        }
    },
    methods:{
        roadFormat(road) {
            return this.selectDictLabel(this.dict.type.sys_road, road);
        },
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

            let option = {
                tooltip: {
                    show:true
                },
                colors:['#F7C32D','#F1866D', '#61DEDD', '#6ADCAF', '#6395F9'],
                legend: {
                    top: 'bottom',
                    itemWidth:14,
                },
                
                series: [
                    {
                        name: '各地巡查次数',
                        type: 'pie',
                        radius: [50, 120],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 0
                        },
                        data: this.yAxis2
                    }
                ]
            };

            this.chart2.setOption(option)

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
                    center : [120.252635, 30.236056], //中心点坐标  郑州
                    resizeEnable: true
                });
                console.log('fffff')
                this.getMountingAnalysis()
            }).catch(e => {
                console.log(e);
            });
        },
        getMountingAnalysis(){
            getMountingAnalysis().then(res => {
                if (res.code == 200) {
                    this.inspectionAddressCount = res.data.inspectionAddressCount

                    if (res.data.heatMapList) {
                        var heatmap = new this.AMap.Heatmap(this.map, {
                            radius:25,
                            opacity: [0, 0.8],
                            
                        })

                        heatmap.setDataSet({
                            data:res.data.heatMapList
                        })
                    }

                    if (res.data.slpInspectionAddressCountVoList) {
                        let yAxis2 = []
                        let slpInspectionAddressCountVoList = res.data.slpInspectionAddressCountVoList
                        slpInspectionAddressCountVoList.forEach(item => {
                            yAxis2.push({
                                name: this.roadFormat(item.road),
                                value: item.inspectionCount
                            })
                        })

                        this.$set(this, 'yAxis2', yAxis2)
                        this.$nextTick(() => {
                            this.initChart2()
                        })
                    }
                }
            })
        }
    },
     mounted(){
        this.initMap()
    }
}
</script>
<style lang="scss">
.conserve-analysis-address{
    display: flex;

    .left{
        flex: 1;
        height: 100%;
        width: 0;
    }

    .right{
        width: 460px;
        height: 100%;
        margin-left: 24px;
        display: flex;
        flex-direction: column;

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

            .chart{
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>