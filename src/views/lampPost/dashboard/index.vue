<template>
    <div class="envir-dashboard">
        <div class="map-wrap">
            <div id="map"></div>
        </div>
        <div class="info-wrap">
            <div class="row">
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
            <div class="h100">
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-1.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">1386</div>
                            <div class="symbol">杆</div>
                        </div>
                        <div class="label">灯杆总数</div>
                    </div>
                </div>
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-2.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">1386</div>
                            <div class="symbol">杆</div>
                        </div>
                        <div class="label">合杆总数</div>
                    </div>
                </div>
            </div>
            <div class="h100">
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-3.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">99%</div>
                        </div>
                        <div class="label">挂载率</div>
                    </div>
                </div>
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-4.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">1535</div>
                            <div class="symbol">个</div>
                        </div>
                        <div class="label">总挂载数</div>
                    </div>
                </div>
            </div>
            <div class="list">
                <div class="list-item" v-for="(item,index) in list" :key="index">
                    <div class="list-item-name" :class="{'font-16': item.label.length > 5}">{{item.label}}</div>
                    <div class="list-item-total">{{item.total}}</div>
                    <div class="list-item-footer">
                        <div class="list-item-footer-item">
                            <div class="circle"></div>
                            <div class="num">{{item.online}}</div>
                        </div>
                        <div class="list-item-footer-item">
                            <div class="circle red"></div>
                            <div class="num">{{item.offline}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="warning-wrap">
                <img src="@/assets/images/lampPost/icon-5.png" alt="">
                <span class="num">1267</span>
                <span class="label">报警总数</span>
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
        <el-dialog :visible.sync="visible" custom-class="pop" width="1060px">
            <div class="pop-wrap">
                <div class="img">
                    <img src="@/assets/images/lamp-post.png" alt="">
                </div>
                <div class="lamp-post-dialog">
                    <div class="lamp-post-header">
                        <div class="tabs">
                            <div class="tab active">灯杆</div>
                        </div>
                        <div class="close">
                            <i class="el-icon-close" @click="visible = false"></i>
                        </div>
                    </div>
                    <div class="lamp-post-body">
                        <div class="info">
                            <el-row>
                                <el-col :span="12">
                                    <div class="row">
                                        <label for="">设备型号:</label>
                                        <span>智慧灯杆</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="row">
                                        <label for="">安装时间:</label>
                                        <span>2020-04-12</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="row">
                                        <label for="">设备UID:</label>
                                        <span>LD000001</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="row">
                                        <label for="">使用时长:</label>
                                        <span>127天</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="row">
                                        <label for="">是否满载:</label>
                                        <span>100%</span>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="row">
                                        <label for="">是否开灯:</label>
                                        <span>是</span>
                                    </div>
                                </el-col>
                                <el-col :span="24">
                                    <div class="row">
                                        <label for="">详细地址:</label>
                                        <span>杭州市萧山区盈丰路</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="info">
                            <el-row>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">养护部门:</label>
                                        <span>城市管理养护部</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">安装部门:</label>
                                        <span>城市管理养护部</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">产权部门:</label>
                                        <span>钱江世纪城管委会</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">联系人:</label>
                                        <span>王建国</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">联系人:</label>
                                        <span>王建国</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">联系人:</label>
                                        <span>李建华</span>
                                    </div>
                                </el-col>

                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">联系电话:</label>
                                        <span>15824150021</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">联系电话:</label>
                                        <span>15824150021</span>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="row">
                                        <label for="">联系电话:</label>
                                        <span>15824150031</span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="btn-wrap">
                            <el-button type="primary" @click="handleView('lampPost')">查看详情</el-button>
                        </div>
                    </div>
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
    dicts: ['sys_road'],
    data(){
        return {
            tabActive:1,
            tabList:[{
                value:1,
                text:'灯杆'
            },{
                value:1,
                text:'灯具'
            },{
                value:1,
                text:'摄像头'
            },{
                value:1,
                text:'气象站'
            }],
            keyword:'',
            map : null,
            mouseTool : null,
            overlays : [],
            auto : null,
            placeSearch : null, 
            AMap:null,
            info:{
               
            },
            road:'',
            visible:false,
            list:[{
                label:'气象站',
                total: 34,
                online:30,
                offline:4
            },{
                label:'摄像头',
                total: 34,
                online:30,
                offline:4
            },{
                label:'灯杆倾斜传感器',
                total: 34,
                online:30,
                offline:4
            },{
                label:'集中控制器',
                total: 34,
                online:30,
                offline:4
            },{
                label:'网关',
                total: 34,
                online:30,
                offline:4
            },{
                label:'单灯控制器',
                total: 34,
                online:30,
                offline:4
            },{
                label:'多功能电能耐计量表',
                total: 34,
                online:30,
                offline:4
            },{
                label:'灯具',
                total: 34,
                online:30,
                offline:4
            }],
            markerList:[],
            current:''
        }
    },
    methods:{
        handleView(type){
            if (type == 'lampPost'){
                this.$router.push('/lampPost/device')
            }
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
        handleFilter(val){
            if (val === this.current) {
                return;
            }
            let list = JSON.parse(JSON.stringify(this.info.slpIntegratedManagementList))
            this.map.clearMap();
            this.current = val;

            if (val === '') {
                list.forEach(item => {
                    this.addMarker(item)
                })
                this.$set(this, 'markerList', list)
                return;
            }
            let result = list.filter(item => {
                return item.status === val
            })
            result.forEach(item => {
                this.addMarker(item)
            })
            this.$set(this, 'markerList', result)

        },
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

                this.getInfo();

            }).catch(e => {
                console.log(e);
            });
        },
        getInfo(){
            getOverviewInfo().then(res => {
                if (res.code == 200) {
                    this.$set(this, 'info', res.data);
                    let list = res.data.slpIntegratedManagementList;
                    this.$set(this, 'markerList', list)
                    if (this.AMap) {
                        list.forEach(item => {
                            this.addMarker(item)
                        });
                    }
                }
            })
        },
        addMarker(item){
            new this.AMap.Marker({
                position:[item.longitude, item.latitude],
                map:this.map
            }).on('click', (event) => {
                console.log(event, 'marker click')
                this.visible = true
                // this.getMonitorDetailInMap(item.id)
            })
        },

    },
    mounted(){
        this.initMap();

    }
}
</script>
<style lang="scss">
.envir-dashboard{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;

    .pop{
        background: transparent;
        box-shadow: none;
        

        .el-dialog__header{
            display: none;
        }

        .el-dialog__body{
            padding: 0;
        }

        .pop-wrap{
            display: flex;
            align-items: center;

            .img{
                width: 221px;
                height: 684px;
                margin-right:36px;

                img{
                    width: 100%;
                    height: 100%;
                }
            }

            .lamp-post-dialog{
                width: 800px;
                border-radius: 8px;
                overflow: hidden;

                .lamp-post-header{
                    position: relative;
                    height: 56px;
                    width: 100%;
                    background-color: #EBF1FF;
                    box-sizing: border-box;
                    padding-right: 100px;

                    .close{
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 100px;
                        height: 56px;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        font-size: 20px;
                        box-sizing: border-box;
                        padding-right: 20px;

                        i{
                            cursor: pointer;
                        }
                    }

                    .tabs{
                        width: 100%;
                        height: 100%;
                        display: flex;

                        .tab{
                            display: flex;
                            align-items: center;
                            padding: 0 28px;
                            font-size: 20px;
                            font-weight: 400;
                            color: #A2A9BC;

                            &.active{
                                background-color: #fff;
                                font-weight: 500;
                                color: #4E86FF;
                            }
                        }
                    }
                }

                .lamp-post-body{
                    box-sizing: border-box;
                    // padding: 24px;
                    background-color: #fff;
                    border-radius:0 0 8px 8px;

                    .info{
                        box-sizing: border-box;
                        padding: 32px 40px 16px 40px;
                        border-bottom: 1px solid #E7E7E7;

                        .row{
                            height: 24px;
                            display: flex;
                            align-items: center;
                            font-size: 16px;
                            margin-bottom: 16px;

                            label{
                                width: 70px;
                                color: rgba(0,0,0,0.6);
                                text-align: right;
                            }

                            span{
                                color: rgba(0,0,0,0.9);
                                margin-left: 10px;
                            }
                        }
                    }

                    .btn-wrap{
                        box-sizing: border-box;
                        padding: 24px;
                        text-align: right;
                    }

                }
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

        .h100{
            width: 100%;
            height: 100px;
            display: flex;
            background-color: #f8f9fb;
            border-radius: 8px;
            margin-bottom: 16px;

            .h-item{
                flex: 1;
                width: 0;
                display: flex;
                align-items: center;

                img{
                    width: 40px;
                    height: 40px;
                    margin-left: 24px;
                    margin-right: 8px;
                }

                .val{
                    display: flex;
                    align-items: baseline;

                    .num{
                        font-size: 24px;
                        color: rgba(0,0,0,0.9);
                        line-height: 32px;
                    }

                    .symbol{
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.6);
                        line-height: 24px;
                        margin-left: 4px;
                    }
                }

                .label{
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.6);
                    line-height: 24px;
                }
            }
        }

        .list {
            display: flex;
            flex-wrap: wrap;

            .list-item{
                width: 132px;
                height: 150px;
                box-sizing: border-box;
                margin-right: 16px;
                margin-bottom: 16px;
                border: 1px solid #dcdcdc;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                padding: 0 4px;

                &:nth-child(3n){
                    margin-right: 0;
                }

                .list-item-name{
                    margin-top: 16px;
                    text-align: center;
                    color: rgba(0,0,0,0.8);
                    font-size: 20px;
                    box-sizing: border-box;
                    padding: 0 12px;
                    white-space: nowrap;
                    line-height: 22px;

                    &.font-16{
                        font-size: 16px;
                        line-height: 20px;
                        white-space: inherit;
                    }
                }

                .list-item-total{
                    text-align: center;
                    font-size: 36px;
                    color: rgba(0,0,0,0.9);
                    line-height: 32px;
                    margin-bottom: 18px;
                    margin-top: auto;
                }

                .list-item-footer{
                    height: 40px;
                    width: 100%;
                    border-top:1px solid #e7e7e7;
                    display: flex;

                    .list-item-footer-item{
                        flex: 1;
                        display: flex;
                        align-items: center;

                        .circle{
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: #05A75E;
                            margin-left: 13px;
                            margin-right: 4px;

                            &.red{
                                background-color: #EB0E1D;
                            }
                        }

                        .num{
                            font-size: 16px;
                            font-weight: bold;
                            color: rgba(0,0,0,0.4);
                        }
                    }
                }
            }
        }

        .warning-wrap{
            width: 100%;
            height: 80px;
            background: #FFF3F3;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;

            img{
                width: 40px;
                height: 40px;
            }

            .num{
                font-size: 36px;
                color: rgba(0,0,0,0.9);
                line-height: 32px;
                margin-left: 14px;
            }

            .label{
                font-size: 24px;
                font-weight: 400;
                color: rgba(0,0,0,0.6);
                line-height: 24px;
                margin-left: 10px;
            }
        }
    }

    
}
</style>