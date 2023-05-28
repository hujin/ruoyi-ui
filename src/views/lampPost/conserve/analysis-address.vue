<template>
    <div class="app-container conserve-analysis-address" style="background:#eee;height:calc(100vh - 50px)">
        <div class="left">
            <div class="map" style="width:100%;height:100%" id="map"></div>
        </div>
        <div class="right">
            <div class="row">
                <div class="row-item">
                    <div class="label">巡查地点数量</div>
                    <div class="val">18个</div>
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

export default {
    data(){
        return {
            chart2:null,
            map : null,
            mouseTool : null,
            overlays : [],
            auto : null,
            placeSearch : null, 
            AMap:null,
        }
    },
    methods:{
        initChart2(){
            var el = this.$refs['chart2'];
            this.chart2 = echarts.init(el);

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

            this.chart2.setOption(option)

        },
        initMap() {
            AMapLoader.load({
                "key": "df32d1c57071a49dc07d45dbaad7cdbd", 
                "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.Icon','AMap.Marker'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                // 初始化地图
                this.AMap = AMap;
                this.map = new AMap.Map('map',{
                    viewMode : "2D",  //  是否为3D地图模式
                    zoom : 13,   // 初始化地图级别
                    center : [120.252635, 30.236056], //中心点坐标  郑州
                    resizeEnable: true
                });
            }).catch(e => {
                console.log(e);
            });
        },
    },
     mounted(){
        this.initMap()
        this.initChart2()
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