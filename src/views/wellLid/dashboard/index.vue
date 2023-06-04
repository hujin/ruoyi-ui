<template>
    <div class="hydrops-dashboard">
        <div class="map-wrap">
            <div id="map"></div>
        </div>
        <div class="info-wrap">
            <div class="row" style="justify-content: flex-start;">
                <div class="label">道路:</div>
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
                <div class="label">井盖设备数量</div>
                <div class="number">
                    <span class="strong">{{info.manholeCoverCount}}</span>
                    <span>(台)</span>
                </div>
            </div>
            <div class="row">
                <div class="box-h100 gray white" :class="{active : current === 1}" @click="handleFilter(1, 'status')">
                    <div class="flex">
                        <div class="circle"></div>
                        <div class="label">正常运行</div>
                    </div>
                    <div class="number">
                        <span class="strong">{{info.onlineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray white" :class="{active : current === 'LOSE'}" @click="handleFilter('LOSE', 'warningtype')">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">丢失报警</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.lossCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray white" :class="{active : current === 'LEAN'}"  @click="handleFilter('LEAN', 'warningtype')">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">偏移报警</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.leanCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray white" :class="{active : current === 'OFFLINE'}"  @click="handleFilter('OFFLINE', 'warningtype')">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">离线报警</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.offlineCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray" :class="{active : current === 'ON'}" @click="handleFilter('ON', 'defencesStatus')">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">设防井盖</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.defencesCount}}</span>
                        <span>台</span>
                    </div>
                </div>
                <div class="box-h100 gray" :class="{active : current === 'OFF'}"  @click="handleFilter('OFF', 'defencesStatus')">
                    <div class="flex gray">
                        <div class="circle"></div>
                        <div class="label">撤防井盖</div>
                    </div>
                     <div class="number">
                        <span class="strong">{{info.withdrawGarrisonCount}}</span>
                        <span>台</span>
                    </div>
                </div>
            </div>
            <div class="state red">
                <img src="@/assets/images/hydrops/icon-1.png" alt="">
                <span class="num">{{info.totalWarningCount}}</span>
                <span class="text">报警总数</span>
            </div>
            <div class="state">
                <img src="@/assets/images/hydrops/icon-2.png" alt="">
                <span class="num">{{info.processedCount}}</span>
                <span class="text">已处理</span>
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
               
                <div class="row">
                    <div class="item">
                        <div class="label">设备UID：</div>
                        <div class="value">{{detail.uid}}</div>
                    </div>
                    <div class="item">
                        <div class="label">当前状态：</div>
                        <div class="value" :style="{color: detail.status == 1  ? '#05A75E' : 'rgba(0,0,0,0.4)'}">{{detail.status == 1 ? '正常' : '异常'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">设备型号：</div>
                        <div class="value">{{detail.type}}</div>
                    </div>
                    <div class="item">
                        <div class="label">移除时间：</div>
                        <div class="value">{{detail.removeTime}}</div>
                    </div>
                    <div class="item">
                        <div class="label">布  防：</div>
                        <div class="value">{{detail.defencesStatus == 'ON' ? '设防' : '撤防'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">报警次数：</div>
                        <div class="value">{{detail.historyWarningCount}}</div>
                    </div>
                    <div class="item">
                        <div class="label">电压：</div>
                        <div class="value">{{detail.voltage}}</div>
                    </div>
                    <div class="item">
                        <div class="label">取电方式：</div>
                        <div class="value">{{detail.powerSupplyMethod}}</div>
                    </div>
                    <div class="item">
                        <div class="label">巡查次数：</div>
                        <div class="value">{{detail.patrolCount}}</div>
                    </div>
                    <div class="item">
                        <div class="label">安装时间：</div>
                        <div class="value">{{detail.installTime}}</div>
                    </div>
                    <div class="item">
                        <div class="label">使用时长：</div>
                        <div class="value">{{detail.usageTime}}</div>
                    </div>
                    <div class="item">
                        <div class="label">故障次数：</div>
                        <div class="value">{{detail.faultCount || 0}}</div>
                    </div>
                </div>
                <div class="row third">
                    <div class="item">
                        <div class="label">养护部门：</div>
                        <div class="value">{{detail.maintainDepartment || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">安装部门：</div>
                        <div class="value">{{detail.installDepartment || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">产权部门：</div>
                        <div class="value">{{detail.propertyRightDepartment || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">联系人：</div>
                        <div class="value">{{detail.maintainDepartmentName || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">联系人：</div>
                        <div class="value" >{{detail.installDepartmentName || '暂无' }}</div>
                    </div>
                    <div class="item">
                        <div class="label">联系人：</div>
                        <div class="value">{{detail.propertyRightDepartmentName || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">联系方式：</div>
                        <div class="value">{{detail.maintainDepartmentPhone || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">联系方式：</div>
                        <div class="value">{{detail.installDepartmentPhone || '暂无'}}</div>
                    </div>
                    <div class="item">
                        <div class="label">联系方式：</div>
                        <div class="value">{{detail.propertyRightDepartmentPhone || '暂无'}}</div>
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

import { getOverviewInfo,getMonitorDetailInMap } from "@/api/wellLid";

import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}
export default {
    dicts: ['sys_road','sys_roadside'],
    data(){
        return {
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
                defencesCount:0,
                leanCount:1,
                lossCount:0,
                slpAirInfoVoList:[],
                manholeCoverCount:'',
                offlineCount:'',
                onlineCount:'',
                processedCount:'',
                totalWarningCount:'',
                withdrawGarrisonCount:''
            },
            visible:false,
            detail:{
                id:'',
                name:'',
                road:'',
                type:'',
                address:'',
                typeName:'',
                roadSide:'',
                uid:'',
                longitude:'',
                latitude:'',
                status:'',
                enable:'',
                installTime:'',
                removeTime:'',
                powerSupplyMethod:'',
                usageTime:'',
                lastTime:'',
                voltage:'',
                faultCount:'',
                installDepartment:'',
                installDepartmentName:'',
                installDepartmentPhone:'',
                maintainDepartment:'',
                maintainDepartmentName:'',
                maintainDepartmentPhone:'',
                propertyRightDepartment:'',
                propertyRightDepartmentName:'',
                propertyRightDepartmentPhone:'',
                defencesStatus:'',
                isDeleted:'',
                remark:''
            },
          
        }
    },
    methods:{
        roadChange(val){
            this.getInfo()
        },
        handleFilter(val, type){
            if (val === this.current) {
                return;
            }
            let list = JSON.parse(JSON.stringify(this.info.slpManholeCoverList))
            this.map.clearMap();
            this.current = val;

            if (val === '') {
                list.forEach(item => {
                    this.addMarker(item)
                })
                this.$set(this, 'markerList', list)
                return;
            }

            let result = []
            if (type == 'status') {
                result = list.filter(item => {
                    return item.status === val
                })
            }

            if (type == 'warningtype') {
                result = list.filter(item => {
                    return item.warningType === val
                })
            }

            if (type == 'defencesStatus') {
                result = list.filter(item => {
                    return item.defencesStatus === val
                })
            }
           
            result.forEach(item => {
                this.addMarker(item)
            })
            this.$set(this, 'markerList', result)
        },
         addMarker(item){
            new this.AMap.Marker({
                position:[item.longitude, item.latitude],
                map:this.map
            }).on('click', (event) => {
                console.log(event, 'marker click')
                this.getMonitorDetailInMap(item.id)
            })
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
                path:'/hydrops/device'
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
            let params = {
                road:this.road
            }
            getOverviewInfo(params).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'info', res.data);
                    let list = res.data.slpManholeCoverList;
                    if (this.AMap) {
                        list.forEach(item => {
                            console.log(item.longitude, item.latitude)
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
        this.initMap()

    }
}
</script>
<style lang="scss">
.hydrops-dashboard{
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