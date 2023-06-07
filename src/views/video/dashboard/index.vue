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
        
        <div class="info-wrap">
            <div class="row" style="justify-content:start">
                <div class="label" style="width:70px">道路:</div>
                <div class="val">
                    <el-select v-model="road">
                        <el-option
                        v-for="dict in dict.type.sys_road"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                        />
                    </el-select>
                </div>
            </div>
            <div class="row" style="justify-content:start">
                <div class="label" style="width:70px">视频分类:</div>
                <div class="val">
                    <el-select v-model="deviceCategory">
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
                <div class="label">总监控设备数量</div>
                <div class="number">
                    <span class="strong">{{info.totalMonitorCount}}</span>
                    <span>(台)</span>
                </div>
            </div>
            <div class="row">
                <div class="box-h100 gray white">
                    <div class="flex">
                        <div class="circle"></div>
                        <div class="label">正常</div>
                    </div>
                    <div class="number">
                        <span class="strong">{{info.onlineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray white">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">离线</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.offlineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                
            </div>
            <div class="chart-wrap">
                <div class="chart-header">
                    <div class="title">视频分类统计</div>
                    <div class="sub-title">单位：台</div>
                </div>
                <div class="chart-body">
                    <div id="chart1"  ref="chart1" ></div>
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
        <el-dialog :visible.sync="visible" width="800px">
            <template slot="title">
                <div class="custom-title">
                    <span class="text">{{detail.name}}</span>
                </div>
            </template>
            <div class="detail-info">
                <el-row>
                    <el-col :span="24">
                        <div class="video-wrap">
                            <video src="" class="video"></video>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="row">
                            <div class="label">设备UID：</div>
                        </div>
                    </el-col>
                     <el-col :span="12">
                        <div class="row">
                            <div class="label">设备坐标：</div>
                        </div>
                    </el-col>
                     <el-col :span="12">
                        <div class="row">
                            <div class="label">设备型号：</div>
                        </div>
                    </el-col>
                     <el-col :span="12">
                        <div class="row">
                            <div class="label">安装时间：</div>
                        </div>
                    </el-col>
                </el-row>
              
                <div style="text-align:center">
                    <el-button type="primary" @click="goDetail">查看详情</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts'

import { getMonitorDetailInMap } from "@/api/environment";

import { getOverviewInfo,getRealTimeUrl } from "@/api/video";


import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}
export default {
    dicts: ['sys_road','sys_video_type'],
    data(){
        return {
            deviceCategory:'',
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
                count:0,
                offLine:1,
                onlineCount:0,
                slpAirInfoVoList:[],
                warningContent:'',
                warningLevel:'',
                warningName:'',
                warningType:''
            },
            visible:false,
            detail:{
                
            },
            chart_data:[],

            distanceStatus:false
        }
    },
    methods:{
        initChart(){
            var el = this.$refs['chart1'];
            this.chart = echarts.init(el);
            let option = {
                color:['#6ADCAF','#6395F9','#FF9E88','#F7C32D'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    left: 'center',
                    bottom: 20,
                    itemWidth:14
                },
                grid:{
                    bottom:35,
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['25%', '50%'],
                         center: ['50%', '50%'],
                        data: this.chart_data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            this.chart.setOption(option)
        },
        search(){
            let keyword = this.keyword;
            let list = JSON.parse(JSON.stringify(this.markerList))
            console.log(list)
            this.map.clearMap();
            let result;
            if (keyword) {
                result = list.filter(item => {
                    return item.name.indexOf(keyword) > -1
                })
            } else {
                console.log(list)
                result = list
            }
           
            result.forEach(item => {
                this.addMarker(item)
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
                this.distance = new this.AMap.RangingTool(this.map)

                this.getInfo();
                
            }).catch(e => {
                console.log(e);
            });
        },
        getInfo(){
            getOverviewInfo().then(res => {
                if (res.code == 200) {
                    this.$set(this, 'info', res.data);
                    let list = res.data.slpMonitorList;
                    if (this.AMap) {
                        list.forEach(item => {
                            if (item.longitude) {
                                new this.AMap.Marker({
                                    position:[item.longitude, item.latitude],
                                    map:this.map
                                }).on('click', (event) => {
                                    console.log(event, 'marker click')
                                    this.getMonitorDetailInMap(item.id)
                                })
                            }
                            
                        });
                    }

                    if (res.data){
                        let chart_data = []
                        chart_data.push({
                            value: res.data.policeCount, name: '公安'
                        })

                        chart_data.push({
                            value: res.data.trafficPoliceCount, name: '交警'
                        })

                        chart_data.push({
                            value: res.data.municipalAdministrationCount, name: '市政'
                        })

                        chart_data.push({
                            value: res.data.otherCount, name: '其他'
                        })

                        this.$set(this, 'chart_data', chart_data)
                        this.$nextTick(() =>  {
                            this.initChart()

                        })
                    }
                }
            })
        },
        getMonitorDetailInMap(id){
            getMonitorDetailInMap(id).then(res => {
                if (res.code == 200) {
                    this.visible = true
                    this.$set(this, 'detail', res.data)
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
        }
    },
    mounted(){
        this.initMap();
    }
}
</script>
<style lang="scss">
.hydrops-dashboard{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;

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
            flex-wrap: wrap;

            .box-h100{
                width: 206px;
            }

            .box-h100:nth-child(even){
                margin-left: 16px;
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
</style>