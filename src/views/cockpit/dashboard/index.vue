<template>
        <full-screen-container class="cockpit-dashboard">
            <div class="header">
                <div class="left">
                    <div class="blue">路灯状态:开启</div>
                    <div class="white" style="margin-right:25px">开关灯时间 18:00-19:00</div>
                    <div class="white">光照值 168lux</div>

                </div>
                <div class="title">钱江世纪城智慧灯杆管理平台系统</div>
                <div class="right">
                    <div class="time">2019-05-15  周三 12:00:00</div>
                </div>
            </div>
            <div class="left-wrap">
                <div class="first-panel" v-if="left_top == 1">
                    <div class="top">
                        <div class="long-box">
                            <div class="total">
                                <div class="label">设备总数</div>
                                <div class="num">35789</div>
                            </div>
                            <div class="row">
                                <div class="label">在线</div>
                                <div class="num">25789</div>
                            </div>
                            <div class="row">
                                <div class="label">离线</div>
                                <div class="num">15241</div>
                            </div>
                        </div>
                        <div class="right-list">
                            <div class="box">
                                <div class="box-content">
                                    <div class="text-wrap">
                                        <div class="label">
                                            <span>单灯</span>
                                            <br/>
                                            <span>控制器</span>
                                        </div>
                                        <div class="num">409</div>
                                    </div>
                                    <div class="chart-wrap">
                                        <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                    </div>
                                </div>
                                <div class="statistic">
                                    <div class="item">
                                        <div class="dot green"></div>
                                        <div class="num">257</div>
                                    </div>
                                    <div class="item">
                                        <div class="dot red"></div>
                                        <div class="num">152</div>
                                    </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="box-content">
                                    <div class="text-wrap">
                                        <div class="label">
                                            <span>集中</span>
                                            <br/>
                                            <span>控制器</span>
                                        </div>
                                        <div class="num">409</div>
                                    </div>
                                    <div class="chart-wrap">
                                        <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                    </div>
                                </div>
                                <div class="statistic">
                                    <div class="item">
                                        <div class="dot green"></div>
                                        <div class="num">257</div>
                                    </div>
                                    <div class="item">
                                        <div class="dot red"></div>
                                        <div class="num">152</div>
                                    </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="box-content">
                                    <div class="text-wrap">
                                        <div class="label mt">
                                            <span>井盖</span>
                                        </div>
                                        <div class="num">409</div>
                                    </div>
                                    <div class="chart-wrap">
                                        <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                    </div>
                                </div>
                                <div class="statistic">
                                    <div class="item">
                                        <div class="dot green"></div>
                                        <div class="num">257</div>
                                    </div>
                                    <div class="item">
                                        <div class="dot red"></div>
                                        <div class="num">152</div>
                                    </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="box-content">
                                    <div class="text-wrap">
                                        <div class="label mt">
                                            <span>水位</span>
                                        </div>
                                        <div class="num">409</div>
                                    </div>
                                    <div class="chart-wrap">
                                        <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                    </div>
                                </div>
                                <div class="statistic">
                                    <div class="item">
                                        <div class="dot green"></div>
                                        <div class="num">257</div>
                                    </div>
                                    <div class="item">
                                        <div class="dot red"></div>
                                        <div class="num">152</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>灯杆</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>气象站</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="item">
                                    <div class="dot green"></div>
                                    <div class="num">257</div>
                                </div>
                                <div class="item">
                                    <div class="dot red"></div>
                                    <div class="num">152</div>
                                </div>
                            </div>
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>灯具</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>摄像头</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="item">
                                    <div class="dot green"></div>
                                    <div class="num">257</div>
                                </div>
                                <div class="item">
                                    <div class="dot red"></div>
                                    <div class="num">152</div>
                                </div>
                            </div>
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>网关</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="item">
                                    <div class="dot green"></div>
                                    <div class="num">257</div>
                                </div>
                                <div class="item">
                                    <div class="dot red"></div>
                                    <div class="num">152</div>
                                </div>
                            </div>
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>配电箱</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label">
                                        <span>交通</span>
                                        <br />
                                        <span>信号灯</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            <div class="statistic">
                                <div class="item">
                                    <div class="dot green"></div>
                                    <div class="num">257</div>
                                </div>
                                <div class="item">
                                    <div class="dot red"></div>
                                    <div class="num">152</div>
                                </div>
                            </div>
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>指路牌</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            
                        </div>
                        <div class="box">
                            <div class="box-content">
                                <div class="text-wrap">
                                    <div class="label mt">
                                        <span>气象站</span>
                                    </div>
                                    <div class="num">409</div>
                                </div>
                                <div class="chart-wrap">
                                    <el-progress type="circle" :percentage="25" :width="56" text-color="#ffffff" color="#359AFF" define-back-color="#238cf24d"></el-progress>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="second-panel" v-if="left_top == 2">

                </div>
                <div class="tab-list">
                    <div class="tab-item" :class="{active: left_top == 1}" @click="left_top = 1">
                        <div class="text">设备数量统计</div>
                    </div>
                    <div class="tab-item" :class="{active: left_top == 2}" @click="left_top = 2">
                        <div class="text">设备数量分析</div>
                    </div>

                </div>
                <div class="chart">
                    <div class="char-wrap" ref="chart1" id="chart1" v-show="left_bottom == 1">

                    </div>
                    <div class="char-wrap" ref="chart2" id="chart2" v-if="left_bottom == 2">

                    </div>
                    <div class="tab-list">
                        <div class="tab-item" :class="{active: left_bottom == 1}" @click="left_bottom = 1">
                            <div class="text">能耗统计</div>
                        </div>
                        <div class="tab-item" :class="{active: left_bottom == 2}" @click="left_bottom = 2">
                            <div class="text">设备挂载量</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-wrap">
                <div class="weather-box">
                    <div class="weather-box-header">
                        <img class="weather-icon" src="@/assets/images/cockpit/icon-sun.png" alt="">
                        <span class="temperature">27°</span>
                        <img src="@/assets/images/cockpit/icon-warning.png" alt="" class="tip-icon">
                        <span class="tip-text">大雨黄色预警</span>
                    </div>
                    <div class="icon-list">
                        <div class="icon-item" v-for="(item,index) in icon_list" :key="index">
                            <img :src="item.icon" alt="" class="icon">
                            <div class="icon-content">
                                <div class="text">{{item.text}}</div>
                                <div class="value">{{item.value}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="section-header">
                        <img src="@/assets/images/cockpit/icon-circle.png" alt="" class="circle">
                        <div class="text">视频监控</div>
                        <div class="line"></div>
                        <img src="@/assets/images/cockpit/icon-arrow-left.png" alt="" class="arrow">
                    </div>
                    <div class="video-wrap">
                        <video src="" class="video"></video>
                        <div class="video-list">
                            <div class="search-input">
                                <input type="text" placeholder="搜索水位检测点">
                                <img src="@/assets/images/cockpit/icon-search.png" alt="">
                            </div>
                            <div class="video-scroll">
                                
                                <div class="video-item" v-for="(item, index) in video_list" :key="index">
                                    <i class="el-icon-caret-right" style="color:#9095A6"></i>
                                    <span>{{item.text}}</span>
                                    <span style="margin-left:10px">共{{item.children.length}}个站点</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hydrops-box">
                    <div class="section-header" style="box-sizing: border-box;padding:0 18px;margin-top:11px">
                        <img src="@/assets/images/cockpit/icon-circle.png" alt="" class="circle">
                        <div class="text">视频监控</div>
                        <div class="line"></div>
                        <img src="@/assets/images/cockpit/icon-arrow-left.png" alt="" class="arrow">
                    </div>
                    <div id="chart3" ref="chart3"></div>
                </div>
                <div class="monitor-box">
                    <div class="tab-wrap">
                        <div class="tab" :class="{active: monitor_tab_current == item.value}" @click="monitor_tab_current = item.value" v-for="(item, index) in monitor_tab_list" :key="index">{{item.text}}</div>
                    </div>
                    <div class="tab-content">
                        <div class="static-wrap">
                            <div class="col">
                                <div class="label">已处理</div>
                                <div class="val">10293</div>
                            </div>
                            <img src="@/assets/images/cockpit/icon-prev.png" alt="" class="prev">
                            <div class="bg">
                                <div class="label">总报警数</div>
                                <div class="val">25789</div>
                            </div>
                            <img src="@/assets/images/cockpit/icon-next.png" alt="" class="next">
                            <div class="col orange">
                                <div class="label">平均报警处理时间</div>
                                <div class="val">1.5h</div>
                            </div>
                        </div>
                        <div class="news-item">
                            <span>1</span>
                            <span>2022-10-23 12:00:01-13:09:17</span>
                            <span>灯杆报警</span>
                            <span>金鸡道路</span>
                            <span>报警描述描述描述</span>
                        </div>
                        <div class="news-item">
                            <span>1</span>
                            <span>2022-10-23 12:00:01-13:09:17</span>
                            <span>灯杆报警</span>
                            <span>金鸡道路</span>
                            <span>报警描述描述描述</span>
                        </div>
                        <div class="news-item">
                            <span>1</span>
                            <span>2022-10-23 12:00:01-13:09:17</span>
                            <span>灯杆报警</span>
                            <span>金鸡道路</span>
                            <span>报警描述描述描述</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="map"></div>
            <div class="countdown">
                <img src="@/assets/images/cockpit/logo.png" alt="">
                <div class="text">距离杭州2023年亚运会<br/> 倒计时<strong>100</strong>天</div>
            </div>
            <div class="mask" v-if="mask">
                <div class="back" @click="mask = false">
                    <i class="el-icon-arrow-left"></i>
                    <span>返回</span>
                </div>
                <div class="detail">
                    <div class="lamp-post"></div>
                </div>
                <div class="label">灯杆 市心路001</div>
            </div>
        </full-screen-container>

</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import * as echarts from 'echarts'

window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}
import FullScreenContainer from '@/components/FullScreenContainer/index.vue'

