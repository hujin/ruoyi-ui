<template>
    <div class="envir-dashboard">
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
            <div class="row">
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
            <div class="h100">
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-1.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">{{info.poleCount || 0}}</div>
                            <div class="symbol">杆</div>
                        </div>
                        <div class="label">灯杆总数</div>
                    </div>
                </div>
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-2.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">{{info.combinedPoleCount || 0}}</div>
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
                            <div class="num">{{info.percent || 0}}%</div>
                        </div>
                        <div class="label">挂载率</div>
                    </div>
                </div>
                <div class="h-item">
                    <img src="@/assets/images/lampPost/icon-4.png" alt="">
                    <div class="h-item-content">
                        <div class="val">
                            <div class="num">{{info.totalCount || 0}}</div>
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
                <span class="num">{{info.warningCount || 0}}</span>
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
                            <div class="tab" :class="{active: detail_active === 0}"  @click="detailTabClick(0)">灯杆</div>
                            <div class="tab" :class="{active: detail_active === index + 1}" @click="detailTabClick(index+1)" v-for="(item, index) in detail.slpOtherDeviceInfoList" :key="index">{{typeFormat(item.type)}}</div>
                        </div>
                        <div class="close">
                            <i class="el-icon-close" @click="visible = false"></i>
                        </div>
                    </div>
                    <div class="lamp-post-body">
                        <template v-if="detail_active === 0">
                            <div class="info">
                                <el-row>
                                    <el-col :span="12">
                                        <div class="row">
                                            <label for="">设备型号:</label>
                                            <span>{{detail.deviceModel}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="row">
                                            <label for="">安装时间:</label>
                                            <span>{{detail.installTime}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="row">
                                            <label for="">设备UID:</label>
                                            <span>{{detail.uid}}</span>
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
                                            <span>{{(((detail.slpOtherDeviceInfoList ? detail.slpOtherDeviceInfoList.length : 0 ) / detail.deviceMountingMax) * 100).toFixed(2)}}%</span>
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
                                            <span>{{detail.address}}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="info">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">养护部门:</label>
                                            <span>{{detail.maintainDepartment}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">安装部门:</label>
                                            <span>{{detail.installDepartment}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">产权部门:</label>
                                            <span>{{detail.propertyRightDepartment}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系人:</label>
                                            <span>{{detail.maintainDepartmentName}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系人:</label>
                                            <span>{{detail.installDepartmentName}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系人:</label>
                                            <span>{{detail.propertyRightDepartmentName}}</span>
                                        </div>
                                    </el-col>

                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系电话:</label>
                                            <span>{{detail.maintainDepartmentPhone}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系电话:</label>
                                            <span>{{detail.installDepartmentPhone}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系电话:</label>
                                            <span>{{detail.propertyRightDepartmentPhone}}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                        <template v-for="(item,index) in detail.slpOtherDeviceInfoList">
                            <div class="sub-model"  v-if="detail_active === index + 1" :key="index">
                                <div class="info">
                                <el-row>
                                    <el-col :span="12">
                                        <div class="row">
                                            <label for="">设备型号:</label>
                                            <span>{{item.deviceModel}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="row">
                                            <label for="">当前状态:</label>
                                            <span :style="{color: item.enable == 1 ? '#05A75E' : '#EB0E1D'}">{{item.enable == 1 ? '正常运行' : '停用'}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="row">
                                            <label for="">设备UID:</label>
                                            <span>{{item.uid}}</span>
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
                                            <label for="">安装时间:</label>
                                            <span>{{new Date(item.installTime).Format('yyyy-MM-dd')}}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="info">
                                <el-row>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">养护部门:</label>
                                            <span>{{item.maintainDepartment}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">安装部门:</label>
                                            <span>{{item.installDepartment}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">产权部门:</label>
                                            <span>{{item.propertyRightDepartment}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系人:</label>
                                            <span>{{item.maintainDepartmentName}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系人:</label>
                                            <span>{{item.installDepartmentName}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系人:</label>
                                            <span>{{item.propertyRightDepartmentName}}</span>
                                        </div>
                                    </el-col>

                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系电话:</label>
                                            <span>{{item.maintainDepartmentPhone}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系电话:</label>
                                            <span>{{item.installDepartmentPhone}}</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="row">
                                            <label for="">联系电话:</label>
                                            <span>{{item.propertyRightDepartmentPhone}}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            </div>
                        </template>
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
import { getOverviewInfo } from "@/api/lampPost";

import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}

let markerIcon = require('@/assets/images/lampPost/marker.png')

export default {
    dicts: ['sys_road','sys_device_type'],
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
            list:[],
            markerList:[],
            current:'',
            detail:{},
            detail_active:0,

            distanceStatus:false
        }
    },
    methods:{
        detailTabClick(index){
            this.detail_active = index 
        },
        typeFormat(type){
            return this.selectDictLabel(this.dict.type.sys_device_type, type);

        },
        roadChange(val){
            this.getInfo();
        },
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
            let list = JSON.parse(JSON.stringify(this.info.slpPoleMainVoList))
            this.map.clearMap();
            this.current = val;

            if (val === '') {
                // list.forEach(item => {
                //     if (item.latitude) {
                //         this.addMarker(item)

                //     }
                // })

                this.initMarker(list)
                this.$set(this, 'markerList', list)
                return;
            }
            let result = list.filter(item => {
                return item.status === val
            })
            this.initMarker(result)
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
                "plugins": ['AMap.Icon','AMap.Marker','AMap.LabelsLayer', 'AMap.LabelMarker', 'AMap.RangingTool'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                // 初始化地图
                this.AMap = AMap;
                this.map = new AMap.Map('map',{
                    viewMode : "2D",  //  是否为3D地图模式
                    zoom : 13,   // 初始化地图级别
                    center : [120.252635, 30.236056], //中心点坐标  郑州
                    resizeEnable: true,
                    pitch:60
                });

                this.map.on('complete', () => {
                    this.getInfo();

                })

                this.distance = new this.AMap.RangingTool(this.map)


            }).catch(e => {
                console.log(e);
            });
        },
        getInfo(){
            getOverviewInfo({
                road:this.road
            }).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'info', res.data);
                    let list = res.data.slpPoleMainVoList;
                    this.$set(this, 'markerList', list)
                    // if (this.AMap) {
                        this.$nextTick(() => {
                            this.initMarker(list)
                        })
                        // list.forEach(item => {
                        //     if (item.latitude) {
                        //         this.addMarker(item)
                        //     }
                        // });
                    // }

                    let dataList = []
                    if (res.data.slpOtherDeviceListVos) {
                        res.data.slpOtherDeviceListVos.forEach((item, index) => {
                            let online = 0
                            let total = item.slpOtherDeviceInfoList.length || 0
                            if (item.slpOtherDeviceInfoList){
                                item.slpOtherDeviceInfoList.forEach(sub => {
                                    if (sub.enable == 1) {
                                        online++
                                    }
                                })
                            }

                            let offline = total - online;

                            dataList.push({
                                label: this.typeFormat(item.type),
                                total: total,
                                online: online,
                                offline: offline
                            })
                        })
                        this.$set(this,'list', dataList)
                    }
                }
            })
        },
        initMarker(list){
            let layer = new this.AMap.LabelsLayer({
                    zooms: [3, 20],
                    zIndex: 111,
                    animation: false,
                    collision: false
            })
            let markers = []
            var icon = {
                type: 'image',
                image: markerIcon,
                size: [24, 24],
                anchor: 'bottom-center',
                angel: 0,
                retina: true
            };
            for (let i = 0; i < list.length;i++) {
                let item = list[i]
                if (item.latitude) {
                    let currentPosition = {
                        position:[item.longitude, item.latitude],
                        icon
                    }

                    let labelMarker = new this.AMap.LabelMarker(currentPosition)

                    labelMarker.on('click', (event) => {
                        this.showDetail(item)
                    })

                    markers.push(labelMarker)

                }
            }

            layer.add(markers)
            this.map.add(layer)
            console.timeEnd('a')

        },
        addMarker(item){
            new this.AMap.Marker({
                position:[item.longitude, item.latitude],
                map:this.map
            }).on('click', (event) => {
                console.log(event, 'marker click')
                this.showDetail(item)
            })
        },
        showDetail(detail){
            this.$set(this, 'detail', detail)
            this.$nextTick(() => {
                this.visible = true

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
        console.time('a')
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
                            cursor: pointer;

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