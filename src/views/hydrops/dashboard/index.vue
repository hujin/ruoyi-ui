<template>
    <div class="envir-dashboard">
        <div class="map-wrap">
            <div id="map"></div>
        </div>
        <div class="info-wrap">
            <div class="box-h100">
                <div class="icon">
                    <img src="@/assets/images/environ/weather/icon-1.png" alt="">
                </div>
                <div class="text">
                    <div style="font-size:20px">{{info.warningName}}</div>
                    <div style="font-size:16px">{{info.warningType}}</div>
                </div>
            </div>
            <div class="box-h100 gray">
                <div class="label">微气象站设备数量</div>
                <div class="number">
                    <span class="strong">{{info.count}}</span>
                    <span>(台)</span>
                </div>
            </div>
            <div class="row">
                <div class="box-h100 gray">
                    <div class="flex">
                        <div class="circle"></div>
                        <div class="label">正常</div>
                    </div>
                    <div class="number">
                        <span class="strong">{{info.onlineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">离线</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.offLine}}</span>
                        <span>台</span>
                    </div>
                </div>
            </div>
            <div class="weather-wrap">
                <div class="weather-info">
                    <div class="location">
                        <img src="@/assets/images/environ/weather/icon-location.png" alt="">
                        <span>杭州市</span>
                    </div>
                    <div class="temp">
                        <div class="num">12</div>
                        <div class="symbol">°</div>
                    </div>
                    <div class="section">
                        <div class="flex">
                            <img src="@/assets/images/environ/weather/icon-humidity.png" alt="">
                            <span>相对湿度 84%</span>
                        </div>
                        <div class="flex">
                            <img src="@/assets/images/environ/weather/icon-air.png" alt="">
                            <span>空气质量 48</span>
                        </div>
                    </div>
                </div>
                <div class="h100">
                    <div class="item">
                        <div class="row">
                            <span>今日</span>
                            <span>小雨转阴</span>
                            <img :src="weatherIcon[0]" alt="">
                        </div>
                        <div class="flex">
                            <div class="flex-item">
                                <img src="@/assets/images/environ/weather/icon-top.png" alt="">
                                <span>17°</span>
                            </div>
                            <div class="flex-item">
                                <img src="@/assets/images/environ/weather/icon-down.png" alt="">
                                <span>13°</span>
                            </div>

                        </div>
                    </div>
                    <div class="item">
                        <div class="row">
                            <span>明日</span>
                            <span>阴</span>
                            <img :src="weatherIcon[2]" alt="">
                        </div>
                        <div class="flex">
                            <div class="flex-item">
                                <img src="@/assets/images/environ/weather/icon-top.png" alt="">
                                <span>17°</span>
                            </div>
                            <div class="flex-item">
                                <img src="@/assets/images/environ/weather/icon-down.png" alt="">
                                <span>13°</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="weather-list-wrap">
                    <div class="title">逐日预报</div>
                    <div class="weather-list">
                        <div class="weather-item">
                            <div class="day">明天</div>
                            <img :src="weatherIcon[0]" alt="">
                            <div class="text">阴</div>
                            <div class="temp">18°</div>
                            <div class="temp">15°</div>
                            <div class="text" style="margin-top:8px;margin-bottom:24px">阴</div>
                            <img :src="weatherIcon[8]" alt="">
                        </div>
                        <div class="weather-item">
                            <div class="day">后天</div>
                            <img :src="weatherIcon[0]" alt="">
                            <div class="text">阴</div>
                            <div class="temp">18°</div>
                            <div class="temp">15°</div>
                            <div class="text" style="margin-top:8px;margin-bottom:24px">阴</div>
                            <img :src="weatherIcon[8]" alt="">
                        </div>
                        <div class="weather-item">
                            <div class="day">04/02</div>
                            <img :src="weatherIcon[0]" alt="">
                            <div class="text">阴</div>
                            <div class="temp">18°</div>
                            <div class="temp">15°</div>
                            <div class="text" style="margin-top:8px;margin-bottom:24px">阴</div>
                            <img :src="weatherIcon[8]" alt="">
                        </div>
                        <div class="weather-item">
                            <div class="day">04/03</div>
                            <img :src="weatherIcon[0]" alt="">
                            <div class="text">阴</div>
                            <div class="temp">18°</div>
                            <div class="temp">15°</div>
                            <div class="text" style="margin-top:8px;margin-bottom:24px">小到中雨</div>
                            <img :src="weatherIcon[8]" alt="">
                        </div>
                        <div class="weather-item">
                            <div class="day">04/04</div>
                            <img :src="weatherIcon[0]" alt="">
                            <div class="text">阴</div>
                            <div class="temp">18°</div>
                            <div class="temp">15°</div>
                            <div class="text" style="margin-top:8px;margin-bottom:24px">小到中雨</div>
                            <img :src="weatherIcon[8]" alt="">
                        </div>
                        <div class="weather-item">
                            <div class="day">04/05</div>
                            <img :src="weatherIcon[0]" alt="">
                            <div class="text">阴</div>
                            <div class="temp">18°</div>
                            <div class="temp">15°</div>
                            <div class="text" style="margin-top:8px;margin-bottom:24px">阴</div>
                            <img :src="weatherIcon[8]" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="visible" width="800px">
            <template slot="title">
                <div class="custom-title">
                    <span class="text">气象-{{detail.name}}</span>
                    <div class="circle" :class="{gray:detail.status != 1}"></div>
                    <div class="status" :class="{gray:detail.status != 1}">{{detail.status == 1 ? '正常运行' : '离线'}}</div>
                </div>
            </template>
            <div class="detail-info">
                <div class="base-wrap">
                    <div class="left">
                        <div class="temp">{{detail.temp}}℃</div>
                        <div class="label">实况温度</div>
                    </div>
                    <div class="right">
                        <div class="right-item" style="margin-bottom:16px">
                            <div class="label">站点地址:</div>
                            <div class="value">{{detail.address}}</div>
                        </div>
                        <div class="right-item">
                            <div class="label">站点坐标:</div>
                            <div class="value">{{detail.longitude}}, {{detail.latitude}}</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="item">
                        <div class="label">相对湿度：</div>
                        <div class="value">{{detail.relativeHumidity}}%</div>
                    </div>
                    <div class="item">
                        <div class="label">风向风速：</div>
                        <div class="value">{{detail.windDirection + detail.windSpeedStr}} ({{detail.windSpeed}}米/秒)</div>
                    </div>
                    <div class="item">
                        <div class="label">气  压：</div>
                        <div class="value">{{detail.airPressure}}hPa</div>
                    </div>
                    <div class="item">
                        <div class="label">降雨量：</div>
                        <div class="value">{{detail.rainfall}}mm</div>
                    </div>
                </div>
                <div class="row third">
                    <div class="item">
                        <div class="label">辐射：</div>
                        <div class="value">{{detail.radiation}}μT</div>
                    </div>
                    <div class="item">
                        <div class="label">紫外线：</div>
                        <div class="value">{{detail.uv}}W/㎡</div>
                    </div>
                    <div class="item">
                        <div class="label">海拔高度</div>
                        <div class="value">{{detail.altitude}}m</div>
                    </div>
                    <div class="item">
                        <div class="label">PM10：</div>
                        <div class="value">{{detail.pm}}ug/㎡</div>
                    </div>
                    <div class="item">
                        <div class="label">PM2.5：</div>
                        <div class="value" style="color:#FF9500">{{detail.pmTen}}ug/㎡</div>
                    </div>
                </div>
                <div style="text-align:center">
                    <el-button type="primary" @click="goDetail">查看详情</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getOverviewInfo,getMonitorDetailInMap } from "@/api/environment";

import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}
export default {
    data(){
        return {
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
            weatherIcon:[
                require('@/assets/images/environ/weather/icon-weather-1.png'),
                require('@/assets/images/environ/weather/icon-weather-2.png'),
                require('@/assets/images/environ/weather/icon-weather-3.png'),
                require('@/assets/images/environ/weather/icon-weather-4.png'),
                require('@/assets/images/environ/weather/icon-weather-5.png'),
                require('@/assets/images/environ/weather/icon-weather-6.png'),
                require('@/assets/images/environ/weather/icon-weather-7.png'),
                require('@/assets/images/environ/weather/icon-weather-8.png'),
                require('@/assets/images/environ/weather/icon-weather-9.png'),
                require('@/assets/images/environ/weather/icon-weather-10.png'),
                require('@/assets/images/environ/weather/icon-weather-11.png'),
                require('@/assets/images/environ/weather/icon-weather-12.png'),
                require('@/assets/images/environ/weather/icon-weather-13.png'),
                require('@/assets/images/environ/weather/icon-weather-14.png'),
            ],
            visible:false,
            detail:{
                address: "",
                airPressure: "",
                altitude: "",
                id: "",
                latitude: "",
                longitude: "",
                name: "",
                pm: "",
                pmTen: "",
                radiation: "",
                rainfall: "",
                relativeHumidity: "",
                status: "",
                temp: "",
                uv: "",
                windDirection: "",
                windSpeedStr: ""
            }
        }
    },
    methods:{
        goDetail(){
            this.visible = false;
            this.$router.push({
                path:'/environment/weather-data?id=' + this.detail.id
            })
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
        getInfo(){
            getOverviewInfo().then(res => {
                if (res.code == 200) {
                    this.$set(this, 'info', res.data);
                    let list = res.data.slpIntegratedManagementList;
                    if (this.AMap) {
                        list.forEach(item => {
                            new this.AMap.Marker({
                                position:[item.longitude, item.latitude],
                                map:this.map
                            }).on('click', (event) => {
                                console.log(event, 'marker click')
                                this.getMonitorDetailInMap(item.id)
                            })
                        });
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
        }
    },
    mounted(){
        this.getInfo();
        this.initMap()
    }
}
</script>
<style lang="scss">
.envir-dashboard{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;

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

    .info-wrap{
        position: absolute;
        right: 24px;
        top: 24px;
        bottom: 24px;
        width: 460px;
        box-sizing: border-box;
        overflow-y: scroll;
        padding: 16px;
        background-color: #fff;

        &::-webkit-scrollbar{
                width:0px;
                -webkit-appearance: none;
                display: none;
                height:0px
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
                flex: 1;
            }

            .box-h100 + .box-h100{
                margin-left: 16px;
            }
        }

        .weather-wrap{
            .weather-info{
                position: relative;
                width: 100%;
                height: 160px;
                background-image:url('../../../assets/images/environ/weather/weather-bg.png');
                background-size: 100% 100%;

                .location{
                    box-sizing: border-box;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;

                    img{
                        width: 24px;
                        height: 24px;
                    }

                    span{
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(255,255,255,0.87);
                        line-height: 24px;
                        margin-left: 8px;
                    }
                }

                .temp{
                    display: flex;
                    box-sizing: border-box;
                    padding-left: 14px;

                    .num{
                        font-size: 100px;
                        font-weight: bold;
                        color: rgba(255,255,255,0.9);
                        line-height: 100px;
                    }

                    .symbol{
                        font-size: 80px;
                        color: rgba(255,255,255,0.9);
                        margin-top: -14px;
                        margin-left: 8px;
                    }
                }

                .section{
                    position: absolute;
                    left: 172px;
                    top: 67px;

                    .flex{
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;

                        img{
                            width: 16px;
                            height: 17px;
                            margin-right: 8px;
                        }

                        span{
                            font-size: 16px;
                            font-weight: 400;
                            color: rgba(255,255,255,0.87);
                            line-height: 24px;
                        }
                    }
                }
            }

            .h100{
                height: 100px;
                width: 100%;
                border-right: 1px solid #eee;
                border-left: 1px solid #eee;
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
                display: flex;

                .item{
                    flex: 1;
                    box-sizing: border-box;
                    height: 100%;
                    padding: 11px 30px 13px 16px;

                    .row{
                        display: flex;
                        align-items: center;

                        span{
                            font-size: 16px;
                            font-weight: 400;
                            color: rgba(0,0,0,0.7);
                            line-height: 24px;
                            margin-right: 8px;
                        }

                        img{
                            margin-left: 8px;
                            width: 32px;
                            height: 27px;
                        }
                    }

                    .flex{
                        display: flex;
                        margin-top: 19px;

                        .flex-item{
                            width: 80px;
                            height: 30px;
                            margin-right: 8px;
                            border-radius: 2px;
                            background: rgba(63,187,227,0.1);
                            box-sizing: border-box;
                            padding: 0 8px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            &:first-child{
                                background: rgba(234,195,29,0.1);
                            }

                            img{
                                width: 18px;
                                height: 18px;
                            }

                            span{
                                font-size: 16px;
                                font-weight: 500;
                                color: rgba(0,0,0,0.7);
                            }
                        }
                    }

                    &:first-child{
                        border-right: 1px solid #eee;
                    }
                }
            }

            .weather-list-wrap{
                height: 335px;
                width: 100%;
                border-right: 1px solid #eee;
                border-left: 1px solid #eee;
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
                border-radius: 0 0 16px 16px;
                display: flex;
                flex-direction: column;

                .title{
                    font-size: 16px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.79);
                    line-height: 24px;
                    margin-top: 17px;
                    padding-left: 14px;
                }

                .weather-list{
                    flex: 1;
                    height: 0;
                    display: flex;
                    box-sizing: border-box;
                    padding: 0 16px;

                    .weather-item{
                        flex: 1;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding-top: 14px;

                        .text,
                        .day{
                            font-size: 14px;
                            font-weight: 400;
                            color: rgba(0,0,0,0.6);
                            line-height: 14px;
                            margin-bottom: 8px;
                        }

                        .text{
                            margin-bottom: 0px;
                        }

                        .temp{
                            margin-top: 24px;
                            font-size: 16px;
                            font-weight: 500;
                            color: rgba(0,0,0,0.7);
                            line-height: 17px;
                        }

                        img{
                            width: 42px;
                            height: 42px;
                        }
                    }
                }
            }
        }

        
    }

    .detail-info{
        .base-wrap{
            width: 100%;
            height: 120px;
            display: flex;
            margin-bottom: 24px;

            .left{
                width: 206px;
                height: 100%;
                background: rgba(64,158,254,0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .temp{
                    font-size: 48px;
                    font-weight: bold;
                    color: rgba(0,0,0,0.9);
                    line-height: 48px;
                }

                .label{
                    margin-top: 8px;
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.6);
                }
            }

            .right{
                flex: 1;
                height: 100%;
                background: #F8F9FB;
                box-sizing: border-box;
                padding-left: 26px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .right-item{
                    display: flex;

                    .label{
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.6);
                        line-height: 24px;
                    }

                    .value{
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.9);
                        line-height: 24px;
                    }
                }
            }
        }

        .row{
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 9px;
            border-bottom: 1px solid #eee;
            margin-bottom: 24px;

            &.third{
                .item{
                    width: 33.333%;
                }
            }
            
            .item{
                width: 50%;
                display: flex;
                margin-bottom: 16px;
                font-size: 16px;

                .label{
                    width: 100px;
                    text-align: right;
                    color: rgba(0,0,0,0.6);
                }

                .value{
                    color: rgba(0,0,0,0.9);
                }
            }
        }
    }
}
</style>