let markerWater = require('@/assets/images/cockpit/marker-water.png')
let markerWellLid = require('@/assets/images/cockpit/marker-well-lid.png')
let markerLampPost = require('@/assets/images/cockpit/marker-lamp-post.png')

export default {
    components:{
        FullScreenContainer
    },
    data(){
        return {
            mask:false,
            left_top:1,
            left_bottom:1,
            map:null,
            district:null,
            icon_list:[{
                icon: require('@/assets/images/cockpit/icon-1.png'),
                text:'温度',
                value:'15-30°'
            },{
                icon: require('@/assets/images/cockpit/icon-2.png'),
                text:'湿度',
                value:'30%'
            },{
                icon: require('@/assets/images/cockpit/icon-3.png'),
                text:'降水量',
                value:'20mm'
            },{
                icon: require('@/assets/images/cockpit/icon-4.png'),
                text:'气压',
                value:'1.1pa'
            },{
                icon: require('@/assets/images/cockpit/icon-5.png'),
                text:'南风',
                value:'1级'
            },{
                icon: require('@/assets/images/cockpit/icon-6.png'),
                text:'空气质量',
                value:'优'
            }],
            video_list:[{
                text:'长河道路',
                children:[{
                    text:'视频监控点01'
                },{
                    text:'视频监控点02'
                },{
                    text:'视频监控点03'
                }]
            },{
                text:'长河道路',
                children:[{
                    text:'视频监控点01'
                },{
                    text:'视频监控点02'
                },{
                    text:'视频监控点03'
                }]
            },{
                text:'长河道路',
                children:[{
                    text:'视频监控点01'
                },{
                    text:'视频监控点02'
                },{
                    text:'视频监控点03'
                }]
            },{
                text:'长河道路',
                children:[{
                    text:'视频监控点01'
                },{
                    text:'视频监控点02'
                },{
                    text:'视频监控点03'
                }]
            },{
                text:'长河道路',
                children:[{
                    text:'视频监控点01'
                },{
                    text:'视频监控点02'
                },{
                    text:'视频监控点03'
                }]
            }],
            chart:null,
            chart3:null,
            monitor_tab_current:1,
            monitor_tab_list:[{
                text:'全部',
                value:1
            },{
                text:'灯杆',
                value:2
            },{
                text:'水位',
                value:3
            },{
                text:'井盖',
                value:4
            }]
        }
    },
    methods:{
        initMap(){
            AMapLoader.load({
                "key": "df32d1c57071a49dc07d45dbaad7cdbd", 
                "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.DistrictSearch','AMap.Icon','AMap.Marker','AMap.Object3DLayer','AMap.Object3D'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap) => {
                var opts = {
                    subdistrict: 0,
                    extensions: 'all',
                    level: 'city'
                };
                //利用行政区查询获取边界构建mask路径
                //也可以直接通过经纬度构建mask路径
                let waterIcon = new AMap.Icon({
                    size: new AMap.Size(82, 105),
                    image: markerWater,
                    imageSize: new AMap.Size(82, 105)
                });

                let wellLidIcon = new AMap.Icon({
                    size: new AMap.Size(82, 105),
                    image: markerWellLid,
                    imageSize: new AMap.Size(82, 105)
                });

                let lampPostIcon = new AMap.Icon({
                    size: new AMap.Size(82, 105),
                    image: markerLampPost,
                    imageSize: new AMap.Size(82, 105)
                });
                this.district = new AMap.DistrictSearch(opts);
                this.district.search('萧山区', (status, result) => {
                    var bounds = result.districtList[0].boundaries;
                    var mask = []
                    for(var i =0;i<bounds.length;i+=1){
                        console.log(bounds[i])
                        mask.push([bounds[i]])
                    }
                    this.map = new AMap.Map('map', {
                        center:[120.252635, 30.236056],
                        disableSocket:true,
                        viewMode:'3D',
                        showLabel:false,
                        labelzIndex:130,
                        pitch:40,
                        zoom:11,
                        mask,
                        mapStyle: "amap://styles/darkblue",
                        layers:[
                            new AMap.TileLayer.RoadNet({
                                rejectMapMask:true,
                                opacity:0.2
                            }),
                            new AMap.TileLayer.Satellite({
                                // rejectMapMask:true
                            })
                        ]
                    })

                    var maskerWater = new AMap.Marker({
                        position:[120.252635, 30.236056],
                        icon:waterIcon,
                       
                        map:this.map
                    }) 

                    maskerWater.on('click', (event) => {
                        console.log('marker click',event)
                        this.mask = true;
                    })

                    var maskerWellLid = new AMap.Marker({
                        position:[120.426518,30.20842],
                        icon:wellLidIcon,
                       
                        map:this.map
                    })

                    var maskerLampPost = new AMap.Marker({
                        position:[120.311161,30.184681],
                        icon:lampPostIcon,
                        map:this.map
                    })
                   

                    //添加高度面
                    var object3Dlayer = new AMap.Object3DLayer({zIndex:1});

                    this.map.add(object3Dlayer)
                    
                    var wall = new AMap.Object3D.Wall({
                        path:bounds,
                        height:-8000,
                        color:'#0088ffcc'
                    });
                    wall.transparent = true;
                    object3Dlayer.add(wall)
                    //添加描边
                    for(var i =0;i<bounds.length;i+=1){
                        new AMap.Polyline({
                            path:bounds[i],
                            strokeColor:'#99ffff',
                            strokeWeight:4,
                            map:this.map
                        })
                    }
                })
            })
        },
        initChart(){
            var el = this.$refs['chart1'];
            this.chart = echarts.init(el);
            let option = {
                color: ['#49F9D1'],
                xAxis: {
                    axisLine:{
                        lineStyle:{
                            color:'#ffffff'
                        }
                    },
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#ffffff'
                        }
                    },
                },
                series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320,1203,900,1200,920,700],
                    areaStyle: {
                        opacity: 0.2,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#49F9D1'
                            },
                            {
                                offset: 1,
                                color: 'rgba(255,255,255,0)'
                            }
                        ])
                    },
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                }]
            };

            this.chart.setOption(option)
        },
        initChart3(){
            var el = this.$refs['chart3'];
            this.chart3 = echarts.init(el);

            let option = {
                color:['#49F9D1','#32E6FA','#FFE022'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['轻度积水', '中度积水', '重度积水'],
                    right:20,
                    textStyle:{
                        color:'#ffffff'
                    }
                },
                grid:{
                    bottom:35,
                    right:30
                },

                xAxis: [
                    {
                        type: 'category',
                        axisLine:{
                            lineStyle:{
                                color:'#ffffff'
                            }
                        },
                        axisTick: { show: false },
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#ffffff'
                            }
                        },
                    }
                ],
                series: [
                    {
                        name: '轻度积水',
                        type: 'bar',
                        data: [320, 332, 301, 334, 390, 400, 270]
                    },
                    {
                        name: '中度积水',
                        type: 'bar',
                        data: [220, 182, 191, 234, 290, 200, 100]
                    },
                    {
                        name: '重度积水',
                        type: 'bar',
                        data: [150, 232, 201, 154, 190, 150, 140]
                    }
                ]
            };
            this.chart3.setOption(option)

        }
    },
    mounted(){
        this.initMap();
        setTimeout(() => {
            this.initChart()
            this.initChart3()

        }, 1000);
    }
}
</script>
<style lang="scss">
.cockpit-dashboard{
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 1920px;
    min-height: 1080px;
    background-image: url('../../../assets/images/cockpit/bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    background-color: #0b232f;

    .mask{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: linear-gradient(270deg, #0C1626 0%, rgba(17,28,48,0.82) 48%, #09101D 100%);
        z-index: 9999;

        .back{
            position: absolute;
            left: 64px;
            top: 66px;
            color: #E5F6FF;
        }

        .detail{
            width: 1218px;
            height: 609px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-image: url('../../../assets/images/cockpit/detail-bg.png');
            background-size: 100% 100%;

            .lamp-post{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 221px;
                height: 684px;
                background-image: url('../../../assets/images/cockpit/lamp-post-bg.png');
                background-size: 100% 100%;
            }
        }

        .label{
            position: absolute;
            left: 50%;
            bottom: 55px;
            transform: translateX(-50%);
            width: 734px;
            height: 73px;
           
            display: flex;
            justify-content: center;
            line-height: 60px;
            font-size: 32px;
            color: #FFFFFF;
            background-image: url('../../../assets/images/cockpit/label-bg.png');
            background-size: 100% 100%;
        }
    }

    #map{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
    }

    .countdown{
        position: absolute;
        right: 510px;
        top: 126px;
        width: 329px;
        height: 82px;
        background-image: url('../../../assets/images/cockpit/countdown-bg.png');
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 5px 4px;
        img{
            width: 68px;
            height: 68px;
            margin-right: 28px;
        }

        .text{
            font-size: 18px;
            color: #fff;

            strong{
                font-size: 28px;
                color: #73B0FF;
                margin-right: 2px;
            }
        }
    }

    .header{
        height: 158px;
        background-image: url('../../../assets/images/cockpit/header.png');
        background-size: 100% 100%;
        background-position-y: -1px;
        display: flex;
        position: relative;

        .left{
            width: 500px;
            height: 54px;
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 400;
            box-sizing: border-box;
            padding-left: 23px;

            .blue{
                color: #5DAEFF;
                margin-right: 18px;
            }

            .white{
                color: #fff;
            }
            
        }

        .title{
            position: absolute;
            top:20px;
            left: 50%;
            transform: translateX(-50%);
            width: 660px;
            height: 44px;
            font-size: 44px;
            font-family: YouSheBiaoTiHei;
            color: #1FD4BE;
            line-height: 44px;
            background: linear-gradient(180deg, #EEEEEE 0%, #96CBFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .right{
            height: 54px;
            display: flex;
            align-items: center;
            margin-left: auto;
            margin-right: 36px;
            font-size: 18px;
            font-weight: 400;
            color: #fff;
        }
       
    }

    .left-wrap{
        position: absolute;
        top: 72px;
        left: 18px;
        width: 468px;
        z-index: 10;
        background: linear-gradient(264deg, rgba(0,0,0,0.12) 0%, rgba(7,7,7,0.27) 100%);
        
        .tab-list{
            position: absolute;
            top: 0;
            right: -62px;
            width: 60px;
            height: 342px;

            .tab-item{
                width: 60px;
                height: 171px;
                background-image: url('../../../assets/images/cockpit/tab.png');
                background-size: 100% 100%;
                display: flex;
                align-items: center;

                &.active{
                    background-image: url('../../../assets/images/cockpit/tab-active.png');

                }

                .text{
                    width: 22px;
                    line-height: 22px;
                    margin-left: 9px;
                    font-size: 16px;
                    color: #fff;
                    line-height: 18px;
                    font-weight: 500;
                }
            }
        }

        .first-panel{
            box-sizing: border-box;

            .top{
                width: 100%;
                height: 256px;
                display: flex;

                .long-box{
                    width: 149px;
                    height: 256px;
                    background-image: url('../../../assets/images/cockpit/box-long.png');
                    background-size: 100% 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .total{
                        width: 136px;
                        height: 95px;
                        background-image: url('../../../assets/images/cockpit/num-bg.png');
                        background-size: 100% 100%;
                        margin-top: 42px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 17px;

                        .label{
                            font-size: 12px;
                            font-weight: 500;
                            color: #FFFFFF;
                            margin-top: 7px;
                        }

                        .num{
                            font-size: 24px;
                            font-weight: bold;
                            color: #EBFAFF;
                            line-height: 32px;
                        }
                    }

                    .row{
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;

                        .label{
                            font-size: 16px;
                            font-weight: 400;
                            color: rgba(235,250,255,0.46);
                            line-height: 16px;
                            margin-right: 9px;
                        }

                        .num{
                            font-size: 24px;
                            font-weight: bold;
                            color: #EBFAFF;
                            line-height: 24px;
                        }
                    }
                }

                .right-list{
                    width: 0;
                    flex: 1;
                    display: flex;
                    flex-wrap: wrap;
                }
            }

            .bottom{
                margin-top: 8px;
                display: flex;
                flex-wrap: wrap;
                .box{
                    margin-left: 0;
                    margin-right: 8px;
                    margin-bottom: 8px;

                    &:nth-child(3n){
                        margin-right: 0;
                    }
                }
            }
        }

        .chart{
            position: relative;
            width: 100%;
            height: 330px;

            .char-wrap{
                width: 100%;
                height: 100%;
                display: flex;
            }
        }

    }

    .right-wrap{
        position: absolute;
        right: 19px;
        top: 71px;
        z-index: 99;
        width: 462px;


        .weather-box{
            width: 100%;
            height: 439px;
            background: linear-gradient(122deg, rgba(0,0,0,0.65) 0%, rgba(7,7,7,0.35) 100%);
            box-sizing: border-box;
            padding: 18px 14px 16px 14px;

            .weather-box-header{
                background-image: url('../../../assets/images/cockpit/weather-header-bg.png');
                background-size: 100% 100%;
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;

                .weather-icon{
                    width: 30px;
                    height: 30px;
                    margin-left: 25px;
                }

                .temperature{
                    font-size: 28px;
                    font-weight: 500;
                    color: #00A5FC;
                    line-height: 28px;
                    margin-left: 8px;
                    margin-right: auto;
                }

                .tip-icon{
                    width: 30px;
                    height: 31px;
                    margin-right: 7px;
                }

                .tip-text{
                    font-size: 18px;
                    font-weight: 400;
                    color: #F19E2E;
                    margin-right: 27px;
                }

            }

            .icon-list{
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
                padding: 0 20px;


                .icon-item{
                    width: 33.3333%;
                    height: 52px;
                    margin-top: 12px;
                    display: flex;

                    .icon{
                        width: 52px;
                        height: 52px;
                        margin-right: 8px;
                    }

                    .icon-content{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;

                        .text{
                            font-size: 14px;
                            font-weight: 400;
                            color: #FFFFFF;
                            line-height: 20px;
                        }

                        .value{
                            font-size: 18px;
                            font-weight: 500;
                            color: #FFFFFF;
                            line-height: 20px;
                        }
                    }
                }
            }

            .video-wrap{
                margin-top: 15px;
                width: 100%;
                height: 173px;
                display: flex;

                .video{
                    width: 230px;
                    height: 100%;
                    margin-right: 7px;
                }

                .video-list{
                    flex: 1;
                    width: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .search-input{
                        width: 100%;
                        height: 28px;
                        display: flex;
                        box-sizing: border-box;
                        background: linear-gradient(115deg, rgba(#0B4573, 0.53) 0%, rgba(#08306A, 0.53) 100%);
                        border-radius: 4px;
                        border: 1px solid rgba(49, 144, 221, 1);
                        display: flex;
                        align-items: center;
                        padding: 0 10px;

                        input{
                            width: 0;
                            flex: 1;
                            background-color: transparent;
                            border: none;
                            outline: none;
                            color: #fff;

                            &:focus{
                                outline: none;
                            }
                        }

                        img{
                            width: 16px;
                            height: 16px;
                        }
                    }

                    .video-scroll{
                        flex: 1;
                        height: 0;
                        overflow-y: scroll;

                        &::-webkit-scrollbar{
                            width:3px;
                            -webkit-appearance: none;
                            height:4px;
                            background-color: #d8d8d8;
                        }

                        .video-item{
                            width: 100%;
                            min-height: 28px;
                            display: flex;
                            align-items: center;
                            font-size: 12px;
                            font-weight: 400;
                            color: #8B98B7;
                            line-height: 12px;
                        }
                    }
                }
            }
        }

        .hydrops-box{
            margin-top: 14px;
            width: 100%;
            height: 240px;
            background: linear-gradient(264deg, rgba(0,0,0,0.48) 0%, rgba(7,7,7,0.55) 100%);
            overflow: hidden;
            display: flex;
            flex-direction: column;

            #chart3{
                flex: 1;
                height: 0;
            }
        }

        .monitor-box{
            margin-top: 14px;
            width: 100%;
            height: 286px;
            background: linear-gradient(264deg, rgba(0,0,0,0.48) 0%, rgba(7,7,7,0.55) 100%);
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .tab-wrap{
                width: 100%;
                box-sizing: border-box;
                margin-top: 16px;
                height: 32px;
                padding: 0 16px;
                display: flex;

                .tab{
                    flex: 1;
                    background-color: #102244;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #105EB7;
                    font-size: 16px;

                    &.active{
                        background: linear-gradient(107deg, #29B5FD 0%, #2279FE 100%);
                        color: #fff;
                    }
                }
            }

            .tab-content{
                flex: 1;
                height: 0;
                box-sizing: border-box;
                padding: 10px 6px 7px 6px;
            }

            .static-wrap{
                width: 100%;
                height: 94px;
                display: flex;
                margin-bottom: 17px;

                .col{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .label{
                        margin-top: 35px;
                        font-size: 12px;
                        color: #379AFF;
                    }

                    .val{
                        margin-top: 8px;
                        font-size: 24px;
                        font-weight: bold;
                        color: #379AFF;
                        line-height: 24px;
                    }

                    &.orange{
                        .label{
                            color: #EDB158;
                        }

                        .val{
                            color: #EDB158;
                        }
                    }
                }

                .prev,
                .next{
                    width: 16px;
                    height: 37px;
                    margin-top: 37px;
                }

                .prev{
                    margin-right: 23px;
                }

                .next{
                    margin-left: 23px;
                }

                .bg{
                    width: 125px;
                    height: 94px;
                    background-image: url('../../../assets/images/cockpit/icon-num-bg.png');
                    background-size: 100% 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .label{
                        font-size: 12px;
                        font-weight: 500;
                        color: #FFFFFF;
                        line-height: 17px;
                        margin-top: 9px;
                    }

                    .val{
                        font-size: 24px;
                        font-weight: bold;
                        color: #EBFAFF;
                        line-height: 32px;

                    }
                }
            }

            .news-item{
                width: 100%;
                height: 34px;
                background-color: rgba(#fff, 0.05);
                margin-bottom: 4px;
                color: #fff;
                font-size: 12px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 0 6px;

                :nth-child(1){
                    margin-right: 5px;
                }

                :nth-child(2){
                    margin-right: 12px;
                }

                :nth-child(3),
                :nth-child(4){
                    margin-right: 20px;
                }

                :nth-child(5){
                    flex: 1;
                    width: 0;
                }
            }
        }
    }

    .box{
        width: 149px;
        height: 124px;
        margin-left: 8px;
        background-image: url('../../../assets/images/cockpit/box.png');
        background-size: 100% 100%;

        .box-content{
            margin-top: 29px;
            display: flex;

            .text-wrap{
                width: 0;
                flex: 1;
                margin-left: 19px;
                display: flex;
                flex-direction: column;
                align-items: center;

                .label{
                    font-size: 16px;
                    color: #fff;
                    line-height: 16px;

                    &.mt{
                        margin-top: 8px;
                        text-align: center;
                    }
                }

                .num{
                    font-size: 28px;
                    font-weight: bold;
                    color: #EBFAFF;
                    line-height: 28px;
                    text-align: center;
                }
            }

            .chart-wrap{
                width: 66px;
                height: 66px;
                margin-right: 11px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .statistic{
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 30px;

            .item{
                display: flex;
                align-items: center;

                .dot{
                    height: 6px;
                    width: 6px;
                    border-radius: 50%;

                    &.green{
                        background-color: #59E513;
                    }

                    &.red{
                        background-color: #FB0806;
                    }
                }

                .num{
                    font-size: 14px;
                    font-weight: bold;
                    color: #EBFAFF;
                    line-height: 14px;
                    margin-left: 4px;
                }
            }
        }
    }

    .section-header{
        width: 100%;
        height: 24px;
        margin-top: 15px;
        display: flex;
        align-items: center;

        .circle{
            width: 24px;
            height: 24px;
            margin-right: 6px;
        }

        .text{
            font-size: 18px;
            font-weight: 400;
            color: #DBFCFF;
            line-height: 18px;
        }

        .line{
            margin-left: 13px;
            flex: 1;
            width: 0;
            height: 1px;
            background: linear-gradient(122deg, rgba(0,0,0,0.65) 0%, rgba(7,7,7,0.35) 100%);
        }

        .arrow{
            width: 15px;
            height: 9px;
            margin-left: 4px;
        }
    }
}
</style>