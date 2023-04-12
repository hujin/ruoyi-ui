<template>
    <div class="envir-dashboard">
        <div class="map-wrap">
            <div id="map"></div>
        </div>
        <div class="info-wrap">
            <div class="box-h80">
                <div class="icon"></div>
                <div class="text">
                    <div style="font-size:20px">风雷大雨</div>
                    <div style="font-size:16px">气象灾害预警</div>
                </div>
            </div>
            <div class="box-h76">
                <div class="label">微气象站设备数量</div>
                <div class="number">
                    <span class="strong">24</span>
                    <span>(台)</span>
                </div>
            </div>
            <div class="row">
                <div class="box-h76"></div>
                <div class="box-h76"></div>
            </div>
            <div class="box-h260">

            </div>
            <div class="title">气象服务信息</div>
            <div class="row">
                <div class="box-h108"></div>
                <div class="box-h108"></div>
                <div class="box-h108"></div>
                <div class="box-h108"></div>
                <div class="box-h108"></div>
                <div class="box-h108"></div>
            </div>
        </div>
    </div>
</template>
<script>
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
        }
    },
    methods:{
        initMap() {
            AMapLoader.load({
                "key": "df32d1c57071a49dc07d45dbaad7cdbd", 
                "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                // 初始化地图
                this.map = new AMap.Map('map',{
                    viewMode : "2D",  //  是否为3D地图模式
                    zoom : 13,   // 初始化地图级别
                    center : [113.65553,34.748764], //中心点坐标  郑州
                    resizeEnable: true
                });
            }).catch(e => {
                console.log(e);
            });
        }
    },
    mounted(){
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
        width: 0;
        flex: 1;
        position: relative;

        #map{
            width: 100%;
            height: 100%;
        }
    }

    .info-wrap{
        width: 552px;
        height: 100%;
        box-sizing: border-box;
        overflow-y: scroll;
        padding: 24px;

        .box-h80{
            margin-bottom: 16px;
            width: 100%;
            height: 80px;
            box-sizing: border-box;
            background: rgba(241,159,48,0.35);
            border-radius: 4px;
            border: 1px solid #F19F30;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon{
                width: 80px;
                height: 60px;
                margin-right: 24px;
                background-color: #F19F30;
            }

            .text{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #F19F30;
                
            }
        }

        .box-h76{
            height: 76px;
            width: 100%;
            background: #F4F6FF;
            border-radius: 8px;
            border: 1px solid #C5CFFF;
            color: #536DE6;
            margin-bottom: 16px;

            .label{
                text-align: center;
                margin-top: 8px;
                font-size: 16px;
                font-weight: 400;
                line-height: 28px;
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
        }

        .row{
            display: flex;
            flex-wrap: wrap;

            .box-h76{
                flex: 1;
            }

            .box-h76 + .box-h76{
                margin-left: 16px;
            }
        }

        .box-h260{
            width: 100%;
            height: 260px;
            background: linear-gradient(157deg, #D2DAFF 0%, rgba(226,234,255,0.9) 100%);
            box-shadow: 0px 2px 4px 0px rgba(188,210,255,0.35);
            border-radius: 8px;
            margin-bottom: 16px;
        }

        .title{
            font-size: 20px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            line-height: 28px;
            margin-bottom: 16px;
        }

        .box-h108{
            height: 108px;
            width: 244px;
            background-color: #F4F6FF;
            margin-right: 16px;
            margin-bottom: 16px;

            &:nth-child(2n){
                margin-right: 0;
            }
        }
    }
}
</style>