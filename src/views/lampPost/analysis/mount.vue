<template>
    <div class="app-container analysis-mount" style="background:#eee;height:calc(100vh - 50px)">
        <div class="page-title">挂载统计</div>
        <div class="h104"></div>
        <div class="content">
            <div class="left">
                <div class="map" id="map"></div>
            </div>
            <div class="right">
                <div class="h310">
                    <div class="row">
                        <div class="label">总挂载率:</div>
                        <div class="val">99.5%</div>
                    </div>
                    <div class="list">
                        <div class="item" v-for="(item,index) in list" :key="index">
                            <div class="item-name">A道路设备挂载率</div>
                            <div class="item-value">99%</div>
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

export default {
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
        }
    },
    methods:{
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
        for (let i = 0; i < 20; i++) {
            this.list.push({})
        }
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